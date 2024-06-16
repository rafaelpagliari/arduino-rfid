const express = require('express');
const { Router } = express;
const router = Router();
const { pool } = require('../index'); // Importe o pool do index.js ou do arquivo onde foi exportado

// Rota para buscar os UUIDs da tabela 'cartao'
router.get('/uuids', async (req, res) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT uuid FROM cartao';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar UUIDs:', err);
        res.status(500).json({ error: 'Erro ao buscar UUIDs' });
    } finally {
        client.release();
    }
});

// Rota para cadastrar um novo cartão
router.post('/cadastrar', async (req, res) => {
    const { uuid } = req.body;

    const client = await pool.connect();
    try {
        const query = 'INSERT INTO cartao (uuid) VALUES ($1)';
        await client.query(query, [uuid]);
        res.status(201).send('Cartão cadastrado com sucesso!');
    } catch (err) {
        console.error('Erro ao cadastrar cartão:', err);
        res.status(500).json({ error: 'Erro ao cadastrar cartão' });
    } finally {
        client.release();
    }
});

router.post('/registrar-leitura', async (req, res) => {
    const { uuid } = req.body;
    
    try {
        // Registrar a leitura do cartão no banco de dados
        const query = 'INSERT INTO logs (uuid, data) VALUES ($1, NOW())';
        await pool.query(query, [uuid]);

        res.status(201).json({ message: 'Leitura registrada com sucesso.' });
    } catch (error) {
        console.error('Erro ao registrar leitura:', error);
        res.status(500).json({ error: 'Erro ao registrar leitura.' });
    }
});

router.get('/logs', async (req, res) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM logs';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar logs:', err);
        res.status(500).json({ error: 'Erro ao buscar logs' });
    } finally {
        client.release();
    }
});

router.get('/verificar-status/:uuid', async (req, res) => {
    const { uuid } = req.params;

    const client = await pool.connect();
    try {
        const query = 'SELECT status FROM cartao WHERE uuid = $1';
        const result = await client.query(query, [uuid]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Cartão não encontrado' });
        } else {
            const { status } = result.rows[0];
            res.json({ status });
        }
    } catch (err) {
        console.error('Erro ao verificar status do cartão:', err);
        res.status(500).json({ error: 'Erro ao verificar status do cartão' });
    } finally {
        client.release();
    }
});

router.post('/verificar-cartao', async (req, res) => {
    const { uuid } = req.body;

    try {
        // Consulta no banco de dados para verificar o status do cartão
        const query = 'SELECT status FROM cartao WHERE uuid = $1';
        const result = await pool.query(query, [uuid]);

        if (result.rows.length > 0) {
            const { status } = result.rows[0];
            res.json({ status });
        } else {
            res.status(404).json({ error: 'Cartão não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao verificar cartão:', error);
        res.status(500).json({ error: 'Erro ao verificar cartão' });
    }
});

module.exports = router;
