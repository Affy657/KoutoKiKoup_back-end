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
    image: string;
    handle: Material;
    blade: Material;
    sharpness: number;
    price: number;
    durability: number;
    weight: number;
    length: number;
    description: string;
}

const knifeSchema = new Schema<knife>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    handle: { type: String, required: true, enum: Object.values(Material) },
    blade: { type: String, required: true, enum: Object.values(Material) },
    sharpness: { type: Number, default: 5, min: 0, max: 10 },
    durability: { type: Number, default: 0, min: 0, max: 10 },
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    price: { type: Number, required: true },
    description: { type: String, required: true }
});

knifeSchema.index({ name: 'text' });

export default model<knife>('Knife', knifeSchema);
