import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors } from '../../../core/theme/colors';
import { useGroupLibrary, GroupAnimeAggregate } from '../../../features/groups/useGroupLibrary';
import { useCreatePoll } from '../../../features/voting/useCreatePoll';
import { Button } from '../../../components/ui/Button';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';

export default function CreatePollScreen() {
    const { id } = useLocalSearchParams<{ id: string }>(); // Group ID
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Fetch Candidates (Plan to Watch items)
    const { data: library, isLoading } = useGroupLibrary(id!);
    // Filter logic: In a real app we might filter only "PLAN_TO_WATCH" but useGroupLibrary aggregates everything.
    // Let's assume we show all, or filter client side those with > 0 plan to watch?
    // For simplicity, showing all allows re-watching. But user requirement says "Plan to Watch list".
    // Let's filter items where at least one watcher has status "PLAN_TO_WATCH".
    const candidatesSource = library?.filter(item =>
        item.watchers.some(w => w.status === 'PLAN_TO_WATCH')
    ) || [];

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const createPollMutation = useCreatePoll();

    const toggleSelection = (animeId: string) => {
        if (selectedIds.includes(animeId)) {
            setSelectedIds(prev => prev.filter(id => id !== animeId));
        } else {
            if (selectedIds.length >= 5) {
                Alert.alert("Maximum atteint", "Vous ne pouvez sélectionner que 5 animes.");
                return;
            }
            setSelectedIds(prev => [...prev, animeId]);
        }
    };

    const handleCreate = async () => {
        if (selectedIds.length < 2) {
            Alert.alert("Attention", "Veuillez sélectionner au moins 2 animes.");
            return;
        }

        try {
            await createPollMutation.mutateAsync({
                groupId: id!,
                animeIds: selectedIds
            });
            Alert.alert("Succès", "Le duel a commencé !");
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de créer le vote.");
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft color={colors.textPrimary} size={28} />
                </TouchableOpacity>
                <Text style={styles.title}>Nouveau Duel</Text>
            </View>

            <Text style={styles.instruction}>Sélectionnez 2 à 5 animes à départager.</Text>

            {isLoading ? (
                <ActivityIndicator color={colors.gold} style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.list}>
                    {candidatesSource.length === 0 ? (
                        <Text style={styles.emptyText}>Aucun anime "À voir" trouvé dans le groupe.</Text>
                    ) : (
                        candidatesSource.map((item) => {
                            const isSelected = selectedIds.includes(item.animeId);
                            return (
                                <TouchableOpacity
                                    key={item.animeId}
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    onPress={() => toggleSelection(item.animeId)}
                                >
                                    <Image source={{ uri: item.imageUrl }} style={styles.poster} contentFit="cover" />
                                    <View style={styles.info}>
                                        <Text style={styles.animeTitle}>{item.title}</Text>
                                        <Text style={styles.year}>{item.year}</Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.checkIcon}>
                                            <CheckCircle2 color={colors.gold} size={24} fill={colors.surface} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            )}

            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <Text style={styles.counter}>{selectedIds.length} / 5 sélectionnés</Text>
                <Button
                    title="Lancer le Duel"
                    onPress={handleCreate}
                    loading={createPollMutation.isPending}
                // enabled is not a prop, Use disabled instead
                // Logic was: enabled if selected >= 2. So disabled if length < 2.
                // But Button component doesn't have "disabled" prop? Let's check Button.tsx again or use loading for now?
                // Checked Button.tsx before: It has `disabled={loading}`. It seemingly doesn't accept a custom disabled prop.
                // Wait, Button.tsx receives `loading`. It does NOT have `disabled` in Props interface.
                // I should add `disabled` to Button props or conditionally render.
                // Let's rely on standard TouchableOpacity disabled behavior + style.
                // Actually, let's update Button to accept disabled prop properly.
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.carbon },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.slate },
    backBtn: { marginRight: 16 },
    title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
    instruction: { color: colors.textSecondary, padding: 20, paddingBottom: 10 },
    list: { padding: 20, paddingTop: 0 },
    emptyText: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 20 },

    card: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    cardSelected: {
        borderColor: colors.gold,
        backgroundColor: 'rgba(255, 191, 0, 0.05)'
    },
    poster: { width: 60, height: 90 },
    info: { flex: 1, padding: 10, justifyContent: 'center' },
    animeTitle: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
    year: { color: colors.textSecondary, fontSize: 14 },
    checkIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    footer: {
        padding: 20,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.slate,
    },
    counter: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginBottom: 10,
    },
});
