import express from 'express';
import cors from 'cors';
import UsersRouter from './routers/userRouter.js';
import createUserTable from './models/userModel.js';
import createInterventionTable from './models/interventionModel.js';
import interventionRouter from './routers/interventionRouter.js';
import createEquipTable from './models/equipModel.js';
import equipRouter from './routers/equipRouter.js'



const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/', UsersRouter);
app.use('/intervention', interventionRouter);
app.use('/equipements', equipRouter);



// Création de la table si elle n'existe pas déjà
createUserTable();
createEquipTable();
createInterventionTable();

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

