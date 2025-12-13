import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, LogOut, Trash2 } from 'lucide-react-native';
import { colors } from '../core/theme/colors';
import { useAuth } from '../core/auth/AuthContext';
import { supabase } from '../core/services/supabase';

const SettingItem = ({
    label,
    value,
    onPress,
    icon,
    danger = false
}: {
    label: string;
    value?: string;
    onPress?: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
}) => (
    <TouchableOpacity
        style={[styles.item, danger && styles.itemDanger]}
        onPress={onPress}
        disabled={!onPress}
    >
        <View style={styles.itemLeft}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.itemLabel, danger && styles.textDanger]}>{label}</Text>
        </View>
        <View style={styles.itemRight}>
            {value && <Text style={styles.itemValue}>{value}</Text>}
            {onPress && <ChevronRight size={20} color={danger ? colors.error : colors.textSecondary} />}
        </View>
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
        // AuthContext usually handles redirect, but we can force it
        router.replace('/login');
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Supprimer mon compte",
            "Êtes-vous sûr ? Cette action est irréversible et supprimera toutes vos données.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            // Call the RPC function we asked the user to create
                            const { error } = await supabase.rpc('delete_own_user');
                            if (error) throw error;

                            // Success logic
                            await signOut();
                            Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
                            router.replace('/login');
                        } catch (err: any) {
                            console.error("Delete Account Error:", err);
                            Alert.alert("Erreur", "Impossible de supprimer le compte. Vérifiez votre connexion ou contactez le support.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronRight size={28} color={colors.gold} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Paramètres</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SectionHeader title="Compte" />
                <SettingItem
                    label="Modifier mon profil"
                    onPress={() => Alert.alert("Bientôt", "Cette fonctionnalité arrive bientôt !")}
                />
                <SettingItem
                    label="Se déconnecter"
                    onPress={handleLogout}
                    icon={<LogOut size={18} color={colors.textSecondary} />}
                />

                <SectionHeader title="À propos" />
                <SettingItem label="Version de l'application" value="v1.0.0" />
                <SettingItem label="Mentions légales" onPress={() => { }} />

                <SectionHeader title="Zone de danger" />
                <SettingItem
                    label="Supprimer mon compte"
                    onPress={handleDeleteAccount}
                    danger
                    icon={<Trash2 size={18} color={colors.error} />}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    content: {
        padding: 16,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.gold,
        marginTop: 24,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemDanger: {
        backgroundColor: 'rgba(229, 57, 53, 0.1)', // Error color with opacity
        borderWidth: 1,
        borderColor: colors.error,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 12,
    },
    itemLabel: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    textDanger: {
        color: colors.error,
        fontWeight: 'bold',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: 8,
    },
});
