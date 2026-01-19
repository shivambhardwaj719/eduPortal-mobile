import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import DashboardScreen from '../screens/main/DashboardScreen';
import AcademicsScreen from '../screens/main/AcademicsScreen';
import AttendanceScreen from '../screens/main/AttendanceScreen';
import FinanceScreen from '../screens/main/FinanceScreen';
import MoreScreen from '../screens/main/MoreScreen';

import { Colors } from '../constants/colors';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Dashboard':
                            iconName = focused ? 'grid' : 'grid-outline';
                            break;
                        case 'Academics':
                            iconName = focused ? 'book' : 'book-outline';
                            break;
                        case 'Attendance':
                            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                            break;
                        case 'Finance':
                            iconName = focused ? 'wallet' : 'wallet-outline';
                            break;
                        case 'More':
                            iconName = focused ? 'menu' : 'menu-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return (
                        <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                            <Ionicons name={iconName} size={24} color={color} />
                        </View>
                    );
                },
                tabBarActiveTintColor: Colors.primary[500],
                tabBarInactiveTintColor: Colors.text.muted,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
                tabBarBackground: () => (
                    <View style={styles.tabBarBackground}>
                        {Platform.OS === 'ios' ? (
                            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
                        ) : (
                            <View style={[StyleSheet.absoluteFill, styles.androidTabBarBg]} />
                        )}
                    </View>
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Academics" component={AcademicsScreen} />
            <Tab.Screen name="Attendance" component={AttendanceScreen} />
            <Tab.Screen name="Finance" component={FinanceScreen} />
            <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
    },
    tabBarBackground: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    androidTabBarBg: {
        backgroundColor: Colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 4,
    },
    tabBarItem: {
        paddingTop: 4,
    },
    iconContainer: {
        width: 44,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    iconContainerActive: {
        backgroundColor: Colors.primary[500] + '20',
    },
});

export default MainTabNavigator;
