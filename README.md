<div align="center">

<img src="LOGO COURO FORTE.jpg" alt="Logo Botinas Couro Forte" width="120">

# Sistema de Controle de Estoque — Botinas Couro Forte

**Sistema web para controlar o estoque de materiais de uma fábrica de botinas: linhas, agulhas, lixas, couro, solados e mais.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsivo](https://img.shields.io/badge/Responsivo-Sim-8a4b1f?style=for-the-badge)
![Sem dependências](https://img.shields.io/badge/Depend%C3%AAncias-Nenhuma-1f8a4c?style=for-the-badge)

<!-- 👇 TROQUE "COLE-SEU-LINK-AQUI" PELO LINK DO SEU SISTEMA (os dois lugares abaixo) -->

### 🔗 [Acessar o sistema online](https://wandersondfarias.github.io/SISTEMA-DE-CONTROLE-DE-ESTOQUE-COURO-FORTE/)

<a href="COLE-SEU-LINK-AQUI">
  <img src="https://img.shields.io/badge/%F0%9F%9A%80%20ACESSAR%20O%20SISTEMA-8a4b1f?style=for-the-badge" alt="Acessar o sistema">
</a>

<br><br>

[Sobre](#-sobre-o-projeto) •
[Telas](#-telas-do-sistema) •
[Funcionalidades](#-funcionalidades) •
[Como foi feito](#-como-o-sistema-foi-feito) •
[Como usar](#-como-usar) •
[Estrutura](#-estrutura-de-pastas) •
[Contato](#-contato-da-fábrica)

</div>

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Telas do sistema](#-telas-do-sistema)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Como usar](#-como-usar)
- [Onde os dados ficam salvos](#-onde-os-dados-ficam-salvos)
- [Como o sistema foi feito](#-como-o-sistema-foi-feito)
- [Personalização](#-personalização)
- [Publicar no GitHub Pages](#-publicar-no-github-pages)
- [Contato da fábrica](#-contato-da-fábrica)
- [Licença](#-licença)

---

## 📖 Sobre o projeto

O **Sistema de Controle de Estoque** foi criado para a **Botinas Couro Forte**, de Uberaba – MG. Com ele, a fábrica controla todos os materiais usados na produção: o que entra, o que sai e o que precisa ser comprado.

O sistema é feito só com **HTML, CSS e JavaScript puro**. Ele não precisa de servidor, banco de dados nem instalação: basta abrir o arquivo `index.html` no navegador. **Todos os dados ficam salvos automaticamente**, então ao fechar e abrir o sistema de novo, tudo continua lá.

---

## 📸 Telas do sistema

### Painel geral (modo claro)
![Painel geral](IMAGE/painel-claro.png)

### Painel geral (modo escuro)
![Painel modo escuro](IMAGE/painel-escuro.png)

### Cadastro de produtos
![Produtos](IMAGE/produtos.png)

### Entrada e saída de material
![Entrada e saída](IMAGE/entrada-saida.png)

### Histórico de movimentações (modo escuro)
![Histórico](IMAGE/historico-escuro.png)

### Versão para celular
<img src="IMAGE/celular.png" alt="Versão celular" width="300">

---

## ✨ Funcionalidades

### 📊 Painel geral
- Cartões de resumo: produtos cadastrados, entradas do dia, saídas do dia, itens com estoque baixo ou zerado e **valor total em estoque**.
- Lista de **alertas de estoque baixo**, com botão rápido para dar entrada.
- **Últimas movimentações** registradas.
- Gráfico de **produtos por categoria**.
- Botões de atalho: *Novo produto*, *Entrada* e *Saída*.

### 📦 Produtos e materiais
- Cadastro, edição e exclusão de produtos.
- Campos: código, nome, categoria, unidade de medida, quantidade inicial, estoque mínimo, custo unitário, local/prateleira, fornecedor e observações.
- **Código automático** gerado pela categoria (ex.: `LIN-001`, `AGU-002`, `LIX-003`).
- O sistema não aceita dois produtos com o mesmo código.
- **Busca** por nome, código, local ou fornecedor.
- **Filtros** por categoria e por status (em estoque, baixo, zerado).
- **Ordenação** ao clicar no título das colunas.
- Status automático com selo colorido: 🟢 *Em estoque* · 🟡 *Estoque baixo* · 🔴 *Zerado*.
- Botões rápidos de **entrada (↓)** e **saída (↑)** em cada produto.

### 🔄 Entrada e saída
- Formulário com escolha de **Entrada** ou **Saída**.
- Mostra o **estoque atual** do produto e a **previsão de saldo** depois da movimentação.
- Campos: quantidade, data, responsável, nota fiscal/fornecedor (entrada) ou setor/ordem de produção (saída) e observação.
- **Bloqueia saídas maiores que o estoque disponível.**
- Avisa quando um produto fica com estoque baixo ou zerado.
- Lembra o nome do último responsável, para não precisar digitar toda vez.
- Lista das movimentações do dia.

### 🕓 Histórico
- Todas as entradas e saídas com data, hora, quantidade, **saldo após a movimentação**, responsável e observações.
- Filtros por tipo, período (de/até) e busca por texto.
- Resumo com total de registros, entradas e saídas.
- Ao excluir uma movimentação, o **estoque do produto é corrigido automaticamente**.

### 📁 Relatórios
- **Exportar planilha** (`.csv`) de produtos e do histórico, pronta para abrir no **Excel** (com acentos e separador `;` no padrão brasileiro).
- **Imprimir**: versão de impressão limpa, sem menus e botões.

### 💾 Backup e ajustes
- **Baixar backup** com todos os dados em um arquivo `.json`.
- **Restaurar backup**, para recuperar os dados ou levar para outro computador.
- Mostra a data do último backup.
- Cadastro e remoção de **categorias** e **unidades de medida**. O sistema não deixa remover uma categoria ou unidade que algum produto esteja usando.
- Opção de **apagar todos os dados**, com confirmação.

### 🎨 Interface
- **Dois botões de tema**: ☀️ *Claro* e 🌙 *Escuro*. A escolha fica salva.
- **Botão de voltar ao topo**, que aparece ao rolar a página.
- **Totalmente responsivo**: computador, tablet e celular. No celular, as tabelas viram cartões.
- Avisos na tela (notificações) e janelas de confirmação próprias.
- Atalho: a tecla `Esc` fecha as janelas abertas.
- Sincroniza automaticamente se o sistema estiver aberto em mais de uma aba.

### 📍 Rodapé
- Faixa de contato com botões de **WhatsApp** e **ligar**.
- Logo, descrição e links de acesso rápido.
- WhatsApp, celular, telefone fixo e endereço.
- **Horário de funcionamento** por dia da semana, com o **dia de hoje destacado** e o selo **"Aberto agora / Fechado agora"** calculado em tempo real.
- **Mapa do Google Maps** com a localização da fábrica e o link *Como chegar*.

---

## 🧰 Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura das telas, formulários, tabelas e janelas (modais) |
| **CSS3** | Visual, variáveis de cor (modo claro/escuro), Flexbox, Grid, animações, media queries (responsivo) e estilo de impressão |
| **JavaScript (ES6)** | Toda a lógica: cadastro, movimentações, filtros, cálculos, exportação, backup e tema |
| **localStorage** | Armazenamento dos dados no navegador |
| **Google Fonts (Inter)** | Fonte do sistema |
| **Google Maps (iframe)** | Mapa de localização no rodapé |
| **Ícones SVG** | Ícones desenhados direto no código, sem biblioteca externa |

> ✅ **Nenhum framework ou biblioteca** foi usado: sem React, sem jQuery, sem Bootstrap. É só abrir e usar.

---

## 📂 Estrutura de pastas

```
sistema-estoque-botinas/
├── index.html             # Estrutura de todas as telas, modais e rodapé
├── style.css              # Estilos, temas claro/escuro, responsivo e impressão
├── script.js              # Lógica completa do sistema
├── IMAGE/                 # Logo da empresa e prints das telas usados neste README
└── README.md              # Este arquivo
```

---

## 🚀 Como usar

### Opção 1: no computador
1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/sistema-estoque-botinas.git
   ```
2. Abra a pasta e dê **dois cliques no arquivo `index.html`**.
3. Pronto! O sistema abre no navegador (Chrome, Edge, Firefox…).

> ⚠️ Os arquivos `index.html`, `style.css` e `script.js` precisam ficar **na mesma pasta**, junto com a pasta `IMAGE` (onde está a logo).

### Primeiros passos
1. Na primeira vez, o sistema vem com **6 produtos de exemplo**. Você pode excluí-los ou apagar tudo em *Backup e Ajustes*.
2. Cadastre seus produtos em **Produtos → Novo produto**.
3. Registre o que chega e o que sai em **Entrada / Saída**.
4. Acompanhe os alertas pelo **Painel**.
5. Faça **backup** com frequência.

---

## 💾 Onde os dados ficam salvos

Os dados ficam salvos no **`localStorage` do navegador**, um espaço de armazenamento no próprio computador.

| Chave | Conteúdo |
|---|---|
| `estoque_botinas_dados_v1` | Produtos, movimentações, categorias, unidades e data do último backup |
| `estoque_tema` | Tema escolhido (`claro` ou `escuro`) |
| `estoque_responsavel` | Último nome de responsável digitado |

**Importante:**
- Os dados ficam **no navegador e no computador** onde o sistema foi usado.
- Se você **limpar o histórico ou os dados do navegador**, os dados podem ser apagados.
- Para usar em outro computador, faça **Baixar backup** em um e **Restaurar backup** no outro.
- 👉 **Recomendação:** faça backup pelo menos uma vez por semana.

---

## 🧩 Como o sistema foi feito

### Organização do código
O `script.js` está dentro de uma função autoexecutável (IIFE), para não criar variáveis globais. Ele está dividido em blocos comentados:

| Bloco | O que faz |
|---|---|
| **Configuração** | Categorias, unidades e produtos de exemplo |
| **Estado** | Carrega e salva os dados no `localStorage` (funções `carregar()` e `salvar()`) |
| **Utilidades** | Formatação de números, moeda e datas no padrão brasileiro, proteção contra código malicioso (`esc()`) e busca sem acentos |
| **Avisos e confirmação** | Notificações e janela de confirmação feitas em HTML (sem `alert()`) |
| **Navegação** | Troca de telas pelo menu, sem recarregar a página |
| **Tema** | Botões Claro e Escuro, com o atributo `data-tema` no `<html>` |
| **Painel** | Cálculo dos indicadores, alertas e gráfico por categoria |
| **Produtos** | Listagem, filtros, ordenação, cadastro, edição e exclusão |
| **Movimentação** | Registro de entradas e saídas com validação de saldo |
| **Histórico** | Listagem com filtros e exclusão com correção do estoque |
| **Exportação** | Geração de CSV compatível com o Excel |
| **Backup** | Download e restauração em JSON |
| **Rodapé** | Cálculo de "Aberto/Fechado agora" e destaque do dia atual |

### Modelo de dados

**Produto**
```json
{
  "id": "lx3k9a2b1c",
  "codigo": "LIN-001",
  "nome": "Linha de nylon 40 – preta",
  "categoria": "Linhas",
  "unidade": "cone",
  "quantidade": 24,
  "minimo": 10,
  "preco": 18.5,
  "local": "Almoxarifado A-1",
  "fornecedor": "",
  "descricao": "",
  "criadoEm": "2026-10-31T19:00:00.000Z",
  "atualizadoEm": "2026-10-31T19:00:00.000Z"
}
```

**Movimentação**
```json
{
  "id": "lx3kb7d8e9",
  "produtoId": "lx3k9a2b1c",
  "produtoNome": "Linha de nylon 40 – preta",
  "unidade": "cone",
  "tipo": "saida",
  "quantidade": 4,
  "data": "2026-10-31",
  "responsavel": "Almoxarifado",
  "documento": "Costura – OP 58",
  "obs": "",
  "saldoApos": 20,
  "criadoEm": "2026-10-31T20:32:00.000Z"
}
```

### Regras de negócio
- **Status do produto:** *Zerado* com quantidade `0`; *Estoque baixo* com quantidade menor ou igual ao estoque mínimo; nos outros casos, *Em estoque*.
- **Saída:** não é permitida se a quantidade for maior que o saldo atual.
- **Quantidade inicial:** ao cadastrar um produto com quantidade inicial, o sistema registra uma entrada automática "Estoque inicial (cadastro)".
- **Excluir movimentação:** o efeito no estoque é desfeito. A exclusão é bloqueada se deixar o saldo negativo.
- **Excluir produto:** o histórico do produto é mantido.
- **Valor em estoque:** soma de `custo unitário × quantidade` de todos os produtos.

### Visual e responsividade
- As cores são **variáveis CSS** (`--fundo`, `--texto`, `--primaria`…). O modo escuro só troca os valores dessas variáveis com `[data-tema="escuro"]`.
- Paleta em tons de **couro e marrom**, combinando com a identidade da fábrica.
- Layout com **CSS Grid** e **Flexbox**.
- Pontos de quebra (*breakpoints*): `1150px`, `960px`, `760px`, `640px`, `420px` e `340px`.
- No celular (até `760px`), as tabelas viram **cartões**: cada célula recebe o atributo `data-label` com o nome da coluna, exibido por CSS.
- O tema é aplicado **antes de a página aparecer**, por um pequeno script no `<head>`, para evitar que a tela "pisque".

---

## 🔧 Personalização

| O que mudar | Onde |
|---|---|
| Nome da empresa | `index.html`: procure por `Botinas Couro Forte` |
| Logo | Troque o arquivo `IMAGE/logo-couro-forte.png`, mantendo o mesmo nome |
| Telefones e WhatsApp | `index.html`, no rodapé: procure por `3315-0163` e `553433150163` |
| Endereço e mapa | `index.html`, no rodapé: procure por `Nair Borges Bento` |
| Horário de funcionamento | Texto em `index.html` (`listaHorario`) e cálculo em `script.js` (função `atualizarStatusAberto`) |
| Cores | `style.css`, no início do arquivo (`:root` e `[data-tema="escuro"]`) |
| Categorias e unidades padrão | `script.js`: `CATEGORIAS_PADRAO` e `UNIDADES_PADRAO` (ou pela tela *Backup e Ajustes*) |
| Produtos de exemplo | `script.js`: `EXEMPLOS` |

---

## 🌐 Publicar no GitHub Pages

Para acessar o sistema por um link na internet:

1. Suba os arquivos para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`, e clique em **Save**.
4. Em alguns minutos, o sistema fica disponível em:
   `https://SEU-USUARIO.github.io/sistema-estoque-botinas/`

> ℹ️ Mesmo publicado na internet, os dados continuam salvos **no navegador de cada pessoa**. Cada computador tem o seu estoque, e eles não são compartilhados.

---

## 📞 Contato da fábrica

<div align="center">

**Botinas Couro Forte**

📍 Rua Nair Borges Bento, 304 – Manoel Mendes · Uberaba – MG · CEP 38082-167

💬 WhatsApp: [(34) 3315-0163](https://wa.me/553433150163) · ☎️ Telefone: (34) 3315-0163

🕓 **Segunda a sexta:** 07:30 às 10:30 e 12:30 às 17:30 · **Sábado e domingo:** fechado

</div>

---

## 📄 Licença

Projeto desenvolvido para uso interno da **Botinas Couro Forte**. Todos os direitos reservados.

<div align="center">

Feito com HTML, CSS e JavaScript.

</div>
