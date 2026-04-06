import{j as e}from"./ui-K-J8Jkwj.js";import{P as t}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(t,{title:"Firewall no Arch Linux",subtitle:"Proteja seu sistema com nftables, ufw e iptables. Configure regras de entrada, saída e encaminhamento para controlar completamente o tráfego de rede.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"O Stack de Firewall do Linux"}),e.jsxs("p",{children:["O Linux usa o ",e.jsx("strong",{children:"netfilter"})," no kernel para filtragem de pacotes. Existem várias ferramentas de espaço de usuário para gerenciar as regras:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"iptables"})," — Ferramenta clássica, amplamente suportada. Sendo substituída pelo nftables."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"nftables"})," — Substituto moderno do iptables. Mais eficiente, sintaxe melhor. Padrão em sistemas modernos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ufw"}),' — "Uncomplicated Firewall". Frontend simples sobre iptables/nftables. Fácil para iniciantes.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"firewalld"})," — Usado no Fedora/RHEL. Suporte a zonas."]})]}),e.jsx("h2",{children:"UFW - Para Iniciantes"}),e.jsx(a,{title:"UFW - Firewall simplificado",code:`# Instalar UFW
sudo pacman -S ufw

# Habilitar o serviço
sudo systemctl enable ufw
sudo systemctl start ufw

# Status atual
sudo ufw status verbose

# POLÍTICA PADRÃO (configurar antes de ativar!)
sudo ufw default deny incoming    # Bloquear tudo que entra
sudo ufw default allow outgoing   # Permitir tudo que sai

# Permitir SSH (IMPORTANTE - fazer antes de ativar!)
sudo ufw allow ssh          # Porta 22
sudo ufw allow 22/tcp
sudo ufw allow 2222/tcp     # SSH em porta alternativa

# Ativar o firewall
sudo ufw enable

# Permitir outros serviços
sudo ufw allow http         # Porta 80
sudo ufw allow https        # Porta 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000:3010/tcp  # Range de portas

# Permitir de IP específico
sudo ufw allow from 192.168.1.100
sudo ufw allow from 192.168.1.0/24    # Subnet inteira
sudo ufw allow from 192.168.1.100 to any port 22

# Negar porta específica
sudo ufw deny 25/tcp          # Bloquear SMTP (evitar spam)

# Remover regra
sudo ufw delete allow http
sudo ufw delete allow 80/tcp

# Ver regras numeradas
sudo ufw status numbered
# Remover por número
sudo ufw delete 3

# Desativar firewall
sudo ufw disable`}),e.jsx("h2",{children:"nftables - O Firewall Moderno"}),e.jsx(a,{title:"Conceitos do nftables",code:`# Instalar
sudo pacman -S nftables

# Habilitar
sudo systemctl enable nftables
sudo systemctl start nftables

# Ver regras atuais
sudo nft list ruleset

# Limpar todas as regras
sudo nft flush ruleset

# Arquivo de configuração
sudo nano /etc/nftables.conf`}),e.jsx(a,{title:"/etc/nftables.conf - Configuração completa",code:`#!/usr/bin/nft -f
# Flush de regras existentes
flush ruleset

# Tabela principal para IPv4 e IPv6
table inet filter {

    # Conjuntos (sets) para reutilização
    set allowed_ports_tcp {
        type inet_service
        elements = { ssh, http, https }
    }

    # Chain de entrada (pacotes destinados a esta máquina)
    chain input {
        # Política padrão: DROP (bloquear tudo)
        type filter hook input priority filter; policy drop;

        # Aceitar conexões estabelecidas e relacionadas
        ct state established,related accept

        # Aceitar conexões inválidas? Não!
        ct state invalid drop

        # Aceitar loopback (interface lo)
        iif "lo" accept

        # Aceitar ICMP (ping)
        ip protocol icmp accept
        ip6 nexthdr icmpv6 accept

        # SSH - apenas da rede local
        ip saddr 192.168.1.0/24 tcp dport ssh accept

        # HTTP e HTTPS - de qualquer lugar
        tcp dport { http, https } accept

        # Limitar tentativas SSH (rate limiting)
        tcp dport ssh ct state new limit rate 5/minute accept

        # Log de pacotes dropados (para diagnóstico)
        log prefix "FIREWALL DROP: " level info
    }

    # Chain de saída (pacotes que saem desta máquina)
    chain output {
        type filter hook output priority filter; policy accept;
        # Aceitar tudo (política permissiva de saída)
    }

    # Chain de encaminhamento (para roteadores/NAT)
    chain forward {
        type filter hook forward priority filter; policy drop;
    }
}

