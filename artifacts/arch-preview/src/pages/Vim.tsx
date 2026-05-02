import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Vim() {
  return (
    <PageContainer
      title="Vim — tutorial profundo"
      subtitle="Modos, motions, text objects, comandos ex, .vimrc e plugins. Para quem já passou pelo Editores e quer tornar o vim a ferramenta diária."
      difficulty="avancado"
      timeToRead="60 min"
      category="Shell Avançado"
    >
      <p>
        A página <em>Editores de Texto no Terminal</em> mostrou o suficiente para sair do vim
        sem fazer estrago. Esta aqui assume que você já sabe entrar em INSERT, salvar e sair, e
        quer o que torna o vim <strong>realmente</strong> rápido: a gramática de motions e
        operadores, text objects, ex commands, registros, macros e o .vimrc.
      </p>

      <AlertBox type="info" title="Vim ou Neovim?">
        <code>nvim</code> é um fork modular com Lua, LSP nativo e Tree-sitter integrado. Tudo o
        que está aqui funciona idêntico em ambos. No Arch:{" "}
        <code>sudo pacman -S vim</code> ou <code>sudo pacman -S neovim</code>. Recomendamos
        Neovim para uso diário, Vim para aparecer em qualquer servidor remoto.
      </AlertBox>

      <h2>1. Os quatro modos (revisão)</h2>

      <OutputBlock
        title="ciclo de modos"
        output={`             i / I / a / A / o / O
   NORMAL  ─────────────────────►  INSERT
      ▲                              │
      │            ESC               │
      └──────────────────────────────┘
      │
      │ v / V / Ctrl+v
      ▼
   VISUAL ─── y/d/c (yank/delete/change) volta para NORMAL
      │
      │ :
      ▼
   COMMAND-LINE  (:w, :q, :s/foo/bar/g, :!ls)`}
      />

      <CommandFlagList
        command="entradas para INSERT mode"
        items={[
          { flag: "i", description: "Insere ANTES do cursor." },
          { flag: "I", description: "Insere no início da linha (primeiro não-branco)." },
          { flag: "a", description: "Insere DEPOIS do cursor (append)." },
          { flag: "A", description: "Insere no FIM da linha." },
          { flag: "o", description: "Abre nova linha ABAIXO e entra em insert." },
          { flag: "O", description: "Abre nova linha ACIMA e entra em insert." },
          { flag: "s", description: "Substitui caractere sob o cursor (delete + insert)." },
          { flag: "S", description: "Substitui linha inteira (delete da linha + insert)." },
          { flag: "C", description: "Change até o fim da linha (cc = linha inteira)." },
        ]}
      />

      <h2>2. Motions — como você se move</h2>

      <p>
        A regra de ouro do vim: <strong>quase tudo aceita um motion como argumento</strong>. Se
        você sabe se mover, sabe deletar, copiar e mudar.
      </p>

      <CommandFlagList
        command="motions de caractere/palavra"
        items={[
          { flag: "h j k l", description: "Esquerda, baixo, cima, direita. As setas funcionam mas atrapalham o aprendizado." },
          { flag: "w / W", description: "Próxima palavra (W ignora pontuação, considera só espaços)." },
          { flag: "b / B", description: "Palavra anterior." },
          { flag: "e / E", description: "Fim da próxima palavra." },
          { flag: "ge", description: "Fim da palavra anterior." },
          { flag: "f{c}", description: "Pula para próxima ocorrência de {c} na linha. ; repete, , inverte." },
          { flag: "F{c}", description: "Pula para ocorrência anterior na linha." },
          { flag: "t{c}", description: "Pula até ANTES de {c} (till). Útil com d/c (dt; deleta até o ;)." },
        ]}
      />

      <CommandFlagList
        command="motions de linha/arquivo"
        items={[
          { flag: "0", description: "Início da linha (coluna 0)." },
          { flag: "^", description: "Primeiro caractere não-branco da linha." },
          { flag: "$", description: "Fim da linha." },
          { flag: "gg", description: "Início do arquivo." },
          { flag: "G", description: "Fim do arquivo. {N}G ou :{N} pula para linha N." },
          { flag: "Ctrl+d / Ctrl+u", description: "Meia página para baixo / cima." },
          { flag: "Ctrl+f / Ctrl+b", description: "Página inteira para baixo / cima." },
          { flag: "H / M / L", description: "Topo / meio / base da tela visível." },
          { flag: "zz / zt / zb", description: "Centraliza / topo / base — recoloca o scroll mantendo cursor." },
          { flag: "%", description: "Pula para o par correspondente (), [], {}." },
          { flag: "{ / }", description: "Parágrafo anterior / próximo." },
          { flag: "*", description: "Busca a palavra sob o cursor (n / N navegam)." },
          { flag: "/texto", description: "Busca para frente. ?texto = para trás." },
        ]}
      />

      <h2>3. Operadores — a fórmula mágica</h2>

      <p>
        A sintaxe geral do vim é: <code>[count] {`{operador}`} {`{motion}`}</code>. Por exemplo,
        <code>3dw</code> = "delete 3 word". <code>d$</code> = "delete até fim da linha".{" "}
        <code>cf;</code> = "change até a próxima ;".
      </p>

      <CommandFlagList
        command="operadores"
        items={[
          { flag: "d", description: <>Delete (recorta para o registro). <code>dd</code> = linha inteira.</> },
          { flag: "y", description: <>Yank (copia, sem deletar). <code>yy</code> = linha inteira.</> },
          { flag: "c", description: <>Change (delete + insert). <code>cc</code> = linha inteira.</> },
          { flag: "p / P", description: "Cola depois / antes do cursor." },
          { flag: "x", description: "Apaga caractere sob o cursor (= dl)." },
          { flag: ">", description: <>Indenta para a direita. <code>&gt;&gt;</code> linha inteira.</> },
          { flag: "<", description: "Indenta para a esquerda." },
          { flag: "=", description: "Auto-indenta (= == reformata uma linha)." },
          { flag: "gu / gU", description: "Lower / Upper case (gUU = linha em maiúsculas)." },
          { flag: "gq", description: "Reformata texto para a largura do textwidth." },
          { flag: "u / Ctrl+r", description: "Undo / Redo." },
          { flag: ".", description: <>Repete a última ALTERAÇÃO. Provavelmente o atalho mais útil do vim.</> },
        ]}
      />

      <OutputBlock
        title="exemplos canônicos"
        output={`3dd        deleta 3 linhas
d$         deleta até fim da linha (= D)
d0         deleta até início da linha
diw        delete inner word (palavra sob cursor)
ci"        change inner " (substitui texto entre aspas)
da(        delete around ( (incluindo parênteses)
yy         copia linha
3yy        copia 3 linhas
2j         desce 2 linhas
gg=G       reindenta o arquivo INTEIRO
~          troca caso do caractere sob cursor
.          repete a última edição`}
      />

      <h2>4. Text objects — a parte que muda tudo</h2>

      <p>
        Text objects descrevem <strong>regiões semânticas</strong>: uma palavra, um parágrafo,
        o conteúdo entre aspas. Sintaxe: <code>i</code>{"{obj}"} = inner (sem o delimitador),{" "}
        <code>a</code>{"{obj}"} = around (com delimitador).
      </p>

      <CommandFlagList
        command="text objects (use com d/c/y/v)"
        items={[
          { flag: "iw / aw", description: "Word — uma palavra (sem/com espaço ao redor)." },
          { flag: "iW / aW", description: "WORD — sequência sem espaços (inclui pontuação)." },
          { flag: "is / as", description: "Sentence." },
          { flag: "ip / ap", description: "Paragraph." },
          { flag: 'i" / a"', description: "Conteúdo entre aspas duplas." },
          { flag: "i' / a'", description: "Aspas simples." },
          { flag: "i` / a`", description: "Backticks." },
          { flag: "i( i) ib / a(", description: "Conteúdo entre parênteses (b é alias)." },
          { flag: "i{ i} iB / a{", description: "Conteúdo entre chaves (B é alias)." },
          { flag: "i[ i] / a[", description: "Conteúdo entre colchetes." },
          { flag: "i< i> / a<", description: "Conteúdo entre <>." },
          { flag: "it / at", description: "Tag XML/HTML." },
        ]}
      />

      <OutputBlock
        title="exemplos práticos"
        output={`Texto:    foo("hello world")
                 ↑ cursor

ci"        →  foo("|")        ← apaga "hello world" e entra em insert
da(        →  foo|            ← apaga ("hello world") inteiro
yi(        copia hello world
vi"        seleciona hello world (modo visual)`}
      />

      <h2>5. Visual mode</h2>

      <CommandFlagList
        command="modos visuais"
        items={[
          { flag: "v", description: "Caractere a caractere." },
          { flag: "V", description: "Linha por linha." },
          { flag: "Ctrl+v", description: "Bloco (retangular) — edição em coluna." },
          { flag: "gv", description: "Reseleciona a última seleção visual." },
          { flag: "o", description: "Em visual: alterna entre extremidades da seleção." },
          { flag: "y / d / c / >", description: "Yank, delete, change, indent na seleção." },
          { flag: ":'<,'>s/a/b/g", description: "Substituição só dentro da seleção (vim escreve sozinho :'<,'>)." },
        ]}
      />

      <h3>5.1. Edição em coluna com Ctrl+v</h3>

      <OutputBlock
        title="adicionar // no início de várias linhas"
        output={`int x = 1;
int y = 2;
int z = 3;

1) Ctrl+v             ← entra em visual block
2) j j                ← seleciona 3 linhas (coluna 0)
3) I                  ← maiúsculo I = inserir antes
4) // (espaço)        ← digita os caracteres
5) ESC                ← aplica em TODAS as linhas

Resultado:
// int x = 1;
// int y = 2;
// int z = 3;`}
      />

      <h2>6. Ex commands (modo : )</h2>

      <p>
        Tudo que começa com <code>:</code> é um comando "ex" — o vim original (vi) só tinha esses.
        Eles aceitam ranges: <code>:10,20</code> = linhas 10 a 20, <code>:%</code> = arquivo
        inteiro, <code>:.</code> = linha atual, <code>:'&lt;,'&gt;</code> = seleção visual.
      </p>

      <CommandFlagList
        command="comandos ex essenciais"
        items={[
          { flag: ":w [arq]", description: "Salva (em outro arquivo se passar nome)." },
          { flag: ":w !sudo tee %", description: <>Salva como root quando esqueceu de abrir com sudo. <code>%</code> = nome do arquivo atual.</> },
          { flag: ":q / :q!", description: "Sai / sai descartando." },
          { flag: ":wq / :x / ZZ", description: "Salva e sai." },
          { flag: ":qa / :wqa", description: "Sai/salva TODOS os buffers (multi-arquivo)." },
          { flag: ":e arq", description: "Abre outro arquivo no buffer atual." },
          { flag: ":bn / :bp / :bd", description: "Próximo / anterior buffer / fecha buffer." },
          { flag: ":ls", description: "Lista buffers abertos." },
          { flag: ":sp / :vsp arq", description: "Split horizontal / vertical." },
          { flag: ":[range]s/PAT/REPL/FLAGS", description: <>Substituição. Flags: g (global na linha), c (confirma), i (case-i), I (case sensitive).</>, example: ":%s/foo/bar/g" },
          { flag: ":g/PAT/CMD", description: <>Em cada linha que casa, executa CMD. <code>:g/^$/d</code> apaga linhas em branco.</> },
          { flag: ":v/PAT/CMD", description: "Inverso: nas linhas que NÃO casam." },
          { flag: ":!CMD", description: <>Roda comando shell. <code>:!ls</code>, <code>:!python %</code>.</> },
          { flag: ":r !CMD", description: "Insere a saída do comando no buffer." },
          { flag: ":set OPT / :set OPT?", description: "Liga/consulta opção. Prefixe com 'no' para desligar (set nonumber)." },
          { flag: ":help TOPIC", description: "Documentação. :help :w, :help y, :help text-objects." },
        ]}
      />

      <TerminalBlock
        comment="exemplo: substituir nome em todo o arquivo, com confirmação"
        prompt=":"
        command="%s/oldName/newName/gc"
        output={`replace with newName (y/n/a/q/l/^E/^Y)?`}
      />

      <h2>7. Registros — vim tem 26 áreas de transferência</h2>

      <p>
        Cada operação <code>y</code>/<code>d</code>/<code>c</code> grava no registro padrão{" "}
        <code>"</code>. Você pode endereçar outros registros com <code>"x</code> antes da
        operação:
      </p>

      <OutputBlock
        title="registros úteis"
        output={`""        registro padrão (último yank/delete)
"0        último YANK (não é sobrescrito por delete)
"1..9     histórico de deletes (1=mais recente)
"a..z     registros nomeados (você escolhe)
"A..Z     mesmos registros, mas em modo APPEND
"+        clipboard do sistema (X11 PRIMARY com "*)
"%        nome do arquivo atual (read-only)
"/        última busca`}
      />

      <OutputBlock
        title="exemplos"
        output={`"ayy        copia linha para o registro a
"ap        cola registro a depois do cursor
"+y        copia para o clipboard do SO
"+p        cola do clipboard
:reg       lista TODOS os registros e seu conteúdo`}
      />

      <h2>8. Macros — gravação de teclas</h2>

      <CommandFlagList
        command="macros (gravações de teclado)"
        items={[
          { flag: "q{a-z}", description: "Inicia gravação no registro {a-z}." },
          { flag: "q", description: "Para a gravação." },
          { flag: "@{a}", description: "Executa o macro do registro a." },
          { flag: "@@", description: "Repete o último macro executado." },
          { flag: "{N}@a", description: "Executa o macro N vezes." },
        ]}
      />

      <OutputBlock
        title="exemplo: transformar 100 nomes em chamadas de função"
        output={`Texto inicial:        Resultado desejado:
joao                  print("ola joao")
maria                 print("ola maria")
pedro                 print("ola pedro")

Sequência:
qa                ← inicia macro 'a'
I print("ola      ← insere prefixo
ESC A ")          ← vai pro fim e adiciona sufixo
j                 ← desce uma linha
q                 ← para gravação
99@a              ← executa 99 vezes nas linhas seguintes`}
      />

      <h2>9. Janelas, buffers e tabs</h2>

      <CommandFlagList
        command="janelas (splits)"
        items={[
          { flag: "Ctrl+w s", description: "Split horizontal (mesmo arquivo)." },
          { flag: "Ctrl+w v", description: "Split vertical." },
          { flag: "Ctrl+w h/j/k/l", description: "Move foco entre splits." },
          { flag: "Ctrl+w c", description: "Fecha o split atual." },
          { flag: "Ctrl+w o", description: "Maximiza (fecha os outros)." },
          { flag: "Ctrl+w =", description: "Equaliza tamanho dos splits." },
          { flag: "Ctrl+w +/-", description: "Aumenta/diminui altura." },
          { flag: "Ctrl+w >/<", description: "Aumenta/diminui largura." },
        ]}
      />

      <CommandFlagList
        command="tabs e buffers"
        items={[
          { flag: ":tabnew arq", description: "Nova aba." },
          { flag: "gt / gT", description: "Próxima / anterior aba." },
          { flag: ":bn / :bp", description: "Próximo / anterior buffer." },
          { flag: ":b NOME", description: "Pula direto para buffer pelo nome (autocomplete com Tab)." },
          { flag: ":bd", description: "Fecha buffer atual (sem fechar split)." },
        ]}
      />

      <h2>10. ~/.vimrc — configuração séria</h2>

      <CodeBlock
        title="~/.vimrc — base recomendada para Arch"
        code={`" === Geral ===
set nocompatible              " sem modo vi legado
filetype plugin indent on     " detecta tipo de arquivo
syntax enable                 " syntax highlighting

" === Interface ===
set number                    " números de linha
set relativenumber            " relativos (potencializa motions: 5j)
set cursorline                " destaca linha do cursor
set showcmd                   " mostra comandos parciais (3d, ci...)
set wildmenu                  " autocompletar de comando
set wildmode=longest:full,full
set laststatus=2              " sempre mostra status
set scrolloff=8               " 8 linhas de margem ao rolar
set sidescrolloff=8
set signcolumn=yes            " coluna de gutter sempre visível
set termguicolors             " true color
colorscheme habamax

" === Indentação ===
set expandtab                 " tab vira espaços
set tabstop=4
set shiftwidth=4
set softtabstop=4
set autoindent
set smartindent

" === Busca ===
set ignorecase
set smartcase                 " case sensitive se houver maiúsculas na busca
set incsearch
set hlsearch
set inccommand=split          " preview de :s (Neovim)

" === Arquivos ===
set hidden                    " permite trocar buffer modificado sem salvar
set noswapfile
set nobackup
set undofile                  " histórico de undo persistente
set undodir=~/.vim/undo
set autoread

" === Splits intuitivos ===
set splitright
set splitbelow

" === Mouse ===
set mouse=a

" === Atalhos pessoais ===
let mapleader = " "           " barra de espaço como leader

" Limpa highlight de busca
nnoremap <silent> <leader>/ :nohlsearch<CR>

" Salvar / sair rápidos
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>

" Navegar entre splits sem Ctrl+w
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Mover linhas selecionadas (visual)
vnoremap J :m '>+1<CR>gv=gv
vnoremap K :m '<-2<CR>gv=gv

" Manter seleção após indentar
vnoremap < <gv
vnoremap > >gv

" Yank para clipboard com <leader>y
nnoremap <leader>y "+y
vnoremap <leader>y "+y
nnoremap <leader>p "+p`}
      />

      <h2>11. Plugin manager — vim-plug</h2>

      <p>
        Vim moderno fica muito melhor com plugins. <code>vim-plug</code> é o gerenciador mais
        usado: instala plugins do GitHub direto via Git.
      </p>

      <TerminalBlock
        comment="instala vim-plug (uma única vez)"
        command={`curl -fLo ~/.vim/autoload/plug.vim --create-dirs \\
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim`}
        output={`  % Total    % Received    Time
100  158k  100  158k    1s`}
      />

      <CodeBlock
        title="bloco para o ~/.vimrc"
        code={`" === Plugins ===
call plug#begin('~/.vim/plugged')

" Navegação
Plug 'preservim/nerdtree'             " árvore de arquivos lateral
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'               " busca difusa de arquivos/buffers/lines

" Edição
Plug 'tpope/vim-surround'             " ys/cs/ds para parênteses/aspas/tags
Plug 'tpope/vim-commentary'           " gcc / gc{motion} comenta
Plug 'tpope/vim-fugitive'             " :Git status, :Gblame, etc.
Plug 'jiangmiao/auto-pairs'           " fecha () [] {} '' "" automaticamente

" Visual
Plug 'vim-airline/vim-airline'        " status bar
Plug 'morhetz/gruvbox'                " tema clássico

call plug#end()

colorscheme gruvbox`}
      />

      <TerminalBlock
        comment="dentro do vim, instale os plugins"
        prompt=":"
        command="PlugInstall"
        output={`Updated. Elapsed time: 6.42 sec.
[ ===== ] 7/7
- Finishing ... Done!`}
      />

      <h3>11.1. vim-surround — manipulação cirúrgica</h3>

      <OutputBlock
        title="comandos do vim-surround (cs/ds/ys)"
        output={`Texto: hello world

ysiw"      "hello" world          ← y surround inner word com "
cs"'       'hello' world          ← change " para '
ds'        hello world            ← delete '
yss(       ( hello world )        ← surround line com ( )
visual + S{tag}  envolve seleção em <tag>...</tag>`}
      />

      <h2>12. Neovim — o que muda</h2>

      <TerminalBlock command="sudo pacman -S neovim" output="Packages (1) neovim-0.10.4-1" />

      <p>
        O Neovim ganha:
      </p>
      <ul>
        <li><strong>Lua</strong> como linguagem de configuração (alternativa a Vimscript).</li>
        <li><strong>LSP</strong> nativo — autocomplete e diagnostics sem plugin externo.</li>
        <li><strong>Tree-sitter</strong> — highlight estrutural (não regex).</li>
        <li><strong>:terminal</strong> — shell embutido em buffer.</li>
      </ul>

      <CodeBlock
        title="~/.config/nvim/init.lua — exemplo mínimo"
        code={`vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 4
vim.opt.tabstop = 4
vim.opt.smartcase = true

vim.g.mapleader = " "

vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")

vim.cmd("colorscheme habamax")`}
      />

      <AlertBox type="success" title="Aprenda na prática: vimtutor">
        Rode <code>vimtutor</code> no terminal — é um tutorial interativo de 30 minutos que vem
        com o vim. Faça uma vez por semana até os movimentos virarem músculo. Depois pratique
        em projetos reais e em <strong>2 semanas</strong> você é mais rápido que com mouse.
      </AlertBox>

      <h2>13. Cola visual</h2>

      <OutputBlock
        title="o que decorar primeiro"
        output={`Movimento:   h j k l   w b e   0 ^ $   gg G   Ctrl+d/u   /texto
Edição:      i a o I A O   x s S   r R   u Ctrl+r   .
Operadores:  d y c   p P   > <   ~ gu gU
Combos:      diw  ci"  da(  yy  dd  gg=G  d$
Buscar:      /pat   *   :s/a/b/g
Salvar:      :w  :wq  :q!   ZZ
Janelas:     Ctrl+w s/v/h/j/k/l/c/=
Registros:   "ay  "ap  "+y  "+p   :reg
Macros:      qa ... q   @a   @@`}
      />
    </PageContainer>
  );
}
