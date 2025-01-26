import Home from "@/components/Home"; 
import * as Notifications from "expo-notifications" 
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import api from "@/api/api";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, 
        shouldPlaySound: true,
        shouldSetBadge: false, 
        shouldVibrate: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
    })
})

export default function Index(){
    const [currentUserID, setCurrentUserId] = useState<string | null>(null);

    const dispatch = useDispatch();


    useEffect(() => {

        const setupMessaging = async () => {
            const userId = await SecureStore.getItemAsync("userId");
            setCurrentUserId(userId);

            const permissionGranted = await requestUserPermission();
            if(permissionGranted){
                const token = await messaging().getToken();
                api.post("/user/update-push-token",{
                    userId: userId,
                    pushToken: token,
                })

                const initialNotification = await messaging().getInitialNotification();
                if(initialNotification){
                    handleNotificationNavigation(initialNotification)
                }

                messaging().onNotificationOpenedApp((remoteMessage) => {
                    handleNotificationNavigation(remoteMessage);
                })

                messaging().setBackgroundMessageHandler(
                    async (remoteMessage) => {
                        async(remoteMessage: any) => {
                            console.log(
                                "Message handled in the background!",
                                remoteMessage
                            )
                        }
                    }
                )

                const unsubscribe = messaging().onMessage(
                    async(remoteMessage) => {
                        showInAppNotification(remoteMessage)
                    }
                )
            } else {
                console.log("Permission not granted")
            }
        }

        setupMessaging();
    }, [dispatch])

    const requestUserPermission = async () => {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            Alert.alert(
                "Permission required",
                "Push notifications are important for this app. Please enable them in your system settings.",
                [{ text: "OK" }]
            );
            return false;
        }
        return true;
    };

    const handleNotificationNavigation = (remoteMessage: any) => {
        router.push(`/(tabs)`);
    };

    const showInAppNotification = (remoteMessage: any) => {
        let title = remoteMessage.notification?.title || "New Notfication";
        let description = remoteMessage.notification?.body || ""

        Toast.show({
            type: "info",
            text1: title,
            text2: description,
            position: 'top',
            autoHide: false,
        })
    }

    return <Home/>
}