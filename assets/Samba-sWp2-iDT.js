import{j as o}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return o.jsxs(s,{title:"NFS & Samba: Compartilhamento de Rede",subtitle:"Compartilhe arquivos na rede local entre Linux e Windows usando NFS e Samba (SMB/CIFS).",difficulty:"intermediario",timeToRead:"20 min",children:[o.jsx("h2",{children:"Visão Geral"}),o.jsxs("p",{children:[o.jsx("strong",{children:"NFS"})," (Network File System) é o protocolo nativo para compartilhar arquivos entre máquinas Linux.",o.jsx("strong",{children:"Samba"})," (SMB/CIFS) é necessário para compartilhar com Windows e é usado também por NAS."]}),o.jsx("h2",{children:"Samba (SMB/CIFS)"}),o.jsx("h3",{children:"Servidor Samba"}),o.jsx(a,{title:"Instalar e configurar servidor Samba",code:`# Instalar
sudo pacman -S samba

# Copiar configuração de exemplo
sudo cp /etc/samba/smb.conf.default /etc/samba/smb.conf

# Editar configuração
sudo vim /etc/samba/smb.conf`}),o.jsx(a,{title:"Configuração do smb.conf",code:`# /etc/samba/smb.conf
[global]
   workgroup = WORKGROUP
   server string = Arch Linux Samba
   security = user
   map to guest = Bad User
   dns proxy = no

# Compartilhamento público (sem senha)
[publico]
   path = /srv/samba/publico
   browsable = yes
   writable = yes
   guest ok = yes
   create mask = 0664
   directory mask = 0775

# Compartilhamento privado (com senha)
[privado]
   path = /srv/samba/privado
   browsable = yes
   writable = yes
   guest ok = no
   valid users = usuario
   create mask = 0660
   directory mask = 0770

# Home do usuário
[homes]
   comment = Home Directories
   browsable = no
   writable = yes
   valid users = %S`}),o.jsx(a,{title:"Preparar diretórios e usuários",code:`# Criar diretórios de compartilhamento
sudo mkdir -p /srv/samba/publico /srv/samba/privado
sudo chown nobody:nobody /srv/samba/publico
sudo chmod 775 /srv/samba/publico
sudo chown usuario:usuario /srv/samba/privado
sudo chmod 770 /srv/samba/privado

# Criar usuário Samba (precisa existir no sistema)
sudo smbpasswd -a usuario
# Digite a senha do Samba (pode ser diferente da do sistema)

# Habilitar usuário
sudo smbpasswd -e usuario

# Testar configuração
testparm

# Habilitar e iniciar
sudo systemctl enable --now smb nmb`}),o.jsx("h3",{children:"Cliente Samba"}),o.jsx(a,{title:"Acessar compartilhamento Samba",code:`# Instalar cliente
sudo pacman -S cifs-utils smbclient

# Listar compartilhamentos de um servidor
smbclient -L //192.168.1.10 -U usuario

# Acessar compartilhamento interativamente
smbclient //192.168.1.10/privado -U usuario

# Montar compartilhamento
sudo mount -t cifs //192.168.1.10/privado /mnt/samba -o username=usuario,password=senha,uid=1000

# Montar via fstab (permanente)
# /etc/fstab:
//192.168.1.10/privado  /mnt/samba  cifs  credentials=/etc/samba/creds,uid=1000,gid=1000,_netdev  0 0

# Criar arquivo de credenciais seguro
sudo tee /etc/samba/creds << 'EOF'
username=usuario
password=minhasenha
domain=WORKGROUP
EOF
sudo chmod 600 /etc/samba/creds`}),o.jsx("h2",{children:"NFS (Network File System)"}),o.jsx("h3",{children:"Servidor NFS"}),o.jsx(a,{title:"Instalar e configurar servidor NFS",code:`# Instalar
sudo pacman -S nfs-utils

# Criar diretório para compartilhar
sudo mkdir -p /srv/nfs/dados
sudo chown nobody:nobody /srv/nfs/dados

# Configurar exports
sudo vim /etc/exports

# /etc/exports:
# Compartilhar com toda a rede local
/srv/nfs/dados  192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)

# Compartilhar somente leitura
/srv/nfs/publico  192.168.1.0/24(ro,sync,no_subtree_check)

# Compartilhar com IP específico
/srv/nfs/privado  192.168.1.100(rw,sync,no_subtree_check)

# Aplicar mudanças
sudo exportfs -arv

# Habilitar e iniciar
sudo systemctl enable --now nfs-server

# Verificar exports ativos
showmount -e localhost`}),o.jsx(a,{title:"Opções de export explicadas",code:`# rw              — leitura e escrita
# ro              — somente leitura
# sync            — escrever no disco antes de responder (mais seguro)
# async           — responder antes de escrever (mais rápido, risco de perda)
# no_subtree_check — não verificar subárvore (mais rápido)
# no_root_squash  — permitir root remoto como root local (cuidado!)
# root_squash     — mapear root remoto para nobody (padrão, mais seguro)
# all_squash      — mapear todos os usuários para nobody
# anonuid=1000    — UID para usuários anônimos
# anongid=1000    — GID para usuários anônimos`}),o.jsx("h3",{children:"Cliente NFS"}),o.jsx(a,{title:"Montar compartilhamento NFS",code:`# Instalar ferramentas de cliente
sudo pacman -S nfs-utils

# Ver exports disponíveis no servidor
showmount -e 192.168.1.10

# Montar manualmente
sudo mount -t nfs 192.168.1.10:/srv/nfs/dados /mnt/nfs

# Montar com opções de performance
sudo mount -t nfs -o rw,hard,timeo=600,retrans=2,rsize=1048576,wsize=1048576 \\
  192.168.1.10:/srv/nfs/dados /mnt/nfs

# Montar via fstab (permanente)
# /etc/fstab:
192.168.1.10:/srv/nfs/dados  /mnt/nfs  nfs  defaults,_netdev,noauto,x-systemd.automount  0 0

# _netdev = esperar a rede estar disponível
# noauto,x-systemd.automount = montar sob demanda (melhor para laptops)

# Desmontar
sudo umount /mnt/nfs`}),o.jsx("h2",{children:"Firewall para Samba e NFS"}),o.jsx(a,{title:"Configurar firewall para compartilhamento",code:`# Samba (portas necessárias)
sudo ufw allow from 192.168.1.0/24 to any port 137  # NetBIOS Name Service
sudo ufw allow from 192.168.1.0/24 to any port 138  # NetBIOS Datagram
sudo ufw allow from 192.168.1.0/24 to any port 139  # NetBIOS Session
sudo ufw allow from 192.168.1.0/24 to any port 445  # SMB

# NFS (portas necessárias)
sudo ufw allow from 192.168.1.0/24 to any port 2049  # NFS
sudo ufw allow from 192.168.1.0/24 to any port 111   # rpcbind

# Ou com nftables/iptables
sudo iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 445 -j ACCEPT`}),o.jsxs(r,{type:"info",title:"Samba vs NFS",children:["Use ",o.jsx("strong",{children:"NFS"})," quando: todos os computadores são Linux, quer melhor performance, não precisa de autenticação complexa.",o.jsx("br",{}),o.jsx("br",{}),"Use ",o.jsx("strong",{children:"Samba"})," quando: precisa compartilhar com Windows/macOS, quer autenticação por usuário/senha, acessar NAS comerciais."]})]})}export{l as default};
