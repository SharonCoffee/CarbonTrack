import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the homepage or dashboard after signup
    } catch (error) {
      alert(error.message);
    }
  };

  // Inline styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Align items in the center horizontally
    gap: '10px' // Space between form items
  };

  const buttonStyle = {
    marginTop: '20px' // Space above the button
  };

  return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup} style={formStyle}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" style={buttonStyle}>Signup</button>
            </form>
            <p style={{ marginTop: '10px' }}> {/* Additional style for spacing */}
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
  );
};

export default Signup;
