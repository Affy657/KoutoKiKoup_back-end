import multer from 'multer';
import express, { Request, Response, RequestHandler } from 'express';
import { Storage, File } from '@google-cloud/storage';
import debuggers from 'debug';
import { createRandomStringTimeBased } from '../helpers/random';
import Knife from '../models/knife';
import auth from '../middlewares/auth';
import { verifySelfknife } from '../middlewares/knife';

const debug = debuggers('app:knifeRoutes');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET as string);

const getFileExt = (mimeType: string) => {
    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        default:
            return undefined;    
    }
}

// CREATE: Add a new knife
const createKnife: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files) {
            res.status(400).json({ message: 'No files uploaded' });
            return void 0;
        }

        if (req.files.length as number > 5) {
            res.status(400).json({ message: 'Too many files uploaded' });
            return void 0;
        }

        if ((req.files as Express.Multer.File[]).every((file: Express.Multer.File) => !['image/jpeg', 'image/png'].includes(file.mimetype))) {
            res.status(400).json({ message: 'Invalid file type' });
            return void 0;
        }

        debug('%s file(s) to upload', req.files.length);

        let images = [];

        for (const file of req.files as Express.Multer.File[]) {
            debug('Uploading file (%s)', file.originalname);

            const completeBlob = await new Promise<File>((resolve, reject) => {
                let ext = getFileExt(file.mimetype);

                if (!ext) {
                    reject(new Error('Invalid file type'));
                }

                const blob = bucket.file('knives/' + createRandomStringTimeBased(32));
                const blobStream = blob.createWriteStream({
                    resumable: false
                });
    
                blobStream.on('error', (err) => {
                    debug('Error uploading file: %s', err.message);
                    reject();
                });
    
                blobStream.on('finish', () => {
                    debug('File uploaded');
                    resolve(blob);
                });
    
                blobStream.end(file.buffer);
            });

            debug('File URL: %s', completeBlob.publicUrl());
            images.push(completeBlob.publicUrl());
        }

        const newKnife = new Knife({
            ...req.body,
            images,
            userId: res.locals.user._id
        });
        const savedKnife = await newKnife.save();
        res.json(savedKnife);
    } catch (err: any) {
        console.error(err);
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
        const knife = await Knife.findOne({_id: req.params.id }).populate('userId', {
            password: 0
        });
        res.json(knife);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// FILTER: Get all knives that match a field value
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

// UPDATE: Update a knife by ID
const updateKnifeById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const updatedKnife = await Knife.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

router.post('/', auth, upload.array('images', 5), createKnife);
router.get('/filter', filterKnives);
router.get('/', getAllKnives);
router.get('/:id', getKnifeById);
router.put('/:id', auth, verifySelfknife('params'), updateKnifeById);
router.delete('/:id', auth, verifySelfknife('params'), deleteKnifeById);

export default router;
