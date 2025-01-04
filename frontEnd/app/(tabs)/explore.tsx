import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function explore() {
    return (
        <View>
            <TouchableOpacity
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Bhai Yha Lagani wali MAP ki Image De Dena Jald se Jald</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => router.push('/onBoardingForm')}
            >
                <Text style={styles.submitButtonText}>Tab Tak chalo yha click krke onboarding form hi dekh lo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
},
submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
},
});
