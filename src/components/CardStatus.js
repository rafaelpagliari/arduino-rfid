import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CardStatus() {
    const [ultimoCartao, setUltimoCartao] = useState(null);

    useEffect(() => {
        async function fetchUltimoCartao() {
            try {
                const response = await axios.get('http://186.237.57.106:3001/api/cartao/ultimo-cartao');
                setUltimoCartao(response.data);
            } catch (error) {
                console.error('Erro ao buscar último cartão:', error);
            }
        }

        fetchUltimoCartao();
    }, []);

    return (
        <div>
            <h2>Último Cartão Registrado:</h2>
            {ultimoCartao ? (
                <div>
                    <p>UUID: {ultimoCartao.uuid}</p>
                    <p>Data da Leitura: {new Date(ultimoCartao.data).toLocaleString()}</p>
                    <p>Status: {ultimoCartao.status}</p>
                </div>
            ) : (
                <p>Nenhum cartão registrado ainda.</p>
            )}
        </div>
    );
}

export default CardStatus;

