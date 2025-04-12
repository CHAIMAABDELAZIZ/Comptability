import React, { useState, useEffect } from 'react';
import './Csidemenu.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import DevicesIcon from '@mui/icons-material/Devices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CsideMenu = () => {
    const [username, setUsername] = useState(''); // État pour stocker le nom d'utilisateur
    const [userRole, setUserRole] = useState(''); // État pour stocker le rôle de l'utilisateur
    const [error, setError] = useState(''); // État pour gérer les erreurs
    const navigate = useNavigate();

    // Fonction pour récupérer les informations de l'utilisateur actuel
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('ID utilisateur récupéré:', userId);

        if (!userId) {
            setError('Utilisateur non authentifié.');
            return;
        }

        // Requête pour récupérer les informations de l'utilisateur à partir de l'ID utilisateur
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/${userId}`);
                setUsername(response.data.username); // Nom d'utilisateur
                setUserRole(response.data.role); // Rôle de l'utilisateur (admin ou autre)
            } catch (err) {
                console.error('Erreur lors de la récupération des données utilisateur:', err);
                setError('Erreur lors de la récupération des données utilisateur.');
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Supprimez l'ID utilisateur du stockage local
        localStorage.removeItem('userId');
        navigate('/');
        window.history.replaceState(null, '', '/');
    };

    return (
        <div className="sidemenu">
            <div className="top">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <img src="/hello.png" alt="Logo" width="250" height="100" />
                </Link>
            </div>
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/home" style={{ textDecoration: 'none' }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Tableau de bord</span>
                        </li>
                    </Link>
                    <p className="title">LISTS</p>

                    {/* Afficher la liste des utilisateurs uniquement si l'utilisateur est admin */}
                    {userRole === 'admin' && (
                        <Link to="/adposts" style={{ textDecoration: 'none' }}>
                            <li>
                                <GroupIcon className="icon" />
                                <span>Utilisateurs</span>
                            </li>
                        </Link>
                    )}

                    <Link to="/equip" style={{ textDecoration: 'none' }}>
                        <li>
                            <DevicesIcon className="icon" />
                            <span>Équipements</span>
                        </li>
                    </Link>
                    <Link to="/all/interventions" style={{ textDecoration: 'none' }}>
                        <li>
                            <AssignmentIcon className="icon" />
                            <span>Interventions</span>
                        </li>
                    </Link>
                    <p className="title">SETTINGS</p>
                    <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <ExitToAppIcon className="icon" />
                        <span>Déconnexion</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                
            </div>
            {error && <p className="error">{error}</p>} {/* Affiche un message d'erreur si nécessaire */}
        </div>
    );
};

export default CsideMenu;