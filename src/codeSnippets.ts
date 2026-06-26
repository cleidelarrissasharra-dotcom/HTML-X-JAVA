export const htmlCode = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conexão HTML e JavaScript</title>
    <script src="script.js" defer></script>
</head>
<body>

    <h1 id="titulo"></h1>
    <ul></ul>
    <a href="https://prozeducacao.com.br"></a>
    <ol id="lista-ordenada"></ol>

</body>
</html>`;

export const jsCode = `// 1. Captura dos quatro elementos criados no HTML
const titulo = document.getElementById('titulo');
const listaNaoOrdenada = document.querySelector('ul');
const link = document.querySelector('a');
const listaOrdenada = document.getElementById('lista-ordenada');

// 2. Adicionando conteúdo textual usando .innerText
titulo.innerText = 'Bem-vindo ao Projeto!';
link.innerText = 'Visite a Proz Educação';

// 3. Adicionando três itens simples na lista não ordenada (ul) usando .innerHTML
listaNaoOrdenada.innerHTML = \`
    <li>Item simples 1</li>
    <li>Item simples 2</li>
    <li>Item simples 3</li>
\`;

// 4. Adicionando três itens com links na lista ordenada (ol) usando .innerHTML
listaOrdenada.innerHTML = \`
    <li><a href="https://www.google.com" target="_blank">Google</a></li>
    <li><a href="https://www.github.com" target="_blank">GitHub</a></li>
    <li><a href="https://www.wikipedia.org" target="_blank">Wikipedia</a></li>
\`;`;

export interface ExecStep {
  id: number;
  title: string;
  description: string;
  jsLines: number[]; // 1-indexed lines of JS to highlight
  htmlTargetIds: string[]; // DOM elements affected ('titulo', 'ul', 'a', 'lista-ordenada')
  actionType: 'capture' | 'innerText' | 'innerHTML' | 'initial';
}

export const execSteps: ExecStep[] = [
  {
    id: 0,
    title: "1. Estado Inicial (Apenas HTML)",
    description: "O documento HTML é carregado pelo navegador. Os elementos estruturais existem na página, mas estão completamente vazios e sem estilo ou conteúdo.",
    jsLines: [],
    htmlTargetIds: [],
    actionType: 'initial'
  },
  {
    id: 1,
    title: "2. Seleção de Elementos (DOM)",
    description: "O JavaScript usa os métodos `document.getElementById` e `document.querySelector` para buscar e mapear os elementos do HTML em variáveis na memória.",
    jsLines: [2, 3, 4, 5],
    htmlTargetIds: ['titulo', 'ul', 'a', 'lista-ordenada'],
    actionType: 'capture'
  },
  {
    id: 2,
    title: "3. Conteúdo Simples (.innerText)",
    description: "A propriedade `.innerText` insere texto puro de forma segura dentro do `<h1>` e da tag `<a>`. O navegador renderiza o texto exatamente como digitado.",
    jsLines: [8, 9],
    htmlTargetIds: ['titulo', 'a'],
    actionType: 'innerText'
  },
  {
    id: 3,
    title: "4. Lista não Ordenada (.innerHTML)",
    description: "A propriedade `.innerHTML` interpreta a string como tags HTML reais. Aqui, injetamos três elementos `<li>` filhos dentro da lista `<ul>` de uma vez.",
    jsLines: [12, 13, 14, 15, 16],
    htmlTargetIds: ['ul'],
    actionType: 'innerHTML'
  },
  {
    id: 4,
    title: "5. Lista Ordenada Interativa (.innerHTML)",
    description: "Injetamos três itens com links ancorados (`<a>`) apontando para Google, GitHub e Wikipedia dentro de `<ol id='lista-ordenada'>`, completos com links que abrem em novas abas.",
    jsLines: [19, 20, 21, 22, 23],
    htmlTargetIds: ['lista-ordenada'],
    actionType: 'innerHTML'
  }
];
