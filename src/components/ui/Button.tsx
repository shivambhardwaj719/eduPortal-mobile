import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    icon,
    fullWidth = false,
}) => {
    const isDisabled = disabled || isLoading;

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 24 };
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'large':
                return 18;
            default:
                return 16;
        }
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                style={[styles.buttonBase, fullWidth && styles.fullWidth, style]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isDisabled ? [Colors.neutral[600], Colors.neutral[700]] as const : Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradient, getSizeStyles()]}
                >
                    {isLoading ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                        <>
                            {icon && <>{icon}</>}
                            <Text style={[styles.text, { fontSize: getTextSize() }, textStyle]}>{title}</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const variantStyles = {
        secondary: {
            container: styles.secondaryContainer,
            text: styles.secondaryText,
        },
        outline: {
            container: styles.outlineContainer,
            text: styles.outlineText,
        },
        ghost: {
            container: styles.ghostContainer,
            text: styles.ghostText,
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.secondary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.buttonBase,
                currentVariant.container,
                getSizeStyles(),
                isDisabled && styles.disabled,
                fullWidth && styles.fullWidth,
                style,
            ]}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={Colors.primary[500]} size="small" />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            currentVariant.text,
                            { fontSize: getTextSize() },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: '600',
        color: Colors.white,
    },
    disabled: {
        opacity: 0.5,
    },
    secondaryContainer: {
        backgroundColor: Colors.secondary[500],
    },
    secondaryText: {
        color: Colors.white,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary[500],
    },
    outlineText: {
        color: Colors.primary[500],
    },
    ghostContainer: {
        backgroundColor: 'transparent',
    },
    ghostText: {
        color: Colors.primary[500],
    },
});

export default Button;
