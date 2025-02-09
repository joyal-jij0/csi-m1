import { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useFocusEffect } from "expo-router";
import EventSource from "react-native-sse";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import api from "@/api/api";

type VotingData = {
    votingStarted: boolean;
    performance?: {
        id: string;
        name: string;
        startTime: string | null;
        performers: string[];
        image: string;
        eventId: string;
        votingStarted: boolean;
        votingStartedAt: string;
        votingDuration: number;
    };
    secondsLeft: number;
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function Vote() {
    const [scaleValue] = useState(new Animated.Value(1));
    const [votingData, setVotingData] = useState<VotingData>({
        votingStarted: false,
        secondsLeft: 0,
    });
    const [imageLoading, setImageLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const es = new EventSource(
                `${process.env.EXPO_PUBLIC_BASE_URL}/voting/getStream`
            );

            es.addEventListener("message", (event) => {
                if (event.data) {
                    const data = JSON.parse(event.data);
                    setVotingData(data);
                }
            });

            es.addEventListener("error", (event) => {
                Toast.show({
                    type: "error",
                    text1: "Connectoin Error",
                    text2: "Failed to connect to the voting stream. Check your network",
                    position: "bottom",
                    autoHide: true,
                    visibilityTime: 3000,
                });
            });

            return () => {
                es.close();
            };
        }, [])
    );

    const renderVotingNotAvailable = () => {
        return (
            <View style={styles.notAvailableContainer}>
                <MaterialCommunityIcons
                    name="timer-sand"
                    size={60}
                    color="#FF4B8C"
                />
                <Text style={styles.notAvailableTitle}>
                    Voting Not Available Yet
                </Text>
                <Text style={styles.notAvailableText}>
                    The voting period hasn't started. Please check back later or try
                    again.
                </Text>
            </View>
        );
    };

    const renderTimer = () => {
        if (!votingData.votingStarted) return null;

        return (
            <View style={styles.timerContainer}>
                <MaterialCommunityIcons
                    name="timer-outline"
                    size={24}
                    color="#FFD700"
                />
                <Text style={styles.timerText}>
                    {votingData.secondsLeft > 0
                        ? formatTime(votingData.secondsLeft)
                        : "Time's up!"}
                </Text>
            </View>
        );
    };

    const handleVotePress = async (type: "yes" | "no") => {
        if (!votingData.votingStarted) return;

        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        const response = await api.post("/voting/submitVote", {
            vote: type === "yes",
        });
        console.log(response.data.message);

        setShowSuccessModal(true);
        console.log(`Voted ${type == "yes" ? true : false}`);
    };

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView style={{flex: 1}}>
                {votingData.votingStarted ? (
                    <View style={styles.topSection}>
                        {renderTimer()}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{
                                    uri: votingData.performance?.image,
                                }}
                                style={styles.image}
                                contentFit="cover"
                                transition={1000}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                            />
                            {imageLoading && (
                                <ActivityIndicator
                                    size="large"
                                    color="#FF4B8C"
                                    style={styles.spinner}
                                />
                            )}
                        </View>
                        <Text style={styles.title}>
                            {votingData.performance?.name}
                        </Text>

                        <Text style={styles.subtitle}>Liked it ?</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => handleVotePress("yes")}
                                activeOpacity={0.8}
                            >
                                <Animated.View
                                    style={[
                                        styles.voteButton,
                                        styles.yesButton,
                                        { transform: [{ scale: scaleValue }] },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name="thumb-up"
                                        size={24}
                                        color="#fff"
                                    />
                                    <Text style={styles.buttonText}>
                                        Vote Yes
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleVotePress("no")}
                                activeOpacity={0.8}
                            >
                                <Animated.View
                                    style={[
                                        styles.voteButton,
                                        styles.noButton,
                                        { transform: [{ scale: scaleValue }] },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name="thumb-down"
                                        size={24}
                                        color="#fff"
                                    />
                                    <Text style={styles.buttonText}>
                                        Vote No
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    renderVotingNotAvailable()
                )}

                <Modal
                    transparent
                    visible={showSuccessModal}
                    onRequestClose={() => setShowSuccessModal(false)}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={50}
                                color="#00ff87"
                            />
                            <Text style={styles.modalText}>
                                Vote submitted successfully!
                            </Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowSuccessModal(false)}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    check: {
        color: "white",
        fontSize: 30,
    },
    notAvailableContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    notAvailableTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    notAvailableText: {
        color: "#aaa",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    topSection: {
        alignItems: "center",
    },
    title: {
        color: "#FF4B8C",
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 0.5,
        marginTop: 10,
    },
    subtitle: {
        color: "#fff",
        fontSize: 20,
        marginTop: 30,
        fontWeight: "600",
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 16,
    },
    timerText: {
        color: "#FFD700",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: "100%",
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 20,
        // paddingHorizontal: 20,
        // paddingBottom: 20,
        paddingTop: 20,
    },
    voteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
    },
    yesButton: {
        backgroundColor: "#22c55e",
    },
    noButton: {
        backgroundColor: "#ef4444",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    spinner: {
        position: "absolute",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#000",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        minWidth: 300,
        borderWidth: 1,
        borderColor: "#00ff87",
    },
    modalText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        marginVertical: 15,
        fontWeight: "600",
    },
    modalButton: {
        backgroundColor: "#00ff87",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
