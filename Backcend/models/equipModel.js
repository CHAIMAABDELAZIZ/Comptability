import pool from '../config/db.js';

// Créer la table "materials" avec les nouveaux attributs
const createEquipTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS materials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cashflows TEXT,
      date_debut DATE,
      description TEXT,
      delai_recup INT,
      duree INT,
      investissement DECIMAL(15,2),
      nom_projet VARCHAR(100),
      rbc DECIMAL(15,2),
      taux_actualisation DECIMAL(5,2),
      tri DECIMAL(5,2),
      van DECIMAL(15,2),
      username VARCHAR(50)
    );
  `;
    await pool.query(query);
};

// Obtenir tous les projets
export const getAllEquipments = async () => {
    const query = `SELECT * FROM materials`;
    const [rows] = await pool.query(query);
    return rows;
};

// Ajouter un projet
export const addEquip = async (
    cashflows,
    date_debut,
    description,
    delai_recup,
    duree,
    investissement,
    nom_projet,
    rbc,
    taux_actualisation,
    tri,
    van,
    username
) => {
    const query = `
    INSERT INTO materials (
      cashflows,
      date_debut,
      description,
      delai_recup,
      duree,
      investissement,
      nom_projet,
      rbc,
      taux_actualisation,
      tri,
      van,
      username
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const [result] = await pool.query(query, [
        JSON.stringify(cashflows), // Si cashflows est un tableau
        date_debut,
        description,
        delai_recup,
        duree,
        investissement,
        nom_projet,
        rbc,
        taux_actualisation,
        tri,
        van,
        username
    ]);
    return result;
};

// Obtenir un projet par ID
export const getEquipById = async (id) => {
    const query = `SELECT * FROM materials WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

// Mettre à jour un projet
export const updateEquip = async (
    id,
    cashflows,
    date_debut,
    description,
    delai_recup,
    duree,
    investissement,
    nom_projet,
    rbc,
    taux_actualisation,
    tri,
    van,
    username
) => {
    const query = `
    UPDATE materials SET
      cashflows = ?,
      date_debut = ?,
      description = ?,
      delai_recup = ?,
      duree = ?,
      investissement = ?,
      nom_projet = ?,
      rbc = ?,
      taux_actualisation = ?,
      tri = ?,
      van = ?,
      username = ?
    WHERE id = ?
  `;
    const [result] = await pool.query(query, [
        JSON.stringify(cashflows),
        date_debut,
        description,
        delai_recup,
        duree,
        investissement,
        nom_projet,
        rbc,
        taux_actualisation,
        tri,
        van,
        username,
        id
    ]);
    return result;
};

// Supprimer un projet
export const deleteEquip = async (id) => {
    const query = `DELETE FROM materials WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result;
};

export default createEquipTable;
