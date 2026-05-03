import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Fail2Ban() {
  return (
    <PageContainer
      title="Fail2Ban — banindo brute-force"
      subtitle="Detecta tentativas falhas em logs (sshd, nginx, postfix...) e bane o IP via iptables/nftables/firewalld. Setup completo no Arch."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Segurança"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Server, <code>sudo pacman -S fail2ban</code>, SSH habilitado.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Fail2Ban</strong> — daemon Python que monitora logs e bane IPs suspeitos via iptables/nftables/firewalld.
      </p>
      <p>
        <strong>Jail</strong> — regra que combina filtro + ação. Cada serviço (sshd, apache) tem sua jail.
      </p>
      <p>
        <strong>Filter</strong> — expressão regular que reconhece falhas no log do serviço.
      </p>
      <p>
        <strong>jail.local</strong> — sobrescreve <code>jail.conf</code>. Sempre edite o <code>.local</code>, nunca o <code>.conf</code>.
      </p>

      <p>
        O <code>fail2ban</code> é um daemon Python que <strong>monitora arquivos de log</strong> com regex
        e, quando detecta padrões de ataque (login SSH falho, 401 abusivo no nginx, etc), aciona uma
        <strong> action</strong> — tipicamente uma regra de firewall que bloqueia o IP por X minutos.
      </p>

      <AlertBox type="info" title="Para que serve mesmo se eu já tenho chave SSH?">
        Mesmo com <code>PasswordAuthentication no</code>, bots vão bater no seu sshd o dia inteiro,
        consumindo CPU/banda e enchendo logs. fail2ban corta esse ruído e te dá visibilidade dos IPs
        que mais atacam.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S fail2ban"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (2) python-systemd-235-3  fail2ban-1.1.0-1

Total Installed Size:  3.42 MiB

:: Proceed with installation? [Y/n] y
(1/2) installing python-systemd      [####################] 100%
(2/2) installing fail2ban            [####################] 100%
:: Running post-transaction hooks...
(1/2) Reloading system manager configuration...
(2/2) Arming ConditionNeedsUpdate...`}
      />

      <h2>2. Estrutura de configuração</h2>

      <OutputBlock
        title="hierarquia em /etc/fail2ban/"
        output={`/etc/fail2ban/
├── fail2ban.conf       configuração do daemon (NÃO mexa)
├── fail2ban.d/         overrides do daemon
├── jail.conf           jails padrão (NÃO mexa)
├── jail.d/             SUAS jails customizadas (recomendado)
├── jail.local          OU sobrescrever tudo aqui
├── filter.d/           regex para detectar ataques
└── action.d/           o que fazer (iptables, nftables, mail...)`}
        annotations={[
          { line: 1, note: "vem do pacote, sobrescrito em update" },
          { line: 4, note: "EDITE AQUI" },
        ]}
      />

      <AlertBox type="warning" title="Regra de ouro: nunca edite *.conf">
        Atualizações do pacote sobrescrevem <code>jail.conf</code>. Sempre crie
        <code> /etc/fail2ban/jail.local</code> ou arquivos em <code>/etc/fail2ban/jail.d/*.local</code>{" "}
        — eles têm precedência e ficam intocados em <code>pacman -Syu</code>.
      </AlertBox>

      <h2>3. Configuração mínima — proteger SSH</h2>

      <CodeBlock
        title="/etc/fail2ban/jail.local"
        language="ini"
        code={`[DEFAULT]
# tempo de ban
bantime  = 1h
# janela de detecção
findtime = 10m
# nº de falhas para banir
maxretry = 5
# IPs que NUNCA serão banidos (sua rede, gateway etc)
ignoreip = 127.0.0.1/8 ::1 192.168.0.0/24
# backend do firewall (auto detecta nftables/iptables/firewalld)
banaction = iptables-multiport
# email opcional
destemail = root@localhost
sender    = fail2ban@archlinux

[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = %(sshd_log)s
backend  = systemd
maxretry = 3
bantime  = 24h`}
      />

      <h2>4. Habilitar e iniciar o serviço</h2>

      <TerminalBlock
        command="sudo systemctl enable --now fail2ban.service"
        output={`Created symlink '/etc/systemd/system/multi-user.target.wants/fail2ban.service' → '/usr/lib/systemd/system/fail2ban.service'.`}
      />

      <TerminalBlock
        command="systemctl status fail2ban"
        output={`{g}● fail2ban.service{/} - Fail2Ban Service
     Loaded: loaded (/usr/lib/systemd/system/fail2ban.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-26 14:22:18 -03; 12s ago
       Docs: man:fail2ban(1)
   Main PID: 4582 (fail2ban-server)
      Tasks: 5 (limit: 38389)
     Memory: 18.4M
     CGroup: /system.slice/fail2ban.service
             └─4582 /usr/bin/python3 /usr/bin/fail2ban-server -xf start

Mar 26 14:22:18 archlinux systemd[1]: Started Fail2Ban Service.
Mar 26 14:22:19 archlinux fail2ban-server[4582]: Server ready
Mar 26 14:22:19 archlinux fail2ban-server[4582]: Jail 'sshd' started`}
      />

      <h2>5. fail2ban-client — a CLI principal</h2>

      <CommandFlagList
        command="fail2ban-client"
        items={[
          { flag: "status", description: "Status geral (jails ativas).", example: "sudo fail2ban-client status" },
          { flag: "status JAIL", description: "Detalhe de uma jail (banidos, falhas).", example: "sudo fail2ban-client status sshd" },
          { flag: "set JAIL banip IP", description: "Bane um IP manualmente.", example: "sudo fail2ban-client set sshd banip 1.2.3.4" },
          { flag: "set JAIL unbanip IP", description: "Remove um IP banido." },
          { flag: "unban --all", description: "Remove TODOS os bans." },
          { flag: "reload", description: "Recarrega configuração sem reiniciar.", example: "sudo fail2ban-client reload" },
          { flag: "reload JAIL", description: "Reload só de uma jail." },
          { flag: "ping", description: "Testa se o daemon responde (retorna pong)." },
          { flag: "get JAIL bantime", description: "Lê uma propriedade da jail." },
          { flag: "stop", description: "Para o daemon." },
        ]}
      />

      <TerminalBlock
        command="sudo fail2ban-client status"
        output={`Status
|- Number of jail:      1
\`- Jail list:   sshd`}
      />

      <TerminalBlock
        command="sudo fail2ban-client status sshd"
        output={`Status for the jail: sshd
|- Filter
|  |- Currently failed: 2
|  |- Total failed:     142
|  \`- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd
\`- Actions
   |- Currently banned: 4
   |- Total banned:     27
   \`- Banned IP list:   45.142.193.18 218.92.0.45 91.92.244.68 103.115.243.12`}
      />

      <h2>6. Banir e desbanir manualmente</h2>

      <TerminalBlock
        command="sudo fail2ban-client set sshd banip 198.51.100.42"
        output="1"
      />

      <TerminalBlock
        command="sudo fail2ban-client set sshd unbanip 198.51.100.42"
        output="1"
      />

      <TerminalBlock
        comment="ver todos os bans atuais e remover de uma vez"
        command="sudo fail2ban-client unban --all"
        output={`27`}
      />

      <h2>7. Verificando o firewall (nftables / iptables)</h2>

      <TerminalBlock
        comment="se você usa nftables (default no Arch moderno)"
        command="sudo nft list set inet f2b-table addr-set-sshd"
        output={`table inet f2b-table {
        set addr-set-sshd {
                type ipv4_addr
                elements = { 45.142.193.18, 218.92.0.45, 91.92.244.68, 103.115.243.12 }
        }
}`}
      />

      <TerminalBlock
        comment="ou se ainda usa iptables"
        command="sudo iptables -L f2b-sshd -n --line-numbers"
        output={`Chain f2b-sshd (1 references)
num  target     prot opt source               destination
1    REJECT     all  --  45.142.193.18        0.0.0.0/0            reject-with icmp-port-unreachable
2    REJECT     all  --  218.92.0.45          0.0.0.0/0            reject-with icmp-port-unreachable
3    REJECT     all  --  91.92.244.68         0.0.0.0/0            reject-with icmp-port-unreachable
4    REJECT     all  --  103.115.243.12       0.0.0.0/0            reject-with icmp-port-unreachable
5    RETURN     all  --  0.0.0.0/0            0.0.0.0/0`}
      />

      <h2>8. Configurando para nftables (recomendado no Arch)</h2>

      <CodeBlock
        title="/etc/fail2ban/jail.d/00-firewalld.local"
        language="ini"
        code={`[DEFAULT]
banaction       = nftables[type=multiport]
banaction_allports = nftables[type=allports]
chain           = INPUT`}
      />

      <h2>9. Logs do próprio fail2ban</h2>

      <TerminalBlock
        command="sudo journalctl -u fail2ban -n 10 --no-pager"
        output={`Mar 26 14:22:19 archlinux fail2ban-server[4582]: Server ready
Mar 26 14:22:19 archlinux fail2ban-server[4582]: Jail 'sshd' started
Mar 26 14:33:11 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 218.92.0.45 - 2026-03-26 14:33:11
Mar 26 14:33:14 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 218.92.0.45 - 2026-03-26 14:33:14
Mar 26 14:33:18 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 218.92.0.45 - 2026-03-26 14:33:18
Mar 26 14:33:18 archlinux fail2ban-server[4582]: NOTICE  [sshd] Ban 218.92.0.45
Mar 26 15:02:42 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 91.92.244.68 - 2026-03-26 15:02:42
Mar 26 15:02:48 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 91.92.244.68 - 2026-03-26 15:02:48
Mar 26 15:02:53 archlinux fail2ban-server[4582]: NOTICE  [sshd] Found 91.92.244.68 - 2026-03-26 15:02:53
Mar 26 15:02:53 archlinux fail2ban-server[4582]: NOTICE  [sshd] Ban 91.92.244.68`}
      />

      <h2>10. Testando uma regex de filter</h2>

      <CommandFlagList
        command="fail2ban-regex"
        items={[
          { flag: "logfile filter", description: "Roda regex contra log e mostra matches.", example: "fail2ban-regex /var/log/nginx/error.log /etc/fail2ban/filter.d/nginx-http-auth.conf" },
          { flag: "--print-all-matched", description: "Imprime cada linha que casou." },
          { flag: "--print-no-missed", description: "Esconde linhas que NÃO casaram." },
          { flag: "systemd-journal[unit=sshd.service] filter", description: "Lê do journal em vez de arquivo." },
        ]}
      />

      <TerminalBlock
        command="sudo fail2ban-regex systemd-journal[_SYSTEMD_UNIT=sshd.service] /etc/fail2ban/filter.d/sshd.conf"
        output={`Running tests
=============

Use   failregex filter file : sshd, basedir: /etc/fail2ban
Use   datepattern : Default Detectors

Results
=======

Failregex: 142 total
|-  #) [# of hits] regular expression
|   3) [128] ^Failed \\S+ for (?P<F-USER>\\S+|(?:invalid|illegal user) (?:\\S+)) from <HOST>
|   4) [14] ^Connection (?:closed|reset) by (?:authenticating|invalid) user .* <HOST>
\`-

Date template hits:
|- [# of hits] date format
|  [3214] {^LN-BEG}MM(?P<_sep>-?)DD(?P=_sep)?\\s+TIME

Lines: 3214 lines, 0 ignored, 142 matched, 3072 missed
[processed in 0.42 sec]`}
      />

      <h2>11. Jails extras (nginx, postfix, recidive)</h2>

      <CodeBlock
        title="/etc/fail2ban/jail.d/web.local"
        language="ini"
        code={`[nginx-http-auth]
enabled  = true
port     = http,https
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log
maxretry = 5

[nginx-botsearch]
enabled  = true
port     = http,https
filter   = nginx-botsearch
logpath  = /var/log/nginx/access.log
maxretry = 2

[recidive]
# bane por 1 SEMANA quem reincidir em qualquer jail
enabled  = true
filter   = recidive
logpath  = /var/log/fail2ban.log
banaction = iptables-allports
bantime  = 1w
findtime = 1d
maxretry = 3`}
      />

      <h2>12. Whitelist permanente (ignoreip)</h2>

      <p>
        Sua máquina/VPN não pode ser banida por engano. Adicione no
        <code> [DEFAULT]</code>:
      </p>

      <CodeBlock
        language="ini"
        code={`ignoreip = 127.0.0.1/8 ::1 192.168.0.0/24 10.8.0.0/24 200.123.45.67`}
      />

      <TerminalBlock command="sudo fail2ban-client reload" output="OK" />

      <h2>13. Notificação por email opcional</h2>

      <p>
        Se você quer receber email a cada ban (útil em VPS isolada), instale um MTA simples
        (<code>sudo pacman -S msmtp-mta</code>) e use a action <code>%(action_mwl)s</code>:
      </p>

      <CodeBlock
        language="ini"
        code={`[DEFAULT]
destemail = admin@meusite.com
sender    = alerts@meusite.com
mta       = sendmail
action    = %(action_mwl)s
# action_mwl = ban + email + whois + log lines`}
      />

      <h2>14. Resumo prático</h2>

      <OutputBlock
        title="comandos do dia-a-dia"
        output={`sudo systemctl status fail2ban             daemon ok?
sudo fail2ban-client status                lista de jails
sudo fail2ban-client status sshd           IPs banidos no sshd
sudo fail2ban-client set sshd banip IP     ban manual
sudo fail2ban-client set sshd unbanip IP   unban manual
sudo fail2ban-client unban --all           limpar tudo
sudo fail2ban-client reload                aplicar mudanças no jail.local
sudo journalctl -u fail2ban -f             acompanhar bans em tempo real`}
      />

      <AlertBox type="success" title="Combo de produção">
        SSH-key only (<code>PasswordAuthentication no</code>) + UFW/nftables com porta SSH em
        número não-padrão + fail2ban com <code>recidive</code> = ataques reduzem ~99% no journal.
      </AlertBox>
    </PageContainer>
  );
}
