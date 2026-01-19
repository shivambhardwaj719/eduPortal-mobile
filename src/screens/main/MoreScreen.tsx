import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { logout } from '../../store/slices/authSlice';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

interface MenuItem {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    color: string;
    screen?: keyof MainStackParamList;
    action?: () => void;
    badge?: number;
}

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const MoreScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Academic',
            items: [
                { icon: 'library', title: 'Library', subtitle: 'Books & Resources', color: Colors.primary[500], screen: 'Library', badge: 2 },
                { icon: 'calendar', title: 'Events', subtitle: 'Upcoming Activities', color: Colors.accent.pink, screen: 'Events' },
                { icon: 'document-text', title: 'Results', subtitle: 'Exam Scores', color: Colors.success.main, screen: 'Results' },
                { icon: 'time', title: 'Schedule', subtitle: 'Class Timetable', color: Colors.info.main, screen: 'Schedule' },
            ],
        },
        {
            title: 'Services',
            items: [
                { icon: 'bed', title: 'Hostel', subtitle: 'Room & Mess', color: Colors.secondary[500], screen: 'Hostel' },
                { icon: 'bus', title: 'Transport', subtitle: 'Bus Routes', color: Colors.accent.orange },
                { icon: 'cart', title: 'Inventory', subtitle: 'School Assets', color: Colors.accent.purple, screen: 'Inventory' },
                { icon: 'people', title: 'Directory', subtitle: 'Staff & Students', color: Colors.accent.cyan, screen: 'Directory' },
            ],
        },
        {
            title: 'Communication',
            items: [
                { icon: 'notifications', title: 'Notifications', subtitle: 'All Updates', color: Colors.warning.main, screen: 'Notifications', badge: 5 },
                { icon: 'chatbubbles', title: 'Messages', subtitle: 'Chat', color: Colors.info.main },
                { icon: 'help-circle', title: 'Help & Support', subtitle: 'FAQs & Contact', color: Colors.neutral[500] },
            ],
        },
        {
            title: 'Account',
            items: [
                { icon: 'person', title: 'Profile', subtitle: 'Personal Info', color: Colors.primary[500], screen: 'Profile' },
                { icon: 'settings', title: 'Settings', subtitle: 'App Preferences', color: Colors.neutral[500], screen: 'Settings' },
                { icon: 'log-out', title: 'Sign Out', subtitle: 'Log out of account', color: Colors.error.main, action: handleLogout },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>More</Text>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Card */}
                    <Card variant="gradient" style={styles.profileCard} gradientColors={[...Colors.gradients.primary] as string[]}>
                        <View style={styles.profileContent}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>
                                    {(user?.first_name?.[0] || 'U').toUpperCase()}
                                    {(user?.last_name?.[0] || '').toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>
                                    {user?.first_name || 'User'} {user?.last_name || ''}
                                </Text>
                                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
                                <View style={styles.profileBadge}>
                                    <Text style={styles.profileBadgeText}>{user?.profile_type || 'Student'}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.editButton}>
                                <Ionicons name="pencil" size={18} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </Card>

                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <View style={styles.quickStatItem}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.success.main + '20' }]}>
                                <Ionicons name="checkmark-done" size={20} color={Colors.success.main} />
                            </View>
                            <Text style={styles.quickStatValue}>92%</Text>
                            <Text style={styles.quickStatLabel}>Attendance</Text>
                        </View>
                        <View style={styles.quickStatDivider} />
                        <View style={styles.quickStatItem}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                                <Ionicons name="ribbon" size={20} color={Colors.primary[500]} />
                            </View>
                            <Text style={styles.quickStatValue}>A+</Text>
                            <Text style={styles.quickStatLabel}>Grade</Text>
                        </View>
                        <View style={styles.quickStatDivider} />
                        <View style={styles.quickStatItem}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.warning.main + '20' }]}>
                                <Ionicons name="star" size={20} color={Colors.warning.main} />
                            </View>
                            <Text style={styles.quickStatValue}>156</Text>
                            <Text style={styles.quickStatLabel}>Points</Text>
                        </View>
                    </View>

                    {/* Menu Sections */}
                    {menuSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.menuSection}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Card variant="glass" style={styles.menuCard}>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={[
                                            styles.menuItem,
                                            itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                                        ]}
                                        onPress={() => {
                                            if (item.action) {
                                                item.action();
                                            } else if (item.screen) {
                                                navigation.navigate(item.screen);
                                            }
                                        }}
                                    >
                                        <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                                            <Ionicons name={item.icon} size={22} color={item.color} />
                                        </View>
                                        <View style={styles.menuContent}>
                                            <Text style={[
                                                styles.menuTitle,
                                                item.title === 'Sign Out' && { color: Colors.error.main }
                                            ]}>
                                                {item.title}
                                            </Text>
                                            {item.subtitle && (
                                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                            )}
                                        </View>
                                        {item.badge !== undefined && (
                                            <View style={styles.menuBadge}>
                                                <Text style={styles.menuBadgeText}>{item.badge}</Text>
                                            </View>
                                        )}
                                        <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                                    </TouchableOpacity>
                                ))}
                            </Card>
                        </View>
                    ))}

                    {/* App Version */}
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
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    profileCard: {
        marginBottom: 20,
        padding: 20,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
    },
    profileBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    profileBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.white,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickStats: {
        flexDirection: 'row',
        backgroundColor: Colors.glass.background,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    quickStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    quickStatDivider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.glass.border,
    },
    quickStatIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickStatValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    quickStatLabel: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    menuSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuCard: {
        padding: 0,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.glass.border,
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    menuBadge: {
        backgroundColor: Colors.error.main,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    menuBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
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

export default MoreScreen;
