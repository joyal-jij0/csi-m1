import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, Animated } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"

interface ProfileProps {
  name: string
  email: string
  college: string
  year: string
  program: string
  branch: string
  imageUrl: string
}

export default function Profile({ 
  name = "Adarsh Singh ",
  email = "adarsh@example.com",
  college = "MAIT University",
  year = "3rd Year",
  program = "B.Tech",
  branch = "Computer Science",
  imageUrl = "https://avatars.githubusercontent.com/u/131537713?v=4"
}: ProfileProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Profile </Text>
          <Text style={styles.headerSubtitle}>Academic Details</Text>
        </View>

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
          <Text style={styles.category}>{program} • {branch}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Academic Information</Text>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#000',
  },
  headerSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
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
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
  }
})

