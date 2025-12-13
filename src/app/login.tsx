import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../core/theme/colors';
import { useAuth } from '../core/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signInWithEmail } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        const { error } = await signInWithEmail(email, password);
        setLoading(false);

        if (error) {
            Alert.alert('Erreur de connexion', error.message);
        } else {
            // Navigation is handled by Root Layout via session check, but we can hint router
            // router.replace('/');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Bienvenue</Text>
                    <Text style={styles.subtitle}>Connectez-vous pour accéder à votre liste.</Text>
                </View>

                <View style={styles.form}>
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
                        title="Se connecter avec Email"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                    />

                    {/* Social Auth Placeholder */}
                    <Button
                        title="Se connecter avec Google"
                        variant="secondary"
                        onPress={() => Alert.alert('Bientôt disponible', 'La connexion Google arrive bientôt !')}
                        style={styles.socialButton}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Pas encore de compte ?</Text>
                    <Link href="/signup" asChild>
                        <Button variant="ghost" title="Créer un compte" onPress={() => { }} />
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
        marginTop: 8,
    },
    socialButton: {
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
