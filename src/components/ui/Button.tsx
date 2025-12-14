import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { colors } from '../../core/theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const Button = ({ title, onPress, variant = 'primary', loading = false, style, textStyle, icon, disabled }: ButtonProps) => {
    const getBackgroundColor = () => {
        if (disabled && !loading) return colors.slate; // Disabled state
        switch (variant) {
            case 'primary': return colors.gold;
            case 'secondary': return colors.slate;
            case 'ghost': return 'transparent';
            default: return colors.gold;
        }
    };

    const getTextColor = () => {
        if (disabled && !loading) return colors.textSecondary;
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
            disabled={loading || disabled}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={styles.contentRow}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </View>
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
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ghostBorder: {
        borderWidth: 1,
        borderColor: colors.gold,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    iconContainer: {
        marginRight: 8,
    },
});
