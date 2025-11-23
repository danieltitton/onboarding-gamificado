// Estado inicial do jogador (usando let para permitir a atualização)
let player = {
    moedas: 0,
    questsCompletas: [],
};

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

function carregarProgresso() {
    const progressoSalvo = localStorage.getItem('playerProgresso');
    if (progressoSalvo) {
        player = JSON.parse(progressoSalvo);
        
        // Atualiza o estado 'concluida' no array de quests principal
        quests.forEach(quest => {
            if (player.questsCompletas.includes(quest.id)) {
                quest.concluida = true;
            }
        });
    }
}

// Funções do jogo
function completarQuest(id) {
    const quest = quests.find(q => q.id === id);
    if (quest && !quest.concluida) {
        quest.concluida = true;
        player.moedas += quest.recompensa;
        player.questsCompletas.push(id);
        
        console.log(`Quest "${quest.titulo}" completada! Você ganhou ${quest.recompensa} moedas.`);
        
        salvarProgresso(); // Salva o progresso após completar a quest
        atualizarContadorMoedas();
        renderizarQuests();
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

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', () => {
    console.log("Onboarding gamificado iniciado!");
    carregarProgresso(); // Carrega o progresso salvo
    atualizarContadorMoedas();
    renderizarQuests();
});
