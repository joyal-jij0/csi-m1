import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Linking,
} from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { Button } from "tamagui";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function EventDetailsScreen() {
    const { id, eventData, imageUrl } = useLocalSearchParams();

    if (!eventData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Event data not found.</Text>
            </SafeAreaView>
        );
    }

    const event = JSON.parse(eventData as string);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                    cachePolicy="disk"
                />
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
                            <Button
                                size="$3"
                                borderColor="#262626"
                                borderWidth="$0.5"
                                themeInverse
                                variant="outlined"
                                backgroundColor="#171717"
                                onPress={() =>
                                    Linking.openURL(event.ruleBookLink)
                                }
                                style={{ flex: 1, marginRight: 8 }}
                            >
                                Rules
                            </Button>
                        )}

                        {event.isRegistrationLive && event.registrationLink && (
                            <Button
                                size="$3"
                                borderColor="#262626"
                                borderWidth="$0.5"
                                themeInverse
                                variant="outlined"
                                backgroundColor="#FFFFFF"
                                color="#171717"
                                onPress={() =>
                                    Linking.openURL(event.registrationLink)
                                }
                                style={{ flex: 1 }}
                            >
                                Register
                            </Button>
                        )}
                    </View>
                </BlurView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
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
    },
});
