import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../core/theme/colors';
import { useUserLibrary, WatchStatus, LibraryItem } from '../../features/library/useUserLibrary';

// Fix FlashList Typing
const SafeFlashList = FlashList as any;

const STATUS_TABS: { label: string; value: WatchStatus | 'ALL' }[] = [
    { label: 'Tous', value: 'ALL' },
    { label: 'En cours', value: 'WATCHING' },
    { label: 'Terminés', value: 'COMPLETED' },
    { label: 'À voir', value: 'PLAN_TO_WATCH' },
    { label: 'Abandonnés', value: 'DROPPED' },
];

// ... imports
import { AnimeCard } from '../../features/library/components/AnimeCard';

// ... tabs logic ...

export default function LibraryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState<WatchStatus | 'ALL'>('ALL');
    const { data: libraryItems, isLoading } = useUserLibrary(status);

    return (
        <View style={styles.container}>
            {/* Status Tabs */}
            <View style={styles.tabsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContent}
                >
                    {STATUS_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.value}
                            style={[styles.tab, status === tab.value && styles.activeTab]}
                            onPress={() => setStatus(tab.value)}
                        >
                            <Text style={[styles.tabText, status === tab.value && styles.activeTabText]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.gold} />
                </View>
            ) : (
                <SafeFlashList
                    data={libraryItems || []}
                    renderItem={({ item }: { item: LibraryItem }) => <AnimeCard item={item} />}
                    estimatedItemSize={180}
                    numColumns={3}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingTop: 15,
                        paddingBottom: 100
                    }}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>Votre bibliothèque est vide.</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/search')}
                                style={{
                                    marginTop: 12,
                                    backgroundColor: colors.gold,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 20
                                }}
                            >
                                <Text style={{ fontWeight: 'bold', color: colors.carbon }}>Ajouter un anime</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    tabsWrapper: {
        backgroundColor: colors.carbon,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate,
    },
    tabsContent: {
        flexDirection: 'row',
        padding: 12,
        paddingRight: 40,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.slate,
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: colors.gold,
        borderColor: colors.gold,
    },
    tabText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    activeTabText: {
        color: colors.carbon,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
});
