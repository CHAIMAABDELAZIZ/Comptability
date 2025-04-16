import React, { useEffect, useState } from 'react';
import './graph1.css';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const Graph1 = () => {
    const [investissementsPerProjet, setInvestissementsPerProjet] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/equipements/all/equip")
            .then(response => {
                const projets = response.data;
                console.log("Projets récupérés:", projets);

                const investissementData = [];

                projets.forEach(projet => {
                    try {
                        console.log(`Traitement du projet: ${projet.nom_projet}`);

                        // Assumons que l'investissement est dans un champ "investissement"
                        let investissement = projet.investissement;
                        console.log(`Investissement pour le projet ${projet.nom_projet}:`, investissement);

                        if (!isNaN(investissement)) { // Vérifie que l'investissement est un nombre
                            investissementData.push({
                                nom_projet: projet.nom_projet,
                                investissement: parseFloat(investissement) // Ajouter l'investissement à notre tableau de données
                            });
                        } else {
                            console.error(`Investissement invalide pour le projet ${projet.nom_projet}: ${investissement}`);
                        }
                    } catch (err) {
                        console.error("Erreur générale pour le projet :", projet.nom_projet, err);
                    }
                });

                console.log("Données formatées pour le graphique:", investissementData);
                setInvestissementsPerProjet(investissementData);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des projets :", error);
            });
    }, []);

    return (
        <div className='featured'>
            <div className='top'>
                <h1 className='title'>Investissements des différents projets</h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className='bottom'>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={investissementsPerProjet}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nom_projet" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="investissement" fill="#20396E" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Graph1;
