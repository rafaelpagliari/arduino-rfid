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

router.get('/ultimo-cartao', async (req, res) => {
    try {
        // Consulta para obter o uuid e a data da última leitura na tabela logs
        const queryLogs = 'SELECT uuid, data FROM logs ORDER BY data DESC LIMIT 1';
        const resultLogs = await pool.query(queryLogs);

        if (resultLogs.rows.length > 0) {
            const { uuid, data } = resultLogs.rows[0];

            // Consulta para obter o status na tabela cartao usando o uuid obtido
            const queryCartao = 'SELECT status FROM cartao WHERE uuid = $1';
            const resultCartao = await pool.query(queryCartao, [uuid]);

            if (resultCartao.rows.length > 0) {
                const { status } = resultCartao.rows[0];
                res.json({ uuid, data, status });
            } else {
                res.status(404).json({ error: 'Status do cartão não encontrado' });
            }
        } else {
            res.status(404).json({ error: 'Nenhuma leitura de cartão encontrada' });
        }
    } catch (error) {
        console.error('Erro ao obter última leitura de cartão:', error);
        res.status(500).json({ error: 'Erro ao obter última leitura de cartão' });
    }
});

module.exports = router;
