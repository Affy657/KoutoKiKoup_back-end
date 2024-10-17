import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('La variable d\'environnement MONGODB_URI n\'est pas définie');
}

mongoose.connect(uri)
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch((err) => console.error('Erreur de connexion à MongoDB', err));

export default mongoose;