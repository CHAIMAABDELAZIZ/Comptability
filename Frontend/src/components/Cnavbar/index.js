import "./Cnavbar.css";
import Person2Icon from '@mui/icons-material/Person2';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cnavbar = () => {

    const [username, setUsername] = useState(''); // État pour stocker le nom d'utilisateur
    const [error, setError] = useState(''); // État pour gérer les erreurs

    // Fonction pour récupérer l'utilisateur actuel à partir de l'ID utilisateur
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

        fetchUsername();
    }, []);


    return (
        <div className="navbar">
            <div className="wrapper">
            <div className="search">
            <SearchIcon className="searchIcon" />
                    <input type="text" placeholder="Search Anything Here... " className="searchInput" />
                </div>
                <div className="items">
                    <div className="item">
                    {username} 
                    </div>
                     <div>
                     <Person2Icon className="icon"/>
                     </div>
                </div>
            </div>
            {error && <p className="error">{error}</p>} {/* Affiche un message d'erreur si nécessaire */}
        </div>
    );
};

export default Cnavbar;