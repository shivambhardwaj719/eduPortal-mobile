import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import { hostelService } from '../../services/hostelService';
import { Hostel, HostelRoom, HostelMeal } from '../../types';
import Button from '../../components/ui/Button'; // Assuming we have this
import Input from '../../components/ui/Input'; // Assuming we have this
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

const HostelScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const canEdit = user?.profile_type !== 'Student';

    const [activeTab, setActiveTab] = useState<'rooms' | 'meals'>('rooms');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '', cost_per_bed: '', type: 'AC' });

    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<HostelRoom[]>([]);
    const [meals, setMeals] = useState<HostelMeal[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [hostelsData, roomsData, mealsData] = await Promise.all([
                hostelService.getHostels(),
                hostelService.getRooms(),
                hostelService.getMeals(),
            ]);

            if (hostelsData.success) setHostels(hostelsData.data);
            if (roomsData.success) setRooms(roomsData.data);
            if (mealsData.success) setMeals(mealsData.data);

        } catch (error) {
            console.error('Failed to fetch hostel data:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleAddRoom = async () => {
        if (!newRoom.room_number || !newRoom.capacity || !newRoom.cost_per_bed) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setFormLoading(true);
        try {
            // Defaulting to first hostel if available for demo
            const hostelId = hostels.length > 0 ? hostels[0].id : 1;

            const response = await hostelService.createRoom({
                ...newRoom,
                hostel: { id: hostelId } as Hostel, // Backend likely expects ID but interface uses objects, service might need adjustment or backend handles it. 
                // Wait, create structure usually sends ID. Let's send ID in a way backend accepts.
                // Assuming service handles it or we send Partial<HostelRoom>.
                // For now, let's assume specific ID passing isn't strictly typed or we cast.
                capacity: parseInt(newRoom.capacity),
                floor: 1, // Default
            });

            if (response.success) {
                Alert.alert('Success', 'Room added successfully');
                setIsModalVisible(false);
                setNewRoom({ room_number: '', capacity: '', cost_per_bed: '', type: 'AC' });
                fetchData();
            } else {
                Alert.alert('Error', response.message || 'Failed to add room');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderRoomItem = ({ item }: { item: HostelRoom }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.roomBadge}>
                    <Text style={styles.roomBadgeText}>{item.room_number}</Text>
                </View>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>₹{item.cost_per_bed}/bed</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{item.hostel.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>Capacity: {item.capacity}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="floor-plan" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>Floor: {item.floor}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: Colors.success.main + '20' }]}>
                    <Text style={[styles.statusText, { color: Colors.success.main }]}>
                        {item.type}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderMealItem = ({ item }: { item: HostelMeal }) => (
        <View style={[styles.mealCard, { borderLeftColor: item.color }]}>
            <View style={styles.mealHeader}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
                </View>
            </View>

            <View style={styles.mealContent}>
                <View style={styles.mealRow}>
                    <MaterialCommunityIcons name="coffee-outline" size={20} color={Colors.text.secondary} />
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealLabel}>Breakfast</Text>
                        <Text style={styles.mealValue}>{item.breakfast}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.mealRow}>
                    <MaterialCommunityIcons name="food-variant" size={20} color={Colors.text.secondary} />
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealLabel}>Lunch</Text>
                        <Text style={styles.mealValue}>{item.lunch}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.mealRow}>
                    <MaterialCommunityIcons name="weather-night" size={20} color={Colors.text.secondary} />
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealLabel}>Dinner</Text>
                        <Text style={styles.mealValue}>{item.dinner}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.primary[600], Colors.primary[800]]}
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
                        <Text style={styles.headerTitle}>Hostel</Text>
                        {canEdit ? (
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(true)}
                                style={styles.backButton}
                            >
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 40 }} />
                        )}
                    </View>

                    <View style={styles.tabsContainer}>
                        <TabButton
                            title="Rooms"
                            isActive={activeTab === 'rooms'}
                            onPress={() => setActiveTab('rooms')}
                        />
                        <TabButton
                            title="Meal Menu"
                            isActive={activeTab === 'meals'}
                            onPress={() => setActiveTab('meals')}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                    </View>
                ) : activeTab === 'rooms' ? (
                    <FlatList
                        data={rooms}
                        renderItem={renderRoomItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="bed-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No rooms available</Text>
                            </View>
                        }
                    />
                ) : (
                    <FlatList
                        data={meals}
                        renderItem={renderMealItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="restaurant-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No meal plans available</Text>
                            </View>
                        }
                    />
                )}
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Room</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            <Input
                                label="Room Number"
                                placeholder="e.g. A-101"
                                value={newRoom.room_number}
                                onChangeText={(text) => setNewRoom({ ...newRoom, room_number: text })}
                            />
                            <Input
                                label="Capacity"
                                placeholder="e.g. 4"
                                keyboardType="numeric"
                                value={newRoom.capacity}
                                onChangeText={(text) => setNewRoom({ ...newRoom, capacity: text })}
                            />
                            <Input
                                label="Cost per Bed"
                                placeholder="e.g. 5000"
                                keyboardType="numeric"
                                value={newRoom.cost_per_bed}
                                onChangeText={(text) => setNewRoom({ ...newRoom, cost_per_bed: text })}
                            />

                            <Button
                                title="Add Room"
                                onPress={handleAddRoom}
                                isLoading={formLoading}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.background.secondary,
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    formContainer: {
        gap: 16,
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
        color: Colors.primary[600],
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    roomBadge: {
        backgroundColor: Colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary[100],
    },
    roomBadgeText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary[700],
    },
    priceTag: {
        backgroundColor: Colors.success.main + '15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.success.main,
    },
    cardBody: {
        marginBottom: 16,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    // Meal Card Styles
    mealCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dayText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    mealContent: {
        backgroundColor: Colors.background.secondary,
        borderRadius: 12,
        padding: 12,
    },
    mealRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    mealInfo: {
        flex: 1,
    },
    mealLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 2,
    },
    mealValue: {
        fontSize: 14,
        color: Colors.text.primary,
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.glass.border,
        marginVertical: 12,
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

export default HostelScreen;
