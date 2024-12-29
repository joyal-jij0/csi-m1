import React from 'react';
import { Text, TextInput, View, Button, Picker, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';

export default function SignupForm({ onBack }) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
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

  const onSubmit = (data) => {
    console.log('Form Submitted', data);
    // Handle form submission
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#1a1a1a' }}>
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
        <Text style={{ color: 'white' }}>Back</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 8 }}>
        <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>Sign Up for CSI Innowave</Text>
        <Text style={{ color: 'white', marginBottom: 20 }}>Join our community of developers</Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white' }}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={control.name}
            onChangeText={(text) => setValue('name', text)}
            style={{ backgroundColor: 'black', color: 'white', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5 }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white' }}>Email Address</Text>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={control.email}
            onChangeText={(text) => setValue('email', text)}
            style={{ backgroundColor: 'black', color: 'white', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5 }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white' }}>College Name</Text>
          <TextInput
            placeholder="Enter your college"
            value={control.college}
            onChangeText={(text) => setValue('college', text)}
            style={{ backgroundColor: 'black', color: 'white', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5 }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white' }}>Year</Text>
          <Picker
            selectedValue={control.year}
            onValueChange={(value) => setValue('year', value)}
            style={{ backgroundColor: 'black', color: 'white', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5 }}
          >
            <Picker.Item label="Select Year" value="" />
            <Picker.Item label="1st Year" value="1" />
            <Picker.Item label="2nd Year" value="2" />
            <Picker.Item label="3rd Year" value="3" />
            <Picker.Item label="4th Year" value="4" />
          </Picker>
        </View>

        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#007BFF', padding: 12, borderRadius: 5 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
