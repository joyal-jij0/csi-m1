import api from "@/api/api";
import { AppDispatch } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { Button } from "tamagui";
import { logout } from "@/redux/features/authSlice";
import { router } from "expo-router";

interface ProfileProps {
    name: string;
    email: string;
    college: string;
    year: string;
    program: string;
    branch: string;
    imageUrl: string;
}

function capitalizeEachWord(str: string) {
    return str
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
}

export default function Profile() {
    const [profile, setProfile] = useState<ProfileProps | null>(null);
    const [error, setError] = useState("");
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/profile/retrieve/");
                setProfile(response.data.data);
            } catch (error) {
                setError("Failed to fetch profile data");
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post("/user/logout");
            dispatch(logout());
            router.replace("/(auth)/signin");
        } catch (error) {
            setError("Failed to logout. Please try again");
        } finally {
            setLoggingOut(false);
        }
    };

    if (!profile) {
        return (
            <LinearGradient
                colors={["#000000", "#271146"]}
                style={{ flex: 1 }}
                locations={[0, 0.99]}
            >
                <View style={styles.container}>
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            marginTop: 50,
                        }}
                    >
                        Loading profile...
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Section */}
                    <View style={styles.profileContainer}>
                        <View style={styles.imageWrapper}>
                            {/* <Image
                                source={{ uri: imageUrl }}
                                style={styles.profileImage}
                            /> */}
                            <MaterialCommunityIcons
                                name="account-circle-outline"
                                size={80}
                                color="white"
                            />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>STU</Text>
                            </View>
                        </View>
                        <Text style={styles.name}>
                            {capitalizeEachWord(profile!.name)}
                        </Text>
                        <Text style={styles.category}>
                            {capitalizeEachWord(profile!.program)} •{" "}
                            {profile!.branch.toUpperCase()}
                        </Text>
                    </View>

                    {/* Details Section */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            Contact Information
                        </Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{profile!.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            Academic Information
                        </Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>College</Text>
                            <Text style={styles.value}>
                                {capitalizeEachWord(profile!.college)}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Year</Text>
                            <Text style={styles.value}>{profile!.year}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Program</Text>
                            <Text style={styles.value}>
                                {capitalizeEachWord(profile!.program)}
                            </Text>
                        </View>

                        {profile!.branch && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Branch</Text>
                                <Text style={styles.value}>
                                    {profile!.branch.toUpperCase()}
                                </Text>

                                <Button
                                    onPress={handleLogout}
                                    disabled={loggingOut}
                                    style={{
                                        backgroundColor: "red",
                                        marginTop: 10,
                                        color: "white",
                                        width: "100%",
                                        paddingVertical: 8,
                                    }}
                                >
                                    {loggingOut ? "Logging out..." : "Logout"}
                                </Button>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderWidth: 5,
        borderColor: "#271146",
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
        // backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: "#000",
    },
    infoTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    detailItem: {
        marginBottom: 15,
        backgroundColor: "#000",
    },
    label: {
        color: "#aaa",
        fontSize: 14,
        marginBottom: 8,
        backgroundColor: "#000",
    },
    value: {
        color: "#fff",
        fontSize: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 12,
        borderRadius: 10,
    },
});
