import * as SecureStore from 'expo-secure-store';

const PROFILE_EXISTS_KEY = 'profileExists';

export const SecureStorage = {
    async setProfileExists(exists: boolean) {
        try {
        await SecureStore.setItemAsync(PROFILE_EXISTS_KEY, JSON.stringify(exists));
        } catch (error) {
        console.error('Error saving profile status:', error);
        }
    },

    async getProfileExists(): Promise<boolean | null> {
        try {
        const value = await SecureStore.getItemAsync(PROFILE_EXISTS_KEY);
        return value ? JSON.parse(value) : null;
        } catch (error) {
        console.error('Error getting profile status:', error);
        return null;
        }
    }
};