import React from 'react';
import { View, Text } from 'react-native';

export { DashboardScreen } from './DashboardScreen';
export { TransactionsScreen } from './TransactionsScreen';
export { AddTransactionScreen } from './AddTransactionScreen';
export { DebtsScreen } from './DebtsScreen';
export { AddDebtScreen } from './AddDebtScreen';

const Screen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name} Screen</Text>
    </View>
);

export const StatsScreen = () => <Screen name="Statistics" />;
export const SettingsScreen = () => <Screen name="Settings" />;
