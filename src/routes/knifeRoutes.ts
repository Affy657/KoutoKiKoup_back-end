import express, { Request, Response } from 'express';
import Book from '../models/knife';

const router = express.Router();
// TODO
// CREATE: Add a new book
router.post('/books', async (req: Request, res: Response) => {
    const { title, author, pages } = req.body;
    try {
        const newBook = new Book({ title, author, pages });
        const savedBook = await newBook.save();
        res.json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ: Get all books
router.get('/books', async (req: Request, res: Response) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ: Get a single book by ID
router.get('/books/:id', async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE: Update a book by ID
router.put('/books/:id', async (req: Request, res: Response) => {
    const { title, author, pages } = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, pages }, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a book by ID
router.delete('/books/:id', async (req: Request, res: Response) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
