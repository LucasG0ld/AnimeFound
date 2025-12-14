import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../../core/theme/colors';
import { usePollRealtime } from '../usePollRealtime'; // Reuse fetching logic
import { useArchivePoll } from '../useArchivePoll';
import { Button } from '../../../components/ui/Button';
import { Trophy, Trash2 } from 'lucide-react-native';

interface PollWinnerWidgetProps {
    pollId: string;
    isAdmin: boolean;
}

export const PollWinnerWidget = ({ pollId, isAdmin }: PollWinnerWidgetProps) => {
    const { candidates, isLoading } = usePollRealtime(pollId); // We don't need real-time for closed poll really, but reusing the aggregation logic is handy.
    const archiveMutation = useArchivePoll();

    if (isLoading) return <ActivityIndicator color={colors.gold} />;
    if (!candidates || candidates.length === 0) return null;

    // Determine Winner
    // Sort by vote_count desc
    const sorted = [...candidates].sort((a, b) => b.vote_count - a.vote_count);
    const winner = sorted[0];
    // Check for tie? 
    // If tie, multiple winners? For simple MVP, just take top one or display "Tie" logic. 
    // Let's assume the first one is the winner.

    // Check if 0 votes?
    const hasVotes = winner.vote_count > 0;

    const handleArchive = () => {
        Alert.alert(
            "Terminer le Duel",
            "Cela supprimera le vote et permettra d'en lancer un nouveau.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Terminer",
                    style: "destructive",
                    onPress: async () => {
                        await archiveMutation.mutateAsync(pollId);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Trophy size={24} color={colors.gold} fill={colors.gold} />
                <Text style={styles.title}>LE VAINQUEUR EST...</Text>
                <Trophy size={24} color={colors.gold} fill={colors.gold} />
            </View>

            {hasVotes ? (
                <View style={styles.winnerContent}>
                    <Image source={{ uri: winner.anime.image_url }} style={styles.poster} contentFit="cover" />
                    <Text style={styles.animeTitle}>{winner.anime.title_en}</Text>
                    <Text style={styles.voteText}>{winner.vote_count} votes</Text>

                    {/* Confetti placeholder or simple text decoration */}
                    <Text style={styles.congrats}>🎉 Félicitations ! 🎉</Text>
                </View>
            ) : (
                <View style={styles.winnerContent}>
                    <Text style={styles.noVotes}>Aucun vote enregistré... 😢</Text>
                </View>
            )}

            {isAdmin && (
                <View style={styles.footer}>
                    <Button
                        title="Terminer le duel"
                        onPress={handleArchive}
                        variant="secondary"
                        icon={<Trash2 size={18} color={colors.gold} />}
                        loading={archiveMutation.isPending}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.carbon,
        borderRadius: 16,
        padding: 2, // Border width effectively
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.gold,
    },
    header: {
        backgroundColor: colors.gold,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    title: {
        color: colors.carbon,
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 1,
    },
    winnerContent: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: colors.gold,
    },
    animeTitle: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 8,
    },
    voteText: {
        color: colors.gold,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
    },
    congrats: {
        color: colors.textSecondary,
        fontSize: 14,
        fontStyle: 'italic',
    },
    noVotes: {
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    footer: {
        padding: 16,
        backgroundColor: colors.carbon, // Darker footer
        borderTopWidth: 1,
        borderTopColor: colors.slate,
    },
});
