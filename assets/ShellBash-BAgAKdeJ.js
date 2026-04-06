import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(r,{title:"Shell e Bash",subtitle:"Domine o interpretador de comandos mais popular do Linux. Aprenda variáveis, aliases, funções, scripts e estruturas de controle.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"O que é o Shell?"}),e.jsxs("p",{children:["O shell é a interface entre você e o kernel do Linux. Ele interpreta os comandos que você digita e os envia para o sistema operacional executar. O ",e.jsx("strong",{children:"Bash"})," (Bourne Again Shell) é o shell padrão na maioria das distribuições Linux e é o que usaremos neste guia."]}),e.jsxs("p",{children:["Existem outros shells como ",e.jsx("code",{children:"zsh"}),", ",e.jsx("code",{children:"fish"})," e ",e.jsx("code",{children:"dash"}),", mas o Bash continua sendo o mais utilizado e o padrão para scripts de sistema."]}),e.jsx("h2",{children:"Variáveis de Ambiente"}),e.jsx("p",{children:"Variáveis de ambiente são valores armazenados na sessão do shell que programas e scripts podem acessar. Elas controlam o comportamento do sistema e dos programas."}),e.jsx("h3",{children:"Variáveis Importantes do Sistema"}),e.jsx(o,{title:"Visualizar variáveis comuns",code:`echo $HOME        # Diretório home do usuário
echo $USER        # Nome do usuário atual
echo $SHELL       # Shell em uso
echo $PATH        # Caminhos de busca de executáveis
echo $PWD         # Diretório atual
echo $LANG        # Idioma do sistema
echo $EDITOR      # Editor padrão
echo $TERM        # Tipo de terminal`}),e.jsx("h3",{children:"Criando e Exportando Variáveis"}),e.jsx(o,{title:"Variáveis locais vs exportadas",code:`# Variável local (só existe no shell atual)
MINHA_VAR="Hello World"
echo $MINHA_VAR

# Variável exportada (disponível para processos filhos)
export MINHA_VAR="Hello World"

# Definir e exportar ao mesmo tempo
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk"

# Adicionar ao PATH
export PATH="$PATH:$HOME/.local/bin"

# Ver todas as variáveis de ambiente
env

# Ver todas as variáveis (inclusive locais)
set`}),e.jsx(a,{type:"info",title:"Convenção de nomes",children:"Por convenção, variáveis de ambiente são escritas em MAIÚSCULAS. Variáveis locais de scripts podem usar minúsculas ou camelCase."}),e.jsx("h2",{children:".bashrc vs .bash_profile"}),e.jsx("p",{children:"Entender a diferença entre esses dois arquivos é fundamental para configurar seu ambiente corretamente."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"~/.bash_profile"})," — Executado apenas em ",e.jsx("strong",{children:"login shells"})," (quando você faz login via TTY ou SSH)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"~/.bashrc"})," — Executado em ",e.jsx("strong",{children:"shells interativos não-login"})," (quando você abre um terminal no ambiente gráfico)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"~/.bash_logout"})," — Executado quando você faz logout de um login shell."]})]}),e.jsxs(a,{type:"success",title:"Dica prática",children:["Na maioria dos casos, coloque suas configurações no ",e.jsx("code",{children:"~/.bashrc"})," e adicione esta linha no ",e.jsx("code",{children:"~/.bash_profile"})," para garantir que ele sempre carregue o bashrc:"]}),e.jsx(o,{title:"~/.bash_profile",code:"[[ -f ~/.bashrc ]] && source ~/.bashrc"}),e.jsx("h2",{children:"Aliases"}),e.jsxs("p",{children:["Aliases são atalhos para comandos longos ou frequentes. Defina-os no seu ",e.jsx("code",{children:"~/.bashrc"}),"."]}),e.jsx(o,{title:"Exemplos de aliases úteis",code:`# Aliases de navegação
alias ..='cd ..'
alias ...='cd ../..'
alias ll='ls -lah --color=auto'
alias la='ls -A'

# Aliases de segurança (pedir confirmação)
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Aliases do pacman
alias update='sudo pacman -Syu'
alias install='sudo pacman -S'
alias search='pacman -Ss'
alias remove='sudo pacman -Rns'
alias orphans='sudo pacman -Rns $(pacman -Qdtq)'

# Aliases de rede
alias myip='curl ifconfig.me'
alias ports='ss -tulanp'

# Ver aliases definidos
alias

# Remover um alias temporariamente
unalias ll`}),e.jsx("h2",{children:"Funções no Bash"}),e.jsx("p",{children:"Funções são mais poderosas que aliases porque aceitam parâmetros e podem conter lógica complexa."}),e.jsx(o,{title:"Definindo funções",code:`# Criar diretório e entrar nele
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extrair qualquer tipo de arquivo compactado
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2) tar xjf "$1" ;;
            *.tar.gz)  tar xzf "$1" ;;
            *.tar.xz)  tar xJf "$1" ;;
            *.bz2)     bunzip2 "$1" ;;
            *.gz)      gunzip "$1" ;;
            *.tar)     tar xf "$1" ;;
            *.zip)     unzip "$1" ;;
            *.7z)      7z x "$1" ;;
            *)         echo "Formato não reconhecido: $1" ;;
        esac
    else
        echo "Arquivo não encontrado: $1"
    fi
}

