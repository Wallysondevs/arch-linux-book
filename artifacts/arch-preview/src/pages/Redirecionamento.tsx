import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Redirecionamento() {
  return (
    <PageContainer
      title="Redirecionamento e Pipes"
      subtitle="stdin, stdout, stderr, pipes e os filtros clássicos do UNIX. Cada exemplo mostra a entrada real e a saída literal que aparece no terminal."
      difficulty="intermediario"
      timeToRead="25 min"
      category="Shell Avançado"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal Bash/Zsh.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>stdin / stdout / stderr</strong> — descritores 0, 1, 2. Entrada, saída, erro.
      </p>
      <p>
        <strong>{">"}</strong> — redireciona stdout para arquivo (sobrescreve). <code>{">>"}</code> anexa.
      </p>
      <p>
        <strong>{"2>"}</strong> — redireciona stderr. <code>{"2>&1"}</code> manda stderr para onde foi stdout.
      </p>
      <p>
        <strong>|</strong> — pipe — passa stdout do comando A como stdin do B.
      </p>
      <p>
        <strong>tee</strong> — escreve no arquivo <em>e</em> também na tela.
      </p>

      <h2>Os três fluxos padrão</h2>
      <p>
        Todo processo no Linux nasce com três descritores de arquivo abertos. Eles
        são apenas <em>números</em> que apontam para algum lugar (terminal, arquivo,
        socket, pipe). Veja-os no procfs:
      </p>

      <TerminalBlock
        command="ls -l /proc/self/fd"
        output={`total 0
lrwx------ 1 user user 64 Mar 26 18:31 {b}0{/} -> /dev/pts/2
lrwx------ 1 user user 64 Mar 26 18:31 {b}1{/} -> /dev/pts/2
lrwx------ 1 user user 64 Mar 26 18:31 {b}2{/} -> /dev/pts/2
lr-x------ 1 user user 64 Mar 26 18:31 {b}3{/} -> /proc/2412/fd`}
      />

      <OutputBlock
        title="o que cada FD significa"
        output={`fd 0  →  stdin   (entrada padrão)
fd 1  →  stdout  (saída padrão)
fd 2  →  stderr  (saída de erro)`}
        annotations={[
          { line: 0, note: "lê do teclado por padrão" },
          { line: 1, note: "escreve no terminal" },
          { line: 2, note: "erros, separados de stdout" },
        ]}
      />

      <h2>Redirecionando stdout: <code>{">"}</code> e <code>{">>"}</code></h2>

      <TerminalBlock
        comment="> sobrescreve o arquivo do zero"
        command='echo "primeira" > log.txt'
        output=""
      />
      <TerminalBlock
        command='echo "segunda" > log.txt'
        output=""
      />
      <TerminalBlock
        command="cat log.txt"
        output="segunda"
        comment="o > apagou a primeira linha"
      />

      <TerminalBlock
        comment=">> acrescenta no final, sem apagar"
        command={`echo "linha A" > log.txt
echo "linha B" >> log.txt
echo "linha C" >> log.txt
cat log.txt`}
        output={`linha A
linha B
linha C`}
      />

      <AlertBox type="danger" title="Não confunda > com >>">
        Um único <code>{">"}</code> em arquivo existente <strong>trunca</strong> o
        conteúdo antes de escrever — você perde tudo. Use <code>{">>"}</code>{" "}
        sempre que quiser preservar.
      </AlertBox>

      <h2>Redirecionando stderr: <code>2{">"}</code> e <code>2{">>"}</code></h2>

      <TerminalBlock
        comment="ls em diretório que não existe — erro vai para stderr"
        command="ls /nao_existe"
        output="ls: cannot access '/nao_existe': {r}No such file or directory{/}"
        exitCode={2}
      />

      <TerminalBlock
        comment="redirecionando APENAS o erro"
        command="ls /nao_existe 2> erros.txt"
        output=""
      />
      <TerminalBlock
        command="cat erros.txt"
        output="ls: cannot access '/nao_existe': No such file or directory"
      />

      <TerminalBlock
        comment="separando saída e erro"
        command="ls /etc /nao_existe > saida.txt 2> erros.txt"
        output=""
      />
      <TerminalBlock
        command={`cat saida.txt
echo "---"
cat erros.txt`}
        output={`/etc:
adjtime
crypttab
fstab
group
hostname
hosts
locale.conf
machine-id
mkinitcpio.conf
nsswitch.conf
os-release
pacman.conf
passwd
profile
resolv.conf
shadow
ssh
sudoers
systemd
---
ls: cannot access '/nao_existe': No such file or directory`}
      />

      <h2>Combinando stdout e stderr: <code>2{">"}&amp;1</code> e <code>&amp;{">"}</code></h2>

      <TerminalBlock
        comment="2>&1 — manda stderr para onde stdout está apontando"
        command="ls /etc /nao_existe > tudo.txt 2>&1"
        output=""
      />
      <TerminalBlock
        command="cat tudo.txt"
        output={`ls: cannot access '/nao_existe': No such file or directory
/etc:
adjtime
fstab
hostname
...`}
      />

      <AlertBox type="info" title="A ordem importa em 2>&1">
        <code>cmd {">"} f 2{">"}&amp;1</code> funciona; <code>cmd 2{">"}&amp;1 {">"} f</code> não.
        O shell processa redirecionamentos da esquerda para a direita: primeiro
        precisa saber para onde stdout vai, depois aponta stderr para o mesmo lugar.
      </AlertBox>

      <TerminalBlock
        comment="bash 4+: &> é atalho para > arq 2>&1"
        command="ls /etc /nao_existe &> tudo.txt"
        output=""
      />
      <TerminalBlock
        comment="&>> acrescenta ambos"
        command="make &>> build.log"
        output=""
      />

      <h2>Redirecionando stdin: <code>{"<"}</code></h2>

      <TerminalBlock
        comment="cria um arquivo desordenado"
        command={`cat > nomes.txt << 'EOF'
joao
ana
bruno
ana
EOF`}
        output=""
      />

      <TerminalBlock
        command="sort < nomes.txt"
        output={`ana
ana
bruno
joao`}
      />

      <TerminalBlock
        comment="sort lê de stdin; < manda o arquivo no lugar do teclado"
        command="wc -l < nomes.txt"
        output="4"
      />

      <h2>Here-documents (<code>{"<<"}EOF</code>) e here-strings (<code>{"<<<"}</code>)</h2>

      <TerminalBlock
        comment="passa várias linhas para um comando sem precisar de arquivo"
        command={`cat << EOF > /tmp/config.ini
[server]
host = 192.168.1.10
port = 8080
EOF`}
        output=""
      />
      <TerminalBlock
        command="cat /tmp/config.ini"
        output={`[server]
host = 192.168.1.10
port = 8080`}
      />

      <TerminalBlock
        comment="here-string: uma única linha como stdin"
        command={`grep -o 'erro' <<< "linha com erro aqui"`}
        output="erro"
      />

      <TerminalBlock
        command={`bc <<< "(2 + 3) * 4"`}
        output="20"
      />

      <h2>O buraco negro: <code>/dev/null</code></h2>

      <TerminalBlock
        comment="silencia mensagens de erro do find"
        command='find / -name "*.conf" 2> /dev/null | head -3'
        output={`/etc/pacman.conf
/etc/mkinitcpio.conf
/etc/locale.conf`}
      />

      <TerminalBlock
        comment="descarta tudo (stdout e stderr) — útil em cron"
        command="backup.sh &> /dev/null"
        output=""
      />

      <AlertBox type="info" title="O que é /dev/null?">
        Um dispositivo de caractere especial. Tudo escrito nele é descartado
        instantaneamente; ler dele retorna EOF. Veja: <code>ls -l /dev/null</code> →
        <code>crw-rw-rw- 1 root root 1, 3 ... /dev/null</code>.
      </AlertBox>

      <h2>Pipes (<code>|</code>) — encadeando comandos</h2>

      <p>
        O pipe conecta o stdout de um processo ao stdin do próximo. Ambos rodam em
        paralelo, com o kernel transportando os bytes em um buffer de 64 KiB.
      </p>

      <TerminalBlock
        command="ps aux | wc -l"
        output="187"
        comment="quantos processos estão rodando agora"
      />

      <TerminalBlock
        command="pacman -Q | wc -l"
        output="942"
        comment="quantos pacotes instalados"
      />

      <TerminalBlock
        command="ls /etc | grep '^p'"
        output={`pacman.conf
pacman.d
pam.d
passwd
passwd-
profile
profile.d`}
      />

      <h2>tee — divide a saída em dois caminhos</h2>

      <TerminalBlock
        comment="grava em arquivo E mostra na tela"
        command={`uname -a | tee sistema.txt`}
        output="Linux archlinux 6.12.1-arch1-1 #1 SMP PREEMPT_DYNAMIC Wed, 20 Mar 2026 x86_64 GNU/Linux"
      />

      <TerminalBlock
        comment="-a acrescenta em vez de sobrescrever"
        command={`date | tee -a /var/log/meu.log`}
        output="Wed Mar 26 18:42:11 -03 2026"
      />

      <AlertBox type="warning" title="sudo + redirecionamento não funciona como você espera">
        O <code>{">"}</code> é interpretado pelo seu shell, não pelo sudo. Por isso
        <code>sudo echo &quot;x&quot; {">"} /etc/arquivo</code> falha com
        <em>Permission denied</em>. Use <code>tee</code>:
      </AlertBox>

      <TerminalBlock
        command={`echo "127.0.0.1 dev.local" | sudo tee -a /etc/hosts`}
        output="127.0.0.1 dev.local"
      />

      <h2>cut — extrai colunas</h2>

      <CommandFlagList
        command="cut"
        items={[
          { flag: "-d", long: "--delimiter", description: "Caractere que separa os campos.", example: "cut -d':' -f1 /etc/passwd" },
          { flag: "-f", long: "--fields", description: "Quais campos imprimir (1-indexado, suporta intervalo 1-3 e listas 1,3,5).", example: "cut -f1,3 -d, dados.csv" },
          { flag: "-c", long: "--characters", description: "Recorta por posição de caractere.", example: "cut -c1-10 arquivo.txt" },
          { flag: "--complement", description: "Inverte a seleção (mostra o que sobrou)." },
        ]}
      />

      <TerminalBlock
        command="head -3 /etc/passwd"
        output={`root:x:0:0::/root:/usr/bin/bash
bin:x:1:1::/:/usr/bin/nologin
daemon:x:2:2::/:/usr/bin/nologin`}
      />

      <TerminalBlock
        comment="só o usuário e o shell"
        command="cut -d':' -f1,7 /etc/passwd | head -3"
        output={`root:/usr/bin/bash
bin:/usr/bin/nologin
daemon:/usr/bin/nologin`}
      />

      <h2>sort &amp; uniq</h2>

      <CommandFlagList
        command="sort"
        items={[
          { flag: "-n", description: "Ordenação numérica (ao invés de lexicográfica).", example: "sort -n numeros.txt" },
          { flag: "-r", description: "Reverso (descendente)." },
          { flag: "-h", description: "Ordena unidades humanas (1K, 2M, 3G).", example: "du -sh * | sort -h" },
          { flag: "-k", description: "Ordena por uma coluna específica.", example: "sort -k2 -n dados.txt" },
          { flag: "-u", description: "Único — remove duplicatas (combina com sort + uniq)." },
          { flag: "-t", description: "Define separador de campo.", example: "sort -t':' -k3 -n /etc/passwd" },
        ]}
      />

      <TerminalBlock
        command={`printf '%s\\n' banana ana bruno ana banana | sort`}
        output={`ana
ana
banana
banana
bruno`}
      />

      <TerminalBlock
        comment="uniq SÓ funciona em linhas adjacentes — sempre sort antes"
        command={`printf '%s\\n' banana ana bruno ana banana | sort | uniq`}
        output={`ana
banana
bruno`}
      />

      <TerminalBlock
        comment="-c conta ocorrências"
        command={`printf '%s\\n' banana ana bruno ana banana | sort | uniq -c`}
        output={`      2 ana
      2 banana
      1 bruno`}
      />

      <TerminalBlock
        comment="receita clássica: top 5 mais frequentes"
        command="cut -d' ' -f1 /var/log/auth.log | sort | uniq -c | sort -rn | head -5"
        output={`    412 Mar
    187 Failed
     93 sshd[1042]:
     58 Accepted
     12 sudo:`}
      />

      <h2>grep — filtragem por padrão</h2>

      <CommandFlagList
        command="grep"
        items={[
          { flag: "-i", description: "Ignora maiúsculas/minúsculas.", example: "grep -i error log" },
          { flag: "-v", description: "Inverte: mostra linhas que NÃO casam." },
          { flag: "-n", description: "Mostra o número da linha." },
          { flag: "-r", description: "Recursivo dentro de diretórios." },
          { flag: "-E", description: "Regex estendida (POSIX ERE). Equivale a egrep.", example: "grep -E '[0-9]{3}' arq" },
          { flag: "-c", description: "Conta apenas o número de linhas que casam." },
          { flag: "-A N", description: "Mostra N linhas DEPOIS do match (After)." },
          { flag: "-B N", description: "Mostra N linhas ANTES do match (Before)." },
          { flag: "-o", description: "Imprime apenas o trecho que casou, não a linha inteira." },
        ]}
      />

      <TerminalBlock
        command="grep -n 'root' /etc/passwd"
        output={`{y}1{/}:root:x:0:0::/root:/usr/bin/bash
{y}10{/}:operator:x:11:0:operator:/root:/usr/bin/nologin`}
      />

      <TerminalBlock
        command="grep -c '^#' /etc/pacman.conf"
        output="37"
        comment="conta linhas que começam com #"
      />

      <TerminalBlock
        command={`journalctl -b 2>/dev/null | grep -iE 'error|fail' | head -3`}
        output={`Mar 26 18:30:11 archlinux kernel: nvme0n1: I/O error, dev nvme0n1
Mar 26 18:30:14 archlinux systemd[1]: Failed to start cups.service
Mar 26 18:30:15 archlinux dbus-broker-launch[492]: Service file invalid`}
      />

      <h2>sed — edição em fluxo</h2>

      <TerminalBlock
        comment="substituir a primeira ocorrência por linha"
        command={`echo 'foo foo bar' | sed 's/foo/QUX/'`}
        output="QUX foo bar"
      />

      <TerminalBlock
        comment="g = global: todas as ocorrências da linha"
        command={`echo 'foo foo bar' | sed 's/foo/QUX/g'`}
        output="QUX QUX bar"
      />

      <TerminalBlock
        comment="-i edita o arquivo no lugar (com backup .bak)"
        command="sed -i.bak 's/localhost/127.0.0.1/g' config.yml"
        output=""
      />

      <TerminalBlock
        comment="apaga linhas 5 a 10"
        command="sed '5,10d' arquivo.txt"
        output=""
      />

      <TerminalBlock
        comment="extrai o IP de cada linha de auth.log"
        command={`echo 'Mar 26 sshd[1]: Failed from 192.168.1.10 port 22' \\
  | sed -E 's/.*from ([0-9.]+).*/\\1/'`}
        output="192.168.1.10"
      />

      <h2>awk — processamento de colunas</h2>

      <TerminalBlock
        command="ls -l /etc | head -4"
        output={`total 1228
drwxr-xr-x  3 root root    4096 Feb  3 11:02 X11
-rw-r--r--  1 root root      44 Jan 19 10:10 adjtime
drwxr-xr-x  4 root root    4096 Feb  3 11:02 alsa`}
      />

      <TerminalBlock
        comment="só o tamanho ($5) e o nome ($9)"
        command={`ls -l /etc | awk 'NR>1 {print $5, $9}' | head -3`}
        output={`4096 X11
44 adjtime
4096 alsa`}
      />

      <TerminalBlock
        comment="separador customizado: vírgula"
        command={`echo 'maria,42,sp' | awk -F',' '{print $1, "tem", $2, "anos"}'`}
        output="maria tem 42 anos"
      />

      <TerminalBlock
        comment="filtro: só linhas onde a 5ª coluna > 1000"
        command={`ls -l /etc | awk 'NR>1 && $5 > 1000 {print $9, $5}' | head -3`}
        output={`X11 4096
alsa 4096
ca-certificates 4096`}
      />

      <TerminalBlock
        comment="acumulador + END"
        command={`du -b /etc/*.conf 2>/dev/null | awk '{soma+=$1} END {print "total:", soma, "bytes"}'`}
        output="total: 24187 bytes"
      />

      <h2>xargs — transforma stdin em argumentos</h2>

      <CommandFlagList
        command="xargs"
        items={[
          { flag: "-n N", description: "Passa no máximo N argumentos por execução do comando.", example: "ls | xargs -n 1 echo" },
          { flag: "-I {}", description: "Substitui {} pelo argumento (ótimo para mv/cp).", example: "ls *.jpg | xargs -I {} mv {} /tmp/" },
          { flag: "-P N", description: "Roda até N processos em paralelo.", example: "ls *.png | xargs -P 4 -I {} optipng {}" },
          { flag: "-0", description: "Espera entradas separadas por NUL — combina com find -print0." },
          { flag: "-r", long: "--no-run-if-empty", description: "Não executa nada se o stdin estiver vazio (GNU)." },
        ]}
      />

      <TerminalBlock
        command={`find . -maxdepth 1 -name '*.tmp' -print | xargs -r rm -v`}
        output={`removed './a.tmp'
removed './b.tmp'
removed './c.tmp'`}
      />

      <AlertBox type="warning" title="find ... | xargs e nomes com espaço">
        Sempre prefira <code>find ... -print0 | xargs -0</code> ou
        <code>find ... -exec cmd {"{}"} +</code>. Sem isso, um arquivo chamado
        <code>foto férias.jpg</code> vira dois argumentos.
      </AlertBox>

      <h2>Substituição de processos: <code>{"<(cmd)"}</code></h2>

      <TerminalBlock
        comment="diff entre a saída de dois comandos sem arquivos temporários"
        command="diff <(pacman -Qq) <(pacman -Qqe)"
        output={`< alsa-lib
< glibc
< harfbuzz
< libffi
...`}
      />

      <CodeBlock
        title="loop alimentado por uma substituição de processo"
        code={`while IFS= read -r f; do
  echo "encontrado: $f"
done < <(find . -name '*.log')`}
      />

      <h2>Encadeamento: <code>;</code> <code>&amp;&amp;</code> <code>||</code></h2>

      <TerminalBlock
        comment="; — roda em sequência, não importa se falhou"
        command="false; echo seguiu"
        output="seguiu"
      />

      <TerminalBlock
        comment="&& — só roda o seguinte se o anterior teve sucesso (exit 0)"
        command="true && echo ok"
        output="ok"
      />
      <TerminalBlock
        command="false && echo nao_aparece"
        output=""
        exitCode={1}
      />

      <TerminalBlock
        comment="|| — só roda se o anterior falhou"
        command="false || echo deu_ruim"
        output="deu_ruim"
      />

      <TerminalBlock
        comment="combinando — ternário de shell"
        command="[ -f /etc/fstab ] && echo existe || echo nao"
        output="existe"
      />

      <h2>Tabela de bolso</h2>

      <OutputBlock
        title="referência rápida de redirecionamento"
        output={`cmd > arq         stdout para arquivo (sobrescreve)
cmd >> arq        stdout para arquivo (acrescenta)
cmd 2> arq        stderr para arquivo
cmd 2>> arq       stderr para arquivo (acrescenta)
cmd > arq 2>&1    ambos para o mesmo arquivo (ordem importa)
cmd &> arq        idem (atalho do bash)
cmd < arq         arquivo como stdin
cmd << EOF        here-document como stdin
cmd <<< "txt"     here-string como stdin
cmd1 | cmd2       pipe: stdout de cmd1 vira stdin de cmd2
cmd1 |& cmd2      pipe de stdout+stderr (atalho de 2>&1 |)
cmd > /dev/null   descarta stdout
diff <(a) <(b)    substituição de processo
cmd1 ; cmd2       sequencial
cmd1 && cmd2      cmd2 só se cmd1 == 0
cmd1 || cmd2      cmd2 só se cmd1 != 0`}
      />
    </PageContainer>
  );
}
