import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

export * from './push';

export function formatDate(createdAt) {
  if (!createdAt) {
    return '';
  } else if (isToday(createdAt)) {
    return format(createdAt, 'p');
  } else if (isYesterday(createdAt)) {
    return 'Yesterday';
  } else {
    return format(createdAt, 'MMM d');
  }
}

function convertThemeColorStringToObject(string) {
  const array = string.split(',');
  return {
    light: convertArgbToRgba(array[0]),
    dark: convertArgbToRgba(array[1] || array[0]),
  };
}

// Sendbird sends colors in ARGB format, but React Native requires RGBA
function convertArgbToRgba(string) {
  try {
    if (string.length === 9) {
      return '#' + string.slice(3, 9) + string[1] + string[2];
    } else {
      return string;
    }
  } catch (error) {
    return string;
  }
}

export function parseThemeColor(string, selectedTheme) {
  const colorByTheme = convertThemeColorStringToObject(string);
  return colorByTheme[selectedTheme];
}
