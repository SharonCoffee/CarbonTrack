import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// Export AuthContext for useContext in other components
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Initialize your auth state and logic here

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Set state based on user presence
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
  );
};

// Define PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
