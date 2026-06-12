// SitSpot — Modal d'ajout d'un banc
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Svg, { Rect, Ellipse, Path } from 'react-native-svg';
import { Icon, Btn, Tag } from './components';
import { c, colors, radius, shadows } from './theme';
import { REVIEW_TAGS } from './data';

export function AddBenchModal({ onClose, onSubmit }) {
  const [name, setName]       = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [tags, setTags]       = useState([]);
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleTag = t => setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.root]}>
      {/* Fond semi-transparent */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Panneau */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Poignée */}
        <View style={styles.handleArea}>
          <View style={styles.handleBar} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Titre */}
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un banc</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon n="x" s={16} color={c.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Mini-carte avec pin */}
          <View style={styles.miniMap}>
            <Svg viewBox="0 0 400 180" style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Rect width={400} height={180} fill={colors.mapLand} />
              <Ellipse cx={200} cy={90} rx={100} ry={55} fill={colors.mapPark} />
              <Path d="M-20 90 H420" stroke={colors.mapRoadStroke} strokeWidth={13} fill="none" />
              <Path d="M200 -20 V200" stroke={colors.mapRoadStroke} strokeWidth={13} fill="none" />
              <Path d="M-20 90 H420" stroke={colors.mapRoadMajor} strokeWidth={9} fill="none" />
              <Path d="M200 -20 V200" stroke={colors.mapRoadMajor} strokeWidth={9} fill="none" />
            </Svg>
            {/* Pin de positionnement */}
            <View style={styles.pin}>
              <View style={styles.pinHead}>
                <Icon n="map-pin" s={15} color="#fff" />
              </View>
            </View>
            <View style={styles.pinHint}>
              <Text style={styles.pinHintText}>Déplace le pin à l'emplacement exact</Text>
            </View>
          </View>

          {/* Nom du banc */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Nom <Text style={styles.optional}>(facultatif)</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="ex. Banc du parc Monceau"
              placeholderTextColor={c.textMuted}
              style={styles.input}
            />
          </View>

          {/* Photo obligatoire */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Photo <Text style={styles.required}>obligatoire</Text>
            </Text>
            {hasPhoto ? (
              <View style={styles.photoThumbRow}>
                <View style={styles.photoThumb}>
                  <Icon n="image" s={22} color={colors.green700} />
                  <TouchableOpacity
                    onPress={() => setHasPhoto(false)}
                    style={styles.photoRemove}
                  >
                    <Icon n="x" s={11} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setHasPhoto(true)}
                style={styles.photoZone}
              >
                <Icon n="camera" s={20} color={c.textMuted} />
                <Text style={styles.photoZoneText}>Prendre ou importer</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tags caractéristiques */}
          <View style={[styles.field, { marginBottom: 22 }]}>
            <Text style={styles.fieldLabel}>
              Caractéristiques <Text style={styles.optional}>(facultatif)</Text>
            </Text>
            <View style={styles.tagsRow}>
              {REVIEW_TAGS.slice(0, 6).map(t => (
                <Tag key={t} selected={tags.includes(t)} onPress={() => toggleTag(t)}>{t}</Tag>
              ))}
            </View>
          </View>

          <Btn
            variant="primary"
            full
            disabled={!hasPhoto}
            onPress={() => onSubmit({ name, tags })}
          >
            Soumettre le banc
          </Btn>
          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,25,22,0.35)',
  },
  sheet: {
    backgroundColor: colors.neutral0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    overflow: 'hidden',
    ...shadows.xl,
  },
  handleArea: {
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
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingTop: 8,
  },
  title: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.neutral900,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniMap: {
    height: 132,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.mapLand,
    marginBottom: 18,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    position: 'absolute',
    top: '36%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -30 }],
  },
  pinHead: {
    width: 30,
    height: 30,
    backgroundColor: colors.green500,
    borderRadius: 15,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  pinHint: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pinHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textSecondary,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: c.textSecondary,
    marginBottom: 6,
  },
  optional: {
    color: c.textFaint,
    fontWeight: '400',
  },
  required: {
    color: colors.danger,
    fontSize: 12,
  },
  input: {
    height: 46,
    borderWidth: 2,
    borderColor: colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.neutral900,
  },
  photoZone: {
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral300,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.neutral100,
  },
  photoZoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: c.textSecondary,
  },
  photoThumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#cfe6c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemove: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
