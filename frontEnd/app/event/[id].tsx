import { View, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text } from 'react-native';

const { width } = Dimensions.get('window');

// Define the Event type
interface Event {
  id: string;
  title: string;
  type: 'Music' | 'Dance' | 'Hackathon';
  time: Date;
  image: string;
  venue: string;
  participants: number;
  description: string;
}

// Add the DUMMY_EVENTS data
const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Music Competition',
    type: 'Music',
    time: new Date(),
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c',
    venue: 'Main Auditorium',
    participants: 120,
    description: 'Join us for an evening of musical excellence'
  },
  {
    id: '2',
    title: 'Dance Competition',
    type: 'Dance',
    time: new Date(Date.now() + 30 * 60000),
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea',
    venue: 'Dance Arena',
    participants: 85,
    description: 'Showcase your dance moves'
  },
  {
    id: '3',
    title: 'Smart Hackathon',
    type: 'Hackathon',
    time: new Date(Date.now() - 30 * 60000),
    image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0',
    venue: 'Innovation Hub',
    participants: 200,
    description: 'Code your way to victory'
  }
];

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  
  // Fix the type for parameter 'e'
  const event = DUMMY_EVENTS.find((e: Event) => e.id === id);

  if (!event) return null;

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

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>
              {event.participants} participants
            </Text>
          </View>

          <Text style={styles.description}>{event.description}</Text>
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
  },
}); 