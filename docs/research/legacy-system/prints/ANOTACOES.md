Coisas a se notar

#1 Bug inicial ao selecionar janela de usuario, antes de inserir qualquer dado aparece um pop-up "Usuário não cadastrado no Sistema"
#2 Mesmo bug se repete ao selecionar a janela de senha, antes de inserir qualquer dado aparece um pop-up "Senha do usuário não confere"
#3 Tentar acessar o menu tipo participante gera erro "Access violation at address 43070000. Read of address 43070000"
#4 Erro "Exception EDatabaseError in module polhonueventos.exe at 00094A84." qrytipo_participante: Cannot perform this operation on an open dataset." + Runtime error 255 at 776F56DA


Relação de menus:

1 Menu inicial: 2 janelas, com a janela de login sobreposta
1.1 Janela de Login: Evento (drop down), Usuarion  e Senha, Janela de data com a data atual. + Botoes conecta e sair. Se tentar logar sem selecionar o evento, aparece um menu dizendo que o campo é obrigatorio ser selecionado.

Do menu inicial, temos uma header com tres opçoes: Menu, relatorios e cadastros, embaixo da header outros dois botoes, um com o nome do evento e outro chamado manutençao.

Ao clicar em menu:
Cascata drop down com as duas opçoes dos botoes (nome do evento e manutençao) + uma opção de sair.
Ao clicar em sair ele pede confirmaçao "Deseja sair do sistema?" com dois botoes: sim e não.

Ao clicar em relatórios:
Cascata drop down com as seguintes opcoes
- Relacao de Crachas emitidos
- Relacao  de participante
- Etiquetas para crachas
- Gráfico - Crachás emitidos
- Gráfico - Visitaçao
- Gráfico - Participante

Ao selecionar a relaçao de crachas, aparece uma mini janela no menu inicial com a seguinte descriçao:
Relacao de crachas emitidos
multipla escolha: todas empresas ou uma empresa
multipla escolha: todos tipos participantes ou um tipo participante

Periodo
duas janelas de selecao drop down com datas

(Botao) Gerar (Botao) Fechar

