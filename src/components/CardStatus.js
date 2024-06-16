import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CardStatus() {
    const [ultimoCartao, setUltimoCartao] = useState(null);

    // Função para buscar o último cartão e atualizar o estado
    const fetchUltimoCartao = async () => {
        try {
            const response = await axios.get('http://186.237.57.106:3001/api/cartao/ultimo-cartao');
            setUltimoCartao(response.data);
        } catch (error) {
            console.error('Erro ao buscar último cartão:', error);
        }
    };

    // Função que executa fetchUltimoCartao inicialmente e a cada 10 segundos
    useEffect(() => {
        fetchUltimoCartao(); // Primeira chamada ao carregar o componente

        const interval = setInterval(() => {
            fetchUltimoCartao(); // Chama a função a cada 10 segundos
        }, 2000); // Intervalo de 10 segundos em milissegundos

        // Função de limpeza do setInterval para evitar vazamentos de memória
        return () => clearInterval(interval);
    }, []); // A dependência vazia [] indica que o useEffect é executado apenas uma vez

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

