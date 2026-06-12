// SitSpot — Barre de navigation en bas
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { c, colors, shadows } from './theme';

const TABS = [
  { id: 'map',     icon: 'map',  label: 'Carte'  },
  { id: 'profile', icon: 'user', label: 'Profil' },
];

export function TabBar({ tab, setTab }) {
  return (
    <View style={styles.container}>
      {TABS.map(it => {
        const active = tab === it.id;
        return (
          <TouchableOpacity
            key={it.id}
            onPress={() => setTab(it.id)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Feather
              name={it.icon}
              size={24}
              color={active ? c.accent : c.textMuted}
            />
            <Text style={[styles.label, { color: active ? c.accent : c.textMuted, fontWeight: active ? '700' : '500' }]}>
              {it.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 8,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
    height: 56,
  },
  label: {
    fontSize: 11,
  },
});
