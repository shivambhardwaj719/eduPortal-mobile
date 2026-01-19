import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    StyleProp,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    variant?: 'default' | 'glass' | 'gradient' | 'bordered';
    gradientColors?: string[];
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    variant = 'default',
    gradientColors = Colors.gradients.primary,
}) => {
    const content = (
        <View style={[styles.card, styles[`${variant}Card`], style]}>
            {children}
        </View>
    );

    if (variant === 'gradient') {
        const gradientContent = (
            <LinearGradient
                colors={gradientColors as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, styles.gradientCard, style]}
            >
                {children}
            </LinearGradient>
        );

        if (onPress) {
            return (
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    {gradientContent}
                </TouchableOpacity>
            );
        }
        return gradientContent;
    }

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    iconColor = Colors.primary[500],
    change,
    changeType = 'neutral',
    onPress,
}) => {
    return (
        <Card style={styles.statCard} onPress={onPress} variant="glass">
            <View style={styles.statHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>
                {change && (
                    <View
                        style={[
                            styles.changeBadge,
                            changeType === 'positive' && styles.changeBadgePositive,
                            changeType === 'negative' && styles.changeBadgeNegative,
                        ]}
                    >
                        <Ionicons
                            name={changeType === 'positive' ? 'arrow-up' : changeType === 'negative' ? 'arrow-down' : 'remove'}
                            size={12}
                            color={
                                changeType === 'positive'
                                    ? Colors.success.main
                                    : changeType === 'negative'
                                        ? Colors.error.main
                                        : Colors.neutral[400]
                            }
                        />
                        <Text
                            style={[
                                styles.changeText,
                                changeType === 'positive' && styles.changeTextPositive,
                                changeType === 'negative' && styles.changeTextNegative,
                            ]}
                        >
                            {change}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </Card>
    );
};

// Feature Card Component
interface FeatureCardProps {
    title: string;
    description?: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    onPress: () => void;
    badge?: string | number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    iconColor = Colors.primary[500],
    onPress,
    badge,
}) => {
    return (
        <Card style={styles.featureCard} onPress={onPress} variant="glass">
            <View style={[styles.featureIconContainer, { backgroundColor: `${iconColor}20` }]}>
                <Ionicons name={icon} size={28} color={iconColor} />
                {badge !== undefined && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            {description && <Text style={styles.featureDescription}>{description}</Text>}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
    },
    defaultCard: {
        backgroundColor: Colors.background.card,
    },
    glassCard: {
        backgroundColor: Colors.glass.background,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    gradientCard: {},
    borderedCard: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },

    // Stat Card styles
    statCard: {
        flex: 1,
        minWidth: 150,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: Colors.neutral[800],
        gap: 2,
    },
    changeBadgePositive: {
        backgroundColor: Colors.success.light + '20',
    },
    changeBadgeNegative: {
        backgroundColor: Colors.error.light + '20',
    },
    changeText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.neutral[400],
    },
    changeTextPositive: {
        color: Colors.success.main,
    },
    changeTextNegative: {
        color: Colors.error.main,
    },

    // Feature Card styles
    featureCard: {
        alignItems: 'center',
        paddingVertical: 20,
        minWidth: 100,
    },
    featureIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: 4,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Colors.error.main,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.white,
    },
});

export default Card;
