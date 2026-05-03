import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DNS() {
  return (
    <PageContainer
      title="DNS — Resolução de Nomes"
      subtitle="systemd-resolved, /etc/resolv.conf, dig, host, nslookup, /etc/hosts, dnsmasq, DoT/DoH e troubleshooting — tudo com saída real no Arch."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Redes"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo</code>. <code>systemd-resolved</code> não vem ativo por padrão — depende da configuração.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>DNS</strong> — sistema que traduz nomes em IPs.
      </p>
      <p>
        <strong>systemd-resolved</strong> — resolvedor opcional do systemd (<code>127.0.0.53</code>).
      </p>
      <p>
        <strong>/etc/resolv.conf</strong> — arquivo padrão. No Arch sem resolved é gerenciado direto pelo NetworkManager/dhcpcd.
      </p>
      <p>
        <strong>dig / nslookup / drill</strong> — utilitários para consultar DNS. Arch costuma trazer <code>drill</code> (pacote <code>ldns</code>).
      </p>

      <p>
        Toda vez que você digita <code>archlinux.org</code>, alguém precisa traduzir esse nome para
        um IP. No Arch Linux, isso é feito por uma cadeia de componentes: <code>nss</code> (libc) →
        <code>/etc/nsswitch.conf</code> → <code>/etc/hosts</code> ou um <strong>resolver</strong>{" "}
        (geralmente <code>systemd-resolved</code> escutando em <code>127.0.0.53</code>) → DNS público
        ou local. Esta página cobre toda essa pilha.
      </p>

      <AlertBox type="info" title="Pacotes recomendados">
        Quase tudo está no base. Para a caixa de ferramentas completa instale:{" "}
        <code>sudo pacman -S bind dnsutils</code> (traz <code>dig</code>, <code>nslookup</code>,{" "}
        <code>host</code>) e opcionalmente <code>dnsmasq</code> para um resolver local.
      </AlertBox>

      <h2>1. A pilha de resolução no Arch</h2>

      <OutputBlock
        title="Caminho de uma consulta DNS"
        output={`programa  →  glibc (getaddrinfo)
              ↓
      /etc/nsswitch.conf
      hosts: files mymachines myhostname resolve [!UNAVAIL=return] dns
              ↓
      1. files       →  /etc/hosts
      2. resolve     →  systemd-resolved (D-Bus)
      3. dns         →  fallback /etc/resolv.conf → UDP/53 ou TCP/53
              ↓
       resposta IPv4/IPv6`}
        annotations={[
          { line: 0, note: "qualquer libc client (curl, ping, ssh)" },
          { line: 3, note: "ordem dos backends (top-down)" },
          { line: 5, note: "arquivo estático local — testado primeiro" },
          { line: 6, note: "via D-Bus, usa cache, DNSSEC, DoT" },
          { line: 7, note: "se resolved indisponível, fallback puro" },
        ]}
      />

      <TerminalBlock
        comment="confirma a ordem de resolução"
        command="grep ^hosts /etc/nsswitch.conf"
        output={`hosts: mymachines resolve [!UNAVAIL=return] files myhostname dns`}
      />

      <h2>2. systemd-resolved — o resolver padrão</h2>

      <p>
        O <code>systemd-resolved</code> é instalado por padrão (mas <em>não</em> habilitado
        automaticamente). Ele oferece cache, DNSSEC, DNS-over-TLS, LLMNR/mDNS e expõe o stub
        listener em <code>127.0.0.53:53</code>.
      </p>

      <TerminalBlock
        command="sudo systemctl enable --now systemd-resolved.service"
        output={`Created symlink /etc/systemd/system/dbus-org.freedesktop.resolve1.service → /usr/lib/systemd/system/systemd-resolved.service.
Created symlink /etc/systemd/system/sysinit.target.wants/systemd-resolved.service → /usr/lib/systemd/system/systemd-resolved.service.`}
      />

      <TerminalBlock
        comment="aponta /etc/resolv.conf para o stub"
        command="sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf"
        output=""
      />

      <TerminalBlock
        command="cat /etc/resolv.conf"
        output={`# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).
# Do not edit.
nameserver 127.0.0.53
options edns0 trust-ad
search .`}
      />

      <h3>resolvectl — interface de controle</h3>

      <CommandFlagList
        command="resolvectl"
        items={[
          { flag: "status", description: "Mostra protocolos, servidores DNS por link, DNSSEC e DoT.", example: "resolvectl status" },
          { flag: "query NOME", description: "Resolve um nome usando a pilha do resolved (não o sistema).", example: "resolvectl query archlinux.org" },
          { flag: "dns LINK A B", description: "Define DNS por interface em runtime (não persiste).", example: "sudo resolvectl dns wlan0 1.1.1.1 1.0.0.1" },
          { flag: "domain LINK ~.", description: "Define o domínio de busca; ~. faz a interface assumir TODAS as queries." },
          { flag: "flush-caches", description: "Limpa o cache DNS in-memory." },
          { flag: "statistics", description: "Mostra hits/misses do cache, queries por transporte, falhas DNSSEC." },
          { flag: "reset-statistics", description: "Zera os contadores acima." },
        ]}
      />

      <TerminalBlock
        command="resolvectl status"
        output={`Global
         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
  resolv.conf mode: stub

Link 2 (enp3s0)
    Current Scopes: DNS
         Protocols: +DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1 1.1.1.1
        DNS Domain: ~.

Link 3 (wlan0)
    Current Scopes: none
         Protocols: -DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported`}
      />

      <TerminalBlock
        command="resolvectl statistics"
        output={`DNSSEC supported by current servers: no

Transactions
Current Transactions: 0
  Total Transactions: 482

Cache
  Current Cache Size: 18
          Cache Hits: 312
        Cache Misses: 170

DNSSEC Verdicts
            Secure: 0
          Insecure: 0
             Bogus: 0
   Indeterminate: 0`}
      />

      <h3>Configuração persistente — /etc/systemd/resolved.conf.d/</h3>

      <CodeBlock
        title="/etc/systemd/resolved.conf.d/dns.conf"
        language="ini"
        code={`[Resolve]
DNS=1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com
FallbackDNS=9.9.9.9 8.8.8.8
Domains=~.
DNSSEC=allow-downgrade
DNSOverTLS=opportunistic
Cache=yes
ReadEtcHosts=yes
LLMNR=no
MulticastDNS=no`}
      />

      <TerminalBlock
        command="sudo systemctl restart systemd-resolved"
        output=""
      />

      <TerminalBlock
        command="resolvectl query archlinux.org"
        output={`archlinux.org: 95.217.163.246           -- link: enp3s0
               2a01:4f9:c010:6b0c::1   -- link: enp3s0

-- Information acquired via protocol DNS in 14.2ms.
-- Data is authenticated: no; Data was acquired via local or encrypted transport: yes
-- Data from: cache network`}
      />

      <AlertBox type="warning" title="Quem é dono do /etc/resolv.conf?">
        Vários componentes brigam por esse arquivo: <code>systemd-resolved</code>,{" "}
        <code>NetworkManager</code>, <code>dhcpcd</code>, <code>openresolv</code>. Escolha UM dono.
        Em desktops com NetworkManager + resolved, configure
        <code> [main] dns=systemd-resolved</code> em
        <code> /etc/NetworkManager/conf.d/dns.conf</code> para evitar conflito.
      </AlertBox>

      <h2>3. dig — a faca suíça do DNS</h2>

      <CommandFlagList
        command="dig"
        items={[
          { flag: "@SERVIDOR", description: "Força usar um servidor DNS específico em vez do sistema.", example: "dig @1.1.1.1 archlinux.org" },
          { flag: "TIPO", description: "A, AAAA, MX, NS, TXT, SOA, CNAME, PTR, ANY, CAA, SRV, DNSKEY...", example: "dig MX gmail.com" },
          { flag: "+short", description: "Imprime APENAS as respostas (1 por linha)." },
          { flag: "+noall +answer", description: "Suprime todo o cabeçalho — só a ANSWER SECTION." },
          { flag: "+trace", description: "Trace recursivo desde os root servers (.) até o autoritativo." },
          { flag: "+stats", description: "Mostra Query time, server, MSG SIZE." },
          { flag: "+tcp", description: "Força TCP/53 em vez de UDP (zone transfers, respostas grandes)." },
          { flag: "-x IP", description: "Reverse lookup (in-addr.arpa).", example: "dig -x 1.1.1.1" },
          { flag: "+dnssec", description: "Pede registros RRSIG e mostra o flag AD (Authenticated Data)." },
          { flag: "+norecurse", description: "Não pedir recursão (útil ao consultar autoritativo direto)." },
        ]}
      />

      <TerminalBlock
        command="dig archlinux.org +short"
        output={`95.217.163.246`}
      />

      <TerminalBlock
        command="dig archlinux.org"
        output={`; <<>> DiG 9.20.0 <<>> archlinux.org
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: {g}NOERROR{/}, id: 41258
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;archlinux.org.                 IN      A

;; ANSWER SECTION:
archlinux.org.          1800    IN      A       95.217.163.246

;; Query time: 14 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Wed Mar 26 14:30:42 -03 2026
;; MSG SIZE  rcvd: 58`}
      />

      <OutputBlock
        title="Cabeçalho da resposta dig — leia da esquerda pra direita"
        output={`;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41258
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
;; ANSWER SECTION:
archlinux.org.          1800    IN      A       95.217.163.246
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)`}
        annotations={[
          { line: 0, note: "status NOERROR | NXDOMAIN (não existe) | SERVFAIL (servidor falhou)" },
          { line: 1, note: "qr=resposta · rd=recursão pedida · ra=disponível · aa=autoritativo · ad=autenticado DNSSEC" },
          { line: 3, note: "nome FQDN · TTL (s) · classe IN · tipo · valor" },
          { line: 4, note: "quem respondeu (resolved local em 127.0.0.53)" },
        ]}
      />

      <h3>Tipos de registro mais usados</h3>

      <TerminalBlock
        command="dig MX gmail.com +short"
        output={`5 gmail-smtp-in.l.google.com.
10 alt1.gmail-smtp-in.l.google.com.
20 alt2.gmail-smtp-in.l.google.com.
30 alt3.gmail-smtp-in.l.google.com.
40 alt4.gmail-smtp-in.l.google.com.`}
      />

      <TerminalBlock
        command="dig NS archlinux.org +short"
        output={`ns2.archlinux.org.
ns1.archlinux.org.`}
      />

      <TerminalBlock
        command="dig TXT archlinux.org +short"
        output={`"v=spf1 ip4:95.217.163.246 ip6:2a01:4f9:c010:6b0c::1 -all"
"google-site-verification=abcd1234..."`}
      />

      <TerminalBlock
        command="dig SOA archlinux.org +short"
        output={`ns1.archlinux.org. hostmaster.archlinux.org. 2026032601 7200 1800 1209600 3600`}
      />

      <TerminalBlock
        comment="reverse lookup"
        command="dig -x 8.8.8.8 +short"
        output={`dns.google.`}
      />

      <h3>+trace — vendo a recursão acontecer</h3>

      <TerminalBlock
        command="dig +trace archlinux.org"
        output={`; <<>> DiG 9.20.0 <<>> +trace archlinux.org
;; global options: +cmd
.                       518400  IN      NS      a.root-servers.net.
.                       518400  IN      NS      b.root-servers.net.
.                       518400  IN      NS      c.root-servers.net.
;; Received 525 bytes from 127.0.0.53#53(127.0.0.53) in 0 ms

org.                    172800  IN      NS      a0.org.afilias-nst.info.
org.                    172800  IN      NS      a2.org.afilias-nst.info.
;; Received 815 bytes from 198.41.0.4#53(a.root-servers.net) in 8 ms

archlinux.org.          86400   IN      NS      ns1.archlinux.org.
archlinux.org.          86400   IN      NS      ns2.archlinux.org.
;; Received 178 bytes from 199.19.56.1#53(a0.org.afilias-nst.info) in 18 ms

archlinux.org.          1800    IN      A       95.217.163.246
;; Received 67 bytes from 95.217.222.142#53(ns1.archlinux.org) in 124 ms`}
      />

      <h2>4. host & nslookup — alternativas leves</h2>

      <TerminalBlock
        command="host archlinux.org"
        output={`archlinux.org has address 95.217.163.246
archlinux.org has IPv6 address 2a01:4f9:c010:6b0c::1
archlinux.org mail is handled by 10 mail.archlinux.org.`}
      />

      <TerminalBlock
        command="host -t MX gmail.com"
        output={`gmail.com mail is handled by 5 gmail-smtp-in.l.google.com.
gmail.com mail is handled by 10 alt1.gmail-smtp-in.l.google.com.
gmail.com mail is handled by 20 alt2.gmail-smtp-in.l.google.com.`}
      />

      <TerminalBlock
        command="nslookup archlinux.org 1.1.1.1"
        output={`Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   archlinux.org
Address: 95.217.163.246`}
      />

      <h2>5. /etc/hosts — overrides locais</h2>

      <p>
        O <code>/etc/hosts</code> é consultado <strong>antes</strong> do DNS (graças a{" "}
        <code>nsswitch.conf</code>). Use para: testes locais (<code>meusite.local</code>),
        bloqueio de sites (apontar para <code>0.0.0.0</code>), aliases de servidores na rede interna.
      </p>

      <CodeBlock
        title="/etc/hosts — exemplo prático"
        code={`# IPv4
127.0.0.1   localhost
127.0.1.1   archlinux

# Hosts da rede interna
192.168.1.10  nas.lan      nas
192.168.1.20  printer.lan  printer
192.168.1.50  pi.lan       pi

# Desenvolvimento local
127.0.0.1   meusite.local
127.0.0.1   api.meusite.local

# Bloqueio (sinkhole)
0.0.0.0     ads.example.com

# IPv6
::1         localhost ip6-localhost ip6-loopback
ff02::1     ip6-allnodes
ff02::2     ip6-allrouters`}
      />

      <TerminalBlock
        command="getent hosts meusite.local"
        output={`127.0.0.1       meusite.local`}
      />

      <TerminalBlock
        comment="ping respeita /etc/hosts"
        command="ping -c1 nas.lan"
        output={`PING nas.lan (192.168.1.10) 56(84) bytes of data.
64 bytes from nas (192.168.1.10): icmp_seq=1 ttl=64 time=0.412 ms

--- nas.lan ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms`}
      />

      <h2>6. dnsmasq — um resolver/forwarder/DHCP local</h2>

      <p>
        <code>dnsmasq</code> é leve, perfeito para LAN doméstica ou laboratório: faz cache, resolve
        nomes <code>.lan</code> via <code>/etc/hosts</code> e ainda pode servir DHCP. Não conflite
        com o <code>systemd-resolved</code> escutando na mesma porta.
      </p>

      <TerminalBlock
        command="sudo pacman -S dnsmasq"
        output={`Packages (1) dnsmasq-2.90-3
Total Installed Size:  1.42 MiB
:: Proceed with installation? [Y/n]`}
      />

      <CodeBlock
        title="/etc/dnsmasq.conf (mínimo)"
        code={`# escutar só no loopback e na LAN
listen-address=127.0.0.1,192.168.1.1
bind-interfaces

# upstream
no-resolv
server=1.1.1.1
server=9.9.9.9

# cache & domínio local
cache-size=1000
local=/lan/
domain=lan
expand-hosts

# usa /etc/hosts e diretório extra
addn-hosts=/etc/dnsmasq.d/extra-hosts

# DHCP (opcional)
dhcp-range=192.168.1.100,192.168.1.200,12h
dhcp-option=3,192.168.1.1
dhcp-option=6,192.168.1.1`}
      />

      <TerminalBlock
        comment="se for usar dnsmasq como único resolver, desligue resolved"
        command="sudo systemctl disable --now systemd-resolved && sudo systemctl enable --now dnsmasq"
        output={`Removed /etc/systemd/system/sysinit.target.wants/systemd-resolved.service.
Created symlink /etc/systemd/system/multi-user.target.wants/dnsmasq.service → /usr/lib/systemd/system/dnsmasq.service.`}
      />

      <TerminalBlock
        command="dig @127.0.0.1 nas.lan +short"
        output={`192.168.1.10`}
      />

      <h2>7. DNS over TLS / DNS over HTTPS</h2>

      <p>
        DNS tradicional vai em UDP/53 sem criptografia — qualquer roteador no caminho pode ver e
        modificar. <strong>DoT</strong> usa TLS na porta 853, <strong>DoH</strong> tunela DNS sobre
        HTTPS/443. O <code>systemd-resolved</code> suporta DoT nativamente; para DoH use{" "}
        <code>cloudflared</code> ou <code>dnscrypt-proxy</code>.
      </p>

      <CodeBlock
        title="Habilitar DoT no resolved"
        language="ini"
        code={`# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net
DNSOverTLS=yes
DNSSEC=allow-downgrade`}
      />

      <TerminalBlock
        command="sudo systemctl restart systemd-resolved && resolvectl status | grep -E 'DNSOverTLS|DNS Servers'"
        output={`         Protocols: +LLMNR -mDNS +DNSOverTLS DNSSEC=allow-downgrade/supported
       DNS Servers: 1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net`}
      />

      <TerminalBlock
        comment="DoH via dnscrypt-proxy (AUR ou extra)"
        command="sudo pacman -S dnscrypt-proxy"
      />

      <CodeBlock
        title="/etc/dnscrypt-proxy/dnscrypt-proxy.toml (trecho)"
        code={`listen_addresses = ['127.0.0.1:53']
server_names = ['cloudflare', 'cloudflare-ipv6', 'quad9-doh-ip4-port443-filter-pri']
require_dnssec = true
require_nolog = true
cache = true`}
      />

      <h2>8. Servidores DNS públicos populares</h2>

      <OutputBlock
        title="Comparativo rápido"
        output={`Provedor       IPv4              IPv6                    DoT host
Cloudflare     1.1.1.1 / 1.0.0.1 2606:4700:4700::1111   cloudflare-dns.com
Google         8.8.8.8 / 8.8.4.4 2001:4860:4860::8888   dns.google
Quad9          9.9.9.9           2620:fe::fe            dns.quad9.net (filtra malware)
OpenDNS        208.67.222.222    2620:119:35::35        (filtro pro/familiar)
NextDNS        45.90.28.x        2a07:a8c0::            (perfil customizado)
AdGuard DNS    94.140.14.14      2a10:50c0::ad1:ff      (bloqueia ads)`}
      />

      <TerminalBlock
        comment="benchmark caseiro de latência"
        command={`for s in 1.1.1.1 8.8.8.8 9.9.9.9 208.67.222.222; do
  printf "%-15s " $s
  dig @$s archlinux.org +stats 2>/dev/null | awk '/Query time/{print $4, $5}'
done`}
        output={`1.1.1.1         8 msec
8.8.8.8        18 msec
9.9.9.9        24 msec
208.67.222.222 41 msec`}
      />

      <h2>9. Troubleshooting</h2>

      <TerminalBlock
        comment="ping sem DNS — confirma conectividade L3"
        command="ping -c2 1.1.1.1"
        output={`PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.
64 bytes from 1.1.1.1: icmp_seq=1 ttl=58 time=8.42 ms
64 bytes from 1.1.1.1: icmp_seq=2 ttl=58 time=8.31 ms

--- 1.1.1.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms`}
      />

      <TerminalBlock
        comment="se IP funciona mas nome não, é DNS"
        command="ping -c1 archlinux.org"
        output={`ping: archlinux.org: Name or service not known`}
        exitCode={2}
      />

      <TerminalBlock
        comment="testa resolver direto, ignora cache local"
        command="dig @1.1.1.1 archlinux.org +short"
        output={`95.217.163.246`}
      />

      <TerminalBlock
        comment="confirma onde resolv.conf aponta"
        command="ls -l /etc/resolv.conf"
        output={`lrwxrwxrwx 1 root root 39 Mar 14 10:22 /etc/resolv.conf -> /run/systemd/resolve/stub-resolv.conf`}
      />

      <TerminalBlock
        comment="limpa cache se um nome 'gravou' valor errado"
        command="sudo resolvectl flush-caches"
        output=""
      />

      <TerminalBlock
        comment="sniffa o tráfego DNS pra ver o que sai do host"
        command="sudo tcpdump -ni any -s0 'port 53' -c 5"
        output={`tcpdump: data link type LINUX_SLL2
listening on any, link-type LINUX_SLL2 (Linux cooked v2), snapshot length 262144 bytes
14:42:11.124  enp3s0 Out IP 192.168.1.100.53412 > 1.1.1.1.53: 12345+ A? archlinux.org. (31)
14:42:11.135  enp3s0  In IP 1.1.1.1.53 > 192.168.1.100.53412: 12345 1/0/0 A 95.217.163.246 (47)
14:42:11.148  enp3s0 Out IP 192.168.1.100.53412 > 1.1.1.1.53: 12346+ AAAA? archlinux.org. (31)
14:42:11.158  enp3s0  In IP 1.1.1.1.53 > 192.168.1.100.53412: 12346 1/0/0 AAAA 2a01:4f9:c010:6b0c::1 (59)
5 packets captured`}
      />

      <AlertBox type="success" title="Receita de bolso">
        IP funciona, nome não → testa <code>dig @1.1.1.1 nome</code>. Resolveu? Problema é no
        resolver local: <code>resolvectl status</code> e <code>flush-caches</code>. Não resolveu?
        Problema é no DNS upstream — troque servidores ou olhe firewall/captive portal.
      </AlertBox>

      <h2>10. Resumo prático</h2>

      <OutputBlock
        title="Cola de bolso"
        output={`# Inspeção
resolvectl status            # quem é meu DNS, por interface
resolvectl statistics        # cache hits/misses
dig nome.tld +short          # IP rapidão
dig nome.tld                 # resposta completa
dig MX|NS|TXT|SOA nome.tld   # outros tipos
dig -x 8.8.8.8               # reverse PTR
dig @1.1.1.1 +trace nome.tld # recursão passo-a-passo

# Cache & overrides
sudo resolvectl flush-caches # limpa cache
echo '1.2.3.4 host.lan' | sudo tee -a /etc/hosts

# Configurar
sudo systemctl enable --now systemd-resolved
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
# /etc/systemd/resolved.conf.d/*.conf

# Sniff
sudo tcpdump -ni any port 53`}
      />
    </PageContainer>
  );
}
