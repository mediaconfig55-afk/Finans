import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Card, Avatar, ProgressBar } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { useFocusEffect } from '@react-navigation/native';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';
import { ScreenWrapper } from '../components/ScreenWrapper';
import i18n from '../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export const StatsScreen = () => {
    const theme = useTheme();
    const { transactions, kpi, refreshDashboard } = useStore();

    useFocusEffect(
        React.useCallback(() => {
            refreshDashboard();
        }, [])
    );

    const { totalIncome, totalExpense } = kpi;
    const netBalance = totalIncome - totalExpense;

    // --- Chart Data Preparation ---
    const pieData = [
        { value: totalIncome, color: '#4CAF50', text: '' },
        { value: totalExpense, color: '#F44336', text: '' },
    ];

    // Check if we have data
    const hasData = totalIncome > 0 || totalExpense > 0;

    // Top Expenses Category
    const categorySpending = useMemo(() => {
        const spending: Record<string, number> = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                spending[t.category] = (spending[t.category] || 0) + t.amount;
            });

        return Object.entries(spending)
            .sort((a, b) => b[1] - a[1]) // Sort by amount desc
            .slice(0, 5) // Top 5
            .map(([cat, amount]) => ({
                category: cat,
                amount,
                color: theme.colors.primary,
                percentage: totalExpense > 0 ? amount / totalExpense : 0
            }));
    }, [transactions, totalExpense]);


    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text variant="headlineMedium" style={styles.headerTitle}>{i18n.t('financialStatus')}</Text>

                {/* Summary Cards Row */}
                <View style={styles.summaryRow}>
                    <Card style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}>
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Icon size={32} icon="arrow-down-circle" style={{ backgroundColor: '#4CAF50' }} />
                            <Text variant="labelMedium" style={{ marginTop: 8, color: '#2E7D32' }}>{i18n.t('totalIncome')}</Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#1B5E20' }}>
                                {formatCurrency(totalIncome)}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Icon size={32} icon="arrow-up-circle" style={{ backgroundColor: '#F44336' }} />
                            <Text variant="labelMedium" style={{ marginTop: 8, color: '#C62828' }}>{i18n.t('totalExpense')}</Text>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#B71C1C' }}>
                                {formatCurrency(totalExpense)}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Balance Card */}
                <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Card.Content>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>{i18n.t('netBalance')}</Text>
                                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer }}>
                                    {formatCurrency(netBalance)}
                                </Text>
                            </View>
                            <MaterialCommunityIcons
                                name={netBalance >= 0 ? "scale-balance" : "alert-circle-outline"}
                                size={40}
                                color={theme.colors.onPrimaryContainer}
                            />
                        </View>
                    </Card.Content>
                </Card>

                {/* Charts Section */}
                <View style={styles.sectionContainer}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Gelir / Gider Dengesi</Text>
                    {hasData ? (
                        <View style={styles.chartWrapper}>
                            <PieChart
                                data={pieData}
                                donut
                                radius={80}
                                innerRadius={60}
                                centerLabelComponent={() => (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text variant="labelSmall" style={{ color: 'gray' }}>Toplam</Text>
                                        <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>
                                            {formatCurrency(totalIncome + totalExpense)}
                                        </Text>
                                    </View>
                                )}
                            />
                            {/* Legend */}
                            <View style={styles.legendContainer}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                                    <Text variant="bodyMedium">{i18n.t('income')} ({totalIncome > 0 ? Math.round((totalIncome / (totalIncome + totalExpense) * 100)) : 0}%)</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                                    <Text variant="bodyMedium">{i18n.t('expense')} ({totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense) * 100)) : 0}%)</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <Text style={{ textAlign: 'center', margin: 20, color: 'gray' }}>Henüz veri yok.</Text>
                    )}
                </View>

                {/* Top Expenses List */}
                <View style={styles.sectionContainer}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>En Çok Harcama Yaptığın Kategoriler</Text>
                    {categorySpending.length > 0 ? (
                        categorySpending.map((item, index) => (
                            <View key={index} style={styles.categoryRow}>
                                <View style={styles.categoryInfo}>
                                    <Text variant="bodyLarge" style={{ fontWeight: '500' }}>{i18n.t(item.category)}</Text>
                                    <Text variant="bodyMedium">{formatCurrency(item.amount)}</Text>
                                </View>
                                <ProgressBar progress={item.percentage} color={theme.colors.error} style={{ height: 6, borderRadius: 3 }} />
                            </View>
                        ))
                    ) : (
                        <Text style={{ padding: 16, color: 'gray' }}>Harcama verisi bulunamadı.</Text>
                    )}
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    headerTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 16,
    },
    cardContent: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    balanceCard: {
        marginBottom: 24,
        borderRadius: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionContainer: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        fontSize: 18,
    },
    chartWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    legendContainer: {
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    categoryRow: {
        marginBottom: 16,
    },
    categoryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    }
});
