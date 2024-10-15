import { Schema, model, Document } from 'mongoose';

const enum Handle {
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
    handle: Handle;
    blade: string;
    sharpness: number;
    price: number;
    durability: number;
    weight: number;
    length: number;
}

const knifeSchema = new Schema<knife>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    handle: { type: String, required: true },
    blade: { type: String, required: true },
    sharpness: { type: Number, default: 5 },
    durability: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    price: { type: Number, required: true },
});

export default model<knife>('Knife', knifeSchema);
