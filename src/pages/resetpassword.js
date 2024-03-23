import React, { useState } from 'react';

function ResetPassword () {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = (error) => {
    error.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatchError(true);
    } else {
      // Proceed with the password reset logic here
      console.log('Password successfully reset.');
    }
  };

  return (
        <div className="reset-password-form">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
                <label>
                    New Password:
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(error) => setPassword(error.target.value)}
                    />
                </label>
                <label>
                    Confirm New Password:
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(error) => setConfirmPassword(error.target.value)}
                    />
                </label>
                <label>
                    Show Password
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                </label>
                <button type="submit">Reset Password</button>
                {passwordMismatchError && (
                    <div className="error-message">
                        Your passwords do not match. Please try again.
                    </div>
                )}
            </form>
        </div>
  );
}

export default ResetPassword;
