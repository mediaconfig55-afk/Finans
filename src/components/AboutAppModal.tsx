import React from 'react';
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity, StatusBar, Platform, Linking } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import i18n from '../i18n';

interface AboutAppModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({ visible, onDismiss }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme.dark;

    const bg = isDark ? '#0D1117' : '#FFFFFF';
    const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
    const accent = isDark ? '#FF8C00' : '#F97316';
    const green = isDark ? '#00ff88' : '#10B981';
    const textPrimary = isDark ? '#F0F6FC' : '#1F2937';
    const textSecondary = isDark ? '#8B949E' : '#6B7280';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const appVersion = Constants.expoConfig?.version || '1.0.2';

    const InfoCard = ({ icon, iconColor, title, value }: { icon: string; iconColor: string; title: string; value: string }) => (
        <View style={[styles.infoCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={[styles.infoIconBox, { backgroundColor: iconColor + '18' }]}>
                <Icon source={icon} size={22} color={iconColor} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: textSecondary }]}>{title}</Text>
                <Text style={[styles.infoValue, { color: textPrimary }]}>{value}</Text>
            </View>
        </View>
    );

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
            {children}
        </View>
    );

    const BulletPoint = ({ text, bold }: { text: string; bold?: string }) => (
        <View style={styles.bulletRow}>
            <View style={[styles.bullet, { backgroundColor: green }]} />
            <Text style={[styles.bodyText, { color: textSecondary }]}>
                {bold && <Text style={{ fontWeight: '700', color: textPrimary }}>{bold} </Text>}
                {text}
            </Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onDismiss}
        >
            <View style={[styles.container, { backgroundColor: bg, paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0 }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: borderColor }]}>
                    <View style={styles.headerLeft}>
                        <Icon source="information" size={24} color={accent} />
                        <Text style={[styles.headerTitle, { color: textPrimary }]}>
                            {i18n.t('aboutApp', { defaultValue: 'Uygulama Hakkında' })}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onDismiss} style={[styles.closeButton, { backgroundColor: cardBg }]}>
                        <Icon source="close" size={20} color={textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* App Logo & Name */}
                    <View style={styles.appHeader}>
                        <View style={[styles.appLogo, { backgroundColor: accent + '15', borderColor: accent + '30' }]}>
                            <Icon source="wallet" size={40} color={accent} />
                        </View>
                        <Text style={[styles.appName, { color: textPrimary }]}>Finans</Text>
                        <Text style={[styles.appTagline, { color: textSecondary }]}>
                            Kişisel Finans Yönetimi
                        </Text>
                        <View style={[styles.versionBadge, { backgroundColor: green + '18', borderColor: green + '30' }]}>
                            <Text style={[styles.versionText, { color: green }]}>v{appVersion}</Text>
                        </View>
                    </View>

                    {/* Quick Info Cards */}
                    <InfoCard icon="cellphone" iconColor={accent} title="Platform" value="Android" />
                    <InfoCard icon="code-tags" iconColor="#8B5CF6" title="Teknoloji" value="React Native + Expo" />
                    <InfoCard icon="database" iconColor="#3B82F6" title="Veri Depolama" value="Yerel (Cihazınızda)" />
                    <InfoCard icon="shield-check" iconColor={green} title="Gizlilik" value="Verileriniz asla paylaşılmaz" />

                    {/* Features */}
                    <Section title="📱 Özellikler">
                        <BulletPoint bold="Gelir & Gider Takibi:" text="Harcamalarınızı kategorize edin ve analiz edin" />
                        <BulletPoint bold="Borç Yönetimi:" text="Alacak ve vereceklerinizi takip edin" />
                        <BulletPoint bold="Fatura Hatırlatıcı:" text="Ödemelerinizi asla kaçırmayın" />
                        <BulletPoint bold="Taksit Takibi:" text="Taksitli ödemelerinizi yönetin" />
                        <BulletPoint bold="İstatistikler:" text="Detaylı grafiklerle analiz" />
                        <BulletPoint bold="Excel'e Aktar:" text="Verilerinizi dışa aktarın" />
                        <BulletPoint bold="Yedekleme:" text="Verilerinizi yedekleyin ve geri yükleyin" />
                    </Section>

                    {/* Privacy Summary */}
                    <Section title="🔒 Gizlilik Politikası">
                        <Text style={[styles.bodyText, { color: textSecondary, marginBottom: 12 }]}>
                            Finans uygulaması olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz.
                        </Text>
                        <BulletPoint text="Tüm verileriniz yalnızca cihazınızda saklanır" />
                        <BulletPoint text="Hiçbir veri sunucuya veya üçüncü tarafa gönderilmez" />
                        <BulletPoint text="Uygulama silindiğinde tüm veriler kalıcı olarak kaldırılır" />
                        <BulletPoint text="Google AdMob reklam hizmeti kullanılmaktadır" />
                        <BulletPoint text="13 yaşın altındaki çocuklara yönelik değildir" />
                        <BulletPoint text="Bildirimleri istediğiniz zaman kapatabilirsiniz" />
                    </Section>

                    {/* Data Rights */}
                    <Section title="👤 Kullanıcı Hakları">
                        <BulletPoint text="Tüm verilerinizi Excel veya yedek dosyası olarak dışa aktarabilirsiniz" />
                        <BulletPoint text="Uygulamayı silerek tüm verilerinizi kalıcı olarak kaldırabilirsiniz" />
                        <BulletPoint text="Kişiselleştirilmemiş reklam tercih edebilirsiniz" />
                    </Section>

                    {/* Contact */}
                    <Section title="📬 İletişim">
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://mediaconfig55-afk.github.io/finanswebsite/')}
                            style={[styles.contactRow, { borderColor }]}
                        >
                            <Icon source="web" size={20} color={accent} />
                            <Text style={[styles.contactText, { color: accent }]}>
                                Web Sitesi
                            </Text>
                            <Icon source="chevron-right" size={18} color={textSecondary} />
                        </TouchableOpacity>
                    </Section>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <Text style={[styles.footerText, { color: textSecondary }]}>
                            © 2026 Finans App
                        </Text>
                        <Text style={[styles.footerText, { color: textSecondary }]}>
                            Tüm hakları saklıdır.
                        </Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    appHeader: {
        alignItems: 'center',
        marginBottom: 28,
    },
    appLogo: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: 12,
    },
    appName: {
        fontSize: 28,
        fontWeight: '800',
    },
    appTagline: {
        fontSize: 14,
        marginTop: 4,
    },
    versionBadge: {
        marginTop: 10,
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    versionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
    },
    infoIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    section: {
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingRight: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 8,
        marginRight: 10,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderTopWidth: 0,
    },
    contactText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    modalFooter: {
        alignItems: 'center',
        marginTop: 28,
    },
    footerText: {
        fontSize: 13,
        lineHeight: 20,
    },
});
