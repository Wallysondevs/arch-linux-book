import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(o,{title:"SSH - Secure Shell",subtitle:"Conecte-se a servidores remotos com segurança, gerencie chaves, configure o servidor SSH, firewall e domine tunneling e transferência de arquivos.",difficulty:"intermediario",timeToRead:"45 min",children:[e.jsxs("p",{children:["O ",e.jsx("strong",{children:"SSH (Secure Shell)"})," é o protocolo padrão para acesso remoto seguro a sistemas Linux. Toda comunicação é criptografada, tornando-o seguro mesmo em redes públicas. No Arch Linux, o pacote utilizado é o ",e.jsx("code",{children:"openssh"}),", que fornece tanto o cliente (",e.jsx("code",{children:"ssh"}),") quanto o servidor (",e.jsx("code",{children:"sshd"}),")."]}),e.jsx("h2",{children:"1. Instalação do OpenSSH"}),e.jsx(a,{title:"Instalando o OpenSSH",code:`# Instalar o pacote openssh
sudo pacman -S openssh

# Verificar a versão instalada
ssh -V`}),e.jsx("h2",{children:"2. Conectando a um Servidor Remoto"}),e.jsx("p",{children:"A sintaxe básica do cliente SSH é simples e direta. Você pode conectar usando senha ou chave SSH."}),e.jsx(a,{title:"Sintaxe básica de conexão",code:`# Conectar com usuário padrão (usa o usuário local atual)
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
ssh -o ServerAliveInterval=60 usuario@servidor.exemplo.com`}),e.jsx("h2",{children:"3. Geração de Chaves SSH"}),e.jsxs("p",{children:["Autenticar com chaves SSH é mais seguro e prático do que usar senhas. O par de chaves consiste em uma ",e.jsx("strong",{children:"chave privada"})," (fica no seu computador) e uma ",e.jsx("strong",{children:"chave pública"}),"(é copiada para o servidor)."]}),e.jsx("h3",{children:"ssh-keygen - Criar par de chaves"}),e.jsx(a,{title:"Gerando chaves SSH",code:`# Gerar chave Ed25519 (recomendada — moderna e segura)
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
cat ~/.ssh/id_ed25519.pub`}),e.jsxs(s,{type:"warning",title:"Proteja sua chave privada",children:["A chave privada (",e.jsx("code",{children:"~/.ssh/id_ed25519"}),") nunca deve ser compartilhada com ninguém. Use sempre uma passphrase para protegê-la. As permissões do arquivo também importam:"," ",e.jsx("code",{children:"chmod 600 ~/.ssh/id_ed25519"}),"."]}),e.jsx("h2",{children:"4. Como Funciona o authorized_keys — Uma Máquina Confiando na Outra"}),e.jsx("p",{children:'Esse é o conceito central da autenticação SSH por chave. Entender isso elimina toda a "mágica":'}),e.jsxs("p",{children:["Quando você gera um par de chaves, obtém dois arquivos: a ",e.jsx("strong",{children:"chave privada"})," (fica só com você) e a ",e.jsx("strong",{children:"chave pública"})," (pode ser distribuída livremente). A chave pública é como um cadeado aberto — qualquer um pode ter o cadeado, mas só quem tem a chave privada consegue fechá-lo e abri-lo."]}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"~/.ssh/authorized_keys"}),' no servidor é uma lista de "cadeados" (chaves públicas) que aquele servidor aceita. Quando você tenta se conectar, o servidor propõe um desafio matemático que só pode ser resolvido por quem possui a chave privada correspondente a uma das chaves públicas da lista. Se você resolver corretamente — sem precisar enviar a chave privada pela rede — o acesso é concedido.']}),e.jsx(a,{title:"Entendendo o authorized_keys na prática",code:`# === NO SERVIDOR (máquina que vai receber conexões) ===

# Ver quais chaves estão autorizadas a conectar
cat ~/.ssh/authorized_keys

# Cada linha é uma chave pública de uma máquina autorizada:
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... usuario@maquina-a
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5BBBB... usuario@maquina-b
# ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB... deploy@ci-server

# Cada linha representa uma máquina diferente que tem acesso!
# Para REVOGAR o acesso de uma máquina, basta apagar a linha dela.

# === FLUXO COMPLETO: Autorizar a máquina A a conectar na máquina B ===

# PASSO 1 — Na máquina A: gerar a chave (se ainda não tiver)
ssh-keygen -t ed25519 -C "maquina-a"

# PASSO 2 — Na máquina A: ver a chave pública gerada
cat ~/.ssh/id_ed25519.pub
# Resultado: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... usuario@maquina-a

# PASSO 3 — Na máquina B: adicionar a chave pública da máquina A
# (crie o arquivo se não existir)
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... usuario@maquina-a" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# PASSO 4 — Na máquina A: testar a conexão (não deve pedir senha)
ssh usuario@maquina-b

# === Casos de uso comuns ===
# - Servidor de CI/CD fazendo deploy automaticamente em produção
# - Script de backup conectando via cron sem interação humana
# - Máquina de desenvolvimento acessando servidor sem digitar senha
# - Múltiplos devs com suas próprias chaves no mesmo servidor`}),e.jsxs(s,{type:"info",title:"Por que isso é mais seguro que senha?",children:["Com senha, ela trafega pela rede (criptografada, mas ainda existe). Com chave SSH,"," ",e.jsx("strong",{children:"a chave privada nunca sai da sua máquina"}),". O servidor só verifica se você consegue resolver um desafio matemático — sem a chave privada, é impossível. Mesmo que alguém intercepte a comunicação, não obtém nada útil."]}),e.jsx("h2",{children:"5. Copiando a Chave Pública para o Servidor"}),e.jsx(a,{title:"Autorizando sua chave no servidor",code:`# Forma automática (mais fácil) — faz os passos 3 e 4 automaticamente
ssh-copy-id usuario@servidor.exemplo.com

# Especificar qual chave copiar
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor.exemplo.com

# Em porta não padrão
ssh-copy-id -p 2222 usuario@servidor.exemplo.com

# Forma manual — se ssh-copy-id não estiver disponível
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor.exemplo.com   "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Após copiar a chave, teste a conexão (não deve pedir senha)
ssh usuario@servidor.exemplo.com`}),e.jsx("h2",{children:"6. Configuração do Cliente SSH (~/.ssh/config)"}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"~/.ssh/config"})," permite criar atalhos e configurações personalizadas para cada servidor, evitando digitar opções longas toda vez."]}),e.jsx(a,{title:"~/.ssh/config — exemplos práticos",code:`# Criar o arquivo de configuração
touch ~/.ssh/config
chmod 600 ~/.ssh/config

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
ssh prod              # conecta ao servidor de produção`}),e.jsx("h2",{children:"7. SSH Agent — Gerenciando Chaves com Passphrase"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"ssh-agent"})," armazena sua chave descriptografada em memória, para que você não precise digitar a passphrase toda vez que conectar."]}),e.jsx(a,{title:"Usando o ssh-agent",code:`# Iniciar o ssh-agent (normalmente já inicia com o sistema)
eval "$(ssh-agent -s)"

# Adicionar sua chave ao agent (pedirá a passphrase uma vez)
ssh-add ~/.ssh/id_ed25519

# Adicionar com tempo de expiração (ex: 8 horas)
ssh-add -t 8h ~/.ssh/id_ed25519

# Listar chaves carregadas no agent
ssh-add -l

# Remover todas as chaves do agent
ssh-add -D

# Para iniciar o agent automaticamente no shell, adicione ao ~/.bashrc ou ~/.zshrc:
# if [ -z "$SSH_AUTH_SOCK" ]; then
#   eval "$(ssh-agent -s)"
#   ssh-add ~/.ssh/id_ed25519 2>/dev/null
# fi`}),e.jsx("h2",{children:"8. Transferência de Arquivos com SCP e SFTP"}),e.jsx("h3",{children:"SCP — Cópia Segura"}),e.jsx(a,{title:"scp — copiar arquivos via SSH",code:`# Copiar arquivo local para servidor remoto
scp arquivo.txt usuario@servidor:/home/usuario/

# Copiar arquivo do servidor para o local
scp usuario@servidor:/etc/nginx/nginx.conf ./nginx.conf.bak

# Copiar diretório inteiro (recursivo)
scp -r ./meu-projeto/ usuario@servidor:/var/www/

# Em porta não padrão (atenção: -P maiúsculo no scp!)
scp -P 2222 arquivo.txt usuario@servidor:/tmp/`}),e.jsx("h3",{children:"SFTP — Protocolo Interativo"}),e.jsx(a,{title:"sftp — sessão interativa de transferência",code:`# Iniciar sessão SFTP
sftp usuario@servidor.exemplo.com

# Comandos dentro do sftp:
sftp> ls                    # listar arquivos remotos
sftp> get arquivo.txt       # baixar arquivo
sftp> get -r pasta/         # baixar pasta inteira
sftp> put relatorio.pdf     # enviar arquivo
sftp> put -r ./projeto/     # enviar pasta inteira
sftp> bye                   # sair`}),e.jsx("h2",{children:"9. SSH Tunneling (Port Forwarding)"}),e.jsx(a,{title:"Tipos de túnel SSH",code:`# === TÚNEL LOCAL — acessar serviço remoto como se fosse local ===
# Acessa PostgreSQL remoto pela porta local 5433
ssh -L 5433:localhost:5432 usuario@servidor.exemplo.com

# Mantém o túnel sem abrir shell interativo
ssh -L 8080:localhost:3000 -N usuario@servidor.exemplo.com

# === TÚNEL REMOTO — expor porta local para o servidor remoto ===
ssh -R 9000:localhost:8080 usuario@servidor.exemplo.com

# === TÚNEL DINÂMICO — proxy SOCKS5 ===
ssh -D 1080 usuario@servidor.exemplo.com

# === Túnel em background ===
ssh -L 5433:localhost:5432 -N -f usuario@servidor.exemplo.com`}),e.jsx("h2",{children:"10. Configurando o Servidor SSH (sshd)"}),e.jsx(a,{title:"Habilitando e gerenciando o sshd",code:`# Habilitar e iniciar o serviço SSH
sudo systemctl enable --now sshd

# Verificar status
sudo systemctl status sshd

# Reiniciar após alterar a configuração
sudo systemctl restart sshd`}),e.jsx(a,{title:"/etc/ssh/sshd_config — configurações recomendadas",code:`# Porta personalizada (reduz tentativas de brute force)
Port 2222

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

# Limitar quais usuários podem conectar via SSH
AllowUsers usuario1 usuario2`}),e.jsxs(s,{type:"warning",title:"Antes de desabilitar PasswordAuthentication",children:["Certifique-se de que sua chave pública está corretamente instalada em"," ",e.jsx("code",{children:"~/.ssh/authorized_keys"})," no servidor ",e.jsx("strong",{children:"antes"})," de definir"," ",e.jsx("code",{children:"PasswordAuthentication no"}),". Sempre mantenha uma sessão SSH aberta enquanto testa a nova configuração."]}),e.jsx("h2",{children:"11. Firewall — Liberando a Porta SSH"}),e.jsxs("p",{children:["Se o servidor tiver um firewall ativo, a porta SSH precisa estar explicitamente liberada. No Arch Linux, as ferramentas mais comuns são ",e.jsx("code",{children:"ufw"})," (mais simples) e"," ",e.jsx("code",{children:"nftables"})," / ",e.jsx("code",{children:"iptables"})," (mais avançados)."]}),e.jsx("h3",{children:"UFW — Uncomplicated Firewall (recomendado para iniciantes)"}),e.jsx(a,{title:"Gerenciando o firewall com ufw",code:`# Instalar o UFW
sudo pacman -S ufw

# Habilitar o UFW (ative DEPOIS de liberar o SSH, senão perde acesso!)
sudo ufw enable

# Ver status atual e regras ativas
sudo ufw status verbose

# === Liberar SSH ===
# Porta padrão 22
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Porta personalizada (ex: 2222)
sudo ufw allow 2222/tcp

# Liberar SSH apenas de um IP específico (mais seguro)
sudo ufw allow from 192.168.1.50 to any port 22

# Liberar SSH de uma rede inteira
sudo ufw allow from 192.168.1.0/24 to any port 22

# === Bloquear ===
# Bloquear acesso SSH de um IP específico
sudo ufw deny from 203.0.113.10 to any port 22

# Remover uma regra
sudo ufw delete allow 22/tcp

# Desabilitar o UFW (libera tudo)
sudo ufw disable

# Recarregar regras
sudo ufw reload`}),e.jsx("h3",{children:"nftables — Firewall nativo do Linux moderno"}),e.jsx(a,{title:"Gerenciando o firewall com nftables",code:`# Verificar se o nftables está rodando
sudo systemctl status nftables

# Ver regras ativas
sudo nft list ruleset

# Liberar a porta SSH (22) — adicionar regra na tabela inet
sudo nft add rule inet filter input tcp dport 22 accept

# Liberar porta personalizada (ex: 2222)
sudo nft add rule inet filter input tcp dport 2222 accept

# Salvar regras para persistir após reinicialização
sudo nft list ruleset > /etc/nftables.conf
sudo systemctl enable nftables`}),e.jsx("h3",{children:"iptables — Firewall legado (ainda muito usado)"}),e.jsx(a,{title:"Gerenciando o firewall com iptables",code:`# Ver regras ativas
sudo iptables -L -n -v

# Liberar a porta SSH (22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Liberar porta personalizada (ex: 2222)
sudo iptables -A INPUT -p tcp --dport 2222 -j ACCEPT

# Liberar SSH apenas de um IP específico
sudo iptables -A INPUT -p tcp -s 192.168.1.50 --dport 22 -j ACCEPT

# Salvar regras (instale iptables-nft ou iptables-persist)
sudo pacman -S iptables
sudo iptables-save > /etc/iptables/iptables.rules
sudo systemctl enable iptables`}),e.jsxs(s,{type:"warning",title:"Cuidado ao ativar o firewall remotamente",children:["Se você estiver conectado via SSH e ativar o firewall sem liberar a porta 22 primeiro,"," ",e.jsx("strong",{children:"você perderá o acesso ao servidor imediatamente"}),". Sempre libere a porta SSH"," ",e.jsx("em",{children:"antes"})," de habilitar o firewall. Em caso de dúvida, use:"," ",e.jsx("code",{children:"sudo ufw allow ssh && sudo ufw enable"})]}),e.jsx("h2",{children:"12. Verificando Portas e Conectividade"}),e.jsx("p",{children:"Quando o SSH não conecta, o problema pode ser: serviço parado, porta bloqueada pelo firewall, ou porta errada. Use essas ferramentas para diagnosticar."}),e.jsx("h3",{children:"No próprio servidor — checar se o sshd está ouvindo"}),e.jsx(a,{title:"Verificar portas abertas no servidor",code:`# Ver todas as portas TCP em escuta (LISTEN)
ss -tlnp
# ou equivalente mais antigo:
netstat -tlnp

# Filtrar apenas a porta do SSH
ss -tlnp | grep sshd
# Saída esperada:
# LISTEN  0  128  0.0.0.0:22  0.0.0.0:*  users:(("sshd",pid=1234,fd=3))

# Verificar se está ouvindo em IPv4 e IPv6
ss -tlnp | grep :22

# Ver qual processo está usando a porta 22
sudo lsof -i :22

# Verificar todas as conexões SSH ativas agora
ss -tnp | grep :22`}),e.jsx("h3",{children:"De outra máquina — testar se a porta está acessível"}),e.jsx(a,{title:"Testar conectividade com o servidor SSH",code:`# === nc (netcat) — teste rápido de porta ===
# Instalar: sudo pacman -S openbsd-netcat
nc -zv servidor.exemplo.com 22
# Saída se aberto:  Connection to servidor.exemplo.com 22 port [tcp/ssh] succeeded!
# Saída se fechado: nc: connect to servidor.exemplo.com port 22 (tcp) failed

# Testar porta personalizada
nc -zv servidor.exemplo.com 2222

# Com timeout (útil em scripts)
nc -zv -w 5 servidor.exemplo.com 22

# === telnet — outra forma de testar ===
telnet servidor.exemplo.com 22
# Se abrir: SSH-2.0-OpenSSH_9.x (você vê o banner do servidor)
# Se não abrir: Connection refused ou timeout

# === nmap — scanner completo de portas ===
# Instalar: sudo pacman -S nmap

# Verificar se a porta 22 está aberta no servidor
nmap -p 22 servidor.exemplo.com

# Verificar várias portas de uma vez
nmap -p 22,80,443,2222 servidor.exemplo.com

# Scan completo com detecção de serviço
nmap -sV -p 22 servidor.exemplo.com
# Saída:
# PORT   STATE  SERVICE VERSION
# 22/tcp open   ssh     OpenSSH 9.6 (protocol 2.0)

# === curl — verificação rápida (sem instalar nada extra) ===
curl -v telnet://servidor.exemplo.com:22 2>&1 | head -5`}),e.jsx("h3",{children:"Diagnosticar por que o SSH não conecta"}),e.jsx(a,{title:"Passo a passo para diagnosticar falha de conexão SSH",code:`# PASSO 1 — O serviço SSH está rodando no servidor?
sudo systemctl status sshd
# Se não estiver: sudo systemctl start sshd

# PASSO 2 — O servidor está ouvindo na porta certa?
ss -tlnp | grep sshd
# Se não aparecer nada: verifique o Port no /etc/ssh/sshd_config

# PASSO 3 — O firewall está bloqueando?
sudo ufw status          # se usar ufw
sudo nft list ruleset    # se usar nftables
sudo iptables -L -n      # se usar iptables

# PASSO 4 — Testar da máquina cliente
nc -zv servidor.exemplo.com 22
# Se falhar: firewall bloqueando ou porta errada

# PASSO 5 — Tentar conectar com verbose para ver onde trava
ssh -vvv usuario@servidor.exemplo.com

# PASSO 6 — Ver logs no servidor
sudo journalctl -u sshd -f
# Em outra aba, tente conectar e observe o log em tempo real

# PASSO 7 — Verificar permissões do ~/.ssh (causa silenciosa comum!)
ls -la ~/.ssh/
# .ssh deve ter permissão 700 (drwx------)
# authorized_keys deve ter permissão 600 (-rw-------)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys`}),e.jsxs(s,{type:"info",title:"Regra de ouro do diagnóstico SSH",children:["Se ",e.jsx("code",{children:"nc -zv servidor.exemplo.com 22"})," falhar — é problema de rede ou firewall, não de SSH. Se conectar mas o SSH recusar — é problema de configuração do sshd, usuário ou chaves. Essa distinção economiza muito tempo de debug."]}),e.jsx("h2",{children:"13. Verificando Logs e Diagnóstico do sshd"}),e.jsx(a,{title:"Logs do servidor SSH",code:`# Ver tentativas de login em tempo real
sudo journalctl -u sshd -f

# Ver tentativas com falha
sudo journalctl -u sshd | grep "Failed"
sudo journalctl -u sshd | grep "Invalid user"

# Ver últimas conexões bem-sucedidas
last -n 20`}),e.jsx("h2",{children:"14. Dicas de Segurança"}),e.jsx(a,{title:"Boas práticas de segurança SSH",code:`# 1. Alterar a porta padrão + liberar no firewall
#    /etc/ssh/sshd_config: Port 2222
sudo ufw allow 2222/tcp
sudo ufw deny 22/tcp     # bloquear a porta antiga após trocar

# 2. Usar apenas chaves SSH (sem senha)
#    /etc/ssh/sshd_config: PasswordAuthentication no

# 3. Instalar e configurar o Fail2Ban (bloqueia IPs com muitas tentativas)
sudo pacman -S fail2ban
sudo systemctl enable --now fail2ban

# 4. Usar chaves Ed25519 (mais modernas e seguras que RSA)
ssh-keygen -t ed25519

# 5. Revisar authorized_keys periodicamente
cat ~/.ssh/authorized_keys
# Remova linhas de máquinas que não devem mais ter acesso

# 6. Limitar quais usuários podem conectar
#    /etc/ssh/sshd_config: AllowUsers usuario1 usuario2`}),e.jsx("h2",{children:"15. Referências"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/OpenSSH",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - OpenSSH"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/SSH_keys",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - SSH keys"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Uncomplicated_Firewall",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - UFW"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Nftables",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - nftables"})}),e.jsxs("li",{children:[e.jsx("code",{children:"man ssh"}),", ",e.jsx("code",{children:"man sshd_config"}),", ",e.jsx("code",{children:"man ssh_config"}),","," ",e.jsx("code",{children:"man ssh-keygen"}),", ",e.jsx("code",{children:"man ufw"}),", ",e.jsx("code",{children:"man nft"})]})]})]})}export{p as default};
