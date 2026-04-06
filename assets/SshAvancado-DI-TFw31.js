import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as s}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function h(){return e.jsxs(o,{title:"SSH Avançado",subtitle:"Além do ssh básico — tunnels, port forwarding, jump hosts, autenticação avançada, multiplexação e como transformar SSH em uma ferramenta de rede poderosa.",difficulty:"avancado",timeToRead:"22 min",children:[e.jsx("h2",{children:"Config File: ~/.ssh/config"}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"~/.ssh/config"})," permite criar atalhos e configurações por host, evitando digitar opções longas na linha de comando."]}),e.jsx(s,{title:"~/.ssh/config - Configurações essenciais",code:`# Configurações globais (para todos os hosts)
Host *
    ServerAliveInterval 60      # Enviar keepalive a cada 60s
    ServerAliveCountMax 3       # Desconectar após 3 falhas
    ConnectTimeout 10           # Timeout de conexão
    AddKeysToAgent yes          # Adicionar chaves ao agente SSH
    IdentityFile ~/.ssh/id_ed25519  # Chave padrão

# Host específico - configuração simples
Host meuservidor
    HostName 192.168.1.100
    User admin
    Port 2222
    IdentityFile ~/.ssh/chave_servidor

# Agora você pode conectar assim:
# ssh meuservidor
# Em vez de: ssh -i ~/.ssh/chave_servidor -p 2222 admin@192.168.1.100

# Servidor de produção
Host prod
    HostName prod.empresa.com
    User deploy
    IdentityFile ~/.ssh/id_deploy
    ForwardAgent no             # Não repassar agente (segurança)

# Servidor com VPN (acessível apenas via jump host)
Host servidor-interno
    HostName 10.0.0.50
    User root
    ProxyJump bastion           # Saltar pelo bastion
    # Antes: ProxyCommand ssh bastion -W %h:%p

# Bastion/Jump host
Host bastion
    HostName gateway.empresa.com
    User jump-user
    IdentityFile ~/.ssh/id_bastion`}),e.jsx("h2",{children:"Port Forwarding (Tunneling)"}),e.jsx("h3",{children:"Local Port Forwarding (-L)"}),e.jsx("p",{children:"Redireciona uma porta local para uma porta remota através do SSH. Útil para acessar serviços que rodam no servidor remoto."}),e.jsx(s,{title:"Local Port Forwarding",code:`# Sintaxe:
# ssh -L [local_host:]local_port:remote_host:remote_port user@servidor

# Acessar banco PostgreSQL remoto localmente
ssh -L 5432:localhost:5432 usuario@servidor
# Agora: psql -h localhost -p 5432

# Acessar serviço interno via jump host
# (servidor.interno:8080 só está acessível do servidor)
ssh -L 8080:servidor.interno:8080 usuario@servidor
# Agora: curl http://localhost:8080

# No ~/.ssh/config:
Host servidor-db
    HostName servidor.com
    User deploy
    LocalForward 5432 localhost:5432  # Tunelamento automático

# Manter túnel em background
ssh -N -L 5432:localhost:5432 usuario@servidor &
# -N = não executar comando, apenas manter túnel`}),e.jsx("h3",{children:"Remote Port Forwarding (-R)"}),e.jsx(s,{title:"Remote Port Forwarding",code:`# Expõe uma porta LOCAL no servidor REMOTO
# Sintaxe:
# ssh -R [remote_host:]remote_port:local_host:local_port user@servidor

# Expor sua máquina local na porta 8080 do servidor
ssh -R 8080:localhost:3000 usuario@servidor
# Agora: acesse servidor:8080 e chegará ao seu localhost:3000

# Útil para:
# - Demonstrar app local para cliente (via servidor público)
# - Debug remoto
# - Acesso a rede interna do escritório em casa

# No servidor remoto, habilitar em /etc/ssh/sshd_config:
# GatewayPorts yes     # Permite bindar em 0.0.0.0 em vez de 127.0.0.1`}),e.jsx("h3",{children:"Dynamic Port Forwarding (SOCKS Proxy)"}),e.jsx(s,{title:"SOCKS Proxy via SSH",code:`# Criar proxy SOCKS5 dinâmico
ssh -D 1080 usuario@servidor
# -D = dynamic (SOCKS proxy)

# Agora configure o sistema para usar proxy SOCKS5 em localhost:1080
# No Firefox: Configurações → Rede → Manual proxy → SOCKS5 127.0.0.1:1080

# Com curl:
curl --socks5 localhost:1080 https://ifconfig.me

# No Chrome:
google-chrome --proxy-server="socks5://localhost:1080"

# Em background
ssh -N -D 1080 usuario@servidor &`}),e.jsx("h2",{children:"Jump Hosts (ProxyJump)"}),e.jsx(s,{title:"Saltar por múltiplos hosts",code:`# Conectar via jump host
ssh -J usuario@bastion usuario@servidor-interno

# Múltiplos saltos
ssh -J usuario@jump1,usuario@jump2 usuario@destino

# No ~/.ssh/config:
Host destino-final
    HostName 10.0.0.100
    User root
    ProxyJump bastion1,bastion2

# Testar conectividade via jump host
ssh -J bastion usuario@interno "comando"`}),e.jsx("h2",{children:"Autenticação Avançada"}),e.jsx("h3",{children:"Tipos de Chaves"}),e.jsx(s,{title:"Gerar e gerenciar chaves SSH",code:`# Ed25519 (recomendado - mais seguro e menor)
ssh-keygen -t ed25519 -C "comentario@email.com"

# RSA 4096 bits (compatível com sistemas mais antigos)
ssh-keygen -t rsa -b 4096 -C "comentario@email.com"

# Verificar tipo e impressão digital da chave
ssh-keygen -l -f ~/.ssh/id_ed25519.pub

# Copiar chave pública para servidor (automaticamente)
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor

# Manualmente
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# Chave com passphrase (mais segura)
ssh-keygen -t ed25519 -C "chave-segura" -f ~/.ssh/id_segura
# Será solicitada passphrase ao usar`}),e.jsx("h3",{children:"SSH Agent"}),e.jsx(s,{title:"Gerenciar chaves com ssh-agent",code:`# Iniciar o agente SSH
eval $(ssh-agent -s)

# Adicionar chave ao agente (não precisar digitar passphrase a cada uso)
ssh-add ~/.ssh/id_ed25519

# Listar chaves no agente
ssh-add -l

# Remover chave do agente
ssh-add -d ~/.ssh/id_ed25519

# Remover todas as chaves
ssh-add -D

# Para agente persistente (no ~/.bashrc):
# Muitos ambientes de desktop já iniciam o agente automaticamente
# Para terminal puro:
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/id_ed25519
fi`}),e.jsx("h2",{children:"Multiplexação de Conexão"}),e.jsx(s,{title:"ControlMaster - Reutilizar conexões",code:`# No ~/.ssh/config:
Host *
    ControlMaster auto
    ControlPath ~/.ssh/control/%r@%h:%p
    ControlPersist 10m    # Manter conexão por 10 minutos após sair

# Criar diretório para sockets
mkdir -p ~/.ssh/control

# Benefícios:
# - Segunda conexão SSH para o mesmo host é INSTANTÂNEA
# - Economiza autenticação
# - Melhora performance em git push/pull frequentes

# Verificar conexões multiplexadas ativas
ls ~/.ssh/control/

# Fechar conexão multiplexada
ssh -O exit usuario@servidor`}),e.jsx("h2",{children:"Hardening do Servidor SSH"}),e.jsx(s,{title:"/etc/ssh/sshd_config - Configurações seguras",code:`# Desabilitar login root
PermitRootLogin no

# Usar apenas chaves (sem senha)
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey

# Mudar porta padrão (obscuridade, não segurança real)
Port 2222

# Limitar usuários que podem conectar
AllowUsers usuario1 usuario2 deploy
# Ou por grupo:
AllowGroups ssh-users

# Desabilitar encaminhamento X11 (se não usar)
X11Forwarding no

# Timeout para conexões inativas
ClientAliveInterval 300
ClientAliveCountMax 2

# Limitar tentativas de autenticação
MaxAuthTries 3
MaxSessions 5

# Desabilitar funcionalidades desnecessárias
AllowTcpForwarding yes    # Manter se usar tunneling
AllowAgentForwarding no   # Desabilitar se não usar

# Reiniciar sshd após mudanças
sudo systemctl restart sshd`}),e.jsxs(a,{type:"warning",title:"Teste antes de fechar a sessão!",children:["Após modificar ",e.jsx("code",{children:"/etc/ssh/sshd_config"}),", verifique a configuração com",e.jsx("code",{children:"sudo sshd -t"})," e teste em uma nova janela de terminal ANTES de fechar a sessão atual. Uma configuração errada pode te bloquear do servidor!"]}),e.jsx("h2",{children:"Transferência de Arquivos"}),e.jsx(s,{title:"Copiar arquivos via SSH",code:`# SCP (simples, mas está sendo deprecado)
scp arquivo.txt usuario@servidor:/destino/
scp -r diretorio/ usuario@servidor:/destino/

# SFTP (interativo)
sftp usuario@servidor
# Comandos SFTP:
# ls, cd, get, put, mkdir, rm, quit

# Rsync via SSH (recomendado - eficiente)
rsync -avz arquivo.txt usuario@servidor:/destino/
rsync -avz --progress diretorio/ usuario@servidor:/destino/

# Sincronizar preservando permissões e links
rsync -azvP --delete diretorio/ usuario@servidor:/destino/

# Rsync com chave específica
rsync -avz -e "ssh -i ~/.ssh/chave -p 2222" diretorio/ usuario@servidor:/destino/`})]})}export{h as default};
