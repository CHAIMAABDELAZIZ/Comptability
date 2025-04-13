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
const TAUX_ACTUALISATION = 10;

const ResultInvest = () => {
    const location = useLocation();
    const projetId = location.state?.projetId; // 👈 récupère le projet ID envoyé via navigate()
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
                            ROI: Number(value)
                        })).filter(obj => !isNaN(obj.ROI)); // Filtrer NaN
                        setCashflowsParsed(formatted);
                    } catch (err) {
                        console.error("Erreur parsing cashflows :", err);
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
                        <div className="infoBloc">
                            <p><strong>Nom du projet :</strong> {equipement.nom_projet}</p>
                            <p><strong>Description :</strong> {equipement.description}</p>
                            <p><strong>Date de début :</strong> {equipement.date_debut}</p>
                            <p><strong>Montant de l'investissement :</strong> {equipement.investissement} €</p>
                        </div>
                    )}

                    {/* Graphiques */}
                    <div className="chartFlex">
                        <div className="chartBox">
                            <h3>Répartition budgétaire (exemple)</h3>
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
                            <h3>Évolution des cashflows annuels</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={cashflowsParsed}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ROI" fill="#4ade80" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                   {/* Résultats d'analyse */}
{equipement && (
    <div className="resultatFlex">
        <div className="resultBox">
            <h4>Valeur Actuelle Nette (VAN)</h4>
            <p style={{ color: getTextColor(equipement.van > 0) }}>
                VAN = {equipement.van} € — {equipement.van > 0
                    ? "✅ VAN > 0 : Le projet est rentable."
                    : "❌ VAN < 0 : Le projet risque de détruire de la valeur."}
            </p>
            <p>
                La VAN permet de savoir si les flux de trésorerie futurs actualisés couvrent l'investissement initial.
            </p>
        </div>

        <div className="resultBox">
            <h4>Taux de Rendement Interne (TRI)</h4>
            <p style={{ color: getTextColor(equipement.tri > TAUX_ACTUALISATION) }}>
                TRI = {equipement.tri}% — {equipement.tri > TAUX_ACTUALISATION
                    ? `✅ TRI > ${TAUX_ACTUALISATION}% : Rentable.`
                    : `❌ TRI < ${TAUX_ACTUALISATION}% : Non rentable.`}
            </p>
            <p>
                Le TRI représente la rentabilité réelle du projet. Plus il est élevé, plus le projet est attractif.
            </p>
        </div>
    </div>
)}

{equipement && (
    <div className="resultatFlex">
        <div className="resultBox">
            <h4>Délai de récupération</h4>
            <p style={{ color: getTextColor(equipement.delai_recup <= 3) }}>
                Délai = {equipement.delai_recup} ans — {equipement.delai_recup <= 3
                    ? "⏱️ ≤ 3 ans : récupération rapide."
                    : "⚠️ > 3 ans : récupération lente."}
            </p>
            <p>
                Ce délai permet d'évaluer à quelle vitesse l'investissement initial est couvert par les retours générés.
            </p>
        </div>

        <div className="resultBox">
            <h4>Benefit-Cost Ratio (BCR)</h4>
            <p style={{ color: getTextColor(equipement.rbc > 1) }}>
                BCR = {equipement.rbc} — {equipement.rbc > 1
                    ? "✅ BCR > 1 : Projet rentable."
                    : "❌ BCR < 1 : Projet non rentable."}
            </p>
            <p>
                Le BCR compare les bénéfices actualisés aux coûts pour juger de la viabilité économique.
            </p>
        </div>
    </div>
)}

                </div>
            </div>
        </div>
    );
};

export default ResultInvest;

// import "./resultInvest.css";
// import CsideMenu from "../../components/Csidemenu";
// import Cnavbar from "../../components/Cnavbar";
// import { useLocation } from 'react-router-dom';
// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
// const TAUX_ACTUALISATION = 10;

// const ResultInvest = () => {
//     const location = useLocation();
//     const projetId = location.state?.projetId;
//     const [equipement, setEquipement] = useState(null);
//     const [cashflowsParsed, setCashflowsParsed] = useState([]);

//     useEffect(() => {
//         if (projetId) {
//             axios.get(`http://localhost:8000/equipements/${projetId}`)
//                 .then(response => {
//                     setEquipement(response.data);
//                     try {
//                         const cashflows = JSON.parse(response.data.cashflows);
//                         const formatted = cashflows.map((value, index) => ({
//                             name: `Année ${index + 1}`,
//                             ROI: Number(value)
//                         })).filter(obj => !isNaN(obj.ROI)); // Pour éviter NaN
//                         setCashflowsParsed(formatted);
//                     } catch (err) {
//                         console.error("Erreur parsing cashflows :", err);
//                     }
//                 })
//                 .catch(error => {
//                     console.error("Erreur lors de la récupération de l'équipement :", error);
//                 });
//         }
//     }, [projetId]);

