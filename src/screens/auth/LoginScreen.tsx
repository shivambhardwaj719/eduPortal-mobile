import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { login, clearError } from '../../store/slices/authSlice';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            return;
        }
        dispatch(login({ username, password }));
    };

    React.useEffect(() => {
        if (error) {
            // Show error alert or toast
            const timer = setTimeout(() => dispatch(clearError()), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={[Colors.background.primary, '#0c1929', Colors.background.secondary] as const}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header Section */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <LinearGradient
                                    colors={Colors.gradients.primary}
                                    style={styles.logoGradient}
                                >
                                    <Ionicons name="school" size={40} color={Colors.white} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.title}>EduPortal</Text>
                            <Text style={styles.subtitle}>Welcome back! Please sign in to continue</Text>
                        </View>

                        {/* Login Card */}
                        <View style={styles.loginCard}>
                            {/* Error Message */}
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={20} color={Colors.error.main} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* Username Input */}
                            <Input
                                label="Username or Email"
                                placeholder="Enter your username"
                                icon="person-outline"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            {/* Password Input */}
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                icon="lock-closed-outline"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                            />

                            {/* Remember Me & Forgot Password */}
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.rememberMe}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                                    </View>
                                    <Text style={styles.rememberMeText}>Remember me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Login Button */}
                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                isLoading={isLoading}
                                fullWidth
                                style={styles.loginButton}
                            />

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social Login */}
                            <View style={styles.socialButtons}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-google" size={24} color={Colors.text.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-apple" size={24} color={Colors.text.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="finger-print" size={24} color={Colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                By signing in, you agree to our{' '}
                                <Text style={styles.footerLink}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={styles.footerLink}>Privacy Policy</Text>
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Colors.primary[500] + '15',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 100,
        left: -150,
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: Colors.accent.purple + '10',
    },
    decorativeCircle3: {
        position: 'absolute',
        top: height * 0.4,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: Colors.secondary[500] + '10',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    logoContainer: {
        marginBottom: 16,
    },
    logoGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text.primary,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.text.tertiary,
        textAlign: 'center',
    },
    loginCard: {
        backgroundColor: Colors.glass.background,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.error.main + '15',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 10,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: Colors.error.main,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: Colors.neutral[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
    },
    rememberMeText: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.primary[400],
        fontWeight: '500',
    },
    loginButton: {
        marginBottom: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.glass.border,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: Colors.text.muted,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 13,
        color: Colors.text.muted,
        textAlign: 'center',
        lineHeight: 20,
    },
    footerLink: {
        color: Colors.primary[400],
        fontWeight: '500',
    },
});

export default LoginScreen;
