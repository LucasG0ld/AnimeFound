import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../core/theme/colors';
import { useAuth } from '../core/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SignupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signUp } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !username) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, username);
        setLoading(false);

        if (error) {
            Alert.alert('Erreur', error.message);
        } else {
            Alert.alert('Succès', 'Votre compte a été créé. Veuillez vérifier votre email pour confirmer.');
            router.back();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>Rejoignez la communauté AnimeFound.</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Nom d'utilisateur"
                        placeholder="OtakuDu92"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <Input
                        label="Email"
                        placeholder="exemple@email.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label="Mot de passe"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        title="S'inscrire"
                        onPress={handleSignup}
                        loading={loading}
                        style={styles.button}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Déjà un compte ?</Text>
                    <Link href="/login" asChild>
                        <Button variant="ghost" title="Se connecter" onPress={() => { }} />
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.carbon,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.gold,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    form: {
        marginBottom: 24,
    },
    button: {
        marginTop: 16,
    },
    footer: {
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        color: colors.textPrimary,
    },
});
