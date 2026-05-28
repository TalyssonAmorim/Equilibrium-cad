# Marmoraria CAD

Marmoraria CAD é uma aplicação web PWA para croquis técnicos de cozinhas, bancadas e superfícies em mármore/granito. O foco é desenho rápido em dispositivos touch e tablets com caneta, mas funciona também em desktop.

## O que o programa faz

- Desenha **linhas, retângulos, círculos, textos e formas técnicas** em um canvas com escala métrica.
- Cria **componentes de cozinha** (como cuba, tanque e fogão) com preview SVG e posicionamento no projeto.
- Oferece **seleção, redimensionamento e movimentação** de objetos.
- Suporta **grade de snap**, **pan**, **zoom** e **desfazer/refazer**.
- Persiste o projeto localmente via **IndexedDB**.
- Gera exportação para PDF e permite instalação como **PWA**.

## Principais recursos

- Interface leve com React + TypeScript
- Canvas vetorial usando **React-Konva**
- Estado gerenciado com **Zustand**
- Biblioteca de componentes e ferramentas de desenho
- Suporte touch/pointer e caneta S Pen
- Layout responsivo para uso em tablets e desktop

## Como usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra o endereço exibido no terminal no navegador. Para melhor experiência em touch, use um tablet ou emulador de dispositivo no Chrome.

### Build para produção

```bash
npm run build
npm run preview
```

### Fluxo básico

1. Selecione uma ferramenta na barra lateral ou no menu flutuante.
2. Clique/arraste no canvas para desenhar.
3. Use a ferramenta de seleção para mover ou redimensionar objetos.
4. Abra o painel de componentes para inserir cuba, tanque ou fogão.
5. Ao colocar um shape, o app volta automaticamente para a ferramenta de seleção.

## Estrutura do projeto

- `src/canvas/` — Stage comentado, camadas e renderização Konva
- `src/tools/` — Lógica das ferramentas de desenho e comportamento do pointer
- `src/store/` — Zustand para estado do canvas, seleção e projeto
- `src/components/` — UI e painéis de controle
- `src/types/` — Definições de shapes, ferramentas e componentes
- `src/hooks/` — Eventos de ponteiro, atalhos de teclado e responsividade
- `src/utils/` — Funções de câmera, grade, exportação, persistência e geometria

## Comandos úteis

- `npm run dev` — inicia o ambiente de desenvolvimento
- `npm run build` — compila a aplicação para produção
- `npm run preview` — executa a build gerada localmente
- `npm run lint` — verifica o código com ESLint

## Dependências principais

- `react`, `react-dom`
- `vite`
- `react-konva`, `konva`
- `zustand`
- `idb`
- `jspdf`
- `tailwindcss`

## Publicação no GitHub

1. Crie um repositório no GitHub.
2. Adicione o projeto e commite o código.
3. Inclua este `README.md` na raiz do repositório.
4. Opcional: configure GitHub Pages na branch de publicação.

## Contato

Se quiser estender este projeto, adicione suporte a:

- templates de cozinha e bancadas
- edição avançada de vértices
- salvamento em nuvem
- preview de impressão
- biblioteca de materiais

---

`Marmoraria CAD` é ideal para quem precisa criar esquemas técnicos de mármores e cozinhas com rapidez e toque intuitivo.