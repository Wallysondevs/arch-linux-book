import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function IOStat() {
  return (
    <PageContainer
      title="iostat, vmstat, mpstat, sar — métricas de performance"
      subtitle="O pacote sysstat: como medir CPU, memória, disco e rede em tempo real e historicamente. Interpretar %util, await, svctm e load."
      difficulty="avancado"
      timeToRead="40 min"
      category="Performance"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo pacman -S sysstat</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>iostat</strong> — mostra estatísticas de I/O por dispositivo (parte do <code>sysstat</code>).
      </p>
      <p>
        <strong>%util</strong> — porcentagem de tempo que o disco esteve ocupado. Próximo de 100% = gargalo.
      </p>
      <p>
        <strong>await</strong> — tempo médio (ms) que cada I/O esperou (queue + service).
      </p>
      <p>
        <strong>IOPS</strong> — I/O Operations Per Second.
      </p>

      <p>
        Quando o servidor lenta ou o desktop fica travando, a primeira pergunta é{" "}
        <em>onde está o gargalo?</em> CPU saturada, swap ativo, disco enfileirando,
        rede congestionada? O pacote <code>sysstat</code> (origem dos comandos
        <code> iostat</code>, <code>vmstat</code>, <code>mpstat</code>, <code>sar</code>) é a
        ferramenta clássica de UNIX para responder isso — sem GUI, com saída amigável a
        scripts e históricos persistentes.
      </p>

      <AlertBox type="info" title="Instalação">
        <code>sudo pacman -S sysstat</code>. Para ativar a coleta histórica do{" "}
        <code>sar</code>, habilite o serviço:{" "}
        <code>sudo systemctl enable --now sysstat.service sysstat-collect.timer sysstat-summary.timer</code>.
        Os dados ficam em <code>/var/log/sa/</code>.
      </AlertBox>

      <TerminalBlock
        command="sudo pacman -S sysstat"
        output={`resolving dependencies...
Packages (1) sysstat-12.7.7-1
Total Installed Size:  2.34 MiB
:: Proceed with installation? [Y/n] y
(1/1) installing sysstat                           [##############] 100%`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now sysstat.service sysstat-collect.timer sysstat-summary.timer"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/sysstat.service → /usr/lib/systemd/system/sysstat.service.
Created symlink /etc/systemd/system/timers.target.wants/sysstat-collect.timer → /usr/lib/systemd/system/sysstat-collect.timer.
Created symlink /etc/systemd/system/timers.target.wants/sysstat-summary.timer → /usr/lib/systemd/system/sysstat-summary.timer.`}
      />

      <h2>1. <code>iostat</code> — disco e CPU em paralelo</h2>

      <p>
        O comando-mãe do sysstat. Sintaxe geral: <code>iostat [opções] [intervalo [contagem]]</code>.
        Sem argumentos imprime médias desde o boot; com intervalo, refresca periodicamente.
      </p>

      <TerminalBlock
        command="iostat"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           4.21    0.00    1.83    0.42    0.00   93.54

Device             tps    kB_read/s    kB_wrtn/s    kB_dscd/s    kB_read    kB_wrtn    kB_dscd
nvme0n1           18.42       312.41       228.74         0.00   28471234   20842113          0
sda                0.12         3.21         0.00         0.00     287413          0          0`}
      />

      <h3>1.1. Modo extendido: <code>-x</code></h3>

      <TerminalBlock
        comment="amostragem a cada 1s, métricas detalhadas por device"
        command="iostat -x 1"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           5.84    0.00    2.13    1.82    0.00   90.21

Device   r/s    w/s     rkB/s    wkB/s   rrqm/s wrqm/s  %rrqm  %wrqm  r_await  w_await aqu-sz   rareq-sz wareq-sz   svctm  %util
nvme0n1  12.42  6.12    1842.34  624.21   0.42   1.21    3.27   16.44     0.32     0.41   0.01      148.31   101.96    0.18   3.42
sda       0.00  0.12       0.00    1.50   0.00   0.04    0.00   25.00     0.00     2.34   0.00        0.00    12.50    1.20   0.02

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           7.12    0.00    2.84   {y}28.42{/}    0.00   61.62

Device   r/s    w/s     rkB/s    wkB/s   rrqm/s wrqm/s  %rrqm  %wrqm  r_await  w_await aqu-sz   rareq-sz wareq-sz   svctm  %util
nvme0n1  421.42 312.81 32184.21 18742.13   1.42   8.21    0.34    2.56    {r}24.32{/}     {r}38.21{/}   {r}12.42{/}      76.34    59.87    1.18  {r}94.81{/}
sda       0.00   0.00      0.00    0.00   0.00   0.00    0.00    0.00     0.00     0.00   0.00        0.00     0.00    0.00   0.00`}
      />

      <h3>1.2. Como ler — colunas críticas</h3>

      <OutputBlock
        title="anatomia de uma linha do iostat -x"
        output={`Device   r/s   w/s   rkB/s   wkB/s   r_await   w_await   aqu-sz   svctm   %util
nvme0n1  421   312   32184   18742    24.32     38.21     12.42    1.18    94.81`}
        annotations={[
          { line: 1, note: "r/s + w/s = IOPS lidos + escritos por segundo" },
          { line: 1, note: "rkB/s + wkB/s = throughput (KB/s)" },
          { line: 1, note: "r_await/w_await = LATÊNCIA por requisição em ms (alvo: <10ms HDD, <1ms NVMe)" },
          { line: 1, note: "aqu-sz = profundidade média da fila (>1 = enfileirando)" },
          { line: 1, note: "svctm = tempo de serviço puro (sem fila) — métrica não-confiável em kernels modernos" },
          { line: 1, note: "%util = quanto tempo o device esteve OCUPADO (>80% = saturado em HDD)" },
        ]}
        caption="Em SSDs/NVMe modernos, %util pode chegar a 90% sem indicar gargalo (paralelismo interno). Olhe r_await/w_await + aqu-sz para diagnóstico real."
      />

      <CommandFlagList
        command="iostat — flags principais"
        items={[
          { flag: "-x", description: "Estatísticas estendidas (await, %util, queue size)." },
          { flag: "-h", description: "Human-readable (KB → MB/GB conforme tamanho)." },
          { flag: "-m", description: "Saída em MB/s em vez de KB/s." },
          { flag: "-d", description: "Apenas devices (omite a seção de CPU)." },
          { flag: "-c", description: "Apenas CPU (omite devices)." },
          { flag: "-p ALL", description: "Inclui partições individuais, não só os discos.", example: "iostat -xp ALL 1" },
          { flag: "-N", description: "Mostra nomes do device-mapper (dm-0 → vg-root)." },
          { flag: "-y", description: "Pula o relatório inicial (médias do boot)." },
          { flag: "-t", description: "Imprime timestamp em cada amostra." },
          { flag: "-z", description: "Omite linhas zeradas (mais limpo)." },
          { flag: "INT [COUNT]", description: "Intervalo em segundos e quantidade.", example: "iostat -xz 2 5" },
        ]}
      />

      <h3>1.3. Diagnóstico rápido — disco está sofrendo?</h3>

      <TerminalBlock
        command="iostat -xz 2"
        output={`Device   r/s    w/s     rkB/s    wkB/s   r_await  w_await aqu-sz  %util
nvme0n1  582.41 412.34  41842.21 28471.13  {r}48.21{/}    {r}62.34{/}   {r}28.41{/}   {r}99.84{/}`}
      />

      <AlertBox type="danger" title="Sinais de saturação de disco">
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          <li><code>%util</code> sustentado &gt;90% em HDD (em NVMe é menos confiável).</li>
          <li><code>aqu-sz</code> &gt;2 — requisições enfileirando.</li>
          <li><code>r_await</code>/<code>w_await</code> &gt;20ms em SSD ou &gt;100ms em HDD.</li>
          <li><code>%iowait</code> alto na seção CPU = processos esperando I/O.</li>
        </ul>
      </AlertBox>

      <h2>2. <code>vmstat</code> — pressão de memória, swap e contexto</h2>

      <TerminalBlock
        command="vmstat 1 5"
        output={`procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 7156432 184628 4654212    0    0    34    52  812 1923  4  2 93  1  0
 0  0      0 7156208 184628 4654280    0    0     0     0  745 1812  3  1 96  0  0
 3  1      0 6234121 184628 5234212    {y}412{/}  {y}821{/}  18420 32184 4234 8421 24 12 42 22  0
 4  2      0 5842121 184628 5512412    {r}621{/}  {r}1284{/} 24213 38412 5821 9842 32 18 28 22  0
 5  3      0 5421342 184628 5784213    {r}824{/}  {r}1842{/} 28412 41213 6234 12431 38 22 16 24  0`}
      />

      <h3>2.1. Como ler vmstat</h3>

      <OutputBlock
        title="colunas mais importantes"
        output={`r          processos PRONTOS para CPU (na fila)        — r > nproc = saturação CPU
b          processos BLOQUEADOS (esperando I/O)          — b > 0 sustentado = bottleneck I/O
swpd       memória em swap (KB)
free       memória LIVRE (KB)
buff       buffer cache (metadata FS)
cache      page cache (conteúdo de arquivos)
si         swap-in (KB/s lidos do swap)                  — si > 0 = thrashing iminente
so         swap-out (KB/s gravados no swap)              — so > 0 sustentado = swap ativo
bi/bo      block in/out (KB/s lidos/escritos em disco)
in         interrupções por segundo
cs         context switches por segundo                  — cs alto = muitos threads brigando
us/sy/id   %CPU user / system / idle
wa         %CPU em I/O wait                              — wa alto = aguardando disco
st         %CPU "roubada" pelo hipervisor (em VM)`}
      />

      <h3>2.2. <code>vmstat -s</code> — totais desde o boot</h3>

      <TerminalBlock
        command="vmstat -s | head -20"
        output={`     16257316 K total memory
      4234212 K used memory
       412342 K active memory
      3421842 K inactive memory
      7156432 K free memory
       184628 K buffer memory
      4654212 K swap cache
      8388604 K total swap
            0 K used swap
      8388604 K free swap
     12834213   non-nice user cpu ticks
            0   nice user cpu ticks
      4234212   system cpu ticks
    283412342   idle cpu ticks
      1842342   IO-wait cpu ticks
            0   IRQ cpu ticks
       384213   softirq cpu ticks
            0   stolen cpu ticks
            0   non-nice guest cpu ticks
            0   nice guest cpu ticks`}
      />

      <h2>3. <code>mpstat</code> — CPU por core</h2>

      <TerminalBlock
        command="mpstat -P ALL 1 1"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

03:42:18 PM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
03:42:19 PM  all    8.42    0.00    2.13    0.84    0.00    0.21    0.00    0.00    0.00   88.40
03:42:19 PM    0   12.34    0.00    3.21    0.00    0.00    0.42    0.00    0.00    0.00   84.03
03:42:19 PM    1    {r}98.42{/}    0.00    {r}1.58{/}    0.00    0.00    0.00    0.00    0.00    0.00    0.00
03:42:19 PM    2    4.21    0.00    1.84    0.00    0.00    0.21    0.00    0.00    0.00   93.74
03:42:19 PM    3    3.42    0.00    2.13    8.42    0.00    0.00    0.00    0.00    0.00   86.03
03:42:19 PM    4    2.13    0.00    1.42    0.00    0.00    0.00    0.00    0.00    0.00   96.45
03:42:19 PM    5    1.84    0.00    0.84    0.00    0.00    0.00    0.00    0.00    0.00   97.32
03:42:19 PM    6    1.42    0.00    0.42    0.00    0.00    0.00    0.00    0.00    0.00   98.16
03:42:19 PM    7    0.84    0.00    0.42    0.00    0.00    0.00    0.00    0.00    0.00   98.74
03:42:19 PM    8    0.42    0.00    0.21    0.00    0.00    0.00    0.00    0.00    0.00   99.37
03:42:19 PM    9    0.21    0.00    0.21    0.00    0.00    0.00    0.00    0.00    0.00   99.58
03:42:19 PM   10    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00  100.00
03:42:19 PM   11    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00  100.00`}
      />

      <p>
        No exemplo a média dos 12 cores é 8.42%, mas o <strong>core 1 está pregado em 100%</strong>{" "}
        — sintoma clássico de processo single-thread saturando uma CPU. Sem o <code>mpstat -P ALL</code>{" "}
        você nunca veria isso no <code>top</code>/<code>htop</code> sem entrar em modo "show
        per-CPU".
      </p>

      <CommandFlagList
        command="mpstat"
        items={[
          { flag: "-P ALL", description: "Uma linha por CPU (default mostra só a média)." },
          { flag: "-P 0,1,5", description: "CPUs específicas (subconjunto)." },
          { flag: "-I SUM", description: "Interrupções totais por CPU." },
          { flag: "-I CPU", description: "Detalhamento por tipo de IRQ." },
          { flag: "-A", description: "Tudo: stats por CPU + IRQs (relatório completo)." },
          { flag: "-u", description: "Apenas estatísticas de utilização (default)." },
          { flag: "INT [COUNT]", description: "Intervalo + contagem.", example: "mpstat -P ALL 2 5" },
        ]}
      />

      <h2>4. <code>pidstat</code> — métricas por processo</h2>

      <TerminalBlock
        comment="todos os processos, taxa de CPU a cada 2 segundos"
        command="pidstat 2 1"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

03:45:21 PM   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
03:45:23 PM  1000      1234    {r}98.50{/}    1.50    0.00    0.00  100.00     1  ffmpeg
03:45:23 PM  1000      4521    12.50    2.50    0.00    0.50   15.00     5  firefox
03:45:23 PM  1000      4612     4.50    1.00    0.00    0.00    5.50     8  gnome-shell
03:45:23 PM     0       412     0.50    1.00    0.00    0.00    1.50     2  systemd-journal`}
      />

      <CommandFlagList
        command="pidstat"
        items={[
          { flag: "-u (default)", description: "%CPU." },
          { flag: "-r", description: "Memória (page faults, RSS, VSZ).", example: "pidstat -r 2" },
          { flag: "-d", description: "I/O por processo (KB lidos/escritos por segundo)." },
          { flag: "-w", description: "Context switches por processo." },
          { flag: "-t", description: "Inclui threads (não só processos)." },
          { flag: "-p PID", description: "Filtra um PID específico." },
          { flag: "-C 'PAT'", description: "Filtra por nome de comando (regex).", example: "pidstat -C 'firefox' 1" },
        ]}
      />

      <TerminalBlock
        comment="quem está machucando o disco?"
        command="pidstat -d 2 1"
        output={`03:48:42 PM   UID       PID    kB_rd/s    kB_wr/s  kB_ccwr/s    iodelay  Command
03:48:44 PM  1000      8421    18420.50   24213.50       0.00          4    rsync
03:48:44 PM     0       412        0.50      842.00       0.00          0    journald
03:48:44 PM  1000      4521      124.00      512.50       0.00          1    firefox`}
      />

      <h2>5. <code>sar</code> — histórico persistente</h2>

      <p>
        O <code>sar</code> lê os arquivos binários gerados pelo <code>sysstat-collect.timer</code>{" "}
        em <code>/var/log/sa/</code>. Cada arquivo <code>saDD</code> contém os dados do dia DD do
        mês corrente — você consegue investigar problemas <em>de ontem</em> sem precisar estar
        olhando ao vivo.
      </p>

      <TerminalBlock
        command="ls /var/log/sa/"
        output={`sa20  sa21  sa22  sa23  sa24  sa25  sa26
sar20 sar21 sar22 sar23 sar24 sar25`}
      />

      <h3>5.1. CPU</h3>

      <TerminalBlock
        command="sar 2 3"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

03:51:42 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
03:51:44 PM     all      8.42      0.00      2.13      0.84      0.00     88.61
03:51:46 PM     all      9.21      0.00      2.42      0.42      0.00     87.95
03:51:48 PM     all      7.84      0.00      1.84      1.21      0.00     89.11
Average:        all      8.49      0.00      2.13      0.82      0.00     88.56`}
      />

      <h3>5.2. Histórico do dia</h3>

      <TerminalBlock
        comment="médias do dia atual, intervalos de 10 minutos"
        command="sar -u | head -10"
        output={`Linux 6.12.1-arch1-1 (archlinux)  03/26/2026  _x86_64_    (12 CPU)

12:00:01 AM     CPU     %user     %nice   %system   %iowait    %steal     %idle
12:10:01 AM     all      0.42      0.00      0.21      0.00      0.00     99.37
12:20:01 AM     all      0.32      0.00      0.18      0.00      0.00     99.50
12:30:01 AM     all      0.28      0.00      0.16      0.00      0.00     99.56
...
03:50:01 PM     all      8.42      0.00      2.13      {r}28.42{/}      0.00     61.03`}
      />

      <CommandFlagList
        command="sar — relatórios"
        items={[
          { flag: "-u", description: "CPU (default)." },
          { flag: "-r", description: "Memória (kbmemfree, kbmemused, %memused, ...)." },
          { flag: "-S", description: "Swap." },
          { flag: "-b", description: "I/O em blocos (taxa total)." },
          { flag: "-d", description: "I/O por device (similar ao iostat -x)." },
          { flag: "-n DEV", description: "Estatísticas de rede por interface." },
          { flag: "-n TCP", description: "Conexões TCP, retransmissões." },
          { flag: "-q", description: "Load average e tamanho de filas." },
          { flag: "-W", description: "Swap-in/out por segundo." },
          { flag: "-A", description: "TUDO." },
          { flag: "-f /var/log/sa/saDD", description: "Lê dados de outro dia.", example: "sar -u -f /var/log/sa/sa24" },
          { flag: "-s HH:MM -e HH:MM", description: "Limita janela de tempo.", example: "sar -u -s 14:00 -e 15:30" },
        ]}
      />

      <TerminalBlock
        comment="memória do dia 24, das 14h às 16h"
        command="sar -r -f /var/log/sa/sa24 -s 14:00 -e 16:00"
        output={`02:00:01 PM kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit
02:10:01 PM   7234212  10842113   4234212     26.04    184628   4654212   8421342
02:20:01 PM   6234121   9842113   5234212     32.18    184628   5234212   9421342
02:30:01 PM   5421342   8512442   6234121     38.34    184628   5784213  10421342
...`}
      />

      <h2>6. Arquivo de configuração</h2>

      <p>
        O período de coleta padrão é a cada 10 minutos. Para granularidade maior, edite o timer:
      </p>

      <TerminalBlock command="sudo systemctl edit sysstat-collect.timer" />

      <OutputBlock
        title="override.conf — coleta a cada 2 minutos"
        output={`[Timer]
OnCalendar=
OnCalendar=*:00/02`}
      />

      <p>
        Os parâmetros gerais (quantos dias guardar, ativar todos os tipos) ficam em{" "}
        <code>/etc/sysstat/sysstat</code>:
      </p>

      <TerminalBlock
        command="grep -E '^[A-Z]' /etc/sysstat/sysstat"
        output={`HISTORY=28
COMPRESSAFTER=10
SADC_OPTIONS="-S DISK,XDISK,SNMP,IPV6,POWER"
ZIP="xz"`}
      />

      <h2>7. Receitas práticas</h2>

      <h3>7.1. CPU bound vs I/O bound</h3>

      <OutputBlock
        title="árvore de decisão"
        output={`Sistema lento. O que é?

  vmstat 1 (olhar 'r', 'wa')
  ├── r > nproc          → CPU saturada
  │   └── mpstat -P ALL  → algum core específico? (single-thread)
  │       └── pidstat 1   → qual processo?
  │
  ├── wa alto (>20%)     → I/O bound
  │   └── iostat -xz 1   → qual device? %util alto?
  │       └── pidstat -d  → qual processo está lendo/escrevendo?
  │
  ├── si/so > 0          → swap thrashing
  │   └── pidstat -r 1   → memória crescente em quem?
  │
  └── tudo zerado        → talvez rede: sar -n DEV 1`}
      />

      <h3>7.2. Salvar uma amostra para análise posterior</h3>

      <TerminalBlock
        command="sar -A -o /tmp/sample.sar 5 60"
        output="(coleta 60 amostras de 5s, salva em binário)"
      />

      <TerminalBlock
        command="sar -u -f /tmp/sample.sar | tail -5"
        output={`Average:        all      8.42      0.00      2.13      0.84      0.00     88.61`}
      />

      <h2>8. Cheat sheet</h2>

      <OutputBlock
        title="comandos essenciais"
        output={`# pacote
sudo pacman -S sysstat
sudo systemctl enable --now sysstat.service sysstat-collect.timer

# tempo real
iostat -xz 1            # disco + CPU, omite zeros
vmstat 1 10             # memória, swap, blocos
mpstat -P ALL 1         # CPU por core
pidstat -d 1            # I/O por processo
pidstat -r 1            # memória por processo

# histórico
sar -u                  # CPU do dia
sar -r                  # memória do dia
sar -d                  # disco do dia
sar -n DEV              # rede do dia
sar -f /var/log/sa/sa24 # outro dia
sar -s 14:00 -e 15:00   # janela específica`}
      />

      <AlertBox type="success" title="Combine com htop e atop">
        <code>htop</code> mostra a foto interativa do agora. <code>atop</code> grava
        snapshots completos a cada N segundos e <strong>preserva o estado dos processos
        mortos</strong> — perfeito para post-mortem. <code>iostat/vmstat/sar</code> dão a
        métrica numérica precisa para correlacionar.
      </AlertBox>
    </PageContainer>
  );
}
