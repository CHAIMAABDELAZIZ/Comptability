import React, { useState } from "react";
import Cnavbar from "../../../components/Cnavbar";
import CsideMenu from "../../../components/Csidemenu";
import "./Cmodifier.css";
import { useParams } from "react-router-dom";
import { FormControl, InputLabel, Input, Select, MenuItem, Button, Grid } from '@mui/material';

const Cmodifier = () => {
    const { id } = useParams();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password, role };

        try {
            const response = await fetch(`http://localhost:8000/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                setSuccess('Utilisateur modifié avec succès');
                setError('');
                // Optional: Redirect or perform another action
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Échec de la modification');
                setSuccess('');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur lors de la modification:', error);
        }
    };

    return (
        <div className="new">
            <CsideMenu />
            <div className="newContainer">
                <Cnavbar />
                <div className="top">
                    <h1 style={{ color: '#84A5C4' }}>Modifier l'utilisateur</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="username">Nom d'utilisateur</InputLabel>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={handleUserNameChange}
                                            placeholder="Nom d'utilisateur"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="password">Mot de passe</InputLabel>
                                        <Input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Mot de passe"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="role">Rôle</InputLabel>
                                        <Select
                                            id="role"
                                            value={role}
                                            onChange={handleRoleChange}
                                            label="Rôle"
                                        >
                                            <MenuItem value="user">Utilisateur</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="contained" type="submit" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                                            Enregistrer
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

export default Cmodifier;
