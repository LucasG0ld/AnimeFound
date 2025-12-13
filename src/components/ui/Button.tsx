import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../core/theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', loading = false, style }: ButtonProps) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return colors.gold;
            case 'secondary': return colors.slate;
            case 'ghost': return 'transparent';
            default: return colors.gold;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return colors.black;
            case 'secondary': return colors.gold;
            case 'ghost': return colors.gold;
            default: return colors.black;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'ghost' && styles.ghostBorder,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    ghostBorder: {
        borderWidth: 1,
        borderColor: colors.gold,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
