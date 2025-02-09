import { useState, memo } from "react";
import {
    StyleSheet,
    Pressable,
    View,
    Text,
    ActivityIndicator,
    Linking,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "tamagui";
import { Image } from "expo-image";
import { router } from "expo-router";

const urlRegex = /^https:\/\//;

const handleOpenUrl = (url: string, urlType: string) => {
    if (urlRegex.test(url)) {
        Linking.openURL(url);
    } else {
        Alert.alert("Invalid URL", `${urlType} must start with "https://".`);
    }
};

const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

interface EventItem {
    id: string;
    title: string;
    image: string;
    time: Date;
    venue: string;
    isRegistrationLive?: boolean;
    registrationLink?: string;
}

function EventCard({ item }: { item: EventItem }) {
    const [imageLoading, setImageLoading] = useState(true);

    return (
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
                {/* Image Container with Spinner Overlay */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.cardImage}
                        cachePolicy="disk"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                        <ActivityIndicator
                            size="large"
                            style={styles.spinner}
                        />
                    )}
                </View>

                {/* Content overlay (with Blur & Gradient) */}
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

                            {item.isRegistrationLive &&
                                item.registrationLink && (
                                    <Button
                                        size="$3"
                                        theme="blue"
                                        borderWidth="$0.5"
                                        themeInverse
                                        variant="outlined"
                                        backgroundColor="black"
                                        onPress={() =>
                                            handleOpenUrl(
                                                item.registrationLink!,
                                                "Registration URL"
                                            )
                                        }
                                    >
                                        Register
                                    </Button>
                                )}
                        </View>
                    </LinearGradient>
                </BlurView>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    eventCard: {
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    spinner: {
        position: "absolute",
        top: "50%",
        left: "50%",
        // Adjust the translation so the spinner is centered
        transform: [{ translateX: -12 }, { translateY: -12 }],
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
});

export default memo(EventCard);
