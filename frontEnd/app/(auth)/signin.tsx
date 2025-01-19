// import { Input, Text, View, YStack, Button, Spinner } from "tamagui";
// import { LinearGradient } from "tamagui/linear-gradient";
// import { Image } from "expo-image";
// import React, { useState } from "react";
// import { Dimensions } from "react-native";
// import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
// import OTPTextInput from "react-native-otp-textinput";
// const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// export default function Signin() {
//   const [phoneInput, setPhoneInput] = useState<string>("");
//   const animatedWidth = useSharedValue(screenWidth);
//   const [isLoading, setIsLoading] = useState(false);

//   const [isImageSquare, setIsImageSquare] = useState(true);

//   const handleContinue = () => {
//     setIsLoading(true); 
//     if (isImageSquare) {
//       animatedWidth.value = withSpring(screenWidth / 2);
//     } else {
//       animatedWidth.value = withSpring(screenWidth);
//     }
//     setIsImageSquare(!isImageSquare);
//   };

//   return (
//     <View>
//       {/* <View height={screenWidth / 1} width={screenWidth}> */}
//       <Animated.View
//         style={{
//           width: "100%",
//           height: animatedWidth,
//         }}
//       >
//         <View position="relative">
//           <View width="100%" height="100%">
//             <Image
//               source={require("../../assets/images/csi_image2.jpeg")}
//               style={{ height: "100%", width: "100%" }}
//               contentFit="cover"
//               contentPosition={"top"}
//               transition={1000}
//             />
//           </View>
//           <LinearGradient
//             position="absolute"
//             left={0}
//             bottom={0}
//             height="100%"
//             width="100%"
//             colors={["#00000000", "#000000"]}
//             start={[0, 0]}
//             end={[0, 1]}
//           />
//         </View>
//       </Animated.View>

//       <View paddingHorizontal={12} gap={24}>
//         {!isLoading && (
//           <View>
//             <Text fontSize={24} fontWeight={700} color="#fff">
//               Welcome to CSI Innowave
//             </Text>
//             <Text color="#fff">Nurture your mind, Unite your coding</Text>
//           </View>
//         )}

//         <YStack gap={12}>
//           {!isLoading ? (
//             <View gap={4}>
//               <Input
//                 value={phoneInput}
//                 onChangeText={(text) => setPhoneInput(text)}
//                 backgroundColor="#000"
//                 borderColor="#ffffff33"
//                 focusStyle={{ borderColor: "#ffffff80" }}
//                 maxLength={10}
//                 color="#fff"
//                 id="phone"
//                 keyboardType="phone-pad"
//                 placeholder="+91 7042XXXX78"
//               />
//             </View>
//           ) : (
//             <View
//               display="flex"
//               gap={8}
//               justifyContent="center"
//               // marginHorizontal={64}
//             >
//               <View paddingVertical={12} width="100%">
//                 <Text fontSize={16} textAlign="center" color="#fff">
//                   We've sent a verification code to
//                 </Text>
//                 <Text
//                   fontSize={14}
//                   textAlign="center"
//                   color="#fff"
//                   fontWeight={600}
//                 >
//                   +91 {phoneInput}
//                 </Text>
//               </View>
//               <OTPTextInput
//                 textInputStyle={{
//                   backgroundColor: "#000",
//                   borderWidth: 0.5,
//                   borderBottomWidth: 0.5,
//                   borderBottomColor: "#ffffff33",
//                   borderRadius: 8,
//                   margin: 0,
//                   // marginBottom: 8,
//                   // width: "15%",
//                 }}
//                 tintColor={"#ffffff80"}
//                 containerStyle={{
//                   borderColor: "#ffffff33",
//                   marginHorizontal: 64,
//                 }}
//               />
//             </View>
//           )}

//           {!isLoading && (
//             <Button
//               opacity={!isLoading ? (phoneInput.length > 9 ? 1 : 0.6) : 0.6}
//               disabled={isLoading || !(phoneInput.length > 9)}
//               onTouchStart={handleContinue}
//             >
//               {isLoading && <Spinner size="small" color="#000" />}
//               Continue
//             </Button>
//           )}
//           <View
//             width="100%"
//             display="flex"
//             justifyContent="center"
//             flexDirection="row"
//           >
//             {!isLoading ? (
//               <React.Fragment>
//                 <Text color="#ffffff66" marginRight={4}>
//                   New to CSI App?
//                 </Text>
//                 <Text color="#3b82f6">Sign Up</Text>
//               </React.Fragment>
//             ) : (
//               <React.Fragment>
//                 <Text color="#ffffff66" marginRight={4}>
//                   Resend OTP in
//                 </Text>
//                 <Text color="#3b82f6a1">14s</Text>
//               </React.Fragment>
//             )}
//           </View>
//         </YStack>
//       </View>
//     </View>
//   );
// }


