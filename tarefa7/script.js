// Objeto com os caminhos das imagens (MANTENDO SUAS MUDANÇAS)
const imagens = {
    normal: 'vivo.webp',
    bravo: 'bravo.webp',
    morto: 'morto.webp',
    comendo: 'comendo.webp',
    feliz: 'alimentado.webp',
    fantasma: 'morto.webp'
};

// Fundos (ADICIONANDO O FUNDO CÓSMICO)
const fundoDia = "url('fundo2.webp')";
const fundoNoite = "url('fundo2.webp')";

// Elementos do DOM
const img = document.getElementById('mainImage');
const avatarImage = document.getElementById('avatarImage');
const statusText = document.getElementById('statusText');
const hungerBar = document.getElementById('hungerBar');
const energyBar = document.getElementById('energyBar');
const timeCounter = document.getElementById('timeCounter');
const dayNightToggle = document.getElementById('dayNightToggle');
const creatureName = document.getElementById('creatureName');

// Variáveis de controle
let contador = 0; // Contador de fome
let energia = 100; // Energia da criatura
let estadoAtual = 'feliz'; // Estado atual
let morto = false; // Flag de morte
let timeoutClique = null;
let timeoutBack = null;
let timeoutFome = null;
let horas = 0; // Simulação de horas (0-23)
let isDayMode = false; // Controle de dia/noite

// Objeto com as configurações de estados
const estados = {
    feliz: {
        imagem: imagens.feliz,
        cor: 'text-yellow-300',
        descricao: 'Feliz 😊'
    },
    comendo: {
        imagem: imagens.comendo,
        cor: 'text-green-300',
        descricao: 'Comendo 🍪'
    },
    faminto: {
        imagem: imagens.bravo,
        cor: 'text-red-400',
        descricao: 'Faminto 😠'
    },
    morto: {
        imagem: imagens.morto,
        cor: 'text-gray-500',
        descricao: 'Morto 💀'
    },
    fantasma: {
        imagem: imagens.fantasma,
        cor: 'text-blue-300',
        descricao: 'Fantasma 👻'
    }
};

// Inicialização
function inicializar() {
    console.log('🌌 Bichinho Virtual iniciado!');
    controle();
    atualizarFundo();
    atualizarUI();
    
    // Listener para o toggle de dia/noite
    dayNightToggle.addEventListener('change', (e) => {
        isDayMode = e.target.checked;
        atualizarFundo();
    });
}

// Função de controle de fome
function controle() {
    if (timeoutFome) clearTimeout(timeoutFome);
    
    timeoutFome = setInterval(() => {
        if (!morto) {
            contador++;
            timeCounter.textContent = contador + 's';
            
            // Atualizar barra de fome
            let percentualFome = Math.min((contador / 60) * 100, 100);
            hungerBar.style.width = percentualFome + '%';
            
            // Verificar estados
            if (contador >= 30 && contador < 60) {
                // Faminto
                if (estadoAtual !== 'faminto') {
                    estadoAtual = 'faminto';
                    img.src = estados.faminto.imagem;
                    atualizarUI();
                }
            } else if (contador >= 60) {
                // Morrer
                morrer();
            }
        }
    }, 1000); // Atualiza a cada segundo
}

// Função de alimentação
function alimentar() {
    if (morto) {
        console.log('A criatura está morta! Use a magia para ressuscitá-la.');
        ressuscitar();
        return;
    }
    
    // Mostrar comendo
    img.src = estados.comendo.imagem;
    avatarImage.src = estados.comendo.imagem;
    estadoAtual = 'comendo';
    contador = 0;
    timeCounter.textContent = '0s';
    
    console.log('🍪 ' + creatureName.value + ' está comendo!');
    
    if (timeoutClique) clearTimeout(timeoutClique);
    
    // Após 1 segundo, ficar feliz
    timeoutClique = setTimeout(() => {
        img.src = estados.feliz.imagem;
        avatarImage.src = estados.feliz.imagem;
        estadoAtual = 'feliz';
        energia = 100;
        
        console.log('😊 ' + creatureName.value + ' ficou feliz!');
        
        if (timeoutBack) clearTimeout(timeoutBack);
        
        // Após 2 segundos, voltar ao normal
        timeoutBack = setTimeout(() => {
            if (contador < 10) {
                img.src = estados.feliz.imagem;
            }
            atualizarUI();
        }, 2000);
        
        atualizarUI();
    }, 1000);
}

// Função de morte
function morrer() {
    morto = true;
    estadoAtual = 'morto';
    img.src = estados.morto.imagem;
    avatarImage.src = estados.morto.imagem;
    
    console.log('💀 ' + creatureName.value + ' morreu de fome!');
    console.log('🔮 Clique na comida para ressuscitar...');
    
    atualizarUI();
}

// Função de ressurreição
function ressuscitar() {
    if (!morto) return;
    
    morto = false;
    contador = 0;
    energia = 100;
    estadoAtual = 'feliz';
    img.src = estados.feliz.imagem;
    avatarImage.src = estados.feliz.imagem;
    
    console.log('✨ ' + creatureName.value + ' foi ressuscitado!');
    
    atualizarUI();
}

// Função de atualização de fundo (dia/noite)
function atualizarFundo() {
    if (isDayMode) {
        document.body.style.backgroundImage = fundoDia;
        document.body.style.backgroundColor = '#667eea';
    } else {
        document.body.style.backgroundImage = fundoNoite;
        document.body.style.backgroundColor = '#1a1a2e';
    }
}

// Função para atualizar a interface
function atualizarUI() {
    // Atualizar status
    const estado = estados[estadoAtual];
    statusText.textContent = estado.descricao;
    statusText.className = estado.cor;
    
    // Atualizar barra de energia
    energyBar.style.width = energia + '%';
    
    // Atualizar cor da barra de energia
    if (energia > 60) {
        energyBar.className = 'progress-value bg-success';
    } else if (energia > 30) {
        energyBar.className = 'progress-value bg-warning';
    } else {
        energyBar.className = 'progress-value bg-error';
    }
}

// Iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializar();
});

// Listener para mudança de nome
creatureName.addEventListener('change', () => {
    console.log('Nome alterado para: ' + creatureName.value);
});

// Easter egg: Botão escondido com Ferlini (Gostosinho)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F' && e.ctrlKey) {
        console.log('🌟 Você descobriu o easter egg!');
        
        const balao = document.getElementById('balaoFerlini');
        
        // Faz o balão aparecer com animação
        balao.classList.remove('hidden');
        setTimeout(() => {
            balao.classList.remove('scale-0');
            balao.classList.add('scale-100');
        }, 10);

        // Esconde depois de 4 segundos
        setTimeout(() => {
            balao.classList.remove('scale-100');
            balao.classList.add('scale-0');
            setTimeout(() => {
                balao.classList.add('hidden');
            }, 500);
        }, 4000);
        
        // Também mostra o alerta para garantir o ponto!
        alert('Ferlini (Gostosinho) 😎\n\nVocê ganhou 1 ponto extra!');
    }
});

// --- FUNÇÕES DO BOTÃO ESCONDIDO (FERLINI) ---
function revelarFerlini() {
    const modal = document.getElementById('modalFerlini');
    const card = document.getElementById('cardFerlini');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-0');
        card.classList.add('scale-100');
    }, 10);
    
    console.log('🌟 Você encontrou o botão escondido do Ferlini! +1 Ponto Extra!');
}

function fecharFerlini() {
    const modal = document.getElementById('modalFerlini');
    const card = document.getElementById('cardFerlini');
    
    card.classList.remove('scale-100');
    card.classList.add('scale-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}
