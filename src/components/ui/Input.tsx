import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: ViewStyle;
    isPassword?: boolean;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    containerStyle,
    isPassword = false,
    helperText,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? Colors.primary[500] : Colors.neutral[400]}
                        style={styles.icon}
                    />
                )}

                <TextInput
                    style={[styles.input, icon && styles.inputWithIcon]}
                    placeholderTextColor={Colors.neutral[500]}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.neutral[400]}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
            {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.tertiary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        paddingHorizontal: 16,
    },
    inputFocused: {
        borderColor: Colors.primary[500],
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    inputError: {
        borderColor: Colors.error.main,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 52,
        fontSize: 16,
        color: Colors.text.primary,
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: Colors.error.main,
        marginTop: 6,
    },
    helperText: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 6,
    },
});

export default Input;
