import React from 'react';
import './Model.css';

const EquipmentDetailsModal = ({ open, onClose, equipment }) => {
    if (!open || !equipment) return null;

    return (
        <div className="overlay">
            <div className="modalContainer">
                <img src="hello.png" alt="Logo" className="modalLogo" />
                <h1>Détails du projet</h1>
                <div className="equipmentGrid">
                    <div className="equipmentItem"><b>ID :</b> {equipment.id}</div>
                    <div className="equipmentItem"><b>Nom du projet :</b> {equipment.nom_projet}</div>
                    <div className="equipmentItem"><b>Description :</b> {equipment.description}</div>
                    <div className="equipmentItem"><b>Investissement (€) :</b> {equipment.investissement}</div>
                    <div className="equipmentItem"><b>Date de début :</b> {equipment.date_debut}</div>
                    <div className="equipmentItem"><b>Durée (mois) :</b> {equipment.duree}</div>
                    <div className="equipmentItem"><b>Délai de récupération :</b> {equipment.delai_recup}</div>
                    <div className="equipmentItem"><b>Taux d'actualisation (%) :</b> {equipment.taux_actualisation}</div>
                    <div className="equipmentItem"><b>VAN (€) :</b> {equipment.van}</div>
                    <div className="equipmentItem"><b>TRI (%) :</b> {equipment.tri}</div>
                    <div className="equipmentItem"><b>RBC :</b> {equipment.rbc}</div>
                    <div className="equipmentItem"><b>Cashflows :</b> {equipment.cashflows}</div>
                    <div className="equipmentItem"><b>Ajouté par :</b> {equipment.username}</div>
                </div>
                <div className="button" onClick={onClose}>Fermer</div>
            </div>
        </div>
    );
};

export default EquipmentDetailsModal;
