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
      navigate('/ber'); // Navigate to the BerRating Form after signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup} className="signup-form">
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
                <button type="submit" className="signup-button">Register</button>

            </form>
            <p style={{ marginTop: '10px' }}>
            Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
  );
};

export default Signup;
