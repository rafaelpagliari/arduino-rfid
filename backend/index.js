const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

const pool = new Pool({
    user: 'teste',
    host: 'localhost',
    database: 'arduino',
    password: 'sua_senha',
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Exporte o objeto pool para que outros arquivos possam importá-lo
module.exports = {
    app,
    pool,
};

// Rotas
const cartaoRouter = require('./routes/cartao');
app.use('/api/cartao', cartaoRouter);

app.listen(port, () => {
    console.log(`Servidor Node.js rodando em http://localhost:${port}`);
});

