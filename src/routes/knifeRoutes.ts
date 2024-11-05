import express, { Request, Response, RequestHandler } from 'express';
import Knife from '../models/knife';
import auth from '../middlewares/auth';
import { verifySelfknife } from '../middlewares/knife';
const router = express.Router();

const createKnife: RequestHandler = async (req: Request, res: Response) => {
    try {
        const newKnife = new Knife({
            ...req.body,
            userId: res.locals.user._id
        });
        const savedKnife = await newKnife.save();
        res.json(savedKnife);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const getAllKnives: RequestHandler = async (req: Request, res: Response) => {
    try {
        const knives = await Knife.find();
        res.json(knives);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const getKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const knife = await Knife.findOne({_id: req.params.id }).populate('userId', {
            password: 0
        });
        res.json(knife);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const filterKnives: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name, ...otherFilters } = req.query;

        let filter = { ...otherFilters };

        if (name) {
            filter = {
                ...filter,
                name: { $regex: name, $options: 'i' }
            };
        }

        const knives = await Knife.find(filter).populate('userId', {
            password: 0
        });
        res.json(knives);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const updateKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const updatedKnife = await Knife.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedKnife);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const autocompleteKnives: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { term } = req.query;
        const knives = await Knife.find({ name: { $regex: term, $options: 'i' } }).select('name');
        res.json(knives);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const deleteKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const deletedKnife = await Knife.findByIdAndDelete(req.params.id);
        res.json({ message: 'Knife deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

router.post('/', auth, createKnife);
router.get('/filter', filterKnives);
router.get('/autocomplete', autocompleteKnives);
router.get('/', getAllKnives);
router.get('/:id', getKnifeById);
router.put('/:id', auth, verifySelfknife('params'), updateKnifeById);
router.delete('/:id', auth, verifySelfknife('params'), deleteKnifeById);

export default router;
