import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { useAppSelector } from '../../hooks/useAppStore';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

interface ProfileField {
    key: string;
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    editable?: boolean;
}

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');

    // Profile data
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || 'John',
        last_name: user?.last_name || 'Doe',
        email: user?.email || 'john.doe@example.com',
        phone: '+91 98765 43210',
        date_of_birth: '2008-05-15',
        gender: 'Male',
        blood_group: 'B+',
        address: '123 Education Street, Academic City, India',
        admission_date: '2023-04-01',
        student_id: 'STU2023001',
        class: '10th Grade - A',
        roll_number: '15',
        guardian_name: 'Robert Doe',
        guardian_phone: '+91 98765 43211',
        guardian_email: 'robert.doe@example.com',
        guardian_relation: 'Father',
    });

    const personalFields: ProfileField[] = [
        { key: 'first_name', label: 'First Name', value: profileData.first_name, icon: 'person-outline', editable: true },
        { key: 'last_name', label: 'Last Name', value: profileData.last_name, icon: 'person-outline', editable: true },
        { key: 'date_of_birth', label: 'Date of Birth', value: format(new Date(profileData.date_of_birth), 'MMM dd, yyyy'), icon: 'calendar-outline' },
        { key: 'gender', label: 'Gender', value: profileData.gender, icon: 'male-female-outline' },
        { key: 'blood_group', label: 'Blood Group', value: profileData.blood_group, icon: 'water-outline' },
        { key: 'address', label: 'Address', value: profileData.address, icon: 'location-outline', editable: true },
    ];

    const academicFields: ProfileField[] = [
        { key: 'student_id', label: 'Student ID', value: profileData.student_id, icon: 'id-card-outline' },
        { key: 'class', label: 'Class', value: profileData.class, icon: 'school-outline' },
        { key: 'roll_number', label: 'Roll Number', value: profileData.roll_number, icon: 'bookmark-outline' },
        { key: 'admission_date', label: 'Admission Date', value: format(new Date(profileData.admission_date), 'MMM dd, yyyy'), icon: 'calendar-outline' },
    ];

    const contactFields: ProfileField[] = [
        { key: 'email', label: 'Email', value: profileData.email, icon: 'mail-outline', editable: true },
        { key: 'phone', label: 'Phone', value: profileData.phone, icon: 'call-outline', editable: true },
        { key: 'guardian_name', label: 'Guardian Name', value: profileData.guardian_name, icon: 'people-outline' },
        { key: 'guardian_phone', label: 'Guardian Phone', value: profileData.guardian_phone, icon: 'call-outline' },
        { key: 'guardian_email', label: 'Guardian Email', value: profileData.guardian_email, icon: 'mail-outline' },
        { key: 'guardian_relation', label: 'Relationship', value: profileData.guardian_relation, icon: 'heart-outline' },
    ];

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
    };

    const tabs = [
        { key: 'personal', label: 'Personal', icon: 'person-outline' },
        { key: 'academic', label: 'Academic', icon: 'school-outline' },
        { key: 'contact', label: 'Contact', icon: 'call-outline' },
    ];

    const getCurrentFields = () => {
        switch (activeTab) {
            case 'personal': return personalFields;
            case 'academic': return academicFields;
            case 'contact': return contactFields;
            default: return personalFields;
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
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Ionicons
                            name={isEditing ? 'close' : 'create-outline'}
                            size={24}
                            color={isEditing ? Colors.error.main : Colors.text.primary}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Header Card */}
                    <Card variant="gradient" style={styles.profileHeaderCard} gradientColors={[...Colors.gradients.primary] as string[]}>
                        <View style={styles.profileHeaderContent}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>
                                    {profileData.first_name[0]}{profileData.last_name[0]}
                                </Text>
                                <TouchableOpacity style={styles.cameraButton}>
                                    <Ionicons name="camera" size={14} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileHeaderInfo}>
                                <Text style={styles.profileName}>
                                    {profileData.first_name} {profileData.last_name}
                                </Text>
                                <Text style={styles.profileClass}>{profileData.class}</Text>
                                <View style={styles.profileBadges}>
                                    <View style={styles.idBadge}>
                                        <Ionicons name="id-card-outline" size={12} color={Colors.white} />
                                        <Text style={styles.idBadgeText}>{profileData.student_id}</Text>
                                    </View>
                                    <View style={styles.rollBadge}>
                                        <Text style={styles.rollBadgeText}>Roll: {profileData.roll_number}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.success.main + '20' }]}>
                                <Ionicons name="checkmark-done" size={18} color={Colors.success.main} />
                            </View>
                            <Text style={styles.quickStatValue}>92%</Text>
                            <Text style={styles.quickStatLabel}>Attendance</Text>
                        </Card>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                                <Ionicons name="ribbon" size={18} color={Colors.primary[500]} />
                            </View>
                            <Text style={styles.quickStatValue}>A+</Text>
                            <Text style={styles.quickStatLabel}>Grade</Text>
                        </Card>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.accent.purple + '20' }]}>
                                <Ionicons name="trophy" size={18} color={Colors.accent.purple} />
                            </View>
                            <Text style={styles.quickStatValue}>5</Text>
                            <Text style={styles.quickStatLabel}>Rank</Text>
                        </Card>
                        <Card variant="glass" style={styles.quickStatCard}>
                            <View style={[styles.quickStatIcon, { backgroundColor: Colors.warning.main + '20' }]}>
                                <Ionicons name="star" size={18} color={Colors.warning.main} />
                            </View>
                            <Text style={styles.quickStatValue}>156</Text>
                            <Text style={styles.quickStatLabel}>Points</Text>
                        </Card>
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
                                    size={16}
                                    color={activeTab === tab.key ? Colors.primary[500] : Colors.text.muted}
                                />
                                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Profile Fields */}
                    <Card variant="glass" style={styles.fieldsCard}>
                        {getCurrentFields().map((field, index) => (
                            <View
                                key={field.key}
                                style={[
                                    styles.fieldItem,
                                    index !== getCurrentFields().length - 1 && styles.fieldItemBorder,
                                ]}
                            >
                                <View style={styles.fieldIcon}>
                                    <Ionicons name={field.icon} size={18} color={Colors.text.muted} />
                                </View>
                                <View style={styles.fieldContent}>
                                    <Text style={styles.fieldLabel}>{field.label}</Text>
                                    {isEditing && field.editable ? (
                                        <TextInput
                                            style={styles.fieldInput}
                                            value={field.value}
                                            onChangeText={(text) => {
                                                setProfileData(prev => ({ ...prev, [field.key]: text }));
                                            }}
                                            placeholderTextColor={Colors.text.muted}
                                        />
                                    ) : (
                                        <Text style={styles.fieldValue}>{field.value}</Text>
                                    )}
                                </View>
                                {isEditing && field.editable && (
                                    <Ionicons name="pencil" size={16} color={Colors.primary[500]} />
                                )}
                            </View>
                        ))}
                    </Card>

                    {/* Save Button */}
                    {isEditing && (
                        <Button
                            title="Save Changes"
                            onPress={handleSave}
                            fullWidth
                            style={styles.saveButton}
                        />
                    )}

                    {/* Quick Actions */}
                    {!isEditing && (
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <View style={[styles.actionIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                                    <Ionicons name="document-text" size={20} color={Colors.primary[500]} />
                                </View>
                                <Text style={styles.actionText}>Download ID Card</Text>
                                <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <View style={[styles.actionIcon, { backgroundColor: Colors.accent.purple + '20' }]}>
                                    <Ionicons name="share-social" size={20} color={Colors.accent.purple} />
                                </View>
                                <Text style={styles.actionText}>Share Profile</Text>
                                <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
                            </TouchableOpacity>
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
    editButton: {
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
    profileHeaderCard: {
        padding: 24,
        marginBottom: 20,
    },
    profileHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.white,
    },
    cameraButton: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    profileHeaderInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 4,
    },
    profileClass: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 10,
    },
    profileBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    idBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    idBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.white,
    },
    rollBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    rollBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.white,
    },
    quickStats: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    quickStatCard: {
        flex: 1,
        alignItems: 'center',
        padding: 14,
    },
    quickStatIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    quickStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    quickStatLabel: {
        fontSize: 10,
        color: Colors.text.muted,
        marginTop: 2,
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
    fieldsCard: {
        padding: 0,
        overflow: 'hidden',
        marginBottom: 20,
    },
    fieldItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    fieldItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.glass.border,
    },
    fieldIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    fieldContent: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        color: Colors.text.muted,
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    fieldInput: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text.primary,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary[500],
        paddingVertical: 4,
    },
    saveButton: {
        marginBottom: 20,
    },
    quickActions: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.glass.background,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    actionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text.primary,
    },
});

export default ProfileScreen;
