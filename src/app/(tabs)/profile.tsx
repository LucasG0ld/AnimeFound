import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../core/theme/colors';
import { useUserProfile } from '../../features/profile/useUserProfile';
import { useAuth } from '../../core/auth/AuthContext';
import { supabase } from '../../core/services/supabase';
import { Button } from '../../components/ui/Button';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { data: profile, isLoading } = useUserProfile();
    const { signOut, user } = useAuth();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                uploadAvatar(result.assets[0].base64);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sélectionner une image.');
        }
    };

    const uploadAvatar = async (base64: string) => {
        if (!user) return;
        setUploading(true);
        try {
            const filePath = `${user.id}/${Date.now()}.png`;
            const contentType = 'image/png';

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, decode(base64), { contentType });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Invalidate query to refresh UI
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            Alert.alert('Succès', 'Avatar mis à jour !');

        } catch (error: any) {
            console.error(error);
            Alert.alert('Erreur', error.message);
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.textSecondary}>Chargement du profil...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container]} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
            {/* Header Profile */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
                    <Image
                        source={profile?.avatar_url ? { uri: profile.avatar_url } : { uri: 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={500}
                    />
                    {uploading && (
                        <View style={styles.uploadingOverlay}>
                            <Text style={styles.uploadingText}>...</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.username}>
                    {profile?.username || user?.email?.split('@')[0] || 'Utilisateur'}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>

                <TouchableOpacity onPress={handlePickImage}>
                    <Text style={styles.editLink}>Modifier l'avatar</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Placeholders */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Animes</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0.0</Text>
                    <Text style={styles.statLabel}>Moyenne</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Amis</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <Button
                    title="Mes Amis (Bientôt)"
                    variant="secondary"
                    onPress={() => { }}
                    style={styles.actionButton}
                />
                <Button
                    title="Statistiques (Bientôt)"
                    variant="secondary"
                    onPress={() => { }}
                    style={styles.actionButton}
                />
                <Button
                    title="Réglages"
                    variant="secondary"
                    onPress={() => { }}
                    style={styles.actionButton}
                />

                <Button
                    title="Se déconnecter"
                    variant="ghost"
                    onPress={signOut}
                    style={styles.logoutButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.carbon,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: colors.gold,
        backgroundColor: colors.slate,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        color: colors.gold,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: 16,
    },
    email: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    editLink: {
        color: colors.gold,
        marginTop: 12,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.gold,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    actions: {
        paddingHorizontal: 20,
    },
    actionButton: {
        marginBottom: 12,
    },
    logoutButton: {
        marginTop: 20,
        borderColor: colors.error,
    },
    textSecondary: {
        color: colors.textSecondary,
    },
});
