import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Add this line to import useNavigate

function ResetPassword () {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const navigate = useNavigate(); // Instantiate useNavigate for navigation

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    // Check if the email contains the '@' symbol
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Please check your email to reset your password.'); // Notify user to check their email
    } catch (error) {
      // Here you handle errors and set them so they can be displayed
      setError('Failed to send password reset email. Please make sure your email is correct and try again.');
    }
  };

  return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleResetPassword} className="reset-password-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                />
                <button type="submit">Send Reset Email</button>
                {error && (
                    <div className="error-message">{error}</div>
                )}
            </form>
            <p>Or</p>
            <button className="return-login-button" onClick={() => navigate('/login')}>Return to Login</button>
        </div>
  );
}

export default ResetPassword;
