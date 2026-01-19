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

import { Card, StatCard } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { format, startOfWeek, addDays } from 'date-fns';

const { width } = Dimensions.get('window');

const AttendanceScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    // Generate week days
    const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

    // Sample attendance data
    const attendanceStats = {
        totalDays: 180,
        present: 165,
        absent: 8,
        late: 5,
        excused: 2,
        attendanceRate: 91.7,
    };

    const todayClasses = [
        { id: 1, subject: 'Mathematics', time: '09:00 - 10:00', status: 'present', teacher: 'Dr. Smith' },
        { id: 2, subject: 'Physics', time: '10:15 - 11:15', status: 'present', teacher: 'Prof. Johnson' },
        { id: 3, subject: 'Chemistry', time: '11:30 - 12:30', status: 'present', teacher: 'Dr. Williams' },
        { id: 4, subject: 'English', time: '14:00 - 15:00', status: 'upcoming', teacher: 'Ms. Davis' },
        { id: 5, subject: 'Computer Science', time: '15:15 - 16:15', status: 'upcoming', teacher: 'Mr. Brown' },
    ];

    const weeklyAttendance = [
        { day: 'Mon', status: 'present' },
        { day: 'Tue', status: 'present' },
        { day: 'Wed', status: 'late' },
        { day: 'Thu', status: 'present' },
        { day: 'Fri', status: 'absent' },
        { day: 'Sat', status: 'holiday' },
        { day: 'Sun', status: 'holiday' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return { icon: 'checkmark-circle', color: Colors.success.main };
            case 'absent': return { icon: 'close-circle', color: Colors.error.main };
            case 'late': return { icon: 'time', color: Colors.warning.main };
            case 'excused': return { icon: 'medical', color: Colors.info.main };
            case 'upcoming': return { icon: 'ellipsis-horizontal-circle', color: Colors.neutral[500] };
            case 'holiday': return { icon: 'sunny', color: Colors.accent.yellow };
            default: return { icon: 'help-circle', color: Colors.neutral[500] };
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
                    <Text style={styles.headerTitle}>Attendance</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="calendar-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Attendance Rate Card */}
                    <Card variant="gradient" style={styles.rateCard} gradientColors={['#10B981', '#059669']}>
                        <View style={styles.rateContent}>
                            <View style={styles.rateCircle}>
                                <Text style={styles.ratePercentage}>{attendanceStats.attendanceRate}%</Text>
                                <Text style={styles.rateLabel}>Attendance</Text>
                            </View>
                            <View style={styles.rateStats}>
                                <View style={styles.rateStat}>
                                    <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                                    <Text style={styles.rateStatValue}>{attendanceStats.present}</Text>
                                    <Text style={styles.rateStatLabel}>Present</Text>
                                </View>
                                <View style={styles.rateStat}>
                                    <Ionicons name="close-circle" size={20} color={Colors.white} />
                                    <Text style={styles.rateStatValue}>{attendanceStats.absent}</Text>
                                    <Text style={styles.rateStatLabel}>Absent</Text>
                                </View>
                                <View style={styles.rateStat}>
                                    <Ionicons name="time" size={20} color={Colors.white} />
                                    <Text style={styles.rateStatValue}>{attendanceStats.late}</Text>
                                    <Text style={styles.rateStatLabel}>Late</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Week Calendar */}
                    <View style={styles.weekCalendar}>
                        <Text style={styles.weekLabel}>{format(selectedDate, 'MMMM yyyy')}</Text>
                        <View style={styles.weekDays}>
                            {weekDays.map((day, index) => {
                                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                                const attendance = weeklyAttendance[index];
                                const statusInfo = getStatusIcon(attendance.status);

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.dayButton, isSelected && styles.selectedDayButton]}
                                        onPress={() => setSelectedDate(day)}
                                    >
                                        <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
                                            {format(day, 'EEE')}
                                        </Text>
                                        <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
                                            {format(day, 'd')}
                                        </Text>
                                        <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Today's Classes */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Classes</Text>
                        <Text style={styles.sectionSubtitle}>{format(selectedDate, 'EEEE, MMM d')}</Text>
                    </View>

                    <View style={styles.classesList}>
                        {todayClasses.map((classItem, index) => {
                            const statusInfo = getStatusIcon(classItem.status);
                            const isUpcoming = classItem.status === 'upcoming';

                            return (
                                <Card
                                    key={classItem.id}
                                    variant="glass"
                                    style={isUpcoming ? [styles.classCard, styles.upcomingCard] : styles.classCard}
                                >
                                    <View style={styles.classTimeline}>
                                        <View style={[styles.timelineDot, { backgroundColor: statusInfo.color }]} />
                                        {index < todayClasses.length - 1 && (
                                            <View style={[styles.timelineLine, isUpcoming && styles.timelineLineDashed]} />
                                        )}
                                    </View>
                                    <View style={styles.classContent}>
                                        <View style={styles.classHeader}>
                                            <View>
                                                <Text style={styles.classSubject}>{classItem.subject}</Text>
                                                <Text style={styles.classTeacher}>{classItem.teacher}</Text>
                                            </View>
                                            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                                                <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
                                                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.classTime}>
                                            <Ionicons name="time-outline" size={14} color={Colors.text.muted} />
                                            <Text style={styles.timeText}>{classItem.time}</Text>
                                        </View>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>

                    {/* Monthly Stats */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>This Month</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Working Days"
                            value={attendanceStats.totalDays}
                            icon="calendar"
                            iconColor={Colors.primary[500]}
                        />
                        <StatCard
                            title="Present Days"
                            value={attendanceStats.present}
                            icon="checkmark-done"
                            iconColor={Colors.success.main}
                        />
                    </View>

                    {/* Attendance Legend */}
                    <Card variant="glass" style={styles.legendCard}>
                        <Text style={styles.legendTitle}>Status Legend</Text>
                        <View style={styles.legendGrid}>
                            {[
                                { label: 'Present', status: 'present' },
                                { label: 'Absent', status: 'absent' },
                                { label: 'Late', status: 'late' },
                                { label: 'Excused', status: 'excused' },
                            ].map((item) => {
                                const statusInfo = getStatusIcon(item.status);
                                return (
                                    <View key={item.status} style={styles.legendItem}>
                                        <Ionicons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
                                        <Text style={styles.legendLabel}>{item.label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Card>

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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    rateCard: {
        marginBottom: 20,
        padding: 20,
    },
    rateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rateCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratePercentage: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
    },
    rateLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
    },
    rateStats: {
        flex: 1,
        marginLeft: 24,
        gap: 12,
    },
    rateStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rateStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
    },
    rateStatLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
    },
    weekCalendar: {
        marginBottom: 24,
    },
    weekLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
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
        borderRadius: 12,
        minWidth: (width - 56) / 7,
    },
    selectedDayButton: {
        backgroundColor: Colors.primary[500],
    },
    dayName: {
        fontSize: 11,
        color: Colors.text.muted,
        marginBottom: 4,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 6,
    },
    selectedDayText: {
        color: Colors.white,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
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
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.text.muted,
    },
    classesList: {
        marginBottom: 24,
    },
    classCard: {
        flexDirection: 'row',
        padding: 0,
        marginBottom: 0,
        overflow: 'visible',
    },
    upcomingCard: {
        opacity: 0.7,
    },
    classTimeline: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingLeft: 16,
        width: 36,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    timelineLine: {
        position: 'absolute',
        top: 28,
        width: 2,
        height: '100%',
        backgroundColor: Colors.glass.border,
    },
    timelineLineDashed: {
        opacity: 0.5,
    },
    classContent: {
        flex: 1,
        padding: 16,
        paddingLeft: 8,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    classSubject: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    classTeacher: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    classTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeText: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    legendCard: {
        padding: 16,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 12,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '45%',
    },
    legendLabel: {
        fontSize: 14,
        color: Colors.text.primary,
    },
});

export default AttendanceScreen;
