import React, { useEffect, useState } from 'react';
import './Cwidget.css';
import { Link } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import axios from 'axios';

const Cwidget = ({ type }) => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalEquipments, setTotalEquipments] = useState(0);
    const [totalInterventions, setTotalInterventions] = useState(0); // New state for interventions
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (type === "Users") {
                try {
                    const response = await axios.get('http://localhost:8000/all/users');
                    setTotalUsers(response.data.length);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error);
                }
            } else if (type === "places") {
                try {
                    const response = await axios.get('http://localhost:8000/equipements/all/equip');
                    setTotalEquipments(response.data.length);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nombre d\'équipements:', error);
                }
            } else if (type === "Intervention") {
                try {
                    const response = await axios.get('http://localhost:8000/interventions/all/interventions');
                    setTotalInterventions(response.data.length);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nombre d\'interventions:', error);
                }
            }
        };

        fetchData();
    }, [totalUsers,totalEquipments,totalInterventions,type]);

    useEffect(() => {
        switch (type) {
            case "places":
                setData({
                    title: "Nombre Totale Des Projets",
                    Number: totalEquipments,
                    link1: "Voir tous les projets",
                    icon: (
                        <PersonOutlinedIcon
                            className="icon"
                            style={{
                                color: "crimson",
                                backgroundColor: "rgba(255, 0, 0, 0.2)",
                            }}
                        />
                    ),
                });
                break;
            case "Users":
                setData({
                    title: "Nombre Totale Des Utilisateurs",
                    Number: totalUsers,
               
                    icon: (
                        <PersonOutlinedIcon
                            className="icon"
                            style={{
                                backgroundColor: "rgba(218, 165, 32, 0.2)",
                                color: "goldenrod",
                            }}
                        />
                    ),
                });
                break;
            case "Intervention":  // New case for interventions
                setData({
                    title: "Nombre Totale Des Interventions",
                    Number: totalInterventions,
                    link: "Voir toutes les interventions",
                    icon: (
                        <PersonOutlinedIcon
                            className="icon"
                            style={{
                                backgroundColor: "rgba(0, 128, 128, 0.2)",
                                color: "teal",
                            }}
                        />
                    ),
                });
                break;
            default:
                break;
        }
    }, [totalUsers, totalEquipments, totalInterventions, type]);

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span>{data.desc}</span>
                <span className="counter">
                    {data.Number}
                </span>
                <span className="link">
                    <Link to="/all/interventions" style={{ textDecoration: "none" }}>
                        {data.link}
                    </Link>
                    <Link to="/equip" style={{ textDecoration: "none" }}>
                    {data.link1}
                    </Link>
                   
                </span>
            </div>
            <div className="right">
                {data.icon}
            </div>
        </div>
    );
};

export default Cwidget;
