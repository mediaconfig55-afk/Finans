import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, HelperText, useTheme, Text, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../store';
import { formatShortDate } from '../utils/format';
import { ScreenWrapper } from '../components/ScreenWrapper';

const schema = z.object({
    personName: z.string().min(1, 'Kişi/Kurum adı gereklidir'),
    amount: z.string()
        .min(1, 'Tutar gereklidir')
        .transform((val) => val.replace(',', '.'))
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Geçerli bir tutar giriniz')
        .transform((val) => parseFloat(val)),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const AddDebtScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { addDebt } = useStore();

    const [type, setType] = useState<'debt' | 'receivable'>('debt');
    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const showToast = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: {
            personName: '',
            amount: '',
            description: '',
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await addDebt({
                type,
                personName: data.personName,
                amount: data.amount,
                dueDate: dueDate.toISOString().split('T')[0],
                isPaid: 0,
                description: data.description,
            });
            showToast(`${type === 'debt' ? 'Borç' : 'Alacak'} başarıyla eklendi ✓`);
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Borç eklenirken bir hata oluştu');
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>

                    <Text variant="headlineSmall" style={styles.title}>Borç Ekle</Text>

                    <Controller
                        control={control}
                        name="personName"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextInput
                                    label="Borç Aldığım Kişi/Kurum"
                                    value={value}
                                    onChangeText={onChange}
                                    mode="outlined"
                                    style={styles.input}
                                    error={!!errors.personName}
                                />
                                <HelperText type="error" visible={!!errors.personName}>
                                    {errors.personName?.message as string}
                                </HelperText>
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name="amount"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextInput
                                    label="Tutar"
                                    value={value?.toString()}
                                    onChangeText={onChange}
                                    keyboardType="decimal-pad"
                                    mode="outlined"
                                    style={styles.input}
                                    error={!!errors.amount}
                                    left={<TextInput.Icon icon="currency-try" />}
                                />
                                <HelperText type="error" visible={!!errors.amount}>
                                    {errors.amount?.message as string}
                                </HelperText>
                            </>
                        )}
                    />

                    <Button
                        mode="outlined"
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                        icon="calendar"
                    >
                        Vade Tarihi: {formatShortDate(dueDate.toISOString())}
                    </Button>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dueDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDueDate(selectedDate);
                            }}
                        />
                    )}

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Açıklama (Opsiyonel)"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                            />
                        )}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        style={styles.button}
                    >
                        Kaydet
                    </Button>

                </ScrollView>
            </KeyboardAvoidingView>

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
        padding: 16,
        flexGrow: 1,
    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 20,
        paddingVertical: 6,
    }
});
