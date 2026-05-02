import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function Ssh() {
  return (
    <PageContainer
      title="SSH — Secure Shell"
      subtitle="Acesse máquinas remotas com segurança: chaves Ed25519, ssh-agent, ~/.ssh/config, port forwarding, scp, rsync, sshfs — com output real de cada comando."
      difficulty="intermediario"
      timeToRead="50 min"
    >
      <p>
        O <strong>SSH</strong> é o protocolo padrão para shell remota criptografada. No Arch o pacote
        é o <code>openssh</code>, que traz tanto o cliente (<code>ssh</code>) quanto o servidor
        (<code>sshd</code>). Toda a operação aqui mostra o output verbatim.
      </p>

      <h2>1. Instalação e versão</h2>
      <TerminalBlock
        command="sudo pacman -S openssh"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) openssh-9.9p1-1

Total Download Size:   1.45 MiB
Total Installed Size:  6.21 MiB

:: Proceed with installation? [Y/n] Y
:: Retrieving packages...
 openssh-9.9p1-1-x86_64                 1486.4 KiB  3.21 MiB/s 00:00 [######################] 100%
(1/1) checking keys in keyring                       [######################] 100%
(1/1) checking package integrity                     [######################] 100%
(1/1) loading package files                          [######################] 100%
(1/1) checking for file conflicts                    [######################] 100%
(1/1) checking available disk space                  [######################] 100%
:: Processing package changes...
(1/1) installing openssh                             [######################] 100%`}
      />
      <TerminalBlock
        command="ssh -V"
        output={`OpenSSH_9.9p1, OpenSSL 3.4.0 22 Oct 2024`}
      />

      <h2>2. Conectando: primeiro contato com o servidor</h2>
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`The authenticity of host 'server.example.com (203.0.113.42)' can't be established.
ED25519 key fingerprint is SHA256:Lp9Wq3z2vK8YxJ5n/QmRtXcHsB1F4gNa7K0eVdU9oZk.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'server.example.com' (ED25519) to the list of known hosts.
{c}deploy@server.example.com's password:{/} {dim}********{/}
Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-49-generic x86_64)
Last login: Wed Jan 15 14:50:01 2025 from 192.168.1.100
deploy@server:~$`}
      />
      <p className="text-sm text-muted-foreground">
        Esse fingerprint é gravado em <code>~/.ssh/known_hosts</code>. Se um dia mudar (servidor
        reinstalado / MITM), o SSH recusa a conexão até você remover a entrada.
      </p>

      <h3>Variantes úteis</h3>
      <TerminalBlock
        command="ssh -p 2222 deploy@server.example.com"
        output={`deploy@server.example.com's password:`}
        comment="-p para porta diferente da 22"
      />
      <TerminalBlock
        command={`ssh deploy@server.example.com "uptime && df -h /"`}
        output={` 14:52:18 up 12 days,  3:14,  1 user,  load average: 0.18, 0.22, 0.30
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   28G   20G  59% /`}
        comment="executa comando remoto sem abrir shell interativo"
      />

      <h3>O temido fingerprint mismatch</h3>
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    {r}WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!{/}     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:NewKeyFingerprint...
Add correct host key in /home/user/.ssh/known_hosts to get rid of this message.
Offending ED25519 key in /home/user/.ssh/known_hosts:8
Host key verification failed.`}
        exitCode={255}
      />
      <TerminalBlock
        command="ssh-keygen -R server.example.com"
        output={`# Host server.example.com found: line 8
/home/user/.ssh/known_hosts updated.
Original contents retained as /home/user/.ssh/known_hosts.old`}
        comment="remove a entrada antiga; depois reconecte"
      />

      <h2>3. ssh-keygen — gerando o par de chaves</h2>
      <TerminalBlock
        command={`ssh-keygen -t ed25519 -C "user@laptop"`}
        output={`Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519): {dim}[Enter]{/}
Enter passphrase for "/home/user/.ssh/id_ed25519" (empty for no passphrase): {dim}********{/}
Enter same passphrase again: {dim}********{/}
Your identification has been saved in /home/user/.ssh/id_ed25519
Your public key has been saved in /home/user/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:Lp9Wq3z2vK8YxJ5n/QmRtXcHsB1F4gNa7K0eVdU9oZk user@laptop
The key's randomart image is:
+--[ED25519 256]--+
|       .o.+E*+.  |
|      . o.B.O *. |
|     . . o B.@.+ |
|      . . . *.O o|
|       .S.   o.o.|
|       . o   .o..|
|        . . . .o.|
|             .o+ |
|              ..+|
+----[SHA256]-----+`}
      />
      <TerminalBlock
        command="ls -la ~/.ssh/"
        output={`total 32
drwx------ 2 user user 4096 Jan 15 15:00 .
drwxr-xr-x 8 user user 4096 Jan 15 15:00 ..
-rw------- 1 user user  411 Jan 15 15:00 id_ed25519
-rw-r--r-- 1 user user   95 Jan 15 15:00 id_ed25519.pub
-rw-r--r-- 1 user user  444 Jan 15 14:51 known_hosts`}
      />
      <OutputBlock
        title="permissões críticas em ~/.ssh"
        output={`drwx------ 2 user user 4096 Jan 15 15:00 .
-rw------- 1 user user  411 Jan 15 15:00 id_ed25519
-rw-r--r-- 1 user user   95 Jan 15 15:00 id_ed25519.pub`}
        annotations={[
          { line: 0, note: "diretório precisa ser 700 (drwx------) — ssh recusa se for permissivo" },
          { line: 1, note: "chave PRIVADA: 600 obrigatório" },
          { line: 2, note: "chave pública: pode ser 644 (qualquer um pode ler)" },
        ]}
      />
      <TerminalBlock
        command="cat ~/.ssh/id_ed25519.pub"
        output={`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH8wQz5kVx2pT9eYr1mNa3uBcFwLgKjH7sR4tYvE6oXk user@laptop`}
      />

      <AlertBox type="warning" title="Por que Ed25519 e não RSA?">
        Ed25519 é mais rápido, gera chaves curtas (~80 chars) e tem segurança equivalente a RSA-3072.
        Use RSA 4096 só por compatibilidade com sistemas antigos (&lt; 2014).
      </AlertBox>

      <h2>4. Como o authorized_keys realmente funciona</h2>
      <p>
        A chave pública é como um "cadeado" copiado para o servidor — a chave privada (que nunca sai
        da sua máquina) é o que abre. O servidor desafia matematicamente, sem nunca pedir a chave
        privada pela rede.
      </p>

      <TerminalBlock
        command="cat ~/.ssh/authorized_keys"
        output={`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH8wQz5kVx2pT9eYr1mNa3uBcFwLgKjH7sR4tYvE6oXk user@laptop
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBxK2pQ9vZ8mYr3tNa1uHwLgKjFcRSeF4tYvE6oXkBz deploy@ci-runner
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDKlmZqRpC...HxjU9wq7tZ4 backup@nas.local
# Linha começando com # é comentário e é ignorada
# command="..." restringe o que essa chave pode fazer
command="rsync --server -vlogDtprze.iLsfx . /backups/",no-pty,no-port-forwarding ssh-ed25519 AAAAC3... backup-only@nas`}
      />
      <p className="text-sm text-muted-foreground">
        Cada linha = uma máquina autorizada. Apagou a linha = revogou o acesso (efeito imediato).
      </p>

      <h3>Fluxo completo: máquina A → máquina B</h3>
      <TerminalBlock
        prompt="user@laptop ~ $ "
        command="ssh-copy-id deploy@server.example.com"
        output={`/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/user/.ssh/id_ed25519.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
deploy@server.example.com's password: {dim}********{/}

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'deploy@server.example.com'"
and check to make sure that only the key(s) you wanted were added.`}
      />
      <TerminalBlock
        prompt="user@laptop ~ $ "
        command="ssh deploy@server.example.com"
        output={`Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-49-generic x86_64)
Last login: Wed Jan 15 14:52:18 2025 from 192.168.1.100
deploy@server:~$`}
        comment="agora sem senha — graças à chave"
      />

      <h3>Forma manual (quando ssh-copy-id não está disponível)</h3>
      <TerminalBlock
        command={`cat ~/.ssh/id_ed25519.pub | ssh deploy@server.example.com \\
    "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"`}
        output={`deploy@server.example.com's password:`}
      />

      <h2>5. ssh -v / -vv / -vvv — debug verboso</h2>
      <TerminalBlock
        command="ssh -v deploy@server.example.com"
        output={`OpenSSH_9.9p1, OpenSSL 3.4.0 22 Oct 2024
debug1: Reading configuration data /home/user/.ssh/config
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Connecting to server.example.com [203.0.113.42] port 22.
debug1: Connection established.
debug1: identity file /home/user/.ssh/id_ed25519 type 3
debug1: Local version string SSH-2.0-OpenSSH_9.9
debug1: Remote protocol version 2.0, remote software version OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
debug1: Authenticating to server.example.com:22 as 'deploy'
debug1: kex: algorithm: curve25519-sha256
debug1: kex: host key algorithm: ssh-ed25519
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
debug1: Server host key: ssh-ed25519 SHA256:Lp9Wq3z2vK8YxJ5n/QmRtXcHsB1F4gNa7K0eVdU9oZk
debug1: Host 'server.example.com' is known and matches the ED25519 host key.
debug1: Authentications that can continue: publickey,password
debug1: Next authentication method: publickey
debug1: Offering public key: /home/user/.ssh/id_ed25519 ED25519 SHA256:Lp9Wq...
debug1: Server accepts key: /home/user/.ssh/id_ed25519 ED25519 SHA256:Lp9Wq...
{g}Authenticated to server.example.com ([203.0.113.42]:22) using "publickey".{/}
debug1: channel 0: new [client-session]`}
      />

      <h2>6. ~/.ssh/config — atalhos e configurações</h2>
      <CodeBlock
        title="~/.ssh/config — exemplos práticos"
        code={`# Atalho para um servidor específico
Host prod
    HostName prod.empresa.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/keys/prod_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 60

# Bastion / jump host
Host db
    HostName db-internal.empresa.com
    User dba
    ProxyJump prod        # passa por 'prod' antes de chegar em 'db'

# Wildcard pra GitHub (qualquer host *.github.com)
Host *.github.com
    User git
    IdentityFile ~/.ssh/keys/github_ed25519
    AddKeysToAgent yes

# Regra global no final
Host *
    AddKeysToAgent yes
    HashKnownHosts yes
    ServerAliveInterval 120
    ServerAliveCountMax 3`}
      />
      <TerminalBlock
        command="ssh prod"
        comment="equivale a: ssh -p 2222 -i ~/.ssh/keys/prod_ed25519 deploy@prod.empresa.com"
        output={`Welcome to prod.empresa.com
deploy@prod:~$`}
      />
      <TerminalBlock
        command="ssh db"
        output={`# Conecta via ProxyJump (passa por 'prod' transparentemente)
dba@db:~$`}
      />

      <h2>7. ssh-agent — passphrase só uma vez</h2>
      <TerminalBlock
        command={`eval "$(ssh-agent -s)"`}
        output={`Agent pid 8421`}
      />
      <TerminalBlock
        command="ssh-add ~/.ssh/id_ed25519"
        output={`Enter passphrase for /home/user/.ssh/id_ed25519: {dim}********{/}
Identity added: /home/user/.ssh/id_ed25519 (user@laptop)`}
      />
      <TerminalBlock
        command="ssh-add -l"
        output={`256 SHA256:Lp9Wq3z2vK8YxJ5n/QmRtXcHsB1F4gNa7K0eVdU9oZk user@laptop (ED25519)`}
        comment="-l = list (resumido); -L = mostra a chave pública completa"
      />
      <TerminalBlock
        command="ssh-add -t 8h ~/.ssh/keys/prod_ed25519"
        output={`Enter passphrase for /home/user/.ssh/keys/prod_ed25519:
Identity added: /home/user/.ssh/keys/prod_ed25519 (deploy@prod)
Lifetime set to 28800 seconds`}
        comment="-t define expiração (boa prática)"
      />
      <TerminalBlock
        command="ssh-add -D"
        output={`All identities removed.`}
      />

      <h2>8. scp — copiar arquivos</h2>
      <TerminalBlock
        command="scp ./relatorio.pdf deploy@server.example.com:~/docs/"
        output={`relatorio.pdf                                100% 4218KB   3.1MB/s   00:01`}
      />
      <TerminalBlock
        command="scp deploy@server.example.com:/var/log/nginx/access.log ./access.log.bak"
        output={`access.log                                   100%   28MB  18.4MB/s   00:01`}
      />
      <TerminalBlock
        command="scp -r ./projeto/ deploy@server.example.com:/var/www/"
        output={`index.html                                   100% 4324    9.8KB/s   00:00
style.css                                    100%  812    2.1KB/s   00:00
app.js                                       100%  21KB  41.2KB/s   00:00
img/logo.png                                 100%  88KB 124.0KB/s   00:00`}
        comment="-r recursivo (copia diretório inteiro)"
      />
      <TerminalBlock
        command="scp -P 2222 backup.tar.gz deploy@server.example.com:~/"
        output={`backup.tar.gz                                100% 1024MB  21.4MB/s   00:48`}
        comment="atenção: -P maiúsculo no scp (porta)"
      />

      <h2>9. rsync — espelhar diretórios via SSH</h2>
      <TerminalBlock
        command="rsync -av --progress ./site/ deploy@server.example.com:/var/www/site/"
        output={`sending incremental file list
./
index.html
              4,324 100%    0.00kB/s    0:00:00 (xfr#1, to-chk=18/20)
style.css
                812 100%  792.97kB/s    0:00:00 (xfr#2, to-chk=17/20)
app.js
             21,488 100%   20.49MB/s    0:00:00 (xfr#3, to-chk=16/20)
img/
img/logo.png
             88,012 100%   83.92MB/s    0:00:00 (xfr#4, to-chk=15/20)
...
sent 4,832,118 bytes  received 1,024 bytes  967,028.40 bytes/sec
total size is 4,829,001  speedup is 1.00`}
      />
      <TerminalBlock
        command="rsync -av --delete --dry-run ./site/ deploy@server.example.com:/var/www/site/"
        output={`sending incremental file list
deleting old-page.html
deleting old-styles.css

sent 312 bytes  received 14 bytes  217.33 bytes/sec
total size is 4,829,001  speedup is 14,812.27 (DRY RUN)`}
        comment="--dry-run mostra o que faria sem alterar nada"
      />
      <OutputBlock
        title="flags do rsync que você vai usar muito"
        output={`-a       --archive          mantém tudo (perms, owner, time, links, recursivo)
-v       --verbose          fala o que está fazendo
-z       --compress         compressão durante a transferência
-P       --partial+progress retoma transfers interrompidos + barra
--delete                    apaga no destino o que sumiu na origem (espelho exato)
--dry-run                   simula
-e ssh -p 2222              porta SSH custom`}
      />

      <h2>10. SSH Tunneling (port forwarding)</h2>

      <h3>Local (-L) — acessar serviço remoto pela sua porta local</h3>
      <TerminalBlock
        command="ssh -L 5433:localhost:5432 -N deploy@server.example.com"
        output={`# (sem output — fica em foreground; -N = não abre shell)`}
        comment="agora 'localhost:5433' na sua máquina = postgres do servidor"
      />
      <TerminalBlock
        command="psql -h localhost -p 5433 -U postgres"
        output={`Password for user postgres:
psql (16.3)
Type "help" for help.

postgres=#`}
        comment="está conectando no postgres remoto através do túnel"
      />

      <h3>Remoto (-R) — expor sua porta local pro servidor</h3>
      <TerminalBlock
        command="ssh -R 9000:localhost:8080 deploy@server.example.com"
        output={`deploy@server:~$ curl http://localhost:9000
<!DOCTYPE html>
<html>... resposta vinda do seu app local rodando na 8080</html>`}
      />

      <h3>Dinâmico (-D) — proxy SOCKS5</h3>
      <TerminalBlock
        command="ssh -D 1080 -N deploy@server.example.com"
        output=""
        comment="agora aponte o navegador para SOCKS5 localhost:1080 = todo tráfego sai pelo servidor"
      />

      <h3>Background</h3>
      <TerminalBlock
        command="ssh -L 5433:localhost:5432 -N -f deploy@server.example.com"
        output=""
        comment={`-f = fork pro background; mate com 'pkill -f "ssh -L 5433"'`}
      />

      <h2>11. Servidor SSH (sshd)</h2>
      <TerminalBlock
        command="sudo systemctl enable --now sshd"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/sshd.service → /usr/lib/systemd/system/sshd.service.`}
      />
      <TerminalBlock
        command="sudo systemctl status sshd"
        output={`● sshd.service - OpenSSH Daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Wed 2025-01-15 15:10:22 UTC; 1min 12s ago
   Main PID: 8901 (sshd)
      Tasks: 1 (limit: 4631)
     Memory: 2.4M
        CPU: 38ms
     CGroup: /system.slice/sshd.service
             └─8901 "sshd: /usr/bin/sshd -D [listener] 0 of 10-100 startups"

Jan 15 15:10:22 archlinux systemd[1]: Started sshd.service - OpenSSH Daemon.
Jan 15 15:10:22 archlinux sshd[8901]: Server listening on 0.0.0.0 port 22.
Jan 15 15:10:22 archlinux sshd[8901]: Server listening on :: port 22.`}
      />

      <CodeBlock
        title="/etc/ssh/sshd_config — endurecimento recomendado"
        code={`Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
MaxAuthTries 3
MaxSessions 5
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy admin
LogLevel VERBOSE`}
      />
      <TerminalBlock
        command="sudo sshd -t"
        output=""
        comment="-t = test config; sem output significa que está OK"
      />
      <TerminalBlock
        command="sudo sshd -t"
        output={`/etc/ssh/sshd_config: line 14: Bad configuration option: PassWordAuthentication
/etc/ssh/sshd_config: terminating, 1 bad configuration options`}
        exitCode={1}
        comment="erro de typo — sempre teste antes de restart!"
      />
      <TerminalBlock
        command="sudo systemctl reload sshd"
        output=""
        comment="reload = re-lê config sem matar conexões existentes"
      />

      <h2>12. Diagnóstico: SSH não conecta</h2>

      <AlertBox type="info" title="Regra de ouro">
        Se <code>nc -zv host 22</code> falha → problema de rede/firewall. Se conecta mas SSH recusa
        → problema de chaves/sshd_config/permissões.
      </AlertBox>

      <TerminalBlock
        command="nc -zv server.example.com 22"
        output={`Connection to server.example.com (203.0.113.42) 22 port [tcp/ssh] succeeded!`}
      />
      <TerminalBlock
        command="ss -tlnp | grep -E ':22 '"
        output={`LISTEN  0  128         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=8901,fd=3))
LISTEN  0  128            [::]:22            [::]:*    users:(("sshd",pid=8901,fd=4))`}
      />
      <TerminalBlock
        command="sudo journalctl -u sshd -f"
        output={`Jan 15 15:15:11 archlinux sshd[9012]: Accepted publickey for deploy from 192.168.1.100 port 51234 ssh2: ED25519 SHA256:Lp9W...
Jan 15 15:15:11 archlinux sshd[9012]: pam_unix(sshd:session): session opened for user deploy(uid=1001) by (uid=0)
Jan 15 15:16:42 archlinux sshd[9050]: Failed password for invalid user admin from 198.51.100.7 port 44012 ssh2
Jan 15 15:16:44 archlinux sshd[9050]: Connection closed by invalid user admin 198.51.100.7 port 44012 [preauth]`}
      />
      <TerminalBlock
        command="ssh -vvv deploy@server.example.com 2>&1 | grep -E 'debug1: (Authenticat|Offer|Trying|Server accepts)'"
        output={`debug1: Authenticating to server.example.com:22 as 'deploy'
debug1: Offering public key: /home/user/.ssh/id_ed25519 ED25519
debug1: Server accepts key: /home/user/.ssh/id_ed25519 ED25519
debug1: Authenticated to server.example.com ([203.0.113.42]:22) using "publickey".`}
      />

      <h3>Erros comuns e o que significam</h3>
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`Permission denied (publickey).`}
        exitCode={255}
        comment="servidor recusou: chave não está em authorized_keys, ou perms ruins"
      />
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`ssh: connect to host server.example.com port 22: Connection refused`}
        exitCode={255}
        comment="sshd não está rodando ou está em outra porta"
      />
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`ssh: connect to host server.example.com port 22: Connection timed out`}
        exitCode={255}
        comment="firewall bloqueando ou host inacessível"
      />
      <TerminalBlock
        command="ssh deploy@server.example.com"
        output={`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/home/user/.ssh/id_ed25519' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.`}
        comment="solução: chmod 600 ~/.ssh/id_ed25519"
      />

      <h2>13. Firewall — abrindo a porta SSH</h2>

      <TerminalBlock
        command="sudo ufw status verbose"
        output={`Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)`}
      />
      <TerminalBlock
        command="sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp"
        output={`Rule added`}
      />
      <TerminalBlock
        command="sudo nft list ruleset"
        output={`table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        ct state established,related accept
        iif "lo" accept
        tcp dport 22 accept
        tcp dport { 80, 443 } accept
        ip protocol icmp accept
    }
}`}
      />

      <AlertBox type="warning" title="NUNCA habilite firewall remotamente sem liberar SSH antes">
        Em VPS sem acesso ao console: <code>sudo ufw allow ssh && sudo ufw enable</code> em uma
        única linha. Ou pior: combine com um <code>at now + 5 minutes &lt;&lt;&lt; "ufw disable"</code>{" "}
        para autorrecuperação caso erre.
      </AlertBox>

      <h2>14. Boas práticas — recapitulando</h2>
      <CodeBlock
        title="Endurecimento progressivo"
        code={`# 1. Trocar porta padrão (reduz brute-force ruidoso)
Port 2222

# 2. Sem login root direto
PermitRootLogin no

# 3. Sem senha (após confirmar que sua chave funciona!)
PasswordAuthentication no
ChallengeResponseAuthentication no

# 4. Limitar quem pode conectar
AllowUsers deploy admin

# 5. Fail2ban para banir IPs com tentativas
sudo pacman -S fail2ban
sudo systemctl enable --now fail2ban

# 6. ssh-audit para auditar a config
yay -S ssh-audit
ssh-audit server.example.com

# 7. Revisar authorized_keys regularmente
cat ~/.ssh/authorized_keys`}
      />

      <h2>15. Referências</h2>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/OpenSSH" target="_blank" rel="noopener noreferrer">ArchWiki — OpenSSH</a></li>
        <li><a href="https://wiki.archlinux.org/title/SSH_keys" target="_blank" rel="noopener noreferrer">ArchWiki — SSH keys</a></li>
        <li><a href="https://man.openbsd.org/sshd_config" target="_blank" rel="noopener noreferrer">man sshd_config (OpenBSD)</a></li>
        <li><code>man ssh</code>, <code>man ssh_config</code>, <code>man ssh-keygen</code>, <code>man scp</code>, <code>man rsync</code></li>
      </ul>
    </PageContainer>
  );
}
