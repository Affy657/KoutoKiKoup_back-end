import { Schema, model, Document } from 'mongoose';
import {Handler} from "express";
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
    blade: number;
    price: number;
    sharpness: number;
    durability: number;
}

const knifeSchema = new Schema<knife>({
   //TODO
});

export default model<knife>('Knife', knifeSchema);
