import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import EventSource from "react-native-sse";
import api from "@/api/api";
import { Image } from "expo-image";

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

export default function Vote() {
    const [scaleValue] = useState(new Animated.Value(1));
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [votingData, setVotingData] = useState<VotingData>({
        votingStarted: false,
        secondsLeft: 0,
    });

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

    // const handleRetry = () => {
    //     setIsLoading(true);
    //     setTimeout(() => {
    //         setIsLoading(false);
    //     }, 2000);
    // };

    useEffect(() => {
        const es = new EventSource(
            `${process.env.EXPO_PUBLIC_BASE_URL}/voting/getStream`
        );

        es.addEventListener("message", (event) => {
            if (event.data) {
                const data = JSON.parse(event.data);
                console.log(data)
                setVotingData(data);
            }
        });

        es.addEventListener("error", (event) => {
            console.error("An error occurred:", event);
        });

        return () => {
            es.close();
        };
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

    const renderVotingNotAvailable = () => (
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
            {/* <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                disabled={isLoading}
            >
                <MaterialCommunityIcons
                    name={isLoading ? "loading" : "refresh"}
                    size={24}
                    color="#fff"
                    style={isLoading && styles.spinningIcon}
                />
                <Text style={styles.retryButtonText}>
                    {isLoading ? "Checking..." : "Check Again"}
                </Text>
            </TouchableOpacity> */}
        </View>
    );

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView style={styles.container}>
                {votingData.votingStarted && (
                    <View>
                        {/* Header Section */}
                        <View style={styles.headerSection}>
                            <Text style={styles.performanceTitle}>
                                {votingData.performance?.name || "Performance"}
                            </Text>
                            <Text
                                style={[
                                    styles.performanceSubtitle,
                                    !votingData.votingStarted &&
                                        styles.notAvailableStatus,
                                ]}
                            >
                                {votingData.votingStarted
                                    ? "Voting is now available"
                                    : "Voting not started"}
                            </Text>
                            {renderTimer()}
                        </View>

                        {/* Profile Section */}
                        <View style={styles.profileContainer}>
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={{
                                        uri: votingData.performance?.image,
                                    }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>#1</Text>
                                </View>
                            </View>
                            <Text style={styles.name}>
                                {votingData.performance?.name || "KRSNA"}
                            </Text>
                            <Text style={styles.category}>
                                {votingData.performance?.performers.flatMap(
                                    (e) => e
                                ) || "Singer from Pheonix MAIT"}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Conditional Rendering based on voting availability */}
                {votingData.votingStarted ? (
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
                                <Text style={styles.buttonText}>Vote Yes</Text>
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
                                <Text style={styles.buttonText}>Vote No</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    renderVotingNotAvailable()
                )}

                {/* Success Modal */}
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
    container: {
        flex: 1,
        paddingTop: 15,
    },
    headerSection: {
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 20,
    },
    performanceTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    performanceSubtitle: {
        color: "#FF4B8C",
        fontSize: 16,
        marginTop: 5,
        fontWeight: "600",
    },
    notAvailableStatus: {
        color: "#FFD700",
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
    profileContainer: {
        alignItems: "center",
    },
    imageWrapper: {
        position: "relative",
        marginBottom: 15,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: "#FF4B8C",
    },
    badge: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "#FFD700",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#000",
    },
    badgeText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 12,
    },
    name: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5,
    },
    category: {
        color: "#aaa",
        fontSize: 16,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        paddingBottom: 20,
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
        backgroundColor: "#00ff87",
    },
    noButton: {
        backgroundColor: "#FF4B8C",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
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
    retryButton: {
        backgroundColor: "#FF4B8C",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
    spinningIcon: {
        transform: [{ rotate: "45deg" }],
    },
});
