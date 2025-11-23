// Estado inicial do jogador (usando let para permitir a atualização)
let player = {
    nome: 'Você',
    moedas: 0,
    questsCompletas: [],
};

// Dados simulados para o ranking
const rankingSimulado = [
    { nome: 'Ciclano', moedas: 55 },
    { nome: 'Beltrano', moedas: 40 },
    { nome: 'Fulano', moedas: 25 },
    { nome: 'Zetano', moedas: 10 },
];

// Definição das Quests
const quests = [
    {
        id: 1,
        titulo: "Assista ao vídeo de boas-vindas",
        descricao: "Complete o vídeo para entender nossa cultura e como tudo funciona.",
        recompensa: 10,
        concluida: false
    },
    {
        id: 2,
        titulo: "Preencha seu perfil",
        descricao: "Acesse a seção 'Nosso Time' e complete suas informações.",
        recompensa: 15,
        concluida: false
    },
    {
        id: 3,
        titulo: "Conheça os sistemas",
        descricao: "Navegue pela página de sistemas para conhecer as ferramentas que usamos.",
        recompensa: 10,
        concluida: false
    },
    {
        id: 4,
        titulo: "Responda ao Quiz",
        descricao: "Teste seus conhecimentos sobre o que aprendeu até agora.",
        recompensa: 25,
        concluida: false
    }
];

// Funções de persistência de dados
function salvarProgresso() {
    localStorage.setItem('playerProgresso', JSON.stringify(player));
}

// Função para resetar o estado de todas as quests para "não concluída"
function resetarEstadoQuests() {
    quests.forEach(quest => {
        quest.concluida = false;
    });
}

function carregarProgresso() {
    const progressoSalvo = localStorage.getItem('playerProgresso');
    
    // Resetar o estado das quests antes de carregar
    resetarEstadoQuests();

    if (progressoSalvo) {
        player = JSON.parse(progressoSalvo);
        
        // Atualiza o estado 'concluida' no array de quests principal
        quests.forEach(quest => {
            if (player.questsCompletas.includes(quest.id)) {
                quest.concluida = true;
            }
        });
    } else {
        const nomeJogador = prompt("Bem-vindo, herói! Qual é o seu nome?");
        if (nomeJogador) {
            player.nome = nomeJogador;
        }
    }
}

// Função para resetar o jogo completamente
function resetarProgresso() {
    localStorage.removeItem('playerProgresso'); // Remove os dados salvos
    alert('Progresso resetado! O jogo será reiniciado.');
    window.location.reload(); // Recarrega a página para iniciar do zero
}

// Funções do jogo
function completarQuest(id) {
    const quest = quests.find(q => q.id === id);
    if (quest && !quest.concluida) {
        quest.concluida = true;
        player.moedas += quest.recompensa;
        player.questsCompletas.push(id);
        
        console.log(`Quest "${quest.titulo}" completada! Você ganhou ${quest.recompensa} moedas.`);
        
        salvarProgresso();
        atualizarContadorMoedas();
        renderizarQuests();
        renderizarRanking(); // Atualiza o ranking
    }
}

function atualizarContadorMoedas() {
    const contadorElement = document.querySelector('.coin-counter span');
    if (contadorElement) {
        contadorElement.textContent = `Moedas: ${player.moedas}`;
    }
}

function renderizarQuests() {
    const container = document.querySelector('.quests-container');
    if (!container) return;

    container.innerHTML = '';

    quests.forEach(quest => {
        const questElement = document.createElement('div');
        questElement.className = 'quest-item';
        if (quest.concluida) {
            questElement.classList.add('concluida');
        }

        questElement.innerHTML = `
            <h3>${quest.titulo}</h3>
            <p>${quest.descricao}</p>
            <div class="recompensa">
                <span>+${quest.recompensa} Moedas</span>
            </div>
            ${!quest.concluida ? `<button onclick="completarQuest(${quest.id})">Completar</button>` : '<p class="status">Concluída!</p>'}
        `;

        container.appendChild(questElement);
    });
}

function renderizarRanking() {
    const container = document.querySelector('.ranking-container');
    if (!container) return;

    // Combina o jogador atual com a lista simulada
    const todosOsJogadores = [...rankingSimulado, { nome: player.nome, moedas: player.moedas }];
    
    // Ordena os jogadores por moedas (do maior para o menor)
    todosOsJogadores.sort((a, b) => b.moedas - a.moedas);

    container.innerHTML = ''; // Limpa o ranking

    todosOsJogadores.forEach((jogador, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'ranking-item';

        // Destaca o jogador atual
        if (jogador.nome === player.nome) {
            itemElement.classList.add('jogador-atual');
        }

        itemElement.innerHTML = `
            <span class="ranking-pos">${index + 1}º</span>
            <span class="ranking-nome">${jogador.nome}</span>
            <span class="ranking-moedas">${jogador.moedas} moedas</span>
        `;
        container.appendChild(itemElement);
    });
}

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', () => {
    console.log("Onboarding gamificado iniciado!");
    carregarProgresso();
    atualizarContadorMoedas();
    renderizarQuests();
    renderizarRanking(); // Renderiza o ranking inicial

    // Adiciona o event listener para o botão de reset
    const resetButton = document.getElementById('reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', resetarProgresso);
    }

    // Lógica para o menu hambúrguer
    const menuHamburger = document.querySelector('.menu-hamburger');
    const navLinks = document.getElementById('nav-links');

    if (menuHamburger && navLinks) {
        menuHamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuHamburger.classList.toggle('active');
        });
    }
});
