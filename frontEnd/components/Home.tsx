import {
    StyleSheet,
    FlatList,
    View,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import api from "@/api/api";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import EventCard from "./EventCard";

export interface Event {
    id: string;
    title: string;
    type: string;
    time: Date;
    image: string;
    venue: string;
    description: string;
    registrationLink: string;
    ruleBookLink: string;
    isRegistrationLive: boolean;
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/retrieveAll/");
            const backendEvents = response.data.data.map((event: any) => ({
                id: event.id,
                title: event.title,
                type: event.type,
                time: new Date(event.startsAt), // Parse `startsAt` into a Date object
                image: event.image,
                venue: event.venue,
                description: event.description,
                registrationLink: event.registrationLink,
                ruleBookLink: event.ruleBookLink,
                isRegistrationLive: event.isRegistrationLive,
            }));
            setEvents(backendEvents);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to fetch Events",
                text2: `Error: ${error}`,
                position: "bottom",
                autoHide: true,
                visibilityTime: 3000,
            });
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const renderEventCard = useCallback(({ item }: { item: Event }) => {
        return <EventCard item={item} />;
    }, []);

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {/* <View style={styles.leftContainer}>
                        <Image
                            source={require("@/assets/images/csi.png")}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </View> */}
                    <TouchableOpacity onPress={() => router.push("/profile")}>
                        <MaterialCommunityIcons
                            name="account-circle-outline"
                            size={40}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={events}
                    renderItem={renderEventCard}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.eventsList}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    eventsList: {
        gap: 16,
        paddingBottom: 20,
    },
    logo: {
        width: 60,
        height: 40,
    }
});