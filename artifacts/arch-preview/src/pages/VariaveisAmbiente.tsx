import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VariaveisAmbiente() {
  return (
    <PageContainer
      title="Variáveis de Ambiente"
      subtitle="PATH, HOME, EDITOR, LANG... onde elas vivem, qual arquivo carrega o quê e como definir variáveis para login, sessão gráfica e systemd no Arch."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Shell"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal Bash/Zsh.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Variável de ambiente</strong> — par chave=valor herdado por processos filhos.
      </p>
      <p>
        <strong>export</strong> — marca a variável para ser exportada aos filhos.
      </p>
      <p>
        <strong>PATH</strong> — lista de diretórios onde o shell procura executáveis.
      </p>
      <p>
        <strong>~/.bashrc vs ~/.bash_profile</strong> — <em>bashrc</em> roda em cada shell interativo; <em>bash_profile</em> só no login.
      </p>
      <p>
        <strong>/etc/environment</strong> — variáveis globais do sistema.
      </p>

      <p>
        Toda vez que você abre um terminal, o bash herda um conjunto de variáveis do
        processo pai (geralmente o login manager ou o seu emulador de terminal). Essas
        variáveis afetam quase tudo: onde o sistema procura programas (<code>PATH</code>),
        qual editor abre quando você roda <code>visudo</code> (<code>EDITOR</code>), qual
        idioma usar (<code>LANG</code>), onde está sua casa (<code>HOME</code>), etc.
      </p>

      <AlertBox type="info" title="O essencial em uma frase">
        Variáveis <strong>locais</strong> existem só no shell atual. Variáveis{" "}
        <strong>de ambiente</strong> (criadas com <code>export</code>) são herdadas por
        todos os processos filhos.
      </AlertBox>

      <h2>1. Vendo o ambiente atual</h2>

      <TerminalBlock
        command="env | head -20"
        output={`SHELL=/bin/bash
HOME=/home/joao
USER=joao
LOGNAME=joao
PWD=/home/joao
LANG=pt_BR.UTF-8
LC_TIME=pt_BR.UTF-8
TERM=xterm-256color
PATH=/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin
XDG_SESSION_TYPE=wayland
XDG_CURRENT_DESKTOP=GNOME
XDG_RUNTIME_DIR=/run/user/1000
XDG_DATA_DIRS=/usr/local/share/:/usr/share/
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
EDITOR=nvim
VISUAL=nvim
PAGER=less
LESS=-R --mouse
GTK_THEME=Adwaita-dark
SSH_AUTH_SOCK=/run/user/1000/keyring/ssh`}
      />

      <CommandFlagList
        command="comandos para inspecionar variáveis"
        items={[
          { flag: "env", description: "Lista todas as variáveis EXPORTADAS (de ambiente)." },
          { flag: "printenv [VAR]", description: "Sem args = igual a env. Com VAR = só ela.", example: "printenv PATH" },
          { flag: "set", description: "Lista TODAS — ambiente + locais + funções (longo)." },
          { flag: "declare -p [VAR]", description: "Mostra atributos da variável (export, readonly, integer)." },
          { flag: "echo $VAR", description: "Imprime o valor (ou vazio se não-definida)." },
          { flag: "${VAR-?}", description: 'Em bash, ${VAR?msg} mata o script se VAR não-definida.' },
        ]}
      />

      <TerminalBlock
        command="declare -p PATH HOME"
        output={`declare -x PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin"
declare -x HOME="/home/joao"`}
      />

      <h2>2. Variáveis essenciais que TODO usuário tem</h2>

      <OutputBlock
        title="o catálogo padrão"
        output={`HOME       /home/SEUUSER         seu diretório pessoal
USER       seu login              quem você é
LOGNAME    igual ao USER          tradição BSD
SHELL      /bin/bash              seu shell padrão (de /etc/passwd)
PWD        diretório atual        atualizado pelo cd
OLDPWD     diretório anterior     usado por cd -
PATH       lista de :             onde procurar binários
LANG       pt_BR.UTF-8            idioma e codificação default
LC_*       overrides de LANG      LC_TIME, LC_NUMERIC, LC_MESSAGES...
TERM       xterm-256color         tipo de terminal (cores, cap.)
HOSTNAME   archlinux              de /etc/hostname
HISTFILE   ~/.bash_history        onde salvar o histórico
HISTSIZE   1000                   linhas em memória
EDITOR     nano|vim|nvim          editor para visudo, crontab -e
VISUAL     mesmo papel            preferido por alguns programas
PAGER      less                   visualizador (man, git log)
TMPDIR     /tmp                   onde criar arquivos temporários

# XDG Base Directory (padrão moderno)
XDG_CONFIG_HOME    ~/.config         configs do usuário
XDG_DATA_HOME      ~/.local/share    dados do usuário
XDG_STATE_HOME     ~/.local/state    estado mutável (logs, history)
XDG_CACHE_HOME     ~/.cache          cache descartável
XDG_RUNTIME_DIR    /run/user/UID     sockets, locks (volátil)`}
      />

      <h2>3. PATH — onde o shell procura programas</h2>

      <TerminalBlock
        command="echo $PATH"
        output={`/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin`}
      />

      <TerminalBlock
        comment="visualização legível"
        command={`echo "$PATH" | tr ':' '\\n' | nl`}
        output={`     1\t/usr/local/sbin
     2\t/usr/local/bin
     3\t/usr/bin
     4\t/usr/lib/jvm/default/bin`}
      />

      <TerminalBlock
        comment="onde está um binário?"
        command="which pacman; type pacman"
        output={`/usr/bin/pacman
pacman is /usr/bin/pacman`}
      />

      <TerminalBlock
        comment="adicionar ~/.local/bin (padrão Arch para scripts do usuário)"
        command={`export PATH="$HOME/.local/bin:$PATH"
echo "$PATH" | tr ':' '\\n' | head -3`}
        output={`/home/joao/.local/bin
/usr/local/sbin
/usr/local/bin`}
      />

      <AlertBox type="warning" title="Nunca coloque '.' no PATH">
        Adicionar <code>.</code> ou um diretório <em>writable</em> permite que um arquivo
        malicioso de mesmo nome de um comando comum (<code>ls</code>, <code>git</code>)
        seja executado quando você entrar na pasta. Se precisar rodar binário do diretório
        atual, use <code>./meu_script</code> explicitamente.
      </AlertBox>

      <h2>4. Criando variáveis: local vs export</h2>

      <TerminalBlock
        command={`MINHA="oi"
bash -c 'echo "filho vê: $MINHA"'`}
        output={`filho vê:`}
      />

      <TerminalBlock
        comment="agora exportada"
        command={`export MINHA="oi"
bash -c 'echo "filho vê: $MINHA"'`}
        output={`filho vê: oi`}
      />

      <TerminalBlock
        comment="forma curta: declarar e exportar em um passo"
        command={`export DEBUG=1 LOG_LEVEL=info`}
        output={``}
      />

      <TerminalBlock
        comment="remover do ambiente"
        command={`unset MINHA
echo "[$MINHA]"`}
        output={`[]`}
      />

      <TerminalBlock
        comment="passar variável SÓ para um comando (não exporta no shell)"
        command={`HTTPS_PROXY=http://proxy:8080 curl -sI https://archlinux.org | head -1`}
        output={`HTTP/2 200`}
      />

      <h2>5. Onde COLOCAR suas variáveis (Arch)</h2>

      <p>
        Esta é a parte que mais confunde. O bash carrega arquivos diferentes dependendo
        de como o shell foi iniciado: <strong>login</strong> (você fez login no TTY ou
        SSH) vs <strong>interativo não-login</strong> (abriu o gnome-terminal). E ainda
        existem variáveis lidas pelo <code>systemd</code> e pelo Wayland/X antes do shell.
      </p>

      <OutputBlock
        title="ordem de carregamento (login interativo)"
        output={`/etc/environment           lido por PAM (todo login: TTY, SSH, gdm)
/etc/profile               para shells de login
  └── /etc/profile.d/*.sh
~/.bash_profile            seu — primeiro encontrado de:
~/.bash_login              (caem em ordem de prioridade)
~/.profile

# Depois, qualquer shell INTERATIVO carrega:
/etc/bash.bashrc
~/.bashrc`}
        annotations={[
          { line: 0, note: "FORMATO simples KEY=VALUE — sem export, sem $var" },
          { line: 1, note: "scripts shell completos (com if, export...)" },
          { line: 9, note: "típico .bash_profile faz: [[ -f ~/.bashrc ]] && . ~/.bashrc" },
        ]}
      />

      <h3>/etc/environment — sintaxe MUITO restrita</h3>

      <CodeBlock
        title="/etc/environment (válido)"
        code={`# Só atribuições KEY=VALUE simples — uma por linha
LANG=pt_BR.UTF-8
EDITOR=nvim
PATH=/usr/local/sbin:/usr/local/bin:/usr/bin
JAVA_HOME=/usr/lib/jvm/default

# COMENTÁRIO COMEÇANDO COM # OK
# NÃO use: $variavel, aspas duplas com expansão, comandos`}
      />

      <h3>~/.bash_profile vs ~/.bashrc</h3>

      <CodeBlock
        title="~/.bash_profile (recomendado)"
        language="bash"
        code={`# Carregado em SHELLS DE LOGIN (TTY, SSH, "exec bash --login")
# Variáveis de ambiente PERMANENTES vão aqui

export EDITOR=nvim
export VISUAL=nvim
export PAGER=less
export LESS='-R --mouse'

# PATH personalizado
export PATH="$HOME/.local/bin:$HOME/go/bin:$PATH"

# locale (também pode ir em /etc/locale.conf)
export LANG=pt_BR.UTF-8

# faz com que ABRIR um shell normal (não-login) também leia o .bashrc
[[ -f ~/.bashrc ]] && . ~/.bashrc`}
      />

      <CodeBlock
        title="~/.bashrc (configurações INTERATIVAS)"
        language="bash"
        code={`# Carregado em todo shell INTERATIVO (login ou não)
# Aliases, funções, prompt, completions, histórico

# evita rodar em shell não-interativo
[[ $- != *i* ]] && return

# histórico farto
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoredups:erasedups
shopt -s histappend

# prompt simples
PS1='[\\u@\\h \\W]\\$ '

# aliases comuns no Arch
alias ll='ls -lh --color=auto'
alias la='ls -lha --color=auto'
alias grep='grep --color=auto'
alias pacs='pacman -Ss'
alias pacS='sudo pacman -S'`}
      />

      <AlertBox type="info" title="Por que separar?">
        Variáveis vão em <code>.bash_profile</code> (login = uma vez por sessão).
        Aliases/prompt vão em <code>.bashrc</code> (todo terminal). Sub-shells e{" "}
        <code>tmux</code> abrem como interativos NÃO-login: se você puser{" "}
        <code>export PATH</code> só no <code>.bashrc</code>, ele será re-aplicado a cada
        shell — ineficiente mas inofensivo. O contrário (alias só no .bash_profile) faz
        seus aliases sumirem dentro do tmux.
      </AlertBox>

      <h2>6. Login gráfico — variáveis para apps de GUI</h2>

      <p>
        No GDM/SDDM (Wayland), seu <code>.bashrc</code> e <code>.bash_profile</code> NÃO
        são executados pelas aplicações gráficas — só pelo terminal que você abre depois.
        Para variáveis que precisam estar disponíveis para <em>todos</em> os apps gráficos
        (ex: <code>EDITOR</code> usado pelo nautilus), use <code>~/.config/environment.d/</code>.
      </p>

      <CodeBlock
        title="~/.config/environment.d/10-meus.conf"
        code={`# Lido pelo systemd --user antes da sessão gráfica iniciar
# Sintaxe igual a /etc/environment (KEY=VAL, sem export)

EDITOR=nvim
VISUAL=nvim
GTK_THEME=Adwaita-dark
QT_QPA_PLATFORMTHEME=gnome
MOZ_ENABLE_WAYLAND=1`}
      />

      <TerminalBlock
        comment="recarregar (ou logout/login)"
        command="systemctl --user import-environment EDITOR VISUAL"
        output={``}
      />

      <h2>7. Variáveis para systemd services</h2>

      <CodeBlock
        title="dentro do .service"
        language="ini"
        code={`[Service]
Type=simple
ExecStart=/usr/bin/node /opt/api/server.js
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=-/etc/api.env`}
      />

      <CodeBlock
        title="/etc/api.env (sintaxe KEY=VALUE simples)"
        code={`# uma var por linha
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@localhost/mydb
LOG_LEVEL=info`}
      />

      <h2>8. Locale — LANG / LC_*</h2>

      <TerminalBlock
        command="locale"
        output={`LANG=pt_BR.UTF-8
LC_CTYPE="pt_BR.UTF-8"
LC_NUMERIC="pt_BR.UTF-8"
LC_TIME="pt_BR.UTF-8"
LC_COLLATE="pt_BR.UTF-8"
LC_MONETARY="pt_BR.UTF-8"
LC_MESSAGES="pt_BR.UTF-8"
LC_PAPER="pt_BR.UTF-8"
LC_NAME="pt_BR.UTF-8"
LC_ADDRESS="pt_BR.UTF-8"
LC_TELEPHONE="pt_BR.UTF-8"
LC_MEASUREMENT="pt_BR.UTF-8"
LC_IDENTIFICATION="pt_BR.UTF-8"
LC_ALL=`}
      />

      <TerminalBlock
        comment="quais locales seu sistema gerou"
        command="locale -a | head"
        output={`C
C.utf8
en_US.utf8
POSIX
pt_BR.utf8`}
      />

      <TerminalBlock
        comment="rodar UM comando em outro idioma (debug de erros em inglês)"
        command={`LC_ALL=C ls /naoexiste`}
        output={`ls: cannot access '/naoexiste': No such file or directory`}
      />

      <TerminalBlock
        comment="forma 'permanente' no Arch — gerar e setar em /etc/locale.conf"
        command={`sudo sed -i 's/^#pt_BR.UTF-8/pt_BR.UTF-8/' /etc/locale.gen
sudo locale-gen
echo 'LANG=pt_BR.UTF-8' | sudo tee /etc/locale.conf`}
        output={`Generating locales...
  pt_BR.UTF-8... done
Generation complete.
LANG=pt_BR.UTF-8`}
      />

      <h2>9. Editor padrão — EDITOR e VISUAL</h2>

      <p>
        Comandos como <code>visudo</code>, <code>crontab -e</code>, <code>git commit</code>{" "}
        e <code>systemctl edit</code> abrem o que estiver em <code>VISUAL</code> (preferencial)
        ou em <code>EDITOR</code>. Sem nenhum dos dois definidos, costuma cair no <code>vi</code>.
      </p>

      <TerminalBlock
        command={`echo "EDITOR=$EDITOR  VISUAL=$VISUAL"`}
        output={`EDITOR=nano  VISUAL=nano`}
      />

      <TerminalBlock
        comment="setar nano como padrão para sempre"
        command={`echo 'export EDITOR=nano
export VISUAL=nano' >> ~/.bash_profile
source ~/.bash_profile`}
        output={``}
      />

      <h2>10. Exportar variáveis a partir de um arquivo .env</h2>

      <CodeBlock
        title="meu.env"
        code={`API_KEY=abcdef123
DB_URL=postgres://localhost/app
DEBUG=1`}
      />

      <TerminalBlock
        comment="forma 1: source (precisa ter export ou usar 'set -a')"
        command={`set -a
. meu.env
set +a
env | grep -E '^(API|DB|DEBUG)='`}
        output={`API_KEY=abcdef123
DB_URL=postgres://localhost/app
DEBUG=1`}
      />

      <TerminalBlock
        comment="forma 2: rodar UM comando com as vars do arquivo (env --split-string)"
        command={`env $(grep -v '^#' meu.env | xargs) node app.js`}
        output={``}
      />

      <h2>11. Cola visual — caso de uso × arquivo</h2>

      <OutputBlock
        title="onde por o quê (Arch desktop)"
        output={`o que                                                    onde
-------------------------------------------------------  --------------------------------------
LANG, EDITOR para todos os usuários                       /etc/environment
LANG, KEYMAP do sistema                                   /etc/locale.conf  /etc/vconsole.conf
PATH/ENV permanente do meu user (login)                   ~/.bash_profile
aliases, prompt, completions                              ~/.bashrc
ENV para apps GRÁFICAS (Nautilus, Firefox)                ~/.config/environment.d/*.conf
ENV para um service do systemd                            EnvironmentFile= no .service
ENV para um único comando                                 KEY=val comando
ENV para sub-shell de teste                               env -i KEY=val bash`}
      />

      <AlertBox type="success" title="Sanidade">
        Sempre que alterar <code>~/.bash_profile</code> ou <code>/etc/environment</code>{" "}
        faça <code>source ~/.bash_profile</code> ou logout/login para validar. E confirme
        com <code>echo $VAR</code> num shell NOVO antes de declarar vitória.
      </AlertBox>
    </PageContainer>
  );
}
