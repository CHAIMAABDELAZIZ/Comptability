import { getUserByUsername } from './userController.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; // Assurez-vous d'avoir jsonwebtoken installé

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, isFirstLogin: user.isFirstLogin  });
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};