//     const getTextColor = (condition) => (condition ? "green" : "red");

//     return (
//         <div className="list">
//             <CsideMenu />
//             <div className="listContainer">
//                 <Cnavbar />
//                 <div className="maindiv">
//                     <p className="title">Analyse de rentabilité du projet</p>

//                     {equipement && (
//                         <div className="infoBloc">
//                             <p><strong>Nom du projet :</strong> {equipement.nom_projet}</p>
//                             <p><strong>Description :</strong> {equipement.description}</p>
//                             <p><strong>Date de début :</strong> {equipement.date_debut}</p>
//                             <p><strong>Montant de l'investissement :</strong> {equipement.investissement} €</p>
//                         </div>
//                     )}

//                     {/* Graphiques */}
//                     <div className="chartFlex">
//                         <div className="chartBox">
//                             <h3>Répartition budgétaire (exemple)</h3>
//                             <ResponsiveContainer width="100%" height={250}>
//                                 <PieChart>
//                                     <Pie
//                                         data={[
//                                             { name: "Marketing", value: 300 },
//                                             { name: "Développement", value: 500 },
//                                             { name: "Opérations", value: 200 }
//                                         ]}
//                                         dataKey="value"
//                                         nameKey="name"
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={80}
//                                         label
//                                     >
//                                         {COLORS.map((color, index) => (
//                                             <Cell key={`cell-${index}`} fill={color} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>

//                         <div className="chartBox">
//                             <h3>Évolution des cashflows annuels</h3>
//                             <ResponsiveContainer width="100%" height={250}>
//                                 <BarChart data={cashflowsParsed}>
//                                     <XAxis dataKey="name" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="ROI" fill="#4ade80" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     {/* Résultats : VAN & TRI */}
//                     {equipement && (
//                         <div className="resultatFlex">
//                             <div className="resultBox">
//                                 <h4>Valeur Actuelle Nette (VAN)</h4>
//                                 <p style={{ color: getTextColor(equipement.van > 0) }}>
//                                     {equipement.van > 0
//                                         ? "✅ Le projet est rentable avec une VAN positive."
//                                         : "❌ VAN négative : le projet risque de détruire de la valeur."}
//                                 </p>
//                                 <p>
//                                     La VAN permet de savoir si les flux de trésorerie futurs actualisés couvrent l'investissement initial.
//                                 </p>
//                             </div>

//                             <div className="resultBox">
//                                 <h4>Taux de Rendement Interne (TRI)</h4>
//                                 <p style={{ color: getTextColor(equipement.tri > TAUX_ACTUALISATION) }}>
//                                     {equipement.tri > TAUX_ACTUALISATION
//                                         ? `✅ TRI de ${equipement.tri} % supérieur au taux d’actualisation (${TAUX_ACTUALISATION}%)`
//                                         : `❌ TRI inférieur au seuil de rentabilité de ${TAUX_ACTUALISATION}%`}
//                                 </p>
//                                 <p>
//                                     Le TRI représente la rentabilité réelle du projet. Plus il est élevé, plus le projet est attractif.
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Résultats : Délai & BCR */}
//                     {equipement && (
//                         <div className="resultatFlex">
//                             <div className="resultBox">
//                                 <h4>Délai de récupération</h4>
//                                 <p style={{ color: getTextColor(equipement.delai_recup <= 3) }}>
//                                     {equipement.delai_recup <= 3
//                                         ? "⏱️ Délai raisonnable : récupération en moins de 3 ans."
//                                         : "⚠️ Récupération lente : au-delà de 3 ans."}
//                                 </p>
//                                 <p>
//                                     Ce délai permet d'évaluer à quelle vitesse l'investissement initial est couvert par les retours générés.
//                                 </p>
//                             </div>

//                             <div className="resultBox">
//                                 <h4>Benefit-Cost Ratio (BCR)</h4>
//                                 <p style={{ color: getTextColor(equipement.rbc > 1) }}>
//                                     {equipement.rbc > 1
//                                         ? "✅ Rentable : les bénéfices dépassent les coûts (BCR > 1)"
//                                         : "❌ Non rentable : les coûts surpassent les gains (BCR < 1)"}
//                                 </p>
//                                 <p>
//                                     Le BCR est un indicateur synthétique qui mesure l'efficacité économique du projet.
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Interprétation générale */}
//                     <div className="interpretationFlex">
//                         <div className="interpretationBox">
//                             <h4>Analyse stratégique</h4>
//                             <p>
//                                 Les résultats montrent une bonne rentabilité globale. Le TRI dépasse le taux d’actualisation et le délai de récupération est raisonnable.
//                             </p>
//                         </div>
//                         <div className="interpretationBox">
//                             <h4>Recommandation</h4>
//                             <p>
//                                 Au vu des indicateurs, le projet semble viable économiquement. Il est recommandé de valider ce projet tout en suivant les cashflows de près.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ResultInvest;
