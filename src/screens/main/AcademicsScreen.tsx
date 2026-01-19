import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Card, FeatureCard } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { coursesService, assignmentsService, examsService } from '../../services/dataService';
import { Course, Assignment, Exam } from '../../types';
import { format } from 'date-fns';

const AcademicsScreen: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'exams'>('courses');
    const [courses, setCourses] = useState<Course[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);

    // Sample data for UI
    const sampleCourses: Course[] = [
        { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Advanced Mathematics', grade_id: 1, credit_hours: 4, is_active: true },
        { id: 2, name: 'Physics', code: 'PHY101', description: 'General Physics', grade_id: 1, credit_hours: 4, is_active: true },
        { id: 3, name: 'Chemistry', code: 'CHEM101', description: 'Organic Chemistry', grade_id: 1, credit_hours: 3, is_active: true },
        { id: 4, name: 'English Literature', code: 'ENG101', description: 'Classic Literature', grade_id: 1, credit_hours: 3, is_active: true },
        { id: 5, name: 'Computer Science', code: 'CS101', description: 'Programming Fundamentals', grade_id: 1, credit_hours: 4, is_active: true },
    ];

    const sampleAssignments = [
        { id: 1, title: 'Calculus Problem Set', course: 'Mathematics', dueDate: '2026-01-20', status: 'pending', progress: 60 },
        { id: 2, title: 'Lab Report: Motion', course: 'Physics', dueDate: '2026-01-18', status: 'pending', progress: 30 },
        { id: 3, title: 'Essay: Shakespeare', course: 'English Literature', dueDate: '2026-01-25', status: 'not_started', progress: 0 },
        { id: 4, title: 'Coding Assignment', course: 'Computer Science', dueDate: '2026-01-22', status: 'submitted', progress: 100 },
    ];

    const sampleExams = [
        { id: 1, name: 'Mid-Term: Mathematics', course: 'Mathematics', date: '2026-02-01', time: '09:00 AM', duration: '2h', room: 'Hall A' },
        { id: 2, name: 'Mid-Term: Physics', course: 'Physics', date: '2026-02-03', time: '10:00 AM', duration: '2h', room: 'Hall B' },
        { id: 3, name: 'Quiz: Chemistry', course: 'Chemistry', date: '2026-01-28', time: '02:00 PM', duration: '1h', room: 'Room 204' },
    ];

    const fetchData = async () => {
        try {
            const [coursesData, assignmentsData, examsData] = await Promise.all([
                coursesService.getAll().catch(() => ({ results: sampleCourses })),
                assignmentsService.getAll().catch(() => ({ results: [] })),
                examsService.getAll().catch(() => ({ results: [] })),
            ]);
            setCourses(coursesData.results || sampleCourses);
            setAssignments(assignmentsData.results || []);
            setExams(examsData.results || []);
        } catch (error) {
            console.log('Error fetching academics data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return Colors.success.main;
            case 'pending': return Colors.warning.main;
            case 'overdue': return Colors.error.main;
            default: return Colors.neutral[500];
        }
    };

    const getCourseIcon = (courseName: string) => {
        const name = courseName.toLowerCase();
        if (name.includes('math')) return 'calculator';
        if (name.includes('physics')) return 'planet';
        if (name.includes('chemistry')) return 'flask';
        if (name.includes('english') || name.includes('literature')) return 'book';
        if (name.includes('computer') || name.includes('programming')) return 'code-slash';
        if (name.includes('biology')) return 'leaf';
        if (name.includes('history')) return 'time';
        return 'school';
    };

    const getCourseColor = (index: number) => {
        const colors = [
            Colors.primary[500],
            Colors.secondary[500],
            Colors.accent.purple,
            Colors.accent.pink,
            Colors.accent.orange,
            Colors.info.main,
        ];
        return colors[index % colors.length];
    };

    const tabs = [
        { key: 'courses', label: 'Courses', icon: 'book-outline' },
        { key: 'assignments', label: 'Assignments', icon: 'document-text-outline' },
        { key: 'exams', label: 'Exams', icon: 'school-outline' },
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
                    <Text style={styles.headerTitle}>Academics</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                            onPress={() => setActiveTab(tab.key as any)}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={18}
                                color={activeTab === tab.key ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                                {tab.label}
                            </Text>
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
                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <View style={styles.coursesGrid}>
                            {(courses.length > 0 ? courses : sampleCourses).map((course, index) => (
                                <Card key={course.id} variant="glass" style={styles.courseCard} onPress={() => { }}>
                                    <View style={[styles.courseIconContainer, { backgroundColor: getCourseColor(index) + '20' }]}>
                                        <Ionicons
                                            name={getCourseIcon(course.name) as any}
                                            size={28}
                                            color={getCourseColor(index)}
                                        />
                                    </View>
                                    <Text style={styles.courseCode}>{course.code}</Text>
                                    <Text style={styles.courseName}>{course.name}</Text>
                                    <View style={styles.courseCredits}>
                                        <Ionicons name="time-outline" size={14} color={Colors.text.muted} />
                                        <Text style={styles.creditsText}>{course.credit_hours} Credits</Text>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {/* Assignments Tab */}
                    {activeTab === 'assignments' && (
                        <View style={styles.assignmentsList}>
                            {sampleAssignments.map((assignment) => (
                                <Card key={assignment.id} variant="glass" style={styles.assignmentCard} onPress={() => { }}>
                                    <View style={styles.assignmentHeader}>
                                        <View style={styles.assignmentInfo}>
                                            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                                            <Text style={styles.assignmentCourse}>{assignment.course}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assignment.status) + '20' }]}>
                                            <Text style={[styles.statusText, { color: getStatusColor(assignment.status) }]}>
                                                {assignment.status.replace('_', ' ').toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Progress Bar */}
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressBar}>
                                            <View
                                                style={[styles.progressFill, { width: `${assignment.progress}%`, backgroundColor: getStatusColor(assignment.status) }]}
                                            />
                                        </View>
                                        <Text style={styles.progressText}>{assignment.progress}%</Text>
                                    </View>

                                    <View style={styles.assignmentFooter}>
                                        <View style={styles.dueDateContainer}>
                                            <Ionicons name="calendar-outline" size={16} color={Colors.text.muted} />
                                            <Text style={styles.dueDate}>Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.viewButton}>
                                            <Text style={styles.viewButtonText}>View</Text>
                                            <Ionicons name="arrow-forward" size={14} color={Colors.primary[500]} />
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {/* Exams Tab */}
                    {activeTab === 'exams' && (
                        <View style={styles.examsList}>
                            {sampleExams.map((exam) => (
                                <Card key={exam.id} variant="glass" style={styles.examCard} onPress={() => { }}>
                                    <View style={styles.examDateBadge}>
                                        <Text style={styles.examDay}>{new Date(exam.date).getDate()}</Text>
                                        <Text style={styles.examMonth}>{format(new Date(exam.date), 'MMM')}</Text>
                                    </View>
                                    <View style={styles.examContent}>
                                        <Text style={styles.examName}>{exam.name}</Text>
                                        <Text style={styles.examCourse}>{exam.course}</Text>
                                        <View style={styles.examDetails}>
                                            <View style={styles.examDetailItem}>
                                                <Ionicons name="time-outline" size={14} color={Colors.text.muted} />
                                                <Text style={styles.examDetailText}>{exam.time} ({exam.duration})</Text>
                                            </View>
                                            <View style={styles.examDetailItem}>
                                                <Ionicons name="location-outline" size={14} color={Colors.text.muted} />
                                                <Text style={styles.examDetailText}>{exam.room}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            ))}
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
    coursesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    courseCard: {
        width: '47%',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    courseIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    courseCode: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.text.muted,
        marginBottom: 4,
    },
    courseName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    courseCredits: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    creditsText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    assignmentsList: {
        gap: 12,
    },
    assignmentCard: {
        padding: 16,
    },
    assignmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    assignmentInfo: {
        flex: 1,
        marginRight: 12,
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    assignmentCourse: {
        fontSize: 14,
        color: Colors.text.muted,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: Colors.neutral[700],
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        width: 40,
        textAlign: 'right',
    },
    assignmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dueDate: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary[500],
    },
    examsList: {
        gap: 12,
    },
    examCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    examDateBadge: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: Colors.accent.purple + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    examDay: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.accent.purple,
    },
    examMonth: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.accent.purple,
        textTransform: 'uppercase',
    },
    examContent: {
        flex: 1,
    },
    examName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    examCourse: {
        fontSize: 14,
        color: Colors.text.muted,
        marginBottom: 8,
    },
    examDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    examDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    examDetailText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
});

export default AcademicsScreen;
