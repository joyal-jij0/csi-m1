import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, YStack } from 'tamagui';
import { router } from 'expo-router';


export default function Test(){
    return (
        <SafeAreaView className="flex-1 bg-black justify-center">
            <YStack padding="$3" gap="$3" alignItems="center">
                <Button onPress={() => router.push('/(auth)/signin') } className="bg-white">OTP</Button>
                <Button onPress={() => router.push('/OnBoardingForm')} className="bg-white">Onboarding Form</Button>
            </YStack>
        </SafeAreaView>
    );
};

