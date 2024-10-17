import express from 'express';
import mongoose from './db';

const app = express();
app.use(express.json());

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
