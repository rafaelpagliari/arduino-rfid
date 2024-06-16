const { Pool } = require('pg');

const pool = new Pool({
    user: 'teste',
    host: 'localhost',
    database: 'arduino',
    password: 'sua_senha',
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar com o PostgreSQL', err);
    } else {
        console.log('Conexão bem-sucedida com o PostgreSQL');
        console.log('Resultado da query:', res.rows);
    }
    pool.end(); // Fecha a pool de conexão
});
