import React from 'react';
import CardStatus from './components/CardStatus';  // Verifique o caminho correto se necessário

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Exemplo de Aplicação</h1>
            </header>
            <main>
                <CardStatus />  {/* Componente CardStatus */}
                {/* Outros componentes ou conteúdo aqui */}
            </main>
        </div>
    );
}

export default App;

