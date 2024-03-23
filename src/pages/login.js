import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

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
      navigate('/BerRatingForm');
    } catch (error) {
      setLoginError('Your email address or password is incorrect.');
    }
  };

  return (
        <div className="login-container">
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
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="login-links">
                <Link to="/resetpassword">Forgot your password?</Link>
                <br />
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
  );
};

export default Login;
