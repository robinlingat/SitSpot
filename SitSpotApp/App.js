// SitSpot — Application principale
import React, { useState, useCallback } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';

import { BENCHES, USER } from './src/data';
import { TabBar }        from './src/TabBar';
import { MapScreen }     from './src/MapScreen';
import { ProfileScreen } from './src/ProfileScreen';
import { BenchSheet }    from './src/BenchSheet';
import { FiltersSheet }  from './src/FiltersSheet';
import { AddReviewModal } from './src/AddReviewModal';
import { AddBenchModal } from './src/AddBenchModal';
import { AuthModal }     from './src/AuthModal';
import { Toast }         from './src/components';
import { c, colors }     from './src/theme';

// ─────────────────────────────────────────────────────────────
export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    DMMono_400Regular,
  });

  // ── État global ──────────────────────────────────────────────
  const [tab,           setTab]          = useState('map');
  const [selectedId,    setSelectedId]   = useState(null);
  const [overlay,       setOverlay]      = useState(null); // 'review'|'addBench'|'filters'|'auth'
  const [authView,      setAuthView]     = useState('login');
  const [isLoggedIn,    setIsLoggedIn]   = useState(false);
  const [activeIntents, setActiveIntents]= useState([]);
  const [query,         setQuery]        = useState('');
  const [filters,       setFilters]      = useState({ distance: null, shade: null, minRating: null, pmr: false });
  const [toast,         setToast]        = useState(null);

  const selected = BENCHES.find(b => b.id === selectedId) || null;

  // ── Actions ──────────────────────────────────────────────────
  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const toggleIntent = useCallback(id =>
    setActiveIntents(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id])
  , []);

  const openAuth = useCallback(() => {
    setAuthView('login');
    setOverlay('auth');
  }, []);

  const handleMarker = useCallback(id => {
    setSelectedId(prev => prev === id ? null : id);
    setOverlay(null);
  }, []);

  const handleAddBench = useCallback(() => {
    if (!isLoggedIn) { openAuth(); return; }
    setOverlay('addBench');
  }, [isLoggedIn, openAuth]);

  const handleReviewSubmit = useCallback(() => {
    setOverlay(null);
    showToast("Merci ! Ton avis aide les autres à mieux s'asseoir 🙌");
  }, [showToast]);

  const handleBenchSubmit = useCallback(() => {
    setOverlay(null);
    setSelectedId(null);
    showToast('Banc ajouté ! Il apparaît sur la carte 🗺️');
  }, [showToast]);

  const handleAuthSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setOverlay(null);
    showToast('Bienvenue sur SitSpot 👋');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    showToast('Déconnecté. À bientôt !');
  }, [showToast]);

  const switchTab = useCallback(t => {
    setTab(t);
    if (t === 'map') {
      setSelectedId(null);
      setOverlay(null);
    }
  }, []);

  const activeFiltersCount = [
    filters.distance,
    filters.shade,
    filters.minRating,
    filters.pmr,
  ].filter(Boolean).length;

  // ── Rendu ────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ═══ ONGLET CARTE ═══ */}
      {tab === 'map' && (
        <MapScreen
          benches={BENCHES}
          selectedId={selectedId}
          onMarkerPress={handleMarker}
          activeIntents={activeIntents}
          toggleIntent={toggleIntent}
          onFilters={() => setOverlay('filters')}
          activeFiltersCount={activeFiltersCount}
          query={query}
          setQuery={setQuery}
          onAddBench={handleAddBench}
        >
          {/* Fond semi-transparent quand un banc est ouvert */}
          {selected && (
            <View
              onTouchEnd={() => setSelectedId(null)}
              style={styles.sheetBackdrop}
            />
          )}

          {/* Fiche banc */}
          {selected && (
            <BenchSheet
              bench={selected}
              onClose={() => setSelectedId(null)}
              isLoggedIn={isLoggedIn}
              onAddReview={() => setOverlay('review')}
              onNeedAuth={openAuth}
            />
          )}
        </MapScreen>
      )}

      {/* ═══ ONGLET PROFIL ═══ */}
      {tab === 'profile' && (
        <View style={styles.profileWrapper}>
          <SafeAreaView style={styles.profileHeader}>
            {/* Titre de la page profil */}
          </SafeAreaView>
          <ProfileScreen
            isLoggedIn={isLoggedIn}
            user={USER}
            onLogout={handleLogout}
            onLogin={openAuth}
          />
        </View>
      )}

      {/* ═══ BARRE DE NAVIGATION ═══ */}
      <TabBar tab={tab} setTab={switchTab} />

      {/* ═══ OVERLAYS ═══ */}
      {overlay === 'filters' && (
        <FiltersSheet
          filters={filters}
          setFilters={setFilters}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'review' && selected && (
        <AddReviewModal
          bench={selected}
          onClose={() => setOverlay(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
      {overlay === 'addBench' && (
        <AddBenchModal
          onClose={() => setOverlay(null)}
          onSubmit={handleBenchSubmit}
        />
      )}
      {overlay === 'auth' && (
        <AuthModal
          view={authView}
          setView={setAuthView}
          onClose={() => setOverlay(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Toast de confirmation */}
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 78,
    backgroundColor: 'rgba(26,25,22,0.18)',
    zIndex: 48,
  },
  profileWrapper: {
    flex: 1,
    paddingBottom: 78,
  },
  profileHeader: {
    backgroundColor: colors.neutral0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
});
