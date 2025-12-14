import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ChevronLeft } from 'lucide-react-native';
import { colors } from '../../core/theme/colors';
import { useAnimeDetails } from '../../features/library/useAnimeDetails';
import { useUpdateLibraryItem } from '../../features/library/useUpdateLibraryItem';
import { WatchStatus } from '../../features/library/useUserLibrary';
import { Button } from '../../components/ui/Button';

// Status Options
const STATUS_OPTIONS: { label: string; value: WatchStatus }[] = [
    { label: 'En cours', value: 'WATCHING' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'À voir', value: 'PLAN_TO_WATCH' },
    { label: 'Abandonné', value: 'DROPPED' },
];

export default function AnimeDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Data Fetching
    const { data, isLoading, error } = useAnimeDetails(id!);
    const updateMutation = useUpdateLibraryItem();

    // Local State for Form
    const [status, setStatus] = useState<WatchStatus>('PLAN_TO_WATCH');
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Sync Local State with Data
    useEffect(() => {
        if (data?.libraryItem) {
            setStatus(data.libraryItem.status as WatchStatus);
            setRating(data.libraryItem.rating || 0);
            setComment(data.libraryItem.comment || '');
        }
    }, [data]);

    const handleSave = async () => {
        if (!data?.libraryItem?.id) {
            Alert.alert("Erreur", "Cet anime n'est pas dans votre bibliothèque.");
            return;
        }

        setIsSaving(true);
        try {
            await updateMutation.mutateAsync({
                libraryItemId: data.libraryItem.id,
                updates: {
                    status,
                    rating: rating === 0 ? undefined : rating, // Handle 0 as generic null if needed, specific logic might vary
                    comment
                }
            });
            Alert.alert("Succès", "Modifications enregistrées !");
            router.back();
        } catch (err: any) {
            Alert.alert("Erreur", "Impossible d'enregistrer les modifications.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.gold} />
            </View>
        );
    }

    if (error || !data?.anime) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Erreur lors du chargement de l'anime.</Text>
                <Button title="Retour" onPress={() => router.back()} style={{ marginTop: 20 }} />
            </View>
        );
    }

    const { anime } = data;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{ uri: anime.image_url }}
                        style={styles.headerImage}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['transparent', colors.carbon]}
                        style={styles.gradient}
                    />
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 10 }]}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft color="white" size={28} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{anime.title_en || anime.title_jp}</Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.year}>{anime.year || 'Année inconnue'}</Text>
                        <View style={styles.typeChip}>
                            <Text style={styles.typeText}>{anime.type || 'TV'}</Text>
                        </View>
                    </View>

                    {/* Status Selector */}
                    <Text style={styles.sectionTitle}>Statut</Text>
                    <View style={styles.statusContainer}>
                        {STATUS_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.statusOption, status === opt.value && styles.statusOptionActive]}
                                onPress={() => setStatus(opt.value)}
                            >
                                <Text style={[styles.statusText, status === opt.value && styles.statusTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Rating */}
                    <Text style={styles.sectionTitle}>Note</Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Star
                                    size={28}
                                    color={star <= rating ? colors.gold : colors.slate}
                                    fill={star <= rating ? colors.gold : "none"}
                                    style={{ marginRight: 4 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.ratingValue}>{rating}/10</Text>

                    {/* Comment */}
                    <Text style={styles.sectionTitle}>Commentaire</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Écrivez votre avis..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                        textAlignVertical="top"
                    />

                </View>
            </ScrollView>

            {/* Footer Action */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <Button
                    title="Enregistrer"
                    onPress={handleSave}
                    loading={isSaving}
                />
            </View>
        </View>
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
    errorText: {
        color: colors.error,
        fontSize: 16,
    },
    headerImageContainer: {
        height: 300,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 150,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 4,
    },
    content: {
        padding: 20,
        marginTop: -40, // Pull up over gradient
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    year: {
        color: colors.textSecondary,
        fontSize: 16,
        marginRight: 12,
    },
    typeChip: {
        backgroundColor: colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.slate,
    },
    typeText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: colors.gold,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.slate,
        backgroundColor: colors.surface,
    },
    statusOptionActive: {
        borderColor: colors.gold,
        backgroundColor: 'rgba(255, 191, 0, 0.1)',
    },
    statusText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    statusTextActive: {
        color: colors.gold,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    ratingValue: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 12,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.slate,
        minHeight: 100,
    },
    footer: {
        padding: 20,
        backgroundColor: colors.carbon,
        borderTopWidth: 1,
        borderTopColor: colors.slate,
    },
});
