
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Switch, useTheme, Divider, ActivityIndicator, Text, Button } from 'react-native-paper';
import { useStore } from '../store';
import { exportToExcel } from '../utils/export';
import i18n from '../i18n';
import * as Notifications from 'expo-notifications';
import { useToast } from '../context/ToastContext';

export const SettingsScreen = () => {
    const theme = useTheme();
    // FIX: Separate selectors to avoid re-render loop
    const transactions = useStore((state) => state.transactions);
    const debts = useStore((state) => state.debts);
    const fetchDebts = useStore((state) => state.fetchDebts);
    const fetchTransactions = useStore((state) => state.fetchTransactions);
    const themeMode = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);
    const [exporting, setExporting] = useState(false);

    const { showToast } = useToast();

    const handleExport = async () => {
        setExporting(true);
        try {
            // Ensure we have latest data
            await fetchTransactions();
            await fetchDebts();

            // Get fresh data directly from store state to avoid closure staleness
            const state = useStore.getState();
            await exportToExcel(state.transactions, state.debts);

            showToast(i18n.t('exportSuccessMessage'), 'success');
        } catch (error: any) {
            showToast(error.message || i18n.t('exportErrorMessage'), 'error');
        } finally {
            setExporting(false);
        }
    };

    const handleNotificationToggle = async (value: boolean) => {
        // ... (lines 43-61 unchanged)
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                <List.Subheader>{i18n.t('dataManagement')}</List.Subheader>
                <View style={styles.sectionPadding}>
                    <Button
                        mode="contained"
                        accessibilityLabel="Excel Olarak İndir"
                        onPress={handleExport}
                        loading={exporting}
                        icon="microsoft-excel"
                        style={styles.buttonSpacing}
                    >
                        {i18n.t('exportExcel')}
                    </Button>
                    <Text variant="bodySmall" style={[styles.description, { color: theme.colors.outline }]}>
                        {i18n.t('exportExcelDesc')}
                    </Text>

                    <Divider style={{ marginVertical: 12 }} />

                    <Button
                        mode="contained"
                        onPress={async () => {
                            try {
                                const state = useStore.getState();
                                await import('../utils/export').then(m => m.exportBackup(state.transactions, state.debts, state.reminders));
                                showToast(i18n.t('backupSuccess'), 'success');
                            } catch (error: any) {
                                showToast(error.message || 'Yedek oluşturma hatası', 'error');
                            }
                        }}
                        icon="database-export"
                        style={styles.buttonSpacing}
                    >
                        {i18n.t('createBackup')}
                    </Button>

                    <Button
                        mode="contained"
                        onPress={async () => {
                            try {
                                const m = await import('../utils/export');
                                const data = await m.importBackup();
                                if (data) {
                                    const { Repository } = require('../database/repository');
                                    await Repository.clearAllData();
                                    await Repository.bulkInsertTransactions(data.transactions);
                                    await Repository.bulkInsertDebts(data.debts);
                                    await Repository.bulkInsertReminders(data.reminders);
                                    useStore.getState().refreshDashboard();
                                    showToast(i18n.t('restoreSuccess'), 'success');
                                }
                            } catch (error: any) {
                                showToast(error.message || 'Geri yükleme hatası', 'error');
                            }
                        }}
                        icon="database-import"
                        style={styles.buttonSpacing}
                    >
                        {i18n.t('restoreBackup')}
                    </Button>
                </View>
            </List.Section>
            <Divider />

            <List.Section>
                <List.Subheader>{i18n.t('general')}</List.Subheader>
                <List.Item
                    title={i18n.t('darkMode')}
                    description={i18n.t('darkModeDesc')}
                    left={props => <List.Icon {...props} icon="theme-light-dark" />}
                    right={() => <Switch value={themeMode === 'dark'} onValueChange={(value) => setTheme(value ? 'dark' : 'light')} color={theme.colors.primary} />}
                />
                <List.Item
                    title={i18n.t('notifications')}
                    left={props => <List.Icon {...props} icon="bell" />}
                    right={() => <Switch value={true} onValueChange={handleNotificationToggle} />}
                />
            </List.Section>

            <List.Section>
                <List.Subheader>{i18n.t('aboutApp')}</List.Subheader>
                <List.Item
                    title={i18n.t('version')}
                    description="1.0.0"
                    left={props => <List.Icon {...props} icon="information" />}
                />
            </List.Section>

            <View style={[styles.footer, { paddingBottom: 20 + 50 }]}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {i18n.t('footerLove')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 'auto',
    },
    sectionPadding: {
        padding: 16,
    },
    description: {
        marginTop: 8,
        marginBottom: 8,
    },
    buttonSpacing: {
        marginBottom: 8,
    }
});
