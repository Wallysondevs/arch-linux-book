import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Systemd() {
  return (
    <PageContainer
      title="Systemd"
      subtitle="O init e gerenciador de serviços moderno. Aqui você vê a saída real de systemctl, journalctl, systemd-analyze e como criar units e timers."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Sistema"
    >
      <h2>O que é o Systemd?</h2>
      <p>
        O <code>systemd</code> é o PID 1 do Arch — o primeiro processo iniciado pelo kernel.
        Ele cuida de unidades (<strong>units</strong>): serviços (<code>.service</code>),
        timers, mounts, sockets, targets, slices e devices. Cada unit é um arquivo INI em
        <code> /usr/lib/systemd/system/</code> (do pacote) ou <code> /etc/systemd/system/</code> (suas customizações).
      </p>

      <TerminalBlock
        comment="Quem é o PID 1?"
        command="ps -p 1 -o pid,ppid,user,cmd"
        output={`    PID    PPID USER     CMD
      1       0 root     /sbin/init`}
      />

      <TerminalBlock
        command="readlink /sbin/init"
        output={`../lib/systemd/systemd`}
      />

      <h2>systemctl — operações com serviços</h2>

      <CommandFlagList
        command="systemctl"
        items={[
          { flag: "start", description: "Inicia a unit agora.", example: "sudo systemctl start sshd" },
          { flag: "stop", description: "Para a unit.", example: "sudo systemctl stop sshd" },
          { flag: "restart", description: "Para e inicia novamente.", example: "sudo systemctl restart nginx" },
          { flag: "reload", description: "Pede para a unit recarregar config (se suportar).", example: "sudo systemctl reload nginx" },
          { flag: "enable", description: "Cria symlinks para iniciar no boot.", example: "sudo systemctl enable sshd" },
          { flag: "enable --now", description: "Habilita E inicia em uma chamada.", example: "sudo systemctl enable --now sshd" },
          { flag: "disable", description: "Remove os symlinks (não inicia mais no boot).", example: "sudo systemctl disable sshd" },
          { flag: "mask", description: "Bloqueia totalmente (link para /dev/null).", example: "sudo systemctl mask bluetooth" },
          { flag: "status", description: "Mostra estado, PID, journal recente.", example: "systemctl status sshd" },
          { flag: "is-active", description: "Retorna active/inactive (script-friendly, exit 0=ativo).", example: "systemctl is-active sshd" },
          { flag: "is-enabled", description: "Retorna enabled/disabled/static/masked.", example: "systemctl is-enabled sshd" },
          { flag: "cat", description: "Mostra o conteúdo do .service.", example: "systemctl cat sshd" },
          { flag: "edit", description: "Cria um override em /etc/systemd/system/&lt;unit&gt;.d/.", example: "sudo systemctl edit nginx" },
          { flag: "daemon-reload", description: "Recarrega definições após editar arquivos manualmente.", example: "sudo systemctl daemon-reload" },
        ]}
      />

      <h3>systemctl status — leitura completa</h3>

      <TerminalBlock
        command="systemctl status sshd"
        output={`{g}● sshd.service{/} - OpenSSH Daemon
     Loaded: loaded ({c}/usr/lib/systemd/system/sshd.service{/}; {g}enabled{/}; preset: {y}disabled{/})
     Active: {g}active (running){/} since Wed 2024-03-20 14:32:18 -03; 2h 14min ago
   Main PID: {b}832{/} (sshd)
      Tasks: 1 (limit: 38389)
     Memory: 4.8M
        CPU: 124ms
     CGroup: /system.slice/sshd.service
             └─832 "sshd: /usr/bin/sshd -D [listener] 0 of 10-100 startups"

Mar 20 14:32:18 archlinux systemd[1]: Started OpenSSH Daemon.
Mar 20 14:32:18 archlinux sshd[832]: Server listening on 0.0.0.0 port 22.
Mar 20 14:32:18 archlinux sshd[832]: Server listening on :: port 22.
Mar 20 15:08:42 archlinux sshd[1247]: Accepted publickey for user from 192.168.0.5 port 51234 ssh2: ED25519 SHA256:ABCD...
Mar 20 15:08:42 archlinux sshd[1247]: pam_unix(sshd:session): session opened for user user(uid=1000) by (uid=0)`}
      />

      <OutputBlock
        title="Cada linha de status explicada"
        output={`● sshd.service - OpenSSH Daemon
└── nome.tipo                           descrição
Loaded: loaded (path; enabled; preset)
        ├── enabled  = inicia no boot
        ├── disabled = não inicia
        ├── static   = sem [Install], só por dependência
        └── masked   = bloqueado
Active: active (running) since ...
        ├── active (running)   – rodando
        ├── active (exited)    – tipo oneshot, completou
        ├── inactive (dead)    – parado
        ├── failed             – falhou (veja journal)
        └── activating         – iniciando
Main PID: 832 (sshd)                    PID + comm
Tasks: 1 (limit: 38389)                 # de threads / cgroup limit
Memory / CPU                            uso atual
CGroup                                  árvore de processos da unit`}
        annotations={[
          { line: 0, note: "● verde=ok, ●×vermelho=falhou" },
          { line: 4, note: "preset = padrão sugerido pela distro" },
        ]}
      />

      <AlertBox type="info" title="enable vs start (a confusão clássica)">
        <code>start</code> liga agora, mas o serviço NÃO volta após reboot.
        <code> enable</code> só cria os symlinks para o próximo boot.
        Use <code>enable --now</code> para fazer os dois.
      </AlertBox>

      <h3>systemctl is-active / is-enabled — para scripts</h3>

      <TerminalBlock
        command="systemctl is-active sshd && echo 'ssh está rodando'"
        output={`active
ssh está rodando`}
      />

      <TerminalBlock
        command="systemctl is-enabled bluetooth"
        output={`disabled`}
      />

      <h2>Listar e descobrir units</h2>

      <h3>list-units (somente carregadas)</h3>

      <TerminalBlock
        command="systemctl list-units --type=service --state=running"
        output={`  UNIT                          LOAD   ACTIVE SUB     DESCRIPTION
  dbus-broker.service           loaded {g}active{/} running D-Bus System Message Broker
  NetworkManager.service        loaded {g}active{/} running Network Manager
  polkit.service                loaded {g}active{/} running Authorization Manager
  sshd.service                  loaded {g}active{/} running OpenSSH Daemon
  systemd-journald.service      loaded {g}active{/} running Journal Service
  systemd-logind.service        loaded {g}active{/} running User Login Management
  systemd-resolved.service      loaded {g}active{/} running Network Name Resolution
  systemd-udevd.service         loaded {g}active{/} running Rule-based Manager for Device Events and Files
  user@1000.service             loaded {g}active{/} running User Manager for UID 1000

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
SUB    = The low-level unit activation state, values depend on unit type.

9 loaded units listed.`}
      />

      <h3>list-unit-files (todas as units instaladas)</h3>

      <TerminalBlock
        command="systemctl list-unit-files --type=service --state=enabled"
        output={`UNIT FILE                          STATE    PRESET
NetworkManager.service             {g}enabled{/}  enabled
fstrim.timer                       {g}enabled{/}  enabled
sshd.service                       {g}enabled{/}  disabled
systemd-resolved.service           {g}enabled{/}  enabled
systemd-timesyncd.service          {g}enabled{/}  enabled

5 unit files listed.`}
      />

      <h3>--failed (o primeiro lugar para investigar)</h3>

      <TerminalBlock
        command="systemctl --failed"
        output={`  UNIT                          LOAD   ACTIVE SUB    DESCRIPTION
{r}● bluetooth.service{/}            loaded failed failed Bluetooth service

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state.
SUB    = The low-level unit activation state.

1 loaded units listed.`}
      />

      <h3>list-timers</h3>

      <TerminalBlock
        command="systemctl list-timers"
        output={`NEXT                        LEFT        LAST                        PASSED       UNIT                         ACTIVATES
Wed 2024-03-20 18:10:12 -03 1h 25min     Wed 2024-03-20 16:10:12 -03 35min ago    systemd-tmpfiles-clean.timer systemd-tmpfiles-clean.service
Thu 2024-03-21 00:00:00 -03 7h          Wed 2024-03-20 12:01:14 -03 4h 44min ago logrotate.timer              logrotate.service
Mon 2024-03-25 00:00:00 -03 4 days left Mon 2024-03-18 00:00:09 -03 2 days ago   fstrim.timer                 fstrim.service
Mon 2024-03-25 00:09:42 -03 4 days left Mon 2024-03-18 00:11:53 -03 2 days ago   shadow.timer                 shadow.service

4 timers listed.`}
      />

      <h2>Targets (substituem runlevels)</h2>

      <TerminalBlock
        command="systemctl get-default"
        output={`graphical.target`}
      />

      <TerminalBlock
        command="systemctl list-units --type=target"
        output={`  UNIT                   LOAD   ACTIVE SUB    DESCRIPTION
  basic.target           loaded active active Basic System
  cryptsetup.target      loaded active active Local Encrypted Volumes
  getty.target           loaded active active Login Prompts
  graphical.target       loaded active active Graphical Interface
  local-fs-pre.target    loaded active active Preparation for Local File Systems
  local-fs.target        loaded active active Local File Systems
  multi-user.target      loaded active active Multi-User System
  network-online.target  loaded active active Network is Online
  network.target         loaded active active Network
  paths.target           loaded active active Path Units
  remote-fs.target       loaded active active Remote File Systems
  slices.target          loaded active active Slice Units
  sockets.target         loaded active active Socket Units
  sound.target           loaded active active Sound Card
  sysinit.target         loaded active active System Initialization
  swap.target            loaded active active Swaps
  timers.target          loaded active active Timer Units`}
      />

      <OutputBlock
        title="Equivalência runlevel → target"
        output={`runlevel 0   poweroff.target     desligar
runlevel 1   rescue.target       single user
runlevel 3   multi-user.target   modo texto
runlevel 5   graphical.target    modo gráfico (DM)
runlevel 6   reboot.target       reiniciar`}
      />

      <h2>journalctl — logs estruturados</h2>

      <CommandFlagList
        command="journalctl"
        items={[
          { flag: "-b", description: "Logs do boot atual (-b -1 = boot anterior).", example: "journalctl -b -1" },
          { flag: "-u", long: "--unit", description: "Filtra por unit.", example: "journalctl -u sshd" },
          { flag: "-f", long: "--follow", description: "Acompanha em tempo real (tail -f).", example: "journalctl -fu nginx" },
          { flag: "-p", long: "--priority", description: "Filtra por nível: emerg/alert/crit/err/warning/notice/info/debug.", example: "journalctl -p err" },
          { flag: "-n", long: "--lines", description: "Últimas N linhas.", example: "journalctl -n 50" },
          { flag: "--since", description: "Desde uma data/hora ou expressão relativa.", example: "journalctl --since '1 hour ago'" },
          { flag: "--until", description: "Até uma data/hora.", example: "journalctl --until '2024-03-20 12:00'" },
          { flag: "-k", long: "--dmesg", description: "Apenas mensagens do kernel.", example: "journalctl -k" },
          { flag: "-x", description: "Adiciona explicações detalhadas das mensagens.", example: "journalctl -xeu sshd" },
          { flag: "-o", description: "Formato de saída: short / verbose / json / json-pretty / cat.", example: "journalctl -o json-pretty" },
          { flag: "--disk-usage", description: "Quanto espaço o journal ocupa.", example: "journalctl --disk-usage" },
          { flag: "--vacuum-size", description: "Reduz o journal a um tamanho.", example: "sudo journalctl --vacuum-size=500M" },
          { flag: "--vacuum-time", description: "Mantém apenas N tempo de logs.", example: "sudo journalctl --vacuum-time=2weeks" },
        ]}
      />

      <TerminalBlock
        command="journalctl -b -p err -n 5"
        output={`Mar 20 14:32:14 archlinux kernel: ACPI BIOS Error (bug): Could not resolve symbol [\\_SB.PCI0.GPP8.SAT0._GTF.DSSP], AE_NOT_FOUND (20230628/psargs-330)
Mar 20 14:32:15 archlinux bluetoothd[789]: Failed to set mode: Blocked through rfkill (0x12)
Mar 20 14:32:15 archlinux systemd[1]: bluetooth.service: Main process exited, code=exited, status=1/FAILURE
Mar 20 14:32:15 archlinux systemd[1]: bluetooth.service: Failed with result 'exit-code'.
Mar 20 14:32:15 archlinux systemd[1]: Failed to start Bluetooth service.`}
      />

      <TerminalBlock
        command="journalctl -xeu bluetooth.service -n 6"
        output={`░░ Subject: A start job for unit bluetooth.service has begun execution
░░ Defined-By: systemd
░░
░░ A start job for unit bluetooth.service has begun execution.
░░
░░ The job identifier is 142.
Mar 20 14:32:15 archlinux bluetoothd[789]: Bluetooth daemon 5.73
Mar 20 14:32:15 archlinux bluetoothd[789]: Starting SDP server
Mar 20 14:32:15 archlinux bluetoothd[789]: Failed to set mode: Blocked through rfkill (0x12)
Mar 20 14:32:15 archlinux systemd[1]: bluetooth.service: Main process exited, code=exited, status=1/FAILURE
░░ Subject: Unit process exited
░░ The process' exit code is 'exited' and its exit status is 1.
Mar 20 14:32:15 archlinux systemd[1]: bluetooth.service: Failed with result 'exit-code'.`}
      />

      <TerminalBlock
        command="journalctl --disk-usage"
        output={`Archived and active journals take up 412.8M in the file system.`}
      />

      <TerminalBlock
        command="sudo journalctl --vacuum-size=200M"
        output={`Deleted archived journal /var/log/journal/abc123/system@00060e7a8...journal (104.9M).
Deleted archived journal /var/log/journal/abc123/user-1000@00060e7a8...journal (32.1M).
Vacuuming done, freed 137.0M of archive logs on disk.`}
      />

      <h2>Boot performance: systemd-analyze</h2>

      <TerminalBlock
        command="systemd-analyze"
        output={`Startup finished in 6.241s (firmware) + 2.918s (loader) + 1.842s (kernel) + 4.215s (userspace) = 15.216s
graphical.target reached after 4.214s in userspace.`}
      />

      <TerminalBlock
        command="systemd-analyze blame | head -10"
        output={`1.842s NetworkManager-wait-online.service
 542ms systemd-udev-trigger.service
 412ms ldconfig.service
 318ms systemd-journal-flush.service
 287ms upower.service
 245ms ModemManager.service
 198ms systemd-logind.service
 184ms polkit.service
 142ms systemd-tmpfiles-setup.service
 128ms NetworkManager.service`}
      />

      <TerminalBlock
        command="systemd-analyze critical-chain"
        output={`The time when unit became active or started is printed after the "@" character.
The time the unit took to start is printed after the "+" character.

graphical.target @4.214s
└─multi-user.target @4.213s
  └─sshd.service @3.847s +366ms
    └─network.target @3.846s
      └─NetworkManager.service @3.661s +184ms
        └─dbus-broker.service @3.642s +18ms
          └─dbus.socket @3.640s
            └─sysinit.target @3.639s`}
      />

      <TerminalBlock
        command="systemd-analyze verify /etc/systemd/system/meu-app.service"
        output={`Assertion failed on job for meu-app.service.
meu-app.service: Service has no ExecStart=, ExecStop=, or SuccessAction=. Refusing.`}
      />

      <h2>Criando seu serviço</h2>

      <CodeBlock
        title="/etc/systemd/system/minha-api.service"
        language="ini"
        code={`[Unit]
Description=Minha API Node.js
Documentation=https://github.com/me/api
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/node /opt/api/server.js
Restart=always
RestartSec=10
User=deploy
Group=deploy
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=-/etc/minha-api.env
WorkingDirectory=/opt/api
StandardOutput=journal
StandardError=journal

# Hardening recomendado
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/log/minha-api

[Install]
WantedBy=multi-user.target`}
      />

      <TerminalBlock
        command="sudo systemctl daemon-reload && sudo systemctl enable --now minha-api"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/minha-api.service → /etc/systemd/system/minha-api.service.`}
      />

      <TerminalBlock
        command="systemctl status minha-api"
        output={`{g}● minha-api.service{/} - Minha API Node.js
     Loaded: loaded (/etc/systemd/system/minha-api.service; {g}enabled{/}; preset: {y}disabled{/})
     Active: {g}active (running){/} since Wed 2024-03-20 16:48:02 -03; 12s ago
   Main PID: {b}3217{/} (node)
      Tasks: 11 (limit: 38389)
     Memory: 41.2M
        CPU: 482ms
     CGroup: /system.slice/minha-api.service
             └─3217 /usr/bin/node /opt/api/server.js

Mar 20 16:48:02 archlinux systemd[1]: Started Minha API Node.js.
Mar 20 16:48:03 archlinux node[3217]: API listening on :3000`}
      />

      <h3>Tipos de serviço</h3>

      <OutputBlock
        title="Type= e quando usar"
        output={`simple    (default) ExecStart roda direto e fica no foreground
exec      como simple, mas systemd espera o exec() retornar
forking   programa "tradicional" — faz fork e o pai sai (ex: nginx)
oneshot   roda, termina, marca como ativo (scripts/setup)
notify    o programa avisa systemd quando está pronto via sd_notify
dbus      pronto quando registra um nome no D-Bus
idle      simple mas espera todos os outros jobs terminarem`}
      />

      <h3>Override sem editar o original (drop-in)</h3>

      <TerminalBlock
        command="sudo systemctl edit nginx"
        output={`### Editing /etc/systemd/system/nginx.service.d/override.conf
### Anything between here and the comment below will become the new contents of the file

[Service]
Restart=always
RestartSec=5

### Lines below this comment will be discarded`}
      />

      <TerminalBlock
        command="systemctl cat nginx"
        output={`# /usr/lib/systemd/system/nginx.service
[Unit]
Description=A high performance web server
After=network.target

[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStart=/usr/bin/nginx
ExecReload=/usr/bin/nginx -s reload
ExecStop=/usr/bin/nginx -s quit

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/nginx.service.d/override.conf
[Service]
Restart=always
RestartSec=5`}
      />

      <h2>Timers — alternativa moderna ao cron</h2>

      <CodeBlock
        title="/etc/systemd/system/backup.service (a unidade de trabalho)"
        language="ini"
        code={`[Unit]
Description=Backup diário do /home

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
Nice=10
IOSchedulingClass=idle
StandardOutput=journal`}
      />

      <CodeBlock
        title="/etc/systemd/system/backup.timer (o agendador)"
        language="ini"
        code={`[Unit]
Description=Backup diário às 03:00

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true
RandomizedDelaySec=900

[Install]
WantedBy=timers.target`}
      />

      <TerminalBlock
        command="sudo systemctl daemon-reload && sudo systemctl enable --now backup.timer"
        output={`Created symlink /etc/systemd/system/timers.target.wants/backup.timer → /etc/systemd/system/backup.timer.`}
      />

      <TerminalBlock
        command="systemctl list-timers backup.timer"
        output={`NEXT                        LEFT        LAST PASSED UNIT          ACTIVATES
Thu 2024-03-21 03:14:22 -03 10h 26min   n/a  n/a    backup.timer  backup.service

1 timers listed.`}
      />

      <h3>OnCalendar — sintaxe</h3>

      <TerminalBlock
        command='systemd-analyze calendar "Mon..Fri *-*-* 09:00:00"'
        output={`  Original form: Mon..Fri *-*-* 09:00:00
Normalized form: Mon..Fri *-*-* 09:00:00
    Next elapse: Mon 2024-03-25 09:00:00 -03
       (in UTC): Mon 2024-03-25 12:00:00 UTC
       From now: 4 days left`}
      />

      <OutputBlock
        title="Receitas comuns de OnCalendar"
        output={`*-*-* 03:00:00              todo dia às 3h
Mon *-*-* 08:00:00          toda segunda às 8h
Mon..Fri *-*-* 09:00:00     dias úteis às 9h
*-*-01 00:00:00             todo dia 1
*:0/15                      a cada 15 min
hourly / daily / weekly     atalhos
2024-12-25 00:00:00         data específica`}
      />

      <h2>Serviços de usuário (sem sudo)</h2>

      <TerminalBlock
        command="mkdir -p ~/.config/systemd/user && cat > ~/.config/systemd/user/syncthing.service <<'EOF'
[Unit]
Description=Syncthing

[Service]
ExecStart=/usr/bin/syncthing serve --no-browser --no-restart --logflags=0
Restart=on-failure

[Install]
WantedBy=default.target
EOF"
        output={`(arquivo criado)`}
      />

      <TerminalBlock
        command="systemctl --user daemon-reload && systemctl --user enable --now syncthing"
        output={`Created symlink /home/user/.config/systemd/user/default.target.wants/syncthing.service → /home/user/.config/systemd/user/syncthing.service.`}
      />

      <TerminalBlock
        command="systemctl --user status syncthing"
        output={`{g}● syncthing.service{/} - Syncthing
     Loaded: loaded (/home/user/.config/systemd/user/syncthing.service; {g}enabled{/}; preset: {y}disabled{/})
     Active: {g}active (running){/} since Wed 2024-03-20 16:55:11 -03; 8s ago
   Main PID: 3401 (syncthing)
      Tasks: 12 (limit: 38389)
     Memory: 38.1M`}
      />

      <AlertBox type="warning" title="Não esqueça do daemon-reload">
        Sempre que criar ou editar um <code>.service</code> manualmente, rode
        <code> sudo systemctl daemon-reload</code> (ou <code>--user</code> para units do usuário).
        Sem isso, systemd usa a versão em cache.
      </AlertBox>

      <h2>Controle do sistema</h2>

      <TerminalBlock
        command="systemctl reboot"
        output={`(o sistema reinicia)`}
      />

      <CommandFlagList
        command="systemctl (sistema)"
        items={[
          { flag: "reboot", description: "Reinicia.", example: "sudo systemctl reboot" },
          { flag: "poweroff", description: "Desliga.", example: "sudo systemctl poweroff" },
          { flag: "suspend", description: "Suspende para RAM.", example: "systemctl suspend" },
          { flag: "hibernate", description: "Hiberna para disco.", example: "systemctl hibernate" },
          { flag: "rescue", description: "Vai para rescue.target (single user).", example: "sudo systemctl rescue" },
          { flag: "emergency", description: "Modo emergência (mínimo absoluto).", example: "sudo systemctl emergency" },
        ]}
      />

      <AlertBox type="success" title="Cheatsheet final">
        <ul>
          <li><code>systemctl status &lt;u&gt;</code> — visão geral</li>
          <li><code>systemctl enable --now &lt;u&gt;</code> — habilita e inicia</li>
          <li><code>systemctl --failed</code> — diagnostico inicial</li>
          <li><code>journalctl -xeu &lt;u&gt;</code> — log com explicações</li>
          <li><code>journalctl -fu &lt;u&gt;</code> — tail -f por unit</li>
          <li><code>systemctl edit &lt;u&gt;</code> — override sem mexer no original</li>
          <li><code>systemd-analyze blame</code> — quem está atrasando o boot</li>
          <li><code>systemctl list-timers</code> — tudo agendado</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
