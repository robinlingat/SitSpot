// SitSpot — Fond de carte SVG + Marqueurs
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Ellipse, Path, Circle } from 'react-native-svg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, shadows } from './theme';

// ── MapCanvas ─────────────────────────────────────────────────
export function MapCanvas({ children, dimmed }) {
  return (
    <View style={styles.container}>
      {/* Carte SVG statique (rendu fidèle au prototype) */}
      <Svg
        viewBox="0 0 400 780"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Rect width={400} height={780} fill={colors.mapLand} />

        {/* Textures de terrain */}
        <G fill={colors.mapLand2}>
          <Rect x={30}  y={55}  width={130} height={92}  rx={4} />
          <Rect x={238} y={88}  width={142} height={86}  rx={4} />
          <Rect x={18}  y={482} width={172} height={118} rx={4} />
          <Rect x={258} y={508} width={128} height={142} rx={4} />
          <Rect x={58}  y={308} width={92}  height={68}  rx={4} />
        </G>

        {/* Bâtiments */}
        <G fill={colors.mapBuilding}>
          <Rect x={44}  y={70}  width={46} height={34} rx={3} />
          <Rect x={100} y={70}  width={42} height={34} rx={3} />
          <Rect x={44}  y={112} width={82} height={22} rx={3} />
          <Rect x={253} y={102} width={46} height={56} rx={3} />
          <Rect x={314} y={102} width={52} height={56} rx={3} />
          <Rect x={48}  y={498} width={66} height={46} rx={3} />
          <Rect x={126} y={498} width={56} height={46} rx={3} />
          <Rect x={272} y={522} width={88} height={56} rx={3} />
          <Rect x={272} y={588} width={88} height={38} rx={3} />
          <Rect x={72}  y={326} width={52} height={38} rx={3} />
        </G>

        {/* Rivière (style Seine) */}
        <Path
          d="M-20 418 C 92 378, 202 462, 322 412 S 442 338, 462 368 L 462 478 C 442 448, 322 522, 202 572 S 82 488, -20 528 Z"
          fill={colors.mapWater}
          opacity={0.92}
        />

        {/* Parcs */}
        <Ellipse cx={154} cy={228} rx={106} ry={74} fill={colors.mapPark} />
        <Ellipse cx={154} cy={228} rx={64}  ry={44} fill={colors.mapParkDeep} opacity={0.6} />
        <Path
          d="M292 592 q 86 -30 116 52 q 20 80 -36 122 q -102 28 -132 -52 q -12 -80 52 -122 Z"
          fill={colors.mapPark}
        />
        <Ellipse cx={68} cy={372} rx={40} ry={30} fill={colors.mapPark} opacity={0.7} />

        {/* Routes principales — contour */}
        <G fill="none" stroke={colors.mapRoadStroke} strokeLinecap="round">
          <Path d="M200 -20 V800"                                     strokeWidth={22} />
          <Path d="M-20 392 H420"                                     strokeWidth={22} />
          <Path d="M-20 178 C 102 154, 272 212, 420 166"             strokeWidth={18} />
          <Path d="M64 -20 C 84 222, 36 482, 84 800"                 strokeWidth={16} />
          <Path d="M332 -20 C 352 222, 372 482, 326 800"             strokeWidth={16} />
          <Path d="M-20 602 H420"                                     strokeWidth={13} />
          <Path d="M-20 84 H420"                                      strokeWidth={11} />
          <Path d="M128 -20 V800"                                     strokeWidth={11} />
          <Path d="M276 -20 V800"                                     strokeWidth={11} />
        </G>
        {/* Routes principales — remplissage */}
        <G fill="none" stroke={colors.mapRoadMajor} strokeLinecap="round">
          <Path d="M200 -20 V800"                                     strokeWidth={18} />
          <Path d="M-20 392 H420"                                     strokeWidth={18} />
          <Path d="M-20 178 C 102 154, 272 212, 420 166"             strokeWidth={14} />
          <Path d="M64 -20 C 84 222, 36 482, 84 800"                 strokeWidth={12} />
          <Path d="M332 -20 C 352 222, 372 482, 326 800"             strokeWidth={12} />
        </G>
        {/* Rues secondaires */}
        <G fill="none" stroke={colors.mapRoad} strokeLinecap="round">
          <Path d="M-20 84 H420"   strokeWidth={8} />
          <Path d="M-20 602 H420"  strokeWidth={8} />
          <Path d="M128 -20 V800"  strokeWidth={8} />
          <Path d="M276 -20 V800"  strokeWidth={8} />
          <Path d="M-20 502 H420"  strokeWidth={5} />
          <Path d="M-20 272 H420"  strokeWidth={5} />
          <Path d="M-20 682 H420"  strokeWidth={5} />
          <Path d="M54 -20 V800"   strokeWidth={5} />
          <Path d="M174 -20 V800"  strokeWidth={5} />
          <Path d="M244 -20 V800"  strokeWidth={5} />
          <Path d="M356 -20 V800"  strokeWidth={5} />
        </G>
      </Svg>

      {/* Assombrissement quand un banc est sélectionné */}
      {dimmed && (
        <View style={styles.dimOverlay} />
      )}

      {children}
    </View>
  );
}

// ── Marker ────────────────────────────────────────────────────
export function Marker({ bench, open, onPress }) {
  const sc = bench.score;
  const dotColor = sc === null   ? colors.neutral400
    : sc >= 4    ? colors.green500
    : sc >= 2.5  ? colors.warning
    : colors.danger;

  const dim = open ? 58 : 32;

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={bench.name}
      style={[
        styles.markerWrapper,
        {
          left: `${bench.x}%`,
          top:  `${bench.y}%`,
          zIndex: open ? 30 : 10,
        },
      ]}
    >
      <View style={[
        styles.markerRing,
        {
          width: dim, height: dim, borderRadius: dim / 2,
          padding: open ? 5 : 4,
          ...(open ? shadows.lg : shadows.md),
        },
      ]}>
        <View style={[
          styles.markerInner,
          { borderRadius: (dim - (open ? 10 : 8)) / 2 },
          open && { backgroundColor: undefined },
          !open && { backgroundColor: '#fff' },
        ]}>
          {open
            ? <MaterialCommunityIcons name="armchair" size={20} color={colors.green700} />
            : <View style={[styles.dot, { backgroundColor: dotColor }]} />
          }
        </View>
        {open && sc !== null && (
          <View style={styles.scorePill}>
            <Feather name="star" size={9} color={colors.star} />
            <Text style={styles.scoreText}>{String(sc).replace('.', ',')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.mapLand,
    overflow: 'hidden',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,25,22,0.22)',
  },
  markerWrapper: {
    position: 'absolute',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  markerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    // Gradient simulé avec une couleur fixe (le vrai gradient conic n'existe pas en RN)
    backgroundColor: colors.green500,
  },
  markerInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scorePill: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    ...shadows.md,
  },
  scoreText: {
    fontWeight: '800',
    fontSize: 12,
    color: colors.neutral900,
  },
});
