# 🍄 Super Moedas Bros — Controle Financeiro

Sistema web para controlar entradas e saídas de dinheiro, organizado por categoria, com tema Super Mario.

## Etapa 1 — Visual

- **Nome do sistema:** Super Moedas Bros
- **Paleta de cores:** Vermelho Mario `#E52521` • Azul céu `#5C94FC` • Verde cano `#00A800` • Amarelo moeda `#FBD000` • Marrom tijolo `#B8541C` • Preto contorno `#1A1A1A`
- **Fonte:** Press Start 2P (estilo videogame retrô, Google Fonts)
- **Estilo geral:** divertido, colorido, pixel art / retrô
- **Entradas e saídas:** entradas em **verde** com ícone 🪙 (moeda); saídas em **vermelho** com ícone 🔥; faixa colorida na lateral de cada item
- **Layout:** topo vermelho com o nome; três blocos de resumo (entradas, saídas, saldo); abaixo, formulário à esquerda e lista (com busca e filtro de categoria) à direita; no celular tudo empilha em uma coluna
- **Esboço:** pasta `esboco/` (`esboco.svg` é um wireframe de exemplo — substitua pelo desenho/print do grupo)

## Etapa 2 — Funcionalidades

1. Cadastrar entradas e saídas
2. Listar todas as movimentações
3. Pesquisar pela descrição
4. Editar
5. Excluir
6. Resumo: total de entradas, saídas e saldo
7. Desafio extra: filtro por categoria

Cada movimentação é um objeto da classe `Transacao` (`script.js`). Os dados ficam no `localStorage`. Todos os dados de exemplo são fictícios.

## Como publicar (Etapa 3)

Suba `index.html`, `style.css`, `script.js` e a pasta `esboco/` no GitHub, depois ative em **Settings > Pages > Branch main > Save**.
