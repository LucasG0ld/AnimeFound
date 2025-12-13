import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { colors } from '../../core/theme/colors';
import { useGroupMembers, GroupMemberDetails } from '../../features/groups/useGroupMembers';
import { useUserGroups } from '../../features/groups/useUserGroups';
import { Button } from '../../components/ui/Button';
import { Copy, Shield, User } from 'lucide-react-native';

const SafeFlashList = FlashList as any;

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: members, isLoading: membersLoading } = useGroupMembers(id!);
  const { data: myGroups } = useUserGroups();

  // Find current group details from myGroups cache to get name/code
  const currentGroup = myGroups?.find(g => g.group.id === id)?.group;
  const amIAdmin = myGroups?.find(g => g.group.id === id)?.role === 'ADMIN';

  const handleInvite = async () => {
    if (!currentGroup) return;
    try {
      await Share.share({
        message: `Rejoins mon groupe "${currentGroup.name}" sur AnimeFound avec le code : ${currentGroup.invite_code}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le code.');
    }
  };

  const renderMember = ({ item }: { item: GroupMemberDetails }) => (
    <View style={styles.memberCard}>
      <Image
        source={item.profile.avatar_url ? { uri: item.profile.avatar_url } : { uri: 'https://via.placeholder.com/150' }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.memberInfo}>
        <Text style={styles.username}>{item.profile.username || 'Utilisateur'}</Text>
        <View style={styles.roleContainer}>
          {item.role === 'ADMIN' ? (
            <Shield size={14} color={colors.gold} />
          ) : (
            <User size={14} color={colors.textSecondary} />
          )}
          <Text style={[styles.roleText, item.role === 'ADMIN' && styles.adminText]}>
            {item.role === 'ADMIN' ? 'Administrateur' : 'Membre'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (membersLoading || !currentGroup) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentGroup.name}</Text>
        <Text style={styles.subtitle}>{members?.length} membres</Text>
      </View>

      {/* Invite Area (Admin Only) */}
      {amIAdmin && (
        <View style={styles.inviteCard}>
          <View>
            <Text style={styles.inviteLabel}>Code d'invitation</Text>
            <Text style={styles.inviteCode}>{currentGroup.invite_code}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleInvite}>
            <Copy size={20} color={colors.carbon} />
            <Text style={styles.copyText}>Inviter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Members List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Membres</Text>
        <SafeFlashList
          data={members || []}
          renderItem={renderMember}
          estimatedItemSize={70}
          contentContainerStyle={{ paddingBottom: 20 }}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.carbon,
  },
  header: {
    padding: 20,
    backgroundColor: colors.carbon,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  // Invite Card
  inviteCard: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.slate,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 191, 0, 0.3)',
  },
  inviteLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inviteCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyText: {
    color: colors.carbon,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Members List
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.slate,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  roleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  adminText: {
    color: colors.gold,
  },
});
