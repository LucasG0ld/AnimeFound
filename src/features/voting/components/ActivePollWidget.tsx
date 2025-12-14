import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid, ActivityIndicator, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../../core/theme/colors';
import { usePollRealtime } from '../usePollRealtime';
import { useVote } from '../useVote';
import { useAuth } from '../../../core/auth/AuthContext';
import { Button } from '../../../components/ui/Button';
import { useClosePoll } from '../useClosePoll';
import { Lock } from 'lucide-react-native';

// Simple Progress component (Platform cross-compatibility)
const ProgressBar = ({ progress, color }: { progress: number; color: string }) => {
    return (
        <View style={{ height: 6, backgroundColor: colors.slate, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
            <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: color }} />
        </View>
    );
};

interface ActivePollWidgetProps {
    pollId: string;
    isAdmin: boolean;
    onClose?: () => void;
}

export const ActivePollWidget = ({ pollId, isAdmin, onClose }: ActivePollWidgetProps) => {
    const { user } = useAuth();
    const { candidates, allVotes, isLoading } = usePollRealtime(pollId);
    const voteMutation = useVote();
    const closePollMutation = useClosePoll();

    const myVote = allVotes.find((v: any) => v.user_id === user?.id);
    const totalVotes = allVotes.length;

    const handleVote = async (candidateId: string) => {
        if (myVote) {
            // Already voted. Usually we might allow changing vote (updating), but schema constraint says UNIQUE.
            // We'd need to Delete then Insert or Update.
            // Requirement: "Tap an anime to cast a vote."
            // Let's assume strict "One Vote" for now or handle user feedback.
            Alert.alert("Déjà voté", "Vous avez déjà participé à ce vote.");
            return;
        }

        try {
            await voteMutation.mutateAsync({ pollId, candidateId });
        } catch (error) {
            Alert.alert("Erreur", "Impossible de voter.");
        }
    };

    const handleClosePoll = () => {
        Alert.alert(
            "Clôturer le vote",
            "Êtes-vous sûr ? Cela arrêtera les votes.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Clôturer",
                    style: "destructive",
                    onPress: async () => {
                        await closePollMutation.mutateAsync(pollId);
                        Alert.alert("Terminé", "Le vote est clos !");
                        if (onClose) onClose();
                    }
                }
            ]
        );
    };

    if (isLoading) return <ActivityIndicator color={colors.gold} />;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>🗳️ Que regarde-t-on ensuite ?</Text>
                {isAdmin && (
                    <TouchableOpacity onPress={handleClosePoll}>
                        <Lock size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.list}>
                {candidates.map((candidate) => {
                    const isWinner = false; // Logic for winner highlighting could go here
                    const isSelected = myVote?.candidate_id === candidate.id;
                    const percentage = totalVotes > 0 ? candidate.vote_count / totalVotes : 0;

                    return (
                        <TouchableOpacity
                            key={candidate.id}
                            style={[styles.candidateCard, isSelected && styles.selectedCard]}
                            onPress={() => handleVote(candidate.id)}
                            disabled={!!myVote}
                        >
                            <Image source={{ uri: candidate.anime.image_url }} style={styles.poster} contentFit="cover" />
                            <View style={styles.info}>
                                <Text style={[styles.animeTitle, isSelected && styles.selectedText]}>{candidate.anime.title_en}</Text>
                                <View style={styles.statsRow}>
                                    <View style={{ flex: 1 }}>
                                        <ProgressBar progress={percentage} color={isSelected ? colors.gold : colors.textSecondary} />
                                    </View>
                                    <Text style={styles.percentage}>{Math.round(percentage * 100)}%</Text>
                                </View>
                                <Text style={styles.voteCount}>{candidate.vote_count} votes</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={styles.footerText}>{totalVotes} votes au total</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.gold,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: colors.gold,
        fontWeight: 'bold',
        fontSize: 18,
    },
    list: {
        gap: 12,
    },
    candidateCard: {
        flexDirection: 'row',
        backgroundColor: colors.carbon,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.slate,
    },
    selectedCard: {
        borderColor: colors.gold,
        backgroundColor: 'rgba(255, 191, 0, 0.1)',
    },
    poster: {
        width: 40,
        height: 60,
        borderRadius: 4,
    },
    info: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    animeTitle: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    selectedText: {
        color: colors.gold,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    percentage: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        width: 35,
        textAlign: 'right',
    },
    voteCount: {
        color: colors.textSecondary,
        fontSize: 10,
        marginTop: 2,
    },
    footerText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 12,
        fontStyle: 'italic',
    },
});
