import {
    StyleSheet,
    Pressable,
    FlatList,
    Image,
    View,
    Text,
    TouchableOpacity,
    Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "tamagui";

export interface Event {
    id: string;
    title: string;
    type: string;
    time: Date;
    image: string;
    venue: string;
    description: string;
    registrationLink: string;
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
    const [error, setError] = useState("");
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
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
                    isRegistrationLive: event.isRegistrationLive,
                }));
                setEvents(backendEvents);
            } catch (error) {
                setError("Failed to fetch profile data");
            }
        };

        fetchEvents();
    }, []);

    const renderEventCard = ({ item }: { item: Event }) => (
        <View
        >
            <Pressable
                style={styles.eventCard}
                onPress={() =>
                    router.push({
                        pathname: "/event/[id]",
                        params: {
                            id: item.id,
                            eventData: JSON.stringify(item),
                        },
                    })
                }
            >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <BlurView intensity={80} tint="dark" style={styles.cardContent}>
                    <LinearGradient
                        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
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
    );

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
                            resizeMode="contain"
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
