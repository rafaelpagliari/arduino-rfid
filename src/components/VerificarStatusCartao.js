import React, { useState } from 'react';

const VerificarStatusCartao = () => {
    const [uuid, setUuid] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/cartao/verificar-status/${uuid}`);
            const data = await response.json();
            setStatus(data.status);
        } catch (error) {
            console.error('Erro ao verificar status do cartão:', error);
            setStatus('Erro ao verificar status do cartão');
        }
    };

    return (
        <div className="container">
            <h1>Verificar Status do Cartão RFID</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="uuid">UUID do Cartão:</label>
                <input
                    type="text"
                    id="uuid"
                    name="uuid"
                    value={uuid}
                    onChange={(e) => setUuid(e.target.value)}
                    required
                />
                <button type="submit">Verificar Status</button>
            </form>
            {status && <div id="status">Status do Cartão: {status}</div>}
        </div>
    );
};

export default VerificarStatusCartao;

