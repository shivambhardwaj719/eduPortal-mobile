import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/Logo';
import { Colors } from '../../constants/colors';
import { authService } from '../../services/authService';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

type DomainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Domain'>;

const DomainScreen: React.FC = () => {
    const navigation = useNavigation<DomainScreenNavigationProp>();
    const [domain, setDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = async () => {
        if (!domain.trim()) {
            setError('Please enter your institution domain');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Format domain properly
            let formattedDomain = domain.trim().toLowerCase();
            if (!formattedDomain.startsWith('http')) {
                formattedDomain = `https://${formattedDomain}`;
            }

            const result = await authService.checkDomain(formattedDomain);

            if (result.success && result.data?.school_id) {
                // Navigate to login with domain info
                navigation.navigate('Login', {
                    domain: formattedDomain,
                    schoolId: String(result.data.school_id),
                    schoolName: result.data.school_name || 'Your Institution',
                });
            } else {
                setError(result.message || 'Invalid domain. Please check and try again.');
            }
        } catch (err: any) {
            console.log('Domain check error:', err);
            setError(err.message || 'Failed to verify domain. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                        {/* Header Section with SikshaNeeti Logo */}
                        <View style={styles.header}>
                            <Logo size="large" showTagline variant="dark" />
                            <Text style={styles.subtitle}>Enter your institution domain to continue</Text>
                        </View>

                        {/* Domain Card */}
                        <View style={styles.domainCard}>
                            {/* Error Message */}
                            {error && (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={20} color={Colors.error.main} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* Domain Input */}
                            <Input
                                label="Institution Domain"
                                placeholder="e.g., myschool.educare.in"
                                icon="globe-outline"
                                value={domain}
                                onChangeText={(text) => {
                                    setDomain(text);
                                    setError(null);
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="url"
                            />

                            {/* Helper Text */}
                            <View style={styles.helperContainer}>
                                <Ionicons name="information-circle-outline" size={16} color={Colors.text.muted} />
                                <Text style={styles.helperText}>
                                    Enter the web address provided by your institution
                                </Text>
                            </View>

                            {/* Continue Button */}
                            <Button
                                title="Continue"
                                onPress={handleContinue}
                                isLoading={isLoading}
                                fullWidth
                                style={styles.continueButton}
                            />

                            {/* Quick Access */}
                            <View style={styles.quickAccess}>
                                <Text style={styles.quickAccessTitle}>Quick Access</Text>
                                <View style={styles.quickDomains}>
                                    {['telepathy.educare.in', 'demo.sikshaneeti.com'].map((d) => (
                                        <TouchableOpacity
                                            key={d}
                                            style={styles.quickDomainChip}
                                            onPress={() => setDomain(d)}
                                        >
                                            <Ionicons name="business-outline" size={14} color={Colors.primary[400]} />
                                            <Text style={styles.quickDomainText}>{d}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Don't have an account?{' '}
                                <Text style={styles.footerLink}>Contact your administrator</Text>
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
        paddingTop: 40,
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
        marginBottom: 40,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.text.tertiary,
        textAlign: 'center',
        marginTop: 20,
    },
    domainCard: {
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
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    helperText: {
        fontSize: 13,
        color: Colors.text.muted,
        flex: 1,
    },
    continueButton: {
        marginBottom: 24,
    },
    quickAccess: {
        borderTopWidth: 1,
        borderTopColor: Colors.glass.border,
        paddingTop: 20,
    },
    quickAccessTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.muted,
        marginBottom: 12,
        textAlign: 'center',
    },
    quickDomains: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    quickDomainChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primary[500] + '15',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary[500] + '30',
    },
    quickDomainText: {
        fontSize: 13,
        color: Colors.primary[400],
        fontWeight: '500',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 14,
        color: Colors.text.muted,
        textAlign: 'center',
    },
    footerLink: {
        color: Colors.primary[400],
        fontWeight: '600',
    },
});

export default DomainScreen;
