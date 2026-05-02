import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Aliases() {
  return (
    <PageContainer
      title="Aliases e Funções do Shell"
      subtitle="Atalhos persistentes para os comandos que você digita 100 vezes por dia. Inclui um arsenal pronto para pacman, systemctl, git e navegação no Arch."
      difficulty="iniciante"
      timeToRead="20 min"
      category="Shell"
    >
      <p>
        Um <strong>alias</strong> é um nome curto para um comando longo. Toda vez que o
        bash vê o nome no início de uma linha, substitui pelo conteúdo do alias antes de
        executar. É a forma mais barata e mais usada de produtividade no terminal.
      </p>

      <AlertBox type="info" title="Aliases vs funções">
        Use <strong>alias</strong> quando só precisa renomear/concatenar flags fixas. Use{" "}
        <strong>função</strong> quando precisa de argumentos posicionais{" "}
        (<code>$1</code>, <code>$@</code>) ou lógica (<code>if</code>, <code>case</code>).
      </AlertBox>

      <h2>1. Sintaxe e operações básicas</h2>

      <CommandFlagList
        command="alias"
        items={[
          { flag: "alias", description: "Lista TODOS os aliases definidos no shell atual." },
          { flag: "alias NOME", description: "Mostra a definição de um alias específico.", example: "alias ll" },
          { flag: "alias NOME='COMANDO'", description: "Cria/substitui um alias.", example: "alias ll='ls -lh --color=auto'" },
          { flag: "unalias NOME", description: "Remove um alias.", example: "unalias ll" },
          { flag: "unalias -a", description: "Remove TODOS." },
          { flag: "\\NOME", description: "Bypass: executa o comando original ignorando o alias.", example: "\\ls  # roda /usr/bin/ls cru" },
          { flag: "command NOME", description: "Outra forma de bypass (mais semântica).", example: "command ls" },
        ]}
      />

      <TerminalBlock
        command={`alias hoje='date +%F'
hoje`}
        output={`2026-03-26`}
      />

      <TerminalBlock
        command="alias hoje"
        output={`alias hoje='date +%F'`}
      />

      <TerminalBlock
        command="alias | head -10"
        output={`alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l='ls -CF'
alias la='ls -A'
alias ll='ls -alF'
alias ls='ls --color=auto'`}
      />

      <h2>2. Onde aliases vivem (persistência)</h2>

      <p>
        Aliases definidos no terminal somem ao fechar a sessão. Para fazer um alias{" "}
        <em>permanente</em>, coloque a definição no <code>~/.bashrc</code>{" "}
        (recomendado para Arch + bash). Para todos os usuários, em{" "}
        <code>/etc/bash.bashrc</code> ou em um arquivo dentro de{" "}
        <code>/etc/profile.d/</code>.
      </p>

      <OutputBlock
        title="hierarquia recomendada"
        output={`~/.bashrc                       seus aliases pessoais
~/.config/aliases.sh            organizado em arquivo separado (opcional)
                                 (carregado por: . ~/.config/aliases.sh em ~/.bashrc)
/etc/bash.bashrc                 todo usuário do sistema
/etc/profile.d/aliases.sh        outra forma para todo usuário`}
      />

      <CodeBlock
        title="trecho típico de ~/.bashrc"
        language="bash"
        code={`# === Aliases ===

# Carregar arquivo separado se existir (mantém .bashrc limpo)
[[ -f ~/.config/aliases.sh ]] && . ~/.config/aliases.sh

# Definições inline
alias ll='ls -lh --color=auto --group-directories-first'
alias la='ls -lha --color=auto --group-directories-first'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# Sempre confirmar destruição
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'`}
      />

      <TerminalBlock
        comment="aplicar mudanças sem reiniciar o terminal"
        command="source ~/.bashrc"
        output={``}
      />

      <h2>3. Arsenal Arch — pacman e AUR</h2>

      <CodeBlock
        title="aliases para pacman / yay"
        language="bash"
        code={`# === Pacman ===
alias pac='sudo pacman'
alias pacs='pacman -Ss'                 # buscar nos repos
alias pacS='sudo pacman -S'             # instalar
alias pacR='sudo pacman -Rns'           # remover (com deps órfãs)
alias pacU='sudo pacman -Syu'           # atualizar tudo
alias pacQ='pacman -Q'                  # listar instalados
alias pacQi='pacman -Qi'                # info de pacote
alias pacQs='pacman -Qs'                # buscar entre instalados
alias pacQl='pacman -Ql'                # listar arquivos do pacote
alias pacQo='pacman -Qo'                # qual pacote dono do arquivo
alias pacFy='sudo pacman -Fy'           # atualizar índice de arquivos
alias pacF='pacman -F'                  # buscar arquivo nos REPOS
alias pacOrphans='pacman -Qtdq'         # órfãs (sem ninguém dependendo)
alias pacClean='sudo pacman -Sc'        # limpar cache antigo
alias pacMirror='sudo reflector --country Brazil --age 12 --protocol https --sort rate --save /etc/pacman.d/mirrorlist'

# === AUR (yay) ===
alias yays='yay -Ss'
alias yayS='yay -S'
alias yayU='yay -Syu --aur'
alias yayClean='yay -Yc'                # limpar deps órfãs do AUR`}
      />

      <TerminalBlock
        command="pacQs neovim"
        output={`extra/neovim 0.10.4-1 (1.84 MiB 2.11 MiB) [installed]
    Fork of Vim aiming to improve user experience, plugins, and GUIs`}
      />

      <TerminalBlock
        command="pacOrphans | head -5"
        output={`gst-libav
libdv
libgme
liblrdf
libofa`}
      />

      <h2>4. Arsenal Arch — systemctl e journalctl</h2>

      <CodeBlock
        title="aliases para systemd"
        language="bash"
        code={`# === systemctl ===
alias sc='sudo systemctl'
alias scu='systemctl --user'
alias sce='sudo systemctl enable --now'
alias scd='sudo systemctl disable --now'
alias scr='sudo systemctl restart'
alias scs='systemctl status'
alias scl='systemctl list-units --type=service'
alias scfailed='systemctl --failed'

# === journalctl ===
alias jc='sudo journalctl'
alias jcu='journalctl --user'
alias jcb='sudo journalctl -b'              # boot atual
alias jcerr='sudo journalctl -p err -b'      # erros do boot
alias jcf='sudo journalctl -f'               # follow
function jcs()  { sudo journalctl -u "$1"; } # logs de unit
function jcsf() { sudo journalctl -fu "$1"; } # follow de unit`}
      />

      <TerminalBlock
        command="jcs sshd | tail -3"
        output={`Mar 26 14:32:18 archlinux sshd[832]: Server listening on 0.0.0.0 port 22.
Mar 26 14:32:18 archlinux sshd[832]: Server listening on :: port 22.
Mar 26 15:08:42 archlinux sshd[1247]: Accepted publickey for joao from 192.168.0.5`}
      />

      <h2>5. Arsenal — git, navegação, processos</h2>

      <CodeBlock
        title="git"
        language="bash"
        code={`# === Git ===
alias g='git'
alias gs='git status -sb'
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit'
alias gcm='git commit -m'
alias gca='git commit --amend --no-edit'
alias gp='git push'
alias gpl='git pull --rebase'
alias gco='git checkout'
alias gb='git branch'
alias gd='git diff'
alias gds='git diff --staged'
alias gl='git log --oneline --graph --decorate -20'
alias gla='git log --oneline --graph --decorate --all -30'
alias gst='git stash'
alias gstp='git stash pop'`}
      />

      <CodeBlock
        title="navegação e listagem"
        language="bash"
        code={`# === ls (substitua por eza/lsd se gostar) ===
alias ls='ls --color=auto --group-directories-first'
alias ll='ls -lh'
alias la='ls -lha'
alias lt='ls -lht'                  # ordenado por tempo
alias lS='ls -lhS'                  # ordenado por tamanho

# === cd shortcuts ===
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias -- -='cd -'                   # cd ao diretório anterior

# === diretórios usados ===
alias cdd='cd ~/Downloads'
alias cdp='cd ~/projetos'
alias cdc='cd ~/.config'

# === processos ===
alias psg='ps aux | grep -v grep | grep'   # psg firefox
alias topcpu='ps aux --sort=-%cpu | head'
alias topmem='ps aux --sort=-%mem | head'

# === rede ===
alias myip='curl -s https://ipinfo.io/ip; echo'
alias ports='ss -tulpn'
alias ping='ping -c 4'

# === clima e útil ===
alias clima='curl -s wttr.in/SaoPaulo?lang=pt'
alias semana='cal -3'`}
      />

      <TerminalBlock
        command="topmem | head -4"
        output={`USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
joao      4218  3.8 12.4 4823412 1980124 ?   Sl   10:42   8:21 /usr/lib/firefox/firefox
joao      3127  2.1  8.7 3321142 1392108 ?   Sl   10:40   4:12 /usr/bin/gnome-shell
joao      4892  1.4  4.2  982314  672120 ?   Sl   11:23   1:42 /usr/bin/Xwayland`}
      />

      <h2>6. Funções — quando alias não basta</h2>

      <CodeBlock
        title="funções úteis para ~/.bashrc"
        language="bash"
        code={`# Cria diretório E entra nele
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extrai qualquer arquivo compactado
extract() {
    [[ -f "$1" ]] || { echo "$1 não é arquivo"; return 1; }
    case "$1" in
        *.tar.bz2|*.tbz2)  tar xjf "$1"   ;;
        *.tar.gz|*.tgz)    tar xzf "$1"   ;;
        *.tar.xz|*.txz)    tar xJf "$1"   ;;
        *.tar.zst)         tar xf  "$1"   ;;   # comum em pacotes Arch
        *.tar)             tar xf  "$1"   ;;
        *.bz2)             bunzip2 "$1"   ;;
        *.gz)              gunzip  "$1"   ;;
        *.zip)             unzip   "$1"   ;;
        *.7z)              7z x    "$1"   ;;
        *.rar)             unrar x "$1"   ;;
        *)  echo "extensão desconhecida: $1"; return 1 ;;
    esac
}

# Procura arquivo no projeto atual ignorando node_modules/.git
ff() {
    find . \\( -name node_modules -o -name .git -o -name target \\) -prune \\
        -o -type f -iname "*$1*" -print
}

# Encontra texto recursivamente em arquivos de código
fg_in() {
    grep -rn --include='*.{ts,tsx,js,jsx,py,go,rs}' "$1" .
}

# Pega o IP da interface ativa
myip_local() {
    ip route get 1.1.1.1 | awk '{print $7; exit}'
}

# Mata todos os processos por nome (com confirmação)
killall_safe() {
    local procs
    procs=$(pgrep -af "$1")
    [[ -z $procs ]] && { echo "nenhum processo casa com '$1'"; return 1; }
    echo "$procs"
    read -p "matar todos? [y/N] " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] && pkill -9 "$1"
}

# Cria/abre nota rápida do dia
nota() {
    local f="$HOME/notas/$(date +%Y-%m-%d).md"
    mkdir -p "$(dirname "$f")"
    "\${EDITOR:-nano}" "$f"
}`}
      />

      <TerminalBlock
        command={`mkcd /tmp/teste/dir/profundo && pwd`}
        output={`/tmp/teste/dir/profundo`}
      />

      <TerminalBlock
        command={`extract linux-6.12.1.pkg.tar.zst
ls | head -3`}
        output={`.BUILDINFO
.MTREE
.PKGINFO`}
      />

      <h2>7. Limitações e armadilhas</h2>

      <AlertBox type="warning" title="Aliases NÃO funcionam em scripts (por padrão)">
        Bash desabilita aliases em scripts não-interativos. Para usar, precisa{" "}
        <code>shopt -s expand_aliases</code> no topo do script. Em geral, escreva uma{" "}
        <strong>função</strong> em vez de alias se for chamar de dentro de outro script.
      </AlertBox>

      <AlertBox type="warning" title="alias só substitui o PRIMEIRO token">
        <code>alias sudo='sudo '</code> (note o espaço!) faz o bash expandir aliases após{" "}
        <code>sudo</code> também — isto é, <code>sudo ll</code> vira{" "}
        <code>sudo ls -lh</code>. Sem isso, <code>sudo ll</code> falha com{" "}
        <code>sudo: ll: command not found</code>.
      </AlertBox>

      <TerminalBlock
        command={`alias sudo='sudo '
alias ll='ls -lh'
sudo ll /root | head -3`}
        output={`total 16K
drwxr-x--- 1 root root  140 Mar 26 12:11 .config
drwxr-x--- 1 root root   60 Mar 25 18:42 .ssh`}
      />

      <h2>8. Sobreescrevendo comandos com cuidado</h2>

      <p>
        Você pode "redefinir" comandos (<code>alias rm='rm -i'</code>) para forçar
        confirmação, mas isso esconde o comportamento real e pode te morder em scripts ou
        ao usar o comando "de verdade".
      </p>

      <TerminalBlock
        comment="bypass: o comando ORIGINAL"
        command={`alias rm='rm -i'
\\rm /tmp/arquivo_descartavel
command rm /tmp/outro`}
        output={``}
      />

      <h2>9. Cola visual — meu ~/.config/aliases.sh recomendado</h2>

      <CodeBlock
        title="~/.config/aliases.sh — pronto para Arch"
        language="bash"
        code={`# ============================================
#  Aliases gerais
# ============================================
alias sudo='sudo '
alias ls='ls --color=auto --group-directories-first'
alias ll='ls -lh' ; alias la='ls -lha' ; alias lt='ls -lht'
alias grep='grep --color=auto'
alias mkdir='mkdir -pv'
alias df='df -h' ; alias du='du -h --max-depth=1'
alias rm='rm -I'                # -I pergunta só se >3 arquivos
alias cp='cp -iv' ; alias mv='mv -iv'
alias ..='cd ..' ; alias ...='cd ../..' ; alias ....='cd ../../..'

# ============================================
#  Pacman + AUR
# ============================================
alias pacS='sudo pacman -S'
alias pacU='sudo pacman -Syu'
alias pacR='sudo pacman -Rns'
alias pacQs='pacman -Qs'
alias pacOrphans='pacman -Qtdq'
alias pacClean='sudo pacman -Sc'

# ============================================
#  systemd
# ============================================
alias sc='sudo systemctl'
alias scu='systemctl --user'
alias jc='sudo journalctl'
alias jcerr='sudo journalctl -p err -b'

# ============================================
#  git
# ============================================
alias g='git'
alias gs='git status -sb'
alias gl='git log --oneline --graph --decorate -20'
alias gd='git diff'

# ============================================
#  funções
# ============================================
mkcd() { mkdir -p "$1" && cd "$1"; }
ports() { ss -tulpn | grep LISTEN; }
weather() { curl -s "wttr.in/\${1:-SaoPaulo}?lang=pt&format=3"; }`}
      />

      <AlertBox type="success" title="Resultado">
        Com o arsenal acima e um <code>source ~/.bashrc</code>, você cortou metade do
        teclado em comandos do dia-a-dia. Cada vez que se pegar digitando a mesma coisa
        3x, vire alias.
      </AlertBox>
    </PageContainer>
  );
}
