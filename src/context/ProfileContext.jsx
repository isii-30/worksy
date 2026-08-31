import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as profileService from '../services/profileService';

const ProfileContext = createContext(null);

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  contactNumber: '',
  jobTitle: '',
  bio: '',
  profileImage: null,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchProfile = useCallback(() => {
    setIsLoading(true);
    setLoadError('');
    return profileService
      .getProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Runs once when the app first loads (e.g. someone already logged in
  // refreshing the page). Login/Register explicitly call refreshProfile()
  // themselves afterward, since SPA navigation doesn't remount this
  // provider and re-trigger this effect.
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshProfile = fetchProfile;

  const updateProfile = async (updates) => {
    const updated = await profileService.updateProfile(updates);
    setProfile(updated);
    return updated;
  };

  const resetProfile = () => {
    setProfile(emptyProfile);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, isLoading, loadError, refreshProfile, resetProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}