import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';
import { useForm, FieldValues } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  college: string;
  year: string;
  program: string;
  branch: string;
  gender: string;
}

interface SignupFormProps {
  onBack: () => void;
}

export default function SignupForm({ onBack }: SignupFormProps) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      college: '',
      year: '',
      program: '',
      branch: '',
      gender: '',
    },
  });

  const [yearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');

  const yearOptions: string[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const genderOptions: string[] = ['Male', 'Female', 'Other'];

  const onSubmit = (data: FormData) => {
    console.log('Form Submitted', data);

  };

  const selectYear = (year: string) => {
    setSelectedYear(year);
    setValue('year', year);
    setYearModalVisible(false);
  };

  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    setValue('gender', gender);
    setGenderModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.header}>Sign Up for CSI Innowave</Text>
        <Text style={styles.subHeader}>Join our community of developers</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={control._formValues.name}
            onChangeText={(text: string) => setValue('name', text)}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={control._formValues.email}
            onChangeText={(text: string) => setValue('email', text)}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>College Name</Text>
          <TextInput
            placeholder="Enter your college"
            value={control._formValues.college}
            onChangeText={(text: string) => setValue('college', text)}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Year Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year</Text>
          <TouchableOpacity onPress={() => setYearModalVisible(true)} style={styles.input}>
            <Text style={[styles.placeholderText, selectedYear ? { color: '#fff' } : null]}>
              {selectedYear || 'Select Year'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gender Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity onPress={() => setGenderModalVisible(true)} style={styles.input}>
            <Text style={[styles.placeholderText, selectedGender ? { color: '#fff' } : null]}>
              {selectedGender || 'Select Gender'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Program</Text>
          <TextInput
            placeholder="Enter your program"
            value={control._formValues.program}
            onChangeText={(text: string) => setValue('program', text)}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Branch</Text>
          <TextInput
            placeholder="Enter your branch"
            value={control._formValues.branch}
            onChangeText={(text: string) => setValue('branch', text)}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Account</Text>
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
              <TouchableOpacity onPress={() => selectYear(item)} style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setYearModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
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
              <TouchableOpacity onPress={() => selectGender(item)} style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setGenderModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: '#007BFF',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalItem: {
    backgroundColor: '#444',
    padding: 15,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalItemText: {
    color: '#fff',
    fontSize: 18,
  },
  modalCloseButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

