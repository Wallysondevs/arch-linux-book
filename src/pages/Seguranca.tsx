import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança"
      subtitle="Firewall, SSH, GPG, criptografia e boas práticas para proteger seu sistema Arch Linux."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <h2>Princípios Básicos de Segurança</h2>
      <p>
        A segurança no Linux é construída em camadas. Nenhuma medida isolada é suficiente,
        mas a combinação delas torna seu sistema robusto:
      </p>
      <ul>
        <li>Manter o sistema atualizado (<code>pacman -Syu</code> regularmente)</li>
        <li>Usar senhas fortes e únicas</li>
        <li>Não usar root desnecessariamente</li>
        <li>Configurar firewall</li>
        <li>Limitar serviços em execução</li>
        <li>Verificar logs regularmente</li>
      </ul>

      <h2>UFW — Firewall Simplificado</h2>
      <p>
        O <code>ufw</code> (Uncomplicated Firewall) é uma interface amigável para o iptables/nftables.
        Perfeito para configurar um firewall rapidamente.
      </p>
      <CodeBlock
        title="Instalar e configurar UFW"
        code={`# Instalar
sudo pacman -S ufw

# Configurar políticas padrão
sudo ufw default deny incoming    # Bloquear tudo que entra
sudo ufw default allow outgoing   # Permitir tudo que sai

# Habilitar o firewall
sudo ufw enable

# Habilitar no boot
sudo systemctl enable ufw`}
      />

      <CodeBlock
        title="Gerenciando regras"
        code={`# Permitir SSH
sudo ufw allow ssh
# ou especificando a porta
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir uma porta específica
sudo ufw allow 8080/tcp

# Permitir range de portas
sudo ufw allow 6000:6007/tcp

# Permitir de um IP específico
sudo ufw allow from 192.168.1.100

# Permitir de uma sub-rede
sudo ufw allow from 192.168.1.0/24

# Permitir de um IP para uma porta específica
sudo ufw allow from 192.168.1.100 to any port 22

# Negar uma porta específica
sudo ufw deny 3306/tcp

# Ver status e regras
sudo ufw status verbose
sudo ufw status numbered

# Remover uma regra por número
sudo ufw delete 3

# Remover uma regra por especificação
sudo ufw delete allow 8080/tcp

# Resetar todas as regras
sudo ufw reset

# Desabilitar temporariamente
sudo ufw disable`}
      />

      <AlertBox type="warning" title="Cuidado ao habilitar remotamente">
        Se você está acessando a máquina via SSH, certifique-se de permitir SSH
        ANTES de habilitar o firewall, ou você perderá o acesso!
      </AlertBox>

      <h2>iptables / nftables — Firewall Avançado</h2>
      <p>
        Para quem precisa de controle mais fino, o <code>iptables</code> (e seu sucessor <code>nftables</code>)
        oferecem controle total sobre o tráfego de rede.
      </p>
      <CodeBlock
        title="Exemplos básicos de iptables"
        code={`# Ver regras atuais
sudo iptables -L -v -n

# Permitir tráfego de loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Permitir conexões estabelecidas
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Bloquear todo o resto
sudo iptables -A INPUT -j DROP

# Salvar regras (para persistir no reboot)
sudo iptables-save > /etc/iptables/iptables.rules
sudo systemctl enable iptables`}
      />

      <h2>SSH — Acesso Remoto Seguro</h2>

      <h3>Gerando Chaves SSH</h3>
      <CodeBlock
        title="Criar e usar chaves SSH"
        code={`# Gerar par de chaves (Ed25519 - recomendado)
ssh-keygen -t ed25519 -C "seu@email.com"

# Ou RSA 4096 bits (compatibilidade máxima)
ssh-keygen -t rsa -b 4096 -C "seu@email.com"

# As chaves são salvas em:
# ~/.ssh/id_ed25519       (chave privada - NUNCA compartilhe!)
# ~/.ssh/id_ed25519.pub   (chave pública - pode compartilhar)

# Copiar chave pública para um servidor
ssh-copy-id usuario@servidor

# Ou manualmente
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor 'cat >> ~/.ssh/authorized_keys'

# Conectar via SSH
ssh usuario@servidor

# Conectar em porta diferente
ssh -p 2222 usuario@servidor

# Copiar arquivo via SSH
scp arquivo.txt usuario@servidor:/caminho/destino/
scp -r pasta/ usuario@servidor:/caminho/destino/`}
      />

      <h3>Hardening do SSH Server</h3>
      <CodeBlock
        title="Editar /etc/ssh/sshd_config"
        language="text"
        code={`# Instalar e habilitar o servidor SSH
# sudo pacman -S openssh
# sudo systemctl enable --now sshd

# Editar configuração
# sudo nano /etc/ssh/sshd_config

# Desabilitar login como root
PermitRootLogin no

# Desabilitar login com senha (usar apenas chaves)
PasswordAuthentication no

# Mudar a porta padrão (reduz ataques automatizados)
Port 2222

# Permitir apenas usuários específicos
AllowUsers seu_usuario

# Limitar tentativas de autenticação
MaxAuthTries 3

# Timeout de sessões inativas
ClientAliveInterval 300
ClientAliveCountMax 2

# Após editar, reiniciar o serviço
# sudo systemctl restart sshd`}
      />

      <AlertBox type="danger" title="Teste antes de desconectar">
        Ao alterar configurações do SSH, sempre abra uma NOVA conexão para testar antes de
        fechar a conexão atual. Se a configuração estiver errada, você ainda tem a sessão
        original para corrigir.
      </AlertBox>

      <h2>GPG — Criptografia e Assinaturas</h2>
      <p>
        O GnuPG (GPG) permite criptografar arquivos, assinar digitalmente e verificar a autenticidade
        de dados. É usado pelo pacman para verificar pacotes.
      </p>

      <CodeBlock
        title="Gerando e gerenciando chaves GPG"
        code={`# Gerar um novo par de chaves
gpg --full-gen-key

# Listar chaves públicas
gpg --list-keys

# Listar chaves privadas
gpg --list-secret-keys

# Exportar chave pública
gpg --armor --export seu@email.com > minha-chave-publica.asc

# Importar chave pública de alguém
gpg --import chave-publica.asc

# Exportar chave privada (backup - PROTEJA esse arquivo!)
gpg --armor --export-secret-keys seu@email.com > minha-chave-privada.asc`}
      />

      <CodeBlock
        title="Criptografar e assinar arquivos"
        code={`# Criptografar arquivo para um destinatário
gpg --encrypt --recipient email@destino.com arquivo.txt
# Resultado: arquivo.txt.gpg

# Descriptografar
gpg --decrypt arquivo.txt.gpg > arquivo.txt

# Criptografar com senha (sem chave pública)
gpg --symmetric arquivo.txt
# Pede uma senha e gera arquivo.txt.gpg

# Assinar um arquivo (prova que foi você quem criou)
gpg --sign arquivo.txt
# Resultado: arquivo.txt.gpg (assinado)

# Assinar sem comprimir (arquivo legível + assinatura)
gpg --clearsign arquivo.txt
# Resultado: arquivo.txt.asc

# Verificar assinatura
gpg --verify arquivo.txt.asc

# Assinar E criptografar
gpg --sign --encrypt --recipient email@destino.com arquivo.txt`}
      />

      <h2>Verificação de Integridade de Arquivos</h2>
      <CodeBlock
        title="Checksums e verificação"
        code={`# Gerar checksums
sha256sum arquivo.iso > arquivo.sha256
md5sum arquivo.iso > arquivo.md5

# Verificar checksum
sha256sum -c arquivo.sha256

# Verificar múltiplos arquivos
sha256sum *.tar.gz > checksums.sha256
sha256sum -c checksums.sha256

# Verificar pacotes instalados (pacman)
pacman -Qkk pacote
# Mostra se algum arquivo do pacote foi modificado`}
      />

      <h2>Atualizações de Segurança</h2>
      <CodeBlock
        title="Manter o sistema seguro"
        code={`# Atualizar TUDO regularmente
sudo pacman -Syu

# Verificar advisories de segurança do Arch
# https://security.archlinux.org/

# Listar pacotes com atualizações pendentes
checkupdates

# Ver quais pacotes foram atualizados recentemente
grep "upgraded" /var/log/pacman.log | tail -20

# Automatizar verificação (com timer do systemd ou cron)
# Não é recomendado automatizar a INSTALAÇÃO de updates
# Apenas a verificação/notificação`}
      />

      <h2>Boas Práticas Gerais</h2>
      <AlertBox type="success" title="Checklist de Segurança">
        <ul>
          <li>Mantenha o sistema sempre atualizado</li>
          <li>Use senhas fortes (considere um gerenciador de senhas)</li>
          <li>Configure o firewall (UFW é o mais fácil)</li>
          <li>Desabilite serviços que não usa</li>
          <li>Use SSH com chaves em vez de senhas</li>
          <li>Verifique logs regularmente com journalctl</li>
          <li>Criptografe dados sensíveis (LUKS para disco, GPG para arquivos)</li>
          <li>Faça backups regulares</li>
          <li>Leia PKGBUILDs antes de instalar do AUR</li>
          <li>Não execute scripts da internet sem ler primeiro</li>
        </ul>
      </AlertBox>

      <CodeBlock
        title="Desabilitar serviços desnecessários"
        code={`# Listar serviços ativos
systemctl list-units --type=service --state=active

# Desabilitar e parar serviços que não usa
sudo systemctl disable --now cups.service     # Impressão
sudo systemctl disable --now avahi-daemon     # Descoberta de rede
sudo systemctl disable --now bluetooth        # Se não usa Bluetooth

# Verificar portas abertas
ss -tulanp | grep LISTEN`}
      />
    </PageContainer>
  );
}
