import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Avancado() {
  return (
    <PageContainer
      title="Comandos Avançados"
      subtitle="find, xargs, awk, sed, agendamento e padrões reais de scripting. A filosofia UNIX em ação: pequenos programas combinados em pipelines poderosos."
      difficulty="avancado"
      timeToRead="35 min"
      category="Shell Avançado"
    >
      <h2>find — busca em tempo real no sistema de arquivos</h2>

      <CommandFlagList
        command="find"
        items={[
          { flag: "-name PAT", description: "Casa pelo nome (suporta globs *, ?, [..]). Sensível a maiúsculas.", example: "find . -name '*.log'" },
          { flag: "-iname PAT", description: "Como -name, mas case-insensitive.", example: "find . -iname '*.JPG'" },
          { flag: "-type T", description: "f=arquivo regular, d=diretório, l=link, s=socket, b=bloco, c=char.", example: "find /etc -type d" },
          { flag: "-size N", description: "Tamanho. +1G = maior que 1G, -100k = menor que 100K, =1M.", example: "find / -size +1G" },
          { flag: "-mtime N", description: "Modificado N*24h. -7 = últimos 7 dias, +30 = mais antigo que 30 dias." },
          { flag: "-mmin N", description: "Modificado N minutos atrás (mais granular)." },
          { flag: "-user U", description: "Pertence ao usuário U.", example: "find /tmp -user joao" },
          { flag: "-perm MODE", description: "Permissão exata (0644), com -mode (todos esses bits), /mode (qualquer).", example: "find / -perm -4000" },
          { flag: "-empty", description: "Arquivos ou diretórios vazios." },
          { flag: "-maxdepth N", description: "Limita a profundidade da busca (rápido)." },
          { flag: "-exec cmd {} \\;", description: "Roda cmd para CADA arquivo (\\; encerra). Lento.", example: "find . -name '*.bak' -exec rm {} \\;" },
          { flag: "-exec cmd {} +", description: "Acumula vários args por execução (rápido, como xargs)." },
          { flag: "-print0", description: "Separa resultados com NUL — combina com xargs -0 para nomes com espaço." },
          { flag: "-prune", description: "Não desce no diretório (skip). Combine com -path." },
          { flag: "-not", description: "Nega o próximo teste." },
        ]}
      />

      <TerminalBlock
        command="find /etc -maxdepth 1 -type d | head -5"
        output={`/etc
/etc/X11
/etc/alsa
/etc/audit
/etc/avahi`}
      />

      <TerminalBlock
        comment="arquivos .conf modificados nos últimos 7 dias"
        command="find /etc -name '*.conf' -mtime -7"
        output={`/etc/pacman.conf
/etc/mkinitcpio.conf`}
      />

      <TerminalBlock
        comment="caçando arquivos enormes (lentidão de disco)"
        command="find / -xdev -type f -size +500M 2>/dev/null"
        output={`/var/cache/pacman/pkg/linux-6.12.1-1-x86_64.pkg.tar.zst
/home/user/iso/archlinux-2026.03.01-x86_64.iso
/home/user/.local/share/Steam/steamapps/common/...`}
      />

      <TerminalBlock
        comment="binários SUID — auditoria básica de segurança"
        command="find / -xdev -perm -4000 -type f 2>/dev/null | head -5"
        output={`/usr/bin/su
/usr/bin/sudo
/usr/bin/passwd
/usr/bin/mount
/usr/bin/newgrp`}
      />

      <TerminalBlock
        comment="arquivos vazios para limpar"
        command="find ~/Downloads -type f -empty"
        output={`/home/user/Downloads/.placeholder
/home/user/Downloads/notas.txt`}
      />

      <h3>-exec vs xargs</h3>

      <TerminalBlock
        comment="lento: 1 fork por arquivo"
        command={`find . -name '*.tmp' -exec rm -v {} \\;`}
        output={`removed './a.tmp'
removed './b.tmp'
removed './c.tmp'`}
      />

      <TerminalBlock
        comment="rápido: agrupa em um único rm"
        command={`find . -name '*.tmp' -exec rm -v {} +`}
        output={`removed './a.tmp' removed './b.tmp' removed './c.tmp'`}
      />

      <TerminalBlock
        comment="seguro com nomes contendo espaços"
        command={`find . -name '*.jpg' -print0 | xargs -0 -I {} cp {} /backup/`}
        output=""
      />

      <AlertBox type="warning" title="Cuidado com -delete">
        <code>find . -name '*.log' -delete</code> é atômico, mas combinado com
        argumentos errados pode varrer o sistema. <strong>Sempre rode primeiro sem
        -delete</strong> para conferir o que casaria.
      </AlertBox>

      <h2>xargs — transformando stdin em argumentos</h2>

      <CommandFlagList
        command="xargs"
        items={[
          { flag: "-n N", description: "Máx N argumentos por execução do comando." },
          { flag: "-I {}", description: "Substitui {} pelo argumento (uma execução por arg).", example: "ls *.png | xargs -I {} mv {} ./old/" },
          { flag: "-P N", description: "N processos em paralelo. -P 0 = quantos couberem.", example: "xargs -P 8 -n 1 curl < urls.txt" },
          { flag: "-0", description: "Argumentos separados por NUL (combina com find -print0)." },
          { flag: "-r", long: "--no-run-if-empty", description: "Se stdin vazio, NÃO executa nada (GNU)." },
          { flag: "-t", description: "Imprime cada comando antes de executá-lo (debug)." },
          { flag: "-a ARQ", description: "Lê argumentos de um arquivo em vez de stdin." },
        ]}
      />

      <TerminalBlock
        command={`echo "1 2 3 4 5" | xargs -n 2 echo PAR:`}
        output={`PAR: 1 2
PAR: 3 4
PAR: 5`}
      />

      <TerminalBlock
        comment="paralelismo: 4 conversões simultâneas"
        command={`ls *.wav | xargs -n 1 -P 4 -I {} ffmpeg -loglevel error -i {} {}.mp3 -y`}
        output={`(processa 4 arquivos por vez, sem saída se -loglevel error)`}
      />

      <TerminalBlock
        comment="-t mostra exatamente o que foi executado"
        command={`echo 'a b c' | xargs -t -n 1 echo`}
        output={`echo a
a
echo b
b
echo c
c`}
      />

      <h2>grep + regex</h2>

      <CommandFlagList
        command="grep"
        items={[
          { flag: "-E", description: "Regex estendida (POSIX ERE). Equivale a egrep.", example: "grep -E '[0-9]{3}-[0-9]{4}'" },
          { flag: "-P", description: "Regex Perl (PCRE) — lookahead, \\d, \\w.", example: "grep -P '(?<=user=)\\w+'" },
          { flag: "-w", description: "Casa palavra inteira (não substring)." },
          { flag: "-l", description: "Mostra só os nomes dos arquivos que casaram." },
          { flag: "-L", description: "Mostra os arquivos que NÃO casaram (inverso de -l)." },
          { flag: "--include / --exclude", description: "Filtra por padrão de nome ao usar -r.", example: "grep -r 'TODO' --include='*.py' ." },
          { flag: "--color=auto", description: "Destaca os matches (já é default na maioria das distros)." },
        ]}
      />

      <TerminalBlock
        command={`echo 'meu telefone: 11-9876-5432' | grep -oE '[0-9]{2}-[0-9]{4}-[0-9]{4}'`}
        output="11-9876-5432"
      />

      <TerminalBlock
        command={`grep -rn --include='*.ts' 'TODO' src/ | head -3`}
        output={`src/components/Header.ts:42:// TODO: dark mode toggle
src/lib/utils.ts:11:// TODO: handle BigInt
src/pages/Home.ts:88:// TODO: lazy load`}
      />

      <TerminalBlock
        comment="-P com lookbehind: extrai só o valor após user="
        command={`echo 'login user=joao session=42' | grep -oP '(?<=user=)\\w+'`}
        output="joao"
      />

      <h2>sed — edição em fluxo</h2>

      <CommandFlagList
        command="sed"
        items={[
          { flag: "-i[SUFIXO]", description: "Edita o arquivo no lugar. Com sufixo cria backup.bak.", example: "sed -i.bak 's/foo/bar/g' arq" },
          { flag: "-n", description: "Suprime saída automática (use com p para imprimir explicitamente)." },
          { flag: "-E", description: "Regex estendida (sem precisar escapar (), {}, +, ?)." },
          { flag: "-e SCRIPT", description: "Aplica múltiplos scripts em sequência.", example: "sed -e 's/a/A/' -e 's/b/B/'" },
          { flag: "-f FILE", description: "Lê o script de um arquivo." },
        ]}
      />

      <h3>Comandos do sed</h3>

      <OutputBlock
        title="comandos mais usados"
        output={`s/PAT/REPL/FLAGS    substituição (g=global, i=case-i, N=N-ésima)
d                   apaga a linha
p                   imprime (use com -n)
N                   anexa próxima linha ao espaço de padrões
y/abc/ABC/          transliteração (como tr)
a\\ TEXTO            adiciona TEXTO depois da linha
i\\ TEXTO            insere TEXTO antes da linha
c\\ TEXTO            substitui a linha por TEXTO
=                   imprime o número da linha`}
      />

      <TerminalBlock
        command={`echo 'foo foo foo' | sed 's/foo/X/'`}
        output="X foo foo"
      />

      <TerminalBlock
        command={`echo 'foo foo foo' | sed 's/foo/X/g'`}
        output="X X X"
      />

      <TerminalBlock
        comment="só a 2ª ocorrência"
        command={`echo 'foo foo foo' | sed 's/foo/X/2'`}
        output="foo X foo"
      />

      <TerminalBlock
        comment="apaga linhas em branco"
        command={`printf 'a\\n\\nb\\n\\nc\\n' | sed '/^$/d'`}
        output={`a
b
c`}
      />

      <TerminalBlock
        comment="extrai apenas linhas entre marcadores BEGIN..END"
        command={`printf 'BEGIN\\nx\\ny\\nEND\\nz\\n' | sed -n '/BEGIN/,/END/p'`}
        output={`BEGIN
x
y
END`}
      />

      <TerminalBlock
        comment="numera as linhas (-n + =)"
        command={`printf 'a\\nb\\nc\\n' | sed = | sed 'N;s/\\n/\\t/'`}
        output={`1\ta
2\tb
3\tc`}
      />

      <TerminalBlock
        comment="in-place com backup, em todos os .conf"
        command={`sudo sed -i.bak -E 's/^#?(MaxJobs)=.*/\\1=8/' /etc/systemd/system.conf`}
        output=""
      />

      <h2>awk — uma linguagem de processamento de colunas</h2>

      <p>
        O awk lê linha por linha, divide em campos (<code>$1</code>, <code>$2</code>, ...),
        e executa blocos para cada padrão. Tem variáveis numéricas, arrays
        associativos, funções e blocos especiais <code>BEGIN</code> / <code>END</code>.
      </p>

      <OutputBlock
        title="anatomia de um programa awk"
        output={`awk 'BEGIN{...}  /padrao/{ acao }  END{...}' arquivo
       ↑                ↑                ↑
       roda 1x          roda por linha   roda 1x
       antes            que casar        no fim`}
      />

      <h3>Variáveis embutidas</h3>

      <OutputBlock
        title="variáveis automáticas"
        output={`$0    linha inteira
$1..  campos individuais (separados por FS)
NF    número de campos da linha atual
NR    número da linha atual (Number of Records)
FS    field separator de entrada (default: espaço/tab)
OFS   field separator de SAÍDA (default: " ")
RS    record separator (default: \\n)
FILENAME  nome do arquivo sendo processado`}
      />

      <TerminalBlock
        command="cat /etc/passwd | head -3"
        output={`root:x:0:0::/root:/usr/bin/bash
bin:x:1:1::/:/usr/bin/nologin
daemon:x:2:2::/:/usr/bin/nologin`}
      />

      <TerminalBlock
        comment="usuário e shell, separador :"
        command={`awk -F: '{print $1, "->", $7}' /etc/passwd | head -3`}
        output={`root -> /usr/bin/bash
bin -> /usr/bin/nologin
daemon -> /usr/bin/nologin`}
      />

      <TerminalBlock
        comment="só usuários com bash como shell"
        command={`awk -F: '$7 ~ /bash$/ {print $1}' /etc/passwd`}
        output={`root
user`}
      />

      <TerminalBlock
        comment="acumulador: soma de tamanhos por extensão"
        command={`ls -l | awk 'NR>1 {ext=$NF; sub(/.*\\./,"",ext); soma[ext]+=$5}
                     END {for (e in soma) printf "%-6s %d\\n", e, soma[e]}'`}
        output={`txt    18420
log    1842934
md     6712
sh     1024`}
      />

      <TerminalBlock
        comment="ps aux: top 5 processos por uso de RAM (%MEM)"
        command={`ps aux | awk 'NR>1 {print $4, $11}' | sort -rn | head -5`}
        output={`12.4 /usr/lib/firefox/firefox
8.7 /usr/bin/gnome-shell
4.2 /usr/bin/Xwayland
3.1 /usr/lib/firefox/firefox
2.8 /usr/bin/code`}
      />

      <TerminalBlock
        comment="contador com BEGIN/END"
        command={`awk 'BEGIN{print "início"} /sshd/{c++} END{print "ssh:", c}' /var/log/auth.log`}
        output={`início
ssh: 187`}
      />

      <CodeBlock
        title="programa awk multilinha — relatório de logs HTTP"
        code={`#!/usr/bin/awk -f
BEGIN {
    FS = " "
    print "IP                 Hits   Bytes"
    print "-----------------  ----   --------"
}
{
    hits[$1]++
    bytes[$1] += $10
}
END {
    for (ip in hits)
        printf "%-17s  %4d   %8d\\n", ip, hits[ip], bytes[ip]
}`}
      />

      <TerminalBlock
        command="awk -f relatorio.awk access.log | sort -k2 -rn | head -3"
        output={`192.168.1.42       1832   18472913
10.0.0.7            942    8472113
192.168.1.10        318    1937284`}
      />

      <h2>Pipelines de verdade</h2>

      <TerminalBlock
        comment="top 5 IPs gerando 404 num log de acesso"
        command={`grep ' 404 ' access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5`}
        output={`    412 192.168.1.42
    187 10.0.0.99
     93 203.0.113.5
     58 198.51.100.10
     12 192.168.1.7`}
      />

      <TerminalBlock
        comment="conexões em ESTABLISHED por porta"
        command={`ss -tan | awk 'NR>1 && $1=="ESTAB" {split($4,a,":"); print a[length(a)]}' | sort | uniq -c`}
        output={`     12 22
      4 443
      2 5432
      1 6379`}
      />

      <h2>Agendamento — cron e systemd timers</h2>

      <h3>cron</h3>

      <TerminalBlock
        command="sudo pacman -S --needed cronie"
        output={`Packages (1)  cronie-1.7.4-1
Total Installed Size:  0.50 MiB`}
      />

      <TerminalBlock
        command={`sudo systemctl enable --now cronie.service`}
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/cronie.service → /usr/lib/systemd/system/cronie.service.`}
      />

      <OutputBlock
        title="formato do crontab"
        output={`# m  h  dom mon dow  comando
# │  │   │   │   │
# │  │   │   │   └── dia da semana (0-7, 0 e 7 = domingo)
# │  │   │   └────── mês (1-12)
# │  │   └────────── dia do mês (1-31)
# │  └────────────── hora (0-23)
# └───────────────── minuto (0-59)`}
      />

      <TerminalBlock
        command="crontab -l"
        output={`0 3 * * *    /home/user/scripts/backup.sh >> /var/log/backup.log 2>&1
*/5 * * * *  /home/user/scripts/check-vpn.sh
0 4 * * 0    paccache -r
@reboot      /home/user/scripts/start-tunnel.sh`}
      />

      <TerminalBlock
        comment="ver os jobs de root"
        command="sudo crontab -l -u root"
        output={`# Edit this file to introduce tasks to be run by cron.
# m h  dom mon dow   command
30 2 * * 1  apt-mirror &> /dev/null
0 5 * * *   /usr/bin/logrotate /etc/logrotate.conf`}
      />

      <h3>systemd timers — alternativa moderna</h3>

      <CodeBlock
        title="/etc/systemd/system/backup.service"
        code={`[Unit]
Description=Backup do home

[Service]
Type=oneshot
ExecStart=/home/user/scripts/backup.sh`}
      />

      <CodeBlock
        title="/etc/systemd/system/backup.timer"
        code={`[Unit]
Description=Backup diário 03:00

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true
RandomizedDelaySec=15min

[Install]
WantedBy=timers.target`}
      />

      <TerminalBlock
        command="sudo systemctl daemon-reload && sudo systemctl enable --now backup.timer"
        output={`Created symlink /etc/systemd/system/timers.target.wants/backup.timer → /etc/systemd/system/backup.timer.`}
      />

      <TerminalBlock
        command="systemctl list-timers --all"
        output={`NEXT                          LEFT       LAST                          PASSED       UNIT             ACTIVATES
Wed 2026-03-26 03:00:00 -03   8h left    Tue 2026-03-25 03:00:14 -03   15h ago      backup.timer     backup.service
Wed 2026-03-26 19:01:00 -03   28min      Wed 2026-03-26 18:01:14 -03   31min ago    logrotate.timer  logrotate.service
Thu 2026-03-27 00:00:00 -03   5h left    Wed 2026-03-26 00:00:00 -03   18h ago      man-db.timer     man-db.service

3 timers listed.`}
      />

      <TerminalBlock
        command="systemctl status backup.timer"
        output={`● backup.timer - Backup diário 03:00
     Loaded: loaded (/etc/systemd/system/backup.timer; enabled; preset: disabled)
     Active: {g}active (waiting){/} since Tue 2026-03-25 18:42:11 -03; 23h ago
    Trigger: Wed 2026-03-26 03:00:00 -03; 8h left
   Triggers: ● backup.service`}
      />

      <h3>at — agendamento único</h3>

      <TerminalBlock
        command="sudo pacman -S --needed at && sudo systemctl enable --now atd"
        output={`Packages (1)  at-3.2.5-3
Total Installed Size:  0.21 MiB`}
      />

      <TerminalBlock
        command={`echo "shutdown -h now" | at 23:30`}
        output={`warning: commands will be executed using /bin/sh
job 4 at Wed Mar 26 23:30:00 2026`}
      />

      <TerminalBlock
        command="atq"
        output="4       Wed Mar 26 23:30:00 2026 a user"
      />

      <TerminalBlock
        comment="cancelar"
        command="atrm 4"
        output=""
      />

      <h2>Padrões de scripting de produção</h2>

      <CodeBlock
        title="boilerplate seguro — strict mode + trap"
        code={`#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'

# -e  : sai ao primeiro erro
# -u  : variável não definida = erro
# -o pipefail : pipe falha se QUALQUER etapa falhar
# IFS : evita word-splitting bobo

readonly SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
readonly LOG="/var/log/$(basename "$0").log"

log()  { printf '[%s] %s\\n' "$(date +%FT%T)" "$*" | tee -a "$LOG" >&2; }
fail() { log "FAIL: $*"; exit 1; }

cleanup() {
    local rc=$?
    log "encerrando (rc=$rc)"
    rm -rf "\${TMP:-}"
}
trap cleanup EXIT INT TERM

TMP=$(mktemp -d)
log "iniciando"

main() {
    [[ $# -ge 1 ]] || fail "uso: $0 <alvo>"
    local alvo="$1"
    log "processando $alvo"
    # ... lógica aqui ...
}

main "$@"`}
      />

      <CodeBlock
        title="processando opções com getopts"
        code={`#!/usr/bin/env bash
set -euo pipefail

verbose=0
out=""

while getopts ":vo:h" opt; do
    case $opt in
        v) verbose=1 ;;
        o) out=$OPTARG ;;
        h) echo "uso: $0 [-v] [-o ARQ] arquivos..."; exit 0 ;;
        \\?) echo "opção inválida: -$OPTARG" >&2; exit 2 ;;
        :)  echo "-$OPTARG requer argumento" >&2; exit 2 ;;
    esac
done
shift $((OPTIND - 1))

(( verbose )) && echo "verbose: on; saída: \${out:-stdout}; argumentos: $#"`}
      />

      <TerminalBlock
        command="./script.sh -v -o /tmp/out.txt a.txt b.txt"
        output="verbose: on; saída: /tmp/out.txt; argumentos: 2"
      />

      <CodeBlock
        title="paralelismo controlado com xargs"
        code={`#!/usr/bin/env bash
set -euo pipefail

# baixar 1000 URLs com no máximo 16 conexões simultâneas
xargs -a urls.txt -n 1 -P 16 -I {} \\
    curl -sSfL --retry 3 -o "downloads/$(basename {})" {}`}
      />

      <h2>Debug e introspecção</h2>

      <TerminalBlock
        comment="executar mostrando cada comando antes de rodar"
        command="bash -x meu_script.sh"
        output={`+ readonly LOG=/tmp/x.log
+ TMP=/tmp/tmp.AbC123
+ mkdir -p /tmp/dest
+ cp arquivo.txt /tmp/dest/
+ echo done
done`}
      />

      <TerminalBlock
        comment="só a sintaxe (sem executar)"
        command="bash -n script.sh"
        output=""
      />

      <TerminalBlock
        command="shellcheck script.sh"
        output={`In script.sh line 12:
if [ $var = "x" ]; then
   ^----^ {y}SC2086{/}: Double quote to prevent globbing and word splitting.

Did you mean:
if [ "$var" = "x" ]; then`}
      />

      <AlertBox type="success" title="Receita do iniciado">
        <strong>Sempre que escrever bash sério:</strong> rode no <code>shellcheck</code>{" "}
        (instale com <code>sudo pacman -S shellcheck</code>) e use{" "}
        <code>set -euo pipefail</code> no topo. Isso elimina ~80% dos bugs típicos.
      </AlertBox>

      <h2>Cola visual</h2>

      <OutputBlock
        title="quando usar o quê"
        output={`tarefa                        ferramenta
----------------------------  -------------------
buscar arquivos               find
buscar texto                  grep
extrair colunas               cut, awk
ordenar / contar únicos       sort | uniq -c
substituir texto              sed -i
processar linha-a-linha       awk
paralelizar                   xargs -P
agendar uma vez               at
agendar recorrente            systemd timer (preferido), cron`}
      />

      <h2>Utilitários essenciais (watch, tee, time, bc, date)</h2>

      <p>
        Cinco ferramentas pequenas que aparecem o tempo todo no dia-a-dia: monitorar saída em
        tempo real, espelhar stdout em arquivo, medir tempo/recursos, fazer matemática no shell
        e formatar datas. Todas vêm por padrão no Arch (exceto <code>/usr/bin/time</code> que está
        no pacote <code>time</code>).
      </p>

      <h3>watch — repete um comando e mostra a saída atualizando</h3>

      <CommandFlagList
        command="watch"
        items={[
          { flag: "-n N", long: "--interval=N", description: "Intervalo em segundos entre execuções (default 2). Aceita fração: -n 0.5.", example: "watch -n 1 'free -h'" },
          { flag: "-d", long: "--differences[=permanent]", description: "Destaca os caracteres que mudaram desde a execução anterior. =permanent mantém o destaque.", example: "watch -d -n 2 'ls -la /var/log'" },
          { flag: "-t", long: "--no-title", description: "Suprime o cabeçalho de duas linhas (relógio + comando), libera espaço de tela." },
          { flag: "-g", long: "--chgexit", description: "Sai (exit code 0) assim que a saída do comando mudar — ótimo para esperar evento.", example: "watch -g 'pgrep -c nginx'" },
          { flag: "-c", long: "--color", description: "Interpreta sequências ANSI de cor da saída (sem isso, watch achata as cores)." },
          { flag: "-e", long: "--errexit", description: "Sai se o comando terminar com exit code != 0." },
          { flag: "-b", long: "--beep", description: "Toca o BEL do terminal quando o exit code for != 0." },
          { flag: "-x", long: "--exec", description: "Passa o comando direto a execvp em vez de 'sh -c' (evita problemas com quoting)." },
        ]}
      />

      <TerminalBlock
        comment="acompanha uso de RAM atualizando a cada 1 segundo"
        command="watch -n 1 'free -h'"
        output={`Every 1.0s: free -h                                archlinux: Wed Mar 26 19:42:08 2026

               total        used        free      shared  buff/cache   available
Mem:            15Gi       6.2Gi       2.8Gi       412Mi       6.4Gi       8.6Gi
Swap:          8.0Gi          0B       8.0Gi`}
      />

      <TerminalBlock
        comment="-d destaca o que mudou (tamanho/data dos arquivos crescendo)"
        command="watch -d -n 2 'ls -la /var/log | tail -5'"
        output={`Every 2.0s: ls -la /var/log | tail -5             archlinux: Wed Mar 26 19:42:30 2026

-rw-r----- 1 root systemd-journal  4194304 Mar 26 19:42 journal/system.journal
-rw-r--r-- 1 root root              {y}  98214{/} Mar 26 19:42 pacman.log
-rw-r--r-- 1 root root               24102 Mar 26 19:30 Xorg.0.log
-rw------- 1 root root              {y} 187234{/} Mar 26 19:42 auth.log
drwxr-xr-x 2 root root                4096 Mar 26 18:10 old/`}
      />

      <TerminalBlock
        comment="acompanha o status de um serviço sem precisar repetir systemctl"
        command="watch -n 5 'systemctl status nginx --no-pager'"
        output={`Every 5.0s: systemctl status nginx --no-pager     archlinux: Wed Mar 26 19:43:00 2026

● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-26 18:01:10 -03; 1h 41min ago
   Main PID: 1842 (nginx)
      Tasks: 5 (limit: 18843)
     Memory: 12.4M
        CPU: 842ms`}
      />

      <TerminalBlock
        comment="-g sai assim que o comando muda — espera por um job concluir"
        command="watch -g -n 1 'systemctl is-active backup.service'"
        output={`(roda em loop mostrando 'active' ou 'activating' até virar 'inactive', e então sai)`}
      />

      <AlertBox type="info" title="Como sair do watch?">
        <kbd>Ctrl+C</kbd> encerra. O cabeçalho mostra <em>Every Ns</em>, o nome do host e o
        horário da última execução à direita — útil para confirmar que o terminal não congelou.
      </AlertBox>

      <h3>tee — espelha stdin para arquivo(s) E stdout</h3>

      <p>
        O nome vem do <strong>T</strong> de encanamento: divide um fluxo em dois. Resolve o
        problema clássico "quero ver a saída <em>e</em> salvá-la em arquivo ao mesmo tempo".
      </p>

      <CommandFlagList
        command="tee"
        items={[
          { flag: "(sem flag)", description: "Sobrescreve o(s) arquivo(s) destino e duplica a saída para stdout.", example: "echo oi | tee log.txt" },
          { flag: "-a", long: "--append", description: "Adiciona ao final em vez de truncar — equivalente ao >> do shell.", example: "echo linha | tee -a app.log" },
          { flag: "-i", long: "--ignore-interrupts", description: "Ignora SIGINT (Ctrl+C). Útil quando o pipe à esquerda pode receber sinal mas você quer terminar de gravar." },
          { flag: "-p", description: "Diagnostica erros de escrita em pipes (uso raro)." },
          { flag: "--output-error=warn|exit", description: "Controla o que fazer se uma escrita falhar (ex: disco cheio em um dos destinos)." },
        ]}
      />

      <TerminalBlock
        command={`echo "primeira linha" | tee arquivo.log`}
        output="primeira linha"
      />

      <TerminalBlock
        command="cat arquivo.log"
        output="primeira linha"
      />

      <TerminalBlock
        comment="-a anexa em vez de sobrescrever"
        command={`echo "segunda linha" | tee -a arquivo.log`}
        output="segunda linha"
      />

      <TerminalBlock
        command="cat arquivo.log"
        output={`primeira linha
segunda linha`}
      />

      <TerminalBlock
        comment="vários destinos de uma vez (cada arquivo recebe a saída completa)"
        command={`uname -a | tee /tmp/host1.txt /tmp/host2.txt`}
        output="Linux archlinux 6.12.1-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
      />

      <TerminalBlock
        comment="o caso clássico: escrever em arquivo de root sem rodar o editor todo como sudo"
        command={`echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swap.conf > /dev/null`}
        output=""
      />

      <TerminalBlock
        comment="process substitution: divide a saída em dois greps simultâneos"
        command={`journalctl -b | tee >(grep -i error > /tmp/errors.log) >(grep -i warn > /tmp/warns.log) > /dev/null`}
        output=""
      />

      <TerminalBlock
        command="wc -l /tmp/errors.log /tmp/warns.log"
        output={`   42 /tmp/errors.log
  187 /tmp/warns.log
  229 total`}
      />

      <h3>time — mede tempo (e memória) de execução</h3>

      <p>
        Existem <strong>dois</strong> <code>time</code> diferentes: o <em>builtin</em> do bash
        (sempre presente, formato simples) e o <em>binário</em> em <code>/usr/bin/time</code> (do
        pacote <code>time</code>, com saída detalhada incluindo memória de pico, page faults, IO).
      </p>

      <TerminalBlock
        comment="builtin do bash: real / user / sys"
        command="time ls -R /usr > /dev/null"
        output={`
real    0m1.842s
user    0m0.412s
sys     0m1.392s`}
      />

      <OutputBlock
        title="o que cada linha significa"
        annotations={[
          { line: 0, note: "tempo de relógio (wall-clock) total" },
          { line: 1, note: "CPU em modo usuário (código da aplicação)" },
          { line: 2, note: "CPU em modo kernel (syscalls, IO)" },
        ]}
        output={`real    0m1.842s
user    0m0.412s
sys     0m1.392s`}
      />

      <TerminalBlock
        comment="instala o /usr/bin/time (separado do builtin)"
        command="sudo pacman -S --needed time"
        output={`Packages (1) time-1.9-5
Total Installed Size:  0.06 MiB`}
      />

      <TerminalBlock
        comment="-v (verbose) — relatório completo de recursos do kernel"
        command={`/usr/bin/time -v ls -R /usr > /dev/null`}
        output={`        Command being timed: "ls -R /usr"
        User time (seconds): 0.41
        System time (seconds): 1.39
        Percent of CPU this job got: 97%
        Elapsed (wall clock) time (h:mm:ss or m:ss): 0:01.84
        Average shared text size (kbytes): 0
        Average unshared data size (kbytes): 0
        Average stack size (kbytes): 0
        Average total size (kbytes): 0
        Maximum resident set size (kbytes): {y}18432{/}
        Average resident set size (kbytes): 0
        Major (requiring I/O) page faults: 0
        Minor (reclaiming a frame) page faults: 4218
        Voluntary context switches: 12
        Involuntary context switches: 184
        Swaps: 0
        File system inputs: 0
        File system outputs: 0
        Socket messages sent: 0
        Socket messages received: 0
        Signals delivered: 0
        Page size (bytes): 4096
        Exit status: 0`}
      />

      <TerminalBlock
        comment="formato customizado: só wall-time + RSS de pico, ótimo para benchmark"
        command={`/usr/bin/time -f 'wall=%e  rss_max=%M KB' grep -r TODO /usr/include 2>/dev/null`}
        output={`wall=2.18  rss_max=14336 KB`}
      />

      <AlertBox type="warning" title="Builtin do bash NÃO mostra memória">
        Se você quiser <strong>Maximum resident set size</strong>, page faults ou qualquer
        métrica que não seja real/user/sys, precisa do <code>/usr/bin/time -v</code>.
        Note o caminho absoluto: rodar só <code>time -v</code> usa o builtin do bash, que
        ignora <code>-v</code> e quebra. Use <code>command time -v</code> ou{" "}
        <code>\time -v</code> (a barra desativa o alias/builtin).
      </AlertBox>

      <h3>bc — calculadora de precisão arbitrária</h3>

      <CommandFlagList
        command="bc"
        items={[
          { flag: "(sem flag)", description: "Modo interativo. Aritmética inteira por padrão (scale=0)." },
          { flag: "-l", long: "--mathlib", description: "Carrega biblioteca matemática (scale=20, define s/c/a/l/e e sqrt). Sem isso, não há ponto flutuante por padrão." },
          { flag: "-q", long: "--quiet", description: "Suprime o cabeçalho de versão ao iniciar interativo." },
          { flag: "-w", long: "--warn", description: "Avisa sobre construções não-POSIX." },
          { flag: "-s", long: "--standard", description: "Modo POSIX estrito." },
        ]}
      />

      <TerminalBlock
        command={`echo "2+2" | bc`}
        output="4"
      />

      <TerminalBlock
        comment="sem -l e sem scale, divisão é inteira"
        command={`echo "22/7" | bc`}
        output="3"
      />

      <TerminalBlock
        comment="scale=N define dígitos depois da vírgula"
        command={`echo "scale=4; 22/7" | bc`}
        output="3.1428"
      />

      <TerminalBlock
        comment="-l carrega mathlib: sqrt, sin, cos, log, e()"
        command={`echo "scale=10; sqrt(2)" | bc -l`}
        output="1.4142135623"
      />

      <TerminalBlock
        comment="potências e raízes — pi a 50 casas via 4*atan(1)"
        command={`echo "scale=50; 4*a(1)" | bc -l`}
        output="3.14159265358979323846264338327950288419716939937508"
      />

      <TerminalBlock
        comment="conversão de base: decimal → binário (obase=base de saída)"
        command={`echo "obase=2; 255" | bc`}
        output="11111111"
      />

      <TerminalBlock
        comment="binário → decimal (ibase=base de entrada)"
        command={`echo "ibase=2; 11111111" | bc`}
        output="255"
      />

      <TerminalBlock
        comment="modo interativo (Ctrl+D para sair)"
        command="bc -lq"
        output={`(2^64) - 1
18446744073709551615
sqrt(2) * sqrt(2)
1.99999999999999999998
quit`}
      />

      <h3>date — formatar, converter e calcular datas</h3>

      <TerminalBlock
        command="date"
        output="Wed Mar 26 19:42:08 -03 2026"
      />

      <TerminalBlock
        comment="-u força UTC"
        command="date -u"
        output="Wed Mar 26 22:42:08 UTC 2026"
      />

      <TerminalBlock
        comment="epoch (segundos desde 1970-01-01 UTC)"
        command="date +%s"
        output="1774572128"
      />

      <TerminalBlock
        comment="-d aceita datas humanas e calcula relativo"
        command={`date -d "2026-12-25 10:00" +%s`}
        output="1798686000"
      />

      <TerminalBlock
        comment="epoch → humano (prefixe @ no -d)"
        command={`date -d "@1735128000"`}
        output="Thu Dec 25 13:00:00 -03 2024"
      />

      <TerminalBlock
        comment="formato ISO 8601 com timezone — padrão de logs/APIs"
        command={`date +"%Y-%m-%dT%H:%M:%S%z"`}
        output="2026-03-26T19:42:08-0300"
      />

      <TerminalBlock
        comment="formato RFC 3339 (alternativa nativa)"
        command="date --rfc-3339=seconds"
        output="2026-03-26 19:42:08-03:00"
      />

      <TerminalBlock
        comment="aritmética de datas em linguagem natural"
        command={`date -d "next friday"`}
        output="Fri Mar 27 00:00:00 -03 2026"
      />

      <TerminalBlock
        command={`date -d "2 days ago"`}
        output="Mon Mar 24 19:42:08 -03 2026"
      />

      <TerminalBlock
        command={`date -d "1 month ago + 3 hours"`}
        output="Wed Feb 26 22:42:08 -03 2026"
      />

      <TerminalBlock
        comment="diferença em dias entre duas datas (via epoch)"
        command={`echo $(( ( $(date -d "2026-12-25" +%s) - $(date +%s) ) / 86400 )) dias até o Natal`}
        output="273 dias até o Natal"
      />

      <OutputBlock
        title="format specifiers de date(1)"
        output={`%Y   ano com 4 dígitos      (2026)
%y   ano com 2 dígitos      (26)
%m   mês [01-12]            (03)
%d   dia do mês [01-31]     (26)
%H   hora [00-23]           (19)
%M   minutos [00-59]        (42)
%S   segundos [00-60]       (08)
%s   epoch (UTC)            (1774572128)
%z   offset numérico de TZ  (-0300)
%Z   nome do TZ             (-03)
%a   dia da semana abrev.   (Wed)
%A   dia da semana          (Wednesday)
%b / %h  mês abreviado      (Mar)
%B   mês por extenso        (March)
%j   dia do ano [001-366]   (085)
%U   semana do ano (dom=0)  (12)
%V   semana ISO 8601        (13)
%N   nanossegundos          (842193100)
%n   newline   |   %t  tab`}
      />

      <TerminalBlock
        comment="util em scripts: timestamp seguro para nome de arquivo"
        command={`tar czf "backup-$(date +%Y%m%d-%H%M%S).tar.gz" ~/projetos`}
        output=""
      />

      <TerminalBlock
        command="ls backup-*.tar.gz"
        output="backup-20260326-194208.tar.gz"
      />
    </PageContainer>
  );
}
