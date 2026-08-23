import { createContext, useContext, useState } from 'react';
import { mockCurrentUser } from '../data/mock/users';

const ProfileContext = createContext(null);

const PROFILE_IMAGE_STORAGE_KEY = 'worksy:profileImage';

function getStoredProfileImage() {
  try {
    return localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY) || null;
  } catch {
    // localStorage can throw in private/incognito mode in some browsers —
    // fail quietly and just start with no photo rather than crashing.
    return null;
  }
}

export function ProfileProvider({ children }) {
  // Text fields: seeded from mock data, reset every refresh (no persistence).
  // profileImage: the one field that IS persisted, via localStorage.
  const [profile, setProfile] = useState(() => ({
    ...mockCurrentUser,
    profileImage: getStoredProfileImage(),
  }));

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };

      if ('profileImage' in updates) {
        try {
          if (updates.profileImage) {
            localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, updates.profileImage);
          } else {
            localStorage.removeItem(PROFILE_IMAGE_STORAGE_KEY);
          }
        } catch {
          // Storage full or unavailable then profile still updates in memory,
          // it just won't survive a refresh this time.
        }
      }

      return next;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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