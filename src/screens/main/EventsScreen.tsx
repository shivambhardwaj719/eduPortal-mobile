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

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { eventsService } from '../../services/dataService';
import { Event } from '../../types';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameMonth } from 'date-fns';

const { width } = Dimensions.get('window');

const EventsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [activeTab, setActiveTab] = useState<'calendar' | 'upcoming'>('calendar');

    // Sample events data
    const sampleEvents: Event[] = [
        { id: 1, title: 'Annual Sports Day', description: 'Inter-house sports competition', event_type: 'sports', start_date: '2026-01-20', end_date: '2026-01-20', location: 'Sports Ground', organizer: 'Sports Dept', is_active: true },
        { id: 2, title: 'Parent-Teacher Meeting', description: 'Discussion on student progress', event_type: 'meeting', start_date: '2026-01-25', end_date: '2026-01-25', location: 'Auditorium', organizer: 'Admin', is_active: true },
        { id: 3, title: 'Science Exhibition', description: 'Student science projects showcase', event_type: 'academic', start_date: '2026-02-01', end_date: '2026-02-02', location: 'Main Hall', organizer: 'Science Dept', is_active: true },
        { id: 4, title: 'Republic Day Celebration', description: 'National holiday celebration', event_type: 'holiday', start_date: '2026-01-26', end_date: '2026-01-26', location: 'Main Ground', organizer: 'Admin', is_active: true },
        { id: 5, title: 'Mid-Term Exams Begin', description: 'Mid-term examination period starts', event_type: 'exam', start_date: '2026-02-01', end_date: '2026-02-10', location: 'Exam Halls', organizer: 'Exam Cell', is_active: true },
        { id: 6, title: 'Art Workshop', description: 'Interactive art and craft workshop', event_type: 'workshop', start_date: '2026-01-22', end_date: '2026-01-22', location: 'Art Room', organizer: 'Art Dept', is_active: true },
        { id: 7, title: 'Music Concert', description: 'Annual music performance', event_type: 'cultural', start_date: '2026-02-15', end_date: '2026-02-15', location: 'Auditorium', organizer: 'Music Dept', is_active: true },
    ];

    const fetchEvents = async () => {
        try {
            const eventsData = await eventsService.getAll().catch(() => ({ results: [] }));
            setEvents(eventsData.results.length > 0 ? eventsData.results : sampleEvents);
        } catch (error) {
            console.log('Error fetching events:', error);
            setEvents(sampleEvents);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    const getEventTypeInfo = (type: string) => {
        switch (type.toLowerCase()) {
            case 'sports': return { icon: 'football', color: Colors.warning.main };
            case 'meeting': return { icon: 'people', color: Colors.primary[500] };
            case 'academic': return { icon: 'school', color: Colors.accent.purple };
            case 'holiday': return { icon: 'sunny', color: Colors.accent.yellow };
            case 'exam': return { icon: 'document-text', color: Colors.error.main };
            case 'workshop': return { icon: 'hammer', color: Colors.accent.orange };
            case 'cultural': return { icon: 'musical-notes', color: Colors.accent.pink };
            default: return { icon: 'calendar', color: Colors.info.main };
        }
    };

    // Calendar helpers
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event =>
            isSameDay(new Date(event.start_date), date) ||
            (new Date(event.start_date) <= date && new Date(event.end_date) >= date)
        );
    };

    const hasEvents = (date: Date) => {
        return getEventsForDate(date).length > 0;
    };

    const days = getDaysInMonth();
    const firstDayOfMonth = getDay(startOfMonth(currentMonth));
    const emptyDays = Array(firstDayOfMonth).fill(null);

    const selectedDateEvents = getEventsForDate(selectedDate);
    const upcomingEvents = events
        .filter(e => new Date(e.start_date) >= new Date())
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

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
                    <Text style={styles.headerTitle}>Events</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="add" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
                        onPress={() => setActiveTab('calendar')}
                    >
                        <Ionicons
                            name="calendar"
                            size={18}
                            color={activeTab === 'calendar' ? Colors.primary[500] : Colors.text.muted}
                        />
                        <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
                            Calendar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Ionicons
                            name="list"
                            size={18}
                            color={activeTab === 'upcoming' ? Colors.primary[500] : Colors.text.muted}
                        />
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                            Upcoming
                        </Text>
                    </TouchableOpacity>
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
                    {activeTab === 'calendar' && (
                        <>
                            {/* Month Navigation */}
                            <View style={styles.monthNavigation}>
                                <TouchableOpacity
                                    style={styles.monthNavButton}
                                    onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                >
                                    <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
                                </TouchableOpacity>
                                <Text style={styles.monthTitle}>
                                    {format(currentMonth, 'MMMM yyyy')}
                                </Text>
                                <TouchableOpacity
                                    style={styles.monthNavButton}
                                    onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                >
                                    <Ionicons name="chevron-forward" size={20} color={Colors.text.primary} />
                                </TouchableOpacity>
                            </View>

                            {/* Calendar Grid */}
                            <Card variant="glass" style={styles.calendarCard}>
                                {/* Week days header */}
                                <View style={styles.weekDaysHeader}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <Text key={day} style={styles.weekDayText}>{day}</Text>
                                    ))}
                                </View>

                                {/* Calendar days */}
                                <View style={styles.calendarGrid}>
                                    {emptyDays.map((_, index) => (
                                        <View key={`empty-${index}`} style={styles.calendarDay} />
                                    ))}
                                    {days.map((day) => {
                                        const isSelected = isSameDay(day, selectedDate);
                                        const isTodayDate = isToday(day);
                                        const dayHasEvents = hasEvents(day);

                                        return (
                                            <TouchableOpacity
                                                key={day.toISOString()}
                                                style={[
                                                    styles.calendarDay,
                                                    isSelected && styles.selectedDay,
                                                    isTodayDate && !isSelected && styles.todayDay,
                                                ]}
                                                onPress={() => setSelectedDate(day)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.calendarDayText,
                                                        isSelected && styles.selectedDayText,
                                                        isTodayDate && !isSelected && styles.todayDayText,
                                                    ]}
                                                >
                                                    {format(day, 'd')}
                                                </Text>
                                                {dayHasEvents && (
                                                    <View style={[
                                                        styles.eventDot,
                                                        isSelected && styles.selectedEventDot
                                                    ]} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </Card>

                            {/* Selected Date Events */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
                                </Text>
                                <Text style={styles.eventCount}>
                                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                                </Text>
                            </View>

                            {selectedDateEvents.length > 0 ? (
                                <View style={styles.eventsList}>
                                    {selectedDateEvents.map((event) => {
                                        const typeInfo = getEventTypeInfo(event.event_type);
                                        return (
                                            <Card key={event.id} variant="glass" style={styles.eventCard}>
                                                <View style={[styles.eventTypeBar, { backgroundColor: typeInfo.color }]} />
                                                <View style={styles.eventContent}>
                                                    <View style={styles.eventHeader}>
                                                        <View style={[styles.eventIcon, { backgroundColor: typeInfo.color + '20' }]}>
                                                            <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                                                        </View>
                                                        <View style={styles.eventInfo}>
                                                            <Text style={styles.eventTitle}>{event.title}</Text>
                                                            <Text style={styles.eventType}>{event.event_type}</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.eventDescription} numberOfLines={2}>
                                                        {event.description}
                                                    </Text>
                                                    <View style={styles.eventMeta}>
                                                        <View style={styles.metaItem}>
                                                            <Ionicons name="location-outline" size={14} color={Colors.text.muted} />
                                                            <Text style={styles.metaText}>{event.location}</Text>
                                                        </View>
                                                        <View style={styles.metaItem}>
                                                            <Ionicons name="person-outline" size={14} color={Colors.text.muted} />
                                                            <Text style={styles.metaText}>{event.organizer}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Card>
                                        );
                                    })}
                                </View>
                            ) : (
                                <Card variant="glass" style={styles.noEventsCard}>
                                    <Ionicons name="calendar-outline" size={40} color={Colors.text.muted} />
                                    <Text style={styles.noEventsText}>No events scheduled</Text>
                                    <Text style={styles.noEventsSubtext}>Tap + to add an event</Text>
                                </Card>
                            )}
                        </>
                    )}

                    {activeTab === 'upcoming' && (
                        <View style={styles.upcomingList}>
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => {
                                    const typeInfo = getEventTypeInfo(event.event_type);
                                    const eventDate = new Date(event.start_date);
                                    return (
                                        <Card key={event.id} variant="glass" style={styles.upcomingCard}>
                                            <View style={styles.upcomingDateBadge}>
                                                <Text style={styles.upcomingDay}>{format(eventDate, 'd')}</Text>
                                                <Text style={styles.upcomingMonth}>{format(eventDate, 'MMM')}</Text>
                                            </View>
                                            <View style={styles.upcomingContent}>
                                                <View style={styles.upcomingHeader}>
                                                    <Text style={styles.upcomingTitle}>{event.title}</Text>
                                                    <View style={[styles.upcomingTypeBadge, { backgroundColor: typeInfo.color + '20' }]}>
                                                        <Ionicons name={typeInfo.icon as any} size={12} color={typeInfo.color} />
                                                        <Text style={[styles.upcomingTypeText, { color: typeInfo.color }]}>
                                                            {event.event_type}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.upcomingDescription} numberOfLines={1}>
                                                    {event.description}
                                                </Text>
                                                <View style={styles.upcomingMeta}>
                                                    <Ionicons name="location-outline" size={12} color={Colors.text.muted} />
                                                    <Text style={styles.upcomingMetaText}>{event.location}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.upcomingArrow}>
                                                <Ionicons name="chevron-forward" size={20} color={Colors.primary[400]} />
                                            </TouchableOpacity>
                                        </Card>
                                    );
                                })
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="calendar-outline" size={64} color={Colors.text.muted} />
                                    <Text style={styles.emptyTitle}>No Upcoming Events</Text>
                                    <Text style={styles.emptySubtitle}>Check back later for new events</Text>
                                </View>
                            )}
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
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.glass.background,
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: Colors.background.tertiary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary[500],
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    monthNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    monthNavButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    calendarCard: {
        padding: 16,
        marginBottom: 20,
    },
    weekDaysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.glass.border,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.text.muted,
        width: (width - 72) / 7,
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: (width - 72) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    selectedDay: {
        backgroundColor: Colors.primary[500],
        borderRadius: 12,
    },
    todayDay: {
        borderWidth: 1,
        borderColor: Colors.primary[500],
        borderRadius: 12,
    },
    calendarDayText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    selectedDayText: {
        color: Colors.white,
    },
    todayDayText: {
        color: Colors.primary[500],
    },
    eventDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: Colors.primary[500],
        marginTop: 2,
    },
    selectedEventDot: {
        backgroundColor: Colors.white,
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
    eventCount: {
        fontSize: 14,
        color: Colors.text.muted,
    },
    eventsList: {
        gap: 12,
    },
    eventCard: {
        flexDirection: 'row',
        padding: 0,
        overflow: 'hidden',
    },
    eventTypeBar: {
        width: 4,
    },
    eventContent: {
        flex: 1,
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    eventType: {
        fontSize: 12,
        color: Colors.text.muted,
        textTransform: 'capitalize',
    },
    eventDescription: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 12,
        lineHeight: 20,
    },
    eventMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    noEventsCard: {
        alignItems: 'center',
        padding: 32,
    },
    noEventsText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.secondary,
        marginTop: 12,
    },
    noEventsSubtext: {
        fontSize: 13,
        color: Colors.text.muted,
        marginTop: 4,
    },
    upcomingList: {
        gap: 12,
    },
    upcomingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    upcomingDateBadge: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: Colors.primary[500] + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    upcomingDay: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.primary[400],
    },
    upcomingMonth: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.primary[400],
        textTransform: 'uppercase',
    },
    upcomingContent: {
        flex: 1,
    },
    upcomingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    upcomingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        flex: 1,
        marginRight: 8,
    },
    upcomingTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    upcomingTypeText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    upcomingDescription: {
        fontSize: 13,
        color: Colors.text.muted,
        marginBottom: 6,
    },
    upcomingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    upcomingMetaText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    upcomingArrow: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.primary[500] + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.text.muted,
    },
});

export default EventsScreen;
