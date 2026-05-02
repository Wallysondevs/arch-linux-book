import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Usuarios() {
  return (
    <PageContainer
      title="Usuários, Grupos e Permissões de Acesso"
      subtitle="Domine o gerenciamento de usuários e grupos no Arch. Cada comando é mostrado com a saída exata que você verá no terminal."
      difficulty="intermediario"
      timeToRead="30 min"
    >
      <p>
        O Linux é multiusuário desde sua concepção: o kernel separa permissões por <code>UID</code>/<code>GID</code>,
        e cada processo, arquivo e socket carrega uma identidade. Saber ler <code>/etc/passwd</code>, <code>/etc/shadow</code>,
        <code>/etc/group</code> e <code>/etc/gshadow</code> é o que diferencia um usuário casual de um administrador.
      </p>

      <h2>1. Quem sou eu? — id, whoami, who, w, last</h2>

      <h3>whoami — apenas o nome de login</h3>
      <TerminalBlock command="whoami" output="user" />

      <h3>id — UID, GID e todos os grupos</h3>
      <TerminalBlock
        command="id"
        output="uid=1000(user) gid=1000(user) groups=1000(user),3(sys),90(network),98(power),986(audio),990(video),998(wheel)"
      />
      <OutputBlock
        title="anatomia da saída"
        output={`uid=1000(user) gid=1000(user) groups=1000(user),3(sys),90(network),98(power),986(audio),990(video),998(wheel)`}
        annotations={[
          { line: 0, note: "uid: id numérico do usuário (1000+ = humano)" },
        ]}
        caption="O grupo primário (gid) é o dono padrão dos arquivos que você criar. Os groups são privilégios extras."
      />

      <TerminalBlock
        comment="só o UID numérico (útil em scripts)"
        command="id -u"
        output="1000"
      />
      <TerminalBlock
        comment="só os nomes dos grupos"
        command="id -Gn"
        output="user sys network power audio video wheel"
      />
      <TerminalBlock
        comment="informações de OUTRO usuário"
        command="id root"
        output="uid=0(root) gid=0(root) groups=0(root)"
      />

      <h3>who e w — quem está logado AGORA</h3>
      <TerminalBlock
        command="who"
        output={`user     tty1         2025-01-15 09:14
user     pts/0        2025-01-15 09:32 (:0)
user     pts/1        2025-01-15 11:08 (192.168.1.40)`}
      />
      <OutputBlock
        title="colunas do who"
        output={`user     tty1         2025-01-15 09:14
user     pts/0        2025-01-15 09:32 (:0)
user     pts/1        2025-01-15 11:08 (192.168.1.40)`}
        annotations={[
          { line: 0, note: "tty1 = console físico (Ctrl+Alt+F1)" },
          { line: 1, note: "pts/0 = terminal dentro do X/Wayland" },
          { line: 2, note: "(IP) = sessão SSH remota" },
        ]}
      />

      <TerminalBlock
        comment="w mostra também o que cada sessão está fazendo"
        command="w"
        output={` 11:32:04 up  2:18,  3 users,  load average: 0.34, 0.29, 0.21
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
user     tty1     -                09:14    2:17m  0.04s  0.04s -bash
user     pts/0    :0               09:32   12.00s  3.21s  0.01s w
user     pts/1    192.168.1.40     11:08    1:04   0.18s  0.18s vim notes.md`}
      />

      <h3>last e lastlog — histórico de logins</h3>
      <TerminalBlock
        command="last -n 5"
        output={`user     pts/1        192.168.1.40     Wed Jan 15 11:08   still logged in
user     pts/0        :0               Wed Jan 15 09:32   still logged in
user     tty1                          Wed Jan 15 09:14   still logged in
reboot   system boot  6.7.4-arch1-1    Wed Jan 15 09:13   still running
user     pts/0        :0               Tue Jan 14 21:02 - down   (00:43)

wtmp begins Tue Jan  1 00:00:00 2025`}
      />

      <TerminalBlock
        comment="lastlog mostra o ÚLTIMO login de CADA usuário do sistema"
        command="lastlog | head"
        output={`Username         Port     From             Latest
root                                       **Never logged in**
bin                                        **Never logged in**
daemon                                     **Never logged in**
mail                                       **Never logged in**
http                                       **Never logged in**
nobody                                     **Never logged in**
dbus                                       **Never logged in**
systemd-coredump                           **Never logged in**
user             pts/1    192.168.1.40    Wed Jan 15 11:08:42 -0300 2025`}
      />

      <h2>2. Os arquivos sagrados — passwd, shadow, group</h2>

      <h3>/etc/passwd — base de usuários (mundo lê)</h3>
      <TerminalBlock
        command="getent passwd | head"
        output={`root:x:0:0::/root:/usr/bin/zsh
bin:x:1:1::/:/usr/bin/nologin
daemon:x:2:2::/:/usr/bin/nologin
mail:x:8:12::/var/spool/mail:/usr/bin/nologin
ftp:x:14:11::/srv/ftp:/usr/bin/nologin
http:x:33:33::/srv/http:/usr/bin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/usr/bin/nologin
dbus:x:81:81:System Message Bus:/:/usr/bin/nologin
systemd-coredump:x:980:980:systemd Core Dumper:/:/usr/bin/nologin
user:x:1000:1000:Arch User,,,:/home/user:/bin/bash`}
      />
      <OutputBlock
        title="formato passwd: nome:x:UID:GID:GECOS:home:shell"
        output={`user:x:1000:1000:Arch User,,,:/home/user:/bin/bash`}
        annotations={[
          { line: 0, note: "x = senha vive em /etc/shadow" },
        ]}
        caption="UID 0 = root · 1-999 = sistema/serviços · 1000+ = humanos. Shell /usr/bin/nologin impede login interativo."
      />

      <h3>/etc/shadow — hashes de senha (somente root)</h3>
      <TerminalBlock
        command="sudo cat /etc/shadow | grep -E '^(root|user):'"
        output={`root:!locked:19733::::::
user:$y$j9T$AbCd...$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:19733:0:99999:7:::`}
      />
      <OutputBlock
        title="formato shadow: nome:hash:lastchg:min:max:warn:inactive:expire:reserved"
        output={`user:$y$j9T$AbCd...$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:19733:0:99999:7:::`}
        annotations={[
          { line: 0, note: "$y$ = yescrypt (algoritmo padrão moderno do Arch)" },
        ]}
        caption="Outros prefixos: $6$ = SHA-512, $1$ = MD5 (legado, inseguro). Campo 3 = dias desde 1970 da última troca."
      />

      <AlertBox type="danger" title="NUNCA edite /etc/shadow manualmente">
        Use sempre <code>passwd</code>, <code>chage</code> ou <code>usermod</code>. Um caractere errado pode trancar
        todo mundo fora do sistema, inclusive o root.
      </AlertBox>

      <h3>/etc/group — grupos e seus membros</h3>
      <TerminalBlock
        command="getent group | grep -E '^(wheel|audio|video|docker)'"
        output={`audio:x:986:user
video:x:990:user
wheel:x:998:user
docker:x:969:user`}
      />
      <OutputBlock
        title="formato group: nome:x:GID:membros"
        output={`wheel:x:998:user,maria,pedro`}
        annotations={[
          { line: 0, note: "três usuários no grupo wheel (sudo)" },
        ]}
      />

      <h2>3. Criando usuários — useradd</h2>

      <CommandFlagList
        command="useradd"
        items={[
          { flag: "-m", long: "--create-home", description: "Cria o diretório /home/<nome> a partir do skel.", example: "sudo useradd -m maria" },
          { flag: "-s", long: "--shell <path>", description: "Define o shell de login. Sem -s, vira o do /etc/default/useradd (geralmente /bin/bash).", example: "sudo useradd -m -s /bin/zsh maria" },
          { flag: "-c", long: "--comment <gecos>", description: "Campo GECOS (nome completo, telefone…). Aparece em finger/who.", example: 'sudo useradd -c "Maria Silva" maria' },
          { flag: "-G", long: "--groups g1,g2", description: "Grupos suplementares. Sem espaços. NÃO esquece o -a com usermod.", example: "sudo useradd -m -G wheel,audio maria" },
          { flag: "-g", long: "--gid <grupo>", description: "Define o grupo primário. Padrão: cria um grupo com o mesmo nome do usuário (USERGROUPS_ENAB=yes).", example: "sudo useradd -m -g users maria" },
          { flag: "-u", long: "--uid <UID>", description: "Define o UID manualmente (útil ao restaurar backups).", example: "sudo useradd -u 1500 maria" },
          { flag: "-d", long: "--home-dir <path>", description: "Diretório home customizado.", example: "sudo useradd -m -d /srv/maria maria" },
          { flag: "-r", long: "--system", description: "Usuário de sistema (UID < 1000), sem expiração de senha. Para serviços.", example: "sudo useradd -r -s /usr/bin/nologin app" },
          { flag: "-e", long: "--expiredate YYYY-MM-DD", description: "Data em que a conta expira automaticamente.", example: "sudo useradd -m -e 2025-12-31 estagio" },
          { flag: "-N", long: "--no-user-group", description: "NÃO cria um grupo com o mesmo nome (junta no GROUP do /etc/default).", example: "sudo useradd -m -N maria" },
        ]}
      />

      <TerminalBlock
        comment="Criar maria do jeito CERTO no Arch (home + bash + grupos úteis)"
        command='sudo useradd -m -s /bin/bash -c "Maria Silva" -G wheel,audio,video,storage maria'
        output=""
      />
      <TerminalBlock
        comment="Definir senha imediatamente"
        command="sudo passwd maria"
        output={`New password: {dim}(invisível){/}
Retype new password: {dim}(invisível){/}
passwd: password updated successfully`}
      />
      <TerminalBlock
        comment="Confirmar — id deve mostrar UID 1001 e os grupos pedidos"
        command="id maria"
        output="uid=1001(maria) gid=1001(maria) groups=1001(maria),986(audio),990(video),998(wheel),1006(storage)"
      />
      <TerminalBlock
        command="ls -la /home/maria"
        output={`{b}total 28{/}
drwx------  3 maria maria 4096 Jan 15 11:42 {b}.{/}
drwxr-xr-x  4 root  root  4096 Jan 15 11:42 {b}..{/}
-rw-------  1 maria maria   18 Jan 15 11:42 .bash_logout
-rw-------  1 maria maria  141 Jan 15 11:42 .bash_profile
-rw-------  1 maria maria  376 Jan 15 11:42 .bashrc
drwx------  2 maria maria 4096 Jan 15 11:42 {b}.config{/}`}
      />

      <AlertBox type="info" title="O esqueleto do home: /etc/skel">
        Tudo em <code>/etc/skel/</code> é copiado para o <code>$HOME</code> de qualquer usuário criado com
        <code>-m</code>. Coloque ali um <code>.bashrc</code>, <code>.config/</code>, etc. para padronizar
        novos usuários.
      </AlertBox>

      <h3>Erros frequentes do useradd</h3>
      <TerminalBlock
        comment="esqueceu o sudo"
        command="useradd -m maria"
        output="useradd: Permission denied.
useradd: cannot lock /etc/passwd; try again later."
        exitCode={1}
      />
      <TerminalBlock
        comment="usuário já existe"
        command="sudo useradd -m maria"
        output="useradd: user 'maria' already exists"
        exitCode={9}
      />
      <TerminalBlock
        comment="grupo inexistente em -G"
        command="sudo useradd -m -G grupo_que_nao_existe maria"
        output="useradd: group 'grupo_que_nao_existe' does not exist"
        exitCode={6}
      />

      <h2>4. Modificando usuários — usermod</h2>

      <CommandFlagList
        command="usermod"
        items={[
          { flag: "-aG", long: "--append --groups", description: <>Adiciona aos grupos suplementares <strong>sem remover</strong> os atuais. <strong>Use SEMPRE com -a</strong>.</>, example: "sudo usermod -aG docker maria" },
          { flag: "-G", long: "--groups", description: "SUBSTITUI todos os grupos suplementares. Perigoso sem -a.", example: "sudo usermod -G wheel maria" },
          { flag: "-l", long: "--login <novo>", description: "Renomeia o login. NÃO renomeia /home — combine com -d -m.", example: "sudo usermod -l mary maria" },
          { flag: "-d", long: "--home <path>", description: "Muda o diretório home no /etc/passwd.", example: "sudo usermod -d /home/mary -m mary" },
          { flag: "-m", long: "--move-home", description: "Move o conteúdo do home antigo para o novo (junto com -d).", example: "sudo usermod -d /home/mary -m mary" },
          { flag: "-s", long: "--shell", description: "Troca o shell padrão.", example: "sudo usermod -s /usr/bin/zsh maria" },
          { flag: "-L", long: "--lock", description: "Bloqueia a conta (prefixa ! no hash). Login por senha negado.", example: "sudo usermod -L maria" },
          { flag: "-U", long: "--unlock", description: "Desbloqueia (remove o !).", example: "sudo usermod -U maria" },
          { flag: "-e", long: "--expiredate YYYY-MM-DD", description: 'Define expiração. "" remove expiração.', example: "sudo usermod -e 2025-12-31 maria" },
          { flag: "-c", long: "--comment", description: "Atualiza GECOS.", example: 'sudo usermod -c "Maria S." maria' },
        ]}
      />

      <AlertBox type="danger" title="O erro #1 do administrador iniciante">
        <code>sudo usermod -G docker maria</code> remove maria do <strong>wheel</strong> e de todos os outros
        grupos. Sem o <code>wheel</code>, ela perde acesso ao sudo. Use SEMPRE <code>-aG</code>.
      </AlertBox>

      <TerminalBlock
        comment="adicionar maria ao grupo docker (jeito certo)"
        command="sudo usermod -aG docker maria"
        output=""
      />
      <TerminalBlock
        comment="conferir — note os grupos antigos preservados"
        command="id maria"
        output="uid=1001(maria) gid=1001(maria) groups=1001(maria),969(docker),986(audio),990(video),998(wheel),1006(storage)"
      />

      <AlertBox type="warning" title="Mudanças em grupos só valem em sessões novas">
        Após <code>usermod -aG</code>, o usuário precisa <strong>logar de novo</strong> (ou usar
        <code>newgrp docker</code>) para que o novo grupo apareça nos processos.
      </AlertBox>

      <TerminalBlock
        comment="bloquear conta"
        command="sudo usermod -L maria"
        output=""
      />
      <TerminalBlock
        command="sudo passwd -S maria"
        output="maria L 01/15/2025 0 99999 7 -1"
      />
      <OutputBlock
        title="passwd -S — status da conta"
        output={`maria L 01/15/2025 0 99999 7 -1`}
        annotations={[
          { line: 0, note: "L = Locked · P = Password set · NP = No Password" },
        ]}
      />

      <h2>5. Removendo usuários — userdel</h2>

      <TerminalBlock
        comment="remove SÓ a entrada — deixa /home/maria intocado"
        command="sudo userdel maria"
        output=""
      />
      <TerminalBlock
        comment="remove conta + home + spool de mail"
        command="sudo userdel -r maria"
        output={`{y}userdel: maria mail spool (/var/spool/mail/maria) not found{/}`}
      />
      <TerminalBlock
        comment="forçar mesmo se a conta estiver logada (perigoso)"
        command="sudo userdel -rf maria"
        output={`{r}userdel: user maria is currently used by process 4421{/}
userdel: maria mail spool (/var/spool/mail/maria) not found`}
      />

      <h2>6. Senhas — passwd e chage</h2>

      <TerminalBlock
        comment="trocar a própria senha"
        command="passwd"
        output={`Changing password for user.
Current password: {dim}(invisível){/}
New password: {dim}(invisível){/}
Retype new password: {dim}(invisível){/}
passwd: password updated successfully`}
      />

      <CommandFlagList
        command="passwd"
        items={[
          { flag: "-S", long: "--status", description: "Status da conta: P (set), L (locked), NP (none).", example: "sudo passwd -S maria" },
          { flag: "-l", long: "--lock", description: "Bloqueia (prefixa ! no hash).", example: "sudo passwd -l maria" },
          { flag: "-u", long: "--unlock", description: "Desbloqueia.", example: "sudo passwd -u maria" },
          { flag: "-d", long: "--delete", description: "Remove a senha (login sem senha — NÃO recomendado).", example: "sudo passwd -d maria" },
          { flag: "-e", long: "--expire", description: "Força troca no próximo login.", example: "sudo passwd -e maria" },
          { flag: "-n", long: "--mindays N", description: "Mínimo de dias entre trocas.", example: "sudo passwd -n 1 maria" },
          { flag: "-x", long: "--maxdays N", description: "Máximo de dias antes de forçar troca.", example: "sudo passwd -x 90 maria" },
          { flag: "-w", long: "--warndays N", description: "Avisar N dias antes da expiração.", example: "sudo passwd -w 7 maria" },
        ]}
      />

      <h3>chage — política completa de envelhecimento</h3>
      <TerminalBlock
        command="sudo chage -l maria"
        output={`Last password change                                    : Jan 15, 2025
Password expires                                        : never
Password inactive                                       : never
Account expires                                         : never
Minimum number of days between password change          : 0
Maximum number of days between password change          : 99999
Number of days of warning before password expires       : 7`}
      />

      <TerminalBlock
        comment="exigir troca em 90 dias, mín 1 dia, aviso 14 dias antes"
        command="sudo chage -M 90 -m 1 -W 14 maria"
        output=""
      />
      <TerminalBlock
        command="sudo chage -l maria"
        output={`Last password change                                    : Jan 15, 2025
Password expires                                        : Apr 15, 2025
Password inactive                                       : never
Account expires                                         : never
Minimum number of days between password change          : 1
Maximum number of days between password change          : 90
Number of days of warning before password expires       : 14`}
      />

      <h2>7. Grupos — groupadd, groupmod, groupdel, gpasswd</h2>

      <TerminalBlock
        command="sudo groupadd desenvolvedores"
        output=""
      />
      <TerminalBlock
        command="getent group desenvolvedores"
        output="desenvolvedores:x:1010:"
      />
      <TerminalBlock
        comment="GID específico"
        command="sudo groupadd -g 5000 ops"
        output=""
      />
      <TerminalBlock
        command="sudo gpasswd -a maria desenvolvedores"
        output="Adding user maria to group desenvolvedores"
      />
      <TerminalBlock
        command="sudo gpasswd -d maria docker"
        output="Removing user maria from group docker"
      />
      <TerminalBlock
        comment="renomear grupo"
        command="sudo groupmod -n devs desenvolvedores"
        output=""
      />
      <TerminalBlock
        command="sudo groupdel devs"
        output=""
      />

      <h2>8. su, sudo e a ascensão a root</h2>

      <h3>su — Switch User</h3>
      <TerminalBlock
        comment='su sem hífen: vira root mas mantém AS variáveis e o PWD do user'
        command="su"
        output={`Password: {dim}(senha do root){/}
sh-5.2#`}
      />
      <TerminalBlock
        comment="su - faz login completo: carrega .bash_profile, PATH e PWD do alvo"
        command="su -"
        output={`Password: {dim}(senha do root){/}
[root@archlinux ~]# pwd
/root`}
      />
      <TerminalBlock
        comment="executar UM comando como outro usuário"
        command='su - maria -c "id"'
        output={`Password: {dim}(senha de maria){/}
uid=1001(maria) gid=1001(maria) groups=1001(maria),986(audio),990(video),998(wheel)`}
      />

      <h3>sudo — execução pontual com a SUA senha</h3>
      <TerminalBlock
        command="sudo pacman -Syu"
        output={`[sudo] password for user: {dim}(invisível){/}
:: Synchronizing package databases...
 core            177.4 KiB   1.2 MiB/s 00:00
 extra            10.4 MiB   8.5 MiB/s 00:01
 multilib         195.6 KiB   1.5 MiB/s 00:00
:: Starting full system upgrade...
 there is nothing to do`}
      />

      <TerminalBlock
        comment="ver QUAIS comandos você pode rodar como sudo"
        command="sudo -l"
        output={`Matching Defaults entries for user on archlinux:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin

User user may run the following commands on archlinux:
    (ALL : ALL) ALL`}
      />

      <TerminalBlock
        comment="abrir shell como root (substitui o ambiente)"
        command="sudo -i"
        output={`[root@archlinux ~]# whoami
root
[root@archlinux ~]# echo $HOME
/root`}
      />

      <TerminalBlock
        comment="rodar como OUTRO usuário (não root)"
        command='sudo -u maria -- bash -c "whoami; pwd"'
        output={`maria
/home/user`}
      />

      <h3>Configurando sudo — visudo</h3>
      <p>
        O <code>visudo</code> trava o arquivo, valida a sintaxe ao sair e só salva se estiver correto.
        Editar <code>/etc/sudoers</code> direto pode te trancar fora do sudo.
      </p>
      <CodeBlock title="/etc/sudoers (trecho)" code={`## Permite o grupo wheel rodar tudo (descomente)
%wheel ALL=(ALL:ALL) ALL

## Sem senha (NÃO recomendado em laptops compartilhados)
# %wheel ALL=(ALL:ALL) NOPASSWD: ALL

## Comandos específicos sem senha (mais seguro)
user ALL=(ALL) NOPASSWD: /usr/bin/pacman -Syu, /usr/bin/systemctl restart nginx

## Cmnd_Alias (agrupar comandos)
Cmnd_Alias REDE = /usr/bin/ip, /usr/bin/nmcli, /usr/bin/iwctl
maria ALL=(root) NOPASSWD: REDE`} />

      <TerminalBlock
        comment="erro de sintaxe é PEGO antes de salvar"
        command="sudo visudo"
        output={`>>> /etc/sudoers: syntax error near line 82 <<<
What now?
Options are:
  (e)dit sudoers file again
  e(x)it without saving changes to sudoers file
  (Q)uit and save changes to sudoers file (DANGER!)`}
      />

      <h2>9. Grupos importantes do Arch</h2>
      <ul>
        <li><strong>wheel</strong> (998) — habilitado no <code>sudoers</code> por convenção. Quem está aqui usa sudo.</li>
        <li><strong>audio</strong> (986) — acesso direto ao hardware ALSA (raramente necessário com PipeWire).</li>
        <li><strong>video</strong> (990) — acesso a <code>/dev/dri/*</code> (GPU, framebuffer).</li>
        <li><strong>storage</strong> (95) — montagem de removíveis via udisks.</li>
        <li><strong>network</strong> (90) — alterar conexões via NetworkManager sem polkit.</li>
        <li><strong>power</strong> (98) — suspend, hibernate sem polkit.</li>
        <li><strong>uucp</strong> (14) — portas seriais (Arduino, modems).</li>
        <li><strong>input</strong> (994) — ler eventos brutos de teclado/mouse (libinput, etc.).</li>
        <li><strong>docker</strong> (969) — usar Docker sem sudo (= root no host, perigoso).</li>
        <li><strong>libvirt</strong> — gerenciar VMs do QEMU/KVM.</li>
      </ul>

      <h2>10. Receitas de campo</h2>

      <h3>Listar todos os HUMANOS do sistema</h3>
      <TerminalBlock
        command="awk -F: '$3 >= 1000 && $3 < 65534 {print $1, $3, $7}' /etc/passwd"
        output={`user 1000 /bin/bash
maria 1001 /bin/bash
pedro 1002 /usr/bin/zsh`}
      />

      <h3>Encontrar arquivos de um usuário deletado</h3>
      <TerminalBlock
        command="sudo find / -xdev -nouser -o -nogroup 2>/dev/null | head"
        output={`/var/cache/old-app/data.bin
/srv/legacy/report.csv
/home/.removido/notes.txt`}
      />

      <h3>Trocar o dono recursivamente após mover dados</h3>
      <TerminalBlock
        command="sudo chown -R maria:maria /home/maria"
        output=""
      />

      <h3>Forçar troca de senha no próximo login</h3>
      <TerminalBlock
        command="sudo chage -d 0 maria"
        output=""
      />
      <TerminalBlock
        command="ssh maria@localhost"
        output={`maria@localhost's password:
You are required to change your password immediately (administrator enforced).
Current password:
New password:
Retype new password:`}
      />

      <h3>Criar um usuário de serviço (sem login)</h3>
      <TerminalBlock
        command="sudo useradd -r -s /usr/bin/nologin -d /var/lib/myapp -m myapp"
        output=""
      />
      <TerminalBlock
        command="getent passwd myapp"
        output="myapp:x:979:979::/var/lib/myapp:/usr/bin/nologin"
      />

    </PageContainer>
  );
}