# Tabela NAT (para compartilhar internet)
table ip nat {
    chain prerouting {
        type nat hook prerouting priority -100;
    }

    chain postrouting {
        type nat hook postrouting priority 100;
        # Masquerade para interface de saída (internet)
        # oifname "eth0" masquerade
    }
}`}),e.jsx(a,{title:"Comandos nftables úteis",code:`# Aplicar configuração
sudo nft -f /etc/nftables.conf

# Adicionar regra sem editar arquivo
sudo nft add rule inet filter input tcp dport 8080 accept

# Inserir regra no início
sudo nft insert rule inet filter input tcp dport 8080 accept

# Listar tabelas
sudo nft list tables

# Listar chains de uma tabela
sudo nft list table inet filter

# Ver com handles (para deletar regras)
sudo nft list ruleset -a

# Deletar regra por handle
sudo nft delete rule inet filter input handle 10

# Testar configuração sem aplicar
sudo nft -c -f /etc/nftables.conf

# Salvar regras atuais
sudo nft list ruleset > /etc/nftables.conf`}),e.jsx("h2",{children:"iptables - Compatibilidade"}),e.jsx(a,{title:"Comandos básicos do iptables",code:`# Ver regras atuais
sudo iptables -L -v -n
sudo iptables -L -v -n --line-numbers

# Política padrão
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Aceitar conexões estabelecidas
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Aceitar loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Aceitar ICMP
sudo iptables -A INPUT -p icmp -j ACCEPT

# Aceitar SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Aceitar HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Rate limiting SSH
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m limit     --limit 3/min --limit-burst 3 -j ACCEPT

# Salvar regras (persiste entre reboots)
sudo pacman -S iptables  # Inclui iptables-save
sudo iptables-save > /etc/iptables/iptables.rules
sudo systemctl enable iptables`}),e.jsxs(s,{type:"info",title:"nftables vs iptables",children:["No Arch Linux moderno, use ",e.jsx("strong",{children:"nftables"})," ou ",e.jsx("strong",{children:"ufw"}),". O iptables está sendo descontinuado e o nftables é mais eficiente e poderoso. O ufw pode usar nftables como backend desde versões recentes."]}),e.jsx("h2",{children:"Fail2ban - Proteção Automática"}),e.jsx(a,{title:"Instalar e configurar Fail2ban",code:`# Instalar fail2ban
sudo pacman -S fail2ban

# Habilitar e iniciar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configuração local (não editar o .conf original)
sudo nano /etc/fail2ban/jail.local`}),e.jsx(a,{title:"/etc/fail2ban/jail.local",code:`[DEFAULT]
bantime  = 1h      # Banir por 1 hora
findtime = 10m     # Janela de tempo para contar tentativas
maxretry = 5       # Número de tentativas antes de banir

# Backend (auto detecta journald ou syslog)
backend = systemd

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s

[nginx-http-auth]
enabled = true
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port    = http,https
logpath = /var/log/nginx/access.log`}),e.jsx(a,{title:"Gerenciar Fail2ban",code:`# Ver status geral
sudo fail2ban-client status

# Ver status de uma jail
sudo fail2ban-client status sshd

# Saída:
# Status for the jail: sshd
# |- Filter
# |  |- Currently failed:    2
# |  |- Total failed:    45
# |  +- File list: /var/log/auth.log
# +- Actions
#    |- Currently banned:    3
#    |- Total banned:    12
#    +- Banned IP list: 1.2.3.4 5.6.7.8 ...

# Desbanir IP
sudo fail2ban-client set sshd unbanip 1.2.3.4

# Banir IP manualmente
sudo fail2ban-client set sshd banip 1.2.3.4`})]})}export{p as default};
