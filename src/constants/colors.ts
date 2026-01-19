export const Colors = {
    // Primary Colors
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1', // Main primary
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
    },

    // Secondary Colors
    secondary: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#14B8A6',
        600: '#0D9488',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
    },

    // Accent Colors
    accent: {
        purple: '#8B5CF6',
        pink: '#EC4899',
        orange: '#F97316',
        yellow: '#EAB308',
        cyan: '#06B6D4',
    },

    // Status Colors
    success: {
        light: '#DCFCE7',
        main: '#22C55E',
        dark: '#166534',
    },
    warning: {
        light: '#FEF3C7',
        main: '#F59E0B',
        dark: '#92400E',
    },
    error: {
        light: '#FEE2E2',
        main: '#EF4444',
        dark: '#991B1B',
    },
    info: {
        light: '#DBEAFE',
        main: '#3B82F6',
        dark: '#1E40AF',
    },

    // Neutral Colors
    neutral: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },

    // Background Colors
    background: {
        primary: '#0F172A',    // Dark blue-gray
        secondary: '#1E293B',  // Slightly lighter
        tertiary: '#334155',   // Card backgrounds
        surface: '#1E293B',
        card: 'rgba(30, 41, 59, 0.8)',
    },

    // Text Colors
    text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
        muted: '#64748B',
        inverse: '#0F172A',
    },

    // Gradient Presets
    gradients: {
        primary: ['#6366F1', '#8B5CF6'] as const,
        secondary: ['#14B8A6', '#06B6D4'] as const,
        sunset: ['#F97316', '#EC4899'] as const,
        aurora: ['#6366F1', '#EC4899', '#F97316'] as const,
        ocean: ['#0EA5E9', '#14B8A6'] as const,
        midnight: ['#1E293B', '#0F172A'] as const,
    },

    // Common
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Glass effects
    glass: {
        background: 'rgba(30, 41, 59, 0.7)',
        border: 'rgba(148, 163, 184, 0.2)',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },
};

export default Colors;
