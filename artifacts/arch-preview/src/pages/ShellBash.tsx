import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ShellBash() {
  return (
    <PageContainer
      title="Shell e Bash"
      subtitle="Variáveis, expansões, condicionais, loops, funções, arrays e scripts. Cada construção é demonstrada com comando e a saída literal que aparece no terminal."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Shell Avançado"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal aberto (Bash é o padrão da raiz, Zsh é comum em desktops).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Shell</strong> — programa que interpreta seus comandos. Bash é padrão; Zsh, Fish populares.
      </p>
      <p>
        <strong>Prompt</strong> — o que o shell desenha esperando comando.
      </p>
      <p>
        <strong>Built-in</strong> — comando interno do shell (<code>cd</code>, <code>echo</code>, <code>export</code>).
      </p>
      <p>
        <strong>Histórico</strong> — <code>history</code> + <kbd>Ctrl</kbd>+<kbd>R</kbd>.
      </p>
      <p>
        <strong>bash-completion</strong> — pacote que adiciona autocompletar inteligente.
      </p>

      <h2>O que é um shell?</h2>
      <p>
        Um shell é um programa que lê comandos do usuário, expande as construções
        da linguagem e os executa (via <code>fork</code>/<code>exec</code>). O Bash
        (Bourne Again SHell) é o padrão na maioria das distros, incluindo o Arch.
      </p>

      <TerminalBlock
        command={`echo $SHELL
bash --version | head -1`}
        output={`/bin/bash
GNU bash, version 5.2.21(1)-release (x86_64-pc-linux-gnu)`}
      />

      <TerminalBlock
        comment="quais shells estão instalados no sistema"
        command="cat /etc/shells"
        output={`# Pathnames of valid login shells.
# See shells(5) for details.

/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash
/usr/bin/zsh
/usr/bin/fish`}
      />

      <h2>Variáveis</h2>

      <TerminalBlock
        comment="atribuição: SEM espaços ao redor do ="
        command={`nome="Arch"
echo "Olá, $nome!"`}
        output="Olá, Arch!"
      />

      <TerminalBlock
        comment="${} delimita o nome — necessário antes de letra"
        command={`fruta=banana
echo "uma \${fruta}da"`}
        output="uma bananada"
      />

      <h3>Variáveis locais × exportadas</h3>

      <TerminalBlock
        command={`X=local
bash -c 'echo "filho vê: [$X]"'`}
        output="filho vê: []"
        comment="X só existe neste shell"
      />

      <TerminalBlock
        command={`export X=exportada
bash -c 'echo "filho vê: [$X]"'`}
        output="filho vê: [exportada]"
      />

      <h3>Variáveis especiais que todo script precisa</h3>

      <OutputBlock
        title="variáveis automáticas do bash"
        output={`$0    nome do script
$1..  argumentos posicionais ($1, $2, ...)
$#    quantidade de argumentos
$@    todos os argumentos (preserva separação)
$*    todos os argumentos (joined por IFS)
$?    exit code do último comando
$$    PID deste shell
$!    PID do último processo em background
$_    último argumento do comando anterior
PIPESTATUS  array com exit codes de cada etapa do pipe`}
      />

      <CodeBlock
        title="demo.sh"
        code={`#!/bin/bash
echo "script: $0"
echo "primeiro: $1"
echo "todos: $@"
echo "qtd: $#"
true
echo "rc: $?"
false
echo "rc: $?"`}
      />

      <TerminalBlock
        command="bash demo.sh foo bar baz"
        output={`script: demo.sh
primeiro: foo
todos: foo bar baz
qtd: 3
rc: 0
rc: 1`}
      />

      <h3>Variáveis de ambiente importantes</h3>

      <TerminalBlock
        command="env | sort | head -10"
        output={`DISPLAY=:0
EDITOR=nvim
HOME=/home/user
LANG=pt_BR.UTF-8
LOGNAME=user
PATH=/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin
PWD=/home/user
SHELL=/bin/bash
TERM=xterm-256color
USER=user`}
      />

      <TerminalBlock
        command={`echo $PATH | tr ':' '\\n'`}
        output={`/usr/local/sbin
/usr/local/bin
/usr/bin
/usr/lib/jvm/default/bin
/home/user/.local/bin`}
      />

      <TerminalBlock
        comment="adicionar diretório ao PATH só para esta sessão"
        command={`export PATH="$HOME/scripts:$PATH"
echo $PATH | cut -d: -f1`}
        output="/home/user/scripts"
      />

      <h2>Expansões — a verdadeira mágica do shell</h2>

      <h3>Expansão de chaves <code>{"{a,b,c}"}</code></h3>

      <TerminalBlock
        command={`echo arq{1,2,3}.txt`}
        output="arq1.txt arq2.txt arq3.txt"
      />

      <TerminalBlock
        command={`echo {a..e}`}
        output="a b c d e"
      />

      <TerminalBlock
        command={`echo {01..05}`}
        output="01 02 03 04 05"
      />

      <TerminalBlock
        comment="produto cartesiano!"
        command={`echo {dev,prod}-{web,db}.log`}
        output="dev-web.log dev-db.log prod-web.log prod-db.log"
      />

      <h3>Expansão de til <code>~</code></h3>

      <TerminalBlock
        command={`echo ~ ; echo ~root ; echo ~+ ; echo ~-`}
        output={`/home/user
/root
/home/user/projetos
/home/user`}
      />

      <h3>Expansão de parâmetro</h3>

      <OutputBlock
        title="formas mais úteis"
        output={`\${var}          valor
\${var:-DEF}     usa DEF se var estiver vazia/indef
\${var:=DEF}     atribui DEF se vazia, e usa
\${var:?MSG}     aborta com MSG se vazia
\${var:+ALT}     usa ALT se var TIVER valor
\${#var}         comprimento (em chars)
\${var:N:M}      substring começando em N, M chars
\${var#PAT}      remove menor prefixo que casa
\${var##PAT}     remove maior prefixo que casa
\${var%PAT}      remove menor sufixo
\${var%%PAT}     remove maior sufixo
\${var/PAT/REPL} substitui primeira ocorrência
\${var//PAT/REPL} substitui todas
\${var^^}        UPPERCASE
\${var,,}        lowercase`}
      />

      <TerminalBlock
        command={`f="/home/user/foto.tar.gz"
echo "basename     : \${f##*/}"
echo "dirname      : \${f%/*}"
echo "sem extensão : \${f%.*}"
echo "extensão     : \${f##*.}"
echo "trocar gz→bz2: \${f/.gz/.bz2}"`}
        output={`basename     : foto.tar.gz
dirname      : /home/user
sem extensão : /home/user/foto.tar
extensão     : gz
trocar gz→bz2: /home/user/foto.tar.bz2`}
      />

      <TerminalBlock
        command={`s="ABCDEF"
echo \${#s}
echo \${s:1:3}
echo \${s,,}`}
        output={`6
BCD
abcdef`}
      />

      <h3>Substituição de comando <code>$(...)</code></h3>

      <TerminalBlock
        command={`echo "hoje: $(date +%F)"`}
        output="hoje: 2026-03-26"
      />

      <TerminalBlock
        command={`arquivos=$(ls *.txt | wc -l)
echo "tem $arquivos arquivos"`}
        output="tem 7 arquivos"
      />

      <h3>Expansão aritmética <code>$(( ))</code></h3>

      <TerminalBlock
        command={`echo $(( 2 + 3 * 4 ))
x=10
echo $(( x ** 2 ))
echo $(( (x + 5) % 3 ))`}
        output={`14
100
0`}
      />

      <h3>Glob (path expansion)</h3>

      <TerminalBlock
        command={`ls
echo *.txt
echo arq?.log
echo [abc]*.md`}
        output={`arq1.log arq2.log arq3.log notas.md README.md ignored.md
arq1.txt arq2.txt
arq1.log arq2.log arq3.log
README.md`}
      />

      <TerminalBlock
        comment="globstar: ** desce recursivamente (precisa estar habilitado)"
        command={`shopt -s globstar
ls **/*.ts | head -3`}
        output={`src/App.ts
src/components/Header.ts
src/lib/utils.ts`}
      />

      <h2>Aspas — o detalhe que mais quebra scripts</h2>

      <TerminalBlock
        command={`nome="Ana Silva"
echo $nome      # SEM aspas
echo "$nome"    # COM aspas
echo '$nome'    # aspas simples não expandem`}
        output={`Ana Silva
Ana Silva
$nome`}
      />

      <TerminalBlock
        comment="diferença CRÍTICA quando há espaço nos nomes"
        command={`mkdir "uma pasta"
touch "uma pasta/arq.txt"
for f in uma\\ pasta/*; do echo "[$f]"; done`}
        output="[uma pasta/arq.txt]"
      />

      <AlertBox type="warning" title="Regra de ouro">
        Sempre use aspas duplas em variáveis: <code>"$var"</code>. Sem aspas, o
        shell faz word-splitting e glob expansion no valor. <code>shellcheck</code>{" "}
        avisa todas essas situações.
      </AlertBox>

      <h2>Aliases</h2>

      <TerminalBlock
        command={`alias ll='ls -lah --color=auto'
alias`}
        output={`alias ll='ls -lah --color=auto'
alias ls='ls --color=auto'
alias rm='rm -i'`}
      />

      <TerminalBlock
        command="ll | head -3"
        output={`total 24K
drwxr-xr-x  3 user user 4.0K Mar 26 18:30 .
drwxr-xr-x 14 user user 4.0K Mar 26 17:11 ..`}
      />

      <TerminalBlock
        command="unalias ll"
        output=""
      />

      <h2>Funções</h2>

      <CodeBlock
        title="formato canônico"
        code={`mkcd() {
    mkdir -p "$1" && cd "$1"
}

# múltiplos parâmetros + retorno
soma() {
    local a=$1 b=$2
    echo $((a + b))
}

# usando o retorno
total=$(soma 5 7)
echo "$total"   # 12

# retornando exit code
existe_user() {
    id "$1" &>/dev/null
}
existe_user root && echo "ok" || echo "no"`}
      />

      <TerminalBlock
        command={`source funcs.sh
mkcd /tmp/teste
pwd`}
        output="/tmp/teste"
      />

      <h2>Estruturas de controle</h2>

      <h3>if / elif / else</h3>

      <CodeBlock
        title="testes mais usados"
        code={`# strings
[[ -z "$s" ]]      # vazia?
[[ -n "$s" ]]      # não-vazia?
[[ "$a" == "$b" ]] # igual?
[[ "$a" =~ ^[0-9]+$ ]]  # regex (só com [[...]])

# números
(( a > 10 ))       # use (( )) para aritmética
[[ $a -gt 10 ]]    # alternativa POSIX

# arquivos
[[ -e arq ]]   # existe (qualquer tipo)
[[ -f arq ]]   # arquivo regular
[[ -d arq ]]   # diretório
[[ -L arq ]]   # link simbólico
[[ -r arq ]]   # legível
[[ -w arq ]]   # gravável
[[ -x arq ]]   # executável
[[ -s arq ]]   # tamanho > 0
[[ a -nt b ]]  # a mais novo que b
[[ a -ot b ]]  # a mais antigo que b`}
      />

      <CodeBlock
        title="exemplo prático"
        code={`#!/bin/bash
arq="/etc/pacman.conf"

if [[ ! -f "$arq" ]]; then
    echo "arquivo não existe" >&2
    exit 1
elif [[ ! -r "$arq" ]]; then
    echo "sem permissão de leitura" >&2
    exit 2
else
    echo "linhas: $(wc -l < "$arq")"
fi`}
      />

      <TerminalBlock
        command="bash check.sh"
        output="linhas: 117"
      />

      <h3>case</h3>

      <CodeBlock
        title="estilo init script"
        code={`#!/bin/bash
case "$1" in
    start|up)
        echo "iniciando..."
        ;;
    stop|down)
        echo "parando..."
        ;;
    restart|reload)
        echo "reiniciando..."
        ;;
    status)
        echo "ativo"
        ;;
    *.conf)
        echo "arquivo de config: $1"
        ;;
    *)
        echo "uso: $0 {start|stop|restart|status}" >&2
        exit 2
        ;;
esac`}
      />

      <TerminalBlock
        command={`bash svc.sh start
bash svc.sh stop
bash svc.sh foo`}
        output={`iniciando...
parando...
uso: svc.sh {start|stop|restart|status}`}
      />

      <h3>for</h3>

      <TerminalBlock
        command={`for f in maca banana uva; do
    echo "fruta: $f"
done`}
        output={`fruta: maca
fruta: banana
fruta: uva`}
      />

      <TerminalBlock
        command={`for i in {1..5}; do echo "n=$i"; done`}
        output={`n=1
n=2
n=3
n=4
n=5`}
      />

      <TerminalBlock
        comment="estilo C — útil para controle preciso"
        command={`for ((i=0; i<3; i++)); do
    echo "i=$i"
done`}
        output={`i=0
i=1
i=2`}
      />

      <TerminalBlock
        comment="iterando sobre arquivos com glob"
        command={`for f in *.txt; do
    echo "$(wc -l < "$f") linhas em $f"
done`}
        output={`12 linhas em notas.txt
4 linhas em todo.txt
87 linhas em receita.txt`}
      />

      <h3>while</h3>

      <TerminalBlock
        command={`i=0
while (( i < 3 )); do
    echo "tick $i"
    ((i++))
done`}
        output={`tick 0
tick 1
tick 2`}
      />

      <CodeBlock
        title="ler arquivo linha a linha (forma correta)"
        code={`while IFS= read -r linha; do
    echo "[$linha]"
done < /etc/hostname`}
      />

      <TerminalBlock
        command="bash leitor.sh"
        output="[archlinux]"
      />

      <AlertBox type="info" title="IFS= read -r — porquê?">
        <code>IFS=</code> evita o trim de espaços no início/fim;
        <code>-r</code> impede que <code>\</code> seja interpretado como escape.
        Esse é o jeito canônico de ler texto sem perder bytes.
      </AlertBox>

      <h3>until</h3>

      <CodeBlock
        title="esperar a internet voltar"
        code={`until ping -c1 -W1 1.1.1.1 &>/dev/null; do
    echo "sem rede, retry em 5s..."
    sleep 5
done
echo "online!"`}
      />

      <h2>Arrays</h2>

      <TerminalBlock
        command={`frutas=("maca" "banana" "uva" "kiwi")
echo \${frutas[0]}
echo \${frutas[2]}
echo "qtd: \${#frutas[@]}"
echo "todas: \${frutas[@]}"`}
        output={`maca
uva
qtd: 4
todas: maca banana uva kiwi`}
      />

      <TerminalBlock
        comment="adicionar / fatiar"
        command={`frutas+=("manga")
echo "\${frutas[@]}"
echo "fatia: \${frutas[@]:1:2}"`}
        output={`maca banana uva kiwi manga
fatia: banana uva`}
      />

      <TerminalBlock
        comment="iterar preservando elementos com espaço"
        command={`for f in "\${frutas[@]}"; do
    echo "- $f"
done`}
        output={`- maca
- banana
- uva
- kiwi
- manga`}
      />

      <h3>Arrays associativos (Bash 4+)</h3>

      <TerminalBlock
        command={`declare -A cor
cor[vermelho]="#FF0000"
cor[verde]="#00FF00"
cor[azul]="#0000FF"

for k in "\${!cor[@]}"; do
    echo "$k = \${cor[$k]}"
done`}
        output={`vermelho = #FF0000
verde = #00FF00
azul = #0000FF`}
      />

      <h2>Lendo entrada do usuário</h2>

      <TerminalBlock
        command={`read -p "Seu nome: " nome
echo "Olá, $nome!"`}
        output={`Seu nome: Maria
Olá, Maria!`}
      />

      <TerminalBlock
        comment="silenciosa, com timeout"
        command={`read -sp "Senha: " s ; echo
read -t 5 -p "5s para responder: " r || echo "(timeout)"`}
        output={`Senha:
5s para responder: (timeout)`}
      />

      <h2>Exit codes</h2>

      <TerminalBlock
        command={`true ; echo $?
false ; echo $?
ls /nada 2>/dev/null ; echo $?`}
        output={`0
1
2`}
      />

      <TerminalBlock
        comment="PIPESTATUS — exit code de cada etapa do pipe"
        command={`false | true | true
echo "\${PIPESTATUS[@]}"`}
        output="1 0 0"
      />

      <h2>set — opções do shell</h2>

      <CommandFlagList
        command="set"
        items={[
          { flag: "-e", description: "Sai imediatamente se um comando falhar (exit != 0)." },
          { flag: "-u", description: "Erro ao usar variável não-definida." },
          { flag: "-x", description: "Imprime cada comando antes de executar (debug)." },
          { flag: "-o pipefail", description: "Status do pipe = primeiro erro, não o último comando." },
          { flag: "-n", description: "Apenas valida sintaxe, sem executar." },
        ]}
      />

      <CodeBlock
        title="strict mode — coloque no topo de TODO script"
        code={`#!/bin/bash
set -euo pipefail
IFS=$'\\n\\t'`}
      />

      <h2>Trap — handlers de sinal</h2>

      <CodeBlock
        title="cleanup garantido"
        code={`#!/bin/bash
set -euo pipefail

TMP=$(mktemp -d)

cleanup() {
    local rc=$?
    echo "limpando $TMP (rc=$rc)" >&2
    rm -rf "$TMP"
}
trap cleanup EXIT INT TERM

# trabalho usando $TMP...
echo "criado: $TMP"
sleep 2
echo "fim normal"`}
      />

      <TerminalBlock
        command="bash worker.sh"
        output={`criado: /tmp/tmp.AbC123
fim normal
limpando /tmp/tmp.AbC123 (rc=0)`}
      />

      <TerminalBlock
        comment="com Ctrl+C no meio"
        command="bash worker.sh"
        output={`criado: /tmp/tmp.XyZ789
^C
limpando /tmp/tmp.XyZ789 (rc=130)`}
      />

      <h2>~/.bashrc, ~/.bash_profile, ~/.profile</h2>

      <OutputBlock
        title="qual arquivo carrega quando"
        output={`tipo de shell                       arquivo lido
---------------------------------   ---------------------------
login (TTY, ssh)                    ~/.bash_profile  (ou ~/.profile)
interativo não-login (terminal)     ~/.bashrc
não-interativo (script)             nenhum
ao sair de login shell              ~/.bash_logout`}
      />

      <CodeBlock
        title="receita padrão de ~/.bash_profile"
        code={`# garante que o .bashrc rode também em login shells
[[ -f ~/.bashrc ]] && source ~/.bashrc

# configurações que SÓ fazem sentido em login (PATH, locale)
export PATH="$HOME/.local/bin:$PATH"`}
      />

      <CodeBlock
        title="trecho típico de ~/.bashrc"
        code={`# se não interativo, não faz nada
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias ll='ls -lah'
alias grep='grep --color=auto'

# histórico
HISTSIZE=100000
HISTFILESIZE=200000
HISTCONTROL=ignoreboth:erasedups
HISTTIMEFORMAT='%F %T  '
shopt -s histappend cmdhist

# prompt colorido
PS1='\\[\\e[1;32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ '

# completions extras
[[ -r /usr/share/bash-completion/bash_completion ]] && \\
    . /usr/share/bash-completion/bash_completion`}
      />

      <h2>PS1 — personalizando o prompt</h2>

      <OutputBlock
        title="códigos do PS1"
        output={`\\u   nome do usuário
\\h   hostname (curto)
\\H   hostname completo
\\w   diretório atual (caminho completo, ~ para HOME)
\\W   só o nome do diretório atual
\\d   data ("Wed Mar 26")
\\t   hora 24h (HH:MM:SS)
\\T   hora 12h
\\$   # se root, $ se usuário comum
\\n   nova linha
\\[ \\] delimita sequência não-imprimível (cores)`}
      />

      <TerminalBlock
        command={`PS1='[\\u@\\h \\W]\\$ '
pwd`}
        output={`[user@archlinux ~]$ pwd
/home/user`}
      />

      <h2>Histórico — atalhos do dia a dia</h2>

      <OutputBlock
        title="bangs e teclado"
        output={`Ctrl+R   busca reversa interativa
Ctrl+P   comando anterior (= seta ↑)
Ctrl+N   próximo (= seta ↓)
!!       repete o último comando
!$       último argumento do comando anterior
!*       todos os argumentos do anterior
!abc     último comando que começava com "abc"
!abc:p   imprime mas não executa
!?xyz    último comando que CONTÉM "xyz"
^old^new substitui "old" por "new" no último`}
      />

      <TerminalBlock
        command={`mkdir /tmp/projetos
cd !$`}
        output="cd /tmp/projetos"
      />

      <TerminalBlock
        comment="esqueceu o sudo? !! resolve"
        command={`pacman -Syu`}
        output={`error: you cannot perform this operation unless you are root.`}
      />
      <TerminalBlock
        command="sudo !!"
        output={`sudo pacman -Syu
:: Synchronizing package databases...
 core         167.4 KiB   2.40 MiB/s 00:00
 extra       1739.1 KiB   8.34 MiB/s 00:00
 multilib     142.5 KiB   2.10 MiB/s 00:00
:: Starting full system upgrade...
nothing to do`}
      />

      <TerminalBlock
        command={`history | tail -3`}
        output={`  421  cd /tmp/projetos
  422  pacman -Syu
  423  sudo pacman -Syu`}
      />

      <h2>Atalhos de edição de linha</h2>

      <OutputBlock
        title="bash usa o readline (mesmo do gdb, psql)"
        output={`Ctrl+A   início da linha
Ctrl+E   final da linha
Ctrl+B   um caractere para trás       (= ←)
Ctrl+F   um caractere para frente     (= →)
Alt+B    palavra para trás
Alt+F    palavra para frente
Ctrl+W   apaga PALAVRA antes do cursor
Ctrl+U   apaga até o INÍCIO da linha
Ctrl+K   apaga até o FINAL da linha
Ctrl+Y   cola o que foi apagado
Ctrl+L   limpa a tela (= clear)
Ctrl+T   troca os 2 caracteres ao redor do cursor
Alt+.    insere o último argumento (= !$)
Ctrl+_   undo
Ctrl+X Ctrl+E   abre o $EDITOR para editar a linha atual`}
      />

      <h2>Job control</h2>

      <TerminalBlock
        command={`sleep 60 &
jobs`}
        output={`[1] 4827
[1]+  Running                 sleep 60 &`}
      />

      <TerminalBlock
        command={`sleep 30
^Z`}
        output={`[2]+  Stopped                 sleep 30`}
      />

      <TerminalBlock
        command={`bg %2
jobs`}
        output={`[2]+ sleep 30 &
[1]-  Running                 sleep 60 &
[2]+  Running                 sleep 30 &`}
      />

      <TerminalBlock
        command="fg %1"
        output={`sleep 60`}
      />

      <h2>Escrevendo um script de produção</h2>

      <CodeBlock
        title="boilerplate completo"
        code={`#!/usr/bin/env bash
# meu_script.sh — descrição do propósito
# uso: ./meu_script.sh [-v] arquivo
set -euo pipefail
IFS=$'\\n\\t'

readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="/tmp/\${SCRIPT_NAME%.sh}.log"

log()  { printf '[%s] %s\\n' "$(date +%FT%T)" "$*" | tee -a "$LOG_FILE" >&2; }
die()  { log "ERRO: $*"; exit 1; }

usage() {
    cat <<EOF
uso: $SCRIPT_NAME [-v] [-h] arquivo

  -v   verbose
  -h   mostra esta ajuda
EOF
    exit "\${1:-0}"
}

verbose=0
while getopts "vh" opt; do
    case $opt in
        v) verbose=1 ;;
        h) usage 0 ;;
        *) usage 2 ;;
    esac
done
shift $((OPTIND - 1))

[[ $# -ge 1 ]] || die "argumento obrigatório faltando"
arquivo="$1"
[[ -r "$arquivo" ]] || die "não posso ler $arquivo"

(( verbose )) && log "processando $arquivo"

# trabalho de verdade aqui
linhas=$(wc -l < "$arquivo")
log "$arquivo tem $linhas linhas"`}
      />

      <TerminalBlock
        command={`chmod +x meu_script.sh
./meu_script.sh -v /etc/hostname`}
        output={`[2026-03-26T18:51:02] processando /etc/hostname
[2026-03-26T18:51:02] /etc/hostname tem 1 linhas`}
      />

      <h2>Debug</h2>

      <TerminalBlock
        command="bash -x demo.sh foo bar"
        output={`+ echo 'script: demo.sh'
script: demo.sh
+ echo 'primeiro: foo'
primeiro: foo
+ echo 'todos: foo bar'
todos: foo bar
+ echo 'qtd: 2'
qtd: 2
+ true
+ echo 'rc: 0'
rc: 0
+ false
+ echo 'rc: 1'
rc: 1`}
      />

      <TerminalBlock
        command="shellcheck demo.sh"
        output={`In demo.sh line 3:
echo $1
     ^-- {y}SC2086{/}: Double quote to prevent globbing and word splitting.

Did you mean:
echo "$1"`}
      />

      <AlertBox type="success" title="Sempre rode shellcheck">
        <code>sudo pacman -S shellcheck</code> — pega 80% dos bugs típicos de bash
        (aspas, subshells, exit codes esquecidos, comparações erradas).
      </AlertBox>

      <h2>Cola visual</h2>

      <OutputBlock
        title="quando usar cada construção"
        output={`tarefa                       construção
--------------------------   --------------------------
testar arquivo               [[ -f arq ]] / [[ -d arq ]]
testar string                [[ -z "$s" ]] / [[ "$a" == "$b" ]]
testar regex                 [[ "$s" =~ ^[0-9]+$ ]]
aritmética                   (( i++ ))   /  $(( a + b ))
substring                    \${var:N:M}
sem extensão                 \${arq%.*}
substituir                   \${var//PAT/REPL}
ler arquivo                  while IFS= read -r linha; do ... done < arq
salvar saída                 var=$(comando)
trap cleanup                 trap funcao EXIT INT TERM`}
      />
    </PageContainer>
  );
}
