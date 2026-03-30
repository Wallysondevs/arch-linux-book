import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hardening() {
  return (
    <PageContainer
      title="Hardening do Sistema"
      subtitle="Fortaleça a segurança do seu Arch Linux. Reduza a superfície de ataque, configure auditoria, aplique políticas de senha e siga as melhores práticas de segurança."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <h2>Princípios de Hardening</h2>
      <ul>
        <li><strong>Princípio do menor privilégio</strong> — Usuários e processos têm apenas as permissões que precisam</li>
        <li><strong>Reduzir superfície de ataque</strong> — Desabilitar serviços desnecessários</li>
        <li><strong>Defesa em profundidade</strong> — Múltiplas camadas de segurança</li>
        <li><strong>Auditoria</strong> — Registrar e monitorar eventos de segurança</li>
        <li><strong>Atualizações</strong> — Manter sistema sempre atualizado</li>
      </ul>

      <h2>Configurações do Kernel (sysctl)</h2>
      <CodeBlock
        title="/etc/sysctl.d/99-hardening.conf"
        code={`# Criar arquivo de hardening
sudo nano /etc/sysctl.d/99-hardening.conf

# === REDE ===
# Desabilitar IP forwarding (a menos que seja roteador)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Proteção contra SYN flood attacks
net.ipv4.tcp_syncookies = 1

# Ignorar ICMP redirects (man-in-the-middle)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# Não aceitar source-routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Log de pacotes suspeitos (martians)
net.ipv4.conf.all.log_martians = 1

# Proteção contra IP spoofing
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Desabilitar ping (opcional - pode quebrar diagnósticos)
# net.ipv4.icmp_echo_ignore_all = 1

# Aumentar espaço de endereços locais
net.ipv4.ip_local_port_range = 1024 65535

# === KERNEL ===
# Restringir acesso a dmesg (não-root)
kernel.dmesg_restrict = 1

# Ocultar informações do kernel em /proc
kernel.kptr_restrict = 2

# Proteção contra ptrace (debug de processos)
# 1 = apenas usuário pai pode fazer ptrace (recomendado)
# 3 = desabilitar completamente (mais restritivo)
kernel.yama.ptrace_scope = 1

# Randomização de endereços (ASLR)
kernel.randomize_va_space = 2

# Desabilitar SysRq (atalhos de kernel via teclado)
kernel.sysrq = 0

# === MEMÓRIA ===
# Proteger symlinks e hardlinks
fs.protected_symlinks = 1
fs.protected_hardlinks = 1

# Limitar acesso a /proc de outros usuários
fs.protected_fifos = 2
fs.protected_regular = 2

# Aplicar agora (sem reiniciar)
sudo sysctl --system`}
      />

      <h2>Segurança de SSH</h2>
      <CodeBlock
        title="Hardening do servidor SSH"
        code={`sudo nano /etc/ssh/sshd_config

# Configurações recomendadas:
Port 22                         # Mude para outra porta se quiser
Protocol 2                      # Apenas SSHv2
AddressFamily inet              # Apenas IPv4 (se não usar IPv6)

# Autenticação
PermitRootLogin no              # NUNCA login como root
PasswordAuthentication no       # Apenas chaves SSH
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3

# Timeout
LoginGraceTime 60
ClientAliveInterval 300
ClientAliveCountMax 2

# Restrições
AllowUsers usuario1 usuario2    # Apenas usuários específicos
# AllowGroups ssh-users

# Desabilitar funcionalidades não usadas
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no           # Se não precisar de tunneling
PermitTunnel no
GatewayPorts no

# Algoritmos modernos (remover obsoletos)
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
KexAlgorithms curve25519-sha256,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com

# Testar configuração
sudo sshd -t

# Reiniciar SSH
sudo systemctl restart sshd`}
      />

      <h2>Firewall Básico</h2>
      <CodeBlock
        title="Configurar firewall com nftables"
        code={`# /etc/nftables.conf mínimo e seguro
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;

        # Aceitar conexões estabelecidas
        ct state established,related accept
        ct state invalid drop

        # Loopback
        iif "lo" accept

        # ICMP limitado (ping)
        ip protocol icmp icmp type { echo-request } limit rate 5/second accept
        ip6 nexthdr icmpv6 accept

        # SSH apenas da rede local
        ip saddr 192.168.1.0/24 tcp dport 22 accept

        # Log e drop de tudo mais
        log prefix "[nftables DROP]: " flags all
    }

    chain forward {
        type filter hook forward priority filter; policy drop;
    }

    chain output {
        type filter hook output priority filter; policy accept;
    }
}

# Aplicar
sudo nft -f /etc/nftables.conf
sudo systemctl enable nftables`}
      />

      <h2>Permissões e Arquivos Críticos</h2>
      <CodeBlock
        title="Verificar e corrigir permissões"
        code={`# Verificar arquivos SUID (executam como root)
find / -perm -4000 -type f 2>/dev/null
# Exemplo de saída: /usr/bin/passwd, /usr/bin/sudo, etc.

# Verificar arquivos world-writable
find / -perm -002 -type f 2>/dev/null

# Permissões corretas para arquivos críticos
sudo chmod 644 /etc/passwd
sudo chmod 640 /etc/shadow    # Apenas root pode ler
sudo chmod 644 /etc/group
sudo chmod 600 /etc/sudoers   # Apenas root
sudo chmod 700 /root          # Home do root
sudo chmod 600 /etc/ssh/ssh_host_*_key  # Chaves privadas SSH

# Verificar permissões SSH do usuário
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519   # Chaves privadas
chmod 644 ~/.ssh/id_ed25519.pub`}
      />

      <h2>Auditoria com auditd</h2>
      <CodeBlock
        title="Configurar auditoria do sistema"
        code={`# Instalar auditd
sudo pacman -S audit

# Habilitar
sudo systemctl enable --now auditd

# Ver logs de auditoria
sudo ausearch -ts today
sudo ausearch -k auth      # Eventos de autenticação

# Regras de auditoria comuns
# Monitorar mudanças em arquivos críticos
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/shadow -p wa -k shadow_changes
sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes

# Monitorar comandos sudo
sudo auditctl -a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands

# Persistir regras em /etc/audit/rules.d/hardening.rules
sudo nano /etc/audit/rules.d/hardening.rules

# Conteúdo:
-w /etc/passwd -p wa -k passwd_changes
-w /etc/shadow -p wa -k shadow_changes
-w /etc/sudoers -p wa -k sudoers_changes
-w /var/log/auth.log -p wa -k auth_log_changes
-a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands`}
      />

      <h2>Atualizações Automáticas de Segurança</h2>
      <CodeBlock
        title="Manter o sistema atualizado"
        code={`# Atualizar o sistema regularmente
sudo pacman -Syu

# Verificar avisos de segurança do Arch
# https://security.archlinux.org/

# Verificar se pacotes instalados têm vulnerabilidades
sudo pacman -S arch-audit
arch-audit

# Saída:
# nginx is affected by CVE-2024-xxxxx [Medium] [Fixed]
# openssl is affected by CVE-2024-xxxxx [High] [Fixed]

# Automatizar verificação (via systemd timer)
sudo systemctl enable --now arch-audit.timer

# Script de atualização semanal
cat > /etc/systemd/system/weekly-update.service << 'EOF'
[Unit]
Description=Atualização semanal do sistema

[Service]
Type=oneshot
ExecStart=/usr/bin/pacman -Syu --noconfirm
EOF

cat > /etc/systemd/system/weekly-update.timer << 'EOF'
[Unit]
Description=Executar atualização semanal

[Timer]
OnCalendar=weekly
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl enable --now weekly-update.timer`}
      />

      <AlertBox type="info" title="Hardening não é absoluto">
        Segurança é um processo contínuo, não um estado final. Hardening reduz o risco mas
        não o elimina completamente. Combine com: backups regulares, monitoramento,
        atualizações frequentes e educação sobre engenharia social.
      </AlertBox>
    </PageContainer>
  );
}
