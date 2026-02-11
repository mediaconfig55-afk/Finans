import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils/format';

interface SummaryCardProps {
    title: string;
    amount: number;
    type: 'income' | 'expense' | 'balance';
    icon: string;
}

export const SummaryCard = ({ title, amount, type, icon }: SummaryCardProps) => {
    const theme = useTheme();

    const getGradientColors = () => {
        switch (type) {
            case 'income': return ['rgba(46, 125, 50, 0.2)', 'rgba(0, 230, 118, 0.1)'];
            case 'expense': return ['rgba(198, 40, 40, 0.2)', 'rgba(255, 23, 68, 0.1)'];
            case 'balance': return ['rgba(101, 31, 255, 0.3)', 'rgba(101, 31, 255, 0.1)']; // Purple tint
            default: return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'income': return '#00E676';
            case 'expense': return '#FF1744';
            default: return theme.colors.primary;
        }
    };

    return (
        <LinearGradient
            colors={getGradientColors() as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderColor: getIconColor() + '40' }]}
        >
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
                    <Icon source={icon} size={24} color={getIconColor()} />
                </View>
                <View>
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{title}</Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                        {formatCurrency(amount)}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 6,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
    }
});
