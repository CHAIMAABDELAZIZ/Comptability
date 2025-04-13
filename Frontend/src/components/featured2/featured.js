import React, { useEffect, useState } from 'react';
import '../featured/Featured.css';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const Featured2 = () => {
    const [pourcentageRentable, setPourcentageRentable] = useState(0);
    const [vanTotal, setVanTotal] = useState(0);
    const [vanParAnnee, setVanParAnnee] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/equipements/all/equip")
            .then(response => {
                const projets = response.data;
                const totalProjets = projets.length;

                // Projets rentables
                const projetsRentables = projets.filter(projet => parseFloat(projet.van) > 0);
                const pourcentage = (projetsRentables.length / totalProjets) * 100;
                setPourcentageRentable(pourcentage);

                // Cumul des VAN
                let totalVAN = 0;
                const vanParAnneeTemp = {};

                projets.forEach(projet => {
                    const van = parseFloat(projet.van);
                    const annee = new Date(projet.date_debut).getFullYear();

                    if (!isNaN(van)) {
                        totalVAN += van;
                        if (!vanParAnneeTemp[annee]) {
                            vanParAnneeTemp[annee] = 0;
                        }
                        vanParAnneeTemp[annee] += van;
                    }
                });

                setVanTotal(totalVAN);

                // Convertir en tableau pour le graphique
                const data = Object.entries(vanParAnneeTemp).map(([annee, total]) => ({
                    annee,
                    totalVAN: total
                }));

                setVanParAnnee(data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des projets :", error);
            });
    }, []);

    return (
        <div className='featured'>
            <div className='top'>
                <h1 className='title'>Statistiques</h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className='bottom'>
                <div style={{ width: '100%', height: 300, marginTop: 0 }}>
                    <h3 style={{ textAlign: 'center' }}>VAN cumulée par année</h3>
                    <ResponsiveContainer>
                        <BarChart data={vanParAnnee}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="annee" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalVAN" fill="#4caf50" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Featured2;
