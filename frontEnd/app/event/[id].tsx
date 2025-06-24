import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Linking,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function EventDetailsScreen() {
    const [imageLoading, setImageLoading] = useState(true);
    const { eventData } = useLocalSearchParams();

    const urlRegex = /^https:\/\//;

    if (!eventData) {
        return (
                <Text style={styles.errorText}>Event data not found.</Text>
        );
    }

    const handleOpenUrl = (url: string, urlType: string) => {
        if (urlRegex.test(url)) {
            Linking.openURL(url);
        } else {
            Alert.alert(
                "Invalid URL",
                `${urlType} must start with "https://".`
            );
        }
    };

    const event = JSON.parse(eventData as string);

    return (
            <ScrollView>
                <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                    cachePolicy="disk"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                    <ActivityIndicator size="large" style={styles.spinner} />
                )}
                <BlurView intensity={80} tint="dark" style={styles.content}>
                    <Text style={styles.title}>{event.title}</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#fff" />
                        <Text style={styles.infoText}>
                            {new Date(event.time).toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="location-outline"
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.infoText}>{event.venue}</Text>
                    </View>

                    <Text style={styles.description}>{event.description}</Text>

                    <View style={styles.buttonContainer}>
                        {event.ruleBookLink && (
                            <TouchableOpacity
                                style={styles.rulesButton}
                                onPress={() =>
                                    handleOpenUrl(
                                        event.ruleBookLink,
                                        "Rule book link"
                                    )
                                }
                            >
                                <Text style={styles.rulesButtonText}>
                                    Rules
                                </Text>
                            </TouchableOpacity>
                        )}

                        {event.isRegistrationLive && event.registrationLink && (
                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() =>
                                    handleOpenUrl(
                                        event.registrationLink,
                                        "Registration link"
                                    )
                                }
                            >
                                <Text style={styles.registerButtonText}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </BlurView>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: width,
        height: 300,
    },
    content: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10,
    },
    infoText: {
        color: "#fff",
        fontSize: 16,
        opacity: 0.9,
    },
    description: {
        color: "#fff",
        fontSize: 16,
        opacity: 0.8,
        lineHeight: 24,
        marginTop: 20,
        marginBottom: 20,
    },
    errorText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
    rulesButton: {
        flex: 1,
        backgroundColor: "#171717",
        borderColor: "#262626",
        borderWidth: 0.5,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    rulesButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    registerButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderColor: "#262626",
        borderWidth: 0.5,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    registerButtonText: {
        color: "#171717",
        fontSize: 16,
        fontWeight: "500",
    },
    spinner: {
        position: "absolute",
        top: "25%",
        left: "50%",
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
});