# Buscar processo por nome
psg() {
    ps aux | grep -i "$1" | grep -v grep
}`}),e.jsx("h2",{children:"Personalização do Prompt (PS1)"}),e.jsxs("p",{children:["A variável ",e.jsx("code",{children:"PS1"})," controla a aparência do prompt do terminal."]}),e.jsx(o,{title:"Códigos especiais do PS1",code:`# Códigos disponíveis:
# \\u  - Nome do usuário
# \\h  - Hostname (curto)
# \\H  - Hostname (completo)
# \\w  - Diretório atual (caminho completo)
# \\W  - Diretório atual (apenas o nome)
# \\d  - Data
# \\t  - Hora (24h)
# \\T  - Hora (12h)
# \\n  - Nova linha
# \\$  - # se root, $ se usuário normal

# Prompt simples
PS1='\\u@\\h:\\w\\$ '

# Prompt colorido
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '

# Prompt com hora
PS1='[\\t] \\u@\\h:\\w\\$ '

# Prompt em duas linhas
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\] \\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\n\\$ '`}),e.jsx("h2",{children:"Histórico de Comandos"}),e.jsx(o,{title:"Trabalhando com o histórico",code:`# Ver o histórico completo
history

# Ver os últimos 20 comandos
history 20

# Executar o último comando
!!

# Executar o comando número 42 do histórico
!42

# Executar o último comando que começou com "sudo"
!sudo

# Buscar no histórico (Ctrl+R)
# Digite Ctrl+R e comece a digitar para buscar

# Limpar o histórico
history -c

# Configurações no ~/.bashrc
export HISTSIZE=10000         # Comandos na memória
export HISTFILESIZE=20000     # Comandos no arquivo
export HISTCONTROL=ignoredups # Ignorar duplicatas
export HISTTIMEFORMAT='%F %T '  # Adicionar data/hora`}),e.jsx("h2",{children:"Estruturas de Controle"}),e.jsx("h3",{children:"if / elif / else"}),e.jsx(o,{title:"Condicionais",code:`# Sintaxe básica
if [ "$1" = "hello" ]; then
    echo "Olá!"
elif [ "$1" = "bye" ]; then
    echo "Tchau!"
else
    echo "Comando desconhecido"
fi

# Testes com arquivos
if [ -f "/etc/pacman.conf" ]; then
    echo "Arquivo existe"
fi

if [ -d "/home/$USER" ]; then
    echo "Diretório existe"
fi

# Testes numéricos
if [ "$idade" -gt 18 ]; then
    echo "Maior de idade"
fi
# -eq (igual), -ne (diferente), -lt (menor), -le (menor ou igual)
# -gt (maior), -ge (maior ou igual)

# Testes com strings
if [ -z "$var" ]; then
    echo "Variável vazia"
fi

if [ -n "$var" ]; then
    echo "Variável não vazia"
fi

# Operadores lógicos
if [ "$a" -gt 0 ] && [ "$a" -lt 100 ]; then
    echo "Entre 0 e 100"
fi`}),e.jsx("h3",{children:"for"}),e.jsx(o,{title:"Loops for",code:`# Iterar sobre lista
for fruta in maçã banana laranja; do
    echo "Fruta: $fruta"
