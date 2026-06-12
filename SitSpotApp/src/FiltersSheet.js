// SitSpot — Panneau de filtres (bottom sheet)
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Chip, Btn, Icon } from './components';
import { c, colors, radius, shadows } from './theme';

export function FiltersSheet({ filters, setFilters, onClose }) {
  const [loc, setLoc] = useState(filters);
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const tog = (k, v) => setLoc(f => ({ ...f, [k]: f[k] === v ? null : v }));

  const Label = ({ txt }) => (
    <Text style={styles.label}>{txt}</Text>
  );

  return (
    <View style={StyleSheet.absoluteFill}>
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

        {/* Contenu */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Titre */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtres</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon n="x" s={16} color={c.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Label txt="Distance" />
            <View style={styles.chipsRow}>
              {['200 m', '500 m', '1 km', '5 km'].map(d => (
                <Chip key={d} selected={loc.distance === d} onPress={() => tog('distance', d)}>{d}</Chip>
              ))}
            </View>
          </View>

          {/* Ombrage */}
          <View style={styles.section}>
            <Label txt="Ombrage" />
            <View style={styles.chipsRow}>
              {["Ensoleillé", "À l'ombre", "Les deux"].map(s => (
                <Chip key={s} selected={loc.shade === s} onPress={() => tog('shade', s)}>{s}</Chip>
              ))}
            </View>
          </View>

          {/* Note minimum */}
          <View style={styles.section}>
            <Label txt="Note minimum" />
            <View style={styles.chipsRow}>
              {['≥ 3 ★', '≥ 4 ★'].map(r => (
                <Chip key={r} selected={loc.minRating === r} onPress={() => tog('minRating', r)}>{r}</Chip>
              ))}
            </View>
          </View>

          {/* Accessible PMR (toggle) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Accessible PMR</Text>
            <TouchableOpacity
              onPress={() => setLoc(f => ({ ...f, pmr: !f.pmr }))}
              style={[styles.toggle, { backgroundColor: loc.pmr ? c.accent : colors.neutral300 }]}
            >
              <View style={[styles.toggleKnob, { transform: [{ translateX: loc.pmr ? 20 : 0 }] }]} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Boutons */}
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Btn
              variant="ghost"
              full
              onPress={() => setLoc({ distance: null, shade: null, minRating: null, pmr: false })}
            >
              Réinitialiser
            </Btn>
          </View>
          <View style={{ flex: 1 }}>
            <Btn
              variant="primary"
              full
              onPress={() => { setFilters(loc); onClose(); }}
            >
              Appliquer
            </Btn>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,25,22,0.3)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    backgroundColor: colors.neutral0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    marginBottom: 20,
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
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: c.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral900,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
});
