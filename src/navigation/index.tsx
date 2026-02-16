import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../i18n';
import { useAppTheme } from '../hooks/useAppTheme';

import {
    DashboardScreen,
    TransactionsScreen,
    AddTransactionScreen,
    DebtsScreen,
    AddDebtScreen,
    StatsScreen,
    SettingsScreen,
    TransactionDetailScreen,
    RemindersScreen
} from '../screens';
import { Transaction } from '../types';

export type RootStackParamList = {
    Root: undefined;
    AddTransaction: undefined;
    AddDebt: undefined;
    Settings: undefined;
    TransactionDetail: { transaction: Transaction };
    Reminders: undefined;
    TransactionsTab: undefined; // Accessible via Tab but also via Stack as a screen inside Root
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


import { TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';

function CustomTabBar({ state, descriptors, navigation }: any) {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            position: 'absolute',
            bottom: Math.max(insets.bottom, 20),
            left: 20,
            right: 20,
            height: 70,
            borderRadius: 35,
            overflow: 'hidden', // Ensure gradient stays within bounds
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 15,
        }}>
            <LinearGradient
                colors={[theme.colors.tabBarBg, theme.colors.tabBarBg]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    height: '100%',
                    borderWidth: 1,
                    borderColor: theme.colors.tabBarBorder,
                    borderRadius: 35,
                }}
            >
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let iconName = "";
                    let activeColor = "";
                    let tabLabel = "";

                    // Define icons, colors and labels based on route name
                    switch (route.name) {
                        case 'DashboardTab':
                            iconName = isFocused ? "view-dashboard" : "view-dashboard-outline";
                            activeColor = theme.colors.tabDashboard;
                            tabLabel = i18n.t('dashboard', { defaultValue: 'Ana Sayfa' });
                            break;
                        case 'TransactionsTab':
                            iconName = isFocused ? "swap-horizontal-bold" : "swap-horizontal";
                            activeColor = theme.colors.tabTransactions;
                            tabLabel = i18n.t('transactions', { defaultValue: 'İşlemler' });
                            break;
                        case 'StatsTab':
                            iconName = isFocused ? "finance" : "chart-timeline-variant";
                            activeColor = theme.colors.tabStats;
                            tabLabel = i18n.t('statistics', { defaultValue: 'İstatistik' });
                            break;
                        case 'DebtsTab':
                            iconName = isFocused ? "credit-card-plus" : "credit-card-outline";
                            activeColor = theme.colors.tabDebts;
                            tabLabel = i18n.t('debts', { defaultValue: 'Borçlar' });
                            break;
                        default:
                            iconName = "circle";
                            activeColor = theme.colors.primary;
                            tabLabel = '';
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                paddingTop: 10,
                            }}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: isFocused ? `${activeColor}25` : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: [{ scale: isFocused ? 1.05 : 1 }], // Micro-animation
                            }}>
                                <Icon
                                    source={iconName}
                                    color={isFocused ? activeColor : theme.colors.tabBarInactive}
                                    size={22}
                                />
                            </View>
                            <Text style={{
                                fontSize: 10,
                                marginTop: 2,
                                color: isFocused ? activeColor : theme.colors.tabBarInactive,
                                fontWeight: isFocused ? '600' : '400',
                            }}>{tabLabel}</Text>
                        </TouchableOpacity>
                    );
                })}
            </LinearGradient>
        </View>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="DashboardTab" component={DashboardScreen} />
            <Tab.Screen name="TransactionsTab" component={TransactionsScreen} />
            <Tab.Screen name="StatsTab" component={StatsScreen} />
            <Tab.Screen name="DebtsTab" component={DebtsScreen} />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    const theme = useAppTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.onBackground,
                headerTitleStyle: { fontWeight: 'bold' },
                animation: 'slide_from_right', // Default animation
            }}
        >
            <Stack.Screen
                name="Root"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{
                    title: i18n.t('addTransaction'),
                    presentation: 'modal',
                    animation: 'slide_from_bottom'
                }}
            />
            <Stack.Screen
                name="AddDebt"
                component={AddDebtScreen}
                options={{
                    title: i18n.t('addDebt'),
                    presentation: 'modal',
                    animation: 'slide_from_bottom'
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: i18n.t('settings') }}
            />
            <Stack.Screen
                name="TransactionDetail"
                component={TransactionDetailScreen}
                options={{ title: i18n.t('transactionDetail') }}
            />
            <Stack.Screen
                name="Reminders"
                component={RemindersScreen}
                options={{ title: i18n.t('reminders') }}
            />
        </Stack.Navigator>
    );
}
