import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import BerRatingForm from '../components/BerRatingForm';

const BerPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/login'); // Redirect to login page after logout
    }).catch((error) => {
      // An error happened.
      console.error('Logout Error:', error);
    });
  };
  return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px', paddingTop: '20px' }}>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{ flex: 1 }}>
                <h1>Building Energy Rating (BER)</h1>
                <BerRatingForm />
                {/* You can add more components or information related to BER here */}
            </div>
        </div>
  );
};

export default BerPage;
