import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";

interface ProfileProps {
    name: string;
    email: string;
    college: string;
    year: string;
    program: string;
    branch: string;
    imageUrl: string;
}

export default function Profile({
    name = "Adarsh Singh ",
    email = "adarsh@example.com",
    college = "MAIT University",
    year = "3rd Year",
    program = "B.Tech",
    branch = "Computer Science",
    imageUrl = "https://avatars.githubusercontent.com/u/131537713?v=4",
}: ProfileProps) {
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
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.profileImage}
                            />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>STU</Text>
                            </View>
                        </View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.category}>
                            {program} • {branch}
                        </Text>
                    </View>

                    {/* Details Section */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            Contact Information
                        </Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            Academic Information
                        </Text>
                        <View style={styles.detailItem}>
                            <Text style={styles.label}>College</Text>
                            <Text style={styles.value}>{college}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Year</Text>
                            <Text style={styles.value}>{year}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Program</Text>
                            <Text style={styles.value}>{program}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Branch</Text>
                            <Text style={styles.value}>{branch}</Text>
                        </View>
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
