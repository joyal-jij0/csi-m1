import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Vote() {
    const [scaleValue] = useState(new Animated.Value(1));

    const handleVotePress = (type: any) => {
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

        if (type === "yes") {
            console.log("Voted Yes");
        } else {
            console.log("Voted No");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.performanceTitle}>
                        Dance Performance
                    </Text>
                    <Text style={styles.performanceSubtitle}>Live Now</Text>
                </View>

                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: "https://avatars.githubusercontent.com/u/131537713?v=4",
                            }}
                            style={styles.profileImage}
                        />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>#1</Text>
                        </View>
                    </View>
                    <Text style={styles.name}>Adarshs</Text>
                    <Text style={styles.category}>Contemporary_Dance</Text>
                </View>

                {/* Contestant Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>About Performance</Text>
                    <Text style={styles.infoText}>
                        John Doe is a talented performer known for his
                        outstanding dance moves and creative choreography. He
                        has been performing for over 5 years and has won
                        numerous awards in local competitions.
                    </Text>
                </View>
            </View>

            {/* Voting Buttons */}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
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
        bottom: 0,
        right: 0,
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
    infoCard: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
    },
    infoTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    infoText: {
        color: "#aaa",
        fontSize: 15,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: "rgba(0,0,0,0.8)",
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
});
