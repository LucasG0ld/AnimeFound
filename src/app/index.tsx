import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../core/theme/colors';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenue sur AnimeFound</Text>
            <Text style={styles.subtext}>Phase 0: Initialisation terminée.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.carbon,
    },
    text: {
        color: colors.gold,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        color: colors.textPrimary,
        fontSize: 16,
    },
});
