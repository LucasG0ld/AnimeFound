import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { colors } from '../../../core/theme/colors';
import { LibraryItem } from '../useUserLibrary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 10;
const HORIZONTAL_PADDING = 10;

// (Screen - Padding - Spacing between items) / Columns
const ITEM_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - ((COLUMN_COUNT - 1) * SPACING)) / COLUMN_COUNT;

export const AnimeCard = ({ item }: { item: LibraryItem }) => {
    return (
        <Link href={`/anime/${item.anime.id}`} asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <Image
                    source={{ uri: item.anime.image_url }}
                    style={styles.cardImage}
                    contentFit="cover"
                    transition={200}
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.anime.title_en || 'Titre Inconnu'}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        width: ITEM_WIDTH,
        marginBottom: 15, // Vertical spacing
        marginRight: SPACING,
    },
    cardImage: {
        width: '100%',
        borderRadius: 8,
        aspectRatio: 2 / 3, // Standard Poster Ratio
        backgroundColor: colors.slate,
        marginBottom: 6,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'left',
    },
});
