import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/api/api";
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import Toast from "react-native-toast-message";
import { MMKV } from "react-native-mmkv";
import { LinearGradient } from 'expo-linear-gradient';

const GoogleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
            fill="#FFC107"
        />
        <Path
            d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
            fill="#FF3D00"
        />
        <Path
            d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5717 17.5742 13.3037 18.0011 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
            fill="#4CAF50"
        />
        <Path
            d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.404C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
            fill="#1976D2"
        />
    </Svg>
);

const storage = new MMKV();

export default function Signin() {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [intializing, setInitializing] = useState(true);

    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    })

    
    function onAuthStateChanged(user: any){
        if(intializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])

    

    const handleSignIn = async () => {
        setIsLoading(true);
        setError("");
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
    
            const signInResult = await GoogleSignin.signIn();
    
            let idToken = signInResult.data?.idToken;
    
            if (!idToken) {
                throw new Error("No ID token found");
            }
    
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
            await auth().signInWithCredential(googleCredential);
    
            if (signInResult.type === "success") {
                const response = await api.post("/user/signIn", {
                    email: signInResult.data?.user?.email,
                });
    
                const { data } = response;    
                const { accessToken, refreshToken, id, profileExists } = data.data;
                storage.set("profileExists", profileExists)    
                dispatch(login(accessToken, refreshToken, id));    
                router.replace("/onBoardingForm");
            }
        } catch (error: any) {
            let errorMessage = "An error occurred during sign-in.";
            if (error.response) {
                errorMessage = `Server error: ${
                    error.response.data.message || error.response.statusText
                }`;
            } else if (error.request) {
                errorMessage =
                    "No response from server. Please check your internet connection.";
            } else {
                errorMessage = error.message || "An error occurred during sign-in.";
            }
    
            // Show error message as toast
            Toast.show({
                type: "error",
                text1: "Sign-In Error",
                position: "bottom",
                autoHide: true,
                visibilityTime: 5000,
                text2: errorMessage,
            });
    
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if(intializing) return null;

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView>
                <View style={styles.imageContainer}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.imageInner}>
                            <Image
                                source={require("../../assets/images/csi_image.jpeg")}
                                style={styles.image}
                                contentFit="cover"
                                contentPosition={"top"}
                                transition={1000}
                            />
                        </View>
                        <LinearGradient
                            style={styles.gradientOverlay}
                            colors={["#00000000", "#120821"]}
                            start={[0, 0]}
                            end={[0, 1]}
                        />
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <View>
                        <Text style={styles.title}>
                            Welcome to Zypher
                        </Text>
                        <Text style={styles.subtitle}>
                            Nurture your mind, Unite your coding
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.googleButton,
                                { opacity: isLoading ? 0.8 : 1 }
                            ]}
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            <Text style={styles.buttonText}>
                                {isLoading
                                    ? "Signing in..."
                                    : "Continue with Google"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: "60%",
    },
    imageWrapper: {
        position: "relative",
    },
    imageInner: {
        width: "100%",
        height: "100%",
    },
    image: {
        height: "100%",
        width: "100%",
    },
    gradientOverlay: {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
    },
    contentContainer: {
        paddingHorizontal: 12,
        gap: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
    },
    subtitle: {
        color: "#fff",
    },
    buttonContainer: {
        gap: 12,
    },
    googleButton: {
        backgroundColor: "#ffffff",
        borderColor: "#ffffff33",
        borderWidth: 1,
        height: 48,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "500",
    },
});