import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Input, Button, Grid } from '@mui/material';
import Csidemenu from "../../../components/Csidemenu";
import Cnavbar from "../../../components/Cnavbar";
import './Enew.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Enew = () => {
    const [username, setUsername] = useState('');
    const [cashflows, setCashflows] = useState([]);
    const [date_debut, setDateDebut] = useState('');
    const [description, setDescription] = useState('');
    const [duree, setDuree] = useState('');
    const [investissement, setInvestissement] = useState('');
    const [nom_projet, setNomProjet] = useState('');
    const [taux_actualisation, setTauxActualisation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('Utilisateur non authentifié.');
            return;
        }


        const fetchUsername = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/${userId}`);
                setUsername(response.data.username);
            } catch (err) {
                setError("Erreur lors de la récupération du nom d’utilisateur.");
            }
        };


        fetchUsername();
    }, []);


    const handleCashflowChange = (index, value) => {
        const updatedCashflows = [...cashflows];
        updatedCashflows[index] = value;
        setCashflows(updatedCashflows);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        const material = {
            username,
            cashflows,
            date_debut,
            description,
            duree,
            investissement,
            nom_projet,
            taux_actualisation,
        };


        try {
            const response = await axios.post("http://localhost:8000/equipements/", material);


            if (response.status === 201 && response.data.id) {
                const id = response.data.id;
                console.log("ID reçu du backend:", id);
                navigate('/result', { state: { projetId: id } });
            } else {
                setError("Erreur lors de l'ajout du matériel.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête:", error);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };


    return (
        <div className="new">
            <Csidemenu />
            <div className="newContainer">
                <Cnavbar />
                <div className="top">
                    <h1 style={{ color: '#84A5C4' }}>AJOUTER UN NOUVEAU MATÉRIEL</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4.5}>
                                {/* Username (readonly) */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled>
                                        <InputLabel htmlFor="username">Nom d'utilisateur</InputLabel>
                                        <Input id="username" value={username} placeholder="Nom d'utilisateur" />
                                    </FormControl>
                                </Grid>


                                {/* Date de début */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel shrink htmlFor="date_debut">Date de début</InputLabel>
                                        <Input
                                            id="date_debut"
                                            type="date"
                                            value={date_debut}
                                            onChange={(e) => setDateDebut(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Description */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="description">Description</InputLabel>
                                        <Input
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Description"
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Durée */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="duree">Durée</InputLabel>
                                        <Input
                                            id="duree"
                                            type="number"
                                            value={duree}
                                            onChange={(e) => setDuree(e.target.value)}
                                            placeholder="Durée"
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Investissement */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="investissement">Investissement</InputLabel>
                                        <Input
                                            id="investissement"
                                            type="number"
                                            value={investissement}
                                            onChange={(e) => setInvestissement(e.target.value)}
                                            placeholder="Investissement"
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Taux d'actualisation */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="taux_actualisation">Taux d'actualisation</InputLabel>
                                        <Input
                                            id="taux_actualisation"
                                            type="number"
                                            value={taux_actualisation}
                                            onChange={(e) => setTauxActualisation(e.target.value)}
                                            placeholder="Taux d'actualisation"
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Nom du projet */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="nom_projet">Nom du projet</InputLabel>
                                        <Input
                                            id="nom_projet"
                                            value={nom_projet}
                                            onChange={(e) => setNomProjet(e.target.value)}
                                            placeholder="Nom du projet"
                                        />
                                    </FormControl>
                                </Grid>


                                {/* Cashflows */}
                                {Array.from({ length: parseInt(duree) || 0 }).map((_, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <FormControl fullWidth required>
                                            <InputLabel htmlFor={`cashflow-${index}`}>{`Cashflow ${index + 1}`}</InputLabel>
                                            <Input
                                                id={`cashflow-${index}`}
                                                type="number"
                                                value={cashflows[index] || ''}
                                                onChange={(e) => handleCashflowChange(index, e.target.value)}
                                                placeholder={`Cashflow ${index + 1}`}
                                            />
                                        </FormControl>
                                    </Grid>
                                ))}


                                {/* Bouton de soumission */}
                                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            style={{ backgroundColor: '#4caf50', color: '#fff' }}
                                        >
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


export default Enew;



