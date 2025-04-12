import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './changepassword.scss';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // Import the icon
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the visibility icon

const ChangePassword = () => {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false); // Toggle visibility for old password
    const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility for new password
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const requestData = { username, oldPassword, newPassword };

        try {
            const response = await fetch('http://localhost:8000/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setError('Password changed successfully!');
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Password change failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Password change error:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                {/* Logo and Welcome Message */}
                <img src="hello.png" alt="Logo" className="logo" />
                <h3 className="welcome-text">Bienvenue à Algérie Telecom !</h3>
                <p className="change-password-instruction">Vous devez changer votre mot de passe !</p>

                <form onSubmit={handleChangePassword}>
                    {/* Username input */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    {/* Old password with visibility toggle */}
                    <div className="password-container">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <div
                            className="toggle-visibility"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </div>
                    </div>

                    {/* New password with visibility toggle */}
                    <div className="password-container">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <div
                            className="toggle-visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </div>
                    </div>

                    {error && <p className="error">{error}</p>}
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
