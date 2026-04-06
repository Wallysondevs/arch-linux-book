import{j as a}from"./ui-K-J8Jkwj.js";import{P as i}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function v(){return a.jsxs(i,{title:"Vim & Neovim",subtitle:"O editor de texto mais poderoso do Linux. Do básico ao avançado — modos, comandos, personalização com Lua e transforme o Neovim em um IDE completo.",difficulty:"intermediario",timeToRead:"25 min",children:[a.jsx("h2",{children:"Por que aprender Vim/Neovim?"}),a.jsx("p",{children:"Vim está disponível em praticamente qualquer sistema Linux/Unix. Saber usar o Vim é essencial para administradores de sistemas, pois você sempre poderá editar arquivos mesmo em servidores sem interface gráfica ou com poucos recursos."}),a.jsx("p",{children:"O Neovim é um fork moderno do Vim com:"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Melhor suporte a plugins com Lua (mais rápido que VimScript)"}),a.jsx("li",{children:"LSP (Language Server Protocol) nativo"}),a.jsx("li",{children:"Tree-sitter para syntax highlighting avançado"}),a.jsx("li",{children:"API assíncrona completa"}),a.jsx("li",{children:"Comunidade de plugins muito ativa"})]}),a.jsx("h2",{children:"Instalação"}),a.jsx(e,{title:"Instalar Vim e Neovim",code:`# Instalar Neovim (recomendado)
sudo pacman -S neovim

# Instalar Vim clássico (sempre disponível)
sudo pacman -S vim

# Versões específicas (via AUR)
yay -S neovim-git        # Versão de desenvolvimento
yay -S neovim-nightly    # Build nightly

# Verificar versão
nvim --version
vim --version`}),a.jsx("h2",{children:"Os Modos do Vim"}),a.jsx("p",{children:"A característica mais distinta do Vim é ter múltiplos modos de operação:"}),a.jsxs("ul",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Normal"})," — Modo padrão. Para navegar e executar comandos. Tecla: ",a.jsx("code",{children:"Esc"})]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Insert"})," — Para digitar texto. Tecla: ",a.jsx("code",{children:"i"}),", ",a.jsx("code",{children:"a"}),", ",a.jsx("code",{children:"o"}),", etc."]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Visual"})," — Para selecionar texto. Tecla: ",a.jsx("code",{children:"v"}),", ",a.jsx("code",{children:"V"}),", ",a.jsx("code",{children:"Ctrl+v"})]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Command"})," — Para executar comandos `:`. Tecla: ",a.jsx("code",{children:":"})]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Replace"})," — Para substituir caracteres. Tecla: ",a.jsx("code",{children:"R"})]})]}),a.jsx("h2",{children:"Comandos Essenciais de Navegação"}),a.jsx(e,{title:"Navegação no modo Normal",code:`# Movimento básico
h j k l    # ← ↓ ↑ →

# Palavras
w          # Próxima palavra (início)
b          # Palavra anterior (início)
e          # Fim da palavra atual
W B E      # Igual mas ignora pontuação

# Linha
0          # Início da linha
^          # Primeiro caractere não-espaço
$          # Fim da linha

# Arquivo
gg         # Início do arquivo
G          # Fim do arquivo
50G        # Ir para linha 50
Ctrl+g     # Ver linha atual e total

# Scroll
Ctrl+d     # Rolar meia tela para baixo
Ctrl+u     # Rolar meia tela para cima
Ctrl+f     # Rolar tela inteira para baixo
Ctrl+b     # Rolar tela inteira para cima

# Busca
/padrão    # Buscar para frente
?padrão    # Buscar para trás
n          # Próxima ocorrência
N          # Ocorrência anterior
*          # Buscar palavra sob o cursor
#          # Buscar palavra sob o cursor (para trás)

# Saltar
f{char}    # Ir para próxima ocorrência de {char} na linha
t{char}    # Ir até antes de {char}
F e T      # Versões para trás
%          # Pular entre parênteses/chaves/colchetes correspondentes`}),a.jsx("h2",{children:"Edição de Texto"}),a.jsx(e,{title:"Editar no modo Normal",code:`# Entrar no modo INSERT
i          # Inserir antes do cursor
a          # Inserir após o cursor
I          # Inserir no início da linha
A          # Inserir no fim da linha
o          # Nova linha abaixo e entrar em INSERT
O          # Nova linha acima e entrar em INSERT
s          # Substituir caractere sob cursor
S          # Substituir linha inteira

# Copiar (yank), cortar e colar
yy         # Copiar linha inteira
y3j        # Copiar 3 linhas abaixo
yiw        # Copiar palavra (inner word)
yit        # Copiar dentro de tag HTML
y$         # Copiar até o fim da linha
dd         # Cortar linha inteira
d3j        # Cortar 3 linhas abaixo
diw        # Cortar palavra
D          # Cortar até o fim da linha
p          # Colar após cursor
P          # Colar antes do cursor

# Desfazer e refazer
u          # Desfazer
Ctrl+r     # Refazer

# Deletar
x          # Deletar caractere sob cursor
dw         # Deletar palavra
d$         # Deletar até fim da linha
dd         # Deletar linha

# Operador + Movimento (gramática Vim)
# [operador][count][movimento]
d2w        # Deletar 2 palavras
y5j        # Copiar 5 linhas abaixo
c3l        # Mudar (substituir) 3 caracteres à direita`}),a.jsx("h2",{children:"Comandos de Arquivo"}),a.jsx(e,{title:"Salvar, sair e gerenciar arquivos",code:`# Modo de Comando (:)
:w         # Salvar
:w arquivo.txt  # Salvar como
:wq        # Salvar e sair
:x         # Salvar e sair (apenas se houver mudanças)
:q         # Sair (falha se houver mudanças não salvas)
:q!        # Sair sem salvar (forçar)
:wq!       # Salvar e sair forçado (para read-only)

# Múltiplos arquivos
:e outro-arquivo.txt    # Abrir outro arquivo
:bn                      # Próximo buffer
:bp                      # Buffer anterior
:ls                      # Listar buffers abertos
:b1                      # Ir para buffer 1
:bd                      # Fechar buffer atual

# Janelas divididas (splits)
:sp arquivo.txt         # Dividir horizontalmente
:vsp arquivo.txt        # Dividir verticalmente
Ctrl+w h/j/k/l          # Navegar entre divisões
Ctrl+w =                # Igualar tamanho das divisões
Ctrl+w _                # Maximizar divisão horizontal
Ctrl+w |                # Maximizar divisão vertical`}),a.jsx("h2",{children:"Busca e Substituição"}),a.jsx(e,{title:"Substituição avançada",code:`# Substituição básica (linha atual)
:s/antigo/novo/          # Primeira ocorrência
:s/antigo/novo/g         # Todas na linha
:s/antigo/novo/gi        # Todas, case-insensitive

# Substituição em todo o arquivo
:%s/antigo/novo/g        # Todas as ocorrências
:%s/antigo/novo/gc       # Com confirmação em cada uma

# Substituição em range
:5,15s/antigo/novo/g     # Linhas 5 a 15
:'<,'>s/antigo/novo/g    # Seleção visual

# Expressões regulares na substituição
:%s/\bfoo\b/bar/g        # Palavra exata "foo"
:%s/^s+//              # Remover espaços no início
:%s/s+$//              # Remover espaços no final

# Referências de grupo
:%s/\\(foo\\)\\(bar\\)/\\2\\1/ # Inverter foo e bar

# Comando global (executar em linhas que correspondem)
:g/padrão/d              # Deletar linhas com padrão
:g/padrão/y A            # Copiar linhas com padrão para registro A
:g!/padrão/d             # Deletar linhas SEM padrão`}),a.jsx("h2",{children:"Configurando o Neovim com Lua"}),a.jsx(e,{title:"~/.config/nvim/init.lua básico",code:`-- Configurações básicas
vim.opt.number = true           -- Números de linha
vim.opt.relativenumber = true   -- Números relativos
vim.opt.tabstop = 2             -- Tab = 2 espaços
vim.opt.shiftwidth = 2          -- Indentação = 2 espaços
vim.opt.expandtab = true        -- Usar espaços em vez de tabs
vim.opt.smartindent = true      -- Indentação inteligente
vim.opt.wrap = false            -- Não quebrar linhas
vim.opt.ignorecase = true       -- Busca case-insensitive
vim.opt.smartcase = true        -- Case-sensitive se houver maiúscula
vim.opt.hlsearch = false        -- Não destacar busca após pesquisar
vim.opt.incsearch = true        -- Busca incremental
vim.opt.termguicolors = true    -- Cores verdadeiras
vim.opt.scrolloff = 8           -- Manter 8 linhas visíveis ao rolar
vim.opt.signcolumn = "yes"      -- Sempre mostrar coluna de sinais
vim.opt.updatetime = 50         -- Atualização mais rápida
vim.opt.clipboard = "unnamedplus" -- Usar clipboard do sistema

-- Leader key
vim.g.mapleader = " "

-- Atalhos básicos
vim.keymap.set("n", "<leader>w", ":w<CR>")           -- Salvar
vim.keymap.set("n", "<leader>q", ":q<CR>")           -- Sair
vim.keymap.set("n", "<C-h>", "<C-w>h")               -- Navegar splits
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")         -- Mover linha selecionada
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")`}),a.jsx("h2",{children:"Gerenciador de Plugins: lazy.nvim"}),a.jsx(e,{title:"Configurar lazy.nvim",code:`-- Em ~/.config/nvim/init.lua ou ~/.config/nvim/lua/plugins.lua

-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({ "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git", "--branch=stable", lazypath })
end
vim.opt.rtp:prepend(lazypath)

-- Carregar plugins
require("lazy").setup({
  -- Colorscheme
  { "catppuccin/nvim", name = "catppuccin", priority = 1000 },

  -- Telescope (busca fuzzy)
  { "nvim-telescope/telescope.nvim", dependencies = { "nvim-lua/plenary.nvim" } },

  -- Tree-sitter (syntax highlighting avançado)
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },

  -- LSP
  { "neovim/nvim-lspconfig" },
  { "williamboman/mason.nvim" },          -- Gerenciar LSPs
  { "williamboman/mason-lspconfig.nvim" },

  -- Autocompletar
  { "hrsh7th/nvim-cmp" },
  { "hrsh7th/cmp-nvim-lsp" },
  { "L3MON4D3/LuaSnip" },

  -- File explorer
  { "nvim-tree/nvim-tree.lua" },
  { "nvim-tree/nvim-web-devicons" },

  -- Status line
  { "nvim-lualine/lualine.nvim" },

  -- Git
  { "lewis6991/gitsigns.nvim" },
  { "tpope/vim-fugitive" },
})`}),a.jsxs(r,{type:"success",title:"Distribuições prontas do Neovim",children:["Se não quiser configurar tudo do zero, existem distribuições prontas:",a.jsx("strong",{children:"LazyVim"})," (mais popular, baseado em lazy.nvim),",a.jsx("strong",{children:"NvChad"})," (visual bonito) e",a.jsx("strong",{children:"AstroNvim"})," (completo e organizado). Instale com um único comando e tenha um IDE completo imediatamente."]})]})}export{v as default};
