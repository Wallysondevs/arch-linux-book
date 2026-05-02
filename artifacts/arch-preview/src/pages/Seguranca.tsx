import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança"
      subtitle="Firewall (ufw, iptables, nftables), fail2ban, SELinux/AppArmor, GPG, auditd e hardening de pacman/SSH com saídas reais."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Extras"
    >
      <h2>Filosofia de Segurança no Arch</h2>
      <p>
        O Arch entrega o sistema <em>cru</em>: sem firewall ativo, sem MAC, sem políticas restritivas.
        Isso é proposital — a segurança é responsabilidade do administrador. Esta página mostra os
        comandos de defesa em camadas, com a saída real de cada um para você reconhecer o que está
        funcionando (ou não) na sua máquina.
      </p>

      <AlertBox type="info" title="Modelo de ameaça primeiro">
        Antes de instalar 10 ferramentas, pergunte: <em>contra o quê</em> você se defende? Um laptop
        pessoal precisa de firewall + disco criptografado. Um servidor exposto precisa de fail2ban,
        SSH hardening e auditoria. Defesas sem propósito viram falsa sensação de segurança.
      </AlertBox>

      <h2>UFW — Firewall Simplificado</h2>
      <p>
        O <code>ufw</code> é um <em>frontend</em> para o backend de firewall do kernel (iptables ou
        nftables). Ideal para desktops e servidores simples.
      </p>

      <TerminalBlock
        comment="Instalar e configurar políticas padrão"
        command="sudo pacman -S --needed ufw && sudo systemctl enable --now ufw.service"
        output={`{g}resolving dependencies...{/}
{g}looking for conflicting packages...{/}

Packages (1) ufw-0.36.2-3

Total Installed Size:  865.42 KiB

:: Proceed with installation? [Y/n] 
(1/1) installing ufw                            [######################] 100%
{g}Created symlink /etc/systemd/system/multi-user.target.wants/ufw.service → /usr/lib/systemd/system/ufw.service.{/}`}
      />

      <TerminalBlock
        comment="Definir políticas padrão (deny in, allow out) e habilitar"
        command={`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable`}
        output={`Default incoming policy changed to 'deny'
(be sure to update your rules accordingly)
Default outgoing policy changed to 'allow'
(be sure to update your rules accordingly)
Rules updated
Rules updated (v6)
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup`}
      />

      <AlertBox type="danger" title="Liberte o SSH ANTES de habilitar">
        Se você está num servidor remoto e habilita o ufw sem permitir <code>ssh</code> primeiro,
        sua sessão atual continua viva mas <strong>a próxima conexão será bloqueada</strong>. Sempre
        rode <code>sudo ufw allow 22/tcp</code> antes de <code>ufw enable</code>.
      </AlertBox>

      <h3>ufw status verbose — leitura linha-a-linha</h3>
      <OutputBlock
        title="sudo ufw status verbose"
        output={`{bold}Status: active{/}
{bold}Logging: on (low){/}
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)`}
        annotations={[
          { line: 0, note: "firewall ativo no boot" },
          { line: 1, note: "log ativo, nível low" },
          { line: 2, note: "políticas padrão" },
          { line: 6, note: "cabeçalho da tabela" },
          { line: 8, note: "porta destino, ação, origem" },
        ]}
      />

      <h3>Regras avançadas com ufw</h3>
      <TerminalBlock
        command={`sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp
sudo ufw limit ssh
sudo ufw deny from 203.0.113.45
sudo ufw status numbered`}
        output={`Rule added
Rule updated
Rules updated
Rule added

Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    192.168.1.0/24
[ 2] 22/tcp                     LIMIT IN    Anywhere
[ 3] Anywhere                   DENY IN     203.0.113.45
[ 4] 80/tcp                     ALLOW IN    Anywhere`}
      />

      <CommandFlagList
        command="ufw"
        items={[
          { flag: "enable", description: "Ativa o firewall e configura para iniciar no boot.", example: "sudo ufw enable" },
          { flag: "disable", description: "Desativa o firewall (regras permanecem salvas).", example: "sudo ufw disable" },
          { flag: "allow", description: "Permite tráfego para uma porta/serviço/origem.", example: "sudo ufw allow 80/tcp" },
          { flag: "deny", description: "Bloqueia silenciosamente o tráfego.", example: "sudo ufw deny 23" },
          { flag: "reject", description: "Bloqueia E envia ICMP rejection (mais educado).", example: "sudo ufw reject 25" },
          { flag: "limit", description: "Bloqueia IPs que tentam mais de 6 conexões em 30s — ideal para SSH.", example: "sudo ufw limit ssh" },
          { flag: "status verbose", description: "Mostra todas as regras com políticas padrão e logging.", example: "sudo ufw status verbose" },
          { flag: "status numbered", description: "Lista regras numeradas para deletar por índice.", example: "sudo ufw delete 3" },
          { flag: "reset", description: "Apaga TODAS as regras e desativa. Use com cuidado.", example: "sudo ufw reset" },
        ]}
      />

      <h2>iptables — o backend clássico</h2>
      <p>
        O <code>iptables</code> manipula diretamente as tabelas do <em>netfilter</em>. Ainda muito
        usado em scripts antigos e containers. No Arch moderno, considere <code>nftables</code>.
      </p>

      <TerminalBlock
        comment="Listar TODAS as regras com contadores e sem resolver DNS"
        command="sudo iptables -L -n -v --line-numbers"
        output={`Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination         
1    12483  1.4M ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
2     8721 9234K ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            ctstate RELATED,ESTABLISHED
3       42  2520 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
4        0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0           

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 8924 packets, 1248K bytes)
num   pkts bytes target     prot opt in     out     source               destination         `}
      />

      <OutputBlock
        title="Anatomia de uma linha"
        output={`num   pkts bytes target  prot opt in     out     source        destination
3       42  2520 ACCEPT  tcp  --  *      *       0.0.0.0/0     0.0.0.0/0     tcp dpt:22`}
        annotations={[
          { line: 0, note: "cabeçalho" },
          { line: 1, note: "regra #3: 42 pacotes TCP destino porta 22 → ACEITAR" },
        ]}
      />

      <h3>nftables — substituto moderno</h3>
      <TerminalBlock
        command="sudo nft list ruleset"
        output={`table inet filter {
	chain input {
		type filter hook input priority filter; policy drop;
		iif "lo" accept
		ct state established,related accept
		tcp dport 22 accept comment "SSH"
		tcp dport { 80, 443 } accept comment "HTTP/HTTPS"
		ct state invalid drop
		log prefix "nft drop: " limit rate 5/minute
	}
	chain forward {
		type filter hook forward priority filter; policy drop;
	}
	chain output {
		type filter hook output priority filter; policy accept;
	}
}`}
      />

      <AlertBox type="info" title="ufw vs iptables vs nftables">
        Use <code>ufw</code> em desktops/laptops. Use <code>nftables</code> direto em servidores
        novos. Use <code>iptables</code> apenas se mantém scripts legados ou trabalha com
        Docker/k8s antigos. Não rode os três ao mesmo tempo.
      </AlertBox>

      <h2>fail2ban — banir tentativas de força bruta</h2>
      <TerminalBlock
        command="sudo pacman -S --needed fail2ban && sudo systemctl enable --now fail2ban"
        output={`Packages (1) fail2ban-1.1.0-2

(1/1) installing fail2ban                       [######################] 100%
:: Running post-transaction hooks...
(1/2) Reloading system manager configuration...
(2/2) Creating temporary files...
{g}Created symlink /etc/systemd/system/multi-user.target.wants/fail2ban.service → /usr/lib/systemd/system/fail2ban.service.{/}`}
      />

      <CodeBlock
        title="/etc/fail2ban/jail.local — proteção SSH"
        language="ini"
        code={`[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s`}
      />

      <TerminalBlock
        command="sudo fail2ban-client status sshd"
        output={`{c}Status for the jail: sshd{/}
|- Filter
|  |- Currently failed: 2
|  |- Total failed:     287
|  \`- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd
\`- Actions
   |- Currently banned: 4
   |- Total banned:     19
   \`- Banned IP list:   {r}45.227.255.190 193.32.162.135 218.92.0.45 91.92.247.7{/}`}
      />

      <h2>SSH — Hardening e Verificação</h2>

      <CodeBlock
        title="/etc/ssh/sshd_config.d/00-hardening.conf"
        language="text"
        code={`PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30
AllowUsers seu_usuario
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding no
Protocol 2`}
      />

      <TerminalBlock
        comment="Validar a config ANTES de reiniciar (evita ficar trancado fora)"
        command="sudo sshd -t && sudo systemctl reload sshd"
        output={``}
      />

      <TerminalBlock
        comment="ssh-audit — auditoria das cifras e algoritmos negociados"
        command="ssh-audit localhost"
        output={`# general
(gen) banner: SSH-2.0-OpenSSH_9.6
(gen) software: OpenSSH 9.6
(gen) compatibility: OpenSSH 7.4+, Dropbear SSH 2018.76+
(gen) compression: enabled (zlib@openssh.com)

# key exchange algorithms
(kex) sntrup761x25519-sha512@openssh.com -- {g}[info] available since OpenSSH 8.5{/}
(kex) curve25519-sha256                  -- {g}[info] available since OpenSSH 7.4{/}
(kex) diffie-hellman-group14-sha256      -- {y}[warn] 2048-bit modulus only{/}

# encryption algorithms (ciphers)
(enc) chacha20-poly1305@openssh.com      -- {g}[info] default cipher{/}
(enc) aes128-ctr                         -- {y}[warn] using weaker block size (128 bits){/}

# additional info
(nfo) For hardening guide: https://www.ssh-audit.com/hardening_guides.html`}
      />

      <h2>GPG — Criptografia e Assinaturas</h2>

      <TerminalBlock
        command="gpg --list-keys"
        output={`/home/user/.gnupg/pubring.kbx
-----------------------------
pub   ed25519 2024-03-12 [SC] [expires: 2027-03-12]
      4A2F8B91C3D7E5F09B4C2A6E5D8F0123456789AB
uid           [ultimate] Você <voce@example.com>
sub   cv25519 2024-03-12 [E] [expires: 2027-03-12]

pub   rsa4096 2023-11-08 [SC]
      ABCDEF1234567890ABCDEF1234567890ABCDEF12
uid           [  full  ] Arch Linux <pierre@archlinux.org>`}
      />

      <TerminalBlock
        comment="Cifrar e assinar para um destinatário"
        command="gpg --sign --encrypt --recipient amigo@example.com relatorio.pdf"
        output={`gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   2  trust: 0-, 0q, 0n, 0m, 0f, 1u
File "relatorio.pdf.gpg" exists. Overwrite? (y/N) y`}
      />

      <h3>pacman-key — gerenciamento das chaves do Arch</h3>
      <TerminalBlock
        command="sudo pacman-key --list-sigs --keyring /etc/pacman.d/gnupg/pubring.gpg | head -20"
        output={`pub   rsa3072 2023-09-01 [SC] [expires: 2026-09-01]
      3056513887B78AEB
uid           [ unknown] Arch Linux Pacman Keyring Master Key
sig 3        3056513887B78AEB 2023-09-01  Arch Linux Pacman Keyring Master Key
sig          ABAF11C65A2970B1 2023-09-15  Pierre Schmitz <pierre@archlinux.de>
sig          4AA4767BBC9C4B1D 2023-09-15  Levente Polyak (anthraxx) <levente@leventepolyak.net>
sig          E4538D4D6B30F0A1 2023-09-15  Christian Hesse (eworm) <eworm@archlinux.org>`}
      />

      <h2>Auditoria — auditd</h2>
      <TerminalBlock
        command="sudo systemctl status auditd --no-pager"
        output={`{g}● auditd.service{/} - Security Auditing Service
     Loaded: loaded (/usr/lib/systemd/system/auditd.service; enabled)
     Active: {g}active (running){/} since Mon 2025-01-13 08:14:02 -03; 4h ago
   Main PID: 412 (auditd)
      Tasks: 2 (limit: 18996)
     Memory: 1.4M
        CPU: 38ms
     CGroup: /system.slice/auditd.service
             └─412 /usr/sbin/auditd`}
      />

      <TerminalBlock
        command={`sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -l`}
        output={`-w /etc/passwd -p wa -k passwd_changes`}
      />

      <TerminalBlock
        command="sudo ausearch -k passwd_changes -ts recent | head -8"
        output={`time->Mon Jan 13 12:18:42 2025
type=PROCTITLE msg=audit(1736784522.118:421): proctitle="useradd" "alice"
type=PATH msg=audit(1736784522.118:421): item=0 name="/etc/passwd" inode=131278 mode=0100644 ouid=0 ogid=0 rdev=00:00 nametype=NORMAL
type=CWD msg=audit(1736784522.118:421): cwd="/root"
type=SYSCALL msg=audit(1736784522.118:421): arch=c000003e syscall=257 success=yes exit=4 a0=ffffff9c a1=7fff5b... uid=0 auid=1000 tty=pts0 ses=2 comm="useradd" exe="/usr/sbin/useradd" key="passwd_changes"`}
      />

      <h2>MAC — AppArmor (Arch) e SELinux</h2>
      <p>
        O Arch suporta AppArmor (mais simples) ou SELinux (mais granular). AppArmor é o caminho
        recomendado por exigir menos configuração.
      </p>

      <TerminalBlock
        command="sudo aa-status"
        output={`apparmor module is loaded.
17 profiles are loaded.
14 profiles are in enforce mode.
   /usr/bin/firefox
   /usr/bin/man
   /usr/bin/evince
   /usr/sbin/cups-browsed
   /usr/sbin/cupsd
   ...
3 profiles are in complain mode.
   /usr/bin/thunderbird
2 processes have profiles defined.
2 processes are in enforce mode.
   /usr/bin/firefox (4218)
   /usr/sbin/cupsd (612)
0 processes are in complain mode.
0 processes are unconfined but have a profile defined.`}
      />

      <TerminalBlock
        command="getenforce  # SELinux (não vem por padrão no Arch)"
        output={`bash: getenforce: command not found`}
        exitCode={127}
      />

      <h2>Verificação de Integridade</h2>

      <TerminalBlock
        command="sha256sum archlinux-2025.01.01-x86_64.iso"
        output={`{c}f5e6e1bcfd6e2a9c4a4f1f8a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c{/}  archlinux-2025.01.01-x86_64.iso`}
      />

      <TerminalBlock
        comment="Comparar contra arquivo de checksums oficiais"
        command="sha256sum -c sha256sums.txt --ignore-missing"
        output={`archlinux-2025.01.01-x86_64.iso: {g}OK{/}`}
      />

      <TerminalBlock
        comment="Verificar se algum arquivo de pacote instalado foi modificado"
        command="sudo pacman -Qkk 2>&1 | grep -v '0 altered' | head"
        output={`warning: openssh: /etc/ssh/sshd_config (Modification time mismatch)
backup file: /etc/ssh/sshd_config (Permission mismatch, expected 644)
openssh: 415 total files, 2 altered files`}
      />

      <h2>Senhas e PAM</h2>
      <TerminalBlock
        command="sudo passwd alice"
        output={`New password: 
Retype new password: 
{g}passwd: password updated successfully{/}`}
      />

      <CodeBlock
        title="/etc/security/pwquality.conf — política de senha"
        language="ini"
        code={`minlen = 12
minclass = 3
maxrepeat = 3
maxclassrepeat = 4
gecoscheck = 1
dictcheck = 1
enforce_for_root`}
      />

      <h2>Resumindo — checklist real</h2>
      <AlertBox type="success" title="Hardening mínimo de um Arch">
        <ul>
          <li><strong>Atualize</strong>: <code>sudo pacman -Syu</code> semanalmente.</li>
          <li><strong>Firewall ativo</strong>: <code>sudo ufw enable</code> com SSH liberado.</li>
          <li><strong>SSH só por chave</strong>: <code>PasswordAuthentication no</code>.</li>
          <li><strong>fail2ban</strong>: jail sshd habilitado.</li>
          <li><strong>Disco cifrado</strong>: LUKS na instalação (ou pelo menos <code>/home</code>).</li>
          <li><strong>AppArmor</strong>: pelo menos perfis de browser/PDF em enforce.</li>
          <li><strong>Backups</strong>: testados (<code>borg</code>, <code>restic</code>, <code>rsync</code>).</li>
          <li><strong>Monitoria</strong>: <code>journalctl -p err -b</code> e <code>systemctl --failed</code> diariamente.</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
