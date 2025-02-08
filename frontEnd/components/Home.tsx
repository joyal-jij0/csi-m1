import {
    StyleSheet,
    Pressable,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import api from "@/api/api";
import { Button } from "tamagui";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";

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

const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

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

    const renderEventCard = useCallback( ({ item }: { item: Event }) => (
        <View>
            <Pressable
                style={styles.eventCard}
                onPress={() =>
                    router.push({
                        pathname: "/event/[id]",
                        params: {
                            id: item.id,
                            eventData: JSON.stringify(item),
                            imageUrl: item.image,
                        },
                    })
                }
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    cachePolicy="disk"
                />
                <BlurView intensity={0} tint="dark" style={styles.cardContent}>
                    <LinearGradient
                        colors={[
                            "transparent",
                            "rgba(0,0,0,0.5)",
                            "rgba(0,0,0,0.7)",
                            "rgba(0,0,0,0.7)",
                            "rgba(0,0,0,0.9)",
                        ]}
                        locations={[0, 0.2, 0.5, 0.6, 1]}
                        style={styles.gradient}
                    >
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <View
                            style={[
                                styles.eventInfo,
                                {
                                    justifyContent: item.isRegistrationLive
                                        ? "space-between"
                                        : "flex-start",
                                },
                            ]}
                        >
                            <View style={styles.infoItem}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#fff"
                                />
                                <Text style={styles.eventTime}>
                                    {formatTime(item.time)}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons
                                    name="location-outline"
                                    size={16}
                                    color="#fff"
                                />
                                <Text style={styles.eventVenue}>
                                    {item.venue}
                                </Text>
                            </View>
                            {item.isRegistrationLive && (
                                <Button
                                    size="$3"
                                    theme="blue"
                                    borderWidth="$0.5"
                                    themeInverse
                                    variant="outlined"
                                    backgroundColor="black"
                                    onPress={() =>
                                        Linking.openURL(item.registrationLink)
                                    }
                                >
                                    Register
                                </Button>
                            )}
                        </View>
                        {/* <View style={styles.participants}>
                            <Ionicons
                                name="people-outline"
                                size={16}
                                color="#fff"
                            />
                            <Text style={styles.participantsText}>
                                {item.participants} attending
                            </Text>
                        </View> */}
                    </LinearGradient>
                </BlurView>
            </Pressable>
        </View>
    ), []);

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.leftContainer}>
                        <Image
                            source={require("@/assets/images/csi.png")}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </View>
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
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    greeting: {
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "700",
    },
    sectionTitle: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: "600",
        // borderColor: "#271146",
        // borderWidth: 3
    },
    eventsList: {
        gap: 16,
        paddingBottom: 20,
    },
    eventCard: {
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    cardContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    gradient: {
        padding: 16,
    },
    eventTitle: {
        fontSize: 22,
        color: "#FFFFFF",
        marginBottom: 8,
        fontWeight: "600",
    },
    eventInfo: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    eventTime: {
        fontSize: 14,
        color: "#FFFFFF",
        opacity: 0.9,
    },
    eventVenue: {
        fontSize: 14,
        color: "#FFFFFF",
        opacity: 0.9,
    },
    participants: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    participantsText: {
        fontSize: 12,
        color: "#FFFFFF",
        opacity: 0.7,
    },
    logo: {
        width: 60,
        height: 40,
    },
});

// const DUMMY_EVENTS: Event[] = [
//     {
//         id: "1",
//         title: "Music Competition",
//         type: "Music",
//         time: new Date(),
//         image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
//         venue: "Main Auditorium",
//         // participants: 120,
//         description: "Join us for an evening of musical excellence",
//     },
//     {
//         id: "2",
//         title: "Dance Competition",
//         type: "Dance",
//         time: new Date(Date.now() + 30 * 60000),
//         image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea",
//         venue: "Dance Arena",
//         // participants: 85,
//         description: "Showcase your dance moves",
//     },
//     {
//         id: "3",
//         title: "Smart Hackathon",
//         type: "Hackathon",
//         time: new Date(Date.now() - 30 * 60000),
//         image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
//         venue: "Innovation Hub",
//         // participants: 200,
//         description: "Code your way to victory",
//     },
// ];
