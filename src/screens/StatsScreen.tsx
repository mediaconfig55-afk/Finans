import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, useTheme, SegmentedButtons, Button, Divider, Snackbar } from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';
import { Transaction } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { exportToExcel, exportBackup, importBackup } from '../utils/export';
import { Repository } from '../database/repository';

const screenWidth = Dimensions.get('window').width;

export const StatsScreen = () => {
    const theme = useTheme();
    const { transactions, debts, reminders, fetchTransactions, fetchDebts, fetchReminders, refreshDashboard } = useStore();
    const [chartMode, setChartMode] = useState<'category' | 'monthly' | 'daily'>('category');
    const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchTransactions();
        fetchDebts();
        fetchReminders();
    }, []);

    const showToast = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const handleExcelExport = async () => {
        setLoading(true);
        try {
            await exportToExcel(transactions, debts);
            showToast('Excel dosyası başarıyla oluşturuldu ✓');
        } catch (error) {
            Alert.alert('Hata', 'Excel dosyası oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackup = async () => {
        setLoading(true);
        try {
            await exportBackup(transactions, debts, reminders);
            showToast('Yedek başarıyla oluşturuldu ✓');
        } catch (error) {
            Alert.alert('Hata', 'Yedek oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        Alert.alert(
            'Veri Geri Yükleme',
            'Mevcut tüm veriler silinip yedek dosyasındaki veriler yüklenecek. Devam etmek istiyor musunuz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Devam Et',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const backupData = await importBackup();
                            if (!backupData) {
                                setLoading(false);
                                return; // User cancelled
                            }

                            // Clear all data
                            await Repository.clearAllData();

                            // Insert backup data
                            await Repository.bulkInsertTransactions(backupData.transactions);
                            await Repository.bulkInsertDebts(backupData.debts);
                            await Repository.bulkInsertReminders(backupData.reminders);

                            // Refresh UI
                            await refreshDashboard();
                            await fetchTransactions();
                            await fetchDebts();
                            await fetchReminders();

                            showToast('Veriler başarıyla geri yüklendi ✓');
                        } catch (error) {
                            Alert.alert('Hata', error instanceof Error ? error.message : 'Veriler geri yüklenirken bir hata oluştu.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    // --- Category Pie Chart Data ---
    const filteredTransactions = transactions.filter(t => t.type === selectedType);
    const categoryData = filteredTransactions.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(categoryData).map((key, index) => ({
        value: categoryData[key],
        text: '',
        color: getColor(index),
        category: key,
        amount: categoryData[key]
    })).sort((a, b) => b.value - a.value);

    // --- Monthly Bar Chart Data ---
    // Group by "Month-Year" -> { income: 0, expense: 0 }
    const monthlyData = transactions.reduce((acc, curr: Transaction) => { // Added type for curr
        const date = new Date(curr.date);
        const key = `${date.getMonth() + 1}-${date.getFullYear()}`; // "2-2024"
        if (!acc[key]) acc[key] = { income: 0, expense: 0, label: `${date.toLocaleString('tr-TR', { month: 'short' })}` };

        if (curr.type === 'income') acc[key].income += curr.amount;
        else acc[key].expense += curr.amount;

        return acc;
    }, {} as Record<string, { income: number, expense: number, label: string }>);

    const barData = Object.keys(monthlyData).map(key => ([
        {
            value: monthlyData[key].income,
            label: monthlyData[key].label,
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: (theme.colors as any).customIncome,
        },
        {
            value: monthlyData[key].expense,
            frontColor: (theme.colors as any).customExpense,
        }
    ])).flat();

    // --- Daily Bar Chart Data ---
    const { dailySpending } = useStore();
    const dailyBarData = dailySpending.map((d: { date: string, total: number }) => ({ // Added type for d
        value: d.total,
        label: formatShortDate(d.date),
        frontColor: theme.colors.error,
    })).reverse(); // Show oldest to newest in chart if needed, or keeping desc is fine but usually charts go left-right time. Let's reverse to show time progression.

    // Helper to format date for daily chart
    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    // Helper to generate consistent colors
    function getColor(index: number) {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#C9CBCF', '#E7E9ED', '#76A346', '#2E7D32'
        ];
        return colors[index % colors.length];
    }

    const renderLegend = () => {
        return pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.category}</Text>
                </View>
                <Text style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>{formatCurrency(item.amount)}</Text>
            </View>
        ));
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineSmall" style={styles.title}>Analiz</Text>

                <SegmentedButtons
                    value={chartMode}
                    onValueChange={(val: 'category' | 'monthly' | 'daily') => setChartMode(val)} // Added type for val
                    buttons={[
                        { value: 'category', label: 'Kategori' },
                        { value: 'monthly', label: 'Aylık' },
                        { value: 'daily', label: 'Günlük' },
                    ]}
                    style={styles.segment}
                />

                {chartMode === 'category' ? (
                    <>
                        <SegmentedButtons
                            value={selectedType}
                            onValueChange={(val: 'expense' | 'income') => setSelectedType(val)} // Added type for val
                            buttons={[
                                { value: 'expense', label: 'Giderler', icon: 'arrow-down', showSelectedCheck: true },
                                { value: 'income', label: 'Gelirler', icon: 'arrow-up', showSelectedCheck: true },
                            ]}
                            style={{ marginBottom: 20, width: '80%', alignSelf: 'center' }}
                            density="small"
                        />

                        {pieData.length > 0 ? (
                            <View style={styles.chartContainer}>
                                <PieChart
                                    data={pieData}
                                    donut
                                    showText
                                    textColor="black"
                                    radius={120}
                                    textSize={12}
                                    focusOnPress
                                    showValuesAsLabels={false}
                                    showTextBackground
                                    textBackgroundRadius={16}
                                />
                                <View style={styles.legendContainer}>
                                    {renderLegend()}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text>Veri bulunamadı.</Text>
                            </View>
                        )}
                    </>
                ) : chartMode === 'monthly' ? (
                    <View style={styles.chartContainer}>
                        {barData.length > 0 ? (
                            <BarChart
                                data={barData}
                                barWidth={22}
                                spacing={24}
                                roundedTop
                                roundedBottom
                                hideRules
                                xAxisThickness={0}
                                yAxisThickness={0}
                                yAxisTextStyle={{ color: 'gray' }}
                                noOfSections={3}
                                maxValue={Math.max(...barData.map(d => d.value)) * 1.2 || 1000}
                                width={screenWidth - 60}
                            />
                        ) : (
                            <Text>Veri bulunamadı.</Text>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 12, height: 12, backgroundColor: (theme.colors as any).customIncome, marginRight: 8, borderRadius: 6 }} />
                                <Text>Gelir</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 12, height: 12, backgroundColor: (theme.colors as any).customExpense, marginRight: 8, borderRadius: 6 }} />
                                <Text>Gider</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.chartContainer}>
                        <Text variant="titleMedium" style={{ marginBottom: 10 }}>Son 30 Günlük Harcamalar</Text>
                        {dailyBarData.length > 0 ? (
                            <BarChart
                                data={dailyBarData}
                                barWidth={22}
                                spacing={24}
                                roundedTop
                                roundedBottom
                                hideRules
                                xAxisThickness={0}
                                yAxisThickness={0}
                                yAxisTextStyle={{ color: 'gray' }}
                                noOfSections={3}
                                maxValue={Math.max(...dailyBarData.map(d => d.value)) * 1.2 || 1000}
                                width={screenWidth - 60}
                                isAnimated
                            />
                        ) : (
                            <Text>Veri bulunamadı.</Text>
                        )}
                    </View>
                )}

                {/* Veri Yönetimi Bölümü */}
                <Divider style={{ marginVertical: 24 }} />
                <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                    Veri Yönetimi
                </Text>
                <View style={styles.dataManagementContainer}>
                    <Button
                        mode="contained"
                        icon="database-export"
                        onPress={handleBackup}
                        loading={loading}
                        style={styles.dataButton}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Yedek Oluştur (JSON)
                    </Button>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 16 }}>
                        Tüm verilerinizi JSON formatında dışa aktarın
                    </Text>

                    <Button
                        mode="contained"
                        icon="database-import"
                        onPress={handleRestore}
                        loading={loading}
                        style={styles.dataButton}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Yedek Geri Yükle
                    </Button>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 16 }}>
                        JSON dosyasından verilerinizi içe aktarın
                    </Text>

                    <Button
                        mode="contained"
                        icon="microsoft-excel"
                        onPress={handleExcelExport}
                        loading={loading}
                        style={styles.dataButton}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Excel Olarak İndir
                    </Button>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        Verilerinizi .xlsx formatında görüntüleyin
                    </Text>
                </View>
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
                action={{
                    label: 'Tamam',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 80,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    segment: {
        marginBottom: 24,
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 16,
        borderRadius: 16,
    },
    legendContainer: {
        marginTop: 24,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        // flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    dataManagementContainer: {
        marginBottom: 32,
    },
    dataButton: {
        marginBottom: 8,
    }
});
