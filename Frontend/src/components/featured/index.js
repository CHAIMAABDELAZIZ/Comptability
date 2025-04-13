import React, { useEffect, useState } from 'react';
import './Featured.css';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';

const Featured = () => {
    const [pourcentageRentable, setPourcentageRentable] = useState(0);

    useEffect(() => {
        // On récupère les projets depuis l'API
        axios.get("http://localhost:8000/equipements/all/equip")
            .then(response => {
                const projets = response.data;
                const totalProjets = projets.length;

                // On compte le nombre de projets rentables
                const projetsRentables = projets.filter(projet => parseFloat(projet.van) > 0);

                // Calcul du pourcentage de projets rentables
                const pourcentage = (projetsRentables.length / totalProjets) * 100;

                // Mise à jour du state avec le pourcentage
                setPourcentageRentable(pourcentage);
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
                <div className="featuredChart">
                    <CircularProgressbar
                        value={pourcentageRentable}
                        text={`${Math.round(pourcentageRentable)}%`}
                        strokeWidth={5}
                    />
                </div>
                <p className="title">Total des Projets rentables</p>
            </div>
        </div>
    );
};

export default Featured;
