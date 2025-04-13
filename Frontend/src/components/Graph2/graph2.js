import React, { useEffect, useState } from 'react';
import '../graph1/graph1.css';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const Graph2 = () => {
    const [cashflowParAnnee, setCashflowParAnnee] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/equipements/all/equip")
            .then(response => {
                const projets = response.data;
                const cumulParAnnee = {};

                projets.forEach(projet => {
                    try {
                        // Nettoie la chaîne échappée avant de la parser
                        const cleanedCashflows = projet.cashflows
                            .replace(/\\\"/g, '"') // Remplace les guillemets échappés
                            .replace(/^"|"$/g, ''); // Enlève les guillemets externes

                        const cashflows = JSON.parse(cleanedCashflows); // transforme la chaîne JSON en array

                        cashflows.forEach((val, index) => {
                            const annee = `Année ${index + 1}`;
                            const valeur = parseFloat(val);

                            if (!isNaN(valeur)) {
                                cumulParAnnee[annee] = (cumulParAnnee[annee] || 0) + valeur;
                            }
                        });
                    } catch (err) {
                        console.error("Erreur lors du parsing des cashflows:", projet.cashflows, err);
                    }
                });

                const formattedData = Object.keys(cumulParAnnee).map(key => ({
                    annee: key,
                    total: cumulParAnnee[key]
                }));

                console.log("Cashflows cumulés par année :", formattedData);
                setCashflowParAnnee(formattedData);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des projets :", error);
            });
    }, []);

    return (
        <div className='featured'>
            <div className='top'>
                <h1 className='title'>Cashflows cumulés par année</h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className='bottom'>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cashflowParAnnee}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="annee" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Graph2;