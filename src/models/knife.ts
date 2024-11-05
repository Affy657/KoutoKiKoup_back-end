import { Schema, model, Document } from 'mongoose';

enum Material {
    Wood = "wood",
    Horn = "horn",
    Metal = "metal",
    Stone = "stone",
    Glass = "glass",
    Plastic = "plastic",
    Composite = "composite",
    Rubber = "rubber",
    Leather = "leather",
    Bone = "bone",
    Ivory = "ivory",
    Paper = "paper",
    Cord = "cord",
    Other = "other"
}

interface knife extends Document {
    name: string;
    images: string[];
    handle: Material;
    blade: Material;
    sharpness: number;
    price: number;
    durability: number;
    weight: number;
    length: number;
    description: string;
    userId: Schema.Types.ObjectId;
}

const knifeSchema = new Schema<knife>({
    name: { type: String, required: true },
    images: { type: [String], required: true }, // Définir images comme un tableau de chaînes de caractères
    handle: { type: String, required: true, enum: Object.values(Material) },
    blade: { type: String, required: true, enum: Object.values(Material) },
    sharpness: { type: Number, default: 5, min: 0, max: 10 },
    durability: { type: Number, default: 0, min: 0, max: 10 },
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

knifeSchema.index({ name: 'text' });

export default model<knife>('Knife', knifeSchema);