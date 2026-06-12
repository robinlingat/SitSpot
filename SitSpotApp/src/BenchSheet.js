// SitSpot — Fiche détaillée d'un banc (bottom sheet)
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon, Stars, Btn, Tag, Badge, Avatar } from './components';
import { c, colors, fonts, radius, shadows } from './theme';

export function BenchSheet({ bench, onClose, onAddReview, onNeedAuth, isLoggedIn }) {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  if (!bench) return null;

  return (
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Poignée */}
      <View style={styles.handle}>
        <View style={styles.handleBar} />
      </View>

      {/* En-tête avec photo */}
      <View style={styles.photoHeader}>
        <View style={styles.photoIcon}>
          <MaterialCommunityIcons name="armchair" size={44} color={colors.green700} />
        </View>

        {/* Badge statut */}
        <View style={styles.badgePos}>
          <Badge tone={bench.status.tone} solid dot>{bench.status.label}</Badge>
        </View>

        {/* Bouton fermer */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon n="x" s={16} color={colors.neutral700} />
        </TouchableOpacity>

        {/* Miniatures photos */}
        <View style={styles.photosRow}>
          {bench.photos > 0
            ? Array.from({ length: Math.min(bench.photos, 3) }).map((_, i) => (
                <View key={i} style={styles.photoThumb}>
                  <Icon n="image" s={14} color={colors.green700} />
                </View>
              ))
            : (
              <View style={styles.addPhotoBtn}>
                <Icon n="camera" s={13} color={colors.green700} />
                <Text style={styles.addPhotoText}>Ajouter une photo</Text>
              </View>
            )
          }
        </View>
      </View>

      {/* Contenu scrollable */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Titre + distance */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.benchName}>{bench.name}</Text>
            <Text style={styles.benchArea}>{bench.area}</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Icon n="navigation" s={12} color={c.textMuted} />
            <Text style={styles.distanceText}>{bench.distance}</Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.ratingRow}>
          <Stars value={bench.score || 0} size={16} />
          {bench.score
            ? <>
                <Text style={styles.scoreValue}>{String(bench.score).replace('.', ',')}</Text>
                <Text style={styles.reviewCount}>· {bench.count} avis</Text>
              </>
            : <Text style={styles.noReviews}>Aucun avis</Text>
          }
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {bench.tags.map((t, i) => <Tag key={i} icon={t.icon}>{t.label}</Tag>)}
        </View>

        {/* Boutons actions */}
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <Btn variant="primary" full iconLeft="navigation" onPress={() => {}}>
              M'y emmener
            </Btn>
          </View>
          <Btn variant="ghost" iconLeft="share-2" onPress={() => {}}>
            Partager
          </Btn>
        </View>

        {/* Section avis */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Avis</Text>
            <Btn
              variant="ghost"
              size="sm"
              iconLeft="plus"
              onPress={isLoggedIn ? onAddReview : onNeedAuth}
            >
              Ajouter
            </Btn>
          </View>

          {bench.reviews.length === 0
            ? (
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyText}>Aucun avis pour l'instant 🌱</Text>
                <Text style={styles.emptySubText}>Sois le premier !</Text>
              </View>
            )
            : bench.reviews.map((r, i) => (
              <View
                key={i}
                style={[styles.review, i > 0 && { borderTopWidth: 1, borderTopColor: colors.neutral200 }]}
              >
                <Avatar name={r.name} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View style={{ marginVertical: 3 }}>
                    <Stars value={r.score} size={13} />
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              </View>
            ))
          }
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 78,
    left: 0,
    right: 0,
    height: '68%',
    backgroundColor: colors.neutral0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...shadows.xl,
  },
  handle: {
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.neutral300,
  },
  photoHeader: {
    height: 138,
    backgroundColor: '#cfe6c6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photoIcon: {
    position: 'absolute',
  },
  badgePos: {
    position: 'absolute',
    top: 12,
    left: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photosRow: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    flexDirection: 'row',
    gap: 6,
  },
  photoThumb: {
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green700,
  },
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  benchName: {
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: -0.4,
    lineHeight: 23,
    color: colors.neutral900,
  },
  benchArea: {
    marginTop: 3,
    fontSize: 13,
    color: c.textMuted,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: c.textMuted,
    fontVariant: ['tabular-nums'],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  scoreValue: {
    fontWeight: '800',
    fontSize: 15,
    color: colors.neutral900,
  },
  reviewCount: {
    fontSize: 13,
    color: c.textMuted,
  },
  noReviews: {
    fontSize: 13,
    color: c.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewsTitle: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.2,
    color: colors.neutral900,
  },
  emptyReviews: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyText: {
    color: c.textMuted,
    fontSize: 14,
  },
  emptySubText: {
    fontSize: 13,
    color: c.textMuted,
  },
  review: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  reviewName: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.neutral900,
  },
  reviewDate: {
    fontSize: 11,
    color: c.textMuted,
  },
  reviewText: {
    margin: 0,
    fontSize: 13,
    lineHeight: 20,
    color: c.textSecondary,
  },
});
