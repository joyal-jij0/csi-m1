import { Input, Text, View, YStack, Button, Spinner } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import OTPTextInput from "react-native-otp-textinput";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function OnBoarding() {
  const [phoneInput, setPhoneInput] = useState<string>("");
  const animatedWidth = useSharedValue(screenWidth);
  const [isLoading, setIsLoading] = useState(false);

  const [isImageSquare, setIsImageSquare] = useState(true);

  const handleContinue = () => {
    setIsLoading(true); // TODO: handle this loading and show the OTP Input
    if (isImageSquare) {
      animatedWidth.value = withSpring(screenWidth / 2);
    } else {
      animatedWidth.value = withSpring(screenWidth);
    }
    setIsImageSquare(!isImageSquare);
  };

  return (
    <View>
      {/* <View height={screenWidth / 1} width={screenWidth}> */}
      <Animated.View
        style={{
          width: "100%",
          height: animatedWidth,
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
      </Animated.View>

      <View paddingHorizontal={12} gap={24}>
        {!isLoading && (
          <View>
            <Text fontSize={24} fontWeight={700} color="#fff">
              Welcome to CSI Innowave
            </Text>
            <Text color="#fff">Nurture your mind, Unite your coding</Text>
          </View>
        )}

        <YStack gap={12}>
          {!isLoading ? (
            <View gap={4}>
              <Input
                value={phoneInput}
                onChangeText={(text) => setPhoneInput(text)}
                backgroundColor="#000"
                borderColor="#ffffff33"
                focusStyle={{ borderColor: "#ffffff80" }}
                maxLength={10}
                color="#fff"
                id="phone"
                keyboardType="phone-pad"
                placeholder="+91 7042XXXX78"
              />
            </View>
          ) : (
            <View
              display="flex"
              gap={8}
              justifyContent="center"
              // marginHorizontal={64}
            >
              <View paddingVertical={12} width="100%">
                <Text fontSize={16} textAlign="center" color="#fff">
                  We've sent a verification code to
                </Text>
                <Text
                  fontSize={14}
                  textAlign="center"
                  color="#fff"
                  fontWeight={600}
                >
                  +91 {phoneInput}
                </Text>
              </View>
              <OTPTextInput
                textInputStyle={{
                  backgroundColor: "#000",
                  borderWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#ffffff33",
                  borderRadius: 8,
                  margin: 0,
                  // marginBottom: 8,
                  // width: "15%",
                }}
                tintColor={"#ffffff80"}
                containerStyle={{
                  borderColor: "#ffffff33",
                  marginHorizontal: 64,
                }}
              />
            </View>
          )}

          {!isLoading && (
            <Button
              opacity={!isLoading ? (phoneInput.length > 9 ? 1 : 0.6) : 0.6}
              disabled={isLoading || !(phoneInput.length > 9)}
              onTouchStart={handleContinue}
            >
              {isLoading && <Spinner size="small" color="#000" />}
              Continue
            </Button>
          )}
          <View
            width="100%"
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            {!isLoading ? (
              <React.Fragment>
                <Text color="#ffffff66" marginRight={4}>
                  New to CSI App?
                </Text>
                <Text color="#3b82f6">Sign Up</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text color="#ffffff66" marginRight={4}>
                  Resend OTP in
                </Text>
                <Text color="#3b82f6a1">14s</Text>
              </React.Fragment>
            )}
          </View>
        </YStack>
      </View>
    </View>
  );
}
