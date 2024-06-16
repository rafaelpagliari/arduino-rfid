import React from 'react';
import VerificarStatusCartao from './components/VerificarStatusCartao';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Sistema de Controle de Acesso</h1>
            </header>
            <main className="App-main">
                <VerificarStatusCartao />
                {/* Aqui você pode incluir outros componentes conforme necessário */}
            </main>
            <footer className="App-footer">
                <p>&copy; 2024 Sistema de Controle de Acesso</p>
            </footer>
        </div>
    );
}

export default App;

