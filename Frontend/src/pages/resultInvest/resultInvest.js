import "./resultInvest.css";
import CsideMenu from "../../components/Csidemenu";
import Cnavbar from "../../components/Cnavbar";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const ResultInvest = () => {
    const location = useLocation();
    const projetId = location.state?.projetId;
    const [equipement, setEquipement] = useState(null);
    const [cashflowsParsed, setCashflowsParsed] = useState([]);

    useEffect(() => {
        if (projetId) {
            axios.get(`http://localhost:8000/equipements/${projetId}`)
                .then(response => {
                    setEquipement(response.data);

                    try {
                        const cashflows = JSON.parse(response.data.cashflows);
                        const formatted = cashflows.map((value, index) => ({
                            name: `Année ${index + 1}`,
                            ROI: parseFloat(value),
                        }));
                        setCashflowsParsed(formatted);
                    } catch (err) {
                        console.error("Erreur parsing cashflows :", err);
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de l'équipement :", error);
                });
        }
    }, [projetId]);

    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <div className="maindiv">
                    <p className="title">Le résultat de l'investissement</p>

                    {equipement && (
                        <div className="infoBloc">
                            <p><strong>Nom du projet :</strong> {equipement.nom_projet}</p>
                            <p><strong>Description :</strong> {equipement.description}</p>
                            <p><strong>Date de début :</strong> {equipement.date_debut}</p>
                            <p><strong>Investissement :</strong> {equipement.investissement} €</p>
                            <p><strong>VAN :</strong> {equipement.van} €</p>
                            <p><strong>TRI :</strong> {equipement.tri} %</p>
                            <p><strong>RBC :</strong> {equipement.rbc}</p>
                            <p><strong>Délai de récupération :</strong> {equipement.delai_recup} ans</p>
                        </div>
                    )}

                    <div className="chartFlex">
                        <div className="chartBox">
                            <h3>Répartition (statique)</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Marketing", value: 300 },
                                            { name: "Développement", value: 500 },
                                            { name: "Opérations", value: 200 }
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chartBox">
                            <h3>Cashflows par année</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={cashflowsParsed}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ROI" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="interpretationFlex">
                        <div className="interpretationBox">
                            <h4>Analyse des fonds</h4>
                            <p>
                                Une grande partie des fonds est consacrée au développement, soulignant une volonté d'amélioration continue.
                            </p>
                        </div>
                        <div className="interpretationBox">
                            <h4>Analyse des cashflows</h4>
                            <p>
                                L'évolution des cashflows permet d’évaluer la rentabilité du projet d’année en année. Les pics peuvent refléter une croissance significative.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultInvest;
