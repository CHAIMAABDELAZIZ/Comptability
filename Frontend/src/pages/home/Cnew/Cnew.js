import "./Cnew.css";
import { useState } from "react";
import Csidemenu from "../../../components/Csidemenu";
import Cnavbar from "../../../components/Cnavbar";
import { FormControl, InputLabel, Input, Button, Grid } from '@mui/material';

const Cnew = () => {
    const [username, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { username, password, role };

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
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Échec de l\'ajout');
                setSuccess('');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur lors de l\'ajout:', error);
        }
    };

    return (
        <div className="new">
            <Csidemenu />
            <div className="newContainer">
                <Cnavbar />
                <div className="top">
                    <h1 style={{ color: '#84A5C4' }}>AJOUTER UN NOUVEAU UTILISATEUR</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4.5}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="UserName">Nom d'utilisateur</InputLabel>
                                        <Input
                                            id="UserName"
                                            value={username}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Nom d'utilisateur"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="Role">Rôle</InputLabel>
                                        <Input
                                            id="Role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="Rôle"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="Password">Mot de passe</InputLabel>
                                        <Input
                                            type="password"
                                            id="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mot de passe"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="contained" type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                                            Ajouter
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {error && <p className="error">{error}</p>}
                            {success && <p className="success">{success}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cnew;
