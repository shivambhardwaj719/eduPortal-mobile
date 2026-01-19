import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { studentsService, facultyService } from '../../services/dataService';
import { Student, Faculty } from '../../types';
import { useAppSelector } from '../../hooks/useAppStore';

interface TabButtonProps {
    title: string;
    isActive: boolean;
    onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => (
    <TouchableOpacity
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const DirectoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState<'students' | 'staff'>('staff'); // Default to staff as it's more directory-like
    const [isLoading, setIsLoading] = useState(true);

    const [students, setStudents] = useState<Student[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [studentsData, facultyData] = await Promise.all([
                studentsService.getAll(),
                facultyService.getAll(),
            ]);

            setStudents(studentsData.results || []);
            setFaculty(facultyData.results || []);

        } catch (error) {
            console.error('Failed to fetch directory data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    const renderStudentItem = ({ item }: { item: Student }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    {item.profile_image ? (
                        <Image source={{ uri: item.profile_image }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: Colors.primary[100], justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ fontSize: 20, color: Colors.primary[600], fontWeight: 'bold' }}>{item.first_name[0]}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.subtitle}>{item.student_id}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <TouchableOpacity style={styles.contactRow} onPress={() => handleEmail(item.email)}>
                    <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} />
                    <Text style={styles.contactText}>{item.email}</Text>
                </TouchableOpacity>
                {item.phone && (
                    <TouchableOpacity style={styles.contactRow} onPress={() => handleCall(item.phone)}>
                        <Ionicons name="call-outline" size={20} color={Colors.text.secondary} />
                        <Text style={styles.contactText}>{item.phone}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderFacultyItem = ({ item }: { item: Faculty }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    {/* Placeholder for faculty image as interface might not have it strictly defined yet, using initials */}
                    <View style={[styles.avatar, { backgroundColor: Colors.accent.purple + '20', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 20, color: Colors.accent.purple, fontWeight: 'bold' }}>{item.first_name[0]}</Text>
                    </View>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.subtitle}>{item.designation || 'Faculty'}</Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: Colors.accent.purple + '20' }]}>
                    <Text style={[styles.roleText, { color: Colors.accent.purple }]}>{item.department || 'Academic'}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <TouchableOpacity style={styles.contactRow} onPress={() => handleEmail(item.email)}>
                    <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} />
                    <Text style={styles.contactText}>{item.email}</Text>
                </TouchableOpacity>
                {item.phone && (
                    <TouchableOpacity style={styles.contactRow} onPress={() => handleCall(item.phone)}>
                        <Ionicons name="call-outline" size={20} color={Colors.text.secondary} />
                        <Text style={styles.contactText}>{item.phone}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.accent.cyan, Colors.primary[700]]}
                style={styles.header}
            >
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Directory</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.tabsContainer}>
                        <TabButton
                            title="Staff"
                            isActive={activeTab === 'staff'}
                            onPress={() => setActiveTab('staff')}
                        />
                        <TabButton
                            title="Students"
                            isActive={activeTab === 'students'}
                            onPress={() => setActiveTab('students')}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                    </View>
                ) : activeTab === 'staff' ? (
                    <FlatList
                        data={faculty}
                        renderItem={renderFacultyItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No staff found</Text>
                            </View>
                        }
                    />
                ) : (
                    <FlatList
                        data={students}
                        renderItem={renderStudentItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="school-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No students found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabButtonActive: {
        backgroundColor: 'white',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    tabButtonTextActive: {
        color: Colors.accent.cyan, // Matching header gradient
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.neutral[200],
    },
    headerInfo: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.text.muted,
    },
});

export default DirectoryScreen;
