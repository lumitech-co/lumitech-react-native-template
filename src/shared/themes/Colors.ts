export const Colors = {
  black: '#000',

  black_50: 'rgba(0, 0, 0, 0.5)',

  /** BASIC */

  basic_100: '#FFFFFF',
  basic_200: '#F7F9FC',
  basic_300: '#EDF1F7',
  basic_400: '#E4E9F2',
  basic_500: '#C5CEE0',
  basic_600: '#6D7D9D',
  basic_700: '#2E3A59',
  basic_800: '#222B45',
  basic_900: '#192038',
  basic_1000: '#151A30',
  basic_1100: '#101426',

  basic_transparent_8: 'rgba(143, 155, 179, 0.08)',
  basic_transparent_16: 'rgba(143, 155, 179, 0.16)',
  basic_transparent_24: 'rgba(143, 155, 179, 0.24)',
  basic_transparent_32: 'rgba(143, 155, 179, 0.32)',
  basic_transparent_40: 'rgba(143, 155, 179, 0.4)',
  basic_transparent_48: 'rgba(143, 155, 179, 0.48)',

  basic_reversed_8: 'rgba(255, 255, 255, 0.08)',
  basic_reversed_16: 'rgba(255, 255, 255, 0.16)',
  basic_reversed_24: 'rgba(255, 255, 255, 0.24)',
  basic_reversed_32: 'rgba(255, 255, 255, 0.32)',
  basic_reversed_40: 'rgba(255, 255, 255, 0.4)',
  basic_reversed_48: 'rgba(255, 255, 255, 0.48)',

  /** SUCCESS */

  success_100: '#F0FFF5',
  success_200: '#CCFCE3',
  success_300: '#8CFAC7',
  success_400: '#2CE69B',
  success_500: '#00D68F',
  success_600: '#00B887',
  success_700: '#00997A',
  success_800: '#007D6C',
  success_900: '#004A45',

  success_border: 'rgba(61, 219, 147, 1)',

  success_transparent_8: 'rgba(0, 214, 143, 0.08)',
  success_transparent_16: 'rgba(0, 214, 143, 0.16)',
  success_transparent_24: 'rgba(0, 214, 143, 0.24)',
  success_transparent_32: 'rgba(0, 214, 143, 0.32)',
  success_transparent_40: 'rgba(0, 214, 143, 0.4)',
  success_transparent_48: 'rgba(0, 214, 143, 0.48)',
  success_transparent_50: 'rgba(61, 219, 147, 0.05)',
  success_1000: '#3DDB93',
  success_1000_transparent: 'rgba(61, 219, 147, 0.05)',

  /** INFO */

  info_100: '#F2F8FF',
  info_200: '#C7E2FF',
  info_300: '#94CBFF',
  info_400: '#42AAFF',
  info_500: '#0095FF',
  info_600: '#006FD6',
  info_700: '#0057C2',
  info_800: '#0041A8',
  info_900: '#002885',

  info_transparent_8: 'rgba(0, 149, 255, 0.08)',
  info_transparent_16: 'rgba(0, 149, 255, 0.16)',
  info_transparent_24: 'rgba(0, 149, 255, 0.24)',
  info_transparent_32: 'rgba(0, 149, 255, 0.32)',
  info_transparent_40: 'rgba(0, 149, 255, 0.4)',
  info_transparent_48: 'rgba(0, 149, 255, 0.48)',

  /** WARNING */

  warning_100: '#FFFDF2',
  warning_200: '#FFF1C2',
  warning_300: '#FFE59E',
  warning_400: '#FFC94D',
  warning_500: '#FFAA00',
  warning_600: '#DB8B00',
  warning_700: '#B86E00',
  warning_800: '#945400',
  warning_900: '#703C00',

  warning_transparent_8: 'rgba(255, 170, 0, 0.08)',
  warning_transparent_16: 'rgba(255, 170, 0, 0.16)',
  warning_transparent_24: 'rgba(255, 170, 0, 0.24)',
  warning_transparent_32: 'rgba(255, 170, 0, 0.32)',
  warning_transparent_40: 'rgba(255, 170, 0, 0.4)',
  warning_transparent_48: 'rgba(255, 170, 0, 0.48)',

  /** DANGER */

  danger_100: '#FFF2F2',
  danger_200: '#FFD6D9',
  danger_300: '#FFA8B4',
  danger_400: '#FF708D',
  danger_500: '#FF3D71',
  danger_600: '#DB2C66',
  danger_700: '#B81D5B',
  danger_800: '#94124E',
  danger_900: '#700940',

  danger_transparent_8: 'rgba(255, 61, 113, 0.08)',
  danger_transparent_16: 'rgba(255, 61, 113, 0.16)',
  danger_transparent_24: 'rgba(255, 61, 113, 0.24)',
  danger_transparent_32: 'rgba(255, 61, 113, 0.32)',
  danger_transparent_40: 'rgba(255, 61, 113, 0.4)',
  danger_transparent_48: 'rgba(255, 61, 113, 0.48)',

  transparent: 'transparent',
};

export type ColorsType = keyof typeof Colors;
