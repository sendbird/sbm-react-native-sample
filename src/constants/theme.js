const COLORS = {
  purple: '#6210CC',

  gray: '#EEEEEE',
  gray2: '#83829A',
  gray3: '#C1C0C8',

  white: '#FFFFFF',
  lightWhite: '#FAFAFC',
  dark: {
    background: '#161616',
    text: '#FFFFFF',
    button: '',
    border: '#FFFFFF',
  },
  light: {
    background: '#FFFFFF',
    text: '#000000',
    button: '',
    border: '#000000',
  },
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export {COLORS, SHADOWS, SIZES};
