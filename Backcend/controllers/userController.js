import { addUser, getUserById, updateUser, deleteUser,updateUserPassword,updateUserFirstLoginFlag } from '../models/userModel.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
    const { username, password, role= 'user' } = req.body;
    try {
        const result = await addUser(username, password, role);
        res.status(201).json({ message: "Utilisateur créé", id: result.insertId });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error); // Affiche l'erreur dans la console
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: error.message });
    }
};


export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
    }
};

export const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    
    // Define allowed roles for validation
    const allowedRoles = ['user', 'admin'];

    try {
        // Récupérer l'utilisateur existant
        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        // Utiliser l'ancien username si le nouveau username est vide ou non défini
        const newUsername = (typeof username === 'string' && username.trim() !== '')
            ? username.trim() // Assurer qu'on supprime les espaces autour
            : existingUser.username;

        // Si password est non fourni ou vide, garder l'ancien password
        let newPassword = existingUser.password;
        if (typeof password === 'string' && password.trim() !== '') {
            const saltRounds = 10;
            newPassword = await bcrypt.hash(password.trim(), saltRounds);
        }

        // Si role est non fourni, invalide, ou null, garder l'ancien role
        const newRole = (typeof role === 'string' && allowedRoles.includes(role.trim()))
            ? role.trim()
            : existingUser.role;

        // Logging for debugging
        console.log('Role received from client:', role);
        console.log('New role being set:', newRole);

        // Appel à la fonction updateUser
        await updateUser(id, newUsername, newPassword, newRole);

        res.json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};



export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};

export const getUserByUsername = async (username) => {
    const query = `SELECT * FROM Users WHERE username = ?`;
    const [rows] = await pool.query(query, [username]);
    return rows[0];
};

export const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM Users'; 
        const [users] = await pool.query(query);

        if (users.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }

        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
};

export const getUserIdByUsername = async (username) => {
    const query = `SELECT id FROM Users WHERE username = ?`;  
    const [rows] = await pool.query(query, [username]);

    if (rows.length > 0) {
        return rows[0].id;  
    } else {
        return null;  
    }
};

export const changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(user.id, hashedNewPassword);

        // Update the isFirstLogin flag to false
        await updateUserFirstLoginFlag(user.id, false);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};
