import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../core/theme/colors';
import { useAuth } from '../core/auth/AuthContext';
import { supabase } from '../core/services/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SignupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signUp } = useAuth(); // Keeping for context if needed, but using direct call

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !username || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) {
                console.error('Signup Failed:', error);
                Alert.alert("Échec de l'inscription", error.message);
                return;
            }

            Alert.alert('Compte créé !', 'Veuillez vérifier vos emails pour valider le compte.');
            router.replace('/login');

        } catch (err: any) {
            console.error('Signup Exception:', err);
            Alert.alert('Erreur inattendue', err.message || 'Une erreur technique est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
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
                        <Input
                            label="Confirmer le mot de passe"
                            placeholder="••••••••"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
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
            </ScrollView>
        </KeyboardAvoidingView>
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
