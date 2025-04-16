import "./resultInvest.css";
import CsideMenu from "../../components/Csidemenu";
import Cnavbar from "../../components/Cnavbar";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid
} from "recharts";

const TAUX_ACTUALISATION = 10;

const ResultInvest = () => {
    const location = useLocation();
    const projetId = location.state?.projetId;
    const [equipement, setEquipement] = useState(null);
    const [cashflowsParsed, setCashflowsParsed] = useState([]);
    const [cashflowsActualises, setCashflowsActualises] = useState([]);

    useEffect(() => {
        if (projetId) {
            axios.get(`http://localhost:8000/equipements/${projetId}`)
                .then(response => {
                    setEquipement(response.data);

                    try {
                        const cleanedCashflows = response.data.cashflows
                            .replace(/\\\"/g, '"')
                            .replace(/^"|"$/g, '');

                        const cashflows = JSON.parse(cleanedCashflows);

                        const formatted = cashflows.map((value, index) => ({
                            name: `Année ${index + 1}`,
                            CashFlow: Number(value)
                        })).filter(obj => !isNaN(obj.CashFlow));

                        setCashflowsParsed(formatted);

                        const actualised = formatted.map((item, i) => ({
                            name: item.name,
                            CashFlowActualise: +(item.CashFlow / Math.pow(1 + TAUX_ACTUALISATION / 100, i + 1)).toFixed(2)
                        }));

                        setCashflowsActualises(actualised);
                    } catch (err) {
                        console.error("Erreur parsing cashflows :", response.data.cashflows, err);
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération de l'équipement :", error);
                });
        } else {
            console.warn("Aucun projetId fourni à la page ResultInvest.");
        }
    }, [projetId]);

    const getTextColor = (condition) => (condition ? "green" : "red");

    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <div className="maindiv">
                    <p className="title">Analyse de rentabilité du projet</p>

                    {equipement && (
                        <div className="projectFlex">
                            <div className="projectBox">
                                <h4>Nom du projet</h4>
                                <p>{equipement.nom_projet}</p>
                            </div>
                            <div className="projectBox">
                                <h4>Description</h4>
                                <p>{equipement.description}</p>
                            </div>
                            <div className="projectBox">
                                <h4>Date de début</h4>
                                <p>{equipement.date_debut}</p>
                            </div>
                            <div className="projectBox">
                                <h4>Investissement</h4>
                                <p>{equipement.investissement} €</p>
                            </div>
                        </div>
                    )}

                    {/* Graphiques */}
                    <div className="chartFlex">

                        {/* Graphe 1 */}
                        <div className="chartBox">
                            <h3>Revenus vs Coûts cumulés</h3>
                            <p>Visualisation de l'accumulation des revenus et des coûts dans le temps.</p>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart
                                    data={cashflowsParsed.map((item, index) => {
                                        const revenus = cashflowsParsed
                                            .slice(0, index + 1)
                                            .reduce((acc, val) => acc + (val.CashFlow > 0 ? val.CashFlow : 0), 0);
                                        const couts = cashflowsParsed
                                            .slice(0, index + 1)
                                            .reduce((acc, val) => acc + (val.CashFlow < 0 ? -val.CashFlow : 0), 0);

                                        return {
                                            name: item.name,
                                            Revenus: revenus,
                                            Coûts: couts
                                        };
                                    })}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Revenus" stroke="#4ade80" />
                                    <Line type="monotone" dataKey="Coûts" stroke="#f87171" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Graphe 2 */}
                        <div className="chartBox">
                            <h3>Évolution des Cashflows</h3>
                            <p>Affiche les gains ou pertes nets générés chaque année par le projet.</p>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={cashflowsParsed}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="CashFlow" fill="#60a5fa" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Graphe 3 */}
                        <div className="chartBox">
                            <h3>Cashflows actualisés</h3>
                            <p>Les flux de trésorerie ajustés en fonction du taux d’actualisation de {TAUX_ACTUALISATION}%.</p>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={cashflowsActualises}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="CashFlowActualise" stroke="#facc15" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                    </div>

                    {/* Résultats d'analyse */}
                    {equipement && (
                        <>
                            <div className="resultatFlex">
                                <div className="resultBox">
                                    <h4>Valeur Actuelle Nette (VAN)</h4>
                                    <p style={{ color: getTextColor(equipement.van > 0) }}>
                                        VAN = {equipement.van} € — {equipement.van > 0
                                            ? "✅ VAN > 0 : Le projet est rentable."
                                            : "❌ VAN < 0 : Le projet risque de détruire de la valeur."}
                                    </p>
                                    <p>La VAN montre si les flux futurs compensent l'investissement initial après actualisation.</p>
                                </div>
                                <div className="resultBox">
                                    <h4>Taux de Rendement Interne (TRI)</h4>
                                    <p style={{ color: getTextColor(equipement.tri > TAUX_ACTUALISATION) }}>
                                        TRI = {equipement.tri}% — {equipement.tri > TAUX_ACTUALISATION
                                            ? `✅ TRI > ${TAUX_ACTUALISATION}% : Rentable.`
                                            : `❌ TRI < ${TAUX_ACTUALISATION}% : Non rentable.`}
                                    </p>
                                    <p>Le TRI est le taux d'intérêt auquel le projet équilibre ses coûts et bénéfices actualisés.</p>
                                </div>
                            </div>

                            <div className="resultatFlex">
                                <div className="resultBox">
                                    <h4>Délai de récupération</h4>
                                    <p style={{ color: getTextColor(equipement.delai_recup <= 3) }}>
                                        Délai = {equipement.delai_recup} ans — {equipement.delai_recup <= 3
                                            ? "⏱️ ≤ 3 ans : récupération rapide."
                                            : "⚠️ > 3 ans : récupération lente."}
                                    </p>
                                    <p>Temps nécessaire pour récupérer l’investissement initial grâce aux cashflows.</p>
                                </div>
                                <div className="resultBox">
                                    <h4>Benefit-Cost Ratio (BCR)</h4>
                                    <p style={{ color: getTextColor(equipement.rbc > 1) }}>
                                        BCR = {equipement.rbc} — {equipement.rbc > 1
                                            ? "✅ BCR > 1 : Projet rentable."
                                            : "❌ BCR < 1 : Projet non rentable."}
                                    </p>
                                    <p>Le BCR compare les bénéfices et les coûts pour déterminer la rentabilité globale.</p>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ResultInvest;
