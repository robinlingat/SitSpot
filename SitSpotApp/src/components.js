// SitSpot — Composants de base (Kit UI)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { c, colors, fonts, radius, shadows } from './theme';

// ── Icon ──────────────────────────────────────────────────────
// Traduit les noms d'icônes Lucide vers Feather/MaterialCommunity
const ICON_MAP = {
  'search':            { set: 'Feather', name: 'search' },
  'sliders-horizontal':{ set: 'Feather', name: 'sliders' },
  'navigation':        { set: 'Feather', name: 'navigation' },
  'map-pin':           { set: 'Feather', name: 'map-pin' },
  'armchair':          { set: 'MaterialCommunity', name: 'armchair' },
  'x':                 { set: 'Feather', name: 'x' },
  'camera':            { set: 'Feather', name: 'camera' },
  'image':             { set: 'Feather', name: 'image' },
  'share-2':           { set: 'Feather', name: 'share-2' },
  'plus':              { set: 'Feather', name: 'plus' },
  'minus':             { set: 'Feather', name: 'minus' },
  'check-circle':      { set: 'Feather', name: 'check-circle' },
  'user':              { set: 'Feather', name: 'user' },
  'star':              { set: 'Feather', name: 'star' },
  'crosshair':         { set: 'Feather', name: 'crosshair' },
  'map':               { set: 'Feather', name: 'map' },
  'eye':               { set: 'Feather', name: 'eye' },
  'sun':               { set: 'Feather', name: 'sun' },
  'wind':              { set: 'Feather', name: 'wind' },
  'coffee':            { set: 'Feather', name: 'coffee' },
  'tree':              { set: 'MaterialCommunity', name: 'tree' },
  'trees':             { set: 'MaterialCommunity', name: 'tree' },
  'leaf':              { set: 'MaterialCommunity', name: 'leaf' },
  'mountain':          { set: 'MaterialCommunity', name: 'mountain' },
  'food':              { set: 'MaterialCommunity', name: 'food' },
  'sandwich':          { set: 'MaterialCommunity', name: 'food' },
};

export function Icon({ n, s = 20, color }) {
  const mapping = ICON_MAP[n];
  const col = color || c.textPrimary;
  if (!mapping) {
    return <Feather name="circle" size={s} color={col} />;
  }
  if (mapping.set === 'MaterialCommunity') {
    return <MaterialCommunityIcons name={mapping.name} size={s} color={col} />;
  }
  return <Feather name={mapping.name} size={s} color={col} />;
}

// ── Stars ─────────────────────────────────────────────────────
export function Stars({ value = 0, size = 15 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = value >= i;
        const half   = !filled && value >= i - 0.5;
        return (
          <Feather
            key={i}
            name="star"
            size={size}
            color={filled || half ? colors.star : colors.neutral200}
          />
        );
      })}
    </View>
  );
}

// ── Btn ───────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', full, onPress, iconLeft, disabled }) {
  const sz = {
    sm: { height: 36, paddingH: 14, fontSize: 13 },
    md: { height: 48, paddingH: 22, fontSize: 15 },
    lg: { height: 56, paddingH: 28, fontSize: 17 },
  }[size];

  const vr = {
    primary:   { backgroundColor: c.accent,          color: '#fff' },
    secondary: { backgroundColor: c.accent2,          color: '#fff' },
    soft:      { backgroundColor: c.surfaceAccentSoft,color: c.textAccent },
    ghost:     { backgroundColor: 'transparent',      color: c.textPrimary, borderWidth: 1.5, borderColor: c.borderDefault },
    danger:    { backgroundColor: colors.dangerBg,    color: colors.danger },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          height: sz.height,
          paddingHorizontal: sz.paddingH,
          width: full ? '100%' : undefined,
          backgroundColor: vr.backgroundColor,
          borderRadius: radius.full,
          opacity: disabled ? 0.48 : 1,
          borderWidth: vr.borderWidth || 0,
          borderColor: vr.borderColor || 'transparent',
        },
      ]}
    >
      {iconLeft && <Icon n={iconLeft} s={14} color={vr.color} />}
      <Text style={[styles.btnText, { fontSize: sz.fontSize, color: vr.color }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ── Chip ──────────────────────────────────────────────────────
export function Chip({ children, selected, icon, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: c.accent, borderColor: c.accent }
          : { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: c.borderSubtle },
      ]}
    >
      {icon && <Icon n={icon} s={15} color={selected ? '#fff' : c.textSecondary} />}
      <Text style={[styles.chipText, { color: selected ? '#fff' : c.textSecondary }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ── Tag ───────────────────────────────────────────────────────
export function Tag({ children, icon, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={[
        styles.tag,
        selected
          ? { backgroundColor: c.surfaceAccentSoft, borderWidth: 1.5, borderColor: c.borderAccent }
          : { backgroundColor: c.surfaceSunken, borderWidth: 0 },
      ]}
    >
      {icon && <Icon n={icon} s={14} color={selected ? c.textAccent : c.textMuted} />}
      <Text style={[styles.tagText, { color: selected ? c.textAccent : c.textSecondary }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, tone = 'green', solid, dot }) {
  const p = {
    green:   { s: colors.green500, bg: colors.green50,    tx: colors.green700  },
    blue:    { s: colors.blue500,  bg: colors.blue50,     tx: colors.blue700   },
    gold:    { s: colors.star,     bg: '#FDF1DC',          tx: '#9A6B12'        },
    neutral: { s: colors.neutral500, bg: colors.neutral100, tx: colors.neutral600 },
  }[tone] || { s: colors.green500, bg: colors.green50, tx: colors.green700 };

  return (
    <View style={[
      styles.badge,
      { backgroundColor: solid ? p.s : p.bg },
    ]}>
      {dot && (
        <View style={{
          width: 6, height: 6, borderRadius: 3,
          backgroundColor: solid ? 'rgba(255,255,255,0.7)' : p.s,
          marginRight: 4,
        }} />
      )}
      <Text style={[styles.badgeText, { color: solid ? '#fff' : p.tx }]}>
        {children}
      </Text>
    </View>
  );
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ name = '', size = 40 }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const tints = [colors.green100, colors.blue100, colors.green200, colors.blue200];
  const txts  = [colors.green800, colors.blue800, colors.green800, colors.blue800];
  const idx   = (name.charCodeAt(0) || 0) % 4;

  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: tints[idx] },
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38, color: txts[idx] }]}>
        {initials || '?'}
      </Text>
    </View>
  );
}

// ── FloatBtn ──────────────────────────────────────────────────
export function FloatBtn({ icon, label, accent, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={label}
      style={[
        styles.floatBtn,
        accent
          ? { backgroundColor: c.accent, ...shadows.md }
          : { backgroundColor: 'rgba(255,255,255,0.94)', ...shadows.md },
      ]}
    >
      <Icon n={icon} s={20} color={accent ? '#fff' : c.textPrimary} />
    </TouchableOpacity>
  );
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ message }) {
  if (!message) return null;
  return (
    <View style={styles.toast} pointerEvents="none">
      <Icon n="check-circle" s={18} color={colors.green400} />
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 14,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radius.full,
  },
  tagText: {
    fontWeight: '600',
    fontSize: 13,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
  },
  floatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: colors.neutral900,
    borderRadius: radius.full,
    ...shadows.xl,
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
