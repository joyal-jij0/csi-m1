// Required for tailwind CSS
import "../global.css";
// Requirement ends

import {
  DarkTheme,
  DefaultTheme,
  NavigationIndependentTree,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createTamagui, TamaguiProvider, View } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import TabLayout from "./(tabs)/_layout";
import OnBoarding from "./screens/OnBoarding";
const config = createTamagui(defaultConfig);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationIndependentTree>
      <TamaguiProvider config={config}>
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName="OnBoarding">
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
              component={TabLayout}
            />
            <Stack.Screen
              name="OnBoarding"
              options={{ headerShown: false }}
              component={OnBoarding}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </TamaguiProvider>
    </NavigationIndependentTree>
  );
}
