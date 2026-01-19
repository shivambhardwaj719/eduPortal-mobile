import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { notificationsService } from '../../services/dataService';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        today: 0,
    });

    // Sample data for UI
    const sampleNotifications: Notification[] = [
        {
            id: 1,
            title: 'Assignment Due Tomorrow',
            message: 'Your Mathematics assignment "Calculus Problem Set" is due tomorrow. Make sure to submit on time.',
            notification_type: 'assignment',
            is_read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 2,
            title: 'Exam Results Published',
            message: 'Your Physics Mid-Term exam results have been published. Click to view your score.',
            notification_type: 'exam',
            is_read: false,
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 3,
            title: 'Fee Payment Reminder',
            message: 'Your pending fee of ₹10,000 is due on February 15, 2026. Please make the payment to avoid late fees.',
            notification_type: 'finance',
            is_read: true,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 4,
            title: 'Event: Annual Sports Day',
            message: 'Don\'t forget! Annual Sports Day is on January 20, 2026. Registrations are now open.',
            notification_type: 'event',
            is_read: true,
            created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 5,
            title: 'Library Book Due',
            message: 'The book "Data Structures and Algorithms" is due for return tomorrow. Please return it to avoid fines.',
            notification_type: 'library',
            is_read: false,
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 6,
            title: 'Attendance Alert',
            message: 'Your attendance has dropped below 85% in Chemistry. Please attend classes regularly.',
            notification_type: 'attendance',
            is_read: true,
            created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 7,
            title: 'New Course Material',
            message: 'New study material has been uploaded for Computer Science - Chapter 5: Arrays and Pointers.',
            notification_type: 'academic',
            is_read: true,
            created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        },
    ];

    const fetchNotifications = async () => {
        try {
            const [notificationsData, statsData] = await Promise.all([
                notificationsService.getAll().catch(() => ({ results: [] })),
                notificationsService.getStats().catch(() => ({})),
            ]);
            setNotifications(notificationsData.results.length > 0 ? notificationsData.results : sampleNotifications);
            setStats({
                total: statsData.total_count || sampleNotifications.length,
                unread: statsData.unread_count || sampleNotifications.filter(n => !n.is_read).length,
                today: statsData.today_count || 3,
            });
        } catch (error) {
            console.log('Error fetching notifications:', error);
            setNotifications(sampleNotifications);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setStats(prev => ({
                ...prev,
                unread: Math.max(0, prev.unread - 1)
            }));
        } catch (error) {
            console.log('Error marking notification as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'assignment': return { icon: 'document-text', color: Colors.warning.main };
            case 'exam': return { icon: 'school', color: Colors.accent.purple };
            case 'finance': return { icon: 'wallet', color: Colors.success.main };
            case 'event': return { icon: 'calendar', color: Colors.accent.pink };
            case 'library': return { icon: 'library', color: Colors.info.main };
            case 'attendance': return { icon: 'checkmark-circle', color: Colors.error.main };
            case 'academic': return { icon: 'book', color: Colors.primary[500] };
            default: return { icon: 'notifications', color: Colors.primary[500] };
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (activeFilter === 'unread') return !notification.is_read;
        if (activeFilter === 'read') return notification.is_read;
        return true;
    });

    const filters = [
        { key: 'all', label: 'All', count: stats.total },
        { key: 'unread', label: 'Unread', count: stats.unread },
        { key: 'read', label: 'Read', count: stats.total - stats.unread },
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="settings-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <Card variant="glass" style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                            <Ionicons name="notifications" size={20} color={Colors.primary[500]} />
                        </View>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </Card>
                    <Card variant="glass" style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.warning.main + '20' }]}>
                            <Ionicons name="mail-unread" size={20} color={Colors.warning.main} />
                        </View>
                        <Text style={styles.statValue}>{stats.unread}</Text>
                        <Text style={styles.statLabel}>Unread</Text>
                    </Card>
                    <Card variant="glass" style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.success.main + '20' }]}>
                            <Ionicons name="today" size={20} color={Colors.success.main} />
                        </View>
                        <Text style={styles.statValue}>{stats.today}</Text>
                        <Text style={styles.statLabel}>Today</Text>
                    </Card>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[styles.filterTab, activeFilter === filter.key && styles.activeFilterTab]}
                            onPress={() => setActiveFilter(filter.key as any)}
                        >
                            <Text style={[styles.filterTabText, activeFilter === filter.key && styles.activeFilterTabText]}>
                                {filter.label}
                            </Text>
                            {filter.count > 0 && (
                                <View style={[styles.filterBadge, activeFilter === filter.key && styles.activeFilterBadge]}>
                                    <Text style={[styles.filterBadgeText, activeFilter === filter.key && styles.activeFilterBadgeText]}>
                                        {filter.count}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary[500]}
                        />
                    }
                >
                    {/* Mark All as Read */}
                    {stats.unread > 0 && activeFilter !== 'read' && (
                        <TouchableOpacity style={styles.markAllButton}>
                            <Ionicons name="checkmark-done" size={18} color={Colors.primary[500]} />
                            <Text style={styles.markAllText}>Mark all as read</Text>
                        </TouchableOpacity>
                    )}

                    {/* Notifications List */}
                    {filteredNotifications.length > 0 ? (
                        <View style={styles.notificationsList}>
                            {filteredNotifications.map((notification) => {
                                const iconInfo = getNotificationIcon(notification.notification_type);
                                return (
                                    <TouchableOpacity
                                        key={notification.id}
                                        onPress={() => !notification.is_read && handleMarkAsRead(notification.id)}
                                    >
                                        <Card
                                            variant="glass"
                                            style={[
                                                styles.notificationCard,
                                                !notification.is_read && styles.unreadCard
                                            ]}
                                        >
                                            <View style={styles.notificationRow}>
                                                <View style={[styles.notificationIcon, { backgroundColor: iconInfo.color + '20' }]}>
                                                    <Ionicons name={iconInfo.icon as any} size={22} color={iconInfo.color} />
                                                </View>
                                                <View style={styles.notificationContent}>
                                                    <View style={styles.notificationHeader}>
                                                        <Text style={styles.notificationTitle} numberOfLines={1}>
                                                            {notification.title}
                                                        </Text>
                                                        {!notification.is_read && (
                                                            <View style={styles.unreadDot} />
                                                        )}
                                                    </View>
                                                    <Text style={styles.notificationMessage} numberOfLines={2}>
                                                        {notification.message}
                                                    </Text>
                                                    <View style={styles.notificationFooter}>
                                                        <View style={styles.notificationMeta}>
                                                            <Ionicons name="time-outline" size={12} color={Colors.text.muted} />
                                                            <Text style={styles.notificationTime}>
                                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.typeBadge, { backgroundColor: iconInfo.color + '15' }]}>
                                                            <Text style={[styles.typeBadgeText, { color: iconInfo.color }]}>
                                                                {notification.notification_type}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="notifications-off-outline" size={64} color={Colors.text.muted} />
                            </View>
                            <Text style={styles.emptyTitle}>No Notifications</Text>
                            <Text style={styles.emptySubtitle}>
                                {activeFilter === 'unread'
                                    ? "You're all caught up! No unread notifications."
                                    : "No notifications to display."}
                            </Text>
                        </View>
                    )}

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
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    filterTabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.glass.background,
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
    },
    filterTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
        borderRadius: 10,
    },
    activeFilterTab: {
        backgroundColor: Colors.primary[500],
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.muted,
    },
    activeFilterTabText: {
        color: Colors.white,
    },
    filterBadge: {
        backgroundColor: Colors.glass.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    activeFilterBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.text.muted,
    },
    activeFilterBadgeText: {
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        marginBottom: 12,
        backgroundColor: Colors.primary[500] + '10',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary[500] + '30',
    },
    markAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary[500],
    },
    notificationsList: {
        gap: 12,
    },
    notificationCard: {
        padding: 16,
    },
    unreadCard: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary[500],
    },
    notificationRow: {
        flexDirection: 'row',
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginRight: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary[500],
    },
    notificationMessage: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
        marginBottom: 10,
    },
    notificationFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.text.muted,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default NotificationsScreen;
