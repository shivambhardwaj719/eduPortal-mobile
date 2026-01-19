import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    showTagline?: boolean;
    variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({
    size = 'medium',
    showTagline = false,
    variant = 'dark'
}) => {
    const sizes = {
        small: { icon: 40, text: 18, tagline: 8, star: 10, starOffset: -2 },
        medium: { icon: 56, text: 24, tagline: 10, star: 14, starOffset: -3 },
        large: { icon: 80, text: 32, tagline: 12, star: 18, starOffset: -4 },
    };

    const currentSize = sizes[size];
    const textColor = variant === 'dark' ? '#FFFFFF' : '#1E1B4B';
    const taglineColor = variant === 'dark' ? '#94A3B8' : '#64748B';

    return (
        <View style={styles.container}>
            {/* Logo Icon */}
            <View style={styles.iconWrapper}>
                <LinearGradient
                    colors={['#3B82F6', '#0D9488']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.iconContainer,
                        {
                            width: currentSize.icon,
                            height: currentSize.icon,
                            borderRadius: currentSize.icon * 0.24,
                        }
                    ]}
                >
                    <Ionicons
                        name="book-outline"
                        size={currentSize.icon * 0.45}
                        color="rgba(255,255,255,0.9)"
                    />
                </LinearGradient>
                {/* Star/Light element */}
                <View
                    style={[
                        styles.starBadge,
                        {
                            width: currentSize.star,
                            height: currentSize.star,
                            borderRadius: currentSize.star / 2,
                            top: currentSize.starOffset,
                            right: currentSize.starOffset,
                        }
                    ]}
                >
                    <Ionicons
                        name="sparkles"
                        size={currentSize.star * 0.6}
                        color="#1E1B4B"
                    />
                </View>
            </View>

            {/* Logo Text */}
            <View style={styles.textContainer}>
                <View style={styles.brandNameRow}>
                    <Text style={[styles.brandName, { fontSize: currentSize.text, color: textColor }]}>
                        Siksha
                    </Text>
                    <Text style={[styles.brandNameAccent, { fontSize: currentSize.text }]}>
                        Neeti
                    </Text>
                </View>
                {showTagline && (
                    <Text style={[styles.tagline, { fontSize: currentSize.tagline, color: taglineColor }]}>
                        MODERN EDUCATION STRATEGY
                    </Text>
                )}
            </View>
        </View>
    );
};

// Icon-only version for app icon, splash, etc.
export const LogoIcon: React.FC<{ size?: number }> = ({ size = 56 }) => {
    return (
        <View style={styles.iconWrapper}>
            <LinearGradient
                colors={['#3B82F6', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.iconContainer,
                    {
                        width: size,
                        height: size,
                        borderRadius: size * 0.24,
                    }
                ]}
            >
                <Ionicons
                    name="book-outline"
                    size={size * 0.45}
                    color="rgba(255,255,255,0.9)"
                />
            </LinearGradient>
            <View
                style={[
                    styles.starBadge,
                    {
                        width: size * 0.25,
                        height: size * 0.25,
                        borderRadius: size * 0.125,
                        top: -size * 0.05,
                        right: -size * 0.05,
                    }
                ]}
            >
                <Ionicons
                    name="sparkles"
                    size={size * 0.15}
                    color="#1E1B4B"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        position: 'relative',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    starBadge: {
        position: 'absolute',
        backgroundColor: '#FACC15',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FACC15',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    textContainer: {
        justifyContent: 'center',
    },
    brandNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandName: {
        fontWeight: '800',
    },
    brandNameAccent: {
        fontWeight: '800',
        color: '#0D9488',
    },
    tagline: {
        letterSpacing: 1,
        marginTop: 2,
    },
});

export default Logo;
