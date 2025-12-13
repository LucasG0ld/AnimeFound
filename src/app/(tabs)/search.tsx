import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image as RNImage, Alert, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../core/theme/colors';
import { Input } from '../../components/ui/Input';
import { useAnimeSearch } from '../../features/search/useAnimeSearch';
import { useAddAnime } from '../../features/library/useAddAnime';
import { JikanAnime } from '../../core/services/jikan';
import { Plus, Check } from 'lucide-react-native';

const AnimeListItem = ({ item, onAdd }: { item: JikanAnime; onAdd: (anime: JikanAnime) => void }) => {
    const [added, setAdded] = useState(false);

    const handlePress = () => {
        onAdd(item);
        setAdded(true); // Optimistic UI
    };

    return (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: item.images.jpg.image_url }}
                style={styles.itemImage}
                contentFit="cover"
                transition={200}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title_english || item.title}
                </Text>
                <Text style={styles.itemMeta}>
                    {item.year || 'N/A'} • {item.type || 'TV'}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.addButton, added && styles.addedButton]}
                onPress={handlePress}
                disabled={added}
            >
                {added ? (
                    <Check size={20} color={colors.carbon} />
                ) : (
                    <Plus size={20} color={colors.black} />
                )}
            </TouchableOpacity>
        </View>
    );
};

// Fix for persistent FlashList type error in this environment
const SafeFlashList = FlashList as any;

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const { data: results, isLoading, error } = useAnimeSearch(query);
    const addMutation = useAddAnime();

    const handleAdd = async (anime: JikanAnime) => {
        try {
            await addMutation.mutateAsync(anime);
        } catch (err: any) {
            Alert.alert('Info', err.message);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Input
                    placeholder="Rechercher un anime..."
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                    autoFocus
                />
            </View>

            {isLoading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.gold} />
                </View>
            )}

            <SafeFlashList
                data={results || []}
                renderItem={({ item }: { item: JikanAnime }) => <AnimeListItem item={item} onAdd={handleAdd} />}
                estimatedItemSize={100}
                keyExtractor={(item: JikanAnime) => item.mal_id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !isLoading && query.length > 2 ? (
                        <Text style={styles.emptyText}>Aucun résultat trouvé.</Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    header: {
        padding: 16,
        backgroundColor: colors.carbon,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate,
    },
    searchInput: {
        backgroundColor: colors.slate,
        borderWidth: 0,
    },
    center: {
        marginTop: 50,
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
    // Item Styles
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: colors.slate,
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        paddingRight: 12,
    },
    itemImage: {
        width: 70,
        height: 105, // 2:3 Ratio
    },
    itemInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    itemTitle: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 4,
    },
    itemMeta: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addedButton: {
        backgroundColor: colors.success,
    },
});
