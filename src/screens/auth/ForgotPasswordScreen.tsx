import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import authService from '../../services/authService';
import { RootStackParamList } from '../../types';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[Colors.background.primary, '#0c1929', Colors.background.secondary] as const}
                    style={StyleSheet.absoluteFillObject}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.successContainer}>
                        <View style={styles.successIconContainer}>
                            <LinearGradient
                                colors={[Colors.success.main, Colors.secondary[500]] as const}
                                style={styles.successIcon}
                            >
                                <Ionicons name="checkmark" size={48} color={Colors.white} />
                            </LinearGradient>
                        </View>
                        <Text style={styles.successTitle}>Email Sent!</Text>
                        <Text style={styles.successText}>
                            We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                        </Text>
                        <Button
                            title="Back to Login"
                            onPress={() => navigation.navigate('Login')}
                            fullWidth
                            style={{ marginTop: 32 }}
                        />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, '#0c1929', Colors.background.secondary] as const}
                style={StyleSheet.absoluteFillObject}
            />

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
                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={Colors.gradients.primary}
                                    style={styles.iconGradient}
                                >
                                    <Ionicons name="key" size={36} color={Colors.white} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Don't worry! Enter your email address and we'll send you a link to reset your password.
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.formCard}>
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={20} color={Colors.error.main} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                icon="mail-outline"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <Button
                                title="Send Reset Link"
                                onPress={handleResetPassword}
                                isLoading={isLoading}
                                fullWidth
                                style={{ marginTop: 8 }}
                            />
                        </View>

                        {/* Footer */}
                        <TouchableOpacity
                            style={styles.footer}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Ionicons name="arrow-back" size={16} color={Colors.primary[400]} />
                            <Text style={styles.footerText}>Back to Login</Text>
                        </TouchableOpacity>
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
        paddingTop: 16,
        paddingBottom: 40,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconGradient: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    formCard: {
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        gap: 8,
    },
    footerText: {
        fontSize: 15,
        color: Colors.primary[400],
        fontWeight: '500',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    successIconContainer: {
        marginBottom: 24,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.success.main,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
    },
    successText: {
        fontSize: 15,
        color: Colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default ForgotPasswordScreen;
