import React, { useEffect, useState } from "react";
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    FlatList,
    KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import api from "@/api/api";
import { MMKV } from 'react-native-mmkv';
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface FormData {
    name: string;
    phone: string;
    college: string;
    year: string;
    program: string;
    branch: string;
    gender: string;
}

interface SignupFormProps {
    onBack: () => void;
}

const storage = new MMKV();

export default function onBoardingForm({ onBack }: SignupFormProps) {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            phone: "",
            college: "",
            year: "",
            program: "",
            branch: "",
            gender: "",
        },
    });

    const [yearModalVisible, setYearModalVisible] = useState<boolean>(false);
    const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const checkAndFetchProfile = async () => {
            try {
                const storedProfileExists = storage.getBoolean("profileExists");
                if (storedProfileExists) {
                    router.replace("/(tabs)");
                    return;
                }
    
                const response = await api.get("/profile/check");
                if (response.data.data) {
                    storage.set("profileExists", true); 
                    router.replace("/(tabs)");
                }
            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: "Profile Creation Failed",
                    text2: error.response?.data?.message || "Error in checking if profile exists",
                    position: "bottom",
                    autoHide: true,
                    visibilityTime: 3000
                });
            }
        };
    
        checkAndFetchProfile();
    }, [router]);

    const yearOptions: string[] = [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "5th Year",
    ];
    const genderOptions: string[] = ["Male", "Female", "Other"];

    const onSubmit = async (data: FormData) => {
        try {
            const transformedData = {
                ...data,
                year: parseInt(data.year, 10), // Convert year string like "1st Year" to a number
                name: data.name.trim().toLowerCase(),
                college: data.college.trim().toLowerCase(),
                program: data.program.trim().toLowerCase(),
                branch: data.branch.trim().toLowerCase(),
                gender: data.gender.trim().toLowerCase(),
                phone: data.phone.trim().toLowerCase(),
            };
            const response = await api.post(
                "/profile/create/",
                transformedData
            );
            storage.set("profileExists", true);
            router.replace('/(tabs)')
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Profile Creation Failed",
                text2: error.response?.data?.message,
                position: "bottom",
                autoHide: true,
                visibilityTime: 3000
            });
        } 
    };

    const selectYear = (year: string) => {
        setValue("year", year);
        setYearModalVisible(false);
    };

    const selectGender = (gender: string) => {
        setValue("gender", gender);
        setGenderModalVisible(false);
    };

    return (
        <LinearGradient
            colors={["#000000", "#271146"]}
            style={{ flex: 1 }}
            locations={[0, 0.99]}
        >
            <SafeAreaView>
                <ScrollView>
                    <KeyboardAvoidingView>
                        <View style={styles.formContainer}>
                            <Text style={styles.header}>
                                Sign Up for CSI Innowave
                            </Text>
                            <Text style={styles.subHeader}>
                                Join our community of developers
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{ required: "Name is required" }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            placeholder="Enter your full name"
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            placeholderTextColor="#aaa"
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <Text style={styles.errorText}>
                                        {errors.name.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone</Text>
                                <Controller
                                    control={control}
                                    name="phone"
                                    rules={{
                                        required: "Phone is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone must be 10 digits",
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            placeholder="Enter your Mobile No."
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            placeholderTextColor="#aaa"
                                            keyboardType="number-pad"
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <Text style={styles.errorText}>
                                        {errors.phone.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>College Name</Text>
                                <Controller
                                    control={control}
                                    name="college"
                                    rules={{
                                        required: "College name is required",
                                    }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            placeholder="Enter your college"
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            placeholderTextColor="#aaa"
                                        />
                                    )}
                                />
                                {errors.college && (
                                    <Text style={styles.errorText}>
                                        {errors.college.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Year</Text>
                                <Controller
                                    control={control}
                                    name="year"
                                    rules={{ required: "Year is required" }}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setYearModalVisible(true)
                                            }
                                            style={styles.input}
                                        >
                                            <Text
                                                style={[
                                                    styles.placeholderText,
                                                    value
                                                        ? { color: "#fff" }
                                                        : null,
                                                ]}
                                            >
                                                {value || "Select Year"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                {errors.year && (
                                    <Text style={styles.errorText}>
                                        {errors.year.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Gender</Text>
                                <Controller
                                    control={control}
                                    name="gender"
                                    rules={{ required: "Gender is required" }}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setGenderModalVisible(true)
                                            }
                                            style={styles.input}
                                        >
                                            <Text
                                                style={[
                                                    styles.placeholderText,
                                                    value
                                                        ? { color: "#fff" }
                                                        : null,
                                                ]}
                                            >
                                                {value || "Select Gender"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                {errors.gender && (
                                    <Text style={styles.errorText}>
                                        {errors.gender.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Course</Text>
                                <Controller
                                    control={control}
                                    name="program"
                                    rules={{ required: "Program is required" }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            placeholder="Enter your program"
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            placeholderTextColor="#aaa"
                                        />
                                    )}
                                />
                                {errors.year && (
                                    <Text style={styles.errorText}>
                                        {errors.year.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Branch</Text>
                                <Controller
                                    control={control}
                                    name="branch"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            placeholder="Enter your branch"
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            placeholderTextColor="#aaa"
                                        />
                                    )}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitButtonText}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Year Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={yearModalVisible}
                            onRequestClose={() => setYearModalVisible(false)}
                        >
                            <View style={styles.modalView}>
                                <FlatList
                                    data={yearOptions}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => selectYear(item)}
                                            style={styles.modalItem}
                                        >
                                            <Text style={styles.modalItemText}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    onPress={() => setYearModalVisible(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <Text style={styles.modalCloseText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                        {/* Gender Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={genderModalVisible}
                            onRequestClose={() => setGenderModalVisible(false)}
                        >
                            <View style={styles.modalView}>
                                <FlatList
                                    data={genderOptions}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => selectGender(item)}
                                            style={styles.modalItem}
                                        >
                                            <Text style={styles.modalItemText}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    onPress={() => setGenderModalVisible(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <Text style={styles.modalCloseText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        // backgroundColor: "#121212",
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#333",
    },
    header: {
        fontSize: 26,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#fff",
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        borderWidth: 1,
        borderColor: "#444",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    placeholderText: {
        color: "#aaa",
        fontSize: 16,
    },
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
    modalView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: "#333",
    },
    modalItem: {
        backgroundColor: "#444",
        padding: 15,
        width: "100%",
        borderRadius: 8,
        marginBottom: 10,
    },
    modalItemText: {
        color: "#fff",
        fontSize: 18,
    },
    modalCloseButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginTop: 20,
        borderRadius: 8,
        minHeight: 48,
        justifyContent: "center",
        alignItems: "center"
    },
    modalCloseText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});
