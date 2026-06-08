/*
   Agro Forte, Terra Viva — Agrinho 2026
   script.js — toda a logica do site
   Wesley Daniel de Lara

   O que esse arquivo faz:
    1. Liga/desliga o menu mobile
    2. Alterna o modo escuro (e salva a escolha no navegador)
    3. Anima os numeros la no hero quando ficam visiveis
    4. Abre e fecha o acordeao de perguntas
    5. Simulador de praticas sustentaveis
    6. Quiz interativo com 5 perguntas
    7. Marca a secao ativa na navegacao conforme o scroll
*/

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. REFERENCIAS AOS ELEMENTOS DO HTML
    // =============================================
    const btnTema     = document.getElementById('btn-tema');
    const btnMenu     = document.getElementById('btn-menu');
    const menuMobile  = document.getElementById('menu-mobile');
    const btnSimular  = document.getElementById('btn-simular');
    const resultadoSim = document.getElementById('resultado-sim');

    // =============================================
    // 2. MENU MOBILE — abre e fecha
    // =============================================
    btnMenu.addEventListener('click', () => {
        const aberto = !menuMobile.classList.contains('escondido');
        menuMobile.classList.toggle('escondido', aberto);
        btnMenu.setAttribute('aria-expanded', String(!aberto));
    });

    // fecha o menu ao clicar em qualquer link dele
    menuMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuMobile.classList.add('escondido');
            btnMenu.setAttribute('aria-expanded', 'false');
        });
    });

    // =============================================
    // 3. MODO ESCURO — alterna e salva no localStorage
    // =============================================
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-tema', tema);
        localStorage.setItem('tema-terra-viva', tema);
        btnTema.textContent = tema === 'escuro' ? '☀️' : '🌙';
        btnTema.setAttribute('aria-label', tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro');
    }

    // carrega o tema salvo ou usa claro como padrao
    aplicarTema(localStorage.getItem('tema-terra-viva') || 'claro');

    btnTema.addEventListener('click', () => {
        const atual = document.documentElement.getAttribute('data-tema');
        aplicarTema(atual === 'escuro' ? 'claro' : 'escuro');
    });

    // =============================================
    // 4. CONTADORES ANIMADOS NO HERO
    // =============================================

    // vai de 0 ate o valor alvo com animacao suave
    function animarContador(el, alvo, sufixo) {
        const duracao = 1800;
        const inicio  = performance.now();

        function passo(agora) {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            // easing: desacelera conforme chega no alvo
            const valor = Math.round((1 - Math.pow(1 - progresso, 4)) * alvo);
            el.textContent = valor + sufixo;
            if (progresso < 1) requestAnimationFrame(passo);
        }

        requestAnimationFrame(passo);
    }

    // so dispara quando o hero fica visivel na tela
    const heroStats = document.querySelector('.hero-dados');
    if (heroStats) {
        new IntersectionObserver((entradas) => {
            if (entradas[0].isIntersecting) {
                document.querySelectorAll('.dado-num').forEach(el => {
                    const alvo   = parseInt(el.dataset.alvo, 10);
                    const sufixo = el.dataset.sufixo || '';
                    animarContador(el, alvo, sufixo);
                });
            }
        }, { threshold: 0.6 }).observe(heroStats);
    }

    // =============================================
    // 5. ACORDEAO DE PERGUNTAS
    // =============================================
    document.querySelectorAll('.acordeon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const aberto   = btn.getAttribute('aria-expanded') === 'true';
            const respId   = btn.getAttribute('aria-controls');
            const resposta = document.getElementById(respId);

            // fecha todos primeiro
            document.querySelectorAll('.acordeon-btn').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.acordeon-resp').forEach(r => {
                r.hidden = true;
            });

            // abre o clicado (a menos que ja estivesse aberto)
            if (!aberto) {
                btn.setAttribute('aria-expanded', 'true');
                resposta.hidden = false;
            }
        });
    });

    // =============================================
    // 6. SIMULADOR DE PRATICAS SUSTENTAVEIS
    // =============================================

    // dados de cada pratica (impacto estimado em 100 hectares)
    const dadosPraticas = {
        plantio: {
            titulo: '🌱 Plantio Direto',
            descricao: 'O plantio direto preserva a estrutura do solo, reduz erosão e sequestra carbono. Em 100 hectares, os resultados estimados são:',
            impactos: [
                { valor: '-60%',    label: 'erosão do solo' },
                { valor: '+15%',    label: 'produtividade' },
                { valor: '120t CO₂', label: 'sequestrado/ano' }
            ]
        },
        agro: {
            titulo: '🌳 Agrofloresta (ILPF)',
            descricao: 'Integrar árvores, lavoura e pecuária na mesma área diversifica a renda e recupera solos degradados. Estimativa em 100 ha:',
            impactos: [
                { valor: '200t CO₂', label: 'captado/ano' },
                { valor: '+25%',     label: 'biodiversidade' },
                { valor: '3x',       label: 'mais renda/ha' }
            ]
        },
        precisao: {
            titulo: '🛰️ Agricultura de Precisão',
            descricao: 'GPS, drones e sensores aplicam insumos só onde e quando necessário, cortando desperdícios. Em 100 hectares:',
            impactos: [
                { valor: '-30%',  label: 'uso de água' },
                { valor: '-25%',  label: 'agrotóxicos' },
                { valor: '-20%',  label: 'custo por ha' }
            ]
        },
        irrigacao: {
            titulo: '💧 Irrigação Inteligente',
            descricao: 'Gotejamento com sensores de umidade garante água só quando a planta precisa. Resultado estimado em 100 hectares:',
            impactos: [
                { valor: '-50%',     label: 'consumo de água' },
                { valor: '+20%',     label: 'produtividade' },
                { valor: '0 dias',   label: 'estresse hídrico' }
            ]
        },
        bio: {
            titulo: '🦠 Bioinsumos',
            descricao: 'Substitutos biológicos de fertilizantes e pesticidas químicos reduzem impacto ambiental e custo. Em 100 ha:',
            impactos: [
                { valor: '-40%',  label: 'fertilizante químico' },
                { valor: '-35%',  label: 'defensivos' },
                { valor: '+10%',  label: 'saúde do solo' }
            ]
        }
    };

    let praticaSelecionada = null;

    // marca a opcao clicada
    document.querySelectorAll('.sim-opcao').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sim-opcao').forEach(b => {
                b.classList.remove('ativo');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('ativo');
            btn.setAttribute('aria-checked', 'true');
            praticaSelecionada = btn.dataset.pratica;
        });
    });

    // calcula e exibe o resultado
    btnSimular.addEventListener('click', () => {
        if (!praticaSelecionada) {
            resultadoSim.innerHTML = '<p style="color:var(--terra);font-weight:600;">⚠️ Selecione uma prática antes de simular.</p>';
            resultadoSim.classList.remove('escondido');
            return;
        }

        const dados = dadosPraticas[praticaSelecionada];

        resultadoSim.innerHTML = `
            <h4>${dados.titulo}</h4>
            <p>${dados.descricao}</p>
            <div class="sim-impactos">
                ${dados.impactos.map(i => `
                    <div class="sim-impacto">
                        <strong>${i.valor}</strong>
                        <span>${i.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
        resultadoSim.classList.remove('escondido');
    });

    // =============================================
    // 7. QUIZ INTERATIVO
    // =============================================

    // perguntas do quiz — todas relacionadas ao tema do projeto
    const perguntas = [
        {
            texto: 'Qual bioma brasileiro é chamado de "berço das águas"?',
            opcoes: ['Amazônia', 'Pantanal', 'Cerrado', 'Mata Atlântica'],
            correta: 2,
            explicacao: 'O Cerrado abriga as nascentes das principais bacias hidrográficas do Brasil, por isso é chamado de "berço das águas".'
        },
        {
            texto: 'O que é o plantio direto?',
            opcoes: [
                'Plantar sem adubo',
                'Técnica que evita revolver o solo, preservando sua estrutura',
                'Plantar diretamente na terra sem irrigação',
                'Usar apenas sementes naturais'
            ],
            correta: 1,
            explicacao: 'O plantio direto evita arar o solo, o que preserva a vida microbiana, reduz erosão e ajuda a reter carbono.'
        },
        {
            texto: 'O que significa a sigla ILPF?',
            opcoes: [
                'Instituto de Lavoura e Pecuária Familiar',
                'Integração Lavoura-Pecuária-Floresta',
                'Índice de Lavagem e Preservação Florestal',
                'Instituto de Leis e Proteção Florestal'
            ],
            correta: 1,
            explicacao: 'ILPF é a Integração Lavoura-Pecuária-Floresta, sistema que combina árvores, lavoura e animais na mesma área.'
        },
        {
            texto: 'Qual região concentra o maior avanço do agronegócio sobre o Cerrado nos últimos anos?',
            opcoes: ['Sudeste', 'Sul', 'Matopiba', 'Pantanal'],
            correta: 2,
            explicacao: 'O Matopiba (Maranhão, Tocantins, Piauí e Bahia) é onde o avanço do agronegócio sobre o Cerrado está mais concentrado.'
        },
        {
            texto: 'Qual é a principal vantagem da irrigação inteligente por gotejamento?',
            opcoes: [
                'Custo zero de instalação',
                'Entrega água só quando a planta precisa, reduzindo o desperdício',
                'Funciona sem energia elétrica',
                'Elimina completamente o uso de fertilizantes'
            ],
            correta: 1,
            explicacao: 'O gotejamento com sensores de umidade aplica água de forma precisa, podendo reduzir o consumo em até 50% comparado à irrigação convencional.'
        }
    ];

    let questaoAtual = 0;
    let pontuacao    = 0;
    let respondeu    = false;

    // monta a questao atual na tela
    function mostrarQuestao() {
        const q = perguntas[questaoAtual];

        document.getElementById('quiz-questao-num').textContent =
            `Questão ${questaoAtual + 1} de ${perguntas.length}`;

        const progresso = ((questaoAtual + 1) / perguntas.length) * 100;
        const barraEl   = document.getElementById('quiz-progresso');
        barraEl.style.width = progresso + '%';
        barraEl.setAttribute('aria-valuenow', progresso);

        document.getElementById('quiz-pergunta').textContent = q.texto;

        const opcoesEl = document.getElementById('quiz-opcoes');
        opcoesEl.innerHTML = '';

        q.opcoes.forEach((opcao, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opcao';
            btn.textContent = opcao;
            btn.type = 'button';
            btn.addEventListener('click', () => responder(i));
            opcoesEl.appendChild(btn);
        });

        const feedback = document.getElementById('quiz-feedback');
        feedback.classList.add('escondido');
        feedback.className = 'quiz-feedback escondido';

        document.getElementById('btn-proxima').classList.add('escondido');
        respondeu = false;
    }

    // processa a resposta do usuario
    function responder(indice) {
        if (respondeu) return;
        respondeu = true;

        const q       = perguntas[questaoAtual];
        const opcoes  = document.querySelectorAll('.quiz-opcao');
        const feedback = document.getElementById('quiz-feedback');

        // desabilita todas as opcoes
        opcoes.forEach(btn => btn.disabled = true);

        if (indice === q.correta) {
            pontuacao++;
            opcoes[indice].classList.add('correta');
            feedback.textContent = '✅ Correto! ' + q.explicacao;
            feedback.className   = 'quiz-feedback certo';
        } else {
            opcoes[indice].classList.add('errada');
            opcoes[q.correta].classList.add('correta');
            feedback.textContent = '❌ Errado. ' + q.explicacao;
            feedback.className   = 'quiz-feedback errado';
        }

        feedback.classList.remove('escondido');

        // atualiza placar
        document.getElementById('quiz-placar').textContent = `${pontuacao} ponto${pontuacao !== 1 ? 's' : ''}`;

        // mostra botao de proxima
        document.getElementById('btn-proxima').classList.remove('escondido');
    }

    // avanca para proxima questao ou mostra resultado
    function proximaQuestao() {
        questaoAtual++;
        if (questaoAtual < perguntas.length) {
            mostrarQuestao();
        } else {
            mostrarResultado();
        }
    }

    // exibe a tela de resultado final
    function mostrarResultado() {
        document.getElementById('quiz-ativo').classList.add('escondido');
        const resultadoEl = document.getElementById('quiz-resultado');
        resultadoEl.classList.remove('escondido');

        document.getElementById('quiz-nota-final').textContent = pontuacao;

        let mensagem = '';
        if (pontuacao === 5)      mensagem = 'Excelente! Você domina o tema — devia ter feito o projeto junto comigo! 🌿';
        else if (pontuacao >= 3)  mensagem = 'Bom resultado! Você entende bem o agro sustentável.';
        else                      mensagem = 'Vale a pena explorar mais o tema — as perguntas vieram direto da minha pesquisa!';

        document.getElementById('quiz-mensagem-final').textContent = mensagem;
    }

    // reinicia o quiz do zero
    window.recomecarQuiz = function () {
        questaoAtual = 0;
        pontuacao    = 0;
        respondeu    = false;
        document.getElementById('quiz-resultado').classList.add('escondido');
        document.getElementById('quiz-ativo').classList.remove('escondido');
        document.getElementById('quiz-placar').textContent = '0 pontos';
        mostrarQuestao();
    };

    // vincula o botao de proxima
    document.getElementById('btn-proxima').addEventListener('click', proximaQuestao);

    // inicializa o quiz
    mostrarQuestao();

    // =============================================
    // 8. DESTAQUE DA SECAO ATIVA NA NAVEGACAO
    // =============================================
    const secoes = document.querySelectorAll('section[id]');
    const linksNav = document.querySelectorAll('.nav-links a');

    // marca o link da secao que estiver mais visivel na tela
    const observadorNav = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                linksNav.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + entrada.target.id) {
                        link.style.color = '#a8d48a';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    secoes.forEach(s => observadorNav.observe(s));

}); // fim do script
