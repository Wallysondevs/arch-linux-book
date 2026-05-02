import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExpansoesBash() {
  return (
    <PageContainer
      title="Expansões do Bash"
      subtitle="Brace, til, parâmetro, comando, aritmética, glob, histórico e process substitution — a mecânica que transforma uma linha em uma poderosa expressão."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Shell"
    >
      <p>
        Antes de executar um comando, o bash faz uma sequência de <em>expansões</em> sobre
        a linha que você digitou. Conhecer cada tipo — e a ordem em que ocorrem — é o que
        diferencia copiar comando do Stack Overflow de <strong>escrever</strong> shell de
        verdade.
      </p>

      <AlertBox type="info" title="Ordem de expansão">
        O bash aplica, nesta ordem: <strong>1)</strong> brace <code>{`{a,b}`}</code>,{" "}
        <strong>2)</strong> til <code>~</code>, <strong>3)</strong> parâmetro/variável{" "}
        <code>$var</code>, comando <code>$()</code> e aritmética <code>$(())</code>,{" "}
        <strong>4)</strong> word splitting (com base em <code>$IFS</code>),{" "}
        <strong>5)</strong> pathname / glob <code>*</code>, <strong>6)</strong> remoção
        de quotes.
      </AlertBox>

      <h2>1. Brace expansion — listas e faixas</h2>

      <TerminalBlock
        command={`echo {arch,fedora,debian}-iso`}
        output={`arch-iso fedora-iso debian-iso`}
      />

      <TerminalBlock
        command={`echo arquivo{1..5}.txt`}
        output={`arquivo1.txt arquivo2.txt arquivo3.txt arquivo4.txt arquivo5.txt`}
      />

      <TerminalBlock
        comment="passo (incremento)"
        command={`echo {0..20..5}`}
        output={`0 5 10 15 20`}
      />

      <TerminalBlock
        comment="zero-pad mantido"
        command={`echo {01..10}`}
        output={`01 02 03 04 05 06 07 08 09 10`}
      />

      <TerminalBlock
        comment="letras"
        command={`echo {a..f}`}
        output={`a b c d e f`}
      />

      <TerminalBlock
        comment="combinação cartesiana"
        command={`echo {hot,cold}-{coffee,tea}`}
        output={`hot-coffee hot-tea cold-coffee cold-tea`}
      />

      <TerminalBlock
        comment="receita prática: criar várias pastas/arquivos de uma vez"
        command={`mkdir -p projeto/{src,test,docs}/{ts,go,py}`}
        output={``}
      />

      <TerminalBlock
        command="tree projeto"
        output={`projeto
├── docs
│   ├── go
│   ├── py
│   └── ts
├── src
│   ├── go
│   ├── py
│   └── ts
└── test
    ├── go
    ├── py
    └── ts

13 directories, 0 files`}
      />

      <TerminalBlock
        comment="backup rápido com brace (mesmo arquivo, só renomeado)"
        command={`cp /etc/pacman.conf{,.bak}`}
        output={``}
      />

      <OutputBlock
        title="o que aconteceu"
        output={`cp /etc/pacman.conf{,.bak}
↓ brace expansion
cp /etc/pacman.conf /etc/pacman.conf.bak`}
      />

      <h2>2. Til expansion (~)</h2>

      <CommandFlagList
        command="~"
        items={[
          { flag: "~", description: "Equivalente a $HOME do usuário atual.", example: "ls ~/Downloads" },
          { flag: "~user", description: "Home de outro usuário (lê /etc/passwd).", example: "ls ~root" },
          { flag: "~+", description: "Equivalente a $PWD (diretório atual)." },
          { flag: "~-", description: "Equivalente a $OLDPWD (diretório anterior, do último cd)." },
        ]}
      />

      <TerminalBlock
        command="echo ~ ~root ~+"
        output={`/home/joao /root /home/joao/projetos`}
      />

      <TerminalBlock
        comment="cd - usa OLDPWD"
        command="cd /tmp && cd - && pwd"
        output={`/home/joao
/home/joao`}
      />

      <h2>3. Parâmetro / variável</h2>

      <CommandFlagList
        command="${var...}"
        items={[
          { flag: "${var}", description: "Valor da variável. Use chaves quando concatenar.", example: 'echo "${nome}_v2"' },
          { flag: "${var:-PADRAO}", description: "PADRAO se var vazia/não-definida (não atribui).", example: 'echo "${EDITOR:-nano}"' },
          { flag: "${var:=PADRAO}", description: "Mesma coisa, mas TAMBÉM atribui à var." },
          { flag: "${var:?MSG}", description: "Erro com MSG se var vazia (útil em scripts strict)." },
          { flag: "${var:+ALT}", description: "Use ALT se var estiver SETADA (inverso do :-)." },
          { flag: "${#var}", description: "Tamanho em caracteres da string." },
          { flag: "${var:N:M}", description: "Substring iniciando em N com M caracteres." },
          { flag: "${var#PAD}", description: "Remove PAD do INÍCIO (mais curto). ## = mais longo.", example: '${arq#*.}  # tira tudo até primeiro .' },
          { flag: "${var%PAD}", description: "Remove PAD do FIM. %% = mais longo.", example: '${arq%.*}  # remove extensão' },
          { flag: "${var/PAD/REPL}", description: "Substitui PRIMEIRA ocorrência. //=todas." },
          { flag: "${var^^}", description: "Tudo MAIÚSCULO. ^ = só primeira letra." },
          { flag: "${var,,}", description: "Tudo minúsculo." },
          { flag: "${!prefixo*}", description: "Lista nomes de variáveis começando com prefixo." },
        ]}
      />

      <TerminalBlock
        command={`v="archlinux2026.iso"
echo "ext:    \${v##*.}"
echo "base:   \${v%.*}"
echo "upper:  \${v^^}"
echo "subst:  \${v/2026/2027}"
echo "size:   \${#v}"`}
        output={`ext:    iso
base:   archlinux2026
upper:  ARCHLINUX2026.ISO
subst:  archlinux2027.iso
size:   17`}
      />

      <TerminalBlock
        command={`unset PORTA
echo "porta=\${PORTA:-8080}"
echo "porta=\${PORTA:=9090}"   # agora atribui
echo "porta=$PORTA"`}
        output={`porta=8080
porta=9090
porta=9090`}
      />

      <h2>4. Command substitution — $(...)</h2>

      <TerminalBlock
        command={`echo "kernel: $(uname -r)"`}
        output={`kernel: 6.12.1-arch1-1`}
      />

      <TerminalBlock
        command={`pkgs=$(pacman -Q | wc -l)
echo "$pkgs pacotes instalados"`}
        output={`1247 pacotes instalados`}
      />

      <TerminalBlock
        comment="aninhamento natural"
        command={`echo "último kernel no /boot: $(ls -t /boot/vmlinuz-* | head -1)"`}
        output={`último kernel no /boot: /boot/vmlinuz-linux`}
      />

      <AlertBox type="warning" title="Backticks vs $()">
        A forma antiga <code>{`\`...\``}</code> ainda funciona mas é desencorajada:
        confunde a vista, não aninha bem e tem regras de escape esquisitas. Use sempre{" "}
        <code>$(...)</code>.
      </AlertBox>

      <h2>5. Aritmética — $((...)) e ((...))</h2>

      <TerminalBlock
        command={`echo $(( 2 ** 10 ))
echo $(( 100 / 7 ))
echo $(( 100 % 7 ))
echo $(( 0xFF + 0b1010 ))`}
        output={`1024
14
2
265`}
      />

      <TerminalBlock
        command={`x=5
(( x++, y = x * 2 ))
echo "x=$x y=$y"`}
        output={`x=6 y=12`}
      />

      <OutputBlock
        title="operadores aritméticos suportados"
        output={`+ - * / %       básicos
**              potência
++ --           pré/pós-incremento
== != < <= > >= comparação (retorna 1 ou 0)
&& || !         lógica
& | ^ ~ << >>   bit-a-bit
?:              ternário (cond ? a : b)
=, +=, -=, *=,  atribuição composta`}
      />

      <AlertBox type="info" title="bash não faz ponto-flutuante">
        <code>$(( 1 / 3 ))</code> dá <code>0</code>. Para float use <code>bc</code>{" "}
        (<code>echo "scale=4; 1/3" | bc</code>) ou <code>awk</code>{" "}
        (<code>{`awk 'BEGIN{print 1/3}'`}</code>).
      </AlertBox>

      <h2>6. Pathname expansion (glob)</h2>

      <CommandFlagList
        command="globs"
        items={[
          { flag: "*", description: "Qualquer sequência (exceto / e dotfiles por padrão).", example: "ls *.iso" },
          { flag: "?", description: "Exatamente UM caractere.", example: "ls arquivo?.txt" },
          { flag: "[abc]", description: "Um caractere dentre os listados." },
          { flag: "[a-z]", description: "Faixa." },
          { flag: "[!abc]", description: "Qualquer caractere EXCETO os listados." },
          { flag: "**", description: "Recursivo (precisa shopt -s globstar).", example: "ls **/*.tsx" },
          { flag: "{a,b}", description: "Brace — não é glob, mas combina." },
        ]}
      />

      <TerminalBlock
        command="ls /etc/p*.conf"
        output={`/etc/pacman.conf  /etc/profile  /etc/pulse  ...`}
      />

      <TerminalBlock
        comment="ligar globstar para **"
        command={`shopt -s globstar
ls -d src/**/*.ts | head -5`}
        output={`src/components/Header.ts
src/components/ui/Button.ts
src/lib/utils.ts
src/pages/Home.ts
src/pages/About.ts`}
      />

      <h3>Globs estendidos (extglob)</h3>

      <TerminalBlock
        command={`shopt -s extglob
echo arquivo.!(txt|md)`}
        output={`arquivo.log arquivo.bak`}
      />

      <OutputBlock
        title="padrões extglob"
        output={`?(pat)   zero ou uma vez
*(pat)   zero ou mais
+(pat)   uma ou mais
@(pat)   exatamente uma
!(pat)   QUALQUER COISA exceto pat`}
      />

      <h2>7. Process substitution — &lt;(...) e &gt;(...)</h2>

      <p>
        Cria um <em>file descriptor</em> (geralmente <code>/dev/fd/63</code>) que aparece
        para o programa como se fosse um arquivo de verdade. Útil quando um comando exige
        arquivo mas você só tem stdout.
      </p>

      <TerminalBlock
        comment="diff entre dois comandos sem arquivos temporários"
        command={`diff <(pacman -Qq) <(pacman -Qqe)`}
        output={`2,5d1
< acl
< archlinux-keyring
< attr
< autoconf
< ...
(diferença = pacotes instalados como dependência, não explicitamente)`}
      />

      <TerminalBlock
        comment="loop while sem perder variáveis (subshell)"
        command={`count=0
while read -r linha; do ((count++)); done < <(pacman -Q)
echo "$count pacotes"`}
        output={`1247 pacotes`}
      />

      <TerminalBlock
        comment=">(...) para enviar saída a um processo via pipe-arquivo"
        command={`tar czf - /etc 2>/dev/null | tee >(sha256sum > etc.tar.gz.sha) > etc.tar.gz`}
        output={``}
      />

      <h2>8. Quoting — controlando quem expande</h2>

      <OutputBlock
        title="as 3 formas de quote"
        output={`'single'    NADA expande (literal absoluto)
"double"    expande $var, $(...), $((...)), \\ — mas NÃO glob nem brace
\\char       escapa um único caractere`}
      />

      <TerminalBlock
        command={`nome="Arch Linux"
echo $nome           # word-splitting
echo "$nome"         # uma palavra
echo '$nome'         # literal`}
        output={`Arch Linux
Arch Linux
$nome`}
      />

      <TerminalBlock
        comment="por que SEMPRE aspar variáveis"
        command={`arquivo="meu doc.txt"
touch "$arquivo"
ls $arquivo          # word-splits → procura "meu" e "doc.txt"
ls "$arquivo"        # certo`}
        output={`ls: cannot access 'meu': No such file or directory
ls: cannot access 'doc.txt': No such file or directory
'meu doc.txt'`}
      />

      <h2>9. Histórico — !!, !$, !word</h2>

      <CommandFlagList
        command="!"
        items={[
          { flag: "!!", description: "Repete o ÚLTIMO comando.", example: "sudo !!" },
          { flag: "!$", description: "Último ARGUMENTO do último comando.", example: "ls /etc/hostname; cat !$" },
          { flag: "!*", description: "TODOS os argumentos do último comando." },
          { flag: "!N", description: "Comando de número N do history.", example: "!42" },
          { flag: "!-N", description: "Comando N posições atrás." },
          { flag: "!texto", description: "Último comando que COMEÇA com 'texto'.", example: "!pac" },
          { flag: "!?texto", description: "Último que CONTÉM 'texto'." },
          { flag: "^a^b", description: "Repete o último trocando a→b (1ª ocorrência)." },
        ]}
      />

      <TerminalBlock
        command={`pacman -Q | wc -l
sudo !!`}
        output={`1247
sudo pacman -Q | wc -l
1247`}
      />

      <TerminalBlock
        command={`mkdir /tmp/teste
cd !$`}
        output={`cd /tmp/teste`}
      />

      <TerminalBlock
        command={`echo "ola mundo"
^ola^oi`}
        output={`ola mundo
echo "oi mundo"
oi mundo`}
      />

      <h2>10. IFS — o separador de palavras</h2>

      <p>
        O bash divide a saída de expansões usando os caracteres em <code>$IFS</code>{" "}
        (default: espaço, tab, newline). Mudar IFS muda como loops e variáveis se
        comportam.
      </p>

      <TerminalBlock
        command={`IFS=':' read -ra partes <<< "alpha:beta:gamma:delta"
for p in "\${partes[@]}"; do echo "- $p"; done`}
        output={`- alpha
- beta
- gamma
- delta`}
      />

      <AlertBox type="warning" title="IFS=$'\\n\\t' como boa prática">
        Em scripts strict, defina <code>IFS=$'\\n\\t'</code>. Isso evita que um espaço no
        meio de um nome de arquivo quebre seu loop.
      </AlertBox>

      <h2>11. Cola visual — receitas combinadas</h2>

      <OutputBlock
        title="exemplos prontos para uso"
        output={`# renomear extensão em massa
for f in *.JPG; do mv "$f" "\${f%.JPG}.jpg"; done

# duas pastas paralelas
mkdir -p {dev,prod}/{config,logs,data}

# comparar listas de pacotes (laptop vs desktop)
diff <(ssh laptop  'pacman -Qqe') \\
     <(ssh desktop 'pacman -Qqe')

# valor padrão idiomático
log_dir="\${LOG_DIR:-$HOME/.local/state/myapp}"

# remover prefixo de pasta de pacote AUR
for d in /var/cache/pacman/pkg/*-x86_64.pkg.tar.zst; do
    nome="\${d##*/}"          # só o arquivo
    echo "\${nome%-*-*}"       # nome do pacote
done

# ano/mês/dia em variáveis numa tacada
read -r ano mes dia <<< "$(date +'%Y %m %d')"

# remover quote de string
v='"oi"'
echo "\${v//\\"/}"`}
      />
    </PageContainer>
  );
}
