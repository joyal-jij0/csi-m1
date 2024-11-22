import { Input, Label, Text, View, YStack, Button } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Image } from "expo-image";

export default function OnBoarding() {
  return (
    <View>
      <View aspectRatio={1 / 1}>
        <View position="relative">
          <View width="100%" height="100%">
            <Image
              source={require("../../assets/images/csi_image2.jpeg")}
              style={{ height: "100%", width: "100%" }}
              contentFit="cover"
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
          <Text color="#fff">Nurture your mind, Unite your coding</Text>
        </View>

        <YStack gap={12}>
          <View gap={4}>
            <Label color="#fff" htmlFor="email" unstyled>
              Email Address
            </Label>
            <Input
              backgroundColor="#000"
              borderColor="#ffffff33"
              id="email"
              placeholder="john.smith@gmail.com"
            />
          </View>

          <View gap={4}>
            <Label color="#fff" htmlFor="password" unstyled>
              Password
            </Label>
            <Input
              backgroundColor="#000"
              borderColor="#ffffff33"
              id="password"
              placeholder="Enter your password"
            />
            <View display="flex">
              <Text alignSelf="flex-end" color="#3b82f6" marginRight={1}>
                Reset Password
              </Text>
            </View>
          </View>

          <Button marginTop={64}>Login</Button>
          <View
            width="100%"
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <Text color="#ffffff66" marginRight={4}>
              New to CSI App?
            </Text>
            <Text color="#3b82f6">Sign Up</Text>
          </View>
        </YStack>
      </View>
    </View>
  );
}
