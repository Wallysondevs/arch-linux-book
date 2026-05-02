import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function AmbientesAlternativos() {
  return (
    <PageContainer
      title="Ambientes Alternativos"
      subtitle="TTYs virtuais, multiplexadores (tmux, screen, byobu) e ambientes containerizados (distrobox, toolbox). Sair do gnome-terminal e descobrir o resto do mundo."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Shell Avançado"
    >
      <p>
        Toda vez que você abre o "Terminal" do GNOME está rodando dentro de uma sessão gráfica.
        Mas o Linux te dá <em>vários</em> outros ambientes para rodar shell — TTYs virtuais que
        independem do X/Wayland, multiplexadores que mantêm sessões vivas mesmo se o SSH cair, e
        containers que isolam outra distro inteira sobre o Arch. Esta página é um mapa desses
        territórios alternativos.
      </p>

      <AlertBox type="info" title="Pacotes desta página">
        <code>sudo pacman -S tmux screen</code> — multiplexadores clássicos. Byobu vem do AUR:{" "}
        <code>yay -S byobu</code>. Distrobox e toolbox idem:{" "}
        <code>yay -S distrobox toolbox</code>. Os TTYs já existem nativamente no kernel.
      </AlertBox>

      <h2>1. TTYs virtuais — os 6 consoles que você esqueceu</h2>

      <p>
        Mesmo rodando GNOME/KDE, o kernel mantém 6 consoles de texto puro (<code>tty1</code> a{" "}
        <code>tty6</code>) no fundo. Eles existem desde antes do X11 e ainda salvam vidas quando
        a sessão gráfica congela. Pressione <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F2</kbd> a{" "}
        <kbd>F6</kbd> para alternar; <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F1</kbd> (ou{" "}
        <kbd>F7</kbd>, depende do display manager) volta para a sessão gráfica.
      </p>

      <TerminalBlock
        comment="ver em qual TTY você está agora"
        command="tty"
        output="/dev/pts/0"
      />

      <p>
        <code>/dev/pts/N</code> = pseudo-terminal (terminal gráfico ou SSH).{" "}
        <code>/dev/ttyN</code> = console real do kernel.
      </p>

      <TerminalBlock
        comment="quem está logado em cada TTY"
        command="who"
        output={`joao     tty1         2026-03-26 08:12 (:0)
joao     pts/0        2026-03-26 09:31 (:0)
joao     pts/1        2026-03-26 10:42 (:0)`}
      />

      <TerminalBlock
        comment="lista todos os ttys ativos"
        command="ls -l /dev/tty[1-6]"
        output={`crw--w---- 1 joao tty 4, 1 mar 26 08:12 /dev/tty1
crw--w---- 1 root tty 4, 2 mar 26 08:00 /dev/tty2
crw--w---- 1 root tty 4, 3 mar 26 08:00 /dev/tty3
crw--w---- 1 root tty 4, 4 mar 26 08:00 /dev/tty4
crw--w---- 1 root tty 4, 5 mar 26 08:00 /dev/tty5
crw--w---- 1 root tty 4, 6 mar 26 08:00 /dev/tty6`}
      />

      <h3>1.1. Mudando de TTY pela linha de comando</h3>

      <TerminalBlock
        comment="precisa root: chvt = change virtual terminal"
        command="sudo chvt 3"
        output=""
      />

      <TerminalBlock
        comment="capturar uma screenshot textual de outro TTY"
        command="sudo cat /dev/vcs2 | head -5"
        output={`Arch Linux 6.12.1-arch1-1 (tty2)

archlinux login: joao
Password:
Last login: Wed Mar 26 09:00:11 on tty2`}
      />

      <AlertBox type="warning" title="GDM e Wayland mudaram o layout">
        Em sistemas com GNOME + Wayland, o display manager geralmente ocupa <code>tty1</code>{" "}
        e a sessão de usuário <code>tty2</code>. Para "voltar" para o GNOME pressione{" "}
        <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F2</kbd> (não F7 como no X.org antigo).
      </AlertBox>

      <h3>1.2. Configurando getty para login automático</h3>

      <p>
        Útil para máquinas dedicadas (HTPC, servidor caseiro). Crie um drop-in para o serviço{" "}
        <code>getty@tty1</code>:
      </p>

      <TerminalBlock
        command="sudo systemctl edit getty@tty1"
      />

      <CodeBlock
        title="/etc/systemd/system/getty@tty1.service.d/override.conf"
        code={`[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin joao --noclear %I $TERM`}
      />

      <TerminalBlock command="sudo systemctl daemon-reload" output="" />
      <TerminalBlock command="sudo systemctl restart getty@tty1" output="" />

      <h2>2. tmux — o multiplexador moderno</h2>

      <p>
        <code>tmux</code> divide o terminal em painéis e janelas, mantém sessões vivas em background
        e permite múltiplos clientes anexados ao mesmo terminal. É <strong>o</strong> ambiente
        padrão para qualquer trabalho sério em SSH.
      </p>

      <TerminalBlock
        command="sudo pacman -S tmux"
        output={`resolving dependencies...
Packages (1) tmux-3.5a-1
Total Installed Size:  1.04 MiB
:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock command="tmux -V" output="tmux 3.5a" />

      <h3>2.1. Conceitos: sessão, janela, painel</h3>

      <OutputBlock
        title="hierarquia tmux"
        output={`tmux server (1 por usuário)
└── session "trabalho"
    ├── window 0: "edit"
    │   ├── pane 0  (vim)
    │   └── pane 1  (terminal)
    ├── window 1: "logs"
    │   └── pane 0  (journalctl -f)
    └── window 2: "ssh"
        ├── pane 0  (ssh server1)
        └── pane 1  (ssh server2)`}
        annotations={[
          { line: 0, note: "1 daemon por usuário, sobrevive ao logout" },
          { line: 1, note: "agrupamento lógico (você anexa em uma sessão)" },
          { line: 2, note: "como abas de browser" },
          { line: 3, note: "subdivisões visuais dentro de uma janela" },
        ]}
      />

      <h3>2.2. Iniciando e anexando</h3>

      <TerminalBlock
        comment="cria sessão sem nome (tmux escolhe '0')"
        command="tmux"
      />

      <TerminalBlock
        comment="cria sessão nomeada (recomendado)"
        command="tmux new -s trabalho"
      />

      <TerminalBlock
        comment="lista sessões existentes"
        command="tmux ls"
        output={`trabalho: 2 windows (created Wed Mar 26 09:11:42 2026)
servidores: 1 windows (created Wed Mar 26 09:42:01 2026)`}
      />

      <TerminalBlock
        comment="anexar a uma sessão existente"
        command="tmux attach -t trabalho"
      />

      <TerminalBlock
        comment="atalho: anexa à última sessão"
        command="tmux a"
      />

      <TerminalBlock
        comment="encerra uma sessão por nome"
        command="tmux kill-session -t servidores"
        output=""
      />

      <h3>2.3. Prefixo + atalhos (decore estes 12)</h3>

      <p>
        Tudo no tmux começa com a tecla de <strong>prefixo</strong>: <kbd>Ctrl</kbd>+<kbd>b</kbd>{" "}
        (default). Você aperta o prefixo, solta, e depois aperta o atalho.
      </p>

      <CommandFlagList
        command="prefix = Ctrl+b (atalhos do tmux)"
        items={[
          { flag: "prefix c", description: "Cria nova janela." },
          { flag: "prefix n / p", description: "Próxima / anterior janela." },
          { flag: "prefix 0..9", description: "Pula direto para a janela de número N." },
          { flag: 'prefix ,', description: "Renomeia a janela atual." },
          { flag: "prefix %", description: "Divide o painel verticalmente (lado a lado)." },
          { flag: 'prefix "', description: "Divide o painel horizontalmente (em cima/em baixo)." },
          { flag: "prefix ←↑↓→", description: "Move foco entre painéis." },
          { flag: "prefix z", description: "Zoom: maximiza painel atual; aperte de novo para voltar." },
          { flag: "prefix x", description: "Fecha o painel atual (com confirmação)." },
          { flag: "prefix d", description: <><strong>Detach</strong>: solta da sessão sem matá-la (você volta ao shell normal).</> },
          { flag: "prefix [", description: "Modo cópia: setas/PageUp navegam scrollback. q sai." },
          { flag: "prefix ?", description: "Mostra TODOS os atalhos disponíveis (cheat sheet)." },
        ]}
      />

      <TerminalBlock
        comment="exemplo: criar 2 painéis e detach"
        command="tmux new -s demo"
      />

      <OutputBlock
        title="dentro do tmux"
        output={`Ctrl+b %        ← divide vertical
Ctrl+b "        ← divide horizontal (no painel novo)
Ctrl+b ←        ← volta para o painel da esquerda
htop            ← roda algo
Ctrl+b d        ← detach! sai do tmux mas processos continuam`}
      />

      <TerminalBlock
        comment="reanexa: htop ainda está rodando"
        command="tmux a -t demo"
      />

      <h3>2.4. ~/.tmux.conf — a configuração que vale a pena</h3>

      <CodeBlock
        title="~/.tmux.conf — base sensata"
        code={`# Prefixo Ctrl+a (mais ergonômico que Ctrl+b)
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Mouse: clicar para focar, scroll, redimensionar com drag
set -g mouse on

# Numerar a partir de 1 (mais perto da tecla)
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on

# Splits intuitivos: | e -
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# Recarregar config: prefix r
bind r source-file ~/.tmux.conf \\; display "tmux.conf recarregado!"

# Histórico maior
set -g history-limit 50000

# 256 cores + true color
set -g default-terminal "tmux-256color"
set -ga terminal-overrides ",*256col*:Tc"

# Status bar Arch theme
set -g status-bg "#0a0d11"
set -g status-fg "#cbd1dc"
set -g status-left "#[fg=#1793D1,bold] #S #[default]"
set -g status-right "#[fg=#7c8497]%H:%M %d-%b "`}
      />

      <TerminalBlock
        command="tmux source ~/.tmux.conf"
        output="tmux.conf recarregado!"
      />

      <h3>2.5. Comandos via linha (scripting)</h3>

      <TerminalBlock
        comment="cria sessão pronta com 3 janelas para um projeto"
        command={`tmux new -d -s dev -n editor 'vim'
tmux new-window -t dev:2 -n logs 'journalctl -f'
tmux new-window -t dev:3 -n shell
tmux attach -t dev`}
      />

      <h2>3. GNU screen — o veterano</h2>

      <p>
        Anterior ao tmux (década de 1980), <code>screen</code> ainda é o que você encontra em
        servidores legados. Funciona parecido, mas a interface é mais crua.
      </p>

      <TerminalBlock command="sudo pacman -S screen" output="Packages (1) screen-4.9.1-1" />
      <TerminalBlock command="screen --version" output="Screen version 4.09.01 (GNU) 20-Aug-23" />

      <CommandFlagList
        command="screen — atalhos (prefix = Ctrl+a)"
        items={[
          { flag: "screen -S nome", description: "Inicia sessão nomeada.", example: "screen -S build" },
          { flag: "screen -ls", description: "Lista sessões." },
          { flag: "screen -r nome", description: "Reanexa." },
          { flag: "screen -dr nome", description: "Força detach de outro cliente e reanexa." },
          { flag: "Ctrl+a c", description: "Nova janela." },
          { flag: "Ctrl+a n / p", description: "Próxima / anterior." },
          { flag: "Ctrl+a 0..9", description: "Janela N." },
          { flag: "Ctrl+a d", description: "Detach." },
          { flag: "Ctrl+a A", description: "Renomear janela." },
          { flag: "Ctrl+a S", description: "Splits horizontais (rudimentar)." },
          { flag: "Ctrl+a |", description: "Split vertical (4.0+)." },
          { flag: "Ctrl+a Esc", description: "Modo cópia/scroll." },
          { flag: "Ctrl+a k", description: "Mata a janela atual." },
        ]}
      />

      <TerminalBlock command="screen -ls" output={`There is a screen on:
        12345.build     (Detached)
1 Socket in /run/screens/S-joao.`} />

      <CodeBlock
        title="~/.screenrc — minimamente civilizado"
        code={`# Sem mensagem inicial
startup_message off

# Histórico maior
defscrollback 10000

# Status bar com lista de janelas
hardstatus alwayslastline
hardstatus string '%{= kG}[%{G}%H%{g}][%= %{= kw}%?%-Lw%?%{r}(%{W}%n*%f%t%?(%u)%?%{r})%{w}%?%+Lw%?%?%= %{g}][%{B}%Y-%m-%d %{W}%c%{g}]'

# UTF-8
defutf8 on`}
      />

      <h2>4. byobu — wrapper amigável</h2>

      <p>
        <code>byobu</code> é um <strong>frontend</strong> sobre tmux (ou screen) com uma status
        bar bonita pré-configurada, atalhos com teclas F (sem prefixo) e indicadores de bateria,
        rede, CPU, memória.
      </p>

      <TerminalBlock command="yay -S byobu" output={`==> Making package: byobu 5.133-2
:: Installing byobu...`} />

      <TerminalBlock
        comment="ativa para iniciar automaticamente em todo SSH login"
        command="byobu-enable"
        output={`The Byobu window manager will be launched automatically at each text login.`}
      />

      <CommandFlagList
        command="byobu — teclas funcionais (sem prefixo!)"
        items={[
          { flag: "F2", description: "Nova janela." },
          { flag: "F3 / F4", description: "Janela anterior / próxima." },
          { flag: "F5", description: "Recarrega notificações da status bar." },
          { flag: "F6", description: "Detach (e desconecta SSH)." },
          { flag: "Shift+F6", description: "Detach mantendo SSH conectado." },
          { flag: "F7", description: "Modo de cópia / scrollback." },
          { flag: "F8", description: "Renomeia janela." },
          { flag: "F9", description: "Menu de configuração interativo." },
          { flag: "F12", description: "Trava com senha (lock)." },
          { flag: "Ctrl+F2", description: "Split vertical." },
          { flag: "Shift+F2", description: "Split horizontal." },
        ]}
      />

      <h2>5. distrobox — outra distro como container</h2>

      <p>
        <code>distrobox</code> usa Podman/Docker para rodar Ubuntu, Fedora, Debian, Alpine, etc.
        <strong> compartilhando seu /home, sockets e display</strong>. É a melhor forma de rodar
        software empacotado para outras distros (drivers proprietários antigos, .deb, ferramentas
        do RHEL) sem poluir o Arch.
      </p>

      <TerminalBlock
        command="sudo pacman -S podman distrobox"
        output={`Packages (2) podman-5.3.1-1  distrobox-1.8.0-1
Total Installed Size:  82.4 MiB`}
      />

      <TerminalBlock command="distrobox --version" output="distrobox: 1.8.0" />

      <h3>5.1. Criando uma caixa Ubuntu</h3>

      <TerminalBlock
        command="distrobox create --name ubuntu --image ubuntu:24.04"
        output={`Image ubuntu:24.04 not found.
Do you want to pull the image now? [Y/n]: y
Trying to pull docker.io/library/ubuntu:24.04...
Getting image source signatures
Copying blob ... done
Container ubuntu successfully created.
To enter, run:
distrobox enter ubuntu`}
      />

      <TerminalBlock command="distrobox list" output={`ID           | NAME    | STATUS  | IMAGE
ab12cd34ef56 | ubuntu  | Created | docker.io/library/ubuntu:24.04`} />

      <TerminalBlock
        comment="entra no container — tudo do seu /home está visível"
        command="distrobox enter ubuntu"
        output={`Container ubuntu is not running.
Starting container ubuntu
[...]
joao@ubuntu:~$ `}
      />

      <TerminalBlock
        comment="dentro do container: instalar com apt"
        prompt="joao@ubuntu:~$ "
        command="sudo apt install build-essential"
        output={`Reading package lists... Done
The following NEW packages will be installed:
  build-essential dpkg-dev g++ g++-13 gcc gcc-13 ...
0 upgraded, 17 newly installed, 0 to remove.`}
      />

      <h3>5.2. Exportando comandos para o host</h3>

      <TerminalBlock
        comment="dentro do container ubuntu: torna o apt utilizável do host"
        prompt="joao@ubuntu:~$ "
        command="distrobox-export --bin /usr/bin/apt --export-path ~/.local/bin"
        output={`/usr/bin/apt exported successfully to ~/.local/bin/apt.
Remember to refresh your shell.`}
      />

      <TerminalBlock
        comment="agora 'apt' funciona do shell do Arch (delegando ao container)"
        command="apt --version"
        output="apt 2.7.14ubuntu1 (amd64)"
      />

      <h3>5.3. Comandos do dia-a-dia</h3>

      <CommandFlagList
        command="distrobox"
        items={[
          { flag: "create --name N --image IMG", description: "Cria container.", example: "distrobox create -n fedora -i fedora:41" },
          { flag: "enter NOME", description: "Abre shell no container." },
          { flag: "list / ls", description: "Lista containers." },
          { flag: "stop NOME", description: "Para um container ativo." },
          { flag: "rm NOME", description: "Remove (--force se rodando)." },
          { flag: "upgrade NOME", description: "Atualiza o container (apt/dnf/zypper conforme o caso)." },
          { flag: "enter NOME -- CMD", description: "Roda comando único sem entrar no shell.", example: "distrobox enter ubuntu -- apt update" },
          { flag: "--root", description: "Cria container rootful (em vez de rootless padrão)." },
        ]}
      />

      <h2>6. toolbox — alternativa do Fedora</h2>

      <p>
        <code>toolbox</code> é a ferramenta da Red Hat com a mesma ideia, mas focada em containers
        Fedora/RHEL. É mais simples (menos opções) e exclusivamente Podman.
      </p>

      <TerminalBlock command="yay -S toolbox" output="==> Making package: toolbox 0.0.99.6-1" />

      <TerminalBlock
        command="toolbox create --distro fedora --release 41"
        output={`Image required to create toolbox container.
Download registry.fedoraproject.org/fedora-toolbox:41 (500MB)? [y/N]: y
Created container: fedora-toolbox-41
Enter with: toolbox enter fedora-toolbox-41`}
      />

      <TerminalBlock command="toolbox list" output={`IMAGE ID      IMAGE NAME                                       CREATED
abc123def456  registry.fedoraproject.org/fedora-toolbox:41    2 minutes ago

CONTAINER ID  CONTAINER NAME      CREATED        STATUS    IMAGE NAME
xyz789abc012  fedora-toolbox-41   2 minutes ago  created   registry.fedoraproject.org/fedora-toolbox:41`} />

      <TerminalBlock
        command="toolbox enter fedora-toolbox-41"
        output={`⬢[joao@toolbox ~]$ `}
      />

      <AlertBox type="info" title="distrobox vs toolbox?">
        <strong>distrobox</strong> é mais flexível (qualquer imagem OCI, várias distros, integração
        completa). <strong>toolbox</strong> é mais opinativo e estável, mas só Fedora/CentOS/RHEL.
        Em Arch a comunidade prefere distrobox.
      </AlertBox>

      <h2>7. Quando usar cada coisa</h2>

      <OutputBlock
        title="árvore de decisão"
        output={`SSH caiu / preciso de sessão persistente?    → tmux (ou screen)
Quero status bar bonita pronta?              → byobu
GUI travou, preciso debugar?                 → Ctrl+Alt+F3 (TTY)
Servidor caseiro com login automático?       → getty + agetty --autologin
Preciso de software .deb / RPM no Arch?     → distrobox (Ubuntu/Fedora)
Quero ambiente isolado para um projeto?     → distrobox (Alpine, novo Ubuntu, etc.)
Estou no Fedora Silverblue?                 → toolbox`}
      />

      <h2>8. Cola final</h2>

      <OutputBlock
        title="comandos para lembrar amanhã"
        output={`# TTYs
Ctrl+Alt+F2..F6      mudar de console
sudo chvt 3          mudar via terminal
tty                  qual TTY estou agora?

# tmux
tmux new -s nome     cria sessão
tmux a -t nome       reanexa
Ctrl+b d             detach
Ctrl+b %             split vertical
Ctrl+b "             split horizontal
Ctrl+b z             zoom no painel
Ctrl+b ?             ajuda

# screen
screen -S nome       cria
screen -r nome       reanexa
Ctrl+a d             detach
Ctrl+a c             nova janela

# distrobox
distrobox create -n N -i IMG
distrobox enter N
distrobox list
distrobox-export --bin /usr/bin/apt`}
      />
    </PageContainer>
  );
}
