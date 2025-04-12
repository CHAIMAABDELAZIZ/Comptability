import pool from '../config/db.js';

export const addIntervention = async (req, res) => {
    const { userId, nature, otherNature, equipment, otherEquipment, solution, brand, assetNumber, report } = req.body;

    console.log('Données reçues:', req.body); // Pour vérifier les données reçues

    if (!userId) {
        return res.status(400).json({ message: 'ID utilisateur manquant' });
    }

    try {
        const query = `INSERT INTO Interventions (userId, nature, otherNature, equipment, otherEquipment, solution, brand, assetNumber, report)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [
            userId,
            nature,
            otherNature || null,  // Assurez-vous que 'otherNature' est bien vérifié ici
            equipment,
            otherEquipment || null,  // Assurez-vous que 'otherEquipment' est bien vérifié ici
            solution,
            brand,
            assetNumber,
            report,
        ]);

        res.status(201).json({ message: 'Intervention ajoutée avec succès', id: result.insertId });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'intervention:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'intervention', error });
    }
};


// Obtenir une intervention par ID
export const getInterventionById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM Interventions WHERE id = ?';
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Intervention non trouvée' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'intervention', error });
    }
};

// Mettre à jour une intervention
export const updateIntervention = async (req, res) => {
    const { id } = req.params;
    const { nature, otherNature, equipment, otherEquipment, solution, brand, assetNumber, report } = req.body;

    try {
        const query = `UPDATE Interventions
                       SET nature = ?, otherNature = ?, equipment = ?, otherEquipment = ?, solution = ?, brand = ?, assetNumber = ?, report = ?
                       WHERE id = ?`;
        const [result] = await pool.query(query, [
            nature,
            otherNature,
            equipment,
            otherEquipment,
            solution,
            brand,
            assetNumber,
            report,
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Intervention non trouvée pour mise à jour' });
        }

        res.json({ message: 'Intervention mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'intervention', error });
    }
};

// Supprimer une intervention
export const deleteIntervention = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM Interventions WHERE id = ?';
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Intervention non trouvée pour suppression' });
        }

        res.json({ message: 'Intervention supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'intervention', error });
    }
};


export const getInterventionsByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'ID utilisateur manquant' });
    }

    try {
        const query = 'SELECT * FROM Interventions WHERE userId = ?';
        const [rows] = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucune intervention trouvée pour cet utilisateur' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des interventions:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des interventions', error });
    }
};

export const getAllInterventions = async (req, res) => {
    try {
        const query = 'SELECT i.id, i.nature, u.username, i.solution, i.brand, i.assetNumber FROM Interventions i JOIN Users u ON i.userId = u.id';
        const [rows] = await pool.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucune intervention trouvée' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des interventions:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des interventions', error });
    }
};
