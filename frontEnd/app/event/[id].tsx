import { View, StyleSheet, Image, ScrollView, Dimensions, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text } from 'react-native';
import { Button } from 'tamagui';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen() {
  const { id, eventData } = useLocalSearchParams();

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
      <Stack.Screen 
        options={{
          title: 'Event Details',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView>
        <Image source={{ uri: event.image }} style={styles.image} />
        <BlurView intensity={80} tint="dark" style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>
              {new Date(event.time).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{event.venue}</Text>
          </View>

          {/* <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>
              {event.participants} participants
            </Text>
          </View> */}

          <Text style={styles.description}>{event.description}</Text>
          {event.isRegistrationLive && (
                                <Button
                                    size="$3"
                                    theme="blue"
                                    themeInverse
                                    variant="outlined"
                                    backgroundColor="black"
                                    onPress={() =>
                                        Linking.openURL(event.registrationLink)
                                    }
                                >
                                    Register
                                </Button>
                            )}
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
}); 