import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../core/theme/colors';
import { useUserGroups, GroupMember } from '../../features/groups/useUserGroups';
import { useCreateGroup } from '../../features/groups/useCreateGroup';
import { useJoinGroup } from '../../features/groups/useJoinGroup';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Users, ArrowRight } from 'lucide-react-native';

const SafeFlashList = FlashList as any;

export default function GroupsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { data: groups, isLoading } = useUserGroups();
    const createMutation = useCreateGroup();
    const joinMutation = useJoinGroup();

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const handleCreate = async () => {
        try {
            if (!groupName.trim()) return;
            await createMutation.mutateAsync(groupName);
            setGroupName('');
            setCreateModalVisible(false);
            Alert.alert('Succès', 'Groupe créé !');
        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleJoin = async () => {
        try {
            if (!inviteCode.trim()) return;
            await joinMutation.mutateAsync(inviteCode);
            setInviteCode('');
            setJoinModalVisible(false);
            Alert.alert('Succès', 'Groupe rejoint !');
        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        }
    };

    const renderItem = ({ item }: { item: GroupMember }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/group/${item.group.id}`)}
        >
            <View style={styles.cardIcon}>
                <Users color={colors.carbon} size={24} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.group.name}</Text>
                <Text style={styles.cardRole}>{item.role === 'ADMIN' ? 'Administrateur' : 'Membre'}</Text>
            </View>
            <ArrowRight color={colors.gold} size={20} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header Actions */}
            <View style={styles.actionsContainer}>
                <Button
                    title="Créer un groupe"
                    onPress={() => setCreateModalVisible(true)}
                    style={styles.actionButton}
                />
                <Button
                    title="Rejoindre"
                    variant="secondary"
                    onPress={() => setJoinModalVisible(true)}
                    style={styles.actionButton}
                />
            </View>

            {/* Group List */}
            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.gold} />
                </View>
            ) : (
                <SafeFlashList
                    data={groups || []}
                    renderItem={renderItem}
                    estimatedItemSize={80}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>Vous n'avez rejoint aucun groupe.</Text>
                        </View>
                    }
                />
            )}

            {/* Create Modal */}
            <Modal
                visible={createModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un groupe</Text>
                        <Input
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChangeText={setGroupName}
                            style={styles.modalInput}
                        />
                        <Button
                            title="Créer"
                            onPress={handleCreate}
                            loading={createMutation.isPending}
                        />
                        <Button
                            title="Annuler"
                            variant="ghost"
                            onPress={() => setCreateModalVisible(false)}
                            style={{ marginTop: 10 }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Join Modal */}
            <Modal
                visible={joinModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setJoinModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rejoindre un groupe</Text>
                        <Input
                            placeholder="Code d'invitation"
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            style={styles.modalInput}
                        />
                        <Button
                            title="Rejoindre"
                            onPress={handleJoin}
                            loading={joinMutation.isPending}
                        />
                        <Button
                            title="Annuler"
                            variant="ghost"
                            onPress={() => setJoinModalVisible(false)}
                            style={{ marginTop: 10 }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
    },
    // Card
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.slate,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.gold,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardRole: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.carbon,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.gold,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.gold,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        marginBottom: 20,
        backgroundColor: colors.slate,
    }
});
