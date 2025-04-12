import pool from '../config/db.js';
import { addEquip,updateEquip,deleteEquip, getEquipById } from '../models/equipModel.js';

export const fetchAllEquipments= async (req, res) => {
    try {
        const query = 'SELECT * FROM materials'; 
        const [materials] = await pool.query(query);

        if (materials.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }

        res.json(materials);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
};

export const createequip = async (req, res) => {
    console.log('Requête reçue :', req.body);
    let {
        cashflows,
        date_debut,
        description,
        duree,
        investissement,
        nom_projet,
        taux_actualisation,
        username
    } = req.body;

    // Vérifications de base
    if (!cashflows || !date_debut || !description || !duree || !investissement || !nom_projet || !taux_actualisation || !username) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Vérification de la date
    if (isNaN(Date.parse(date_debut))) {
        return res.status(400).json({ message: "La date de début est invalide." });
    }

    // Parsing des cashflows si besoin
    if (typeof cashflows === 'string') {
        try {
            cashflows = JSON.parse(cashflows);
        } catch (error) {
            return res.status(400).json({ message: "Le format de cashflows est invalide (doit être JSON valide)." });
        }
    }

    // Calculs
    const r = parseFloat(taux_actualisation) / 100;
    const I0 = parseFloat(investissement);

    let van = -I0;
    let rbc_num = 0;
    let tri = null;
    let delai_recup = null;
    let cumul = 0;

    // Calcul de VAN, RBC, délai de récupération
    for (let t = 0; t < cashflows.length; t++) {
        const cf = parseFloat(cashflows[t]);
        const actualized = cf / Math.pow(1 + r, t + 1);
        van += actualized;
        rbc_num += actualized;

        cumul += cf;
        if (delai_recup === null && cumul >= I0) {
            delai_recup = t + 1;
        }
    }

    const rbc = rbc_num !== 0 ? rbc_num / I0 : 0;

    // Approche simple du TRI par itérations (peut être améliorée avec algo de Newton-Raphson)
    function computeTRI(cashflows, investissement, precision = 0.00001, maxIter = 1000) {
        let low = -0.99;  // Pour accepter les cas où TRI est négatif
        let high = 1.0;
        let iter = 0;

        while (iter < maxIter) {
            const mid = (low + high) / 2;
            const npv = calculateNPV(cashflows, mid) - investissement;

            if (Math.abs(npv) < precision) {
                return mid * 100; // En pourcentage
            }

            if (npv > 0) {
                low = mid;
            } else {
                high = mid;
            }

            iter++;
        }

        return null; // Impossible de trouver un TRI
    }

    function calculateNPV(cashflows, rate) {
        let npv = 0;
        for (let t = 0; t < cashflows.length; t++) {
            npv += cashflows[t] / Math.pow(1 + rate, t + 1);
        }
        return npv;
    }


    tri = computeTRI(cashflows, I0);

    try {
        const [userExists] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (userExists.length === 0) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const result = await addEquip(
            JSON.stringify(cashflows),
            date_debut,
            description,
            delai_recup,
            duree,
            investissement,
            nom_projet,
            rbc.toFixed(2),
            taux_actualisation,
            tri,
            van.toFixed(2),
            username
        );

        res.status(201).json({ message: "Matériel créé avec succès", id: result.insertId });
    } catch (error) {
        console.error('Erreur lors de la création de l\'équipement :', error);
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};


// Update equipment
export const updateEquipDetails = async (req, res) => {
    const { id } = req.params;
    const { type, mark, model, connection_type, ip_address, username,ns, immo, ram, etat } = req.body;
    console.log('Received data:', req.body);
    try {
        await updateEquip(id, type, mark, model, connection_type, ip_address, username,ns, immo, ram, etat);
        res.json({ message: "Equipment updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating equipment", error });
    }
};

//delete function 
export const deleteEquipById = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteEquip(id);
        res.json({ message: "Equipment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting equipment", error });
    }
};

export const getEquip = async (req, res) => {
    const { id } = req.params;
    try {
        const equip = await getEquipById(id);
        if (!equip) {
            return res.status(404).json({ message: "Equipement non trouvé" });
        }
        res.json(equip);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'equipement", error });
    }
};

export const getEquipementsByUsername = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Nom d’utilisateur manquant' });
    }

    try {
        const query = 'SELECT * FROM materials WHERE username = ?';
        const [rows] = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun équipement trouvé pour cet utilisateur' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des équipements:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des équipements', error });
    }
};