// const AppleIcon = () => (
//     <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//         <Path
//             d="M17.05 20.28a11.1 11.1 0 0 1-1.14.61 10.19 10.19 0 0 1-1.48.57 10.16 10.16 0 0 1-1.69.37 10.87 10.87 0 0 1-1.76.14 10.87 10.87 0 0 1-1.76-.14 10.16 10.16 0 0 1-1.69-.37 10.19 10.19 0 0 1-1.48-.57 11.1 11.1 0 0 1-1.14-.61 12.11 12.11 0 0 1-2.55-2.37A11.61 11.61 0 0 1 1 13.66a11.89 11.89 0 0 1-.85-2.39A11.85 11.85 0 0 1 0 8.68a11.85 11.85 0 0 1 .15-2.59A11.89 11.89 0 0 1 1 3.7a11.61 11.61 0 0 1 1.38-2.25A12.11 12.11 0 0 1 4.93.08a11.1 11.1 0 0 1 1.14-.61 10.19 10.19 0 0 1 1.48-.57A10.16 10.16 0 0 1 9.24 0a10.87 10.87 0 0 1 1.76-.14 10.87 10.87 0 0 1 1.76.14 10.16 10.16 0 0 1 1.69.37 10.19 10.19 0 0 1 1.48.57 11.1 11.1 0 0 1 1.14.61 12.11 12.11 0 0 1 2.55 2.37A11.61 11.61 0 0 1 21 6.17a11.89 11.89 0 0 1 .85 2.39 11.85 11.85 0 0 1 .15 2.59 11.85 11.85 0 0 1-.15 2.59 11.89 11.89 0 0 1-.85 2.39 11.61 11.61 0 0 1-1.38 2.25 12.11 12.11 0 0 1-2.55 2.37z"
//             fill="#000000"
//         />
//         <Path
//             d="M12 3.5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4m0-1c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"
//             fill="#ffffff"
//         />
//     </Svg>
// );

import { Text, View, YStack, Button } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Svg, Path } from "react-native-svg";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/api/api";
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

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

            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            const signInResult = await GoogleSignin.signIn();
    
            let idToken = signInResult.data?.idToken 
    
            if(!idToken){
                throw new Error('No ID token found') 
            }
    
            const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data?.idToken!)
    
            auth().signInWithCredential(googleCredential) 

            if(signInResult.type === "success"){
                const response = await api.post("/user/signIn", {
                    email: signInResult.data?.user?.email
                })
                
                const { data } = response
    
                const {accessToken, refreshToken, id } = data.data;
    
                dispatch(login(accessToken, refreshToken, id))
    
                //TODO: Yha Onboarding Form krna replace
                router.replace("/onBoardingForm");
                
            }
            
        } catch (error: any) {
            if (error.response) {
                setError(
                    `Server error: ${
                        error.response.data.message || error.response.statusText
                    }`
                );
            } else if (error.request) {
                setError(
                    "No response from server. Please check your internet connection."
                );
            } else {
                setError(error.message || "An error occurred during sign in");
            }
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
                <View
                    style={{
                        width: "100%",
                        height: "60%",
                    }}
                >
                    <View position="relative">
                        <View width="100%" height="100%">
                            <Image
                                source={require("../../assets/images/csi_image2.jpeg")}
                                style={{ height: "100%", width: "100%" }}
                                contentFit="cover"
                                contentPosition={"top"}
                                transition={1000}
                            />
                        </View>
                        <LinearGradient
                            position="absolute"
                            left={0}
                            bottom={0}
                            height="100%"
                            width="100%"
                            colors={["#00000000", "#000000"]}
                            start={[0, 0]}
                            end={[0, 1]}
                        />
                    </View>
                </View>

                <View paddingHorizontal={12} gap={24}>
                    <View>
                        <Text fontSize={24} fontWeight={700} color="#fff">
                            Welcome to CSI Innowave
                        </Text>
                        <Text color="#fff">
                            Nurture your mind, Unite your coding
                        </Text>
                    </View>

                    <YStack gap={12}>
                        <Button
                            icon={GoogleIcon}
                            theme="dark"
                            backgroundColor="#ffffff"
                            color="#000000"
                            borderColor="#ffffff33"
                            onPress={handleSignIn}
                            disabled={isLoading}
                            opacity={isLoading ? 0.6 : 1}
                            height={45}
                        >
                            {isLoading
                                ? "Signing in..."
                                : "Continue with Google"}
                        </Button>
                    </YStack>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}