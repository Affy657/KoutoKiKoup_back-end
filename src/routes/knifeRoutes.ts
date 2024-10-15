import express, { Request, Response, RequestHandler } from 'express';
import Knife from '../models/knife';
const router = express.Router();

// CREATE: Add a new knife
const createKnife: RequestHandler = async (req: Request, res: Response) => {
    const { name, image, handle, blade, sharpness, price, durability, weight, length, description } = req.body;
    try {
        const newKnife = new Knife({ name, image, handle, blade, sharpness, price, durability, weight, length, description });
        const savedKnife = await newKnife.save();
        res.json(savedKnife);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

// READ: Get all knives
const getAllKnives: RequestHandler = async (req: Request, res: Response) => {
    try {
        const knives = await Knife.find();
        res.json(knives);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single knife by ID
const getKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const knife = await Knife.findById(req.params.id);
        res.json(knife);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// FILTER: Get all knives that match a field value
const filterKnives: RequestHandler = async (req: Request, res: Response) => {
    try {
        const filter = req.query;
        const knives = await Knife.find(filter);
        res.json(knives);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE: Update a knife by ID
const updateKnifeById: RequestHandler = async (req: Request, res: Response) => {
    const { name, image, handle, blade, sharpness, price, durability, weight, length } = req.body;
    try {
        const updatedKnife = await Knife.findByIdAndUpdate(req.params.id, { name, image, handle, blade, sharpness, price, durability, weight, length }, { new: true });
        res.json(updatedKnife);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Delete a knife by ID
const deleteKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const deletedKnife = await Knife.findByIdAndDelete(req.params.id);
        res.json({ message: 'Knife deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

router.post('/knives', createKnife);
router.post('/knives/filter', filterKnives);
router.get('/knives', getAllKnives);
router.get('/knives/:id', getKnifeById);
router.put('/knives/:id', updateKnifeById);
router.delete('/knives/:id', deleteKnifeById);

export default router;
