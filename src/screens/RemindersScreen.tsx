import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme, FAB, Button, Dialog, Portal, TextInput, Icon, Surface, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';
import { Reminder } from '../types';
import { scheduleReminderNotification, cancelReminderNotifications } from '../utils/notifications';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const RemindersScreen = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { reminders, fetchReminders, addReminder, deleteReminder } = useStore();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [day, setDay] = useState('');

    // Saat/Tarih picker states
    const [reminderDate, setReminderDate] = useState(new Date());
    const [reminderTime, setReminderTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        fetchReminders();
    }, []);

    const showDialog = () => setVisible(true);
    const hideDialog = () => {
        setVisible(false);
        setTitle('');
        setAmount('');
        setDay('');
        setReminderDate(new Date());
        setReminderTime(new Date());
    };

    const handleAdd = async () => {
        if (!title || !amount || !day) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            await addReminder({
                title,
                amount: parseFloat(amount),
                dayOfMonth: parseInt(day),
                type: 'bill'
            });

            await fetchReminders();
            const newReminder = reminders[reminders.length - 1];

            if (newReminder) {
                // Bildirim zamanını ayarla
                const notificationDate = new Date(reminderDate);
                notificationDate.setHours(reminderTime.getHours());
                notificationDate.setMinutes(reminderTime.getMinutes());

                await scheduleReminderNotification(newReminder.id, title, parseInt(day), parseFloat(amount));
            }

            hideDialog();
            Alert.alert('Başarılı', `Hatırlatıcı eklendi!\n📅 Tarih: ${reminderDate.toLocaleDateString('tr-TR')}\n⏰ Saat: ${reminderTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`);
        } catch (error) {
            console.error('Error adding reminder:', error);
            Alert.alert('Hata', 'Hatırlatıcı eklenirken bir hata oluştu.');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            'Hatırlatıcıyı Sil',
            'Bu hatırlatıcıyı silmek istediğinizden emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        await cancelReminderNotifications(id);
                        await deleteReminder(id);
                        fetchReminders();
                    }
                }
            ]
        );
    };

    const renderReminder = (item: Reminder) => {
        const color = theme.colors.primary;
        const daysUntil = item.dayOfMonth - new Date().getDate();
        const isUpcoming = daysUntil >= 0 && daysUntil <= 7;

        return (
            <Surface key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
                <TouchableOpacity style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                            <Icon source="bell-ring" size={24} color={color} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                                {item.title}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Her ayın {item.dayOfMonth}. günü
                            </Text>
                            {isUpcoming && (
                                <Chip
                                    icon="clock-alert"
                                    style={{ marginTop: 4, alignSelf: 'flex-start' }}
                                    compact
                                    textStyle={{ fontSize: 11 }}
                                >
                                    {daysUntil === 0 ? 'Bugün!' : `${daysUntil} gün kaldı`}
                                </Chip>
                            )}
                        </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text variant="titleMedium" style={{ color: color, fontWeight: 'bold' }}>
                            {formatCurrency(item.amount)}
                        </Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <Icon source="delete" size={24} color={theme.colors.error} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Surface>
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Fatura Hatırlatıcıları</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Düzenli ödemelerinizi takip edin
                </Text>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {reminders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon source="bell-off" size={64} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
                            Henüz hatırlatıcı yok
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                            + butonuna basarak ekleyin
                        </Text>
                    </View>
                ) : (
                    reminders.map(renderReminder)
                )}
            </ScrollView>

            <FAB
                icon="plus"
                label="Yeni Hatırlatıcı"
                style={[styles.fab, { bottom: insets.bottom + 16, backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={showDialog}
            />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Yeni Hatırlatıcı</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Başlık (ör: Elektrik Faturası)"
                            value={title}
                            onChangeText={setTitle}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Tutar"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="currency-try" />}
                        />
                        <TextInput
                            label="Ayın Kaçıncı Günü (1-31)"
                            value={day}
                            onChangeText={setDay}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                        />

                        {/* Tarih Seçici */}
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <TextInput
                                label="Hatırlatma Tarihi"
                                value={reminderDate.toLocaleDateString('tr-TR')}
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                                right={<TextInput.Icon icon="calendar" />}
                            />
                        </TouchableOpacity>

                        {/* Saat Seçici */}
                        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                            <TextInput
                                label="Hatırlatma Saati"
                                value={reminderTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                                right={<TextInput.Icon icon="clock-outline" />}
                            />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={reminderDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (selectedDate) {
                                        setReminderDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={reminderTime}
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedTime) => {
                                    setShowTimePicker(Platform.OS === 'ios');
                                    if (selectedTime) {
                                        setReminderTime(selectedTime);
                                    }
                                }}
                            />
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>İptal</Button>
                        <Button onPress={handleAdd} mode="contained">Ekle</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    scrollContent: {
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
    input: {
        marginBottom: 12,
    },
});
