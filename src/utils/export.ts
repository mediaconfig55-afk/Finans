import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import { Transaction, Debt, Reminder } from '../types';
import { formatShortDate } from './format';
import { Platform } from 'react-native';

// Type casting to avoid linter issues if types are missing in legacy
const FS = FileSystem as any;
const SAF = FS.StorageAccessFramework;

// Helper to save file securely using SAF (Android) or Share (iOS)
const saveFile = async (fileName: string, content: string, encoding: any, mimeType: string) => {
    try {
        if (Platform.OS === 'android') {
            // 1. Try SAF first (User selects folder) - PREFERRED
            let safSuccess = false;
            if (SAF) {
                try {
                    const permissions = await SAF.requestDirectoryPermissionsAsync();
                    if (permissions.granted) {
                        const safariUri = permissions.directoryUri;
                        // CORRECTED ARGUMENT ORDER: (parentUri, fileName, mimeType)
                        const newFileUri = await SAF.createFileAsync(safariUri, fileName, mimeType);
                        await FS.writeAsStringAsync(newFileUri, content, { encoding });
                        safSuccess = true;
                        return true;
                    } else {
                        throw new Error("Klasör seçimi iptal edildi.");
                    }
                } catch (e: any) {
                    console.log("SAF Failed/Cancelled:", e);
                    if (e.message.includes("iptal")) throw e; // Don't fallback on cancel
                }
            }

            if (safSuccess) return true;

            // 2. Fallback: Save to Cache -> Share (Works on most Androids as a standard "Open With/Save to")
            // Only reach here if SAF was skipped or crashed (not cancelled)
            const uri = FS.cacheDirectory + fileName;
            await FS.writeAsStringAsync(uri, content, { encoding });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { mimeType, dialogTitle: 'Dosyayı Kaydet' });
                return true;
            }

            throw new Error('Dosya kaydedilemedi ve paylaşılamadı.');

        } else {
            // iOS or fallback
            if (!FS.cacheDirectory) {
                throw new Error('Önbellek dizini bulunamadı.');
            }

            const uri = FS.cacheDirectory + fileName;
            await FS.writeAsStringAsync(uri, content, { encoding });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
                return true;
            } else {
                throw new Error('Paylaşım özelliği kullanılamıyor.');
            }
        }
    } catch (error) {
        throw error;
    }
};

export const exportToExcel = async (transactions: Transaction[], debts: Debt[]) => {
    try {
        const wb = XLSX.utils.book_new();

        // Transactions Sheet
        const transactionData = transactions.map(t => ({
            ID: t.id,
            Tarih: formatShortDate(t.date),
            Tip: t.type === 'income' ? 'Gelir' : 'Gider',
            Kategori: t.category,
            Tutar: t.amount,
            Aciklama: t.description || '',
        }));
        const wsTransactions = XLSX.utils.json_to_sheet(transactionData);
        XLSX.utils.book_append_sheet(wb, wsTransactions, "İşlemler");

        // Debts Sheet
        const debtData = debts.map(d => ({
            ID: d.id,
            Tip: d.type === 'receivable' ? 'Alacak' : 'Borç',
            Kisi: d.personName,
            Tutar: d.amount,
            Vade: d.dueDate ? formatShortDate(d.dueDate) : '',
            Durum: d.isPaid ? 'Ödendi' : 'Ödenmedi',
        }));
        const wsDebts = XLSX.utils.json_to_sheet(debtData);
        XLSX.utils.book_append_sheet(wb, wsDebts, "Borçlar");

        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        const fileName = `finans_rapor_${new Date().getTime()}.xlsx`;

        await saveFile(
            fileName,
            wbout,
            'base64', // STRING LITERAL FIX
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

    } catch (error) {
        console.error("Excel Export Error Details:", error);
        throw error;
    }
};

export const exportBackup = async (transactions: Transaction[], debts: Debt[], reminders: Reminder[]) => {
    try {
        const backupData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            data: {
                transactions,
                debts,
                reminders
            }
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const fileName = `finans_yedek_${new Date().getTime()}.json`;

        await saveFile(
            fileName,
            jsonString,
            'utf8', // STRING LITERAL FIX
            'application/json'
        );

    } catch (error) {
        console.error("Backup Error Details:", error);
        throw error;
    }
};

export const importBackup = async (): Promise<{ transactions: Transaction[], debts: Debt[], reminders: Reminder[] } | null> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true
        });

        if (result.canceled) {
            return null;
        }

        const fileUri = result.assets[0].uri;
        const fileContent = await FS.readAsStringAsync(fileUri, {
            encoding: 'utf8' // STRING LITERAL FIX
        });

        let backupData;
        try {
            backupData = JSON.parse(fileContent);
        } catch (e) {
            throw new Error('Dosya okunamadı. Geçerli bir JSON dosyası olduğundan emin olun.');
        }

        if (!backupData.data) {
            throw new Error('Geçersiz yedek dosyası formatı (data eksik).');
        }

        return {
            transactions: backupData.data.transactions || [],
            debts: backupData.data.debts || [],
            reminders: backupData.data.reminders || []
        };
    } catch (error) {
        console.error("Restore Error Details:", error);
        throw error;
    }
};