done

# Iterar sobre arquivos
for arquivo in *.txt; do
    echo "Processando: $arquivo"
done

# Loop com sequência numérica
for i in {1..10}; do
    echo "Número: $i"
done

# Loop estilo C
for ((i=0; i<10; i++)); do
    echo "Índice: $i"
done

# Renomear arquivos em lote
for f in *.JPG; do
    mv "$f" "\${f%.JPG}.jpg"
done`}),e.jsx("h3",{children:"while e until"}),e.jsx(o,{title:"Loops while e until",code:`# While - enquanto a condição for verdadeira
contador=0
while [ $contador -lt 5 ]; do
    echo "Contagem: $contador"
    ((contador++))
done

# Ler arquivo linha por linha
while IFS= read -r linha; do
    echo "Linha: $linha"
done < arquivo.txt

# Until - até a condição ser verdadeira
until ping -c 1 google.com &>/dev/null; do
    echo "Sem internet, tentando novamente em 5s..."
    sleep 5
done
echo "Internet conectada!"`}),e.jsx("h3",{children:"case"}),e.jsx(o,{title:"Estrutura case",code:`case "$1" in
    start)
        echo "Iniciando serviço..."
        ;;
    stop)
        echo "Parando serviço..."
        ;;
    restart)
        echo "Reiniciando serviço..."
        ;;
    status)
        echo "Verificando status..."
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac`}),e.jsx("h2",{children:"Escrevendo Scripts"}),e.jsx("h3",{children:"Estrutura Básica"}),e.jsx(o,{title:"meu_script.sh",code:`#!/bin/bash
# Shebang: indica qual interpretador usar

# Boas práticas: falhar ao encontrar erros
set -euo pipefail

# Variáveis
NOME="Arch Linux"
VERSAO="Rolling Release"

# Funções
mostrar_info() {
    echo "Sistema: $NOME"
    echo "Versão: $VERSAO"
    echo "Usuário: $USER"
    echo "Data: $(date)"
}

# Execução
echo "=== Informações do Sistema ==="
mostrar_info`}),e.jsx(o,{title:"Tornar o script executável e rodar",code:`chmod +x meu_script.sh
./meu_script.sh`}),e.jsx("h3",{children:"Variáveis Especiais"}),e.jsx(o,{title:"Variáveis especiais do Bash",code:`$0    # Nome do script
$1    # Primeiro argumento
$2    # Segundo argumento
$#    # Número de argumentos
$@    # Todos os argumentos (como lista)
$*    # Todos os argumentos (como string)
$?    # Código de saída do último comando (0 = sucesso)
$$    # PID do processo atual
$!    # PID do último processo em background`}),e.jsx("h3",{children:"Comando read"}),e.jsx(o,{title:"Lendo entrada do usuário",code:`# Leitura simples
echo "Qual seu nome?"
read nome
echo "Olá, $nome!"

# Com prompt na mesma linha
read -p "Digite sua idade: " idade

# Leitura silenciosa (para senhas)
read -sp "Digite sua senha: " senha
echo  # Nova linha após input silencioso

# Com timeout
read -t 10 -p "Responda em 10 segundos: " resposta

# Ler apenas N caracteres
read -n 1 -p "Continuar? (s/n): " opcao`}),e.jsx("h3",{children:"Arrays"}),e.jsx(o,{title:"Trabalhando com arrays",code:`# Declarar array
frutas=("maçã" "banana" "laranja" "uva")

# Acessar elementos
echo \${frutas[0]}      # maçã
echo \${frutas[2]}      # laranja

# Todos os elementos
echo \${frutas[@]}

