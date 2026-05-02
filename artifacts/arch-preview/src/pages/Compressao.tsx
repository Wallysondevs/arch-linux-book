import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Compressao() {
  return (
    <PageContainer
      title="Compressão e Arquivamento"
      subtitle="tar, gzip, bzip2, xz, zstd, zip e 7z — cada flag, cada formato, com tamanhos antes/depois e a saída literal de cada execução."
      difficulty="iniciante"
      timeToRead="25 min"
      category="Shell Avançado"
    >
      <h2>Arquivar ≠ Comprimir</h2>
      <p>
        São duas operações distintas que quase sempre andam juntas:
      </p>
      <ul>
        <li><strong>Arquivar</strong> — empacotar vários arquivos em um só (preserva permissões, donos, links). Ferramenta: <code>tar</code>.</li>
        <li><strong>Comprimir</strong> — reduzir o tamanho via algoritmo. Ferramentas: <code>gzip</code>, <code>bzip2</code>, <code>xz</code>, <code>zstd</code>.</li>
      </ul>

      <h2>tar — o canivete suíço</h2>

      <CommandFlagList
        command="tar"
        items={[
          { flag: "-c", long: "--create", description: "Cria um novo arquivo." },
          { flag: "-x", long: "--extract", description: "Extrai um arquivo." },
          { flag: "-t", long: "--list", description: "Lista o conteúdo sem extrair." },
          { flag: "-f", long: "--file=ARQ", description: "Indica o arquivo. Quando aparece em flags agrupadas, deve ser a ÚLTIMA letra.", example: "tar -czvf x.tar.gz dir/" },
          { flag: "-v", long: "--verbose", description: "Mostra cada arquivo processado." },
          { flag: "-z", long: "--gzip", description: "Aplica gzip (.tar.gz / .tgz)." },
          { flag: "-j", long: "--bzip2", description: "Aplica bzip2 (.tar.bz2)." },
          { flag: "-J", long: "--xz", description: "Aplica xz (.tar.xz)." },
          { flag: "--zstd", description: "Aplica zstd (.tar.zst) — usado pelo pacman." },
          { flag: "-C", long: "--directory=DIR", description: "Muda para DIR antes de operar (ótimo para extrair fora do cwd).", example: "tar -xzf x.tar.gz -C /opt" },
          { flag: "--exclude=PAT", description: "Não inclui arquivos que casam com o glob.", example: "tar -czf b.tgz . --exclude='*.log'" },
          { flag: "-p", description: "Preserva permissões originais (default ao extrair como root)." },
          { flag: "--strip-components=N", description: "Remove N níveis de diretórios do path ao extrair." },
        ]}
      />

      <h3>Criando um tar</h3>

      <TerminalBlock
        comment="estado inicial"
        command="ls -l projeto/ ; du -sh projeto"
        output={`total 16
-rw-r--r-- 1 user user  847 Mar 26 18:30 README.md
-rw-r--r-- 1 user user 1842 Mar 26 18:30 main.c
-rw-r--r-- 1 user user  124 Mar 26 18:30 Makefile
2.8M    projeto`}
      />

      <TerminalBlock
        comment="-c criar, -v verbose, -f arquivo"
        command="tar -cvf projeto.tar projeto/"
        output={`projeto/
projeto/README.md
projeto/main.c
projeto/Makefile
projeto/src/
projeto/src/util.c`}
      />

      <TerminalBlock
        comment="tar puro NÃO comprime — mesmo tamanho"
        command="ls -lh projeto.tar"
        output="-rw-r--r-- 1 user user 2.8M Mar 26 18:31 projeto.tar"
      />

      <h3>tar + cada compressor lado a lado</h3>

      <TerminalBlock
        command={`tar -czvf projeto.tar.gz   projeto/   # gzip
tar -cjvf projeto.tar.bz2  projeto/   # bzip2
tar -cJvf projeto.tar.xz   projeto/   # xz
tar --zstd -cvf projeto.tar.zst projeto/  # zstd`}
        output={`projeto/
projeto/README.md
projeto/main.c
... (saída idêntica para os 4)`}
      />

      <OutputBlock
        title="ls -lh — comparando formatos no mesmo diretório de 2.8M"
        output={`-rw-r--r-- 1 user user 2.8M Mar 26 18:31 projeto.tar
-rw-r--r-- 1 user user 1.1M Mar 26 18:32 projeto.tar.gz
-rw-r--r-- 1 user user 980K Mar 26 18:32 projeto.tar.bz2
-rw-r--r-- 1 user user 812K Mar 26 18:33 projeto.tar.xz
-rw-r--r-- 1 user user 1.0M Mar 26 18:33 projeto.tar.zst`}
        annotations={[
          { line: 0, note: "sem compressão" },
          { line: 1, note: "rápido, boa razão" },
          { line: 2, note: "~3x mais lento" },
          { line: 3, note: "menor tamanho, ~10x mais lento" },
          { line: 4, note: "rápido como gzip, comprime quase como xz" },
        ]}
      />

      <h3>Listando antes de extrair</h3>

      <TerminalBlock
        command="tar -tzvf projeto.tar.gz"
        output={`drwxr-xr-x user/user 0 2026-03-26 18:30 projeto/
-rw-r--r-- user/user 847 2026-03-26 18:30 projeto/README.md
-rw-r--r-- user/user 1842 2026-03-26 18:30 projeto/main.c
-rw-r--r-- user/user 124 2026-03-26 18:30 projeto/Makefile
drwxr-xr-x user/user 0 2026-03-26 18:30 projeto/src/
-rw-r--r-- user/user 412 2026-03-26 18:30 projeto/src/util.c`}
      />

      <h3>Extraindo</h3>

      <TerminalBlock
        comment="tar moderno detecta o formato sozinho — pode omitir z/j/J"
        command="tar -xvf projeto.tar.gz -C /tmp/restore/"
        output={`projeto/
projeto/README.md
projeto/main.c
projeto/Makefile
projeto/src/
projeto/src/util.c`}
      />

      <TerminalBlock
        comment="só um arquivo específico"
        command="tar -xzvf projeto.tar.gz projeto/main.c"
        output="projeto/main.c"
      />

      <TerminalBlock
        comment="ignora o diretório raiz com --strip-components=1"
        command="tar -xzvf projeto.tar.gz --strip-components=1 -C /opt/app"
        output={`README.md
main.c
Makefile
src/
src/util.c`}
      />

      <AlertBox type="danger" title="tar bombs">
        Antes de extrair de fonte desconhecida, sempre rode <code>tar -tf arq.tgz | head</code>.
        Arquivos sem diretório raiz despejam centenas de arquivos no cwd e bagunçam tudo.
      </AlertBox>

      <h2>gzip / gunzip</h2>

      <CommandFlagList
        command="gzip"
        items={[
          { flag: "-k", long: "--keep", description: "Mantém o arquivo original (por padrão é removido)." },
          { flag: "-d", long: "--decompress", description: "Descomprime (igual a gunzip)." },
          { flag: "-l", long: "--list", description: "Mostra estatísticas sem descomprimir." },
          { flag: "-1 .. -9", description: "Nível: 1 = mais rápido, 9 = melhor compressão. Padrão = 6." },
          { flag: "-r", long: "--recursive", description: "Comprime recursivamente todos os arquivos sob diretório." },
          { flag: "-c", long: "--stdout", description: "Escreve no stdout, sem criar arquivo .gz." },
        ]}
      />

      <TerminalBlock
        command="ls -lh syslog ; gzip -k syslog ; ls -lh syslog*"
        output={`-rw-r--r-- 1 user user 18M Mar 26 18:40 syslog
-rw-r--r-- 1 user user 18M Mar 26 18:40 syslog
-rw-r--r-- 1 user user 1.4M Mar 26 18:40 syslog.gz`}
        comment="-k preserva o original; razão ~13:1 em texto repetitivo"
      />

      <TerminalBlock
        command="gzip -l syslog.gz"
        output={`         compressed        uncompressed  ratio uncompressed_name
            1467123            18874368  92.2% syslog`}
      />

      <TerminalBlock
        comment="-9 vs -1 no mesmo arquivo de 18M"
        command={`gzip -1 -k -S .fast.gz syslog
gzip -9 -k -S .best.gz syslog
ls -lh syslog.*.gz`}
        output={`-rw-r--r-- 1 user user 1.7M Mar 26 18:41 syslog.fast.gz
-rw-r--r-- 1 user user 1.3M Mar 26 18:41 syslog.best.gz`}
      />

      <TerminalBlock
        comment="ler sem descomprimir"
        command="zcat syslog.gz | head -2"
        output={`Mar 26 17:00:01 archlinux CRON[1842]: (root) CMD (/usr/sbin/logrotate)
Mar 26 17:00:01 archlinux systemd[1]: Starting Rotate log files...`}
      />

      <TerminalBlock
        command="zgrep -c 'ERROR' syslog.gz"
        output="42"
      />

      <h2>bzip2 / bunzip2</h2>

      <TerminalBlock
        command="bzip2 -k syslog ; ls -lh syslog.bz2"
        output="-rw-r--r-- 1 user user 1.1M Mar 26 18:42 syslog.bz2"
        comment="~20% menor que gzip, mas ~3x mais lento"
      />

      <TerminalBlock
        command="bzcat syslog.bz2 | tail -1"
        output="Mar 26 18:42:11 archlinux systemd[1]: logrotate.service: Succeeded."
      />

      <h2>xz / unxz</h2>

      <TerminalBlock
        command="xz -k -T0 syslog ; ls -lh syslog.xz"
        output="-rw-r--r-- 1 user user 920K Mar 26 18:43 syslog.xz"
        comment="-T0 = todas as threads; melhor razão dos clássicos"
      />

      <TerminalBlock
        command="xz -l syslog.xz"
        output={`Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename
    1       4    920.4 KiB     18.0 MiB  0.050  CRC64   syslog.xz`}
      />

      <h2>zstd — o compressor moderno</h2>

      <p>
        Desenvolvido pelo Facebook, oferece compressão próxima ao xz com velocidade
        próxima ao gzip. É o formato dos pacotes do Arch (<code>.pkg.tar.zst</code>).
      </p>

      <TerminalBlock
        command="zstd -k -19 syslog -o syslog.zst ; ls -lh syslog.zst"
        output={`syslog              :  5.31%   (  18 MiB =>  974 KiB, syslog.zst)
-rw-r--r-- 1 user user 974K Mar 26 18:44 syslog.zst`}
      />

      <TerminalBlock
        command="zstd -d syslog.zst -o /tmp/syslog.out"
        output={`syslog.zst         : 18874368 bytes`}
      />

      <h2>Comparativo final no mesmo log de 18 MiB</h2>

      <OutputBlock
        title="velocidade × tamanho (medições típicas, hardware moderno)"
        output={`Compressor   Tamanho final   Tempo  comp.   Tempo descomp.
-----------  -------------   --------------   --------------
none (.tar)        18.0 MiB           0.02 s            0.02 s
gzip -6             1.4 MiB           0.21 s            0.08 s
gzip -9             1.3 MiB           0.71 s            0.08 s
bzip2 -9            1.1 MiB           1.84 s            0.62 s
xz -6               0.92 MiB          3.10 s            0.18 s
xz -9 -T0           0.85 MiB          1.50 s            0.18 s
zstd -3             1.0 MiB           0.07 s            0.04 s
zstd -19            0.97 MiB          2.20 s            0.04 s`}
        annotations={[
          { line: 4, note: "padrão do tar -czf" },
          { line: 7, note: "melhor razão clássica" },
          { line: 8, note: "paralelizado, quase tão bom" },
          { line: 10, note: "default do pacman" },
        ]}
      />

      <h2>zip / unzip</h2>

      <TerminalBlock
        command="sudo pacman -S --needed zip unzip"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (2)  unzip-6.0-21  zip-3.0-12

Total Installed Size:  0.85 MiB
:: Proceed with installation? [Y/n]
(...)`}
      />

      <TerminalBlock
        command="zip -r projeto.zip projeto/"
        output={`  adding: projeto/ (stored 0%)
  adding: projeto/README.md (deflated 42%)
  adding: projeto/main.c (deflated 64%)
  adding: projeto/Makefile (deflated 28%)
  adding: projeto/src/ (stored 0%)
  adding: projeto/src/util.c (deflated 51%)`}
      />

      <TerminalBlock
        command="unzip -l projeto.zip"
        output={`Archive:  projeto.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  2026-03-26 18:30   projeto/
      847  2026-03-26 18:30   projeto/README.md
     1842  2026-03-26 18:30   projeto/main.c
      124  2026-03-26 18:30   projeto/Makefile
        0  2026-03-26 18:30   projeto/src/
      412  2026-03-26 18:30   projeto/src/util.c
---------                     -------
     3225                     6 files`}
      />

      <TerminalBlock
        comment="zip com senha (criptografia fraca, só esconde casualmente)"
        command="zip -e secreto.zip documento.pdf"
        output={`Enter password:
Verify password:
  adding: documento.pdf (deflated 12%)`}
      />

      <TerminalBlock
        command="unzip -t projeto.zip"
        output={`Archive:  projeto.zip
    testing: projeto/                 OK
    testing: projeto/README.md        OK
    testing: projeto/main.c           OK
    testing: projeto/Makefile         OK
    testing: projeto/src/util.c       OK
No errors detected in compressed data of projeto.zip.`}
      />

      <h2>7z (p7zip)</h2>

      <TerminalBlock
        command="sudo pacman -S --needed p7zip"
        output={`Packages (1)  p7zip-17.05-3
Total Installed Size:  4.85 MiB`}
      />

      <TerminalBlock
        command="7z a -mx=9 maximo.7z projeto/"
        output={`7-Zip 17.05 : Copyright (c) 1999-2021 Igor Pavlov : 2021-04-15

Scanning the drive:
1 folder, 5 files, 3225 bytes (4 KiB)

Creating archive: maximo.7z

Items to compress: 6

Files read from disk: 5
Archive size: 1487 bytes (2 KiB)
Everything is Ok`}
      />

      <TerminalBlock
        command="7z l maximo.7z"
        output={`Listing archive: maximo.7z

----
Path = maximo.7z
Type = 7z
Physical Size = 1487
Headers Size = 233
Method = LZMA2:12
Solid = +
Blocks = 1

   Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2026-03-26 18:30:00 D....            0            0  projeto
2026-03-26 18:30:00 ....A          847         1254  projeto/README.md
2026-03-26 18:30:00 ....A         1842               projeto/main.c
2026-03-26 18:30:00 ....A          124               projeto/Makefile
2026-03-26 18:30:00 D....            0            0  projeto/src
2026-03-26 18:30:00 ....A          412               projeto/src/util.c
------------------- ----- ------------ ------------  ------------------------
2026-03-26 18:30:00               3225         1254  5 files, 2 folders`}
      />

      <TerminalBlock
        comment="extrai mantendo a estrutura"
        command="7z x maximo.7z -o/tmp/restore/"
        output={`Extracting archive: maximo.7z
--
Path = maximo.7z
Type = 7z

Everything is Ok

Folders: 2
Files: 4
Size:       3225
Compressed: 1487`}
      />

      <h2>Receitas do dia a dia</h2>

      <TerminalBlock
        comment="backup do home com data no nome"
        command={`tar --zstd -cvf "backup-$(hostname)-$(date +%F).tar.zst" \\
  --exclude='.cache' \\
  --exclude='.local/share/Trash' \\
  --exclude='node_modules' \\
  /home/user`}
        output={`/home/user/
/home/user/.bashrc
/home/user/Documentos/
...
[backup gerado: backup-archlinux-2026-03-26.tar.zst]`}
      />

      <TerminalBlock
        comment="enviar diretório por SSH sem criar arquivo intermediário"
        command={`tar -cz projeto/ | ssh user@servidor 'tar -xz -C /backup/'`}
        output=""
      />

      <TerminalBlock
        comment="medir o tamanho descomprimido sem extrair"
        command={`tar -tzvf backup.tar.gz | awk '{s+=$3} END {printf "%.1f MiB\\n", s/1048576}'`}
        output="247.3 MiB"
      />

      <TerminalBlock
        comment="comparar duas versões antes de extrair"
        command={`diff <(tar -tzf v1.tar.gz) <(tar -tzf v2.tar.gz)`}
        output={`> projeto/CHANGELOG.md
< projeto/old.txt`}
      />

      <AlertBox type="warning" title="Cuidado ao extrair como root">
        Sem flags, o tar restaura permissões e dono originais — incluindo UIDs que
        podem não existir no sistema atual. Use <code>--no-same-owner</code> e
        <code>--no-same-permissions</code> para arquivos vindos de outras máquinas.
      </AlertBox>

      <AlertBox type="info" title="O Arch usa zstd">
        Desde 2020 os pacotes oficiais são <code>.pkg.tar.zst</code>. Você pode
        inspecioná-los como qualquer tar: <code>tar --zstd -tvf
        firefox-*.pkg.tar.zst</code>.
      </AlertBox>
    </PageContainer>
  );
}
