import React, { useState, useEffect } from 'react';
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
import { examResultsService } from '../../services/dataService';

const { width } = Dimensions.get('window');

interface ExamResult {
    id: number;
    subject: string;
    examType: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
    percentage: number;
    rank: number;
    status: 'pass' | 'fail';
}

interface Semester {
    id: number;
    name: string;
    year: string;
    sgpa: number;
    results: ExamResult[];
}

const ResultsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

    // Sample data
    const semesters: Semester[] = [
        {
            id: 1,
            name: 'Semester 1',
            year: '2025-26',
            sgpa: 8.5,
            results: [
                { id: 1, subject: 'Mathematics', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 92, grade: 'A+', percentage: 92, rank: 5, status: 'pass' },
                { id: 2, subject: 'Physics', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 88, grade: 'A', percentage: 88, rank: 8, status: 'pass' },
                { id: 3, subject: 'Chemistry', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 85, grade: 'A', percentage: 85, rank: 12, status: 'pass' },
                { id: 4, subject: 'English', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 90, grade: 'A+', percentage: 90, rank: 6, status: 'pass' },
                { id: 5, subject: 'Computer Science', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 95, grade: 'A+', percentage: 95, rank: 2, status: 'pass' },
                { id: 6, subject: 'Hindi', examType: 'Mid-Term', maxMarks: 100, obtainedMarks: 78, grade: 'B+', percentage: 78, rank: 18, status: 'pass' },
            ],
        },
        {
            id: 2,
            name: 'Semester 2',
            year: '2024-25',
            sgpa: 8.2,
            results: [
                { id: 7, subject: 'Mathematics', examType: 'Final', maxMarks: 100, obtainedMarks: 88, grade: 'A', percentage: 88, rank: 7, status: 'pass' },
                { id: 8, subject: 'Physics', examType: 'Final', maxMarks: 100, obtainedMarks: 82, grade: 'A', percentage: 82, rank: 15, status: 'pass' },
                { id: 9, subject: 'Chemistry', examType: 'Final', maxMarks: 100, obtainedMarks: 79, grade: 'B+', percentage: 79, rank: 20, status: 'pass' },
                { id: 10, subject: 'English', examType: 'Final', maxMarks: 100, obtainedMarks: 86, grade: 'A', percentage: 86, rank: 10, status: 'pass' },
            ],
        },
    ];

    const currentSemester = semesters[selectedSemester];

    const fetchResults = async () => {
        try {
            const resultsData = await examResultsService.getAll().catch(() => ({ results: [] }));
            // Map API data if available
        } catch (error) {
            console.log('Error fetching results:', error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchResults();
        setRefreshing(false);
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+': return Colors.success.main;
            case 'A': return Colors.primary[500];
            case 'B+': return Colors.info.main;
            case 'B': return Colors.warning.main;
            case 'C': return Colors.accent.orange;
            default: return Colors.error.main;
        }
    };

    const getOverallStats = () => {
        const results = currentSemester.results;
        const totalMarks = results.reduce((sum, r) => sum + r.maxMarks, 0);
        const obtainedMarks = results.reduce((sum, r) => sum + r.obtainedMarks, 0);
        const percentage = (obtainedMarks / totalMarks) * 100;
        const passedSubjects = results.filter(r => r.status === 'pass').length;
        const bestSubject = results.reduce((best, r) => r.percentage > best.percentage ? r : best);
        const worstSubject = results.reduce((worst, r) => r.percentage < worst.percentage ? r : worst);

        return {
            totalMarks,
            obtainedMarks,
            percentage: percentage.toFixed(1),
            passedSubjects,
            totalSubjects: results.length,
            bestSubject,
            worstSubject,
        };
    };

    const stats = getOverallStats();

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
                    <Text style={styles.headerTitle}>Exam Results</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="download-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Semester Selector */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.semesterSelector}
                >
                    {semesters.map((semester, index) => (
                        <TouchableOpacity
                            key={semester.id}
                            style={[
                                styles.semesterChip,
                                selectedSemester === index && styles.activeSemesterChip,
                            ]}
                            onPress={() => setSelectedSemester(index)}
                        >
                            <Text style={[
                                styles.semesterChipText,
                                selectedSemester === index && styles.activeSemesterChipText,
                            ]}>
                                {semester.name}
                            </Text>
                            <Text style={[
                                styles.semesterYearText,
                                selectedSemester === index && styles.activeSemesterChipText,
                            ]}>
                                {semester.year}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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
                    {/* Overall Performance Card */}
                    <Card variant="gradient" style={styles.performanceCard} gradientColors={['#6366F1', '#8B5CF6'] as string[]}>
                        <View style={styles.performanceHeader}>
                            <View>
                                <Text style={styles.performanceLabel}>Overall Percentage</Text>
                                <Text style={styles.performanceValue}>{stats.percentage}%</Text>
                            </View>
                            <View style={styles.sgpaContainer}>
                                <Text style={styles.sgpaLabel}>SGPA</Text>
                                <Text style={styles.sgpaValue}>{currentSemester.sgpa}</Text>
                            </View>
                        </View>
                        <View style={styles.performanceStats}>
                            <View style={styles.performanceStat}>
                                <Text style={styles.performanceStatValue}>{stats.obtainedMarks}</Text>
                                <Text style={styles.performanceStatLabel}>Obtained</Text>
                            </View>
                            <View style={styles.performanceStatDivider} />
                            <View style={styles.performanceStat}>
                                <Text style={styles.performanceStatValue}>{stats.totalMarks}</Text>
                                <Text style={styles.performanceStatLabel}>Total Marks</Text>
                            </View>
                            <View style={styles.performanceStatDivider} />
                            <View style={styles.performanceStat}>
                                <Text style={styles.performanceStatValue}>{stats.passedSubjects}/{stats.totalSubjects}</Text>
                                <Text style={styles.performanceStatLabel}>Passed</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.success.main + '20' }]}>
                                <Ionicons name="trending-up" size={18} color={Colors.success.main} />
                            </View>
                            <Text style={styles.quickStatLabel}>Best Subject</Text>
                            <Text style={styles.quickStatValue}>{stats.bestSubject.subject}</Text>
                            <Text style={[styles.quickStatPercentage, { color: Colors.success.main }]}>
                                {stats.bestSubject.percentage}%
                            </Text>
                        </Card>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.warning.main + '20' }]}>
                                <Ionicons name="trending-down" size={18} color={Colors.warning.main} />
                            </View>
                            <Text style={styles.quickStatLabel}>Needs Focus</Text>
                            <Text style={styles.quickStatValue}>{stats.worstSubject.subject}</Text>
                            <Text style={[styles.quickStatPercentage, { color: Colors.warning.main }]}>
                                {stats.worstSubject.percentage}%
                            </Text>
                        </Card>
                    </View>

                    {/* Tab Bar */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                            onPress={() => setActiveTab('overview')}
                        >
                            <Ionicons
                                name="grid-outline"
                                size={16}
                                color={activeTab === 'overview' ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                                Overview
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'detailed' && styles.activeTab]}
                            onPress={() => setActiveTab('detailed')}
                        >
                            <Ionicons
                                name="list-outline"
                                size={16}
                                color={activeTab === 'detailed' ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'detailed' && styles.activeTabText]}>
                                Detailed
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Results List */}
                    {activeTab === 'overview' ? (
                        <View style={styles.resultsGrid}>
                            {currentSemester.results.map((result) => (
                                <Card key={result.id} variant="glass" style={styles.resultGridCard}>
                                    <View style={[styles.gradeCircle, { backgroundColor: getGradeColor(result.grade) + '20' }]}>
                                        <Text style={[styles.gradeText, { color: getGradeColor(result.grade) }]}>
                                            {result.grade}
                                        </Text>
                                    </View>
                                    <Text style={styles.subjectName} numberOfLines={1}>{result.subject}</Text>
                                    <Text style={styles.marksText}>{result.obtainedMarks}/{result.maxMarks}</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${result.percentage}%`,
                                                    backgroundColor: getGradeColor(result.grade),
                                                }
                                            ]}
                                        />
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.detailedList}>
                            {currentSemester.results.map((result) => (
                                <Card key={result.id} variant="glass" style={styles.detailedCard}>
                                    <View style={styles.detailedHeader}>
                                        <View style={[styles.subjectIcon, { backgroundColor: getGradeColor(result.grade) + '20' }]}>
                                            <Ionicons name="book" size={20} color={getGradeColor(result.grade)} />
                                        </View>
                                        <View style={styles.detailedInfo}>
                                            <Text style={styles.detailedSubject}>{result.subject}</Text>
                                            <Text style={styles.examType}>{result.examType}</Text>
                                        </View>
                                        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(result.grade) + '20' }]}>
                                            <Text style={[styles.gradeBadgeText, { color: getGradeColor(result.grade) }]}>
                                                {result.grade}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.detailedStats}>
                                        <View style={styles.detailedStat}>
                                            <Text style={styles.detailedStatLabel}>Marks</Text>
                                            <Text style={styles.detailedStatValue}>{result.obtainedMarks}/{result.maxMarks}</Text>
                                        </View>
                                        <View style={styles.detailedStat}>
                                            <Text style={styles.detailedStatLabel}>Percentage</Text>
                                            <Text style={styles.detailedStatValue}>{result.percentage}%</Text>
                                        </View>
                                        <View style={styles.detailedStat}>
                                            <Text style={styles.detailedStatLabel}>Class Rank</Text>
                                            <Text style={styles.detailedStatValue}>#{result.rank}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.fullProgressBar}>
                                        <View
                                            style={[
                                                styles.fullProgressFill,
                                                {
                                                    width: `${result.percentage}%`,
                                                    backgroundColor: getGradeColor(result.grade),
                                                }
                                            ]}
                                        />
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
    semesterSelector: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    semesterChip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Colors.glass.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        alignItems: 'center',
    },
    activeSemesterChip: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
    },
    semesterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    semesterYearText: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    activeSemesterChipText: {
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    performanceCard: {
        padding: 20,
        marginBottom: 16,
    },
    performanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    performanceLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    performanceValue: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.white,
    },
    sgpaContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
    },
    sgpaLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    sgpaValue: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.white,
    },
    performanceStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    performanceStat: {
        flex: 1,
        alignItems: 'center',
    },
    performanceStatValue: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    performanceStatLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    performanceStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    quickStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    quickStatCard: {
        flex: 1,
        padding: 14,
    },
    quickStatIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickStatLabel: {
        fontSize: 11,
        color: Colors.text.muted,
    },
    quickStatValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginTop: 2,
    },
    quickStatPercentage: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 4,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.glass.background,
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: Colors.background.tertiary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary[500],
        fontWeight: '600',
    },
    resultsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    resultGridCard: {
        width: (width - 52) / 2,
        padding: 16,
        alignItems: 'center',
    },
    gradeCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gradeText: {
        fontSize: 18,
        fontWeight: '700',
    },
    subjectName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    marksText: {
        fontSize: 12,
        color: Colors.text.muted,
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: Colors.glass.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    detailedList: {
        gap: 12,
    },
    detailedCard: {
        padding: 16,
    },
    detailedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    subjectIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailedInfo: {
        flex: 1,
    },
    detailedSubject: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    examType: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    gradeBadgeText: {
        fontSize: 14,
        fontWeight: '700',
    },
    detailedStats: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    detailedStat: {
        flex: 1,
    },
    detailedStatLabel: {
        fontSize: 11,
        color: Colors.text.muted,
        marginBottom: 2,
    },
    detailedStatValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    fullProgressBar: {
        width: '100%',
        height: 6,
        backgroundColor: Colors.glass.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    fullProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
});

export default ResultsScreen;
