import React, { useState,useEffect } from 'react';
import { FormControl, InputLabel, Input, Select, MenuItem, FormHelperText, Button, Grid } from '@mui/material';
import Csidemenu from "../../../components/Csidemenu";
import Cnavbar from "../../../components/Cnavbar";
import './Emodifier.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Emodifier = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [mark, setMark] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [ipAddress, setIPAddress] = useState('');
    const [immo, setImmo] = useState('');
    const [ns, setNS] = useState('');
    const [etat, setEtat] = useState('');
    const [ram, setRam] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('ID utilisateur récupéré:', userId);

        if (!userId) {
            setError('Utilisateur non authentifié.');
            return;
        }

        // Requête pour récupérer le nom d'utilisateur à partir de l'ID utilisateur
        const fetchUsername = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/${userId}`);
                setUsername(response.data.username); // Assurez-vous que la réponse contient bien le nom d'utilisateur
            } catch (err) {
                console.error('Erreur lors de la récupération du nom d’utilisateur:', err);
                setError('Erreur lors de la récupération du nom dutilisateur.');
            }
        };


        const fetchEquipmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/equipements/${id}`);
                const equipment = response.data;
    
                // Set form fields with the fetched data
                setMark(equipment.mark);
                setModel(equipment.model);
                setType(equipment.type);
                setConnectionType(equipment.connection_type);
                setIPAddress(equipment.ip_address);
                setImmo(equipment.immo);
                setNS(equipment.ns);
                setEtat(equipment.etat);
                setRam(equipment.ram);
                setUsername(equipment.username);
            } catch (err) {
                console.error('Erreur lors de la récupération des détails de l\'équipement:', err);
                setError('Erreur lors de la récupération des détails de l\'équipement.');
            }
        };


        fetchUsername();
        fetchEquipmentDetails();
    }, [id]);

    


    const handleSubmit = async (e) => {
        e.preventDefault();

        const material = {
            username : username,
            mark,
            model,
            type,
            connection_type: connectionType,  // Ensure this is properly passed
            ip_address: ipAddress,            // Ensure this is properly passed
            immo,
            ns,
            etat,
            ram
        };

        try {
            const response = await fetch(`http://localhost:8000/equipements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(material),
            });

            if (response.ok) {
                setSuccess('Matériel modifié avec succès');
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Échec de modification');
                setSuccess('');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur lors de modification:', error);
        }
    };

    return (
        <div className="new">
            <Csidemenu />
            <div className="newContainer">
                <Cnavbar />
                <div className="top">
                    <h1 style={{ color: '#84A5C4' }}>Modifier l'equipement</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4.5}>
                                {/* Required Fields at the Top */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="username">Nom d'utilisateur</InputLabel>
                                        <Input
                                            id="username"
                                            value={username}
                                            placeholder="Nom d'utilisateur"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="type">Type</InputLabel>
                                        <Select
                                            id="type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            label="Type"
                                        >
                                            <MenuItem value="Pc Bureau">Pc Bureau</MenuItem>
                                            <MenuItem value="Pc Portable">Pc Portable</MenuItem>
                                            <MenuItem value="Imprimante Multifonction">Imprimante Multifonction</MenuItem>
                                            <MenuItem value="Imprimante thermique">Imprimante thermique</MenuItem>
                                            <MenuItem value="Imprimante Simple">Imprimante Simple</MenuItem>
                                            <MenuItem value="Scanner">Scanner</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="mark">Marque</InputLabel>
                                        <Select
                                            id="mark"
                                            value={mark}
                                            onChange={(e) => setMark(e.target.value)}
                                            label="Marque"
                                        >
                                            <MenuItem value="dell">Dell</MenuItem>
                                            <MenuItem value="HP">HP</MenuItem>
                                            <MenuItem value="Acer">Acer</MenuItem>
                                            <MenuItem value="Epson">Epson</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="model">Modèle</InputLabel>
                                        <Input
                                            id="model"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            placeholder="Modèle"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="ns">Numéro de Série (NS)</InputLabel>
                                        <Input
                                            id="ns"
                                            value={ns}
                                            onChange={(e) => setNS(e.target.value)}
                                            placeholder="Numéro de Série"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="immo">Immo</InputLabel>
                                        <Input
                                            id="immo"
                                            value={immo}
                                            onChange={(e) => setImmo(e.target.value)}
                                            placeholder="Immo"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="etat">État</InputLabel>
                                        <Select
                                            id="etat"
                                            value={etat}
                                            onChange={(e) => setEtat(e.target.value)}
                                            label="État"
                                        >
                                            <MenuItem value="Bien">Bien</MenuItem>
                                            <MenuItem value="Hors Service">Hors Service</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="connectionType">Type de Connexion</InputLabel>
                                        <Input
                                            id="connectionType"
                                            value={connectionType}
                                            onChange={(e) => setConnectionType(e.target.value)}
                                            placeholder="Type de Connexion"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="ipAddress">Adresse IP</InputLabel>
                                        <Input
                                            id="ipAddress"
                                            value={ipAddress}
                                            onChange={(e) => setIPAddress(e.target.value)}
                                            placeholder="Adresse IP"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="ram">RAM</InputLabel>
                                        <Input
                                            id="ram"
                                            value={ram}
                                            onChange={(e) => setRam(e.target.value)}
                                            placeholder="RAM"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid container justifyContent="flex-end">
                                <Grid item>
                         <Button variant="contained"  type="submit"   style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                         enregistrer
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

export default Emodifier;