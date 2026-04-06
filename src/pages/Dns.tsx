import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Dns() {
  return (
    <PageContainer
      title="DNS & Resolução de Nomes"
      subtitle="Configure DNS, systemd-resolved, DNS over TLS/HTTPS, cache local e resolução de problemas de DNS no Arch Linux."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <h2>O que é DNS?</h2>
      <p>
        DNS (Domain Name System) traduz nomes de domínio legíveis (como <code>archlinux.org</code>) em endereços IP
        numéricos. Sem DNS, você precisaria memorizar endereços como <code>95.217.163.246</code> para cada site.
      </p>

      <h2>O Arquivo /etc/resolv.conf</h2>
      <p>
        Este é o arquivo tradicional que define quais servidores DNS o sistema usa.
      </p>

      <CodeBlock
        title="Ver e editar resolv.conf"
        code={`# Ver configuração atual
cat /etc/resolv.conf

# Editar manualmente (cuidado: pode ser sobrescrito)
sudo vim /etc/resolv.conf

# Conteúdo típico:
nameserver 1.1.1.1
nameserver 1.0.0.1
nameserver 8.8.8.8`}
      />

      <AlertBox type="warning" title="resolv.conf pode ser sobrescrito">
        O NetworkManager e o systemd-resolved podem sobrescrever o <code>/etc/resolv.conf</code> automaticamente.
        Se você editar manualmente, suas alterações podem ser perdidas. Use o método correto para o seu gerenciador de rede.
      </AlertBox>

      <h2>systemd-resolved</h2>
      <p>
        O <code>systemd-resolved</code> é o resolvedor de DNS integrado ao systemd. Ele fornece cache DNS local,
        DNSSEC, DNS over TLS e gerenciamento inteligente de DNS por interface.
      </p>

      <CodeBlock
        title="Configurar systemd-resolved"
        code={`# Habilitar e iniciar
sudo systemctl enable --now systemd-resolved

# Criar symlink para resolv.conf
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf

# Ver status
resolvectl status

# Ver estatísticas do cache
resolvectl statistics

# Limpar cache DNS
resolvectl flush-caches`}
      />

      <CodeBlock
        title="Configurar DNS global com systemd-resolved"
        code={`# Editar /etc/systemd/resolved.conf
sudo vim /etc/systemd/resolved.conf

[Resolve]
# DNS padrão
DNS=1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com
FallbackDNS=8.8.8.8 8.8.4.4

# Habilitar DNS over TLS
DNSOverTLS=yes

# Habilitar DNSSEC
DNSSEC=allow-downgrade

# Cache
Cache=yes

# Domínios de busca
Domains=~.

# Reiniciar para aplicar
sudo systemctl restart systemd-resolved`}
      />

      <h2>DNS over TLS (DoT)</h2>
      <p>
        DNS over TLS criptografa as consultas DNS, impedindo que provedores de internet e atacantes
        vejam quais sites você acessa.
      </p>

      <CodeBlock
        title="Configurar DNS over TLS com systemd-resolved"
        code={`# /etc/systemd/resolved.conf
[Resolve]
DNS=1.1.1.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net
DNSOverTLS=yes

# Reiniciar
sudo systemctl restart systemd-resolved

# Verificar se DoT está ativo
resolvectl status
# Deve mostrar: DNSOverTLS setting: yes`}
      />

      <h2>DNS over HTTPS (DoH)</h2>

      <CodeBlock
        title="Usando dnscrypt-proxy para DNS over HTTPS"
        code={`# Instalar
sudo pacman -S dnscrypt-proxy

# Configurar
sudo vim /etc/dnscrypt-proxy/dnscrypt-proxy.toml
# Conteúdo importante:
# listen_addresses = ['127.0.0.1:53']
# server_names = ['cloudflare', 'cloudflare-ipv6', 'quad9-dnscrypt-ip4-nofilter-pri']
# doh_servers = true
# require_dnssec = true

# Desabilitar systemd-resolved se usando dnscrypt-proxy
sudo systemctl disable --now systemd-resolved

# Habilitar dnscrypt-proxy
sudo systemctl enable --now dnscrypt-proxy

# Atualizar resolv.conf
echo 'nameserver 127.0.0.1' | sudo tee /etc/resolv.conf`}
      />

      <h2>Ferramentas de Diagnóstico DNS</h2>

      <CodeBlock
        title="Ferramentas para testar e diagnosticar DNS"
        code={`# dig — consulta DNS detalhada
dig archlinux.org
dig archlinux.org MX       # Registros de email
dig archlinux.org NS       # Servidores de nome
dig @1.1.1.1 archlinux.org # Usar DNS específico
dig +short archlinux.org   # Resultado resumido
dig +trace archlinux.org   # Traçar resolução completa

# Instalar dig se necessário
sudo pacman -S bind

# nslookup — consulta simples
nslookup archlinux.org
nslookup archlinux.org 1.1.1.1

# host — consulta rápida
host archlinux.org
host -t MX archlinux.org

# resolvectl — integrado ao systemd
resolvectl query archlinux.org

# Testar velocidade de DNS
# Instalar dnsperf ou usar:
time dig archlinux.org        # Primeira consulta (sem cache)
time dig archlinux.org        # Segunda (do cache, deve ser mais rápida)`}
      />

      <h2>O Arquivo /etc/hosts</h2>

      <CodeBlock
        title="Usar /etc/hosts para resolução local"
        code={`# Editar /etc/hosts
sudo vim /etc/hosts

# Formato:
# IP    hostname    aliases

# Entradas básicas (obrigatórias)
127.0.0.1   localhost
::1         localhost
127.0.1.1   meu-arch.localdomain meu-arch

# Bloquear sites (redirecionar para localhost)
0.0.0.0     facebook.com
0.0.0.0     www.facebook.com
0.0.0.0     ads.google.com

# Apelidos para servidores locais
192.168.1.10  servidor-casa
192.168.1.20  raspberry-pi`}
      />

      <h2>Configurar DNS por Interface</h2>

      <CodeBlock
        title="DNS diferente para cada rede"
        code={`# Via NetworkManager (nmcli)
# DNS específico para conexão Wi-Fi de casa
nmcli connection modify "WiFi-Casa" ipv4.dns "1.1.1.1 1.0.0.1"
nmcli connection modify "WiFi-Casa" ipv4.ignore-auto-dns yes

# DNS do trabalho para conexão VPN
nmcli connection modify "VPN-Trabalho" ipv4.dns "10.0.0.1"
nmcli connection modify "VPN-Trabalho" ipv4.dns-search "empresa.local"

# Aplicar
nmcli connection up "WiFi-Casa"`}
      />

      <h2>Troubleshooting de DNS</h2>

      <CodeBlock
        title="Resolver problemas comuns de DNS"
        code={`# Problema: "Could not resolve hostname"
# 1. Verificar se o DNS está configurado
cat /etc/resolv.conf

# 2. Testar conectividade básica (por IP)
ping -c 3 1.1.1.1

# 3. Testar resolução DNS
dig archlinux.org

# 4. Limpar cache
resolvectl flush-caches

# 5. Reiniciar serviços
sudo systemctl restart systemd-resolved
sudo systemctl restart NetworkManager

# 6. Verificar se resolv.conf é symlink correto
ls -la /etc/resolv.conf
# Deve apontar para /run/systemd/resolve/stub-resolv.conf

# 7. Recriar o symlink se necessário
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf`}
      />

      <AlertBox type="info" title="Servidores DNS recomendados">
        <strong>Cloudflare</strong> (1.1.1.1): mais rápido, focado em privacidade.
        <br/><strong>Google</strong> (8.8.8.8): confiável e amplamente usado.
        <br/><strong>Quad9</strong> (9.9.9.9): bloqueia malware, sem fins lucrativos.
        <br/><strong>NextDNS</strong>: personalizável, bloqueio de anúncios.
      </AlertBox>
    </PageContainer>
  );
}
