import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card, StatCard, FeatureCard } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { logout } from '../../store/slices/authSlice';
import { eventsService, notificationsService } from '../../services/dataService';
import { Event, Notification } from '../../types';
import { format } from 'date-fns';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const DashboardScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [refreshing, setRefreshing] = useState(false);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState({
        totalStudents: 1250,
        totalTeachers: 84,
        totalCourses: 45,
        upcomingEvents: 12,
        pendingAssignments: 8,
        todayAttendance: 92,
        unreadNotifications: 5,
        pendingFees: 3,
    });

    const fetchDashboardData = async () => {
        try {
            const [eventsData, notificationsData] = await Promise.all([
                eventsService.getUpcoming().catch(() => []),
                notificationsService.getAll({ limit: 5 }).catch(() => ({ results: [] })),
            ]);
            setUpcomingEvents(eventsData.slice(0, 3));
            setNotifications(notificationsData.results || []);
        } catch (error) {
            console.log('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quickActions = [
        { title: 'Attendance', icon: 'checkmark-circle', color: Colors.success.main, tab: 'Attendance' as const },
        { title: 'Assignments', icon: 'document-text', color: Colors.accent.orange, tab: 'Academics' as const, badge: stats.pendingAssignments },
        { title: 'Exams', icon: 'school', color: Colors.accent.purple, tab: 'Academics' as const },
        { title: 'Library', icon: 'library', color: Colors.info.main, screen: 'Library' as const },
        { title: 'Events', icon: 'calendar', color: Colors.accent.pink, screen: 'Events' as const },
        { title: 'Finance', icon: 'wallet', color: Colors.warning.main, tab: 'Finance' as const, badge: stats.pendingFees },
    ];

    const handleQuickAction = (action: typeof quickActions[0]) => {
        if (action.screen) {
            navigation.navigate(action.screen);
        }
        // Tab navigation would be handled by the tab navigator
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary[500]}
                            colors={[Colors.primary[500]]}
                        />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.greeting}>{getGreeting()}</Text>
                            <Text style={styles.userName}>{user?.first_name || 'User'} 👋</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerIconButton}
                                onPress={() => {/* Navigate to notifications */ }}
                            >
                                <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
                                {stats.unreadNotifications > 0 && (
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.notificationBadgeText}>{stats.unreadNotifications}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.profileButton}
                                onPress={() => {/* Navigate to profile */ }}
                            >
                                <LinearGradient
                                    colors={Colors.gradients.primary}
                                    style={styles.profileGradient}
                                >
                                    <Text style={styles.profileInitial}>
                                        {(user?.first_name?.[0] || 'U').toUpperCase()}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Welcome Card */}
                    <Card variant="gradient" style={styles.welcomeCard} gradientColors={['#6366F1', '#8B5CF6', '#A855F7']}>
                        <View style={styles.welcomeContent}>
                            <View style={styles.welcomeTextContainer}>
                                <Text style={styles.welcomeTitle}>Welcome to EduPortal</Text>
                                <Text style={styles.welcomeSubtitle}>
                                    Manage your academic journey with ease
                                </Text>
                                <TouchableOpacity style={styles.welcomeButton}>
                                    <Text style={styles.welcomeButtonText}>View Schedule</Text>
                                    <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.welcomeIcon}>
                                <Ionicons name="school" size={64} color="rgba(255,255,255,0.3)" />
                            </View>
                        </View>
                    </Card>

                    {/* Stats Grid */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Overview</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsContainer}
                    >
                        <StatCard
                            title="Total Students"
                            value={stats.totalStudents.toLocaleString()}
                            icon="people"
                            iconColor={Colors.primary[500]}
                            change="+12%"
                            changeType="positive"
                        />
                        <StatCard
                            title="Teachers"
                            value={stats.totalTeachers}
                            icon="person"
                            iconColor={Colors.secondary[500]}
                            change="+3"
                            changeType="positive"
                        />
                        <StatCard
                            title="Attendance"
                            value={`${stats.todayAttendance}%`}
                            icon="checkmark-done"
                            iconColor={Colors.success.main}
                            change="-2%"
                            changeType="negative"
                        />
                        <StatCard
                            title="Courses"
                            value={stats.totalCourses}
                            icon="book"
                            iconColor={Colors.accent.purple}
                        />
                    </ScrollView>

                    {/* Quick Actions */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action, index) => (
                            <FeatureCard
                                key={index}
                                title={action.title}
                                icon={action.icon as any}
                                iconColor={action.color}
                                onPress={() => handleQuickAction(action)}
                                badge={action.badge}
                            />
                        ))}
                    </View>

                    {/* Upcoming Events */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Events</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.eventsContainer}>
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event, index) => (
                                <Card key={event.id || index} variant="glass" style={styles.eventCard}>
                                    <View style={styles.eventDateBadge}>
                                        <Text style={styles.eventDay}>
                                            {new Date(event.start_date).getDate()}
                                        </Text>
                                        <Text style={styles.eventMonth}>
                                            {format(new Date(event.start_date), 'MMM')}
                                        </Text>
                                    </View>
                                    <View style={styles.eventContent}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <View style={styles.eventMeta}>
                                            <Ionicons name="location-outline" size={14} color={Colors.text.muted} />
                                            <Text style={styles.eventLocation}>{event.location || 'TBA'}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.eventArrow}>
                                        <Ionicons name="chevron-forward" size={20} color={Colors.primary[400]} />
                                    </TouchableOpacity>
                                </Card>
                            ))
                        ) : (
                            /* Placeholder events */
                            [
                                { id: 1, title: 'Annual Sports Day', date: '2026-01-20', location: 'Sports Ground' },
                                { id: 2, title: 'Parent-Teacher Meet', date: '2026-01-25', location: 'Auditorium' },
                                { id: 3, title: 'Science Exhibition', date: '2026-02-01', location: 'Main Hall' },
                            ].map((event, index) => (
                                <Card key={event.id} variant="glass" style={styles.eventCard}>
                                    <View style={styles.eventDateBadge}>
                                        <Text style={styles.eventDay}>
                                            {new Date(event.date).getDate()}
                                        </Text>
                                        <Text style={styles.eventMonth}>
                                            {format(new Date(event.date), 'MMM')}
                                        </Text>
                                    </View>
                                    <View style={styles.eventContent}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <View style={styles.eventMeta}>
                                            <Ionicons name="location-outline" size={14} color={Colors.text.muted} />
                                            <Text style={styles.eventLocation}>{event.location}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.eventArrow}>
                                        <Ionicons name="chevron-forward" size={20} color={Colors.primary[400]} />
                                    </TouchableOpacity>
                                </Card>
                            ))
                        )}
                    </View>

                    {/* Recent Notifications */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Notifications</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <Card variant="glass" style={styles.notificationsCard}>
                        {[
                            { id: 1, title: 'Assignment Due', message: 'Math assignment due tomorrow', time: '2h ago', icon: 'document-text', color: Colors.warning.main },
                            { id: 2, title: 'New Grade Posted', message: 'Your Science exam results are out', time: '5h ago', icon: 'ribbon', color: Colors.success.main },
                            { id: 3, title: 'Event Reminder', message: 'Sports day registration closes soon', time: '1d ago', icon: 'calendar', color: Colors.primary[500] },
                        ].map((notification, index) => (
                            <TouchableOpacity key={notification.id} style={[
                                styles.notificationItem,
                                index !== 2 && styles.notificationItemBorder
                            ]}>
                                <View style={[styles.notificationIcon, { backgroundColor: notification.color + '20' }]}>
                                    <Ionicons name={notification.icon as any} size={20} color={notification.color} />
                                </View>
                                <View style={styles.notificationContent}>
                                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                                </View>
                                <Text style={styles.notificationTime}>{notification.time}</Text>
                            </TouchableOpacity>
                        ))}
                    </Card>

                    {/* Logout Button (for testing) */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={Colors.error.main} />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>

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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLeft: {},
    greeting: {
        fontSize: 14,
        color: Colors.text.muted,
        marginBottom: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.error.main,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.white,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        overflow: 'hidden',
    },
    profileGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
    },
    welcomeCard: {
        marginBottom: 24,
        padding: 20,
    },
    welcomeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
    },
    welcomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    welcomeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    welcomeIcon: {
        opacity: 0.6,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    seeAllText: {
        fontSize: 14,
        color: Colors.primary[400],
        fontWeight: '500',
    },
    statsContainer: {
        gap: 12,
        paddingBottom: 8,
        marginBottom: 16,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    eventsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    eventDateBadge: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: Colors.primary[500] + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    eventDay: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary[400],
    },
    eventMonth: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.primary[400],
        textTransform: 'uppercase',
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eventLocation: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    eventArrow: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.primary[500] + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationsCard: {
        marginBottom: 24,
        padding: 4,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    notificationItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.glass.border,
    },
    notificationIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    notificationMessage: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    notificationTime: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        marginTop: 12,
        backgroundColor: Colors.error.main + '15',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.error.main + '30',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.error.main,
    },
});

export default DashboardScreen;
