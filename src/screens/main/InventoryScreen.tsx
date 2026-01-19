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
import { inventoryService } from '../../services/inventoryService';
import { InventoryAsset, InventoryVehicle } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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

const InventoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const canEdit = user?.profile_type !== 'Student';

    const [activeTab, setActiveTab] = useState<'assets' | 'vehicles'>('assets');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [newAsset, setNewAsset] = useState({ name: '', category: '', quantity: '', condition: 'Good', price: '' });

    const [assets, setAssets] = useState<InventoryAsset[]>([]);
    const [vehicles, setVehicles] = useState<InventoryVehicle[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [assetsData, vehiclesData] = await Promise.all([
                inventoryService.getAssets(),
                inventoryService.getVehicles(),
            ]);

            if (assetsData.success) setAssets(assetsData.data);
            if (vehiclesData.success) setVehicles(vehiclesData.data);

        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleAddAsset = async () => {
        if (!newAsset.name || !newAsset.category) {
            Alert.alert('Error', 'Please fill name and category');
            return;
        }

        setFormLoading(true);
        try {
            const response = await inventoryService.createAsset({
                name: newAsset.name,
                category: newAsset.category,
                quantity: parseInt(newAsset.quantity) || 1,
                condition: newAsset.condition,
                price: newAsset.price,
                location: 'Main Store', // Default
                purchase_date: new Date().toISOString().split('T')[0], // Today
            });

            if (response.success) {
                Alert.alert('Success', 'Asset added successfully');
                setIsModalVisible(false);
                setNewAsset({ name: '', category: '', quantity: '', condition: 'Good', price: '' });
                fetchData();
            } else {
                Alert.alert('Error', response.message || 'Failed to add asset');
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

    const renderAssetItem = ({ item }: { item: InventoryAsset }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="cube-outline" size={24} color={Colors.primary[500]} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.subtitle}>{item.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: Colors.info.main + '20' }]}>
                    <Text style={[styles.statusText, { color: Colors.info.main }]}>
                        Qty: {item.quantity}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="pricetag-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>₹{item.price}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.conditionRow}>
                    <View style={[styles.dot, { backgroundColor: item.condition === 'Good' ? Colors.success.main : Colors.warning.main }]} />
                    <Text style={styles.conditionText}>{item.condition}</Text>
                </View>
            </View>
        </View>
    );

    const renderVehicleItem = ({ item }: { item: InventoryVehicle }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.accent.orange + '15' }]}>
                    <Ionicons name="bus-outline" size={24} color={Colors.accent.orange} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{item.vehicle_number}</Text>
                    <Text style={styles.subtitle}>{item.model}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? Colors.success.main + '20' : Colors.error.main + '20' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'Active' ? Colors.success.main : Colors.error.main }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>Driver: {item.driver_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>Capacity: {item.capacity} Seats</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.accent.purple, Colors.primary[700]]}
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
                        <Text style={styles.headerTitle}>Inventory</Text>
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
                            title="Assets"
                            isActive={activeTab === 'assets'}
                            onPress={() => setActiveTab('assets')}
                        />
                        <TabButton
                            title="Vehicles"
                            isActive={activeTab === 'vehicles'}
                            onPress={() => setActiveTab('vehicles')}
                        />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                    </View>
                ) : activeTab === 'assets' ? (
                    <FlatList
                        data={assets}
                        renderItem={renderAssetItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="cube-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No assets found</Text>
                            </View>
                        }
                    />
                ) : (
                    <FlatList
                        data={vehicles}
                        renderItem={renderVehicleItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="bus-outline" size={48} color={Colors.text.muted} />
                                <Text style={styles.emptyText}>No vehicles found</Text>
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
                            <Text style={styles.modalTitle}>Add New Asset</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            <Input
                                label="Name"
                                placeholder="e.g. Projector"
                                value={newAsset.name}
                                onChangeText={(text) => setNewAsset({ ...newAsset, name: text })}
                            />
                            <Input
                                label="Category"
                                placeholder="e.g. Electronics"
                                value={newAsset.category}
                                onChangeText={(text) => setNewAsset({ ...newAsset, category: text })}
                            />
                            <Input
                                label="Quantity"
                                placeholder="e.g. 1"
                                keyboardType="numeric"
                                value={newAsset.quantity}
                                onChangeText={(text) => setNewAsset({ ...newAsset, quantity: text })}
                            />
                            <Input
                                label="Price"
                                placeholder="e.g. 15000"
                                keyboardType="numeric"
                                value={newAsset.price}
                                onChangeText={(text) => setNewAsset({ ...newAsset, price: text })}
                            />

                            <Button
                                title="Add Asset"
                                onPress={handleAddAsset}
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
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.primary[50], // fall back to 50 if needed
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        marginBottom: 12,
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
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
        paddingTop: 12,
    },
    conditionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    conditionText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.primary,
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

export default InventoryScreen;
