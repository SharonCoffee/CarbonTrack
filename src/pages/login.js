import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the homepage or dashboard after login
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
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={formStyle}>
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
                <button type="submit" style={buttonStyle}>Login</button>
            </form>
            <p>
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
  );
};

export default Login;
