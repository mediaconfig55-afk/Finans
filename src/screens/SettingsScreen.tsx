import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Divider, useTheme, Button, Text, ActivityIndicator } from 'react-native-paper';
import { exportToExcel } from '../utils/excel';

export const SettingsScreen = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            await exportToExcel();
            // Alert.alert('Başarılı', 'Veriler dışa aktarıldı.'); // shareAsync usually handles feedback
        } catch (error) {
            Alert.alert('Hata', 'Dışa aktarma sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                <List.Subheader>Veri Yönetimi</List.Subheader>
                <List.Item
                    title="Verileri Excel Olarak İndir"
                    description="Tüm işlemleri, borçları ve taksitleri .xlsx formatında dışa aktar."
                    left={props => <List.Icon {...props} icon="file-excel" color={theme.colors.primary} />}
                    onPress={handleExport}
                    right={() => loading ? <ActivityIndicator animating={loading} color={theme.colors.primary} /> : null}
                />
                <Divider />
            </List.Section>

            <List.Section>
                <List.Subheader>Uygulama Hakkında</List.Subheader>
                <List.Item
                    title="Versiyon"
                    description="1.0.0"
                    left={props => <List.Icon {...props} icon="information" />}
                />
            </List.Section>

            <View style={styles.footer}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Finansal Özgürlüğünüz İçin ❤️ ile yapıldı
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 'auto',
    }
});
