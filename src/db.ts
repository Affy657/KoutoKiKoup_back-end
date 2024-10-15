import mongoose from 'mongoose';

const uri = 'mongodb+srv://UserAdmin:ADMN@cluster0.mkqtd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
    .then(() => console.log('Connecté à MongoDB Atlas'))
    .catch((err) => console.error('Erreur de connexion à MongoDB', err));

export default mongoose;