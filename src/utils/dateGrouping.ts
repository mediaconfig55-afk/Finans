import { Transaction } from '../types';

export const groupTransactionsByDate = (transactions: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const groups: { [key: string]: Transaction[] } = {
        'Bugün': [],
        'Dün': [],
        'Bu Hafta': [],
        'Bu Ay': [],
        'Önceki': []
    };

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionDay = new Date(
            transactionDate.getFullYear(),
            transactionDate.getMonth(),
            transactionDate.getDate()
        );

        if (transactionDay.getTime() === today.getTime()) {
            groups['Bugün'].push(transaction);
        } else if (transactionDay.getTime() === yesterday.getTime()) {
            groups['Dün'].push(transaction);
        } else if (transactionDay >= thisWeekStart && transactionDay < today) {
            groups['Bu Hafta'].push(transaction);
        } else if (transactionDay >= thisMonthStart && transactionDay < thisWeekStart) {
            groups['Bu Ay'].push(transaction);
        } else {
            groups['Önceki'].push(transaction);
        }
    });

    // Filter out empty groups and return as array
    return Object.entries(groups)
        .filter(([_, transactions]) => transactions.length > 0)
        .map(([title, data]) => ({ title, data }));
};
