import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(r,{title:"Segurança",subtitle:"Firewall, SSH, GPG, criptografia e boas práticas para proteger seu sistema Arch Linux.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("h2",{children:"Princípios Básicos de Segurança"}),e.jsx("p",{children:"A segurança no Linux é construída em camadas. Nenhuma medida isolada é suficiente, mas a combinação delas torna seu sistema robusto:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Manter o sistema atualizado (",e.jsx("code",{children:"pacman -Syu"})," regularmente)"]}),e.jsx("li",{children:"Usar senhas fortes e únicas"}),e.jsx("li",{children:"Não usar root desnecessariamente"}),e.jsx("li",{children:"Configurar firewall"}),e.jsx("li",{children:"Limitar serviços em execução"}),e.jsx("li",{children:"Verificar logs regularmente"})]}),e.jsx("h2",{children:"UFW — Firewall Simplificado"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"ufw"})," (Uncomplicated Firewall) é uma interface amigável para o iptables/nftables. Perfeito para configurar um firewall rapidamente."]}),e.jsx(a,{title:"Instalar e configurar UFW",code:`# Instalar
sudo pacman -S ufw

# Configurar políticas padrão
sudo ufw default deny incoming    # Bloquear tudo que entra
sudo ufw default allow outgoing   # Permitir tudo que sai

# Habilitar o firewall
sudo ufw enable

# Habilitar no boot
sudo systemctl enable ufw`}),e.jsx(a,{title:"Gerenciando regras",code:`# Permitir SSH
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
sudo ufw disable`}),e.jsx(s,{type:"warning",title:"Cuidado ao habilitar remotamente",children:"Se você está acessando a máquina via SSH, certifique-se de permitir SSH ANTES de habilitar o firewall, ou você perderá o acesso!"}),e.jsx("h2",{children:"iptables / nftables — Firewall Avançado"}),e.jsxs("p",{children:["Para quem precisa de controle mais fino, o ",e.jsx("code",{children:"iptables"})," (e seu sucessor ",e.jsx("code",{children:"nftables"}),") oferecem controle total sobre o tráfego de rede."]}),e.jsx(a,{title:"Exemplos básicos de iptables",code:`# Ver regras atuais
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
sudo systemctl enable iptables`}),e.jsx("h2",{children:"SSH — Acesso Remoto Seguro"}),e.jsx("h3",{children:"Gerando Chaves SSH"}),e.jsx(a,{title:"Criar e usar chaves SSH",code:`# Gerar par de chaves (Ed25519 - recomendado)
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
scp -r pasta/ usuario@servidor:/caminho/destino/`}),e.jsx("h3",{children:"Hardening do SSH Server"}),e.jsx(a,{title:"Editar /etc/ssh/sshd_config",language:"text",code:`# Instalar e habilitar o servidor SSH
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
# sudo systemctl restart sshd`}),e.jsx(s,{type:"danger",title:"Teste antes de desconectar",children:"Ao alterar configurações do SSH, sempre abra uma NOVA conexão para testar antes de fechar a conexão atual. Se a configuração estiver errada, você ainda tem a sessão original para corrigir."}),e.jsx("h2",{children:"GPG — Criptografia e Assinaturas"}),e.jsx("p",{children:"O GnuPG (GPG) permite criptografar arquivos, assinar digitalmente e verificar a autenticidade de dados. É usado pelo pacman para verificar pacotes."}),e.jsx(a,{title:"Gerando e gerenciando chaves GPG",code:`# Gerar um novo par de chaves
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
gpg --armor --export-secret-keys seu@email.com > minha-chave-privada.asc`}),e.jsx(a,{title:"Criptografar e assinar arquivos",code:`# Criptografar arquivo para um destinatário
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
gpg --sign --encrypt --recipient email@destino.com arquivo.txt`}),e.jsx("h2",{children:"Verificação de Integridade de Arquivos"}),e.jsx(a,{title:"Checksums e verificação",code:`# Gerar checksums
sha256sum arquivo.iso > arquivo.sha256
md5sum arquivo.iso > arquivo.md5

# Verificar checksum
sha256sum -c arquivo.sha256

# Verificar múltiplos arquivos
sha256sum *.tar.gz > checksums.sha256
sha256sum -c checksums.sha256

# Verificar pacotes instalados (pacman)
pacman -Qkk pacote
# Mostra se algum arquivo do pacote foi modificado`}),e.jsx("h2",{children:"Atualizações de Segurança"}),e.jsx(a,{title:"Manter o sistema seguro",code:`# Atualizar TUDO regularmente
sudo pacman -Syu

# Verificar advisories de segurança do Arch
# https://security.archlinux.org/

# Listar pacotes com atualizações pendentes
checkupdates

# Ver quais pacotes foram atualizados recentemente
grep "upgraded" /var/log/pacman.log | tail -20

# Automatizar verificação (com timer do systemd ou cron)
# Não é recomendado automatizar a INSTALAÇÃO de updates
# Apenas a verificação/notificação`}),e.jsx("h2",{children:"Boas Práticas Gerais"}),e.jsx(s,{type:"success",title:"Checklist de Segurança",children:e.jsxs("ul",{children:[e.jsx("li",{children:"Mantenha o sistema sempre atualizado"}),e.jsx("li",{children:"Use senhas fortes (considere um gerenciador de senhas)"}),e.jsx("li",{children:"Configure o firewall (UFW é o mais fácil)"}),e.jsx("li",{children:"Desabilite serviços que não usa"}),e.jsx("li",{children:"Use SSH com chaves em vez de senhas"}),e.jsx("li",{children:"Verifique logs regularmente com journalctl"}),e.jsx("li",{children:"Criptografe dados sensíveis (LUKS para disco, GPG para arquivos)"}),e.jsx("li",{children:"Faça backups regulares"}),e.jsx("li",{children:"Leia PKGBUILDs antes de instalar do AUR"}),e.jsx("li",{children:"Não execute scripts da internet sem ler primeiro"})]})}),e.jsx(a,{title:"Desabilitar serviços desnecessários",code:`# Listar serviços ativos
systemctl list-units --type=service --state=active

# Desabilitar e parar serviços que não usa
sudo systemctl disable --now cups.service     # Impressão
sudo systemctl disable --now avahi-daemon     # Descoberta de rede
sudo systemctl disable --now bluetooth        # Se não usa Bluetooth

# Verificar portas abertas
ss -tulanp | grep LISTEN`})]})}export{p as default};
