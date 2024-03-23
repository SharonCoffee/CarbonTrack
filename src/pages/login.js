import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginError(''); // If login is successful, clear any previous error messages
      navigate('/BerRatingForm'); // Navigate to the BerRating Form after login
    } catch (error) {
      // If login fails, set an error message
      setLoginError('Your email address or password is incorrect.');
    }
  };

  return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
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
                {loginError && <div className="error-message">{loginError}</div>}
                <p>
                    <Link to="/resetpassword">Forgot your password?</Link>
                </p>
                <button type="submit" className="login-button">Login</button>
            </form>
            <p>
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
  );
};

export default Login;
