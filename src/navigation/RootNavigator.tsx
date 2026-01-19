import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AuthNavigator from './AuthNavigator';
import MainStackNavigator from './MainStackNavigator';
import { useAppSelector, useAppDispatch } from '../hooks/useAppStore';
import { checkAuth } from '../store/slices/authSlice';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={[Colors.background.primary, Colors.background.secondary]}
                    style={StyleSheet.absoluteFillObject}
                />
                <ActivityIndicator size="large" color={Colors.primary[500]} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <NavigationContainer
                theme={{
                    dark: true,
                    colors: {
                        primary: Colors.primary[500],
                        background: Colors.background.primary,
                        card: Colors.background.secondary,
                        text: Colors.text.primary,
                        border: Colors.glass.border,
                        notification: Colors.error.main,
                    },
                    fonts: {
                        regular: { fontFamily: 'System', fontWeight: '400' },
                        medium: { fontFamily: 'System', fontWeight: '500' },
                        bold: { fontFamily: 'System', fontWeight: '700' },
                        heavy: { fontFamily: 'System', fontWeight: '800' },
                    },
                }}
            >
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {isAuthenticated ? (
                        <Stack.Screen name="Main" component={MainStackNavigator} />
                    ) : (
                        <Stack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RootNavigator;