# Tamanho do array
echo \${#frutas[@]}     # 4

# Adicionar elemento
frutas+=("manga")

# Iterar sobre array
for fruta in "\${frutas[@]}"; do
    echo "Fruta: $fruta"
done

# Arrays associativos (Bash 4+)
declare -A cores
cores[vermelho]="#FF0000"
cores[verde]="#00FF00"
cores[azul]="#0000FF"

echo \${cores[vermelho]}`}),e.jsx("h3",{children:"Exit Codes"}),e.jsx(o,{title:"Códigos de saída",code:`# Todo comando retorna um código de saída
ls /tmp
echo $?    # 0 = sucesso

ls /diretorio_inexistente
echo $?    # 2 = erro (arquivo não encontrado)

# Definir código de saída no script
exit 0     # Sucesso
exit 1     # Erro genérico

# Usar em condicionais
if grep -q "root" /etc/passwd; then
    echo "Usuário root encontrado"
fi

# Encadear com && e ||
make && echo "Build OK" || echo "Build falhou"`}),e.jsxs(a,{type:"warning",title:"Cuidado com espaços",children:["No Bash, espaços importam! ",e.jsx("code",{children:'[ "$var" = "valor" ]'})," está correto, mas ",e.jsx("code",{children:'["$var"="valor"]'})," causará erro. Sempre coloque espaços ao redor dos colchetes e operadores."]}),e.jsxs(a,{type:"info",title:"Depurando scripts",children:["Use ",e.jsx("code",{children:"bash -x script.sh"})," para executar um script em modo de depuração. Cada comando será impresso antes de ser executado, o que facilita encontrar erros. Você também pode adicionar ",e.jsx("code",{children:"set -x"})," dentro do script."]}),e.jsx("h2",{children:"Atalhos Globais do Terminal"}),e.jsx("p",{children:"Esses atalhos funcionam em qualquer terminal Linux com Bash (ou Zsh). Memorizar eles vai acelerar muito o seu trabalho:"}),e.jsx(o,{title:"Atalhos de teclado essenciais",code:`# === CONTROLE DE PROCESSOS ===
Ctrl+C    → Cancela/interrompe o comando que está rodando
Ctrl+Z    → Pausa o processo atual (retome com "fg" ou "bg")
Ctrl+D    → Faz logout da sessão (equivalente a digitar "exit")

# === EDIÇÃO DE LINHA ===
Ctrl+A    → Move o cursor para o INÍCIO da linha
Ctrl+E    → Move o cursor para o FINAL da linha
Ctrl+W    → Apaga a PALAVRA anterior ao cursor
Ctrl+U    → Apaga tudo do cursor até o INÍCIO da linha
Ctrl+K    → Apaga tudo do cursor até o FINAL da linha
Ctrl+Y    → Cola o texto que foi apagado com Ctrl+U/K/W
Ctrl+L    → Limpa a tela (equivalente ao comando "clear")

# === HISTÓRICO ===
Ctrl+R    → Busca reversa no histórico (digite parte do comando)
Ctrl+P    → Comando anterior (equivale a seta ↑)
Ctrl+N    → Próximo comando (equivale a seta ↓)
!!        → Repete o último comando executado
!$        → Último argumento do comando anterior
!abc      → Executa o último comando que começava com "abc"
!abc:p    → Mostra (sem executar) o último comando que começava com "abc"

# === EXEMPLOS PRÁTICOS ===

# Esqueceu o sudo? Use !! para repetir com sudo:
pacman -Syu
# error: you cannot perform this operation unless you are root
sudo !!
# Executa: sudo pacman -Syu

# Ctrl+R para buscar no histórico:
# (pressione Ctrl+R e digite "ssh")
# (reverse-i-search): ssh user@servidor.com
# (pressione Enter para executar ou Ctrl+G para cancelar)

# Usar o último argumento do comando anterior:
mkdir /home/joao/projetos/novo_projeto
cd !$
# Executa: cd /home/joao/projetos/novo_projeto`}),e.jsx("h2",{children:"Variáveis de Ambiente"}),e.jsx("p",{children:"Variáveis de ambiente são pares chave=valor que armazenam configurações do sistema e do usuário. Muitos programas dependem delas para funcionar corretamente."}),e.jsx(o,{title:"Gerenciar variáveis de ambiente",code:`# === VER VARIÁVEIS ===

# Listar TODAS as variáveis de ambiente
env

# Saída (exemplo parcial):
# HOME=/home/joao
# USER=joao
# SHELL=/bin/bash
# PATH=/usr/local/bin:/usr/bin:/bin
# LANG=pt_BR.UTF-8
# EDITOR=nano
# ...

# Listar todas (alternativa)
printenv

# Ver o valor de uma variável específica
printenv HOME
# /home/joao

# Ou usando echo:
echo $HOME
# /home/joao

echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

echo $SHELL
# /bin/bash

echo $USER
# joao

# === CRIAR E MODIFICAR ===

# Criar uma variável local (só existe neste terminal)
MINHA_VAR="valor qualquer"
echo $MINHA_VAR
# valor qualquer

# Exportar para processos filhos (subshells, programas que você rodar)
export MINHA_VAR="valor qualquer"

# Definir o editor padrão (usado pelo visudo, crontab, git, etc.)
export EDITOR=nano

# Adicionar diretório ao PATH (para encontrar seus scripts)
export PATH="$PATH:$HOME/scripts"

# === REMOVER ===

# Remover uma variável de ambiente
unset MINHA_VAR
echo $MINHA_VAR
# (vazio - foi removida)

# === TORNAR PERMANENTE ===

# Variáveis definidas no terminal morrem quando você fecha o terminal.
# Para tornar permanente, adicione ao ~/.bashrc ou ~/.bash_profile:

echo 'export EDITOR=nano' >> ~/.bashrc
echo 'export PATH="$PATH:$HOME/scripts"' >> ~/.bashrc

# Recarregar o arquivo:
source ~/.bashrc

# Variáveis importantes do sistema:
# HOME     = Diretório home do usuário (/home/joao)
# USER     = Nome do usuário atual
# SHELL    = Shell padrão (/bin/bash)
# PATH     = Diretórios onde o sistema procura executáveis
# LANG     = Idioma e encoding do sistema
# EDITOR   = Editor de texto padrão
# TERM     = Tipo de terminal (xterm-256color, etc.)
# PWD      = Diretório atual
# OLDPWD   = Diretório anterior (cd - usa isso)
# DISPLAY  = Servidor gráfico (X11)
# XDG_SESSION_TYPE = wayland ou x11`}),e.jsx("h2",{children:"Editores de Texto no Terminal"}),e.jsxs("p",{children:["Você vai precisar editar arquivos de configuração com frequência no Arch Linux. Os dois editores mais comuns são o ",e.jsx("code",{children:"nano"})," (mais fácil) e o ",e.jsx("code",{children:"vim"})," (mais poderoso)."]}),e.jsx("h3",{children:"Nano - Para iniciantes"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"nano"})," é simples e intuitivo. Os atalhos são mostrados na parte de baixo da tela."]}),e.jsx(o,{title:"Atalhos do Nano",code:`# Abrir um arquivo
nano /etc/pacman.conf

# Atalhos principais (^ = Ctrl):
Ctrl+O    → Salvar o arquivo (Write Out)
Ctrl+X    → Sair do editor
Ctrl+W    → Pesquisar texto no arquivo
Ctrl+K    → Recortar a linha inteira
Ctrl+U    → Colar a linha recortada
Ctrl+G    → Abrir a ajuda
Ctrl+\\   → Buscar e substituir
Alt+U     → Desfazer (undo)
Alt+E     → Refazer (redo)
Ctrl+_    → Ir para linha/coluna específica

# Navegar:
Ctrl+Y    → Página anterior (Page Up)
Ctrl+V    → Próxima página (Page Down)
Ctrl+A    → Início da linha
Ctrl+E    → Final da linha`}),e.jsx("h3",{children:"Vim - Para quem quer produtividade"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"vim"})," tem uma curva de aprendizado, mas é extremamente poderoso quando dominado. Ele funciona com ",e.jsx("strong",{children:"modos"}),":"]}),e.jsx(o,{title:"Comandos do Vim",code:`# Abrir um arquivo
vim /etc/pacman.conf

# === MODOS DO VIM ===
# Normal (padrão) → Navegação e comandos
# Insert          → Digitação de texto
# Visual          → Seleção de texto
# Command         → Comandos com :

# === ENTRAR NO MODO INSERT (para digitar) ===
i      → Inserir antes do cursor
a      → Inserir depois do cursor
o      → Nova linha abaixo e entra em insert
O      → Nova linha acima e entra em insert
Esc    → Voltar ao modo Normal

# === SALVAR E SAIR (modo Normal, digite :) ===
:w     → Salvar
:q     → Sair
:wq    → Salvar e sair
:q!    → Sair SEM salvar (forçar)
:x     → Salvar e sair (atalho para :wq)
ZZ     → Salvar e sair (sem digitar :)

# === NAVEGAÇÃO (modo Normal) ===
h j k l  → Esquerda, Baixo, Cima, Direita
w        → Próxima palavra
b        → Palavra anterior
0        → Início da linha
$        → Final da linha
gg       → Início do arquivo
G        → Final do arquivo
:42      → Ir para a linha 42

# === EDIÇÃO (modo Normal) ===
dd       → Deletar (recortar) linha inteira
yy       → Copiar linha inteira
p        → Colar abaixo
P        → Colar acima
u        → Desfazer (undo)
Ctrl+R   → Refazer (redo)
x        → Deletar caractere sob o cursor

# === BUSCAR ===
/texto   → Buscar "texto" para frente
?texto   → Buscar "texto" para trás
n        → Próxima ocorrência
N        → Ocorrência anterior
:%s/velho/novo/g  → Substituir todas as ocorrências`}),e.jsx("h3",{children:"Outros editores"}),e.jsx(o,{title:"Instalar outros editores",code:`# Emacs - Editor altamente extensível (quase um sistema operacional)
sudo pacman -S emacs
emacs arquivo.txt

# Atalhos básicos do Emacs:
# Ctrl+X Ctrl+S → Salvar
# Ctrl+X Ctrl+C → Sair
# Ctrl+G        → Cancelar comando
# Ctrl+S        → Buscar

# micro - Editor moderno (atalhos tipo Ctrl+S, Ctrl+C, Ctrl+V)
sudo pacman -S micro
micro arquivo.txt
# Funciona como um editor "normal" - Ctrl+S salva, Ctrl+Q sai`}),e.jsx("h2",{children:"Informações do Sistema"}),e.jsx("p",{children:"Comandos para obter informações sobre o hardware, kernel e estado do sistema:"}),e.jsx(o,{title:"Comandos de informação do sistema",code:`# === KERNEL E SISTEMA ===

uname -a
# Saída: Linux meupc 6.12.1-arch1-1 #1 SMP x86_64 GNU/Linux
# Mostra: kernel, hostname, versão, arquitetura, SO

uname -r        # Só a versão do kernel: 6.12.1-arch1-1
uname -m        # Arquitetura: x86_64
arch            # Mesmo que uname -m: x86_64

# === HARDWARE ===

# Informações da CPU
cat /proc/cpuinfo | head -20
# processor   : 0
# model name  : AMD Ryzen 7 5800X 8-Core Processor
# cpu MHz     : 3800.000
# cache size  : 512 KB
# cpu cores   : 8

# Resumo rápido da CPU
lscpu | head -15

# Informações de memória
cat /proc/meminfo | head -5
# MemTotal:       32768000 kB
# MemFree:        18234567 kB
# MemAvailable:   25678901 kB

# Uso de memória em formato legível
free -h
#               total   used   free   shared  buff/cache  available
# Mem:           31Gi   5.2Gi  17Gi   234Mi      8.7Gi      25Gi
# Swap:         4.0Gi     0B   4.0Gi

# === TEMPO E DATA ===

date                        # Data e hora atual
# Wed Mar 26 18:30:00 -03 2026

date +"%d/%m/%Y %H:%M"     # Formato customizado
# 26/03/2026 18:30

cal                         # Calendário do mês atual
#      March 2026
# Su Mo Tu We Th Fr Sa
#  1  2  3  4  5  6  7
#  8  9 10 11 12 13 14
# ...

cal 2026                    # Calendário do ano inteiro
cal -3                      # Mês anterior, atual e próximo

# === UPTIME ===

uptime
# 18:30:00 up 5 days, 3:42, 2 users, load average: 0.15, 0.10, 0.05
# Mostra: hora, tempo ligado, usuários logados, carga do sistema

uptime -p                   # Formato legível
# up 5 days, 3 hours, 42 minutes

# === DISPOSITIVOS ===

lsusb                       # Listar dispositivos USB
# Bus 001 Device 001: ID xxxx:xxxx Linux Foundation USB 3.0 root hub
# Bus 001 Device 003: ID xxxx:xxxx Logitech USB Receiver

lsusb -t                    # Formato árvore (mostra hierarquia)

lspci                       # Listar dispositivos PCI
# 00:02.0 VGA compatible controller: Intel Corporation ...
# 00:1f.3 Audio device: Intel Corporation ...

lspci -v                    # Detalhado (com drivers em uso)

# === QUEM ESTÁ LOGADO ===

whoami                      # Seu nome de usuário: joao
w                           # Quem está logado e o que está fazendo
# USER   TTY    FROM          LOGIN@  IDLE  WHAT
# joao   tty1   -             18:00   30.00s bash
# maria  pts/0  192.168.1.5   18:15   0.00s vim

who                         # Lista simplificada de quem está logado`}),e.jsx("h2",{children:"Agendamento de Tarefas com Cron"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"cron"})," permite agendar comandos para rodar automaticamente em horários específicos — ideal para backups, limpeza, atualizações e monitoramento."]}),e.jsx(o,{title:"Usando crontab",code:`# Instalar o cron (não vem instalado por padrão no Arch)
sudo pacman -S cronie

# Habilitar e iniciar o serviço
sudo systemctl enable cronie
sudo systemctl start cronie

# Editar as tarefas agendadas do seu usuário
crontab -e

# Listar as tarefas agendadas
crontab -l

# Remover todas as tarefas agendadas
crontab -r

# === FORMATO DO CRONTAB ===
# ┌───────────── minuto (0 - 59)
# │ ┌───────────── hora (0 - 23)
# │ │ ┌───────────── dia do mês (1 - 31)
# │ │ │ ┌───────────── mês (1 - 12)
# │ │ │ │ ┌───────────── dia da semana (0 - 7, 0 e 7 = domingo)
# │ │ │ │ │
# * * * * * comando

# === EXEMPLOS ===

# Backup todo dia às 3 da manhã
0 3 * * * tar czf /backup/home_$(date +\\%Y\\%m\\%d).tar.gz /home/joao

# Limpar cache do pacman todo domingo às 4h
0 4 * * 0 paccache -r

# Atualizar lista de mirrors todo dia 1 do mês
0 2 1 * * reflector --country Brazil --sort rate --save /etc/pacman.d/mirrorlist

# Rodar script a cada 5 minutos
*/5 * * * * /home/joao/scripts/verificar.sh

# Rodar algo de segunda a sexta às 8h
0 8 * * 1-5 /home/joao/scripts/bom_dia.sh

# Rodar a cada hora
0 * * * * /home/joao/scripts/monitorar.sh

# === CARACTERES ESPECIAIS ===
# *     = Qualquer valor
# */5   = A cada 5 (minutos, horas, etc)
# 1-5   = De 1 até 5
# 1,15  = Nos valores 1 e 15
# @reboot = Rodar uma vez quando o sistema iniciar

# Rodar um script no boot
@reboot /home/joao/scripts/ao_iniciar.sh`}),e.jsxs(a,{type:"info",title:"Cron vs Systemd Timers",children:["No Arch Linux, os ",e.jsx("code",{children:"systemd timers"})," (veja a página de Systemd) são uma alternativa moderna ao cron. Timers são mais integrados com o journal (logs) e podem ter dependências. O cron é mais simples e universal (funciona em qualquer Linux)."]}),e.jsx("h2",{children:"Desligar, Reiniciar e Logout"}),e.jsx(o,{title:"Controle de energia e sessão",code:`# === DESLIGAR ===
shutdown -h now          # Desligar imediatamente
shutdown -h +10          # Desligar em 10 minutos
shutdown -h 23:00        # Desligar às 23h
poweroff                 # Desligar imediatamente (atalho)
halt                     # Parar o sistema (pode não desligar a energia)
systemctl poweroff       # Desligar via systemd

# === REINICIAR ===
shutdown -r now          # Reiniciar imediatamente
reboot                   # Reiniciar imediatamente (atalho)
systemctl reboot         # Reiniciar via systemd

# === CANCELAR SHUTDOWN AGENDADO ===
shutdown -c              # Cancela um shutdown agendado

# === LOGOUT ===
exit                     # Sair da sessão atual
logout                   # Sair da sessão (em login shells)
Ctrl+D                   # Atalho para logout

# === DICA: Mensagem de aviso ===
shutdown -h +5 "Sistema será desligado em 5 minutos para manutenção"
# Todos os usuários logados recebem a mensagem`})]})}export{u as default};
