import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!&])[A-Za-z\d#@$!&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setSignupError('Password must be at least 8 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one symbol (#, $, @, !, &).');
      return;
    }

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/ber'); // Navigate to the BerRating Form after signup
    } catch (error) {
      setSignupError('An error occurred. Please try again.'); // Update this as per your error message
    }
  };

  return (
        <div className="form-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup} className="form">
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
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                {signupError && <div className="error-message">{signupError}</div>}
                <button type="submit" className="form-button">Register</button>
            </form>
            <p className="form-footer">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
  );
};

export default Signup;
