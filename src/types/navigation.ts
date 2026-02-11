import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Transaction } from './index';

export type RootStackParamList = {
    Root: undefined;
    AddTransaction: undefined;
    AddDebt: undefined;
    Settings: undefined;
    TransactionDetail: { transaction: Transaction };
    Reminders: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
