import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Repository } from '../database/repository';
import { format } from 'date-fns';

export const exportToExcel = async () => {
    try {
        const transactions = await Repository.getTransactions();
        const debts = await Repository.getDebts();
        const installments = await Repository.getInstallments();

        const wb = XLSX.utils.book_new();

        // Transactions Sheet
        const wsTransactions = XLSX.utils.json_to_sheet(transactions.map(t => ({
            ID: t.id,
            Tarih: t.date,
            Tip: t.type === 'income' ? 'Gelir' : 'Gider',
            Kategori: t.category,
            Tutar: t.amount,
            Açıklama: t.description
        })));
        XLSX.utils.book_append_sheet(wb, wsTransactions, "İşlemler");

        // Debts Sheet
        const wsDebts = XLSX.utils.json_to_sheet(debts.map(d => ({
            ID: d.id,
            Kişi: d.personName,
            Tip: d.type === 'debt' ? 'Borç' : 'Alacak',
            Tutar: d.amount,
            Vade: d.dueDate,
            Durum: d.isPaid ? 'Ödendi' : 'Bekliyor',
            Açıklama: d.description
        })));
        XLSX.utils.book_append_sheet(wb, wsDebts, "Borçlar");

        // Installments Sheet
        const wsInstallments = XLSX.utils.json_to_sheet(installments.map(i => ({
            ID: i.id,
            Açıklama: i.description,
            Başlangıç: i.startDate,
            ToplamTutar: i.totalAmount,
            TaksitSayısı: i.totalMonths,
            KalanTaksit: i.remainingMonths
        })));
        XLSX.utils.book_append_sheet(wb, wsInstallments, "Taksitler");

        const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
        const filename = FileSystem.documentDirectory + `FinansYedek_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;

        await FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filename);
        } else {
            console.log('Sharing not available');
        }
    } catch (error) {
        console.error('Export error:', error);
        throw error;
    }
};
