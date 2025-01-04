import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Vote() {
  const [scaleValue] = useState(new Animated.Value(1));
  
  const handleVotePress = (type:any) => {
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

    if (type === 'yes') {
      console.log('Voted Yes');
    } else {
      console.log('Voted No');
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#000000']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.performanceTitle}>Dance Performance</Text>
          <Text style={styles.performanceSubtitle}>Finals • Live Now</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: 'https://avatars.githubusercontent.com/u/131537713?v=4' }}
              style={styles.profileImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>#1</Text>
            </View>
          </View>
          <Text style={styles.name}>Adarshs</Text>
          <Text style={styles.category}>Contemporary_Dance</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={20} color="#FF4B8C" />
              <Text style={styles.statText}>120 Votes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.statText}>Top Performer</Text>
            </View>
          </View>
        </View>

        {/* Contestant Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Performance</Text>
          <Text style={styles.infoText}>
            John Doe is a talented performer known for his outstanding dance moves and creative choreography.
            He has been performing for over 5 years and has won numerous awards in local competitions.
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.votingSection}>
          <Text style={styles.votingTitle}>Current Standing</Text>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#00ff87', '#60efff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { flex: 3 }]}
            />
            <View style={[styles.progressBar, styles.noProgress]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>75% Yes</Text>
            <Text style={styles.progressText}>25% No</Text>
          </View>
        </View>
      </ScrollView>

      {/* Voting Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleVotePress('yes')}
          activeOpacity={0.8}
        >
          <Animated.View style={[
            styles.voteButton,
            styles.yesButton,
            { transform: [{ scale: scaleValue }] }
          ]}>
            <MaterialCommunityIcons name="thumb-up" size={24} color="#fff" />
            <Text style={styles.buttonText}>Vote Yes</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleVotePress('no')}
          activeOpacity={0.8}
        >
          <Animated.View style={[
            styles.voteButton,
            styles.noButton,
            { transform: [{ scale: scaleValue }] }
          ]}>
            <MaterialCommunityIcons name="thumb-down" size={24} color="#fff" />
            <Text style={styles.buttonText}>Vote No</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  headerSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  performanceSubtitle: {
    color: '#FF4B8C',
    fontSize: 16,
    marginTop: 5,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FF4B8C',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  name: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#333',
    marginHorizontal: 15,
  },
  statText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    color: '#aaa',
    fontSize: 15,
    lineHeight: 24,
  },
  votingSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  votingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  progressBar: {
    height: '100%',
  },
  noProgress: {
    flex: 1,
    backgroundColor: '#FF4B8C',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: width * 0.42,
  },
  yesButton: {
    backgroundColor: '#00ff87',
  },
  noButton: {
    backgroundColor: '#FF4B8C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});