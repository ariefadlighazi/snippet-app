const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const authenticate = (req, res, next) => {
    const providedPassword = req.headers['x-admin-password'];
    const storedPassword = process.env.ADMIN_PASSWORD;

    if (providedPassword == storedPassword) {
        next();
    } else {
        res.status(403).json({ error: 'Fordbidden' });
    }
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/snippets', authenticate, async (req, res) => {
    try {
        const { title, code, language } = req.body;
        const result = await pool.query(
            'INSERT INTO snippets (title, code, language) VALUES ($1, $2, $3) RETURNING *',
            [title, code, language]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/snippets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM snippets');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/snippets/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, code, language } = req.body;
        const result = await pool.query(
            'UPDATE snippets SET title = $1, code = $2, language = $3 WHERE id = $4 RETURNING *',
            [title, code, language, id]
        );

        res.json("Snippets updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/snippets/:id', authenticate,async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM snippets WHERE id = $1', [id]);
        res.json("Snippet deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});