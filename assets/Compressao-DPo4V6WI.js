import{j as o}from"./ui-K-J8Jkwj.js";import{P as i}from"./PageContainer-tnnsMrcC.js";import{C as r}from"./CodeBlock-DEDRw1y6.js";import{A as e}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return o.jsxs(i,{title:"Compressão e Arquivamento",subtitle:"Aprenda a compactar, descompactar e arquivar arquivos no Linux usando tar, gzip, bzip2, xz, zip e 7z.",difficulty:"iniciante",timeToRead:"20 min",children:[o.jsx("h2",{children:"Arquivamento vs Compressão"}),o.jsx("p",{children:"É importante entender a diferença entre esses dois conceitos:"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"Arquivamento"})," — Combinar múltiplos arquivos e diretórios em um único arquivo (ex: ",o.jsx("code",{children:"tar"}),"). Não reduz o tamanho."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Compressão"})," — Reduzir o tamanho de um arquivo usando algoritmos (ex: ",o.jsx("code",{children:"gzip"}),", ",o.jsx("code",{children:"bzip2"}),", ",o.jsx("code",{children:"xz"}),")."]})]}),o.jsxs("p",{children:["Na prática, quase sempre usamos os dois juntos: primeiro arquivamos com ",o.jsx("code",{children:"tar"}),", depois comprimimos com um algoritmo."]}),o.jsx("h2",{children:"tar — O Canivete Suíço"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"tar"})," (Tape ARchive) é a ferramenta fundamental para arquivamento no Linux. Ele não comprime por padrão, mas pode chamar compressores automaticamente."]}),o.jsx("h3",{children:"Flags Principais"}),o.jsx(r,{title:"Flags essenciais do tar",code:`# Flags de ação (uma obrigatória):
-c    # Create: criar arquivo
-x    # eXtract: extrair arquivo
-t    # lisT: listar conteúdo sem extrair

# Flags de compressão:
-z    # gzip (.tar.gz ou .tgz)
-j    # bzip2 (.tar.bz2)
-J    # xz (.tar.xz)

# Flags comuns:
-v    # Verbose: mostrar progresso
-f    # File: especificar nome do arquivo (SEMPRE última flag antes do nome)
-C    # Change directory: extrair em diretório específico
-p    # Preservar permissões
--exclude  # Excluir padrões`}),o.jsx("h3",{children:"Criando Arquivos tar"}),o.jsx(r,{title:"Criar arquivos tar com diferentes compressões",code:`# Arquivo tar sem compressão
tar -cvf backup.tar /home/usuario/documentos

# tar + gzip (mais comum, boa velocidade)
tar -czvf backup.tar.gz /home/usuario/documentos

# tar + bzip2 (melhor compressão, mais lento)
tar -cjvf backup.tar.bz2 /home/usuario/documentos

# tar + xz (melhor compressão possível, bem mais lento)
tar -cJvf backup.tar.xz /home/usuario/documentos

# Arquivar múltiplos diretórios
tar -czvf projeto.tar.gz src/ docs/ README.md

# Excluir arquivos/diretórios
tar -czvf backup.tar.gz /home/usuario \\
    --exclude='*.tmp' \\
    --exclude='.cache' \\
    --exclude='node_modules'

# Excluir a partir de um arquivo de padrões
tar -czvf backup.tar.gz /home/usuario -X exclusoes.txt`}),o.jsx("h3",{children:"Extraindo Arquivos tar"}),o.jsx(r,{title:"Extrair arquivos tar",code:`# Extrair tar simples
tar -xvf arquivo.tar

# Extrair tar.gz
tar -xzvf arquivo.tar.gz

# Extrair tar.bz2
tar -xjvf arquivo.tar.bz2

# Extrair tar.xz
tar -xJvf arquivo.tar.xz

# Extrair em diretório específico
tar -xzvf arquivo.tar.gz -C /tmp/destino/

# Extrair apenas um arquivo específico
tar -xzvf backup.tar.gz home/usuario/documento.txt

# Extrair com padrão
tar -xzvf backup.tar.gz --wildcards '*.conf'`}),o.jsx("h3",{children:"Listando Conteúdo"}),o.jsx(r,{title:"Ver conteúdo sem extrair",code:`# Listar conteúdo de um tar
tar -tvf arquivo.tar

# Listar conteúdo de um tar.gz
tar -tzvf arquivo.tar.gz

# Listar apenas nomes dos arquivos
tar -tf arquivo.tar.gz

# Buscar arquivo específico na listagem
tar -tf backup.tar.gz | grep "pacman.conf"`}),o.jsxs(e,{type:"success",title:"Dica: tar detecta compressão automaticamente",children:["Nas versões modernas do tar, você pode omitir as flags de compressão na extração. O comando ",o.jsx("code",{children:"tar -xvf arquivo.tar.gz"})," funciona sem o ",o.jsx("code",{children:"-z"})," porque o tar detecta o formato automaticamente."]}),o.jsx("h2",{children:"gzip / gunzip"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"gzip"})," é o compressor mais comum no Linux. Ele comprime arquivos individuais (não diretórios). Oferece bom equilíbrio entre velocidade e compressão."]}),o.jsx(r,{title:"Usando gzip",code:`# Comprimir arquivo (SUBSTITUI o original)
gzip arquivo.txt
# Resultado: arquivo.txt.gz (o original é removido)

# Descomprimir
gunzip arquivo.txt.gz
# ou
gzip -d arquivo.txt.gz

# Manter o arquivo original
gzip -k arquivo.txt

# Definir nível de compressão (1=rápido, 9=máximo)
gzip -9 arquivo.txt       # Compressão máxima
gzip -1 arquivo.txt       # Compressão rápida

# Ver informações de compressão
gzip -l arquivo.txt.gz

# Comprimir vários arquivos
gzip *.log

# Ver conteúdo sem descomprimir
zcat arquivo.txt.gz
zless arquivo.txt.gz
zgrep "erro" arquivo.txt.gz`}),o.jsx("h2",{children:"bzip2 / bunzip2"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"bzip2"})," oferece melhor compressão que o gzip, mas é mais lento. Ideal para quando o tamanho final importa mais que a velocidade."]}),o.jsx(r,{title:"Usando bzip2",code:`# Comprimir (substitui o original)
bzip2 arquivo.txt
# Resultado: arquivo.txt.bz2

# Descomprimir
bunzip2 arquivo.txt.bz2
# ou
bzip2 -d arquivo.txt.bz2

# Manter o original
bzip2 -k arquivo.txt

# Nível de compressão
bzip2 -9 arquivo.txt

# Ver conteúdo sem descomprimir
bzcat arquivo.txt.bz2`}),o.jsx("h2",{children:"xz / unxz"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"xz"})," oferece a melhor taxa de compressão entre os três, mas é o mais lento. É o formato padrão usado nos pacotes do Arch Linux (",o.jsx("code",{children:".pkg.tar.zst"})," mais recentemente, mas ",o.jsx("code",{children:".tar.xz"})," ainda é muito comum)."]}),o.jsx(r,{title:"Usando xz",code:`# Comprimir
xz arquivo.txt
# Resultado: arquivo.txt.xz

# Descomprimir
unxz arquivo.txt.xz
# ou
xz -d arquivo.txt.xz

# Manter o original
xz -k arquivo.txt

# Nível de compressão (0-9, padrão é 6)
xz -9 arquivo.txt        # Compressão máxima (usa muita RAM)
xz -0 arquivo.txt        # Compressão rápida

# Usar múltiplas threads
xz -T0 arquivo.txt       # Usar todos os cores

# Ver informações
xz -l arquivo.txt.xz

# Ver conteúdo sem descomprimir
xzcat arquivo.txt.xz`}),o.jsx("h3",{children:"Comparação de Compressores"}),o.jsx(r,{title:"Comparação geral",language:"text",code:`Compressor  | Extensão   | Velocidade | Compressão | Uso de RAM
------------|------------|------------|------------|----------
gzip        | .gz        | Rápido     | Boa        | Baixo
bzip2       | .bz2       | Médio      | Melhor     | Médio
xz          | .xz        | Lento      | Excelente  | Alto
zstd        | .zst       | Muito rápido | Muito boa | Médio`}),o.jsxs(e,{type:"info",title:"zstd — O compressor moderno",children:["O ",o.jsx("code",{children:"zstd"})," (Zstandard) é um compressor relativamente novo desenvolvido pelo Facebook. Ele oferece compressão comparável ao xz com velocidade próxima ao gzip. O Arch Linux usa ",o.jsx("code",{children:".pkg.tar.zst"})," para seus pacotes por esse motivo. Instale com ",o.jsx("code",{children:"sudo pacman -S zstd"}),"."]}),o.jsx("h2",{children:"zip / unzip"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"zip"})," é o formato mais comum no Windows. No Linux, é útil quando você precisa compartilhar arquivos com usuários de Windows ou trabalhar com arquivos recebidos neste formato."]}),o.jsx(r,{title:"Usando zip",code:`# Instalar (pode não vir pré-instalado)
sudo pacman -S zip unzip

# Criar arquivo zip
zip arquivo.zip documento.txt

# Criar zip com múltiplos arquivos
zip arquivos.zip *.txt *.pdf

# Criar zip de um diretório (recursivo)
zip -r projeto.zip projeto/

# Criar zip com senha
zip -e secreto.zip documento.txt

# Excluir padrões
zip -r projeto.zip projeto/ -x "*.git*" "*/node_modules/*"

# Atualizar arquivo zip existente
zip -u arquivo.zip novo_arquivo.txt

# Descomprimir
unzip arquivo.zip

# Descomprimir em diretório específico
unzip arquivo.zip -d /tmp/destino/

# Listar conteúdo sem extrair
unzip -l arquivo.zip

# Extrair apenas um arquivo
unzip arquivo.zip documento.txt

# Testar integridade
unzip -t arquivo.zip`}),o.jsx("h2",{children:"7z (p7zip)"}),o.jsx("p",{children:"O 7-Zip oferece excelente compressão e suporta vários formatos. Útil para compatibilidade com Windows e para quando você precisa da melhor compressão possível."}),o.jsx(r,{title:"Usando 7z",code:`# Instalar
sudo pacman -S p7zip

# Criar arquivo 7z
7z a arquivo.7z documento.txt

# Criar 7z de um diretório
7z a backup.7z /home/usuario/documentos/

# Extrair
7z x arquivo.7z

# Extrair em diretório específico
7z x arquivo.7z -o/tmp/destino/

# Listar conteúdo
7z l arquivo.7z

# Testar integridade
7z t arquivo.7z

# Criar com senha e criptografia de nomes
7z a -p -mhe=on secreto.7z documentos/

# Definir nível de compressão (0=nenhum, 9=máximo)
7z a -mx=9 maximo.7z arquivos/

# Comprimir usando formato zip
7z a -tzip arquivo.zip documentos/

# O 7z também extrai muitos formatos
7z x arquivo.rar
7z x arquivo.iso
7z x arquivo.cab`}),o.jsx("h2",{children:"Exemplos Práticos do Dia a Dia"}),o.jsx(r,{title:"Cenários comuns",code:`# Fazer backup do home excluindo cache
tar -czvf backup_home.tar.gz \\
    --exclude='.cache' \\
    --exclude='.local/share/Trash' \\
    --exclude='node_modules' \\
    --exclude='.npm' \\
    /home/usuario/

# Backup com data no nome
tar -czvf "backup_$(date +%Y%m%d_%H%M%S).tar.gz" documentos/

# Transferir diretório entre máquinas via SSH
tar -czf - /home/usuario/projeto | ssh servidor 'tar -xzf - -C /backup/'

# Descomprimir arquivo que não sei o formato
file arquivo_misterioso.xyz    # Identifica o tipo real

# Verificar espaço antes de extrair
tar -tzvf arquivo.tar.gz | awk '{sum+=$3} END {print sum/1024/1024 " MB"}'`}),o.jsxs(e,{type:"warning",title:"Cuidado com tar como root",children:["Ao extrair um tar como root, os arquivos serão criados com as permissões e donos originais. Use ",o.jsx("code",{children:"--no-same-owner"})," se não quiser manter o dono original, ou",o.jsx("code",{children:"--no-same-permissions"})," para ignorar permissões do arquivo."]}),o.jsxs(e,{type:"danger",title:"Tar bombs",children:["Sempre verifique o conteúdo de um arquivo tar antes de extrair com ",o.jsx("code",{children:"tar -tf arquivo.tar.gz"}),'. Alguns arquivos maliciosos não têm um diretório raiz e despejam centenas de arquivos no diretório atual, criando uma bagunça conhecida como "tar bomb". Extraia sempre em um diretório temporário quando não tiver certeza do conteúdo.']})]})}export{p as default};
