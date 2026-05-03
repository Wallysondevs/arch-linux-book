import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Cron() {
  return (
    <PageContainer
      title="Agendamento — cronie, systemd timers e at"
      subtitle="No Arch o cron NÃO vem instalado. Aqui você instala cronie, escreve crontab, compara com systemd timers e usa o at para agendamento único."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Sistema"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Linux. <code>cronie</code> não vem por padrão — instale com <code>sudo pacman -S cronie</code> e habilite com <code>sudo systemctl enable --now cronie</code>. Alternativa moderna: systemd timers.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>cron</strong> — daemon que executa comandos em horários definidos.
      </p>
      <p>
        <strong>cronie</strong> — implementação cron padrão do Arch (porta do Vixie cron com extras).
      </p>
      <p>
        <strong>crontab</strong> — tabela de tarefas por usuário. Edite com <code>crontab -e</code>.
      </p>
      <p>
        <strong>systemd timer</strong> — alternativa moderna a cron, integrada ao journal.
      </p>

      <p>
        Diferente de Ubuntu/Debian, o Arch <strong>não traz nenhum cron pré-instalado</strong>. Se você
        quer agendamento recorrente, escolhe entre <code>cronie</code> (o cron clássico mais usado),{" "}
        <code>fcron</code>/<code>dcron</code> (alternativos) ou <strong>systemd timers</strong> —
        que já vêm de fábrica e quase sempre são a melhor escolha em sistemas modernos.
      </p>

      <AlertBox type="info" title="systemd timers vs cron — TL;DR">
        <strong>Timers</strong> têm: logs no journal, dependência entre units, controle de recursos
        (cgroup), randomização, recuperação após reboot (<code>Persistent=true</code>) e calendário
        muito mais expressivo. <strong>cron</strong> tem: sintaxe enxuta, portabilidade absoluta e
        cultura.  Para 90% dos casos novos: timers. Para snippets simples e portáveis: cron.
      </AlertBox>

      <h2>1. Instalando o cronie</h2>

      <TerminalBlock
        command="sudo pacman -S cronie"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) cronie-1.7.4-1

Total Installed Size:  0.50 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing cronie                            [######################] 100%
Optional dependencies for cronie
    smtp-forwarder: send job output via email
:: Running post-transaction hooks...
(1/1) Reloading system manager configuration...`}
      />

      <TerminalBlock
        comment="sem habilitar, nada roda — o daemon NÃO inicia sozinho"
        command="sudo systemctl enable --now cronie.service"
        output={`Created symlink '/etc/systemd/system/multi-user.target.wants/cronie.service' → '/usr/lib/systemd/system/cronie.service'.`}
      />

      <TerminalBlock
        command="systemctl status cronie"
        output={`{g}● cronie.service{/} - Periodic Command Scheduler
     Loaded: loaded (/usr/lib/systemd/system/cronie.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Fri 2026-03-26 09:00:18 -03; 5h ago
   Main PID: 612 (crond)
      Tasks: 1 (limit: 38389)
     Memory: 1.2M
        CPU: 84ms
     CGroup: /system.slice/cronie.service
             └─612 /usr/bin/crond -n

Mar 26 09:00:18 archlinux systemd[1]: Started Periodic Command Scheduler.
Mar 26 09:00:18 archlinux crond[612]: (CRON) STARTUP (1.7.4)
Mar 26 09:00:18 archlinux crond[612]: (CRON) INFO (Syslog will be used instead of sendmail.)
Mar 26 09:00:18 archlinux crond[612]: (CRON) INFO (RANDOM_DELAY will be scaled with factor 53% if used.)
Mar 26 09:00:18 archlinux crond[612]: (CRON) INFO (running with inotify support)`}
      />

      <h2>2. crontab — sintaxe</h2>

      <OutputBlock
        title="cinco campos de tempo + comando"
        output={`# m  h  dom mon dow  comando
# │  │   │   │   │
# │  │   │   │   └── dia da semana (0-7, 0 e 7 = domingo)
# │  │   │   └────── mês          (1-12 ou jan,feb,...)
# │  │   └────────── dia do mês   (1-31)
# │  └────────────── hora         (0-23)
# └───────────────── minuto       (0-59)`}
      />

      <OutputBlock
        title="operadores"
        output={`*           qualquer valor           (todo minuto, hora etc.)
N1,N2,N3    lista                     (0,15,30,45)
N1-N2       intervalo                 (8-18)
*/N         a cada N                  (*/5 = a cada 5)
N1-N2/M     intervalo + step          (0-30/10 = 0,10,20,30)`}
      />

      <OutputBlock
        title="atalhos especiais"
        output={`@reboot       roda uma vez quando o crond inicia (boot)
@yearly       0 0 1 1 *
@monthly      0 0 1 * *
@weekly       0 0 * * 0
@daily        0 0 * * *
@hourly       0 * * * *`}
      />

      <h2>3. Editando crontab</h2>

      <CommandFlagList
        command="crontab"
        items={[
          { flag: "-e", description: "Edita SEU crontab no editor padrão ($EDITOR ou vi).", example: "crontab -e" },
          { flag: "-l", description: "Lista o crontab atual." },
          { flag: "-r", description: "REMOVE todo o crontab (cuidado!)." },
          { flag: "-u USER", description: "Manipula o crontab de outro usuário (precisa root).", example: "sudo crontab -e -u www-data" },
        ]}
      />

      <TerminalBlock
        comment="defina o editor antes (vi assusta iniciantes)"
        command='echo "export EDITOR=nano" >> ~/.bashrc && source ~/.bashrc'
      />

      <TerminalBlock
        command="crontab -e"
        output={`crontab: installing new crontab`}
      />

      <CodeBlock
        title="exemplo de crontab pessoal"
        code={`# variáveis (opcional, mas RECOMENDADO)
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=""

# backup diário às 3h
0 3 * * *   /home/joao/scripts/backup.sh >> /home/joao/.local/var/backup.log 2>&1

# verificar VPN a cada 5 minutos
*/5 * * * * /home/joao/scripts/check-vpn.sh

# limpar cache do pacman aos domingos 4h (manter 3 versões)
0 4 * * 0   /usr/bin/paccache -rk3

# manter 1 versão de pacotes desinstalados
30 4 * * 0  /usr/bin/paccache -ruk0

# horário comercial: lembrete a cada hora cheia
0 9-17 * * 1-5  notify-send 'Pausa para água'

# tudo dia 1 do mês: rotacionar logs próprios
@monthly    /home/joao/scripts/rotate-logs.sh

# em todo boot
@reboot     /home/joao/scripts/start-tunnel.sh`}
      />

      <TerminalBlock
        command="crontab -l"
        output={`SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=""
0 3 * * *   /home/joao/scripts/backup.sh >> /home/joao/.local/var/backup.log 2>&1
*/5 * * * * /home/joao/scripts/check-vpn.sh
0 4 * * 0   /usr/bin/paccache -rk3
30 4 * * 0  /usr/bin/paccache -ruk0
0 9-17 * * 1-5  notify-send 'Pausa para água'
@monthly    /home/joao/scripts/rotate-logs.sh
@reboot     /home/joao/scripts/start-tunnel.sh`}
      />

      <AlertBox type="warning" title="Cron tem PATH MUITO curto">
        Sem definir <code>PATH</code> no topo do crontab, comandos como <code>notify-send</code>,{" "}
        <code>docker</code> etc. somem com <em>"command not found"</em>. <strong>Sempre use caminhos
        absolutos</strong> ou defina PATH explicitamente.
      </AlertBox>

      <h2>4. Logs e diagnóstico</h2>

      <TerminalBlock
        command="journalctl -t CRON -n 5"
        output={`Mar 26 03:00:01 archlinux CROND[3214]: (joao) CMD (/home/joao/scripts/backup.sh >> /home/joao/.local/var/backup.log 2>&1)
Mar 26 04:00:01 archlinux CROND[3287]: (root) CMD (/usr/bin/paccache -rk3)
Mar 26 04:30:01 archlinux CROND[3312]: (root) CMD (/usr/bin/paccache -ruk0)
Mar 26 09:00:18 archlinux CROND[741]: (joao) RELOAD (crontabs/joao)
Mar 26 14:05:01 archlinux CROND[4218]: (joao) CMD (/home/joao/scripts/check-vpn.sh)`}
      />

      <TerminalBlock
        comment="confirmar que o cron viu seu crontab"
        command="sudo journalctl -u cronie -g 'RELOAD|STARTUP'"
        output={`Mar 26 09:00:18 archlinux crond[612]: (CRON) STARTUP (1.7.4)
Mar 26 09:14:42 archlinux CROND[741]: (joao) RELOAD (crontabs/joao)`}
      />

      <h2>5. Diretórios de cron de sistema</h2>

      <p>
        Além do crontab por usuário, o <code>cronie</code> respeita o <code>/etc/crontab</code> (com um
        campo extra para o usuário) e os diretórios <em>drop-in</em>.
      </p>

      <TerminalBlock command="ls /etc/cron.d /etc/cron.daily /etc/cron.hourly /etc/cron.weekly /etc/cron.monthly" output={`/etc/cron.d:

/etc/cron.daily:
0logwatch     systemd-cleanup

/etc/cron.hourly:

/etc/cron.weekly:

/etc/cron.monthly:`} />

      <CodeBlock
        title="/etc/cron.d/atualizacao-mirror"
        code={`# m h dom mon dow user  command
30 2 * * 1  root   /usr/bin/reflector --country Brazil --age 6 --sort rate --save /etc/pacman.d/mirrorlist`}
      />

      <h2>6. systemd timers — alternativa moderna</h2>

      <p>
        Um timer é um par de units: o <code>.service</code> (o que rodar) + o <code>.timer</code> (quando).
      </p>

      <CodeBlock
        title="/etc/systemd/system/backup.service"
        language="ini"
        code={`[Unit]
Description=Backup do /home

[Service]
Type=oneshot
ExecStart=/home/joao/scripts/backup.sh
Nice=10
IOSchedulingClass=idle
StandardOutput=journal`}
      />

      <CodeBlock
        title="/etc/systemd/system/backup.timer"
        language="ini"
        code={`[Unit]
Description=Backup diário às 03:00

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true
RandomizedDelaySec=15min
AccuracySec=1min

[Install]
WantedBy=timers.target`}
      />

      <TerminalBlock
        command="sudo systemctl daemon-reload && sudo systemctl enable --now backup.timer"
        output={`Created symlink '/etc/systemd/system/timers.target.wants/backup.timer' → '/etc/systemd/system/backup.timer'.`}
      />

      <TerminalBlock
        command="systemctl list-timers --all"
        output={`NEXT                          LEFT       LAST                          PASSED       UNIT                         ACTIVATES
Sat 2026-03-27 03:00:00 -03   12h left   Fri 2026-03-26 03:00:14 -03   11h ago      backup.timer                 backup.service
Sat 2026-03-27 00:00:00 -03   9h left    Fri 2026-03-26 00:00:00 -03   14h ago      logrotate.timer              logrotate.service
Sat 2026-03-27 18:01:00 -03   3h left    Fri 2026-03-26 18:01:14 -03   18min ago    fwupd-refresh.timer          fwupd-refresh.service
Mon 2026-03-30 00:00:00 -03   3 days     Mon 2026-03-23 00:00:09 -03   3 days ago   fstrim.timer                 fstrim.service

4 timers listed.`}
      />

      <h3>OnCalendar — sintaxe</h3>

      <TerminalBlock
        command='systemd-analyze calendar "Mon..Fri 09:00"'
        output={`  Original form: Mon..Fri 09:00
Normalized form: Mon..Fri *-*-* 09:00:00
    Next elapse: Mon 2026-03-30 09:00:00 -03
       (in UTC): Mon 2026-03-30 12:00:00 UTC
       From now: 2 days left`}
      />

      <OutputBlock
        title="receitas comuns de OnCalendar"
        output={`*-*-* 03:00:00              todo dia às 3h
Mon *-*-* 08:00:00          toda segunda às 8h
Mon..Fri *-*-* 09:00:00     dias úteis às 9h
*-*-01 00:00:00             todo dia 1
*:0/15                      a cada 15 min
*:0/5                       a cada 5 min
hourly / daily / weekly     atalhos
2026-12-25 00:00:00         data específica`}
      />

      <h3>Comparativo cron × timer (mesma tarefa)</h3>

      <OutputBlock
        title="backup diário 03:00"
        output={`# cron
0 3 * * *  /home/joao/scripts/backup.sh

# systemd timer (backup.timer)
[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true       # se a máquina estava desligada às 3h, roda no boot
RandomizedDelaySec=15min  # evita 'thundering herd' em fleet`}
      />

      <h2>7. Timers de usuário (sem sudo)</h2>

      <TerminalBlock
        command="mkdir -p ~/.config/systemd/user"
      />

      <CodeBlock
        title="~/.config/systemd/user/lembrete.service"
        language="ini"
        code={`[Unit]
Description=Lembrete pomodoro

[Service]
Type=oneshot
ExecStart=/usr/bin/notify-send 'Pausa de 5 min ☕'`}
      />

      <CodeBlock
        title="~/.config/systemd/user/lembrete.timer"
        language="ini"
        code={`[Unit]
Description=Lembrete a cada 25 min

[Timer]
OnUnitActiveSec=25min
OnBootSec=10min
Unit=lembrete.service

[Install]
WantedBy=timers.target`}
      />

      <TerminalBlock
        command="systemctl --user daemon-reload && systemctl --user enable --now lembrete.timer"
      />

      <TerminalBlock
        command="systemctl --user list-timers"
        output={`NEXT                        LEFT      LAST                        PASSED       UNIT             ACTIVATES
Fri 2026-03-26 18:42:18 -03 22min     Fri 2026-03-26 18:17:18 -03 2min ago     lembrete.timer   lembrete.service`}
      />

      <h2>8. at — agendamento de execução única</h2>

      <TerminalBlock
        command="sudo pacman -S at"
        output={`Packages (1) at-3.2.5-3
Total Installed Size:  0.21 MiB`}
      />

      <TerminalBlock
        comment="o daemon precisa estar rodando"
        command="sudo systemctl enable --now atd"
        output={`Created symlink '/etc/systemd/system/multi-user.target.wants/atd.service' → '/usr/lib/systemd/system/atd.service'.`}
      />

      <TerminalBlock
        command={`echo "shutdown -h now" | at 23:30`}
        output={`warning: commands will be executed using /bin/sh
job 4 at Fri Mar 26 23:30:00 2026`}
      />

      <TerminalBlock
        comment="vários formatos de tempo"
        command={`echo "echo oi >> /tmp/oi.txt" | at now + 5 minutes`}
        output={`warning: commands will be executed using /bin/sh
job 5 at Fri Mar 26 18:48:00 2026`}
      />

      <TerminalBlock
        comment="amanhã às 8h"
        command={`echo "/home/joao/scripts/relatorio.sh" | at 8:00 tomorrow`}
        output={`job 6 at Sat Mar 27 08:00:00 2026`}
      />

      <CommandFlagList
        command="at — formatos de tempo"
        items={[
          { flag: "HH:MM", description: "Hoje nesse horário (amanhã se já passou).", example: "at 14:30" },
          { flag: "noon / midnight / teatime", description: "Apelidos (teatime = 16:00)." },
          { flag: "now + N minutes/hours/days", description: "Relativo a agora.", example: "at now + 2 hours" },
          { flag: "HH:MM tomorrow", description: "Amanhã nesse horário." },
          { flag: "HH:MM YYYY-MM-DD", description: "Data específica.", example: "at 09:00 2026-04-01" },
        ]}
      />

      <TerminalBlock
        command="atq"
        output={`4       Fri Mar 26 23:30:00 2026 a joao
5       Fri Mar 26 18:48:00 2026 a joao
6       Sat Mar 27 08:00:00 2026 a joao`}
      />

      <TerminalBlock command="at -c 4" output={`#!/bin/sh
# atrun uid=1000 gid=1000
# mail joao 0
umask 22
... (variáveis de ambiente herdadas) ...
cd /home/joao || { echo 'Execution directory inaccessible' >&2; exit 1; }
shutdown -h now`} />

      <TerminalBlock
        comment="cancelar"
        command="atrm 5"
      />

      <h2>9. Quem pode usar cron e at?</h2>

      <CodeBlock
        title="/etc/cron.allow / /etc/cron.deny"
        code={`# Se /etc/cron.allow existir, SOMENTE usuários listados podem rodar crontab.
# Se não existir, mas /etc/cron.deny existir, todos PODEM exceto os listados.
# Se nenhum existir, somente root.

# Exemplo /etc/cron.allow:
joao
deploy`}
      />

      <p>
        O mesmo vale para <code>/etc/at.allow</code> / <code>/etc/at.deny</code>.
      </p>

      <h2>10. Resumo prático</h2>

      <OutputBlock
        title="cheat sheet"
        output={`# cron (precisa instalar)
sudo pacman -S cronie
sudo systemctl enable --now cronie
crontab -e
crontab -l
journalctl -t CRON -n 20

# timer systemd (já vem)
sudo systemctl edit --force --full meu.service
sudo systemctl edit --force --full meu.timer
sudo systemctl daemon-reload
sudo systemctl enable --now meu.timer
systemctl list-timers --all
systemd-analyze calendar 'Mon..Fri 09:00'

# timer de usuário
systemctl --user enable --now meu.timer
systemctl --user list-timers

# at (precisa instalar)
sudo pacman -S at
sudo systemctl enable --now atd
echo 'cmd' | at HH:MM
atq
atrm N`}
      />
    </PageContainer>
  );
}
