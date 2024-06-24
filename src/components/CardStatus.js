import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CardStatus() {
    const [ultimoCartao, setUltimoCartao] = useState(null);
    const [cartoes, setCartoes] = useState([]);
    const [selectedCartao, setSelectedCartao] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Função para buscar o último cartão e atualizar o estado
    const fetchUltimoCartao = async () => {
        try {
            const response = await axios.get('http://186.237.57.106:3001/api/cartao/ultimo-cartao');
            setUltimoCartao(response.data);
        } catch (error) {
            console.error('Erro ao buscar último cartão:', error);
        }
    };

    // Função para buscar os cartões cadastrados
    const fetchCartoes = async () => {
        try {
            const response = await axios.get('http://186.237.57.106:3001/api/cartao/uuids');
            setCartoes(response.data);
        } catch (error) {
            console.error('Erro ao buscar cartões:', error);
        }
    };

    // Função para atualizar o status do cartão selecionado
    const updateStatus = async () => {
        if (!selectedCartao || !newStatus) {
            console.warn('Cartão ou status não selecionado');
            return;
        }
        try {
            console.log(`Atualizando status do cartão ${selectedCartao} para ${newStatus}`);
            const response = await axios.put('http://186.237.57.106:3001/api/cartao/updatestatus', {
                uuid: selectedCartao,
                status: newStatus
            });
            console.log('Resposta da API:', response.data);
            alert('Status atualizado com sucesso!');
            fetchCartoes(); // Atualiza a lista de cartões após a alteração
        } catch (error) {
            console.error('Erro ao atualizar status do cartão:', error);
        }
    };

    // useEffect para buscar os cartões e o último cartão ao carregar o componente
    useEffect(() => {
        fetchUltimoCartao();
        fetchCartoes();

        const interval = setInterval(() => {
            fetchUltimoCartao(); // Chama a função a cada 10 segundos
        }, 2000); // Intervalo de 10 segundos em milissegundos

        // Função de limpeza do setInterval para evitar vazamentos de memória
        return () => clearInterval(interval);
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

            <h2>Cartões Cadastrados</h2>
            {cartoes.length > 0 ? (
                <div>
                    <ul>
                        {cartoes.map(cartao => (
                            <li key={cartao.uuid}>
                                {cartao.uuid}
                                <button onClick={() => setSelectedCartao(cartao.uuid)}>
                                    Selecionar
                                </button>
                            </li>
                        ))}
                    </ul>
                    {selectedCartao && (
                        <div>
                            <h3>Alterar Status do Cartão: {selectedCartao}</h3>
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="">Selecione um status</option>
                                <option value="liberado">Liberado</option>
                                <option value="bloqueado">Bloqueado</option>
                            </select>
                            <button onClick={updateStatus}>Atualizar Status</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Nenhum cartão cadastrado ainda.</p>
            )}
        </div>
    );
}

export default CardStatus;

