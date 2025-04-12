import React, { useState } from 'react';
import './adduser.scss'; // Import des styles SCSS

const Adduser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // État pour les messages de succès

    const checkUsernameExists = async (username) => {
        try {
            const response = await fetch(`http://localhost:8000/check-username?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                return data.exists;
            } else {
                throw new Error("Erreur lors de la vérification du nom d'utilisateur.");
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du nom d'utilisateur:", error);
            setError("Une erreur est survenue lors de la vérification du nom d'utilisateur.");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier si le nom d'utilisateur existe déjà
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            setError("Le nom d'utilisateur existe déjà, veuillez en choisir un autre.");
            return; // Arrêter l'exécution si le nom d'utilisateur est déjà pris
        }

        const user = { username, password };

        try {
            const response = await fetch('http://localhost:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setSuccess('Utilisateur ajouté avec succès');
                setError(''); // Réinitialiser les messages d'erreur en cas de succès
                // Vous pouvez rediriger l'utilisateur vers une autre page après l'inscription
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Échec de l\'ajout');
                setSuccess(''); // Réinitialiser les messages de succès en cas d'erreur
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur lors de l\'ajout:', error);
        }
    };

    return (
        <div className="register">
            <div className="card">
                <div className="right"></div>
                <div className="left">
                    <h1>Add User</h1>
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
                        {success && <p className="success">{success}</p>}
                        <button type="submit">Add user</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Adduser;
