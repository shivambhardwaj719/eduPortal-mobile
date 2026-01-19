import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import EventsScreen from '../screens/main/EventsScreen';
import LibraryScreen from '../screens/main/LibraryScreen';
import ScheduleScreen from '../screens/main/ScheduleScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

export type MainStackParamList = {
    MainTabs: undefined;
    Notifications: undefined;
    Events: undefined;
    Library: undefined;
    Schedule: undefined;
    Settings: undefined;
    Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
