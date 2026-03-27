import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Ssh() {
  return (
    <PageContainer
      title="SSH - Secure Shell"
      subtitle="Conecte-se a servidores remotos com segurança, gerencie chaves, configure o servidor SSH e domine tunneling e transferência de arquivos."
      difficulty="intermediario"
      timeToRead="35 min"
    >
      <p>
        O <strong>SSH (Secure Shell)</strong> é o protocolo padrão para acesso remoto seguro a sistemas Linux.
        Toda comunicação é criptografada, tornando-o seguro mesmo em redes públicas. No Arch Linux,
        o pacote utilizado é o <code>openssh</code>, que fornece tanto o cliente (<code>ssh</code>)
        quanto o servidor (<code>sshd</code>).
      </p>

      <h2>1. Instalação do OpenSSH</h2>
      <CodeBlock
        title="Instalando o OpenSSH"
        code={`# Instalar o pacote openssh
sudo pacman -S openssh

# Verificar a versão instalada
ssh -V`}
      />

      <h2>2. Conectando a um Servidor Remoto</h2>
      <p>
        A sintaxe básica do cliente SSH é simples e direta. Você pode conectar usando senha ou chave SSH.
      </p>
      <CodeBlock
        title="Sintaxe básica de conexão"
        code={`# Conectar com usuário padrão (usa o usuário local atual)
ssh servidor.exemplo.com

# Conectar com usuário específico
ssh usuario@servidor.exemplo.com

# Conectar em uma porta diferente (padrão: 22)
ssh -p 2222 usuario@servidor.exemplo.com

# Conectar com verbose para debug de problemas
ssh -v usuario@servidor.exemplo.com

# Executar um comando remoto sem abrir shell interativo
ssh usuario@servidor.exemplo.com "df -h && uptime"

# Manter a conexão ativa com keepalive
ssh -o ServerAliveInterval=60 usuario@servidor.exemplo.com`}
      />

      <h2>3. Geração de Chaves SSH</h2>
      <p>
        Autenticar com chaves SSH é mais seguro e prático do que usar senhas. O par de chaves consiste
        em uma <strong>chave privada</strong> (fica no seu computador) e uma <strong>chave pública</strong>
        (é copiada para o servidor).
      </p>

      <h3>ssh-keygen - Criar par de chaves</h3>
      <CodeBlock
        title="Gerando chaves SSH"
        code={`# Gerar chave Ed25519 (recomendada — moderna e segura)
ssh-keygen -t ed25519 -C "seu@email.com"

# Gerar chave RSA de 4096 bits (compatibilidade ampla)
ssh-keygen -t rsa -b 4096 -C "seu@email.com"

# Durante a geração, você verá:
# Enter file in which to save the key (~/.ssh/id_ed25519): [Enter para padrão]
# Enter passphrase (empty for no passphrase): [senha para proteger a chave]
# Enter same passphrase again: [repita]

# Listar suas chaves existentes
ls ~/.ssh/
# id_ed25519       <- chave privada (NUNCA compartilhe!)
# id_ed25519.pub   <- chave pública (pode compartilhar)
# known_hosts      <- servidores conhecidos
# authorized_keys  <- chaves autorizadas (no servidor)
# config           <- configurações do cliente

# Ver o conteúdo da chave pública
cat ~/.ssh/id_ed25519.pub`}
      />

      <AlertBox type="warning" title="Proteja sua chave privada">
        A chave privada (<code>~/.ssh/id_ed25519</code>) nunca deve ser compartilhada com ninguém.
        Use sempre uma passphrase para protegê-la. As permissões do arquivo também importam:{" "}
        <code>chmod 600 ~/.ssh/id_ed25519</code>.
      </AlertBox>

      <h2>4. Copiando a Chave Pública para o Servidor</h2>
      <CodeBlock
        title="Autorizando sua chave no servidor"
        code={`# Forma automática (mais fácil) — copia a chave para o servidor
ssh-copy-id usuario@servidor.exemplo.com

# Especificar qual chave copiar
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor.exemplo.com

# Em porta não padrão
ssh-copy-id -p 2222 usuario@servidor.exemplo.com

# Forma manual — se ssh-copy-id não estiver disponível
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor.exemplo.com \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Após copiar a chave, teste a conexão (não deve pedir senha)
ssh usuario@servidor.exemplo.com`}
      />

      <h2>5. Configuração do Cliente SSH (~/.ssh/config)</h2>
      <p>
        O arquivo <code>~/.ssh/config</code> permite criar atalhos e configurações personalizadas
        para cada servidor, evitando digitar opções longas toda vez.
      </p>
      <CodeBlock
        title="~/.ssh/config — exemplos práticos"
        code={`# Criar o arquivo de configuração
touch ~/.ssh/config
chmod 600 ~/.ssh/config

# Exemplo de configuração:

# Alias simples para um servidor
Host meuservidor
    HostName 192.168.1.100
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

# Servidor de produção
Host prod
    HostName prod.minhaempresa.com
    User ubuntu
    IdentityFile ~/.ssh/chave_producao
    ServerAliveInterval 60
    ServerAliveCountMax 3

# Configuração global (para todos os hosts)
Host *
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 120

# Após configurar, usar o alias é simples:
ssh meuservidor       # equivale a: ssh -p 2222 deploy@192.168.1.100
ssh prod              # conecta ao servidor de produção`}
      />

      <h2>6. SSH Agent — Gerenciando Chaves com Passphrase</h2>
      <p>
        O <code>ssh-agent</code> armazena sua chave descriptografada em memória, para que você
        não precise digitar a passphrase toda vez que conectar.
      </p>
      <CodeBlock
        title="Usando o ssh-agent"
        code={`# Iniciar o ssh-agent (normalmente já inicia com o sistema)
eval "$(ssh-agent -s)"

# Adicionar sua chave ao agent (pedirá a passphrase uma vez)
ssh-add ~/.ssh/id_ed25519

# Adicionar com tempo de expiração (ex: 8 horas)
ssh-add -t 8h ~/.ssh/id_ed25519

# Listar chaves carregadas no agent
ssh-add -l

# Remover uma chave específica do agent
ssh-add -d ~/.ssh/id_ed25519

# Remover todas as chaves do agent
ssh-add -D

# Para iniciar o agent automaticamente no shell, adicione ao ~/.bashrc ou ~/.zshrc:
# if [ -z "$SSH_AUTH_SOCK" ]; then
#   eval "$(ssh-agent -s)"
#   ssh-add ~/.ssh/id_ed25519 2>/dev/null
# fi`}
      />

      <h2>7. Transferência de Arquivos com SCP e SFTP</h2>
      <h3>SCP — Cópia Segura</h3>
      <CodeBlock
        title="scp — copiar arquivos via SSH"
        code={`# Copiar arquivo local para servidor remoto
scp arquivo.txt usuario@servidor:/home/usuario/

# Copiar para pasta específica
scp relatorio.pdf usuario@servidor:/var/www/html/docs/

# Copiar arquivo do servidor para o local
scp usuario@servidor:/etc/nginx/nginx.conf ./nginx.conf.bak

# Copiar diretório inteiro (recursivo)
scp -r ./meu-projeto/ usuario@servidor:/var/www/

# Em porta não padrão (atenção: -P maiúsculo no scp!)
scp -P 2222 arquivo.txt usuario@servidor:/tmp/

# Mostrar progresso da transferência
scp -v arquivo_grande.iso usuario@servidor:/mnt/storage/`}
      />

      <h3>SFTP — Protocolo Interativo</h3>
      <CodeBlock
        title="sftp — sessão interativa de transferência"
        code={`# Iniciar sessão SFTP
sftp usuario@servidor.exemplo.com

# Comandos dentro do sftp:
sftp> ls                    # listar arquivos remotos
sftp> lls                   # listar arquivos locais
sftp> pwd                   # diretório remoto atual
sftp> lpwd                  # diretório local atual
sftp> cd /var/www           # mudar diretório remoto
sftp> lcd ~/Downloads       # mudar diretório local
sftp> get arquivo.txt       # baixar arquivo
sftp> get -r pasta/         # baixar pasta inteira
sftp> put relatorio.pdf     # enviar arquivo
sftp> put -r ./projeto/     # enviar pasta inteira
sftp> mkdir backup          # criar pasta remota
sftp> rm arquivo_velho.log  # remover arquivo remoto
sftp> bye                   # sair`}
      />

      <h2>8. SSH Tunneling (Port Forwarding)</h2>
      <p>
        O tunneling SSH permite redirecionar portas de forma segura, útil para acessar serviços
        em servidores remotos que não estão expostos diretamente à internet.
      </p>
      <CodeBlock
        title="Tipos de túnel SSH"
        code={`# === TÚNEL LOCAL (Local Port Forwarding) ===
# Acessar serviço remoto como se fosse local
# Acessa banco de dados PostgreSQL remoto na porta local 5433
ssh -L 5433:localhost:5432 usuario@servidor.exemplo.com

# Acessa aplicação web interna da empresa via bastion host
ssh -L 8080:app-interno:80 usuario@bastion.empresa.com

# Mantém o túnel sem abrir shell interativo
ssh -L 8080:localhost:3000 -N usuario@servidor.exemplo.com

# === TÚNEL REMOTO (Remote Port Forwarding) ===
# Expor porta local para o servidor remoto
# Expõe seu servidor local na porta 8080 do servidor remoto
ssh -R 9000:localhost:8080 usuario@servidor.exemplo.com

# === TÚNEL DINÂMICO (SOCKS Proxy) ===
# Criar um proxy SOCKS5 local para rotear tráfego pelo servidor
ssh -D 1080 usuario@servidor.exemplo.com
# Configure seu navegador para usar SOCKS5 em localhost:1080

# === Dica: túnel em background ===
ssh -L 5433:localhost:5432 -N -f usuario@servidor.exemplo.com
# -N = não executa comando    -f = vai para background`}
      />

      <AlertBox type="info" title="Caso de uso comum: banco de dados remoto">
        Use <code>ssh -L 5433:localhost:5432 usuario@servidor.exemplo.com -N</code> para acessar
        um PostgreSQL remoto com seu cliente local (DBeaver, psql, etc.) em <code>localhost:5433</code>,
        sem precisar expor a porta 5432 do servidor na internet.
      </AlertBox>

      <h2>9. Configurando o Servidor SSH (sshd)</h2>
      <p>
        O servidor SSH é configurado em <code>/etc/ssh/sshd_config</code>. Após qualquer alteração,
        reinicie o serviço.
      </p>
      <CodeBlock
        title="Habilitando e gerenciando o sshd"
        code={`# Habilitar e iniciar o serviço SSH
sudo systemctl enable --now sshd

# Verificar status
sudo systemctl status sshd

# Reiniciar após alterar a configuração
sudo systemctl restart sshd

# Verificar se está ouvindo na porta correta
ss -tlnp | grep sshd`}
      />

      <CodeBlock
        title="/etc/ssh/sshd_config — configurações recomendadas"
        code={`# Porta personalizada (reduz tentativas de brute force)
Port 2222

# Endereço a ouvir (deixe assim para ouvir em todas as interfaces)
ListenAddress 0.0.0.0

# Protocolo SSH (apenas versão 2, mais segura)
Protocol 2

# Desabilitar login como root (importante!)
PermitRootLogin no

# Autenticação por senha (desabilite após configurar chaves)
PasswordAuthentication no
PermitEmptyPasswords no

# Autenticação por chave pública (deve estar habilitada)
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Número máximo de tentativas de autenticação
MaxAuthTries 3

# Timeout de conexão sem atividade (segundos)
ClientAliveInterval 300
ClientAliveCountMax 2

# Banir IPs depois de N tentativas (requer fail2ban)
# (configurado no fail2ban, não aqui)

# Limitar quais usuários podem conectar via SSH
AllowUsers usuario1 usuario2

# Ou limitar por grupo
AllowGroups ssh-users sudo`}
      />

      <AlertBox type="warning" title="Antes de desabilitar PasswordAuthentication">
        Certifique-se de que sua chave pública está corretamente instalada em{" "}
        <code>~/.ssh/authorized_keys</code> no servidor <strong>antes</strong> de definir{" "}
        <code>PasswordAuthentication no</code>. Caso contrário, você pode perder o acesso ao servidor.
        Sempre mantenha uma sessão SSH aberta enquanto testa a nova configuração.
      </AlertBox>

      <h2>10. Verificando Logs e Diagnóstico</h2>
      <CodeBlock
        title="Diagnóstico de conexões SSH"
        code={`# === NO CLIENTE ===
# Modo verbose para debug (use -vvv para mais detalhes)
ssh -v usuario@servidor.exemplo.com
ssh -vvv usuario@servidor.exemplo.com

# Testar configuração sem conectar
ssh -G usuario@servidor.exemplo.com | head -20

# === NO SERVIDOR ===
# Ver tentativas de login (bem e malsucedidas)
sudo journalctl -u sshd -f

# Ver últimas conexões
last -n 20

# Ver tentativas de login com falha
sudo journalctl -u sshd | grep "Failed"
sudo journalctl -u sshd | grep "Invalid user"

# Ver conexões ativas agora
ss -tnp | grep :22

# Verificar permissões do authorized_keys (causam falha silenciosa)
ls -la ~/.ssh/
# .ssh deve ser 700 e authorized_keys deve ser 600
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys`}
      />

      <h2>11. Dicas de Segurança</h2>
      <CodeBlock
        title="Boas práticas de segurança SSH"
        code={`# 1. Alterar a porta padrão (obscuridade básica)
#    Edite /etc/ssh/sshd_config: Port 2222

# 2. Usar apenas chaves SSH (sem senha)
#    PasswordAuthentication no

# 3. Instalar e configurar o Fail2Ban (bloqueia IPs com muitas tentativas)
sudo pacman -S fail2ban
sudo systemctl enable --now fail2ban

# 4. Usar chaves Ed25519 (mais modernas e seguras que RSA)
ssh-keygen -t ed25519

# 5. Checar permissões de arquivos SSH no servidor
ls -la ~/.ssh/
# drwx------  .ssh/              (700)
# -rw-------  authorized_keys    (600)
# -rw-------  id_ed25519         (600)
# -rw-r--r--  id_ed25519.pub     (644)

# 6. Verificar chaves autorizadas periodicamente
cat ~/.ssh/authorized_keys

# 7. Usar ssh-audit para checar configuração de segurança do servidor
# (ferramenta de análise)
sudo pacman -S python-paramiko
# ou: pip install ssh-audit`}
      />

      <h2>12. Referências</h2>
      <ul>
        <li>
          <a href="https://wiki.archlinux.org/title/OpenSSH" target="_blank" rel="noopener noreferrer">
            ArchWiki - OpenSSH
          </a>
        </li>
        <li>
          <a href="https://wiki.archlinux.org/title/SSH_keys" target="_blank" rel="noopener noreferrer">
            ArchWiki - SSH keys
          </a>
        </li>
        <li>
          <a href="https://www.openssh.com/manual.html" target="_blank" rel="noopener noreferrer">
            OpenSSH Manual
          </a>
        </li>
        <li>
          <code>man ssh</code>, <code>man sshd_config</code>, <code>man ssh_config</code>,{" "}
          <code>man ssh-keygen</code>
        </li>
      </ul>
    </PageContainer>
  );
}
