import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança no Ubuntu"
      subtitle="UFW, Fail2Ban, AppArmor, auditd e boas práticas — hardening completo para Ubuntu Desktop e Server."
      difficulty="avancado"
      timeToRead="30 min"
    >
      <p>
        O Ubuntu tem várias camadas de segurança ativadas por padrão — mais do que a maioria
        das distribuições Linux. Ainda assim, existem configurações importantes a fazer
        especialmente em servidores expostos à internet. Este guia cobre as principais
        ferramentas e práticas de segurança do Ubuntu.
      </p>

      <h2>1. UFW — Firewall Simplificado</h2>
      <p>
        O <strong>UFW</strong> (Uncomplicated Firewall) já vem instalado no Ubuntu e é a
        interface mais simples para gerenciar o iptables/nftables.
      </p>
      <CodeBlock
        title="Configuração completa do UFW"
        code={`# Verificar status
sudo ufw status verbose

# Configurar políticas padrão ANTES de habilitar:
sudo ufw default deny incoming    # Bloquear tudo que entra
sudo ufw default allow outgoing   # Permitir tudo que sai

# Adicionar regras essenciais
sudo ufw allow ssh                # Porta 22 (CRÍTICO: faça isso antes de habilitar!)
sudo ufw allow 80/tcp             # HTTP
sudo ufw allow 443/tcp            # HTTPS

# Habilitar o firewall
sudo ufw enable

# Outras regras úteis:
sudo ufw allow 3306/tcp           # MySQL (apenas se necessário!)
sudo ufw allow from 192.168.1.0/24  # Permitir rede local

# Limitar tentativas de conexão SSH (anti-brute-force básico)
sudo ufw limit ssh

# Ver regras numeradas
sudo ufw status numbered

# Remover regra por número
sudo ufw delete 3

# Remover regra por especificação
sudo ufw delete allow 80/tcp

# Ver log do UFW
sudo tail -f /var/log/ufw.log
sudo grep "UFW BLOCK" /var/log/ufw.log | tail -20

# Desabilitar temporariamente
sudo ufw disable`}
      />

      <AlertBox type="danger" title="Sempre adicione a regra SSH ANTES de habilitar o UFW">
        Se você habilitar o UFW sem adicionar a regra <code>sudo ufw allow ssh</code> primeiro,
        e estiver acessando via SSH, você perderá o acesso ao servidor imediatamente.
        Sem como desfazer remotamente — precisaria de acesso físico ao servidor.
      </AlertBox>

      <h2>2. Fail2Ban — Proteção Contra Brute Force</h2>
      <p>
        O <strong>Fail2Ban</strong> monitora logs do sistema e bane automaticamente IPs que
        fazem muitas tentativas de login falhas — essencial para servidores expostos à internet.
      </p>
      <CodeBlock
        title="Instalar e configurar Fail2Ban"
        code={`# Instalar
sudo apt install fail2ban

# Copiar configuração padrão para customização:
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuração
sudo nano /etc/fail2ban/jail.local

# Configurações importantes no jail.local:
[DEFAULT]
bantime  = 3600      # Banir por 1 hora (em segundos)
findtime = 600       # Janela de tempo para contar tentativas (10 min)
maxretry = 5         # Número de tentativas antes de banir

# Ativar proteção para SSH
[sshd]
enabled = true
port    = ssh
filter  = sshd
backend = systemd
maxretry = 3          # Somente 3 tentativas no SSH
bantime  = 86400      # Banir por 24 horas

# Iniciar e habilitar o serviço:
sudo systemctl enable --now fail2ban

# Ver status e jails ativas:
sudo fail2ban-client status
sudo fail2ban-client status sshd

# Ver IPs banidos:
sudo fail2ban-client status sshd | grep "Banned IP"

# Desbanir um IP manualmente (ex: se você se baniu):
sudo fail2ban-client set sshd unbanip 192.168.1.100

# Ver log do fail2ban:
sudo tail -f /var/log/fail2ban.log`}
      />

      <h2>3. AppArmor — Controle Mandatório de Acesso</h2>
      <p>
        O <strong>AppArmor</strong> é um sistema MAC (Mandatory Access Control) que restringe
        o que programas podem acessar. Já vem ativo no Ubuntu por padrão.
      </p>
      <CodeBlock
        title="Verificando e gerenciando AppArmor"
        code={`# Verificar status do AppArmor
sudo apparmor_status
# ou
aa-status

# Ver todos os perfis carregados
sudo aa-status | grep "profiles are loaded"

# Modos de perfil:
# enforce = perfil aplicado, ações bloqueadas e logadas
# complain = perfil de monitoramento apenas, sem bloquear

# Instalar ferramentas adicionais
sudo apt install apparmor-utils

# Ver perfis disponíveis
ls /etc/apparmor.d/

# Carregar um perfil
sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx

# Colocar perfil em modo de reclamação (para testar sem bloquear)
sudo aa-complain /usr/sbin/nginx

# Colocar em modo enforce (bloqueio real)
sudo aa-enforce /usr/sbin/nginx

# Ver logs do AppArmor
sudo grep apparmor /var/log/syslog | tail -20
sudo journalctl | grep "apparmor" | tail -20`}
      />

      <h2>4. Atualizações de Segurança Automáticas</h2>
      <CodeBlock
        title="Configurar atualizações de segurança automáticas"
        code={`# O Ubuntu tem Unattended Upgrades para patches de segurança automáticos
sudo apt install unattended-upgrades

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades

# Arquivo de configuração principal:
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Configurações importantes:
# Unattended-Upgrade::Allowed-Origins {
#     "\${distro_id}:\${distro_codename}-security";  ← Somente segurança (padrão)
#     "\${distro_id}:\${distro_codename}-updates";   ← Adicionar para updates normais
# };
# Unattended-Upgrade::Automatic-Reboot "false";    ← false = não reiniciar automaticamente
# Unattended-Upgrade::Mail "admin@exemplo.com";    ← Notificação por email

# Testar manualmente (modo seco):
sudo unattended-upgrade --dry-run -d

# Ver o que foi atualizado automaticamente:
cat /var/log/unattended-upgrades/unattended-upgrades.log`}
      />

      <h2>5. Hardening SSH</h2>
      <CodeBlock
        title="Protegendo o servidor SSH"
        code={`# Editar configuração do SSH:
sudo nano /etc/ssh/sshd_config

# Alterações recomendadas de segurança:

# 1. Trocar a porta padrão (22 → outra porta)
Port 2222     # Reduz ataques automatizados

# 2. Proibir login do root via SSH
PermitRootLogin no

# 3. Permitir apenas autenticação por chave
PasswordAuthentication no
PubkeyAuthentication yes

# 4. Limitar o número de tentativas de login
MaxAuthTries 3

# 5. Definir timeout para sessões inativas (segundos)
ClientAliveInterval 300
ClientAliveCountMax 2

# 6. Permitir apenas usuários específicos
AllowUsers joao deploy

# 7. Restringir versão do protocolo
Protocol 2

# Após editar, testar configuração:
sudo sshd -t   # Verificar sintaxe sem reiniciar

# Aplicar mudanças:
sudo systemctl restart ssh

# IMPORTANTE: Mantenha uma sessão SSH aberta durante o teste!
# Abra nova sessão para confirmar que consegue entrar antes de fechar a atual.`}
      />

      <h2>6. GPG — Criptografia de Arquivos</h2>
      <CodeBlock
        title="Criptografando arquivos com GPG"
        code={`# Gerar par de chaves GPG
gpg --gen-key

# Listar chaves
gpg --list-keys
gpg --list-secret-keys

# Exportar chave pública
gpg --export --armor joao@exemplo.com > chave-publica.gpg

# Importar chave pública de alguém
gpg --import chave-publica-maria.gpg

# Criptografar arquivo para um destinatário
gpg --encrypt --recipient maria@exemplo.com arquivo.txt
# Resultado: arquivo.txt.gpg

# Criptografar com senha (sem precisar de par de chaves)
gpg --symmetric arquivo.txt

# Descriptografar
gpg --decrypt arquivo.txt.gpg > arquivo.txt

# Assinar um arquivo (sem criptografar)
gpg --sign arquivo.txt

# Verificar assinatura
gpg --verify arquivo.txt.gpg`}
      />

      <h2>7. Verificar Integridade do Sistema</h2>
      <CodeBlock
        title="Monitorando mudanças no sistema"
        code={`# Instalar AIDE (Advanced Intrusion Detection Environment)
sudo apt install aide

# Inicializar banco de dados de referência
sudo aideinit

# Copiar banco de dados para uso:
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Verificar integridade contra a referência (executar regularmente)
sudo aide --check

# Ver logs de autenticação para atividade suspeita:
sudo grep "sudo" /var/log/auth.log | tail -30
sudo grep "Failed password" /var/log/auth.log | tail -20
sudo grep "Invalid user" /var/log/auth.log | tail -20

# Verificar conexões de rede abertas
sudo ss -tlnp

# Verificar serviços que iniciam no boot
systemctl list-unit-files --state=enabled

# Verificar arquivos com SUID (podem ser explorados)
sudo find / -type f -perm -4000 2>/dev/null`}
      />

      <h2>8. Boas Práticas Gerais de Segurança</h2>
      <AlertBox type="warning" title="Checklist de segurança para servidores Ubuntu">
        <ul className="mt-1 mb-0">
          <li>✓ UFW habilitado com regras mínimas necessárias</li>
          <li>✓ Fail2Ban instalado e protegendo SSH</li>
          <li>✓ Login root SSH desabilitado (PermitRootLogin no)</li>
          <li>✓ Autenticação por chave SSH (PasswordAuthentication no)</li>
          <li>✓ Atualizações de segurança automáticas habilitadas</li>
          <li>✓ AppArmor ativo (vem por padrão no Ubuntu)</li>
          <li>✓ Usuários sem senhas padrão ou fracas</li>
          <li>✓ Revisão regular dos logs de autenticação</li>
          <li>✓ Princípio do menor privilégio (sudo apenas quando necessário)</li>
          <li>✓ Backups regulares e testados</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
