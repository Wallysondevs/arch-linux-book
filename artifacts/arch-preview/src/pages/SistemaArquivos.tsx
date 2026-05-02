import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SistemaArquivos() {
  return (
    <PageContainer
      title="Sistema de Arquivos do Linux (FHS)"
      subtitle="A Filesystem Hierarchy Standard explicada com saídas reais de ls, tree, df, mount, findmnt e du."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Sistema de Arquivos"
    >
      <p>
        No Linux, tudo é organizado a partir de um único ponto: a raiz <code>/</code>.
        Não existem letras de unidade como <code>C:</code> ou <code>D:</code> do Windows.
        Discos, pendrives, partições e dispositivos são todos <em>montados</em> em algum
        ponto dessa árvore. A organização segue a <strong>FHS</strong> (Filesystem Hierarchy Standard).
      </p>

      <h2>1. Olhando para a raiz: <code>ls /</code></h2>
      <p>
        A primeira coisa a fazer é abrir um terminal e listar o que existe na raiz do sistema.
        Em um Arch Linux limpo, a saída costuma ser exatamente esta:
      </p>

      <TerminalBlock
        command="ls -F /"
        output={`{b}bin@{/}   {b}dev/{/}  {b}home/{/}  {b}lib64@{/}  {b}mnt/{/}   {b}proc/{/}  {b}run/{/}   {b}srv/{/}  {b}tmp/{/}  {b}var/{/}
{b}boot/{/}  {b}etc/{/}  {b}lib@{/}   {b}media/{/}  {b}opt/{/}   {b}root/{/}  {b}sbin@{/}  {b}sys/{/}  {b}usr/{/}`}
        comment="Use ls -F para ver o tipo: '/' = diretório, '@' = link simbólico"
      />

      <p>
        Repare nos <code>@</code> ao lado de <code>bin</code>, <code>lib</code>, <code>lib64</code> e
        <code> sbin</code>: no Arch moderno todos esses diretórios são links simbólicos para
        <code> /usr/bin</code> e <code>/usr/lib</code>. É a chamada <em>usrmerge</em>.
      </p>

      <TerminalBlock
        command="ls -la / | grep -E '^l'"
        output={`lrwxrwxrwx   1 root root     7 Jan 15 10:00 {b}bin{/} -> usr/bin
lrwxrwxrwx   1 root root     7 Jan 15 10:00 {b}lib{/} -> usr/lib
lrwxrwxrwx   1 root root     7 Jan 15 10:00 {b}lib64{/} -> usr/lib
lrwxrwxrwx   1 root root     8 Jan 15 10:00 {b}sbin{/} -> usr/bin`}
        comment="-l no início = link simbólico; o destino aparece após a seta '->'"
      />

      <h2>2. Visão geral com <code>tree -L 1 /</code></h2>

      <TerminalBlock
        command="tree -L 1 -F --dirsfirst /"
        output={`{b}/{/}
├── {b}boot/{/}
├── {b}dev/{/}
├── {b}etc/{/}
├── {b}home/{/}
├── {b}media/{/}
├── {b}mnt/{/}
├── {b}opt/{/}
├── {b}proc/{/}
├── {b}root/{/}
├── {b}run/{/}
├── {b}srv/{/}
├── {b}sys/{/}
├── {b}tmp/{/}
├── {b}usr/{/}
├── {b}var/{/}
├── bin -> usr/bin
├── lib -> usr/lib
├── lib64 -> usr/lib
└── sbin -> usr/bin

15 directories, 4 files`}
      />

      <AlertBox type="info" title="Não tem o tree?">
        Instale com <code>sudo pacman -S tree</code>. É uma ferramenta minúscula mas indispensável
        para visualizar hierarquias.
      </AlertBox>

      <h2>3. Quais sistemas de arquivos estão montados?</h2>
      <p>
        Existem três comandos que respondem essa pergunta com formatações diferentes.
        Cada um é mais útil em uma situação:
      </p>

      <TerminalBlock
        command="df -hT"
        output={`Filesystem     Type      Size  Used Avail Use% Mounted on
dev            devtmpfs  7.7G     0  7.7G   0% /dev
run            tmpfs     7.7G  1.6M  7.7G   1% /run
/dev/nvme0n1p2 ext4      234G   89G  133G  41% /
tmpfs          tmpfs     7.7G   78M  7.7G   2% /dev/shm
tmpfs          tmpfs     7.7G   24M  7.7G   1% /tmp
/dev/nvme0n1p1 vfat      511M   42M  470M   9% /boot
tmpfs          tmpfs     1.6G   80K  1.6G   1% /run/user/1000`}
      />

      <OutputBlock
        title="anatomia da saída do df -hT"
        output={`Filesystem     Type      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2 ext4      234G   89G  133G  41% /
tmpfs          tmpfs     7.7G   78M  7.7G   2% /dev/shm`}
        annotations={[
          { line: 0, note: "linha de cabeçalho" },
          { line: 1, note: "raiz / em ext4 com 41% de uso" },
          { line: 2, note: "tmpfs = na RAM, não toca o disco" },
        ]}
      />

      <p>
        Para uma versão tabular bem alinhada, combine <code>mount</code> com <code>column -t</code>:
      </p>

      <TerminalBlock
        command="mount | column -t | head -10"
        output={`proc            on  /proc                       type  proc        (rw,nosuid,nodev,noexec,relatime)
sys             on  /sys                        type  sysfs       (rw,nosuid,nodev,noexec,relatime)
dev             on  /dev                        type  devtmpfs    (rw,nosuid,relatime,size=8053668k,nr_inodes=2013417,mode=755)
run             on  /run                        type  tmpfs       (rw,nosuid,nodev,relatime,size=1610736k,mode=755)
/dev/nvme0n1p2  on  /                           type  ext4        (rw,relatime,discard)
securityfs      on  /sys/kernel/security        type  securityfs  (rw,nosuid,nodev,noexec,relatime)
tmpfs           on  /dev/shm                    type  tmpfs       (rw,nosuid,nodev)
devpts          on  /dev/pts                    type  devpts      (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
cgroup2         on  /sys/kernel/cgroup          type  cgroup2     (rw,nosuid,nodev,noexec,relatime,nosecuretype)
/dev/nvme0n1p1  on  /boot                       type  vfat        (rw,relatime,fmask=0022,dmask=0022)`}
      />

      <p>
        <code>findmnt</code> traz a mesma informação em forma de árvore — muito mais fácil de ler:
      </p>

      <TerminalBlock
        command="findmnt --real"
        output={`TARGET   SOURCE         FSTYPE OPTIONS
/        /dev/nvme0n1p2 ext4   rw,relatime,discard
└─/boot  /dev/nvme0n1p1 vfat   rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii`}
        comment="--real esconde os pseudo-FS (proc, sys, tmpfs)"
      />

      <h2>4. <code>/etc</code> em detalhes</h2>
      <p>
        O <code>/etc</code> guarda toda a configuração do sistema. Vamos olhar o primeiro nível
        com <code>tree -L 1</code>:
      </p>

      <TerminalBlock
        command="tree -L 1 /etc | head -30"
        output={`{b}/etc{/}
├── {b}X11/{/}
├── {b}cups/{/}
├── {b}default/{/}
├── {b}grub.d/{/}
├── {b}makepkg.conf.d/{/}
├── {b}pacman.d/{/}
├── {b}pam.d/{/}
├── {b}skel/{/}
├── {b}ssh/{/}
├── {b}sudoers.d/{/}
├── {b}systemd/{/}
├── {b}xdg/{/}
├── fstab
├── group
├── group-
├── gshadow
├── hostname
├── hosts
├── locale.conf
├── locale.gen
├── localtime -> /usr/share/zoneinfo/America/Sao_Paulo
├── makepkg.conf
├── mkinitcpio.conf
├── nsswitch.conf
├── pacman.conf
├── passwd
├── resolv.conf
├── shadow
├── ssh
└── sudoers`}
      />

      <p>
        Inspecionando arquivos clássicos:
      </p>

      <TerminalBlock
        command="cat /etc/hostname"
        output={`archlinux`}
      />

      <TerminalBlock
        command="cat /etc/hosts"
        output={`# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1   localhost
::1         localhost
127.0.1.1   archlinux.localdomain  archlinux`}
      />

      <TerminalBlock
        command="cat /etc/fstab"
        output={`# /etc/fstab: static file system information
#
# <file system>                            <dir>   <type>  <options>          <dump>  <pass>
UUID=4f3c1a2b-9b71-4c2e-8e5b-7d9f0a1b2c3d  /       ext4    rw,relatime,discard 0       1
UUID=A12B-34CD                             /boot   vfat    rw,relatime         0       2
tmpfs                                      /tmp    tmpfs   defaults,size=4G    0       0`}
      />

      <AlertBox type="warning" title="Sempre faça backup antes de editar">
        Antes de editar qualquer arquivo de <code>/etc</code>:{" "}
        <code>sudo cp /etc/pacman.conf{`{,.bak}`}</code>. Se algo quebrar você restaura com
        <code> sudo mv /etc/pacman.conf.bak /etc/pacman.conf</code>.
      </AlertBox>

      <h2>5. <code>/dev</code> — dispositivos como arquivos</h2>

      <TerminalBlock
        command="ls -l /dev | head -20"
        output={`total 0
crw-r--r-- 1 root root      10, 235 Jan 15 10:00 autofs
drwxr-xr-x 2 root root          480 Jan 15 10:00 block
drwxr-xr-x 2 root root           80 Jan 15 10:00 bsg
crw-rw---- 1 root disk      10, 234 Jan 15 10:00 btrfs-control
drwxr-xr-x 3 root root           60 Jan 15 10:00 bus
lrwxrwxrwx 1 root root            3 Jan 15 10:00 cdrom -> sr0
drwxr-xr-x 2 root root         3700 Jan 15 10:00 char
crw------- 1 root root       5,   1 Jan 15 10:00 console
lrwxrwxrwx 1 root root           11 Jan 15 10:00 core -> /proc/kcore
drwxr-xr-x 4 root root           80 Jan 15 10:00 cpu
crw------- 1 root root       10, 60 Jan 15 10:00 cpu_dma_latency
crw-rw---- 1 root video     29,   0 Jan 15 10:00 fb0
lrwxrwxrwx 1 root root           13 Jan 15 10:00 fd -> /proc/self/fd
crw-rw-rw- 1 root root       1,   7 Jan 15 10:00 full
crw-rw-rw- 1 root root       1,   3 Jan 15 10:00 null
brw-rw---- 1 root disk      259,  0 Jan 15 10:00 nvme0n1
brw-rw---- 1 root disk      259,  1 Jan 15 10:00 nvme0n1p1
brw-rw---- 1 root disk      259,  2 Jan 15 10:00 nvme0n1p2
crw-rw-rw- 1 root root       1,   8 Jan 15 10:00 random`}
      />

      <OutputBlock
        title="lendo a primeira coluna de ls -l /dev"
        output={`crw-rw-rw- 1 root root  1,  3 Jan 15 10:00 null
brw-rw---- 1 root disk 259,  2 Jan 15 10:00 nvme0n1p2
lrwxrwxrwx 1 root root      3 Jan 15 10:00 cdrom -> sr0`}
        annotations={[
          { line: 0, note: "c = character device (byte a byte)" },
          { line: 1, note: "b = block device (em blocos, p/ discos)" },
          { line: 2, note: "l = link simbólico" },
        ]}
      />

      <p>Dispositivos especiais que todo Linux tem:</p>

      <TerminalBlock
        command={`echo "vai pro vazio" > /dev/null
echo $?`}
        output={`0`}
        comment="/dev/null descarta tudo silenciosamente — exit code 0 (sucesso)"
      />

      <TerminalBlock
        command="dd if=/dev/zero of=arquivo.bin bs=1M count=10"
        output={`10+0 records in
10+0 records out
10485760 bytes (10 MB, 10 MiB) copied, 0.00684527 s, 1.5 GB/s`}
        comment="cria um arquivo de 10MB cheio de zeros"
      />

      <TerminalBlock
        command="head -c 16 /dev/urandom | xxd"
        output={`00000000: a3f1 2b9c 5e7d 0142 8a3b c0d2 4e91 f6a7  ..+.^}.B.;..N...`}
        comment="/dev/urandom gera bytes aleatórios infinitamente"
      />

      <h2>6. <code>/proc</code> — janela viva para o kernel</h2>
      <p>
        O <code>/proc</code> não existe no disco. Ele é montado pelo kernel e exposto como arquivos
        que você pode <code>cat</code>:
      </p>

      <TerminalBlock
        command="cat /proc/cpuinfo | head -12"
        output={`processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 158
model name	: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
stepping	: 10
microcode	: 0xf4
cpu MHz		: 2592.000
cache size	: 12288 KB
physical id	: 0
siblings	: 12
core id		: 0`}
      />

      <TerminalBlock
        command="cat /proc/meminfo | head -8"
        output={`MemTotal:       16320456 kB
MemFree:         8923144 kB
MemAvailable:   12184568 kB
Buffers:          241232 kB
Cached:          3120548 kB
SwapCached:            0 kB
Active:          4521376 kB
Inactive:        2018324 kB`}
      />

      <TerminalBlock
        command="cat /proc/uptime"
        output={`14823.42 113402.18`}
        comment="primeiro nº = segundos desde o boot; segundo = total em idle (somando todas as CPUs)"
      />

      <TerminalBlock
        command="cat /proc/loadavg"
        output={`0.42 0.38 0.31 2/847 12453`}
        comment="cargas 1/5/15min, processos rodando/total, último PID criado"
      />

      <TerminalBlock
        command="cat /proc/1/comm"
        output={`systemd`}
        comment="PID 1 no Arch é sempre systemd"
      />

      <h2>7. <code>/sys</code> — controlando o hardware</h2>
      <p>
        Diferente de <code>/proc</code>, o <code>/sys</code> é organizado por subsistema:
      </p>

      <TerminalBlock
        command="ls /sys"
        output={`block  bus  class  dev  devices  firmware  fs  hypervisor  kernel  module  power`}
      />

      <TerminalBlock
        command="ls /sys/class/net"
        output={`enp3s0  lo  wlan0`}
        comment="cada interface de rede aparece como diretório"
      />

      <TerminalBlock
        command="cat /sys/class/power_supply/BAT0/capacity"
        output={`87`}
        comment="bateria em 87% (em notebooks)"
      />

      <TerminalBlock
        command="ls /sys/firmware/efi 2>/dev/null && echo SISTEMA_UEFI || echo SISTEMA_BIOS"
        output={`config_table  efivars  esrt  fw_platform_size  fw_vendor  runtime  runtime-map  systab
SISTEMA_UEFI`}
      />

      <h2>8. <code>/var</code> — onde tudo cresce</h2>

      <TerminalBlock
        command="du -sh /var/* 2>/dev/null | sort -h"
        output={`0       /var/empty
0       /var/games
0       /var/local
0       /var/mail
0       /var/spool
4.0K    /var/db
4.0K    /var/opt
12K     /var/tmp
56K     /var/run
8.4M    /var/log
142M    /var/lib
2.1G    /var/cache`}
        comment="sort -h = ordena por tamanho legível (1K, 1M, 1G)"
      />

      <p>
        O grande vilão no Arch é normalmente <code>/var/cache/pacman/pkg</code>:
      </p>

      <TerminalBlock
        command="du -sh /var/cache/pacman/pkg"
        output={`1.9G    /var/cache/pacman/pkg`}
      />

      <TerminalBlock
        command="ls /var/cache/pacman/pkg | wc -l"
        output={`1842`}
        comment="1842 pacotes guardados em cache"
      />

      <TerminalBlock
        command="sudo paccache -rk2 -v"
        output={`==> finished: 1124 packages removed (disk space saved: 1.4 GiB)`}
        comment="paccache (do pkg pacman-contrib) mantém só as 2 últimas versões de cada pacote"
      />

      <p>Logs também moram aqui:</p>

      <TerminalBlock
        command="ls /var/log | head -10"
        output={`Xorg.0.log
Xorg.0.log.old
audit
cups
faillog
gdm
journal
lastlog
old
pacman.log`}
      />

      <TerminalBlock
        command="tail -3 /var/log/pacman.log"
        output={`[2025-01-14T18:23:11-0300] [PACMAN] Running 'pacman -Syu'
[2025-01-14T18:24:02-0300] [ALPM] upgraded linux (6.11.4.arch1-1 -> 6.12.1.arch1-1)
[2025-01-14T18:24:02-0300] [ALPM] upgraded firefox (132.0.2-1 -> 133.0-1)`}
      />

      <h2>9. <code>/usr</code> — quase tudo mora aqui</h2>

      <TerminalBlock
        command="ls /usr"
        output={`bin  include  lib  lib32  local  share  src`}
      />

      <TerminalBlock
        command="ls /usr/bin | wc -l"
        output={`3174`}
        comment="todo binário instalado pelo pacman vai para /usr/bin"
      />

      <TerminalBlock
        command="du -sh /usr/* 2>/dev/null"
        output={`412M    /usr/bin
89M     /usr/include
6.8G    /usr/lib
1.2G    /usr/lib32
4.0K    /usr/local
2.1G    /usr/share
0       /usr/src`}
      />

      <h2>10. <code>/tmp</code>, <code>/run</code> — voláteis</h2>

      <TerminalBlock
        command="findmnt /tmp /run /dev/shm"
        output={`TARGET   SOURCE FSTYPE OPTIONS
/tmp     tmpfs  tmpfs  rw,nosuid,nodev,size=4194304k
/run     run    tmpfs  rw,nosuid,nodev,relatime,size=1610736k,mode=755
/dev/shm tmpfs  tmpfs  rw,nosuid,nodev`}
        comment="todos são tmpfs — somem na próxima reinicialização"
      />

      <AlertBox type="warning" title="/tmp é descartável">
        Tudo em <code>/tmp</code> evapora a cada boot. Nunca deixe nada importante lá. Se você
        precisa de algo persistente entre boots mas temporário, use <code>/var/tmp</code>.
      </AlertBox>

      <h2>11. Quanto cabe em cada partição? <code>df</code> + <code>du</code></h2>

      <TerminalBlock
        command="df -h /"
        output={`Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2  234G   89G  133G  41% /`}
      />

      <TerminalBlock
        command="sudo du -sh /home/* 2>/dev/null"
        output={`8.4G    /home/joao
2.1G    /home/maria`}
        comment="quem está consumindo o /home"
      />

      <TerminalBlock
        command="sudo du -h --max-depth=1 /var | sort -h | tail -5"
        output={`56K     /var/run
8.4M    /var/log
142M    /var/lib
2.1G    /var/cache
2.3G    /var`}
        comment="ranking dos sub-diretórios mais pesados de /var"
      />

      <h2>12. Mapa mental rápido</h2>

      <OutputBlock
        title="resumo da FHS"
        output={`/
├── bin, sbin, lib, lib64 -> /usr/...     (compatibilidade)
├── boot/                                  kernel + bootloader
├── dev/                                   dispositivos (kernel)
├── etc/                                   configuração do sistema
├── home/                                  usuários
├── media/   /mnt/                         pontos de montagem (auto / manual)
├── opt/                                   software de terceiros
├── proc/    /sys/                         info viva do kernel (virtuais)
├── root/                                  home do root
├── run/     /tmp/    /dev/shm             tmpfs (RAM, voláteis)
├── srv/                                   dados servidos (HTTP, FTP, ...)
├── usr/                                   programas, libs, docs
└── var/                                   dados que mudam (logs, cache)`}
      />

      <AlertBox type="success" title="Regra prática">
        Editar config? <code>/etc</code>. Logs? <code>/var/log</code>. Programa? <code>/usr/bin</code>.
        Seus arquivos? <code>/home</code>. Algo do kernel? <code>/proc</code> ou <code>/sys</code>.
      </AlertBox>

      <h2>Referências</h2>
      <ul>
        <li><a href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener noreferrer">FHS 3.0 — Linux Foundation</a></li>
        <li><a href="https://wiki.archlinux.org/title/File_systems" target="_blank" rel="noopener noreferrer">ArchWiki — File systems</a></li>
        <li><code>man hier</code> — manual oficial da hierarquia</li>
      </ul>
    </PageContainer>
  );
}
