import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');

interface ScheduleItem {
    id: number;
    subject: string;
    teacher: string;
    room: string;
    startTime: string;
    endTime: string;
    type: 'lecture' | 'lab' | 'tutorial' | 'break';
}

interface DaySchedule {
    date: Date;
    dayName: string;
    items: ScheduleItem[];
}

const ScheduleScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

    // Generate week days
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => ({
        date: addDays(startOfCurrentWeek, i),
        dayName: format(addDays(startOfCurrentWeek, i), 'EEE'),
        dayNumber: format(addDays(startOfCurrentWeek, i), 'd'),
    }));

    // Sample schedule data
    const scheduleData: ScheduleItem[] = [
        { id: 1, subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', startTime: '09:00', endTime: '10:00', type: 'lecture' },
        { id: 2, subject: 'Physics', teacher: 'Prof. Johnson', room: 'Room 102', startTime: '10:15', endTime: '11:15', type: 'lecture' },
        { id: 3, subject: 'Break', teacher: '', room: 'Cafeteria', startTime: '11:15', endTime: '11:30', type: 'break' },
        { id: 4, subject: 'Chemistry Lab', teacher: 'Dr. Williams', room: 'Lab 201', startTime: '11:30', endTime: '13:00', type: 'lab' },
        { id: 5, subject: 'Lunch Break', teacher: '', room: 'Cafeteria', startTime: '13:00', endTime: '14:00', type: 'break' },
        { id: 6, subject: 'English', teacher: 'Ms. Davis', room: 'Room 105', startTime: '14:00', endTime: '15:00', type: 'lecture' },
        { id: 7, subject: 'Computer Science', teacher: 'Mr. Brown', room: 'Lab 301', startTime: '15:15', endTime: '16:15', type: 'lab' },
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'lecture': return Colors.primary[500];
            case 'lab': return Colors.accent.purple;
            case 'tutorial': return Colors.secondary[500];
            case 'break': return Colors.neutral[500];
            default: return Colors.info.main;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'lecture': return 'book';
            case 'lab': return 'flask';
            case 'tutorial': return 'people';
            case 'break': return 'cafe';
            default: return 'time';
        }
    };

    const isCurrentPeriod = (startTime: string, endTime: string) => {
        const now = new Date();
        const currentTime = format(now, 'HH:mm');
        return currentTime >= startTime && currentTime < endTime && isToday(selectedDate);
    };

    const getProgress = (startTime: string, endTime: string) => {
        if (!isCurrentPeriod(startTime, endTime)) return 0;
        const now = new Date();
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        return ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
    };

    const todaySchedule = scheduleData.filter(item => item.type !== 'break');
    const currentPeriodIndex = scheduleData.findIndex(item => isCurrentPeriod(item.startTime, item.endTime));

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
                    <Text style={styles.headerTitle}>Schedule</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="calendar-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Week Selector */}
                <View style={styles.weekSelector}>
                    <Text style={styles.monthLabel}>{format(selectedDate, 'MMMM yyyy')}</Text>
                    <View style={styles.weekDays}>
                        {weekDays.map((day) => {
                            const isSelected = isSameDay(day.date, selectedDate);
                            const isTodayDay = isToday(day.date);
                            return (
                                <TouchableOpacity
                                    key={day.date.toISOString()}
                                    style={[
                                        styles.dayButton,
                                        isSelected && styles.selectedDayButton,
                                    ]}
                                    onPress={() => setSelectedDate(day.date)}
                                >
                                    <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
                                        {day.dayName}
                                    </Text>
                                    <Text style={[
                                        styles.dayNumber,
                                        isSelected && styles.selectedDayText,
                                        isTodayDay && !isSelected && styles.todayText,
                                    ]}>
                                        {day.dayNumber}
                                    </Text>
                                    {isTodayDay && (
                                        <View style={[styles.todayDot, isSelected && styles.selectedTodayDot]} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Current Period Card */}
                    {currentPeriodIndex !== -1 && (
                        <Card variant="gradient" style={styles.currentPeriodCard} gradientColors={['#6366F1', '#8B5CF6']}>
                            <View style={styles.currentPeriodHeader}>
                                <View style={styles.liveIndicator}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveText}>LIVE</Text>
                                </View>
                                <Text style={styles.currentPeriodTime}>
                                    {scheduleData[currentPeriodIndex].startTime} - {scheduleData[currentPeriodIndex].endTime}
                                </Text>
                            </View>
                            <Text style={styles.currentPeriodSubject}>{scheduleData[currentPeriodIndex].subject}</Text>
                            <View style={styles.currentPeriodDetails}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="person" size={14} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.detailText}>{scheduleData[currentPeriodIndex].teacher}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.detailText}>{scheduleData[currentPeriodIndex].room}</Text>
                                </View>
                            </View>
                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${getProgress(scheduleData[currentPeriodIndex].startTime, scheduleData[currentPeriodIndex].endTime)}%` }]} />
                                </View>
                                <Text style={styles.progressText}>
                                    {Math.round(getProgress(scheduleData[currentPeriodIndex].startTime, scheduleData[currentPeriodIndex].endTime))}% completed
                                </Text>
                            </View>
                        </Card>
                    )}

                    {/* Today's Summary */}
                    <View style={styles.summaryRow}>
                        <Card variant="glass" style={styles.summaryCard}>
                            <Ionicons name="book" size={24} color={Colors.primary[500]} />
                            <Text style={styles.summaryValue}>{todaySchedule.length}</Text>
                            <Text style={styles.summaryLabel}>Classes</Text>
                        </Card>
                        <Card variant="glass" style={styles.summaryCard}>
                            <Ionicons name="time" size={24} color={Colors.accent.purple} />
                            <Text style={styles.summaryValue}>6.5h</Text>
                            <Text style={styles.summaryLabel}>Duration</Text>
                        </Card>
                        <Card variant="glass" style={styles.summaryCard}>
                            <Ionicons name="flask" size={24} color={Colors.secondary[500]} />
                            <Text style={styles.summaryValue}>2</Text>
                            <Text style={styles.summaryLabel}>Labs</Text>
                        </Card>
                    </View>

                    {/* Schedule List */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, 'EEEE\'s Schedule')}
                        </Text>
                    </View>

                    <View style={styles.scheduleList}>
                        {scheduleData.map((item, index) => {
                            const isCurrent = isCurrentPeriod(item.startTime, item.endTime);
                            const isPast = !isCurrent && (
                                format(new Date(), 'HH:mm') > item.endTime && isToday(selectedDate)
                            );

                            return (
                                <View key={item.id} style={styles.scheduleItem}>
                                    {/* Timeline */}
                                    <View style={styles.timeline}>
                                        <Text style={[styles.timeText, isPast && styles.pastText]}>
                                            {item.startTime}
                                        </Text>
                                        <View style={styles.timelineDots}>
                                            <View style={[
                                                styles.timelineDot,
                                                { backgroundColor: getTypeColor(item.type) },
                                                isCurrent && styles.currentDot,
                                                isPast && styles.pastDot,
                                            ]} />
                                            {index < scheduleData.length - 1 && (
                                                <View style={[styles.timelineLine, isPast && styles.pastLine]} />
                                            )}
                                        </View>
                                    </View>

                                    {/* Content */}
                                    <Card
                                        variant={item.type === 'break' ? 'default' : 'glass'}
                                        style={[
                                            styles.scheduleCard,
                                            item.type === 'break' && styles.breakCard,
                                            isCurrent && styles.currentCard,
                                            isPast && styles.pastCard,
                                        ]}
                                    >
                                        {item.type !== 'break' && (
                                            <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
                                        )}
                                        <View style={styles.scheduleCardContent}>
                                            <View style={styles.scheduleCardHeader}>
                                                <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                                                    <Ionicons name={getTypeIcon(item.type) as any} size={16} color={getTypeColor(item.type)} />
                                                </View>
                                                <View style={styles.scheduleInfo}>
                                                    <Text style={[styles.scheduleSubject, isPast && styles.pastText]}>
                                                        {item.subject}
                                                    </Text>
                                                    {item.teacher && (
                                                        <Text style={styles.scheduleTeacher}>{item.teacher}</Text>
                                                    )}
                                                </View>
                                                {item.type !== 'break' && (
                                                    <View style={styles.durationBadge}>
                                                        <Text style={styles.durationText}>
                                                            {item.startTime} - {item.endTime}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {item.room && item.type !== 'break' && (
                                                <View style={styles.roomInfo}>
                                                    <Ionicons name="location-outline" size={12} color={Colors.text.muted} />
                                                    <Text style={styles.roomText}>{item.room}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </Card>
                                </View>
                            );
                        })}
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
    weekSelector: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    monthLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.muted,
        marginBottom: 12,
        textAlign: 'center',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayButton: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
        minWidth: (width - 56) / 7,
    },
    selectedDayButton: {
        backgroundColor: Colors.primary[500],
    },
    dayName: {
        fontSize: 11,
        color: Colors.text.muted,
        marginBottom: 6,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    selectedDayText: {
        color: Colors.white,
    },
    todayText: {
        color: Colors.primary[500],
    },
    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary[500],
        marginTop: 4,
    },
    selectedTodayDot: {
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    currentPeriodCard: {
        padding: 20,
        marginBottom: 20,
    },
    currentPeriodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.white,
    },
    currentPeriodTime: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    currentPeriodSubject: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 10,
    },
    currentPeriodDetails: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    progressContainer: {},
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        marginBottom: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 3,
    },
    progressText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 11,
        color: Colors.text.muted,
        marginTop: 2,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    scheduleList: {},
    scheduleItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    timeline: {
        width: 60,
        alignItems: 'flex-end',
        paddingRight: 12,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.text.secondary,
        marginBottom: 6,
    },
    pastText: {
        color: Colors.text.muted,
    },
    timelineDots: {
        alignItems: 'center',
        flex: 1,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    currentDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.background.primary,
    },
    pastDot: {
        opacity: 0.5,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: Colors.glass.border,
        marginTop: 4,
    },
    pastLine: {
        opacity: 0.5,
    },
    scheduleCard: {
        flex: 1,
        flexDirection: 'row',
        padding: 0,
        marginBottom: 12,
        overflow: 'hidden',
    },
    breakCard: {
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        borderStyle: 'dashed',
    },
    currentCard: {
        borderWidth: 2,
        borderColor: Colors.primary[500],
    },
    pastCard: {
        opacity: 0.6,
    },
    typeIndicator: {
        width: 4,
    },
    scheduleCardContent: {
        flex: 1,
        padding: 14,
    },
    scheduleCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    scheduleInfo: {
        flex: 1,
    },
    scheduleSubject: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    scheduleTeacher: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    durationBadge: {
        backgroundColor: Colors.glass.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    durationText: {
        fontSize: 10,
        fontWeight: '500',
        color: Colors.text.secondary,
    },
    roomInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 4,
    },
    roomText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
});

export default ScheduleScreen;
