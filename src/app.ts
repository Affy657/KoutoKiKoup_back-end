import express from 'express';
import cors from 'cors';
import mongoose from './db';
import router from './routes/knifeRoutes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/knives', router);

//Pour le test de la connexion à la base de données
app.get('/status', (req, res) => {
    const state = mongoose.connection.readyState;
    const status = state === 1 ? 'Connecté' : 'Non connecté';
    res.json({ status });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
