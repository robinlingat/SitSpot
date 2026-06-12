// SitSpot — Écran de profil
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Icon, Stars, Btn, Avatar } from './components';
import { c, colors, shadows } from './theme';
import { BENCHES } from './data';

export function ProfileScreen({ isLoggedIn, user, onLogout, onLogin }) {
  if (!isLoggedIn) {
    return (
      <View style={styles.loggedOut}>
        <View style={styles.userIcon}>
          <Icon n="user" s={30} color={c.textAccent} />
        </View>
        <Text style={styles.loggedOutTitle}>Connecte-toi</Text>
        <Text style={styles.loggedOutText}>
          Pour noter des bancs, ajouter les tiens et consulter ton profil.
        </Text>
        <Btn variant="primary" iconLeft="user" onPress={onLogin}>
          Connexion / Inscription
        </Btn>
      </View>
    );
  }

  const myBenches = BENCHES.slice(0, 2);
  const myReviews = [
    { bench: 'Banc du parc Monceau', score: 5, date: 'il y a 3 j' },
    { bench: 'Banc des quais',        score: 5, date: 'il y a 1 sem' },
    { bench: 'Banc de la butte',      score: 4, date: 'il y a 3 sem' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Carte profil */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={{ position: 'relative' }}>
            <Avatar name={user.name} size={60} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Icon n="camera" s={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPseudo}>@{user.pseudo}</Text>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsRow}>
          {[
            { label: 'Bancs ajoutés', value: user.benchCount },
            { label: 'Avis postés',   value: user.reviewCount },
          ].map((s, i) => (
            <View
              key={i}
              style={[
                styles.statItem,
                i === 0 && { borderRightWidth: 1, borderRightColor: colors.neutral200 },
              ]}
            >
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mes bancs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes bancs</Text>
        {myBenches.map((b, i) => (
          <View
            key={b.id}
            style={[styles.benchRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.neutral200 }]}
          >
            <View style={styles.benchIcon}>
              <Icon n="armchair" s={18} color={colors.green700} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.benchName} numberOfLines={1}>{b.name}</Text>
              <Text style={styles.benchArea}>{b.area}</Text>
            </View>
            <View style={styles.ratingMini}>
              <Feather name="star" size={13} color={colors.star} />
              <Text style={styles.ratingValue}>{String(b.score).replace('.', ',')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Mes avis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes avis</Text>
        {myReviews.map((r, i) => (
          <View
            key={i}
            style={[styles.reviewRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.neutral200 }]}
          >
            <View style={styles.reviewIcon}>
              <Feather name="star" size={17} color={c.textAccent} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.reviewBench} numberOfLines={1}>{r.bench}</Text>
              <View style={styles.reviewMeta}>
                <Stars value={r.score} size={12} />
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Déconnexion */}
      <View style={styles.logoutArea}>
        <Btn variant="danger" full onPress={onLogout}>Se déconnecter</Btn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  loggedOut: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.neutral50,
  },
  userIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loggedOutTitle: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.4,
    marginBottom: 8,
    color: colors.neutral900,
  },
  loggedOutText: {
    fontSize: 15,
    color: c.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 260,
  },
  profileCard: {
    backgroundColor: colors.neutral0,
    padding: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '800',
    fontSize: 19,
    letterSpacing: -0.4,
    color: colors.neutral900,
  },
  userPseudo: {
    fontSize: 13,
    color: c.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '800',
    fontSize: 28,
    letterSpacing: -0.6,
    color: colors.neutral900,
  },
  statLabel: {
    fontSize: 12,
    color: c.textMuted,
  },
  section: {
    marginTop: 10,
    backgroundColor: colors.neutral0,
    padding: 16,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
    color: colors.neutral900,
    marginBottom: 12,
  },
  benchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  benchIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#cfe6c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benchName: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.neutral900,
  },
  benchArea: {
    fontSize: 12,
    color: c.textMuted,
    marginTop: 1,
  },
  ratingMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  reviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBench: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.neutral900,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: c.textMuted,
  },
  logoutArea: {
    margin: 20,
    marginBottom: 24,
  },
});
