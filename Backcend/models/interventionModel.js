import pool from '../config/db.js';

const createInterventionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Interventions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT,
            nature ENUM('installation', 'extension', 'reconfiguration', 'autre') NOT NULL,
            otherNature VARCHAR(255),  -- Pour 'autre', le nom précis
            equipment ENUM('ordinateur', 'imprimante', 'scanner', 'autre') NOT NULL,
            otherEquipment VARCHAR(255),  -- Pour 'autre', le nom précis
            solution ENUM('Active Directory AV', 'file dattente', 'antivirus Kaspersky', 'voucher') NOT NULL,
            brand VARCHAR(255),
            assetNumber VARCHAR(255),
            report TEXT,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;
    await pool.query(query);
};

export default createInterventionTable;