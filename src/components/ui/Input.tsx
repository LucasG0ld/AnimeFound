import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../core/theme/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={colors.textSecondary}
                selectionColor={colors.gold}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        color: colors.textPrimary,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.slate,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12, // Comfortable touch target
        color: colors.textPrimary,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
    },
});
