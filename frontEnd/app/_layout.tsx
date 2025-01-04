// Required for tailwind CSS
import "../global.css";
// Requirement ends

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotifierWrapper } from "react-native-notifier";

import { useColorScheme } from "@/hooks/useColorScheme";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { RootState } from "@/redux/store";

// Tamagui Dependencies
import { createTamagui, TamaguiProvider, View } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAccessToken } from "@/api/api";
import { setAuthenticated } from "@/redux/features/authSlice";
const config = createTamagui(defaultConfig);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const protectedRoutes = ["(tabs)", "onBoardingForm", "profile", "event"];

function RootLayoutNav() {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );
    const segements = useSegments();
    const router = useRouter();
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const intializeAuth = async () => {
            try {
                const token = await getAccessToken();
                if (token) {
                    dispatch(setAuthenticated(true));
                }
            } catch (error) {
                console.error("Error initializing auth", error);
            } finally {
                setIsInitialized(true);
            }
        };

        intializeAuth();
    }, [dispatch]);

    // YE JISNE UNCOMMENT KIYA USKI MKC

    useEffect(() => {
        if (!isInitialized) {
            router.replace("/signin");
        }

        const inAuthGroup = segements[0] === "(auth)";
        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/signin");
        } else if (isAuthenticated && inAuthGroup) {
            //TODO: Yha OnboardingForm replace krna
            router.replace("/(tabs)");
        }
    }, [isAuthenticated, segements]);

    const isProtectedRoute = (): boolean => {
        return protectedRoutes.some((route) =>
            segements.some((segment) => segment === route)
        );
    };

    if (!isInitialized) {
        null;
    }

    const content = (
        <SafeAreaProvider>
            <TamaguiProvider config={config}>
                <ThemeProvider value={DarkTheme}>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)/signin"
                            options={{ headerShown: false }}
                        />
                        {/* <Stack.Screen
                            name="onBoardingForm"
                            options={{ headerShown: false }}
                        /> */}
                        <Stack.Screen
                            name="event/[id]"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="profile"
                            options={{ headerTitle: "Profile" }}
                        />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </TamaguiProvider>
        </SafeAreaProvider>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {isProtectedRoute() ? (
                <NotifierWrapper>{content}</NotifierWrapper>
            ) : (
                content
            )}
        </GestureHandlerRootView>
    );
}

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

    return (
        <Provider store={store}>
            <RootLayoutNav />
        </Provider>
    );
}
