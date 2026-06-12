// SitSpot — Modal d'ajout d'avis
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Icon, Btn, Tag } from './components';
import { c, colors, radius, shadows } from './theme';
import { REVIEW_TAGS } from './data';

export function AddReviewModal({ bench, onClose, onSubmit }) {
  const [score, setScore]     = useState(0);
  const [text, setText]       = useState('');
  const [selTags, setSelTags] = useState([]);
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleTag = t => setSelTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Fond flou */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Carte modale */}
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '76%' }}>
          <View style={styles.content}>
            {/* Titre */}
            <View style={styles.header}>
              <View>
                <Text style={styles.subtitle}>Comment était ce spot ?</Text>
                <Text style={styles.benchName}>{bench.name}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon n="x" s={16} color={c.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sélecteur d'étoiles */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setScore(i)} activeOpacity={0.7}>
                  <Feather
                    name="star"
                    size={40}
                    color={score >= i ? colors.star : colors.neutral200}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Commentaire */}
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Propre ? À l'ombre ? Tranquille ? Raconte…"
              placeholderTextColor={c.textMuted}
              multiline
              numberOfLines={3}
              maxLength={500}
              style={styles.textInput}
            />
            <Text style={styles.charCount}>{text.length}/500</Text>

            {/* Tags caractéristiques */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Caractéristiques</Text>
              <View style={styles.tagsRow}>
                {REVIEW_TAGS.slice(0, 8).map(t => (
                  <Tag
                    key={t}
                    selected={selTags.includes(t)}
                    onPress={() => toggleTag(t)}
                  >
                    {t}
                  </Tag>
                ))}
              </View>
            </View>

            {/* Ajouter des photos */}
            <TouchableOpacity style={styles.photoZone}>
              <View style={styles.photoIcon}>
                <Icon n="camera" s={18} color={c.textMuted} />
              </View>
              <View>
                <Text style={styles.photoTitle}>Ajouter des photos</Text>
                <Text style={styles.photoSub}>Facultatif · max 3</Text>
              </View>
            </TouchableOpacity>

            {/* Bouton publier */}
            <View style={{ marginTop: 18 }}>
              <Btn
                variant="primary"
                full
                disabled={!score}
                onPress={() => onSubmit({ score, text, tags: selTags })}
              >
                Publier mon avis
              </Btn>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,25,22,0.5)',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '15%',
    backgroundColor: colors.neutral0,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.xl,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: c.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  benchName: {
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.4,
    marginTop: 3,
    color: colors.neutral900,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  textInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.neutral200,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    lineHeight: 21,
    color: colors.neutral900,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: c.textFaint,
    marginTop: 3,
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textMuted,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  photoZone: {
    marginTop: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.neutral300,
    borderStyle: 'dashed',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral900,
  },
  photoSub: {
    fontSize: 12,
    color: c.textMuted,
  },
});
