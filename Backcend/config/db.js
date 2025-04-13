import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',          // Utiliser 'localhost' pour une base de données locale
    user: 'mon_utilisateur',    // Remplacez par votre nom d'utilisateur
    password: 'mon_mot_de_passe', // Remplacez par votre mot de passe
    database: 'ma_base_de_donnees', // Remplacez par le nom de votre base de données
    port: 3306
});

export default pool;