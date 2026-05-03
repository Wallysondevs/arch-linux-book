import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Samba() {
  return (
    <PageContainer
      title="Samba — compartilhamento SMB/CIFS"
      subtitle="Sirva pastas para Windows, macOS, Android e outros Linuxes usando o protocolo SMB. Configuração mínima, autenticação por usuário e tudo gerenciado por systemd."
      difficulty="intermediario"
      timeToRead="45 min"
      category="Servidores"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo pacman -S samba</code>. Útil ter rede local com Windows ou outros Linux.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Samba</strong> — implementação livre dos protocolos SMB/CIFS.
      </p>
      <p>
        <strong>SMB / CIFS</strong> — protocolo de compartilhamento de arquivos do Windows.
      </p>
      <p>
        <strong>smb.conf</strong> — configuração principal — <code>/etc/samba/smb.conf</code>.
      </p>
      <p>
        <strong>smbpasswd</strong> — define a senha Samba do usuário (separada da do sistema).
      </p>

      <p>
        Samba é a implementação livre do protocolo <strong>SMB/CIFS</strong> — o mesmo que o
        Windows usa para compartilhar pastas e impressoras na rede local. Com ele, seu Arch
        vira um servidor de arquivos invisível para o Explorer do Windows, para o Finder do
        macOS, para o gerenciador de arquivos do GNOME/KDE e para qualquer app de Android que
        fale SMB. Esta página foca no caso mais comum: <em>compartilhar uma pasta para outros
        computadores na sua LAN, com autenticação por usuário</em>.
      </p>

      <AlertBox type="info" title="SMB1, SMB2, SMB3">
        SMB1 é antigo, inseguro e desativado por padrão no Windows 10/11. O Samba moderno
        negocia <strong>SMB3</strong> automaticamente (criptografia, assinatura, conexão
        múltipla). Você não precisa configurar nada — só não force <code>min protocol = NT1</code>
        no <code>smb.conf</code>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S samba"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (3) cifs-utils-7.0-3  ldb-2.9.0-1  samba-4.20.2-1

Total Installed Size:  72.41 MiB

:: Proceed with installation? [Y/n] y
:: Processing package changes...
(1/3) installing ldb                               [######################] 100%
(2/3) installing cifs-utils                        [######################] 100%
(3/3) installing samba                             [######################] 100%
:: Running post-transaction hooks...
==> Default config not present. Copy /etc/samba/smb.conf.default to /etc/samba/smb.conf`}
      />

      <AlertBox type="warning" title="O smb.conf NÃO existe após o install">
        Diferente do Ubuntu/Debian, no Arch o pacote não copia o exemplo automaticamente. Você
        precisa criar o arquivo do zero ou copiar do template oficial:{" "}
        <code>sudo cp /etc/samba/smb.conf.default /etc/samba/smb.conf</code>. Sem ele, os
        serviços <code>smb</code> e <code>nmb</code> falham ao iniciar.
      </AlertBox>

      <h2>2. Anatomia do <code>/etc/samba/smb.conf</code></h2>

      <p>
        O arquivo é dividido em <strong>seções</strong> entre colchetes. A seção{" "}
        <code>[global]</code> define configurações do servidor inteiro; cada outra seção é um{" "}
        <strong>share</strong> (pasta exposta).
      </p>

      <CodeBlock
        title="/etc/samba/smb.conf — configuração mínima recomendada"
        code={`#============= Global Settings =============
[global]
   workgroup = WORKGROUP
   server string = Arch Samba %v
   netbios name = ARCHSRV
   security = user
   map to guest = Bad User
   server min protocol = SMB2
   server signing = auto
   client min protocol = SMB2
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file
   panic action = /usr/share/samba/panic-action %d

#============= Share Definitions =============
[publico]
   comment = Pasta pública (read-only, sem login)
   path = /srv/samba/publico
   browseable = yes
   read only = yes
   guest ok = yes

[familia]
   comment = Compartilhamento familiar (login obrigatório)
   path = /srv/samba/familia
   browseable = yes
   read only = no
   valid users = @familia
   create mask = 0660
   directory mask = 0770
   force group = familia

[joao]
   comment = Home do João via SMB
   path = /home/joao/Compartilhado
   browseable = no
   read only = no
   valid users = joao
   create mask = 0600
   directory mask = 0700`}
      />

      <h3>2.1. As diretivas que valem decorar</h3>

      <CommandFlagList
        command="smb.conf — diretivas essenciais"
        items={[
          { flag: "workgroup", description: "Nome do workgroup SMB (padrão Windows: WORKGROUP). Precisa bater com o dos clientes." },
          { flag: "server string", description: <>Texto descritivo do servidor (aparece no Explorer). <code>%v</code> = versão.</> },
          { flag: "netbios name", description: "Como o servidor aparece em redes via broadcast NetBIOS (até 15 chars, sem espaços)." },
          { flag: "security", description: <><code>user</code> = autenticação por usuário (padrão moderno). Outros valores quase nunca usados.</> },
          { flag: "map to guest", description: <><code>Bad User</code> = se o usuário não existir, trata como convidado. Permite shares <code>guest ok</code>.</> },
          { flag: "path", description: "Diretório real no FS Linux que está sendo exposto." },
          { flag: "browseable", description: "Se yes, aparece na lista de shares do servidor; se no, é 'oculto' (mas acessível por path)." },
          { flag: "read only", description: "yes = somente leitura. Equivale a writable = no." },
          { flag: "guest ok", description: "Permite acesso anônimo (sem login). Combina com map to guest." },
          { flag: "valid users", description: <>Lista de usuários permitidos. Use <code>@grupo</code> para grupo Linux.</> },
          { flag: "create mask", description: "Permissão Linux dos arquivos criados via SMB (mascara o que o cliente pediu)." },
          { flag: "directory mask", description: "Idem, mas para diretórios criados." },
          { flag: "force group", description: "Todo arquivo criado herda esse grupo (independente do GID do usuário)." },
        ]}
      />

      <h2>3. Criando o diretório e ajustando permissões</h2>

      <TerminalBlock
        command={`sudo mkdir -p /srv/samba/{publico,familia}`}
      />

      <TerminalBlock
        comment="público: leitura para todo mundo (nobody:nobody)"
        command={`sudo chown -R nobody:nobody /srv/samba/publico && sudo chmod -R 0755 /srv/samba/publico`}
      />

      <TerminalBlock
        comment="familia: cria o grupo Linux que dá acesso"
        command={`sudo groupadd familia && sudo usermod -aG familia joao && sudo usermod -aG familia maria`}
      />

      <TerminalBlock
        command={`sudo chown -R root:familia /srv/samba/familia && sudo chmod -R 2770 /srv/samba/familia`}
      />

      <p>
        O bit <strong>setgid</strong> (o <code>2</code> no <code>2770</code>) é importante:
        garante que arquivos novos herdem o grupo <code>familia</code> automaticamente.
      </p>

      <TerminalBlock
        command="ls -ld /srv/samba/familia"
        output="drwxrws--- 2 root familia 4096 Mar 26 18:42 /srv/samba/familia"
      />

      <h2>4. Cadastrando usuários no Samba</h2>

      <p>
        Aqui está o detalhe que pega quase todo iniciante: <strong>o Samba tem seu próprio
        banco de senhas</strong> (<code>tdbsam</code>), separado do <code>/etc/passwd</code>.
        Mesmo que o usuário <code>joao</code> exista no Linux, ele precisa ser cadastrado no
        Samba com <code>smbpasswd -a</code>.
      </p>

      <TerminalBlock
        comment="o usuário joao já existe no Linux. Cadastre no Samba:"
        command="sudo smbpasswd -a joao"
        output={`New SMB password:
Retype new SMB password:
Added user joao.`}
      />

      <TerminalBlock
        comment="ativar o usuário no Samba (se vier desativado por default)"
        command="sudo smbpasswd -e joao"
        output="Enabled user joao."
      />

      <TerminalBlock
        comment="listar usuários cadastrados no Samba"
        command="sudo pdbedit -L"
        output={`joao:1000:João Silva
maria:1001:Maria Souza`}
      />

      <TerminalBlock
        comment="trocar senha SMB de um usuário"
        command="sudo smbpasswd joao"
      />

      <TerminalBlock
        comment="remover do Samba (não remove do Linux)"
        command="sudo smbpasswd -x joao"
      />

      <CommandFlagList
        command="smbpasswd"
        items={[
          { flag: "-a USUARIO", description: "Adiciona usuário ao banco do Samba (precisa existir no Linux)." },
          { flag: "-x USUARIO", description: "Remove usuário do banco do Samba." },
          { flag: "-d USUARIO", description: "Desabilita (sem remover)." },
          { flag: "-e USUARIO", description: "Habilita usuário desabilitado." },
          { flag: "-n USUARIO", description: "Define senha vazia (geralmente combinado com null passwords)." },
          { flag: "-r SERVIDOR", description: "Conecta a outro servidor SMB para mudar senha (cliente)." },
        ]}
      />

      <h2>5. Validando a configuração antes de subir</h2>

      <p>
        O <code>testparm</code> faz um <em>lint</em> do <code>smb.conf</code> — mostra erros e
        a configuração final efetiva (com defaults preenchidos).
      </p>

      <TerminalBlock
        command="sudo testparm"
        output={`Load smb config files from /etc/samba/smb.conf
Loaded services file OK.
Weak crypto is allowed by GnuTLS (e.g. NIST SP800-131A compliance)
Server role: ROLE_STANDALONE

Press enter to see a dump of your service definitions

# Global parameters
[global]
        log file = /var/log/samba/log.%m
        logging = file
        map to guest = Bad User
        netbios name = ARCHSRV
        panic action = /usr/share/samba/panic-action %d
        server string = Arch Samba %v
        idmap config * : backend = tdb

[publico]
        comment = Pasta pública (read-only, sem login)
        guest ok = Yes
        path = /srv/samba/publico

[familia]
        comment = Compartilhamento familiar
        create mask = 0660
        directory mask = 0770
        force group = familia
        path = /srv/samba/familia
        read only = No
        valid users = @familia`}
      />

      <h2>6. Subindo os serviços</h2>

      <p>
        O Samba é dividido em três daemons: <code>smb</code> (compartilhamento de arquivos),{" "}
        <code>nmb</code> (resolução NetBIOS, descoberta na rede) e <code>winbindd</code>{" "}
        (apenas se você integrar com Active Directory). Para o caso típico, ative os dois
        primeiros.
      </p>

      <TerminalBlock
        command="sudo systemctl enable --now smb nmb"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/smb.service → /usr/lib/systemd/system/smb.service.
Created symlink /etc/systemd/system/multi-user.target.wants/nmb.service → /usr/lib/systemd/system/nmb.service.`}
      />

      <TerminalBlock
        command="systemctl status smb"
        output={`● smb.service - Samba SMB Daemon
     Loaded: loaded (/usr/lib/systemd/system/smb.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-26 18:42:11 -03; 12s ago
   Main PID: 4221 (smbd)
     Status: "smbd: ready to serve connections..."
      Tasks: 4 (limit: 19012)
     Memory: 18.4M (peak: 19.2M)
        CPU: 142ms
     CGroup: /system.slice/smb.service
             ├─4221 /usr/bin/smbd --foreground --no-process-group
             ├─4223 /usr/bin/smbd --foreground --no-process-group
             └─4224 /usr/bin/smbd --foreground --no-process-group`}
      />

      <TerminalBlock
        comment="recarregar config sem dropar conexões existentes"
        command="sudo systemctl reload smb"
      />

      <AlertBox type="warning" title="Firewall bloqueando?">
        Se você tem o <code>ufw</code> ou <code>firewalld</code> ativo, libere as portas SMB:
        <br />
        <code>sudo ufw allow from 192.168.0.0/16 to any app Samba</code>
        <br />
        ou via firewalld:{" "}
        <code>sudo firewall-cmd --permanent --add-service=samba &amp;&amp; sudo firewall-cmd --reload</code>.
        Portas envolvidas: 445/TCP (SMB), 137-138/UDP e 139/TCP (NetBIOS legacy).
      </AlertBox>

      <h2>7. Testando localmente</h2>

      <TerminalBlock
        comment="lista shares como anônimo (vê o que está browseable + guest)"
        command="smbclient -L //localhost -N"
        output={`        Sharename       Type      Comment
        ---------       ----      -------
        publico         Disk      Pasta pública (read-only, sem login)
        IPC$            IPC       IPC Service (Arch Samba 4.20.2)
SMB1 disabled -- no workgroup available`}
      />

      <TerminalBlock
        comment="lista shares autenticado (vê os privados também)"
        command="smbclient -L //localhost -U joao"
        output={`Password for [WORKGROUP\\joao]:

        Sharename       Type      Comment
        ---------       ----      -------
        publico         Disk      Pasta pública
        familia         Disk      Compartilhamento familiar
        joao            Disk      Home do João via SMB
        IPC$            IPC       IPC Service`}
      />

      <TerminalBlock
        comment="conectar interativamente (estilo FTP)"
        command="smbclient //localhost/familia -U joao"
        output={`Password for [WORKGROUP\\joao]:
Try "help" to get a list of possible commands.
smb: \\>`}
      />

      <OutputBlock
        title="comandos dentro do smbclient"
        output={`smb: \\> ls
  .                          D    0  Wed Mar 26 18:42:11 2026
  ..                         D    0  Wed Mar 26 18:42:11 2026
  fotos                      D    0  Wed Mar 26 18:50:00 2026
  recibos.pdf                A 14223 Wed Mar 26 18:51:14 2026

                17893952 blocks of size 1024. 8347234 blocks available
smb: \\> get recibos.pdf
getting file recibos.pdf of size 14223 as recibos.pdf
smb: \\> put backup.tar.gz
putting file backup.tar.gz as backup.tar.gz
smb: \\> mkdir 2026-03
smb: \\> exit`}
      />

      <h2>8. Conectando do Linux cliente — mount.cifs</h2>

      <p>
        Para montar o share permanentemente em outra máquina Linux, use o pacote{" "}
        <code>cifs-utils</code> (vem como dependência do <code>samba</code>).
      </p>

      <TerminalBlock command="sudo pacman -S cifs-utils" />

      <TerminalBlock command="sudo mkdir -p /mnt/familia" />

      <TerminalBlock
        command={`sudo mount -t cifs //archsrv/familia /mnt/familia -o username=joao,uid=$(id -u),gid=$(id -g)`}
        output="Password for joao@//archsrv/familia: ********"
      />

      <TerminalBlock
        command="ls /mnt/familia"
        output={`fotos  recibos.pdf  2026-03  backup.tar.gz`}
      />

      <h3>8.1. Mount automático via /etc/fstab</h3>

      <p>
        Guarde a senha em um arquivo de credenciais (apenas root pode ler) e referencie no
        fstab:
      </p>

      <TerminalBlock
        command={`sudo bash -c 'cat > /root/.smbcred-familia <<EOF
username=joao
password=MinhaSenh@SMB
EOF'`}
      />

      <TerminalBlock
        command="sudo chmod 600 /root/.smbcred-familia"
      />

      <CodeBlock
        title="linha em /etc/fstab"
        code={`//archsrv/familia  /mnt/familia  cifs  credentials=/root/.smbcred-familia,uid=1000,gid=1000,iocharset=utf8,vers=3.0,nofail,x-systemd.automount,_netdev  0 0`}
      />

      <TerminalBlock command="sudo mount -a" />

      <CommandFlagList
        command="mount -t cifs (opções comuns)"
        items={[
          { flag: "username=USR", description: "Usuário SMB. Use credentials=arquivo para evitar senha em claro." },
          { flag: "credentials=ARQ", description: "Caminho para arquivo com username= / password= / domain=. chmod 600 obrigatório." },
          { flag: "uid=N gid=N", description: "Mapeia donos dos arquivos no FS local (sem isso, tudo aparece como root)." },
          { flag: "iocharset=utf8", description: "Garante nomes com acento corretos." },
          { flag: "vers=3.0", description: "Força SMB3. Use 3.1.1 nos kernels recentes para criptografia em trânsito." },
          { flag: "nofail", description: "Boot não falha se o servidor estiver fora do ar (essencial em laptops)." },
          { flag: "x-systemd.automount", description: "systemd só monta sob acesso (lazy). Acelera boot." },
          { flag: "_netdev", description: "Sinaliza que é montagem de rede (espera o NetworkManager subir)." },
          { flag: "rw / ro", description: "Read-write ou read-only." },
          { flag: "noperm", description: "Cliente não checa permissões locais — útil quando o servidor já controla via valid users." },
        ]}
      />

      <h2>9. Conectando do Windows e do macOS</h2>

      <OutputBlock
        title="Windows 10/11"
        output={`No Explorer:
  \\\\ARCHSRV\\familia
  ou pelo IP:
  \\\\192.168.1.50\\familia

Para mapear como letra de drive:
  Botão direito em "Este Computador" → Mapear unidade de rede...
  Pasta:  \\\\ARCHSRV\\familia
  ☑ Conectar usando credenciais diferentes
  Usuário: joao    Senha: ********`}
      />

      <OutputBlock
        title="macOS (Finder)"
        output={`Finder → Cmd+K (Conectar ao Servidor)
  Endereço:  smb://archsrv/familia
  Nome:      joao
  Senha:     ********`}
      />

      <h2>10. Gerenciamento e diagnóstico</h2>

      <TerminalBlock
        comment="quem está conectado AGORA no servidor"
        command="sudo smbstatus"
        output={`Samba version 4.20.2
PID     Username     Group        Machine                                   Protocol Version  Encryption           Signing
----------------------------------------------------------------------------------------------------------------------------------------
4423    joao         familia      192.168.1.10 (ipv4:192.168.1.10:51234)    SMB3_11           AES-128-GCM          AES-128-GMAC

Service      pid     Machine       Connected at                     Encryption   Signing
---------------------------------------------------------------------------------------------
familia      4423    192.168.1.10  Wed Mar 26 19:01:14 2026 -03     -            AES-128-GMAC

Locked files:
Pid          User(ID)   DenyMode     Access      R/W        Oplock        SharePath          Name        Time
-----------------------------------------------------------------------------------------------------------------------
4423         1000       DENY_NONE    0x100081    RDONLY     LEASE(R)      /srv/samba/familia  recibos.pdf Wed Mar 26 19:01:55 2026`}
      />

      <TerminalBlock
        comment="só conexões ativas (resumo)"
        command="sudo smbstatus -b"
        output={`Samba version 4.20.2
PID     Username     Group        Machine                                   Protocol Version  Encryption    Signing
4423    joao         familia      192.168.1.10                              SMB3_11           AES-128-GCM   AES-128-GMAC
4501    maria        familia      192.168.1.22                              SMB3_11           AES-128-GCM   AES-128-GMAC`}
      />

      <TerminalBlock
        comment="logs por máquina cliente"
        command="sudo tail -n 20 /var/log/samba/log.192.168.1.10"
        output={`[2026/03/26 19:01:14.472134,  3] ../../source3/smbd/sec_ctx.c:447(set_sec_ctx_internal)
  setting sec ctx (1000, 1000) - sec_ctx_stack_ndx = 0
[2026/03/26 19:01:14.472312,  3] ../../source3/smbd/oplock.c:1314(setup_kernel_oplock_poll_fd)
  Got level II oplock for recibos.pdf
[2026/03/26 19:01:55.123456,  3] ../../source3/smbd/files.c:271(file_close_user)
  Closing file recibos.pdf`}
      />

      <h2>11. Erros típicos e soluções</h2>

      <TerminalBlock
        comment="erro: NT_STATUS_LOGON_FAILURE"
        command="smbclient //archsrv/familia -U joao"
        exitCode={1}
        output={`Password for [WORKGROUP\\joao]:
session setup failed: NT_STATUS_LOGON_FAILURE`}
      />

      <p>
        Causas comuns: senha SMB diferente da senha do Linux (resolva com{" "}
        <code>sudo smbpasswd joao</code>) ou usuário não cadastrado (rode{" "}
        <code>sudo smbpasswd -a joao</code>).
      </p>

      <TerminalBlock
        comment="erro: NT_STATUS_ACCESS_DENIED ao escrever"
        command="touch /mnt/familia/teste.txt"
        exitCode={1}
        output="touch: cannot touch '/mnt/familia/teste.txt': Permission denied"
      />

      <p>
        Verifique três camadas: (1) <code>read only = no</code> no <code>smb.conf</code>,
        (2) o usuário no Linux faz parte do grupo dono do diretório, (3) permissões Unix do
        diretório real (<code>chmod 2770</code>).
      </p>

      <TerminalBlock
        comment="erro: 'mount error(13): Permission denied' no cliente Linux"
        command="sudo mount -t cifs //archsrv/familia /mnt/familia -o username=joao"
        exitCode={32}
        output={`mount error(13): Permission denied
Refer to the mount.cifs(8) manual page (e.g. man mount.cifs) and kernel log messages (dmesg)`}
      />

      <p>
        Inspecione <code>dmesg | tail</code>: geralmente é versão do protocolo (force{" "}
        <code>vers=3.0</code>) ou o servidor exige assinatura.
      </p>

      <TerminalBlock
        comment="conexão recusada"
        command="smbclient -L //archsrv -N"
        exitCode={1}
        output="Connection to archsrv failed (Error NT_STATUS_HOST_UNREACHABLE)"
      />

      <p>
        Confira que o serviço está rodando (<code>systemctl status smb</code>), o firewall
        está liberado e o nome <code>archsrv</code> resolve (use o IP direto para isolar).
      </p>

      <AlertBox type="danger" title="NUNCA exponha o Samba à Internet">
        SMB foi desenhado para LAN. Mesmo com SMB3 + criptografia, não exponha as portas
        445/139 ao mundo — botnets varrem o protocolo o tempo todo procurando shares mal
        configurados (lembra do <em>WannaCry</em>?). Para acesso remoto, use{" "}
        <strong>VPN</strong> (WireGuard, Tailscale) ou um túnel SSH:{" "}
        <code>ssh -L 4450:localhost:445 user@server</code> e monte como{" "}
        <code>//localhost:4450/share</code>.
      </AlertBox>

      <h2>12. Resumo prático</h2>

      <OutputBlock
        title="colinha Samba no Arch"
        output={`# instalação
sudo pacman -S samba cifs-utils

# config
sudo cp /etc/samba/smb.conf.default /etc/samba/smb.conf
sudoedit /etc/samba/smb.conf
sudo testparm

# usuários
sudo smbpasswd -a joao
sudo smbpasswd -e joao
sudo pdbedit -L

# diretórios
sudo mkdir -p /srv/samba/familia
sudo groupadd familia
sudo usermod -aG familia joao
sudo chown -R root:familia /srv/samba/familia
sudo chmod -R 2770 /srv/samba/familia

# serviço
sudo systemctl enable --now smb nmb
sudo systemctl reload smb     # após editar conf

# diagnóstico
sudo smbstatus
smbclient -L //localhost -U joao
sudo tail -f /var/log/samba/log.smbd

# montar do cliente Linux
sudo mount -t cifs //archsrv/familia /mnt/familia \\
   -o credentials=/root/.smbcred,uid=1000,gid=1000,vers=3.0`}
      />
    </PageContainer>
  );
}
