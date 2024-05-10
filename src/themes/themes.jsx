import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';


export function getMD3Theme(isCombined=false) {
  const colorScheme = useColorScheme();
    
  const MD3Theme = useMemo(() => {
    return (colorScheme === "dark") ? MD3DarkTheme : MD3LightTheme;
  }, [colorScheme]);

  if (!isCombined) return MD3Theme;

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = (colorScheme === "dark") ? CombinedDarkTheme : CombinedDefaultTheme;

  return combinedTheme
}
