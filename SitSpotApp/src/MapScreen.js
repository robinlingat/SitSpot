// SitSpot — Écran principal (carte)
import React, { useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MapCanvas, Marker } from './MapCanvas';
import { Icon, Chip, FloatBtn } from './components';
import { c, colors, radius, shadows } from './theme';
import { INTENTS } from './data';

export function MapScreen({
  benches,
  selectedId,
  onMarkerPress,
  activeIntents,
  toggleIntent,
  onFilters,
  activeFiltersCount,
  query,
  setQuery,
  onAddBench,
  children,
}) {
  const matches = b =>
    activeIntents.length === 0 || activeIntents.some(i => i === 'near' || b.intents.includes(i));

  const visibleCount = benches.filter(matches).length;

  return (
    <View style={styles.container}>
      {/* Fond de carte avec marqueurs */}
      <MapCanvas dimmed={!!selectedId}>
        {benches.map(b => (
          <View key={b.id} style={{ opacity: matches(b) ? 1 : 0.28 }}>
            <Marker
              bench={b}
              open={selectedId === b.id}
              onPress={() => onMarkerPress(b.id)}
            />
          </View>
        ))}
      </MapCanvas>

      {/* Barre de recherche + filtres rapides */}
      <TopBar
        query={query}
        setQuery={setQuery}
        intents={INTENTS}
        active={activeIntents}
        toggle={toggleIntent}
        onFilters={onFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Contrôles flottants (uniquement si aucun banc sélectionné) */}
      {!selectedId && (
        <>
          {/* Zoom + localisation (droite) */}
          <View style={styles.rightControls}>
            <FloatBtn icon="crosshair" label="Ma position" accent />
            <FloatBtn icon="plus"      label="Zoom +" />
            <FloatBtn icon="minus"     label="Zoom -" />
          </View>

          {/* Bouton ajouter un banc (gauche) */}
          <View style={styles.leftControls}>
            <FloatBtn icon="plus" label="Ajouter un banc" onPress={onAddBench} />
          </View>

          {/* Compteur de bancs */}
          {activeIntents.length === 0 && (
            <View style={styles.countPill} pointerEvents="none">
              <Icon n="map-pin" s={15} color={colors.green600} />
              <Text style={styles.countText}>{visibleCount} bancs près de toi</Text>
            </View>
          )}
        </>
      )}

      {/* Contenu injecté (BenchSheet, overlays…) */}
      {children}
    </View>
  );
}

// ── Barre de recherche + chips ─────────────────────────────────
function TopBar({ query, setQuery, intents, active, toggle, onFilters, activeFiltersCount }) {
  return (
    <View style={styles.topBar} pointerEvents="box-none">
      {/* Champ de recherche */}
      <View style={styles.searchRow} pointerEvents="auto">
        <Icon n="search" s={18} color={c.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cherche un banc…"
          placeholderTextColor={c.textMuted}
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={onFilters}
          style={[
            styles.filterBtn,
            activeFiltersCount > 0
              ? { backgroundColor: colors.green50 }
              : { backgroundColor: colors.neutral100 },
          ]}
        >
          <Icon
            n="sliders-horizontal"
            s={18}
            color={activeFiltersCount > 0 ? c.textAccent : c.textSecondary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Chips d'intentions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
        pointerEvents="auto"
      >
        {intents.map(it => (
          <Chip
            key={it.id}
            icon={it.icon}
            selected={active.includes(it.id)}
            onPress={() => toggle(it.id)}
          >
            {it.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    zIndex: 40,
    paddingHorizontal: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 999,
    ...shadows.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: c.textPrimary,
    height: '100%',
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  chipsScroll: {
    marginTop: 10,
  },
  chipsContent: {
    gap: 8,
    paddingVertical: 4,
  },
  rightControls: {
    position: 'absolute',
    right: 14,
    bottom: 90,
    gap: 10,
    zIndex: 35,
  },
  leftControls: {
    position: 'absolute',
    left: 14,
    bottom: 90,
    zIndex: 35,
  },
  countPill: {
    position: 'absolute',
    alignSelf: 'center',
    left: 0,
    right: 0,
    bottom: 148,
    zIndex: 30,
    alignItems: 'center',
  },
  countPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 38,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    ...shadows.md,
  },
  countText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.neutral900,
  },
});
