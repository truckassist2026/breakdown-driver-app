import colors from './colors';
import spacing from './spacing';
import typography from './typography';

const theme = {
  colors,
  spacing,
  typography,

  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusLarge,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: spacing.radiusMedium,
  },

  button: {
    height: spacing.buttonHeight,
    borderRadius: spacing.radiusMedium,
  },
};

export default theme;