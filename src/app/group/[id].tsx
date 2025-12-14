import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { colors } from '../../core/theme/colors';
import { useGroupMembers, GroupMemberDetails } from '../../features/groups/useGroupMembers';
import { useUserGroups } from '../../features/groups/useUserGroups';
import { useGroupLibrary, GroupAnimeAggregate } from '../../features/groups/useGroupLibrary';
import { useGroupFeed, FeedEvent } from '../../features/groups/useGroupFeed';
import { Copy, Shield, User, Star, EyeOff, Eye, Trash2, LogOut, Swords } from 'lucide-react-native';
import { useLeaveGroup } from '../../features/groups/useLeaveGroup';
import { useKickMember } from '../../features/groups/useKickMember';
import { useAuth } from '../../core/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { useActivePoll } from '../../features/voting/useActivePoll';
import { ActivePollWidget } from '../../features/voting/components/ActivePollWidget';

const SafeFlashList = FlashList as any;

type ViewMode = 'FEED' | 'CATALOGUE' | 'MEMBERS';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('FEED');

  const { data: members, isLoading: membersLoading } = useGroupMembers(id!);
  const { data: myGroups } = useUserGroups();
  const { data: catalogue, isLoading: catLoading } = useGroupLibrary(id!);
  const { data: feed, isLoading: feedLoading } = useGroupFeed(id!);
  const { data: activePoll, refetch: refetchPoll } = useActivePoll(id!);

  const leaveGroupMutation = useLeaveGroup();
  const kickMemberMutation = useKickMember();

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

  const handleLeaveGroup = () => {
    Alert.alert(
      "Quitter le groupe",
      "Êtes-vous sûr de vouloir quitter ce groupe ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveGroupMutation.mutateAsync(id!);
              router.back();
            } catch (e) {
              Alert.alert('Erreur', 'Impossible de quitter le groupe.');
            }
          }
        }
      ]
    );
  };

  const handleKickMember = (memberId: string, username: string) => {
    Alert.alert(
      "Retirer un membre",
      `Voulez-vous retirer ${username} du groupe ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: async () => {
            try {
              await kickMemberMutation.mutateAsync({ groupId: id!, userId: memberId });
            } catch (e) {
              Alert.alert('Erreur', 'Impossible de retirer le membre.');
            }
          }
        }
      ]
    );
  };

  // --- RENDERERS ---

  const renderCatalogueItem = ({ item }: { item: GroupAnimeAggregate }) => (
    <View style={styles.catCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.catImage} contentFit="cover" />
      <View style={styles.catInfo}>
        <Text style={styles.catTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.catRatingRow}>
          <Star size={16} color={colors.gold} fill={colors.gold} />
          <Text style={styles.catRatingText}>{item.averageRating} ({item.ratingCount})</Text>
        </View>
        <View style={styles.watchersRow}>
          {item.watchers.map((w, idx) => (
            <Image
              key={idx}
              source={w.avatarUrl ? { uri: w.avatarUrl } : { uri: 'https://via.placeholder.com/30' }}
              style={[styles.miniAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderMemberItem = ({ item }: { item: GroupMemberDetails }) => {
    const isMe = item.user_id === user?.id; // Should use auth user id
    const canKick = amIAdmin && !isMe;

    return (
      <View style={styles.memberCard}>
        <Image
          source={item.profile.avatar_url ? { uri: item.profile.avatar_url } : { uri: 'https://via.placeholder.com/40' }}
          style={styles.memberAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>{item.profile.username} {isMe && '(Moi)'}</Text>
          <Text style={styles.memberRole}>{item.role === 'ADMIN' ? 'Administrateur' : 'Membre'}</Text>
        </View>
        {item.role === 'ADMIN' && <Shield size={20} color={colors.gold} />}
        {canKick && (
          <TouchableOpacity onPress={() => handleKickMember(item.user_id, item.profile.username)} style={styles.kickBtn}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const FeedItem = ({ item }: { item: FeedEvent }) => {
    const [showSpoiler, setShowSpoiler] = useState(false);

    return (
      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <Image source={item.profile.avatar_url ? { uri: item.profile.avatar_url } : { uri: 'https://via.placeholder.com/40' }} style={styles.feedAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedText}>
              <Text style={styles.feedUsername}>{item.profile.username}</Text> a mis à jour
              <Text style={styles.feedAnime}> {item.anime.title_en}</Text>
            </Text>
            <Text style={styles.feedDate}>{new Date(item.updated_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {item.rating && (
          <View style={styles.feedRating}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                color={item.rating! > i * 2 ? colors.gold : colors.slate}
                fill={item.rating! > i * 2 ? colors.gold : 'transparent'}
              />
            ))}
            <Text style={styles.feedRatingValue}>{item.rating}/10</Text>
          </View>
        )}

        {item.comment && (
          <View>
            <Text style={showSpoiler ? styles.feedComment : styles.feedCommentBlur}>
              {showSpoiler ? item.comment : '●●●●●●●●●●●●●'}
            </Text>
            <TouchableOpacity onPress={() => setShowSpoiler(!showSpoiler)} style={styles.spoilerBtn}>
              {showSpoiler ? <EyeOff size={14} color={colors.textSecondary} /> : <Eye size={14} color={colors.textSecondary} />}
              <Text style={styles.spoilerText}>{showSpoiler ? 'Masquer' : 'Voir le commentaire'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (membersLoading || !currentGroup) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.gold} /></View>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentGroup.name}</Text>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>{members?.length} membres</Text>
          {amIAdmin && (
            <TouchableOpacity onPress={handleInvite} style={styles.inviteLink}>
              <Copy size={14} color={colors.gold} />
              <Text style={styles.inviteText}>Code: {currentGroup.invite_code}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* VOTING WIDGET SECTION */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        {activePoll ? (
          <ActivePollWidget
            pollId={activePoll.id}
            isAdmin={amIAdmin}
            onClose={() => refetchPoll()}
          />
        ) : (
          amIAdmin && (
            <Button
              title="Démarrer un Duel"
              onPress={() => router.push(`/group/${id}/create-poll`)}
              icon={<Swords size={20} color={colors.black} />}
              style={{ marginBottom: 10 }}
            />
          )
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'FEED' && styles.activeTab]}
          onPress={() => setViewMode('FEED')}
        >
          <Text style={[styles.tabText, viewMode === 'FEED' && styles.activeTabText]}>Fil d'actu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'CATALOGUE' && styles.activeTab]}
          onPress={() => setViewMode('CATALOGUE')}
        >
          <Text style={[styles.tabText, viewMode === 'CATALOGUE' && styles.activeTabText]}>Catalogue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'MEMBERS' && styles.activeTab]}
          onPress={() => setViewMode('MEMBERS')}
        >
          <Text style={[styles.tabText, viewMode === 'MEMBERS' && styles.activeTabText]}>Membres</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'CATALOGUE' && (
          catLoading ? <ActivityIndicator color={colors.gold} /> : (
            <SafeFlashList
              data={catalogue || []}
              renderItem={renderCatalogueItem}
              estimatedItemSize={100}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucun anime en commun pour l'instant.</Text>}
            />
          )
        )}

        {viewMode === 'FEED' && (
          feedLoading ? <ActivityIndicator color={colors.gold} /> : (
            <SafeFlashList
              data={feed || []}
              renderItem={({ item }: { item: FeedEvent }) => <FeedItem item={item} />}
              estimatedItemSize={120}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucune activité récente.</Text>}
            />
          )
        )}

        {viewMode === 'MEMBERS' && (
          <View style={{ flex: 1 }}>
            <SafeFlashList
              data={members || []}
              renderItem={renderMemberItem}
              estimatedItemSize={70}
            />
            {/* Leave Group Button in Footer of Members Tab (or global footer?) */}
            {/* Requirement said "at the very bottom of the screen". Let's put it below the list in this view */}
            <View style={{ marginTop: 20 }}>
              <Button
                title="Quitter le groupe"
                variant="ghost"
                onPress={handleLeaveGroup}
                style={{ borderColor: colors.error }}
                textStyle={{ color: colors.error }}
                icon={<LogOut size={18} color={colors.error} />}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.carbon },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.carbon },
  header: { padding: 20, backgroundColor: colors.carbon, borderBottomWidth: 1, borderBottomColor: colors.slate },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  inviteLink: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  inviteText: { color: colors.gold, fontWeight: 'bold' },

  // Tabs
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.slate },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.gold },
  tabText: { color: colors.textSecondary, fontWeight: '600' },
  activeTabText: { color: colors.gold },

  content: { flex: 1, padding: 16 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },

  // Catalogue Card
  catCard: { flexDirection: 'row', backgroundColor: colors.slate, borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  catImage: { width: 70, height: 100 },
  catInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  catTitle: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  catRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  catRatingText: { color: colors.gold, fontWeight: 'bold' },
  watchersRow: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.carbon },

  // Feed Card
  feedCard: { backgroundColor: colors.slate, padding: 12, borderRadius: 8, marginBottom: 12 },
  feedHeader: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  feedAvatar: { width: 40, height: 40, borderRadius: 20 },
  feedText: { color: colors.textSecondary, fontSize: 14 },
  feedUsername: { fontWeight: 'bold', color: colors.textPrimary },
  feedAnime: { color: colors.gold, fontWeight: 'bold' },
  feedDate: { color: colors.textSecondary, fontSize: 10, marginTop: 2 },
  feedRating: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  feedRatingValue: { color: colors.textSecondary, fontSize: 12 },
  feedComment: { color: colors.textPrimary, fontStyle: 'italic', marginTop: 4 },
  feedCommentBlur: { color: colors.textSecondary, opacity: 0.5, marginTop: 4 },
  spoilerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  spoilerText: { color: colors.textSecondary, fontSize: 10 },

  // Member Card
  memberCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.slate, borderRadius: 8, marginBottom: 10 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  memberName: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
  memberRole: { color: colors.textSecondary, fontSize: 12 },
  kickBtn: { padding: 8, marginLeft: 8 },
});
