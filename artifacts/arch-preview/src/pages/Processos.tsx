import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Processos() {
  return (
    <PageContainer
      title="Processos e Gerenciamento de Tarefas"
      subtitle="Cada comando demonstrado com a saída real do terminal — desde ps aux até Magic SysRq quando tudo trava."
      difficulty="intermediario"
      timeToRead="35 min"
    >
      <p>
        Tudo que executa no Linux é um <strong>processo</strong>: um PID único, um pai (PPID), uma identidade
        (UID/GID), um estado, prioridade (<code>nice</code>), memória mapeada, file descriptors abertos e um
        cgroup que define seus limites. Saber ler <code>ps</code>, <code>top</code> e <code>/proc</code> é o
        que separa adivinhação de diagnóstico.
      </p>

      <h2>1. Listando processos — ps</h2>
      <p>
        O <code>ps</code> aceita três sintaxes (BSD sem hífen, UNIX com hífen, GNU com <code>--</code>).
        A combinação mais usada é <code>ps aux</code>.
      </p>

      <TerminalBlock
        command="ps aux | head"
        output={`USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.1 168320 12480 ?        Ss   09:13   0:01 /sbin/init
root           2  0.0  0.0      0     0 ?        S    09:13   0:00 [kthreadd]
root           3  0.0  0.0      0     0 ?        I<   09:13   0:00 [rcu_gp]
root         437  0.0  0.2 234560 18432 ?        Ss   09:13   0:00 /usr/lib/systemd/systemd-journald
root         462  0.0  0.0  21048  5120 ?        Ss   09:13   0:00 /usr/lib/systemd/systemd-udevd
dbus         512  0.0  0.1  10240  6912 ?        Ss   09:13   0:00 /usr/bin/dbus-broker-launch --scope system
user        1834  0.4  1.2 825472 99840 ?        Sl   09:32   0:23 /usr/bin/gnome-shell
user        2104  3.2  4.8 4567288 389120 ?      Sl   09:35  12:48 /usr/lib/firefox/firefox
user        4521  0.0  0.0  10240  3328 pts/0    R+   11:42   0:00 ps aux`}
      />

      <OutputBlock
        title="anatomia das colunas (ps aux)"
        output={`USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
user        2104  3.2  4.8 4567288 389120 ?     Sl   09:35  12:48 /usr/lib/firefox/firefox`}
        annotations={[
          { line: 0, note: "cabeçalho — ps aux estilo BSD" },
          { line: 1, note: "VSZ = virtual KB · RSS = físico KB · STAT = estado" },
        ]}
        caption='STAT pode ter sufixos: "+" foreground · "<" alta prioridade · "N" baixa · "L" memória travada · "s" líder de sessão · "l" multi-thread.'
      />

      <h3>Estados (coluna STAT)</h3>
      <ul>
        <li><strong>R</strong> — Running ou na fila de execução.</li>
        <li><strong>S</strong> — Sleeping (interruptível, esperando evento).</li>
        <li><strong>D</strong> — Uninterruptible sleep (geralmente I/O — não dá para matar com kill).</li>
        <li><strong>T</strong> — Stopped (Ctrl+Z, SIGSTOP).</li>
        <li><strong>t</strong> — Tracing stop (debugger anexado).</li>
        <li><strong>Z</strong> — Zumbi (terminou, pai não chamou wait()).</li>
        <li><strong>X</strong> — Morto (raro, transitório).</li>
        <li><strong>I</strong> — Idle kernel thread.</li>
      </ul>

      <h3>Variações úteis</h3>
      <TerminalBlock
        comment="estilo UNIX com PPID e árvore"
        command="ps -ef --forest | head -15"
        output={`UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 09:13 ?        00:00:01 /sbin/init
root         437       1  0 09:13 ?        00:00:00 /usr/lib/systemd/systemd-journald
root         462       1  0 09:13 ?        00:00:00 /usr/lib/systemd/systemd-udevd
root         640       1  0 09:13 ?        00:00:00 /usr/bin/sshd -D
root        4380     640  0 11:08 ?        00:00:00  \\_ sshd: user [priv]
user        4385    4380  0 11:08 ?        00:00:00      \\_ sshd: user@pts/1
user        4386    4385  0 11:08 pts/1    00:00:00          \\_ -bash
user        4521    4386  0 11:42 pts/1    00:00:00              \\_ ps -ef --forest`}
      />

      <TerminalBlock
        comment="ordenar pelos 5 mais glutões de RAM"
        command="ps aux --sort=-%mem | head -6"
        output={`USER         PID %CPU %MEM    VSZ    RSS TTY      STAT START   TIME COMMAND
user        2104  3.2  4.8 4567288 389120 ?     Sl   09:35  12:48 /usr/lib/firefox/firefox
user        2210  1.1  2.9 2987456 235520 ?     Sl   09:36   3:21 /usr/lib/firefox/firefox -contentproc -childID 1
user        1834  0.4  1.2  825472  99840 ?     Sl   09:32   0:23 /usr/bin/gnome-shell
user        2890  0.2  0.8  654320  64512 ?     Sl   10:01   0:08 /usr/bin/code
root         437  0.0  0.2  234560  18432 ?     Ss   09:13   0:00 /usr/lib/systemd/systemd-journald`}
      />

      <TerminalBlock
        comment="formato customizado — só o que interessa"
        command="ps -eo pid,user,ni,pri,stat,comm --sort=-pri | head"
        output={`    PID USER       NI PRI STAT COMMAND
    437 root        0  19 Ss   systemd-journald
   2104 user        0  19 Sl   firefox
   1834 user        0  19 Sl   gnome-shell
      9 root      -20  39 I<   kworker/R-mm_pe
     11 root      -20  39 I<   kworker/R-rcu_g
      1 root        0  19 Ss   systemd`}
      />

      <h3>pgrep — só os PIDs</h3>
      <TerminalBlock command="pgrep firefox" output={`2104
2210
2295
2380`} />

      <TerminalBlock
        comment="-l adiciona o nome, -a adiciona a linha de comando completa"
        command="pgrep -a firefox"
        output={`2104 /usr/lib/firefox/firefox
2210 /usr/lib/firefox/firefox -contentproc -childID 1 -isForBrowser
2295 /usr/lib/firefox/firefox -contentproc -childID 2 -isForBrowser
2380 /usr/lib/firefox/firefox -contentproc -childID 3 -isForBrowser`}
      />

      <TerminalBlock command="pgrep -c firefox" output="4" comment="quantos processos do firefox existem" />
      <TerminalBlock command="pgrep -u user bash" output={`4386
4920`} comment="bash do usuário 'user'" />

      <h2>2. Monitoramento em tempo real — top, htop, btop</h2>

      <h3>top (vem em todo Linux)</h3>
      <TerminalBlock
        command="top -bn1 | head -15"
        output={`top - 11:48:22 up  2:35,  3 users,  load average: 0.42, 0.38, 0.35
Tasks: 248 total,   1 running, 247 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 94.5 id,  0.1 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :  15832.5 total,   4123.4 free,   5421.8 used,   6287.3 buff/cache
MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.   9912.7 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   2104 user      20   0 4567288 389120 153600 S   8.3   2.4  12:48.21 firefox
   1834 user      20   0  825472  99840  72192 S   1.0   0.6   0:23.45 gnome-shell
   2210 user      20   0 2987456 235520  98304 S   0.7   1.5   3:21.10 firefox
    437 root      20   0  234560  18432  16384 S   0.0   0.1   0:00.84 systemd-journal
      1 root      20   0  168320  12480  10240 S   0.0   0.1   0:01.32 systemd`}
      />

      <OutputBlock
        title="cabeçalho do top — leia da esquerda para a direita"
        output={`top - 11:48:22 up  2:35,  3 users,  load average: 0.42, 0.38, 0.35
Tasks: 248 total,   1 running, 247 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 94.5 id,  0.1 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :  15832.5 total,   4123.4 free,   5421.8 used,   6287.3 buff/cache
MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.   9912.7 avail Mem`}
        annotations={[
          { line: 0, note: "load avg: 1, 5 e 15 min" },
          { line: 1, note: "1 R running · 247 S sleeping" },
          { line: 2, note: "us=user · sy=kernel · id=ocioso · wa=I/O wait" },
          { line: 3, note: "buff/cache é REUTILIZÁVEL" },
          { line: 4, note: "0.0 used = não está usando swap" },
        ]}
      />

      <h3>Atalhos dentro do top</h3>
      <CommandFlagList
        command="top (interativo)"
        items={[
          { flag: "h", long: "?", description: "Ajuda completa." },
          { flag: "q", description: "Sai." },
          { flag: "k", description: "Mata um processo (pede PID e sinal — padrão 15)." },
          { flag: "r", description: "Renice (mudar prioridade)." },
          { flag: "M", description: "Ordenar por %MEM." },
          { flag: "P", description: "Ordenar por %CPU (default)." },
          { flag: "T", description: "Ordenar por TIME+." },
          { flag: "1", description: "Mostra cada core de CPU separado." },
          { flag: "c", description: "Caminho completo do comando × só o nome." },
          { flag: "u", description: "Filtra por usuário." },
          { flag: "V", description: "Modo árvore (forest)." },
          { flag: "Z", description: "Edita as cores." },
        ]}
      />

      <h3>htop — top com cores e mouse</h3>
      <TerminalBlock command="sudo pacman -S htop" output={`resolving dependencies...
looking for conflicting packages...

Packages (1) htop-3.3.0-1

Total Download Size:    0.13 MiB
Total Installed Size:   0.40 MiB

:: Proceed with installation? [Y/n]`} />

      <p>
        Atalhos do htop: <kbd>F2</kbd> setup, <kbd>F3</kbd> buscar, <kbd>F4</kbd> filtrar, <kbd>F5</kbd> árvore,
        <kbd>F6</kbd> ordenar, <kbd>F9</kbd> kill (escolhe sinal), <kbd>F10</kbd> sair, <kbd>Space</kbd> selecionar
        múltiplos, <kbd>u</kbd> filtrar usuário.
      </p>

      <h2>3. Sinais (signals)</h2>
      <TerminalBlock
        command="kill -l"
        output={` 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1 ...`}
      />

      <CommandFlagList
        command="sinais essenciais"
        items={[
          { flag: "1 SIGHUP", description: "Hangup. Convencionalmente: recarregar config (nginx, sshd).", example: "kill -1 $(pgrep nginx)" },
          { flag: "2 SIGINT", description: "Interrupt. O que o Ctrl+C envia.", example: "kill -2 4521" },
          { flag: "3 SIGQUIT", description: "Quit + core dump. Ctrl+\\ envia.", example: "kill -3 4521" },
          { flag: "9 SIGKILL", description: "Mata IMEDIATAMENTE. Não pode ser ignorado nem manipulado.", example: "kill -9 4521" },
          { flag: "15 SIGTERM", description: "Pede para encerrar com graça. Default do kill.", example: "kill 4521" },
          { flag: "18 SIGCONT", description: "Continua um processo parado.", example: "kill -CONT 4521" },
          { flag: "19 SIGSTOP", description: "Pausa. Não pode ser ignorado.", example: "kill -STOP 4521" },
          { flag: "20 SIGTSTP", description: "Terminal stop. O que o Ctrl+Z envia.", example: "kill -TSTP 4521" },
        ]}
      />

      <AlertBox type="warning" title="SIGTERM antes de SIGKILL — sempre">
        <code>SIGTERM</code> deixa o processo fechar arquivos, salvar dados, soltar locks. <code>SIGKILL</code> derruba na hora —
        pode deixar arquivos corrompidos, sockets abertos e <code>.pacman.lock</code> trancado.
      </AlertBox>

      <h2>4. Matando processos — kill, killall, pkill</h2>

      <TerminalBlock
        comment="kill educado (SIGTERM)"
        command="kill 2104"
        output=""
      />
      <TerminalBlock
        comment="forçar (SIGKILL)"
        command="kill -9 2104"
        output=""
      />
      <TerminalBlock
        comment="processo já morreu antes do segundo kill"
        command="kill 99999"
        output="bash: kill: (99999) - No such process"
        exitCode={1}
      />
      <TerminalBlock
        comment="sem permissão (PID de outro usuário)"
        command="kill 437"
        output="bash: kill: (437) - Operation not permitted"
        exitCode={1}
      />

      <h3>killall — por nome EXATO</h3>
      <TerminalBlock command="killall firefox" output="" />
      <TerminalBlock
        command="killall firefox"
        output="firefox: no process found"
        exitCode={1}
      />
      <TerminalBlock
        comment="killall -i pede confirmação por processo"
        command="killall -i firefox"
        output={`Kill firefox(2104) ? (y/N) y
Kill firefox(2210) ? (y/N) y
Kill firefox(2295) ? (y/N) n`}
      />
      <TerminalBlock
        comment="killall -o = older than"
        command="killall -o 1h chrome"
        output=""
      />

      <h3>pkill — por padrão (regex parcial)</h3>
      <TerminalBlock
        comment="atenção: 'fire' bate com firefox, firewalld, fired..."
        command="pgrep -a fire"
        output={`2104 /usr/lib/firefox/firefox
2210 /usr/lib/firefox/firefox -contentproc -childID 1
640 /usr/bin/firewalld --nofork --nopid`}
      />
      <TerminalBlock
        command="pkill -x firefox"
        output=""
        comment="-x exige nome EXATO"
      />
      <TerminalBlock
        command="pkill -9 -u maria"
        output=""
        comment="kill -9 em todos os processos da maria"
      />
      <TerminalBlock
        command="pkill -P 4385"
        output=""
        comment="mata todos os filhos do PID 4385"
      />

      <AlertBox type="danger" title="Cuidado com pkill por padrão parcial">
        <code>pkill ssh</code> mata <strong>sshd, ssh-agent</strong> e todas as sessões SSH ativas, incluindo
        a sua se você estiver remoto. Sempre rode <code>pgrep -a ssh</code> ANTES.
      </AlertBox>

      <h2>5. Prioridade — nice e renice</h2>
      <p>
        Niceness vai de <strong>-20</strong> (mais prioritário) a <strong>+19</strong> (mais "gentil"). Padrão = 0.
        Apenas root pode usar valores negativos (mais prioridade).
      </p>

      <TerminalBlock
        comment="iniciar processo gentil (NI=10)"
        command="nice -n 10 tar czf backup.tar.gz /home/user"
        output=""
      />
      <TerminalBlock
        command="ps -eo pid,ni,comm | grep tar"
        output={`   4860  10 tar`}
      />
      <TerminalBlock
        comment="renice em processo já rodando"
        command="renice 5 -p 4860"
        output="4860 (process ID) old priority 10, new priority 5"
      />
      <TerminalBlock
        command="sudo renice -10 -p 2104"
        output="2104 (process ID) old priority 0, new priority -10"
      />
      <TerminalBlock
        comment="usuário comum tentando aumentar prioridade"
        command="renice -5 -p 2104"
        output="renice: failed to set priority for 2104 (process ID): Permission denied"
        exitCode={1}
      />

      <h2>6. Background, foreground, jobs</h2>

      <TerminalBlock
        comment="iniciar em background com &"
        command="sleep 300 &"
        output={`[1] 5012`}
      />
      <TerminalBlock
        comment="iniciar mais um"
        command="sleep 600 &"
        output={`[2] 5013`}
      />
      <TerminalBlock
        command="jobs"
        output={`[1]-  Running                 sleep 300 &
[2]+  Running                 sleep 600 &`}
      />
      <OutputBlock
        title="jobs — colunas"
        output={`[1]-  Running                 sleep 300 &
[2]+  Running                 sleep 600 &`}
        annotations={[
          { line: 0, note: "[N]+ = job ATUAL · [N]- = anterior" },
        ]}
      />

      <TerminalBlock
        comment="trazer job 1 para foreground"
        command="fg %1"
        output={`sleep 300
{dim}^Z{/}
[1]+  Stopped                 sleep 300`}
      />
      <TerminalBlock
        comment="continuar em background"
        command="bg %1"
        output={`[1]+ sleep 300 &`}
      />
      <TerminalBlock
        comment="desanexar do shell — sobrevive ao logout"
        command="disown %1"
        output=""
      />

      <h3>nohup — sobreviver ao logout</h3>
      <TerminalBlock
        command="nohup ./script_longo.sh > saida.log 2>&1 &"
        output={`[3] 5421
nohup: ignoring input and redirecting stderr to stdout`}
      />

      <h2>7. Diagnóstico do sistema</h2>

      <h3>uptime</h3>
      <TerminalBlock
        command="uptime"
        output=" 12:04:18 up  2:51,  3 users,  load average: 0.18, 0.31, 0.34"
      />

      <h3>free — memória</h3>
      <TerminalBlock
        command="free -h"
        output={`               total        used        free      shared  buff/cache   available
Mem:            15Gi       5.3Gi       3.9Gi       512Mi       6.2Gi       9.7Gi
Swap:          8.0Gi          0B       8.0Gi`}
      />
      <OutputBlock
        title="free -h — o que importa"
        output={`               total        used        free      shared  buff/cache   available
Mem:            15Gi       5.3Gi       3.9Gi       512Mi       6.2Gi       9.7Gi
Swap:          8.0Gi          0B       8.0Gi`}
        annotations={[
          { line: 1, note: "available = o que você PODE usar" },
          { line: 2, note: "Swap em 0B = saudável" },
        ]}
        caption="buff/cache não conta como pressão de memória — o kernel libera quando precisar."
      />

      <h3>vmstat — estatísticas resumidas</h3>
      <TerminalBlock
        command="vmstat 1 3"
        output={`procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 1  0      0 4012544 142336 6234880   0    0    21    35  178  321  4  1 95  0  0  0
 0  0      0 4012040 142336 6234896   0    0     0     0  201  389  3  1 96  0  0  0
 0  0      0 4011896 142336 6234896   0    0     0    24  189  342  2  1 97  0  0  0`}
      />

      <h3>pstree — árvore</h3>
      <TerminalBlock
        command="pstree -p user | head"
        output={`systemd(1834)─┬─(sd-pam)(1835)
              ├─dbus-daemon(1840)
              ├─gnome-shell(1900)─┬─{gmain}(1910)
              │                   ├─{gdbus}(1911)
              │                   └─{pool-spawner}(1912)
              ├─pulseaudio(1850)
              ├─sshd(4385)───bash(4386)───vim(4521)
              └─firefox(2104)─┬─firefox(2210)
                              ├─firefox(2295)
                              └─{Renderer}(2380)`}
      />

      <h3>lsof — quem abre o quê</h3>
      <TerminalBlock
        command="sudo lsof -i :8080"
        output={`COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    5821 user   18u  IPv4  98712      0t0  TCP *:8080 (LISTEN)
node    5821 user   24u  IPv4 101234      0t0  TCP localhost:8080->localhost:53412 (ESTABLISHED)`}
      />
      <TerminalBlock
        command="lsof -p 2104 | head"
        output={`COMMAND  PID USER   FD      TYPE DEVICE SIZE/OFF      NODE NAME
firefox 2104 user  cwd       DIR  254,2     4096    524289 /home/user
firefox 2104 user  rtd       DIR  254,2     4096         2 /
firefox 2104 user  txt       REG  254,2  1234567   1048842 /usr/lib/firefox/firefox
firefox 2104 user  mem       REG  254,2  2097152   1048833 /usr/lib/libc.so.6
firefox 2104 user    0u      CHR  136,0      0t0         3 /dev/pts/0
firefox 2104 user    1u      CHR  136,0      0t0         3 /dev/pts/0
firefox 2104 user    2u      CHR  136,0      0t0         3 /dev/pts/0
firefox 2104 user    3u  a_inode   0,15        0       104 [eventpoll]`}
      />

      <h3>fuser — quem está usando este arquivo/porta</h3>
      <TerminalBlock
        command="fuser /var/log/journal/abc123.journal"
        output="/var/log/journal/abc123.journal:   437"
      />
      <TerminalBlock
        command="sudo fuser -v 80/tcp"
        output={`                     USER        PID ACCESS COMMAND
80/tcp:              root        821 F.... nginx
                     http        822 F.... nginx
                     http        823 F.... nginx`}
      />

      <h3>strace — chamadas ao kernel</h3>
      <TerminalBlock
        command="strace -e openat ls /etc/hostname 2>&1 | head"
        output={`openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/lib/libselinux.so.1", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/lib/libcap.so.2", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/lib/libc.so.6", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/proc/filesystems", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/etc/hostname", O_RDONLY|O_CLOEXEC|O_NONBLOCK) = 3
/etc/hostname
+++ exited with 0 +++`}
      />

      <h2>8. Travamentos gráficos — o playbook</h2>

      <h3>Cenário A — só um app travou (resto funciona)</h3>
      <TerminalBlock
        comment="abrir terminal e descobrir os PIDs"
        command="pgrep -a firefox"
        output={`2104 /usr/lib/firefox/firefox
2210 /usr/lib/firefox/firefox -contentproc -childID 1
2295 /usr/lib/firefox/firefox -contentproc -childID 2`}
      />
      <TerminalBlock command="killall firefox" output="" />
      <TerminalBlock
        comment="ainda não morreu? força"
        command="killall -9 firefox"
        output=""
      />

      <h3>Cenário B — Chrome explodiu em 30 processos</h3>
      <TerminalBlock
        command="pgrep -c chrome"
        output="32"
      />
      <TerminalBlock command="killall -9 chrome" output="" />
      <TerminalBlock command="pgrep -c chrome" output="0" />

      <h3>Cenário C — clique para matar (X11)</h3>
      <TerminalBlock
        command="xkill"
        output={`xkill: button 1 in pointer map means delete window. Maybe you wish to use "xkill -button any" to kill any client
Select the window whose client you wish to kill with button 1....
xkill: killing creator of resource 0x1c00001`}
      />

      <h2>9. TTY — o terminal que NUNCA trava</h2>
      <p>
        Quando o GNOME, KDE, X ou Wayland congelam por completo, os <strong>TTYs virtuais</strong> (Ctrl+Alt+F1..F6)
        continuam funcionando — eles vivem fora do servidor gráfico. Esse é seu salva-vidas.
      </p>

      <CodeBlock title="Procedimento de recuperação via TTY" code={`# 1) Pressione  Ctrl + Alt + F3   (vai abrir um login texto puro)
# 2) Faça login com seu usuário
# 3) Identifique o vilão:
ps aux --sort=-%cpu | head
ps aux --sort=-%mem | head

# 4) Mate o programa travado
killall -9 firefox

# 5) Se foi a sessão gráfica que morreu, reinicie o display manager:
sudo systemctl restart gdm    # GNOME
sudo systemctl restart sddm   # KDE Plasma
sudo systemctl restart lightdm

# 6) Volte ao TTY gráfico (geralmente F1 ou F2)
#    Ctrl + Alt + F1`} />

      <AlertBox type="success" title="Memorize: Ctrl+Alt+F3">
        Esse é o atalho mais útil que você vai aprender. Funciona mesmo com a tela congelada.
      </AlertBox>

      <h2>10. Magic SysRq — o último recurso do kernel</h2>
      <p>
        Quando NADA responde — nem TTY, nem mouse, nem rede — o kernel ainda escuta o <strong>SysRq</strong>
        (mesma tecla do Print Screen). Use <strong>REISUB</strong> para reiniciar com segurança.
      </p>

      <TerminalBlock
        comment="ver se SysRq está habilitado"
        command="cat /proc/sys/kernel/sysrq"
        output="176"
      />
      <OutputBlock
        title="bitmask de /proc/sys/kernel/sysrq"
        output={`1   = TUDO habilitado
0   = desabilitado
2   = controle de log
4   = controle de teclado
16  = sync
32  = remontar read-only
64  = sinalizar processos
128 = reboot/poweroff
176 = 16 + 32 + 128 (padrão do Arch — sync, remount, reboot)`}
        caption="Para liberar tudo: echo 1 | sudo tee /proc/sys/kernel/sysrq"
      />

      <CodeBlock title="REISUB — Reboot Even If System Utterly Broken" code={`# Segure  Alt + SysRq  e aperte cada letra com 2-5s entre elas:
R  unraw     →  retoma controle do teclado (sai do modo raw do X)
E  tErm      →  SIGTERM em todos os processos (graceful)
I  kIll      →  SIGKILL em todos os processos
S  Sync      →  flush dos buffers para o disco
U  Unmount   →  remonta sistemas de arquivos read-only
B  reBoot    →  reinicia agora

# Em notebooks geralmente: Fn + Alt + PrintScreen + R E I S U B`} />

      <h3>Escala de emergência</h3>
      <ol>
        <li><strong>App travou</strong> → fecha pelo X, depois <code>killall</code>, depois <code>killall -9</code>.</li>
        <li><strong>Janela responde mas pendura</strong> → <code>xkill</code> (X11) ou <code>kill -9 PID</code>.</li>
        <li><strong>Sessão gráfica morta</strong> → Ctrl+Alt+F3 → <code>systemctl restart gdm</code>.</li>
        <li><strong>Tudo congelado, mas teclado funciona</strong> → REISUB.</li>
        <li><strong>Nada funciona</strong> → segurar power 5s (último recurso, pode corromper FS).</li>
      </ol>

    </PageContainer>
  );
}
