import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { colors } from '../../core/theme/colors';
import { useGroupMembers } from '../../features/groups/useGroupMembers';
import { useUserGroups } from '../../features/groups/useUserGroups';
import { useGroupLibrary, GroupAnimeAggregate } from '../../features/groups/useGroupLibrary';
import { useGroupFeed, FeedEvent } from '../../features/groups/useGroupFeed';
import { Copy, Shield, User, Star, EyeOff, Eye } from 'lucide-react-native';

const SafeFlashList = FlashList as any;

type ViewMode = 'FEED' | 'CATALOGUE';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('FEED');

  const { data: members, isLoading: membersLoading } = useGroupMembers(id!);
  const { data: myGroups } = useUserGroups();
  const { data: catalogue, isLoading: catLoading } = useGroupLibrary(id!);
  const { data: feed, isLoading: feedLoading } = useGroupFeed(id!);

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

  const FeedItem = ({ item }: { item: FeedEvent }) => {
    const [showSpoiler, setShowSpoiler] = useState(false);
    // Simple logic: if rating < 3 it might be negative, but let's assume all comments are potential spoilers for now if explicitly marked (future feature).
    // For now, we just show all. Or we can blur if it's long? Let's implement a toggle for the comment.

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
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'CATALOGUE' ? (
          catLoading ? (
            <ActivityIndicator color={colors.gold} />
          ) : (
            <SafeFlashList
              data={catalogue || []}
              renderItem={renderCatalogueItem}
              estimatedItemSize={100}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucun anime en commun pour l'instant.</Text>}
            />
          )
        ) : (
          feedLoading ? (
            <ActivityIndicator color={colors.gold} />
          ) : (
            <SafeFlashList
              data={feed || []}
              renderItem={({ item }: { item: FeedEvent }) => <FeedItem item={item} />}
              estimatedItemSize={120}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucune activité récente.</Text>}
            />
          )
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
});
