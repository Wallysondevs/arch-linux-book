import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Permissoes() {
  return (
    <PageContainer
      title="Permissões de Arquivos e Diretórios"
      subtitle="rwx, octal, chmod, chown, umask, SUID/SGID/sticky e ACLs — explicados pela saída real de cada comando."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Sistema de Arquivos"
    >
      <p>
        O sistema de permissões do Linux é o mecanismo fundamental de segurança. Cada arquivo e
        diretório tem um <strong>dono</strong>, um <strong>grupo</strong> associado e três
        conjuntos de permissões que controlam quem pode ler, escrever e executar.
      </p>

      <h2>1. Decifrando <code>ls -l</code></h2>

      <TerminalBlock
        command="ls -l"
        output={`total 16
-rwxr-xr-- 1 joao desenvolvedores 4096 Jan 15 10:30 {g}script.sh{/}
drwxr-x--- 2 joao joao            4096 Jan 15 10:30 {b}documentos{/}
lrwxrwxrwx 1 root root              11 Jan 15 10:30 {c}link{/} -> /usr/bin/vim
-rw-r--r-- 1 joao joao             217 Jan 15 10:30 README.md`}
      />

      <OutputBlock
        title="anatomia de uma linha do ls -l"
        output={`-rwxr-xr-- 1 joao desenvolvedores 4096 Jan 15 10:30 script.sh`}
        annotations={[
          { line: 0, note: "tipo + 9 bits | links | dono | grupo | tamanho | data | nome" },
        ]}
      />

      <p>Decompondo o primeiro campo, caractere por caractere:</p>

      <OutputBlock
        title="-rwxr-xr--"
        output={`-  rwx  r-x  r--
│  │││  │││  │││
│  │││  │││  └┴┴── outros (other):  r-- = só leitura
│  │││  └┴┴─────── grupo (group):   r-x = leitura e execução
│  └┴┴──────────── dono (user):     rwx = leitura, escrita e execução
└────────────────── tipo: - arquivo, d diretório, l link, b bloco, c char`}
      />

      <p>O significado de cada bit muda dependendo de ser arquivo ou diretório:</p>

      <OutputBlock
        title="r / w / x em arquivos vs diretórios"
        output={`bit | em ARQUIVO                        | em DIRETÓRIO
----|------------------------------------|--------------------------------------
 r  | ler o conteúdo                     | listar nomes (ls)
 w  | modificar o conteúdo               | criar/renomear/apagar entradas
 x  | executar como programa             | entrar (cd) e acessar inodes`}
      />

      <AlertBox type="info" title="Diretório com r mas sem x">
        Você consegue <code>ls</code> os nomes mas não consegue <code>cd</code> nem ler nenhum
        arquivo dentro. Para acessar conteúdo de um diretório, <strong>x é obrigatório</strong>.
      </AlertBox>

      <h2>2. Octal: o atalho de 3 dígitos</h2>

      <OutputBlock
        title="tabela de equivalência"
        output={`r=4   w=2   x=1   -=0
─────────────────────
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
-wx = 0+2+1 = 3
-w- = 0+2+0 = 2
--x = 0+0+1 = 1
--- = 0+0+0 = 0`}
      />

      <OutputBlock
        title="combos mais comuns"
        output={`755  rwxr-xr-x   executáveis e diretórios padrão
644  rw-r--r--   arquivos texto / config legível
700  rwx------   diretório só do dono (~/.ssh)
600  rw-------   chave privada SSH
777  rwxrwxrwx   ⚠ NUNCA use isso
000  ---------   ninguém pode nada`}
      />

      <h2>3. <code>chmod</code> — saída real com <code>-v</code></h2>

      <p>
        Sem <code>-v</code>, o <code>chmod</code> é silencioso. Use <code>-v</code> (verbose) ou
        <code>-c</code> (changes only) para ver o que aconteceu:
      </p>

      <TerminalBlock
        command={`echo '#!/bin/bash\\necho ola' > script.sh
ls -l script.sh
chmod -v 755 script.sh
ls -l script.sh`}
        output={`-rw-r--r-- 1 joao joao 23 Jan 15 11:02 script.sh
mode of 'script.sh' changed from 0644 ({y}rw-r--r--{/}) to 0755 ({g}rwxr-xr-x{/})
-rwxr-xr-x 1 joao joao 23 Jan 15 11:02 script.sh`}
      />

      <h3>Modo simbólico</h3>

      <TerminalBlock
        command="chmod -v u+x,go-w arquivo.txt"
        output={`mode of 'arquivo.txt' changed from 0664 ({y}rw-rw-r--{/}) to 0744 ({g}rwxr--r--{/})`}
      />

      <TerminalBlock
        command="chmod -v a+r,o-w *.conf"
        output={`mode of 'app.conf' retained as 0644 (rw-r--r--)
mode of 'db.conf' changed from 0660 ({y}rw-rw----{/}) to 0664 ({g}rw-rw-r--{/})`}
      />

      <CommandFlagList
        command="chmod"
        items={[
          { flag: "u / g / o / a", description: "Alvo: dono / grupo / outros / todos.", example: "chmod u+x script.sh" },
          { flag: "+ / - / =", description: "Adiciona / remove / define exatamente.", example: "chmod g=rx pasta/" },
          { flag: "-v", long: "--verbose", description: "Imprime UMA linha por arquivo (mudou ou não).", example: "chmod -v 644 *.txt" },
          { flag: "-c", long: "--changes", description: "Como -v, mas só mostra arquivos que mudaram.", example: "chmod -cR 755 ./projeto" },
          { flag: "-R", long: "--recursive", description: "Aplica em toda a árvore.", example: "chmod -R u=rwX,go=rX docs/" },
          { flag: "X", description: "Permissão de execução SOMENTE em diretórios (e em arquivos que já tinham x). Ideal para chmod -R.", example: "chmod -R u=rwX,go=rX site/" },
          { flag: "--reference=", description: "Copia as permissões de outro arquivo.", example: "chmod --reference=modelo.txt novo.txt" },
        ]}
      />

      <AlertBox type="warning" title="Por que chmod -R 777 é sempre errado">
        <p>
          Veja o que acontece com um diretório SSH:
        </p>
      </AlertBox>

      <TerminalBlock
        command="chmod -R 777 ~/.ssh && ssh servidor"
        output={`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0777 for '/home/joao/.ssh/id_ed25519' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/home/joao/.ssh/id_ed25519": bad permissions
joao@servidor: Permission denied (publickey).`}
        exitCode={255}
      />

      <h2>4. <code>X</code> maiúsculo: dando x só em diretórios</h2>

      <TerminalBlock
        command={`mkdir -p projeto/{src,docs}
touch projeto/README.md projeto/src/main.py projeto/docs/notas.txt
chmod -R 600 projeto
chmod -R u+rwX,go+rX projeto
find projeto -printf '%m %p\\n'`}
        output={`755 projeto
755 projeto/src
644 projeto/src/main.py
755 projeto/docs
644 projeto/docs/notas.txt
644 projeto/README.md`}
        comment="X virou x nos diretórios e foi ignorado nos arquivos. Mágica."
      />

      <h2>5. <code>chown</code> e <code>chgrp</code></h2>

      <TerminalBlock
        command="sudo chown -v maria:desenvolvedores arquivo.txt"
        output={`changed ownership of 'arquivo.txt' from joao:joao to maria:desenvolvedores`}
      />

      <TerminalBlock
        command="sudo chown -Rv joao:joao /home/joao/projeto"
        output={`changed ownership of '/home/joao/projeto/main.py' from root:root to joao:joao
changed ownership of '/home/joao/projeto/utils.py' from root:root to joao:joao
changed ownership of '/home/joao/projeto' from root:root to joao:joao`}
      />

      <TerminalBlock
        command="sudo chgrp -v www-data /srv/http"
        output={`changed group of '/srv/http' from root to http`}
      />

      <CommandFlagList
        command="chown"
        items={[
          { flag: "user:group", description: "Define dono e grupo. Pode usar só user, só :group, ou user: (que põe o grupo primário do user).", example: "sudo chown joao:wheel arquivo" },
          { flag: "-R", description: "Recursivo. Cuidado para não atravessar links simbólicos.", example: "sudo chown -R joao /home/joao" },
          { flag: "-h", description: "Em links simbólicos: muda o link, não o alvo.", example: "sudo chown -h joao link" },
          { flag: "-v / -c", description: "Verbose / changes only.", example: "sudo chown -cv root /etc/sudoers" },
          { flag: "--reference=", description: "Copia owner/group de outro arquivo.", example: "sudo chown --reference=modelo alvo" },
        ]}
      />

      <h2>6. <code>umask</code> — permissões padrão</h2>

      <p>
        O <code>umask</code> NÃO define permissões — ele define quais bits serão{" "}
        <strong>removidos</strong> ao criar um arquivo novo.
      </p>

      <TerminalBlock
        command="umask"
        output={`0022`}
      />

      <TerminalBlock
        command="umask -S"
        output={`u=rwx,g=rx,o=rx`}
        comment="formato simbólico: o que SOBRA"
      />

      <OutputBlock
        title="cálculo: permissão final = padrão & ~umask"
        output={`                  arquivo  diretório
padrão máximo:    666      777
umask:            022      022
         ─────────────────────────
permissão final:  644      755
                  rw-r--r-- rwxr-xr-x`}
      />

      <p>Veja na prática:</p>

      <TerminalBlock
        command={`umask 022
touch a.txt && mkdir a.dir
ls -ld a.txt a.dir`}
        output={`drwxr-xr-x 2 joao joao 4096 Jan 15 11:30 a.dir
-rw-r--r-- 1 joao joao    0 Jan 15 11:30 a.txt`}
      />

      <TerminalBlock
        command={`umask 077
touch b.txt && mkdir b.dir
ls -ld b.txt b.dir`}
        output={`drwx------ 2 joao joao 4096 Jan 15 11:30 b.dir
-rw------- 1 joao joao    0 Jan 15 11:30 b.txt`}
        comment="umask restritiva: ninguém além do dono enxerga nada"
      />

      <h2>7. Bits especiais: SUID, SGID e sticky</h2>

      <h3>SUID — executar como o dono do arquivo</h3>

      <TerminalBlock
        command="ls -l /usr/bin/passwd /usr/bin/sudo"
        output={`-rw{r}s{/}r-xr-x 1 root root  68208 Jan 15 /usr/bin/passwd
-rw{r}s{/}r-xr-x 1 root root 175400 Jan 15 /usr/bin/sudo`}
        comment="o 's' onde seria 'x' do dono = SUID. Roda como root mesmo se você é usuário comum."
      />

      <TerminalBlock
        command="sudo chmod -v u+s ./meu_binario  # ou chmod 4755"
        output={`mode of './meu_binario' changed from 0755 (rwxr-xr-x) to 4755 (rwsr-xr-x)`}
      />

      <p>Listando todos os SUIDs do sistema (auditoria de segurança):</p>

      <TerminalBlock
        command="sudo find / -perm -4000 -type f 2>/dev/null"
        output={`/usr/bin/passwd
/usr/bin/sudo
/usr/bin/su
/usr/bin/chage
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/umount
/usr/lib/polkit-1/polkit-agent-helper-1`}
      />

      <AlertBox type="danger" title="SUID em script shell = back-door">
        SUID em scripts shell é IGNORADO pelo kernel Linux por ser inseguro. Mesmo que você
        consiga (em binários compilados), audite — uma vulnerabilidade ali = root.
      </AlertBox>

      <h3>SGID — herança de grupo em diretórios</h3>

      <TerminalBlock
        command={`sudo mkdir /projetos/webapp
sudo chown :desenvolvedores /projetos/webapp
sudo chmod -v 2775 /projetos/webapp
ls -ld /projetos/webapp`}
        output={`mode of '/projetos/webapp' changed from 0755 (rwxr-xr-x) to 2775 (rwxrw{m}s{/}r-x)
drwxrw{m}s{/}r-x 2 root desenvolvedores 4096 Jan 15 11:45 /projetos/webapp`}
        comment="o 's' no campo do grupo = SGID. Novos arquivos herdarão o grupo 'desenvolvedores'."
      />

      <TerminalBlock
        command={`cd /projetos/webapp
touch arquivo_do_joao.txt
ls -l arquivo_do_joao.txt`}
        output={`-rw-r--r-- 1 joao desenvolvedores 0 Jan 15 11:46 arquivo_do_joao.txt`}
        comment="grupo virou 'desenvolvedores' automaticamente, mesmo sem chgrp"
      />

      <h3>Sticky bit — só o dono apaga</h3>

      <TerminalBlock
        command="ls -ld /tmp"
        output={`drwxrwxrw{m}t{/} 23 root root 4096 Jan 15 11:50 /tmp`}
        comment="o 't' onde seria 'x' dos outros = sticky bit"
      />

      <TerminalBlock
        command={`sudo mkdir /compartilhado
sudo chmod -v 1777 /compartilhado
ls -ld /compartilhado`}
        output={`mode of '/compartilhado' changed from 0755 (rwxr-xr-x) to 1777 (rwxrwxrwt)
drwxrwxrwt 2 root root 4096 Jan 15 11:52 /compartilhado`}
      />

      <OutputBlock
        title="bits especiais resumidos (octal de 4 dígitos)"
        output={`4000 = SUID         (chmod 4755 = rwsr-xr-x)
2000 = SGID         (chmod 2775 = rwxrwsr-x)
1000 = sticky       (chmod 1777 = rwxrwxrwt)
─────
quando o bit "x" base existe → letra minúscula (s, t)
quando NÃO existe              → letra MAIÚSCULA (S, T)`}
      />

      <TerminalBlock
        command="chmod 4644 demo && ls -l demo"
        output={`-rw{r}S{/}r--r-- 1 joao joao 0 Jan 15 11:55 demo`}
        comment="S maiúsculo: SUID setado, mas sem x — provavelmente um erro!"
      />

      <h2>8. ACLs — permissões finas</h2>

      <p>
        Quando o trio rwx não basta (ex.: dar acesso só para Maria, sem mudar grupo),
        usa-se ACL.
      </p>

      <TerminalBlock
        command="getfacl arquivo.txt"
        output={`# file: arquivo.txt
# owner: joao
# group: joao
user::rw-
group::r--
other::r--`}
        comment="sem ACL extra, equivalente ao ls -l"
      />

      <TerminalBlock
        command={`setfacl -m u:maria:rw arquivo.txt
ls -l arquivo.txt
getfacl arquivo.txt`}
        output={`-rw-rw-r--{m}+{/} 1 joao joao 217 Jan 15 12:01 arquivo.txt
# file: arquivo.txt
# owner: joao
# group: joao
user::rw-
{g}user:maria:rw-{/}
group::r--
mask::rw-
other::r--`}
        comment="o '+' no ls -l indica ACL extra. Maria agora pode escrever sem estar no grupo."
      />

      <TerminalBlock
        command={`setfacl -d -m u:maria:rwx /projetos/webapp
getfacl /projetos/webapp`}
        output={`# file: projetos/webapp
# owner: root
# group: desenvolvedores
user::rwx
group::rwx
other::r-x
default:user::rwx
default:user:maria:rwx
default:group::rwx
default:mask::rwx
default:other::r-x`}
        comment="-d = ACL DEFAULT: novos arquivos no diretório herdarão essas regras"
      />

      <TerminalBlock
        command="setfacl -b arquivo.txt && getfacl arquivo.txt"
        output={`# file: arquivo.txt
# owner: joao
# group: joao
user::rw-
group::r--
other::r--`}
        comment="-b = remove TODAS as ACLs extras"
      />

      <CommandFlagList
        command="setfacl"
        items={[
          { flag: "-m", long: "--modify", description: "Adiciona/altera uma entrada ACL.", example: "setfacl -m u:maria:rw arq.txt" },
          { flag: "-x", long: "--remove", description: "Remove uma entrada ACL específica.", example: "setfacl -x u:maria arq.txt" },
          { flag: "-b", long: "--remove-all", description: "Remove todas as ACLs estendidas.", example: "setfacl -b arq.txt" },
          { flag: "-d", long: "--default", description: "Define ACL padrão de um diretório (herdada).", example: "setfacl -d -m g:dev:rwx pasta/" },
          { flag: "-R", description: "Recursivo.", example: "setfacl -R -m u:maria:rX docs/" },
          { flag: "--set-file=-", description: "Importa ACLs de stdin (combine com getfacl).", example: "getfacl src | setfacl --set-file=- dst" },
        ]}
      />

      <h2>9. Atributos estendidos: <code>chattr</code> / <code>lsattr</code></h2>

      <TerminalBlock
        command="sudo chattr +i /etc/resolv.conf"
        output={``}
        comment="sem saída = sucesso. resolv.conf agora é IMUTÁVEL."
      />

      <TerminalBlock
        command="sudo rm /etc/resolv.conf"
        output={`rm: cannot remove '/etc/resolv.conf': Operation not permitted`}
        exitCode={1}
        comment="nem o root consegue apagar"
      />

      <TerminalBlock
        command="lsattr /etc/resolv.conf"
        output={`----i---------e----- /etc/resolv.conf`}
        comment="o 'i' confirma o atributo immutable"
      />

      <TerminalBlock
        command="sudo chattr -i /etc/resolv.conf"
        output={``}
        comment="remove a imutabilidade"
      />

      <OutputBlock
        title="atributos úteis (chattr +X)"
        output={`+i  immutable          ninguém edita/renomeia/deleta (nem root)
+a  append-only        só pode adicionar (perfeito p/ logs)
+c  compressed         compressão automática (btrfs/ext4)
+s  secure delete      sobrescreve com zeros ao apagar
+u  undeletable        permite recuperação após delete
+A  no atime update    não atualiza timestamp de acesso (perf)`}
      />

      <h2>10. Receitas práticas</h2>

      <h3>Diretório de equipe com herança de grupo</h3>

      <TerminalBlock
        command={`sudo groupadd web
sudo mkdir -p /srv/web
sudo chown root:web /srv/web
sudo chmod 2775 /srv/web        # SGID + 775
sudo usermod -aG web joao
sudo usermod -aG web maria
ls -ld /srv/web`}
        output={`drwxrwsr-x 2 root web 4096 Jan 15 12:20 /srv/web`}
      />

      <h3>Permissões corretas do <code>~/.ssh</code></h3>

      <TerminalBlock
        command={`chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/id_ed25519.pub ~/.ssh/known_hosts
ls -l ~/.ssh`}
        output={`total 16
-rw-r--r-- 1 joao joao  745 Jan 15 12:25 authorized_keys
-rw------- 1 joao joao  411 Jan 15 12:25 id_ed25519
-rw-r--r-- 1 joao joao  102 Jan 15 12:25 id_ed25519.pub
-rw-r--r-- 1 joao joao 1024 Jan 15 12:25 known_hosts`}
      />

      <h3>Auditoria de arquivos perigosos</h3>

      <TerminalBlock
        command="sudo find / -xdev -perm -o+w -type f -not -path '/proc/*' 2>/dev/null | head -5"
        output={`/var/spool/postfix/maildrop/.empty
/srv/uploads/temp/x.dat
/tmp/screen-output.log`}
        comment="-o+w = world-writable. Devem ser raros."
      />

      <TerminalBlock
        command="sudo find / -xdev -perm -2 ! -type l 2>/dev/null | wc -l"
        output={`12`}
        comment="contagem rápida de itens graváveis por todos"
      />

      <h2>11. Erros e como ler as mensagens</h2>

      <TerminalBlock
        command="cat /etc/shadow"
        output={`cat: /etc/shadow: Permission denied`}
        exitCode={1}
        comment="você não é root e o arquivo é 0640 root:shadow"
      />

      <TerminalBlock
        command="./meu_script.sh"
        output={`bash: ./meu_script.sh: Permission denied`}
        exitCode={126}
        comment="faltou x: chmod +x meu_script.sh"
      />

      <TerminalBlock
        command="touch /etc/teste"
        output={`touch: cannot touch '/etc/teste': Permission denied`}
        exitCode={1}
        comment="/etc é root:root 0755 — você precisa de sudo"
      />

      <AlertBox type="danger" title="O que NÃO fazer">
        <ul>
          <li><code>chmod -R 777 /</code> — destrói toda a segurança e quebra SSH, sudo, cron…</li>
          <li><code>chown -R root:root /home</code> — usuários perdem acesso aos próprios arquivos</li>
          <li><code>chmod -R +x</code> sem o <code>X</code> maiúsculo — torna arquivos texto "executáveis"</li>
          <li><code>chmod 666</code> num executável — remove o x e ele para de rodar</li>
          <li>Esquecer <code>chattr +i</code> — você vai bater a cabeça depois</li>
        </ul>
      </AlertBox>

      <h2>Referências</h2>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/File_permissions_and_attributes" target="_blank" rel="noopener noreferrer">ArchWiki — File permissions and attributes</a></li>
        <li><a href="https://wiki.archlinux.org/title/Access_Control_Lists" target="_blank" rel="noopener noreferrer">ArchWiki — Access Control Lists</a></li>
        <li><code>man chmod</code>, <code>man chown</code>, <code>man umask</code></li>
        <li><code>man setfacl</code>, <code>man getfacl</code>, <code>man chattr</code></li>
      </ul>
    </PageContainer>
  );
}
