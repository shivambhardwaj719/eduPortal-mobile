import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { useAppDispatch } from '../../hooks/useAppStore';
import { logout } from '../../store/slices/authSlice';

interface SettingItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    type: 'toggle' | 'navigate' | 'action' | 'value';
    value?: boolean | string;
    color?: string;
    action?: () => void;
}

interface SettingSection {
    title: string;
    items: SettingItem[];
}

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    // Settings state
    const [notifications, setNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [biometricAuth, setBiometricAuth] = useState(false);
    const [autoSync, setAutoSync] = useState(true);
    const [downloadOverWifi, setDownloadOverWifi] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => dispatch(logout())
                },
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'This will clear all cached data. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        // Simulating cache clear
                        Alert.alert('Success', 'Cache cleared successfully');
                    }
                },
            ]
        );
    };

    const settingsSections: SettingSection[] = [
        {
            title: 'Notifications',
            items: [
                {
                    id: 'notifications',
                    icon: 'notifications',
                    title: 'Push Notifications',
                    subtitle: 'Receive push notifications',
                    type: 'toggle',
                    value: pushNotifications,
                    color: Colors.primary[500],
                },
                {
                    id: 'email_notifications',
                    icon: 'mail',
                    title: 'Email Notifications',
                    subtitle: 'Receive email updates',
                    type: 'toggle',
                    value: emailNotifications,
                    color: Colors.secondary[500],
                },
                {
                    id: 'notification_settings',
                    icon: 'options',
                    title: 'Notification Preferences',
                    subtitle: 'Customize notification settings',
                    type: 'navigate',
                    color: Colors.accent.purple,
                },
            ],
        },
        {
            title: 'Appearance',
            items: [
                {
                    id: 'dark_mode',
                    icon: 'moon',
                    title: 'Dark Mode',
                    subtitle: 'Use dark theme',
                    type: 'toggle',
                    value: darkMode,
                    color: Colors.accent.purple,
                },
                {
                    id: 'language',
                    icon: 'language',
                    title: 'Language',
                    subtitle: 'English',
                    type: 'value',
                    value: 'English',
                    color: Colors.info.main,
                },
            ],
        },
        {
            title: 'Security',
            items: [
                {
                    id: 'biometric',
                    icon: 'finger-print',
                    title: 'Biometric Authentication',
                    subtitle: 'Use fingerprint or face ID',
                    type: 'toggle',
                    value: biometricAuth,
                    color: Colors.success.main,
                },
                {
                    id: 'change_password',
                    icon: 'key',
                    title: 'Change Password',
                    subtitle: 'Update your password',
                    type: 'navigate',
                    color: Colors.warning.main,
                },
                {
                    id: 'two_factor',
                    icon: 'shield-checkmark',
                    title: 'Two-Factor Authentication',
                    subtitle: 'Add extra security',
                    type: 'navigate',
                    color: Colors.accent.cyan,
                },
            ],
        },
        {
            title: 'Data & Storage',
            items: [
                {
                    id: 'auto_sync',
                    icon: 'sync',
                    title: 'Auto Sync',
                    subtitle: 'Automatically sync data',
                    type: 'toggle',
                    value: autoSync,
                    color: Colors.primary[500],
                },
                {
                    id: 'wifi_only',
                    icon: 'wifi',
                    title: 'Download Over WiFi Only',
                    subtitle: 'Save mobile data',
                    type: 'toggle',
                    value: downloadOverWifi,
                    color: Colors.info.main,
                },
                {
                    id: 'clear_cache',
                    icon: 'trash',
                    title: 'Clear Cache',
                    subtitle: 'Free up storage space',
                    type: 'action',
                    color: Colors.error.main,
                    action: handleClearCache,
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    id: 'help',
                    icon: 'help-circle',
                    title: 'Help & Support',
                    subtitle: 'Get help with the app',
                    type: 'navigate',
                    color: Colors.info.main,
                },
                {
                    id: 'feedback',
                    icon: 'chatbox-ellipses',
                    title: 'Send Feedback',
                    subtitle: 'Share your thoughts',
                    type: 'navigate',
                    color: Colors.accent.pink,
                },
                {
                    id: 'privacy',
                    icon: 'document-text',
                    title: 'Privacy Policy',
                    type: 'navigate',
                    color: Colors.neutral[500],
                },
                {
                    id: 'terms',
                    icon: 'document',
                    title: 'Terms of Service',
                    type: 'navigate',
                    color: Colors.neutral[500],
                },
            ],
        },
    ];

    const handleToggle = (id: string, value: boolean) => {
        switch (id) {
            case 'notifications':
                setPushNotifications(value);
                break;
            case 'email_notifications':
                setEmailNotifications(value);
                break;
            case 'dark_mode':
                setDarkMode(value);
                break;
            case 'biometric':
                setBiometricAuth(value);
                break;
            case 'auto_sync':
                setAutoSync(value);
                break;
            case 'wifi_only':
                setDownloadOverWifi(value);
                break;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Settings Sections */}
                    {settingsSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Card variant="glass" style={styles.sectionCard}>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.settingItem,
                                            itemIndex !== section.items.length - 1 && styles.settingItemBorder,
                                        ]}
                                        onPress={() => {
                                            if (item.type === 'action' && item.action) {
                                                item.action();
                                            } else if (item.type === 'navigate') {
                                                // Navigate to specific screen
                                            }
                                        }}
                                        disabled={item.type === 'toggle'}
                                    >
                                        <View style={[styles.settingIcon, { backgroundColor: (item.color || Colors.primary[500]) + '20' }]}>
                                            <Ionicons name={item.icon} size={20} color={item.color || Colors.primary[500]} />
                                        </View>
                                        <View style={styles.settingContent}>
                                            <Text style={styles.settingTitle}>{item.title}</Text>
                                            {item.subtitle && (
                                                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                                            )}
                                        </View>
                                        {item.type === 'toggle' && (
                                            <Switch
                                                value={item.value as boolean}
                                                onValueChange={(value) => handleToggle(item.id, value)}
                                                trackColor={{ false: Colors.neutral[700], true: Colors.primary[500] + '50' }}
                                                thumbColor={item.value ? Colors.primary[500] : Colors.neutral[400]}
                                            />
                                        )}
                                        {item.type === 'navigate' && (
                                            <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                                        )}
                                        {item.type === 'value' && (
                                            <View style={styles.valueContainer}>
                                                <Text style={styles.valueText}>{item.value}</Text>
                                                <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                                            </View>
                                        )}
                                        {item.type === 'action' && (
                                            <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </Card>
                        </View>
                    ))}

                    {/* Sign Out Button */}
                    <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={Colors.error.main} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    {/* App Info */}
                    <View style={styles.appInfo}>
                        <Text style={styles.appVersion}>EduPortal v1.0.0</Text>
                        <Text style={styles.appCopyright}>© 2026 EduPortal. All rights reserved.</Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    headerSpacer: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionCard: {
        padding: 0,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.glass.border,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    valueText: {
        fontSize: 14,
        color: Colors.text.muted,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        backgroundColor: Colors.error.main + '15',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.error.main + '30',
        marginBottom: 24,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.error.main,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    appVersion: {
        fontSize: 14,
        color: Colors.text.muted,
        marginBottom: 4,
    },
    appCopyright: {
        fontSize: 12,
        color: Colors.text.muted,
    },
});

export default SettingsScreen;
