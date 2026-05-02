import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function JournalCtl() {
  return (
    <PageContainer
      title="journalctl — logs estruturados do systemd"
      subtitle="O log central do Arch. Filtros por unit, boot, prioridade, data, regex e como configurar persistência e rotação do journald."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Sistema"
    >
      <p>
        Em um Arch moderno quase todos os logs convergem para o <code>systemd-journald</code>:
        kernel (substitui <code>dmesg</code>), serviços (substituem o <code>/var/log/syslog</code>),
        autenticação (substitui <code>auth.log</code>) e até stdout/stderr de qualquer processo iniciado
        pelo systemd. O cliente para consultar tudo isso é o <code>journalctl</code>.
      </p>

      <AlertBox type="info" title="Por padrão, o journal é volátil">
        Sem configuração, o Arch guarda logs em <code>/run/log/journal/</code> (RAM) — eles{" "}
        <strong>somem no reboot</strong>. Veja a seção 8 para tornar persistente.
      </AlertBox>

      <h2>1. Visão geral</h2>

      <TerminalBlock
        comment="ver TUDO desde sempre (paginado com less)"
        command="journalctl"
        output={`-- Boot 4f2c1d... --
Mar 26 09:00:14 archlinux kernel: Linux version 6.12.1-arch1-1 ...
Mar 26 09:00:14 archlinux kernel: Command line: ... root=UUID=8c2b... rw quiet
Mar 26 09:00:14 archlinux systemd[1]: systemd 256.5-2-arch running in system mode
Mar 26 09:00:14 archlinux systemd[1]: Detected architecture x86-64.
Mar 26 09:00:14 archlinux systemd[1]: Hostname set to <archlinux>.
Mar 26 09:00:14 archlinux systemd[1]: Queued start job for default target Graphical Interface.
...`}
      />

      <CommandFlagList
        command="journalctl — flags essenciais"
        items={[
          { flag: "-b", description: "Apenas o boot atual. -b -1 = boot anterior; -b 0 = atual.", example: "journalctl -b -1" },
          { flag: "-u UNIT", long: "--unit", description: "Filtra por unit do systemd.", example: "journalctl -u sshd" },
          { flag: "-f", long: "--follow", description: "Acompanha em tempo real (como tail -f).", example: "journalctl -fu nginx" },
          { flag: "-p PRIO", long: "--priority", description: "Nível: emerg(0) alert(1) crit(2) err(3) warning(4) notice(5) info(6) debug(7). Aceita range.", example: "journalctl -p err..alert" },
          { flag: "-n N", long: "--lines", description: "Últimas N linhas (default 10).", example: "journalctl -n 50" },
          { flag: "--since / --until", description: "Intervalo de tempo. Aceita 'YYYY-MM-DD HH:MM' ou expressões relativas.", example: "journalctl --since '1 hour ago' --until now" },
          { flag: "-k", long: "--dmesg", description: "Apenas mensagens do kernel.", example: "journalctl -k -b" },
          { flag: "-g REGEX", long: "--grep", description: "Filtro regex (PCRE) na mensagem.", example: "journalctl -g 'failed' -p warning" },
          { flag: "-x", description: "Acrescenta explicações de cada mensagem (catalog).", example: "journalctl -xeu sshd" },
          { flag: "-e", description: "Pula direto para o fim (último evento)." },
          { flag: "-r", long: "--reverse", description: "Mostra mais recentes primeiro." },
          { flag: "-o FORMAT", long: "--output", description: "short / verbose / json / json-pretty / cat / export.", example: "journalctl -u nginx -o json-pretty" },
          { flag: "--no-pager", description: "Sem paginação (saída direta — bom em pipes)." },
          { flag: "--list-boots", description: "Lista todos os boots persistidos." },
          { flag: "--disk-usage", description: "Espaço usado pelos arquivos do journal." },
          { flag: "--vacuum-size / --vacuum-time / --vacuum-files", description: "Limpa logs antigos por tamanho/tempo/quantidade.", example: "sudo journalctl --vacuum-time=2weeks" },
          { flag: "--verify", description: "Verifica integridade dos arquivos selados (FSS)." },
        ]}
      />

      <h2>2. Filtros mais usados no dia-a-dia</h2>

      <TerminalBlock
        comment="todos os erros do boot atual"
        command="journalctl -b -p err"
        output={`Mar 26 09:00:15 archlinux kernel: ACPI BIOS Error (bug): Could not resolve symbol [\\_SB.PCI0.GPP8.SAT0._GTF.DSSP], AE_NOT_FOUND
Mar 26 09:00:17 archlinux bluetoothd[792]: Failed to set mode: Blocked through rfkill (0x12)
Mar 26 09:00:17 archlinux systemd[1]: bluetooth.service: Main process exited, code=exited, status=1/FAILURE
Mar 26 09:00:17 archlinux systemd[1]: bluetooth.service: Failed with result 'exit-code'.`}
      />

      <TerminalBlock
        comment="só os logs do sshd, nas últimas 30 min"
        command="journalctl -u sshd --since '30 min ago'"
        output={`Mar 26 14:01:12 archlinux sshd[1837]: Accepted publickey for joao from 192.168.1.10 port 51234 ssh2: ED25519 SHA256:abc...
Mar 26 14:01:12 archlinux sshd[1837]: pam_unix(sshd:session): session opened for user joao(uid=1000) by (uid=0)
Mar 26 14:18:42 archlinux sshd[1972]: Connection closed by authenticating user root 203.0.113.5 port 41122 [preauth]
Mar 26 14:18:42 archlinux sshd[1972]: Disconnected from authenticating user root 203.0.113.5 port 41122 [preauth]`}
      />

      <TerminalBlock
        comment="acompanhar nginx em tempo real (Ctrl+C para sair)"
        command="journalctl -fu nginx"
        output={`Mar 26 14:30:01 archlinux nginx[1287]: 192.168.1.42 - - [26/Mar/2026:14:30:01 -0300] "GET /api/v1/posts HTTP/1.1" 200 4821
Mar 26 14:30:02 archlinux nginx[1287]: 192.168.1.42 - - [26/Mar/2026:14:30:02 -0300] "POST /api/v1/login HTTP/1.1" 401 87`}
      />

      <TerminalBlock
        comment="dois critérios combinados (AND): unit nginx, prioridade ≥ warning"
        command="journalctl -u nginx -p warning --since today"
        output={`Mar 26 11:42:18 archlinux nginx[1287]: [warn] 1287#1287: server name "_" has suspicious symbols
Mar 26 13:08:21 archlinux nginx[1287]: [error] 1287#1287: open() "/var/www/html/.well-known" failed (2: No such file or directory)`}
      />

      <TerminalBlock
        comment="busca regex em qualquer mensagem"
        command="journalctl -g 'segfault|out of memory' -b"
        output={`Mar 26 12:18:42 archlinux kernel: chrome[3214]: segfault at 0 ip 00007fa84e2c11a1 sp 00007ffe54acf328 error 6 in libc.so.6
Mar 26 12:30:01 archlinux kernel: Out of memory: Killed process 3214 (chrome) total-vm:4823104kB`}
      />

      <h2>3. Boots — passado e presente</h2>

      <TerminalBlock
        command="journalctl --list-boots"
        output={`-3 4f2c1d4a8b3e4d5a... Wed 2026-03-24 08:14:22 -03 - Wed 2026-03-24 23:48:11 -03
-2 8a3b7f9c2d1e6a4b... Thu 2026-03-25 07:22:18 -03 - Thu 2026-03-25 22:12:42 -03
-1 c1e4d8b2a9f3e5a7... Fri 2026-03-26 06:45:33 -03 - Fri 2026-03-26 08:42:12 -03
 0 e9b2f4a1c7d8e3b5... Fri 2026-03-26 09:00:14 -03 - <ainda em curso>`}
      />

      <TerminalBlock
        comment="apenas o boot anterior, prioridade ≥ warning"
        command="journalctl -b -1 -p warning"
        output={`Mar 25 19:34:08 archlinux kernel: ACPI Error: Aborting method \\_SB.PCI0.LPCB.EC0._Q66 due to previous error (AE_NOT_FOUND)
Mar 25 22:08:12 archlinux NetworkManager[612]: <warn> [1742... ] device (wlan0): Activation: failed for connection 'Casa'
Mar 25 22:11:38 archlinux systemd[1]: NetworkManager-wait-online.service: Main process exited, code=exited, status=1/FAILURE`}
      />

      <h2>4. Por campo (filtros estruturados)</h2>

      <p>
        Cada entrada do journal é um <em>dicionário</em> de campos (não só uma linha de texto). Você pode
        filtrar diretamente por qualquer campo passando <code>CHAVE=valor</code>.
      </p>

      <TerminalBlock
        comment="ver TODOS os campos de uma entrada"
        command="journalctl -u sshd -n 1 -o verbose"
        output={`Fri 2026-03-26 14:01:12.184232 -03 [s=abc...;i=1f4a;b=e9b2...;m=18a4...;t=63a8...]
    _BOOT_ID=e9b2f4a1c7d8e3b5...
    _MACHINE_ID=8c2b1d4a0e5a4f229a3e4f6e8e3b7c11
    PRIORITY=6
    _UID=0
    _GID=0
    _COMM=sshd
    _EXE=/usr/bin/sshd
    _CMDLINE=sshd: joao [priv]
    _SYSTEMD_UNIT=sshd.service
    SYSLOG_FACILITY=10
    SYSLOG_IDENTIFIER=sshd
    MESSAGE=Accepted publickey for joao from 192.168.1.10 port 51234 ssh2: ED25519 SHA256:abc...
    _PID=1837
    _HOSTNAME=archlinux`}
      />

      <TerminalBlock
        comment="por executável"
        command="journalctl _EXE=/usr/bin/sshd -n 3 --no-pager"
        output={`Mar 26 14:01:12 archlinux sshd[1837]: Accepted publickey for joao from 192.168.1.10 port 51234 ssh2: ED25519 SHA256:abc
Mar 26 14:18:42 archlinux sshd[1972]: Connection closed by authenticating user root 203.0.113.5 port 41122 [preauth]
Mar 26 14:18:42 archlinux sshd[1972]: Disconnected from authenticating user root 203.0.113.5 port 41122 [preauth]`}
      />

      <TerminalBlock
        comment="por usuário (UID 1000)"
        command="journalctl _UID=1000 --since today | head -3"
        output={`Mar 26 09:00:34 archlinux systemd[1278]: Starting D-Bus User Message Bus...
Mar 26 09:00:34 archlinux systemd[1278]: Reached target Main User Target.
Mar 26 09:00:35 archlinux pipewire[1288]: mod.rt: server has Realtime capabilities`}
      />

      <TerminalBlock
        comment="por unit + prioridade — combinando"
        command="journalctl _SYSTEMD_UNIT=NetworkManager.service PRIORITY=4 -b"
        output={`Mar 26 09:00:18 archlinux NetworkManager[612]: <warn> [1742...] sup-iface[c0...]: connection disconnected (reason -1)
Mar 26 11:32:48 archlinux NetworkManager[612]: <warn> [1742...] dhcp4 (wlan0): request timed out`}
      />

      <h2>5. Saídas em JSON (para ferramentas)</h2>

      <TerminalBlock
        command="journalctl -u sshd -n 1 -o json-pretty"
        output={`{
        "__CURSOR" : "s=abc...;i=1f4a;b=e9b2...;m=18a4...;t=63a8...",
        "__REALTIME_TIMESTAMP" : "1742999472184232",
        "__MONOTONIC_TIMESTAMP" : "10384122183",
        "_BOOT_ID" : "e9b2f4a1c7d8e3b5",
        "PRIORITY" : "6",
        "_UID" : "0",
        "_COMM" : "sshd",
        "_PID" : "1837",
        "_SYSTEMD_UNIT" : "sshd.service",
        "MESSAGE" : "Accepted publickey for joao from 192.168.1.10 port 51234 ssh2: ED25519 SHA256:abc...",
        "_HOSTNAME" : "archlinux"
}`}
      />

      <TerminalBlock
        comment="extrair só MESSAGE com jq (instale jq antes)"
        command="journalctl -u sshd -n 5 -o json | jq -r .MESSAGE"
        output={`Accepted publickey for joao from 192.168.1.10 port 51234 ssh2: ED25519 SHA256:abc...
Connection closed by authenticating user root 203.0.113.5 port 41122 [preauth]
Disconnected from authenticating user root 203.0.113.5 port 41122 [preauth]
Received disconnect from 198.51.100.5 port 38122:11: Bye Bye [preauth]
Disconnected from invalid user admin 198.51.100.5 port 38122 [preauth]`}
      />

      <h2>6. Logs do kernel (substitui dmesg)</h2>

      <TerminalBlock
        command="journalctl -k -b | head -8"
        output={`Mar 26 09:00:14 archlinux kernel: Linux version 6.12.1-arch1-1 (linux@archlinux) (gcc (GCC) 14.2.1 20240910) #1 SMP PREEMPT_DYNAMIC Tue, 19 Nov 2024 17:01:53 +0000
Mar 26 09:00:14 archlinux kernel: Command line: initrd=\\intel-ucode.img initrd=\\initramfs-linux.img root=UUID=8c2b...
Mar 26 09:00:14 archlinux kernel: x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
Mar 26 09:00:14 archlinux kernel: BIOS-provided physical RAM map:
Mar 26 09:00:14 archlinux kernel: BIOS-e820: [mem 0x0000000000001000-0x0000000000057fff] usable
Mar 26 09:00:14 archlinux kernel: BIOS-e820: [mem 0x0000000000058000-0x0000000000058fff] reserved
Mar 26 09:00:14 archlinux kernel: ACPI: RSDP 0x00000000B8E5E000 000024 (v02 ALASKA)
Mar 26 09:00:14 archlinux kernel: ACPI: XSDT 0x00000000B8E5E040 000084 (v01 ALASKA A M I    01072009 AMI  00010013)`}
      />

      <h2>7. Inspeção de unit que falhou (-xeu)</h2>

      <TerminalBlock
        command="journalctl -xeu bluetooth.service"
        output={`░░ Subject: A start job for unit bluetooth.service has begun execution
░░ Defined-By: systemd
░░
░░ A start job for unit bluetooth.service has begun execution.
░░
░░ The job identifier is 142.
Mar 26 09:00:17 archlinux bluetoothd[792]: Bluetooth daemon 5.78
Mar 26 09:00:17 archlinux bluetoothd[792]: Starting SDP server
Mar 26 09:00:17 archlinux bluetoothd[792]: Failed to set mode: Blocked through rfkill (0x12)
Mar 26 09:00:17 archlinux systemd[1]: bluetooth.service: Main process exited, code=exited, status=1/FAILURE
░░ Subject: Unit process exited
░░ Defined-By: systemd
░░
░░ The process' exit code is 'exited' and its exit status is 1.
Mar 26 09:00:17 archlinux systemd[1]: bluetooth.service: Failed with result 'exit-code'.`}
      />

      <OutputBlock
        title="o que '-xeu unit' faz"
        annotations={[
          { line: 0, note: "-x adiciona blocos ░░ Subject/Defined-By (catálogo)" },
          { line: 1, note: "-e pula para o final" },
          { line: 2, note: "-u filtra a unit" },
        ]}
        output={`-x  → Subject/Defined-By/etc.
-e  → fim do log
-u  → unit específica`}
      />

      <h2>8. Persistência e rotação — journald.conf</h2>

      <TerminalBlock
        command="ls /var/log/journal/ 2>/dev/null || echo 'volátil (RAM)'"
        output="volátil (RAM)"
      />

      <TerminalBlock
        comment="basta criar o diretório para o journald começar a persistir"
        command="sudo mkdir -p /var/log/journal && sudo systemctl restart systemd-journald"
      />

      <TerminalBlock
        command="ls /var/log/journal/"
        output={`8c2b1d4a0e5a4f229a3e4f6e8e3b7c11`}
      />

      <CodeBlock
        title="/etc/systemd/journald.conf"
        language="ini"
        code={`[Journal]
Storage=persistent
Compress=yes
Seal=yes
SystemMaxUse=500M
SystemKeepFree=1G
SystemMaxFileSize=50M
SystemMaxFiles=100
RuntimeMaxUse=200M
MaxRetentionSec=4week
ForwardToSyslog=no
MaxLevelStore=info`}
      />

      <CommandFlagList
        command="journald.conf — chaves principais"
        items={[
          { flag: "Storage=", description: "auto (default) / persistent / volatile / none / journal." },
          { flag: "Compress=yes", description: "Comprime entradas grandes (XZ)." },
          { flag: "Seal=yes", description: "Forward Secure Sealing — assina logs." },
          { flag: "SystemMaxUse=", description: "Tamanho total dos arquivos persistentes." },
          { flag: "SystemKeepFree=", description: "Garante essa quantidade de espaço livre no FS." },
          { flag: "MaxRetentionSec=", description: "Tempo máximo de retenção (1week, 30day, 4week...)." },
          { flag: "ForwardToSyslog=", description: "Replica para rsyslog se você tiver instalado." },
          { flag: "MaxLevelStore=", description: "Não armazena abaixo dessa prioridade." },
        ]}
      />

      <h3>Vacuum manual</h3>

      <TerminalBlock command="sudo journalctl --disk-usage" output="Archived and active journals take up 412.8M in the file system." />

      <TerminalBlock
        command="sudo journalctl --vacuum-size=200M"
        output={`Deleted archived journal /var/log/journal/8c2b.../system@00060e7a8...journal (104.9M).
Deleted archived journal /var/log/journal/8c2b.../user-1000@00060e7a8...journal (32.1M).
Vacuuming done, freed 137.0M of archive logs on disk.`}
      />

      <TerminalBlock
        command="sudo journalctl --vacuum-time=2weeks"
        output={`Deleted archived journal /var/log/journal/8c2b.../system@00060e0...journal (28.2M).
Vacuuming done, freed 28.2M of archive logs on disk.`}
      />

      <h2>9. Verificando integridade</h2>

      <TerminalBlock
        command="sudo journalctl --verify"
        output={`PASS: /var/log/journal/8c2b.../system@00060e9...journal
PASS: /var/log/journal/8c2b.../user-1000@00060e9...journal
PASS: /var/log/journal/8c2b.../system.journal`}
      />

      <h2>10. Encaminhar para outras ferramentas</h2>

      <TerminalBlock
        comment="exporta para arquivo .journal"
        command="sudo journalctl --since '1 hour ago' -o export > /tmp/last-hour.journal"
      />

      <TerminalBlock
        comment="importar em outra máquina"
        command="systemd-journal-remote --output=/tmp/copia.journal /tmp/last-hour.journal"
      />

      <AlertBox type="warning" title="Adicionar usuário ao grupo systemd-journal">
        Por padrão, qualquer usuário consegue ver SEUS próprios logs (UID). Para ler todos sem sudo,
        adicione-se ao grupo: <code>sudo usermod -aG systemd-journal $USER</code> e faça login de novo.
      </AlertBox>

      <h2>11. Receitas de ouro</h2>

      <OutputBlock
        title="cheat sheet"
        output={`# o quê está dando errado AGORA
journalctl -p err -b -e
journalctl --failed                              # systemctl --failed também ajuda

# acompanhar serviço
journalctl -fu nginx
journalctl -fu sshd -p warning

# auditoria SSH (últimas 24h)
journalctl -u sshd --since '24 hours ago' -g 'Failed|Accepted'

# por tempo
journalctl --since '2026-03-25 00:00' --until '2026-03-25 12:00'
journalctl --since yesterday

# kernel
journalctl -k -b
journalctl -k -p warning -b

# JSON p/ ferramentas
journalctl -u nginx -n 50 -o json | jq -r .MESSAGE

# limpeza
sudo journalctl --vacuum-time=2weeks
sudo journalctl --vacuum-size=500M`}
      />
    </PageContainer>
  );
}
