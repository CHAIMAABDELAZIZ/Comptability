import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './login.scss'; // Import des styles SCSS

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /*const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:8000/login', { // Assurez-vous que l'URL correspond à votre endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const data = await response.json();
                const { token } = data;
                setError('Login successful');

                // Décodez le token pour obtenir l'ID de l'utilisateur
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id; // Assurez-vous que la clé est correcte selon votre structure de token

                // Stocker l'ID de l'utilisateur dans le localStorage
                localStorage.setItem('userId', userId);

                // Rediriger vers la page de formulaire d'intervention
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };*/
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user = { username, password };
    
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
    
            if (response.ok) {
                const data = await response.json();
                const { token, isFirstLogin } = data;
    
                setError('Login successful');
    
                // Store the token and user ID
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
    
                if (isFirstLogin) {
                    // Redirect to password change page
                    navigate('/change-password');
                } else {
                    // Redirect to dashboard
                    navigate('/home');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };
    

    return (
        <div className="login">
            <div className="card">
                <div className="left"></div>
                <div className="right">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
