// SitSpot — Design tokens (traduits depuis le design system CSS)

export const colors = {
  // Vert (couleur principale)
  green50:  '#E8F8F0',
  green100: '#C9F0DD',
  green200: '#95E3BE',
  green300: '#57D199',
  green400: '#25BC79',
  green500: '#11A269',
  green600: '#0C8557',
  green700: '#0A6A47',
  green800: '#0A5239',
  green900: '#093E2D',

  // Bleu (couleur secondaire)
  blue50:  '#E9F3FD',
  blue100: '#CCE3FB',
  blue200: '#9CC8F6',
  blue300: '#66A9EF',
  blue400: '#3B8DE6',
  blue500: '#2477D6',
  blue600: '#1A60B4',
  blue700: '#174E90',
  blue800: '#173F71',
  blue900: '#142F54',

  // Neutres (gris chauds)
  neutral0:   '#FFFFFF',
  neutral50:  '#F8F7F4',
  neutral100: '#F0EEE9',
  neutral200: '#E4E1DA',
  neutral300: '#D2CEC4',
  neutral400: '#ABA79C',
  neutral500: '#837F75',
  neutral600: '#5F5C54',
  neutral700: '#45433D',
  neutral800: '#2C2A26',
  neutral900: '#1A1916',

  // Carte (style Tesla / cartographie claire)
  mapLand:       '#F4F2EC',
  mapLand2:      '#EFECE4',
  mapRoad:       '#FFFFFF',
  mapRoadMajor:  '#FBF4DF',
  mapRoadStroke: '#E7E2D6',
  mapWater:      '#CADFEC',
  mapPark:       '#DCEBCF',
  mapParkDeep:   '#CBE2BB',
  mapBuilding:   '#EBE7DD',

  // Couleurs sémantiques
  star:     '#F5A623',
  success:  '#11A269',
  warning:  '#F5A623',
  danger:   '#E5484D',
  dangerBg: '#FCEBEC',
};

// Alias sémantiques (utilisés dans les composants)
export const c = {
  // Surfaces
  surfaceApp:        colors.neutral50,
  surfaceCard:       colors.neutral0,
  surfaceElevated:   colors.neutral0,
  surfaceSunken:     colors.neutral100,
  surfaceInverse:    colors.neutral900,
  surfaceAccent:     colors.green500,
  surfaceAccentSoft: colors.green50,

  // Texte
  textPrimary:   colors.neutral900,
  textSecondary: colors.neutral600,
  textMuted:     colors.neutral500,
  textFaint:     colors.neutral400,
  textInverse:   colors.neutral0,
  textAccent:    colors.green700,
  textLink:      colors.blue600,

  // Bordures
  borderSubtle:  colors.neutral200,
  borderDefault: colors.neutral300,
  borderStrong:  colors.neutral400,
  borderAccent:  colors.green500,

  // Accent
  accent:         colors.green500,
  accentHover:    colors.green600,
  accentContrast: colors.neutral0,
  accent2:        colors.blue500,
};

export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  displayBold: 'BricolageGrotesque_700Bold',
  sans: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemibold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',
  sansExtraBold: 'PlusJakartaSans_800ExtraBold',
  mono: 'DMMono_400Regular',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
};
