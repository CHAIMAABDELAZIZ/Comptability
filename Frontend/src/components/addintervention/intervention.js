import React, { useState } from 'react';
import './intervention.scss'; // Assurez-vous que le fichier SCSS est bien importé

const InterventionForm = () => {
    const [nature, setNature] = useState([]);
    const [equipement, setEquipement] = useState([]);
    const [solution, setSolution] = useState([]);
    const [otherNature, setOtherNature] = useState('');
    const [otherEquipment, setOtherEquipment] = useState('');
    const [brand, setBrand] = useState('');
    const [assetNumber, setAssetNumber] = useState('');
    const [report, setReport] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCheckboxChange = (e, setFunction, stateArray) => {
        const { value, checked } = e.target;
        setFunction((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        console.log('ID utilisateur récupéré:', userId);

        if (!userId) {
            setError('Utilisateur non authentifié.');
            return;
        }

        // Construction des données à envoyer
        const formData = {
            userId: parseInt(userId),
            nature: nature.includes('otherNature') && otherNature ? otherNature : nature.join(', '),
            otherNature: otherNature || null, // Ajoutez cette ligne pour inclure 'otherNature'
            equipment: equipement.includes('otherEquipment') && otherEquipment ? otherEquipment : equipement.join(', '),
            otherEquipment: otherEquipment || null, // Ajoutez cette ligne pour inclure 'otherEquipment'
            solution: solution.join(', '),
            brand: brand,
            assetNumber: assetNumber,
            report: report,
        };


        console.log('Données envoyées:', formData);

        try {
            const response = await fetch('http://localhost:8000/intervention', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess('Intervention ajoutée avec succès');
                // Réinitialiser les états ici
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erreur lors de l\'ajout');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };


    return (
        <div className="intervention-form">
            <h1>Ajouter une Intervention</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Nature de l'intervention :</h3>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="reconfiguration"
                                checked={nature.includes('reconfiguration')}
                                onChange={(e) => handleCheckboxChange(e, setNature, nature)}
                            />
                            reconfiguration
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="installation" // Correction ici
                                checked={nature.includes('installation')}
                                onChange={(e) => handleCheckboxChange(e, setNature, nature)}
                            />
                            installation
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="extension"
                                checked={nature.includes('extension')}
                                onChange={(e) => handleCheckboxChange(e, setNature, nature)}
                            />
                            extension
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="otherNature"
                                checked={nature.includes('otherNature')}
                                onChange={(e) => handleCheckboxChange(e, setNature, nature)}
                            />
                            autre
                        </label>
                        {nature.includes('otherNature') && (
                            <input
                                type="text"
                                placeholder="Précisez la nature"
                                value={otherNature}
                                onChange={(e) => setOtherNature(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Matériel affecté :</h3>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="ordinateur"
                                checked={equipement.includes('ordinateur')}
                                onChange={(e) => handleCheckboxChange(e, setEquipement, equipement)}
                            />
                            Ordinateur
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="imprimante"
                                checked={equipement.includes('imprimante')}
                                onChange={(e) => handleCheckboxChange(e, setEquipement, equipement)}
                            />
                            Imprimante
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="scanner"
                                checked={equipement.includes('scanner')}
                                onChange={(e) => handleCheckboxChange(e, setEquipement, equipement)}
                            />
                            Scanner
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="otherEquipment"
                                checked={equipement.includes('otherEquipment')}
                                onChange={(e) => handleCheckboxChange(e, setEquipement, equipement)}
                            />
                            autre
                        </label>
                        {equipement.includes('otherEquipment') && (
                            <input
                                type="text"
                                placeholder="Précisez le matériel"
                                value={otherEquipment}
                                onChange={(e) => setOtherEquipment(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Solution utilisée :</h3>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="Active Directory AV"
                                checked={solution.includes('Active Directory AV')}
                                onChange={(e) => handleCheckboxChange(e, setSolution, solution)}
                            />
                            Active Directory AV
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="file dattente"
                                checked={solution.includes('file dattente')}
                                onChange={(e) => handleCheckboxChange(e, setSolution, solution)}
                            />
                            file d'attente
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="antivirus Kaspersky"
                                checked={solution.includes('antivirus Kaspersky')}
                                onChange={(e) => handleCheckboxChange(e, setSolution, solution)}
                            />
                            antivirus Kaspersky
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                value="voucher"
                                checked={solution.includes('voucher')}
                                onChange={(e) => handleCheckboxChange(e, setSolution, solution)}
                            />
                            voucher
                        </label>
                    </div>
                </div>

                <div className="form-section">
                    <label htmlFor="brand">Marque du matériel :</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="assetNumber">NS/IMMO du matériel :</label>
                    <input
                        type="text"
                        id="assetNumber"
                        name="assetNumber"
                        value={assetNumber}
                        onChange={(e) => setAssetNumber(e.target.value)}
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="report">Compte rendu de l'intervention :</label>
                    <textarea
                        id="report"
                        name="report"
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                    />
                </div>

                <button type="submit" className="submit-button">Soumettre</button>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
};

export default InterventionForm;
