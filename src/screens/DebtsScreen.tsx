import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, FAB, IconButton, Icon, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store';
import { formatCurrency, formatShortDate } from '../utils/format';
import { Debt } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const DebtsScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { debts, fetchDebts, toggleDebtStatus, deleteDebt } = useStore();

    useEffect(() => {
        fetchDebts();
    }, []);

    // Sadece borçları göster (type === 'debt')
    const debtItems = debts.filter(d => d.type === 'debt');

    const renderItem = ({ item }: { item: Debt }) => {
        const isPaid = item.isPaid === 1;
        const color = (theme.colors as any).customExpense;

        return (
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
                <TouchableOpacity style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                            <Icon source="alert-circle" size={24} color={color} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface, textDecorationLine: isPaid ? 'line-through' : 'none' }}>
                                {item.personName}
                            </Text>
                            {item.description && (
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {item.description}
                                </Text>
                            )}
                            {item.dueDate && (
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    Vade: {formatShortDate(item.dueDate)}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleMedium" style={{ color: color, fontWeight: 'bold', textDecorationLine: isPaid ? 'line-through' : 'none' }}>
                                {formatCurrency(item.amount)}
                            </Text>
                            <Text variant="labelSmall" style={{ color: isPaid ? theme.colors.primary : theme.colors.error }}>
                                {isPaid ? 'Ödendi' : 'Bekliyor'}
                            </Text>
                        </View>
                        <View style={styles.actions}>
                            <IconButton
                                icon={isPaid ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                                iconColor={isPaid ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                onPress={() => toggleDebtStatus(item.id, item.isPaid)}
                            />
                            <IconButton
                                icon="delete"
                                iconColor={theme.colors.error}
                                onPress={() => deleteDebt(item.id)}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Surface>
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Borçlarım</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Ödemeniz gereken borçlar
                </Text>
            </View>

            <FlatList
                data={debtItems}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon source="check-circle" size={64} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
                            Henüz borç yok
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                            + butonuna basarak ekleyin
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Borç Ekle"
                style={[styles.fab, { bottom: insets.bottom + 16, backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => (navigation as any).navigate('AddDebt')}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
    },
});
