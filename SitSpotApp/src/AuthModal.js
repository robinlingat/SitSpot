// SitSpot — Écran d'authentification
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon, Btn } from './components';
import { c, colors, radius, shadows } from './theme';

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

export function AuthModal({ view, setView, onClose, onSuccess }) {
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [pseudo, setPseudo]   = useState('');
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const isLogin = view === 'login';

  const inp = {
    height: 50,
    borderWidth: 2,
    borderColor: colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.neutral900,
    marginBottom: 10,
  };

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Bouton fermer */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon n="x" s={18} color={c.textSecondary} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <MaterialCommunityIcons name="armchair" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>SitSpot</Text>
        </View>

        {/* Titre */}
        <Text style={styles.title}>{isLogin ? 'Bon retour 👋' : 'Rejoins SitSpot'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Connecte-toi pour noter et ajouter des bancs.'
            : 'Crée ton compte pour contribuer à la communauté.'}
        </Text>

        {/* Bouton Google */}
        <TouchableOpacity onPress={onSuccess} style={styles.googleBtn}>
          <GoogleLogo />
          <Text style={styles.googleText}>Continuer avec Google</Text>
        </TouchableOpacity>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Formulaire */}
        {!isLogin && (
          <TextInput
            value={pseudo}
            onChangeText={setPseudo}
            placeholder="Pseudo"
            placeholderTextColor={c.textMuted}
            autoCapitalize="none"
            style={inp}
          />
        )}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={c.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inp}
        />
        <TextInput
          value={pw}
          onChangeText={setPw}
          placeholder="Mot de passe"
          placeholderTextColor={c.textMuted}
          secureTextEntry
          style={inp}
        />

        {/* Bouton principal */}
        <View style={{ marginTop: 8 }}>
          <Btn variant="primary" full onPress={onSuccess}>
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </Btn>
        </View>

        {/* Lien basculer */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isLogin ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          </Text>
          <TouchableOpacity onPress={() => setView(isLogin ? 'signup' : 'login')}>
            <Text style={styles.switchLink}>
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral0,
    zIndex: 80,
  },
  content: {
    paddingTop: 76,
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  closeBtn: {
    position: 'absolute',
    top: 68,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.6,
    color: colors.neutral900,
  },
  title: {
    fontWeight: '800',
    fontSize: 26,
    letterSpacing: -0.6,
    marginBottom: 6,
    color: colors.neutral900,
  },
  subtitle: {
    fontSize: 15,
    color: c.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  googleBtn: {
    height: 52,
    borderWidth: 2,
    borderColor: colors.neutral300,
    borderRadius: 999,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral900,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral200,
  },
  separatorText: {
    fontSize: 13,
    color: c.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  switchText: {
    fontSize: 14,
    color: c.textSecondary,
  },
  switchLink: {
    fontSize: 14,
    color: c.accent,
    fontWeight: '700',
  },
});
