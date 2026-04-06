import{j as a}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return a.jsxs(r,{title:"Visualização de Arquivos",subtitle:"Aprenda a ler, inspecionar e analisar arquivos de texto diretamente no terminal: cat, less, more, head, tail, grep, wc, diff, file e strings.",difficulty:"iniciante",timeToRead:"25 min",children:[a.jsx("p",{children:"Saber visualizar e analisar arquivos de texto é uma habilidade fundamental no Linux. Logs do sistema, arquivos de configuração, código-fonte — tudo é texto. Cada comando desta página tem um propósito específico, e saber quando usar cada um vai tornar seu trabalho no terminal muito mais eficiente."}),a.jsx("h2",{children:"1. cat — Concatenar e Exibir"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"cat"})," (concatenate) é o jeito mais simples de exibir o conteúdo de um arquivo. Ele despeja todo o conteúdo de uma vez no terminal. Ótimo para arquivos curtos, terrível para arquivos grandes."]}),a.jsx(e,{title:"Uso básico do cat",code:`# Exibir conteúdo de um arquivo
cat /etc/hostname

# Exibir múltiplos arquivos (concatenar)
cat arquivo1.txt arquivo2.txt

# Exibir com números de linha
cat -n /etc/pacman.conf

# Exibir com números apenas em linhas não-vazias
cat -b /etc/pacman.conf

# Mostrar caracteres invisíveis (tabs como ^I, fim de linha como $)
cat -A arquivo.txt

# Comprimir linhas em branco consecutivas em uma só
cat -s arquivo-com-muitas-linhas-vazias.txt`}),a.jsx("h3",{children:"Usos criativos do cat"}),a.jsx(e,{title:"Truques úteis com cat",code:`# Criar um arquivo rapidamente (terminar com Ctrl+D)
cat > notas.txt
Este é o conteúdo do arquivo.
Pressione Ctrl+D para salvar.

# Adicionar conteúdo ao final de um arquivo (append)
cat >> notas.txt
Mais uma linha adicionada.

# Concatenar vários arquivos em um só
cat parte1.txt parte2.txt parte3.txt > documento-completo.txt

# Copiar arquivo (forma rudimentar)
cat original.txt > copia.txt`}),a.jsx(o,{type:"warning",title:"Quando NÃO usar cat",children:a.jsxs("ul",{children:[a.jsxs("li",{children:["Não use ",a.jsx("code",{children:"cat"})," para arquivos grandes (logs de milhares de linhas) — use ",a.jsx("code",{children:"less"}),"."]}),a.jsxs("li",{children:["Não use ",a.jsx("code",{children:"cat arquivo | grep padrão"}),' — isso é chamado "Useless Use of Cat". Use ',a.jsx("code",{children:"grep padrão arquivo"})," diretamente."]}),a.jsxs("li",{children:["Não use ",a.jsx("code",{children:"cat"})," para arquivos binários — vai bagunçar seu terminal (se acontecer, digite ",a.jsx("code",{children:"reset"}),")."]})]})}),a.jsx("h2",{children:"2. less — O Paginador Ideal"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"less"})," é um paginador que permite navegar por arquivos grandes de forma interativa. Ele carrega o arquivo sob demanda (não precisa ler tudo para a memória), então funciona até com arquivos enormes."]}),a.jsx(e,{title:"Uso básico do less",code:`# Abrir arquivo para leitura paginada
less /var/log/pacman.log

# Abrir com números de linha
less -N /etc/pacman.conf

# Abrir ignorando maiúsculas na busca
less -i arquivo.txt

# Abrir múltiplos arquivos (navegar com :n e :p)
less arquivo1.txt arquivo2.txt`}),a.jsx(e,{title:"Atalhos de navegação dentro do less",language:"text",code:`NAVEGAÇÃO:
  Espaço / Page Down    Avançar uma página
  b / Page Up           Voltar uma página
  j / Seta para baixo   Avançar uma linha
  k / Seta para cima    Voltar uma linha
  G                     Ir para o final do arquivo
  g                     Ir para o início do arquivo
  50g                   Ir para a linha 50

BUSCA:
  /padrão               Buscar para frente
  ?padrão               Buscar para trás
  n                     Próxima ocorrência
  N                     Ocorrência anterior
  &padrão               Mostrar APENAS linhas que contêm o padrão

OUTROS:
  q                     Sair
  h                     Ajuda
  F                     Modo follow (como tail -f) — Ctrl+C para parar
  v                     Abrir no editor padrão
  :n                    Próximo arquivo (quando abriu múltiplos)
  :p                    Arquivo anterior`}),a.jsxs(o,{type:"success",title:"less é melhor que more",children:["O ",a.jsx("code",{children:"less"})," foi criado como uma melhoria do ",a.jsx("code",{children:"more"}),". Ele permite navegar para frente E para trás, fazer buscas, e é mais leve. Use ",a.jsx("code",{children:"less"})," sempre que precisar ler um arquivo grande."]}),a.jsx("h2",{children:"3. more — O Paginador Clássico"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"more"})," é o paginador original do Unix. Ele é mais limitado que o",a.jsx("code",{children:" less"})," — só navega para frente. Hoje em dia é raramente usado, mas você pode encontrá-lo em scripts antigos."]}),a.jsx(e,{title:"Uso do more",code:`# Paginar um arquivo
more /etc/pacman.conf

# Começar a partir da linha 50
more +50 /etc/pacman.conf

# Exibir N linhas por tela
more -10 arquivo.txt

# Atalhos: Espaço (próxima página), Enter (próxima linha), q (sair)`}),a.jsx("h2",{children:"4. head — Início do Arquivo"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"head"})," mostra as primeiras linhas de um arquivo. Por padrão, mostra as 10 primeiras linhas."]}),a.jsx(e,{title:"Usando head",code:`# Primeiras 10 linhas (padrão)
head /etc/pacman.conf

# Primeiras 20 linhas
head -n 20 /etc/pacman.conf

# Primeiras 5 linhas de múltiplos arquivos
head -n 5 arquivo1.txt arquivo2.txt

# Primeiros 100 bytes
head -c 100 arquivo.bin

# Tudo EXCETO as últimas 5 linhas
head -n -5 arquivo.txt

# Uso prático: ver os 10 maiores arquivos
du -ah /var | sort -rh | head -10

# Ver os processos que mais consomem memória
ps aux --sort=-%mem | head -10`}),a.jsx("h2",{children:"5. tail — Final do Arquivo"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"tail"})," mostra as últimas linhas de um arquivo. É essencial para monitorar logs em tempo real."]}),a.jsx(e,{title:"Usando tail",code:`# Últimas 10 linhas (padrão)
tail /var/log/pacman.log

# Últimas 30 linhas
tail -n 30 /var/log/pacman.log

# Últimas linhas a partir da linha 100
tail -n +100 arquivo.txt

# Últimos 200 bytes
tail -c 200 arquivo.txt`}),a.jsx(e,{title:"tail -f: Monitoramento em tempo real (MUITO ÚTIL)",code:`# Seguir um log em tempo real (as novas linhas aparecem automaticamente)
tail -f /var/log/pacman.log

# Seguir múltiplos arquivos
tail -f /var/log/syslog /var/log/auth.log

# Seguir com tentativas de reabrir o arquivo (útil se o arquivo é recriado)
tail -F /var/log/pacman.log

# Combinação poderosa: seguir log e filtrar
tail -f /var/log/pacman.log | grep "error"

# Para parar: Ctrl+C`}),a.jsxs(o,{type:"info",title:"tail -f é essencial para debugging",children:["Sempre que estiver configurando um serviço (servidor web, banco de dados, etc), abra um segundo terminal com ",a.jsx("code",{children:"tail -f"})," no log do serviço para ver erros em tempo real."]}),a.jsx("h2",{children:"6. grep — Busca de Padrões em Texto"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"grep"})," (Global Regular Expression Print) busca linhas que correspondem a um padrão dentro de arquivos ou da saída de outros comandos. É um dos comandos mais poderosos e mais usados do Linux."]}),a.jsx(e,{title:"Uso básico do grep",code:`# Buscar uma palavra em um arquivo
grep "Server" /etc/pacman.d/mirrorlist

# Buscar ignorando maiúsculas/minúsculas
grep -i "error" /var/log/pacman.log

# Buscar recursivamente em todos os arquivos de um diretório
grep -r "TODO" ~/projetos/

# Buscar e mostrar o número da linha
grep -n "Include" /etc/pacman.conf

# Buscar e mostrar contexto (3 linhas antes e depois)
grep -C 3 "error" /var/log/syslog

# Buscar apenas 2 linhas antes do match
grep -B 2 "failed" /var/log/syslog

# Buscar apenas 2 linhas depois do match
grep -A 2 "failed" /var/log/syslog`}),a.jsx(e,{title:"Flags avançadas do grep",code:`# Busca invertida: linhas que NÃO contêm o padrão
grep -v "^#" /etc/pacman.conf     # Remove linhas de comentário

# Contar ocorrências
grep -c "installed" /var/log/pacman.log

# Mostrar apenas os nomes dos arquivos que contêm o padrão
grep -l "TODO" *.py

# Mostrar apenas a parte que deu match (não a linha inteira)
grep -o "[0-9]\\+\\.[0-9]\\+" versoes.txt

# Usar regex estendida
grep -E "(error|warning|critical)" /var/log/syslog

# Buscar palavra exata (não como substring)
grep -w "log" arquivo.txt   # Encontra "log" mas não "login" ou "catalog"

# Combinação com pipes (extremamente comum)
ps aux | grep firefox
dmesg | grep -i usb
cat /etc/passwd | grep "/bin/bash"`}),a.jsxs(o,{type:"success",title:"Alternativas modernas ao grep",children:["O ",a.jsx("code",{children:"ripgrep"})," (",a.jsx("code",{children:"rg"}),") é uma alternativa muito mais rápida ao grep, especialmente para buscar em projetos grandes. Instale com ",a.jsx("code",{children:"sudo pacman -S ripgrep"}),"."]}),a.jsx("h2",{children:"7. wc — Contando Linhas, Palavras e Caracteres"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"wc"})," (Word Count) conta linhas, palavras e bytes/caracteres de arquivos. Simples mas extremamente útil em combinação com outros comandos."]}),a.jsx(e,{title:"Usando wc",code:`# Contagem completa: linhas, palavras, bytes
wc /etc/pacman.conf
#  85  362  2847 /etc/pacman.conf
#  ^^  ^^^  ^^^^
#  linhas  palavras  bytes

# Contar apenas linhas
wc -l /etc/pacman.conf

# Contar apenas palavras
wc -w arquivo.txt

# Contar apenas caracteres
wc -m arquivo.txt

# Contar apenas bytes
wc -c arquivo.bin

# Contar a linha mais longa
wc -L arquivo.txt

# Combinações práticas com pipes
ls /etc | wc -l              # Quantos itens tem em /etc
ps aux | wc -l               # Quantos processos estão rodando
grep -c "error" log.txt      # Quantas linhas contêm "error"
cat /etc/passwd | wc -l      # Quantos usuários no sistema`}),a.jsx("h2",{children:"8. diff — Comparando Arquivos"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"diff"})," compara dois arquivos linha por linha e mostra as diferenças. É essencial para ver o que mudou entre versões de um arquivo de configuração ou código-fonte."]}),a.jsx(e,{title:"Usando diff",code:`# Comparação simples
diff arquivo1.txt arquivo2.txt

# Comparação lado a lado
diff -y arquivo1.txt arquivo2.txt

# Comparação lado a lado com largura definida
diff -y -W 80 arquivo1.txt arquivo2.txt

# Formato unificado (o mais legível, usado em patches e Git)
diff -u original.conf modificado.conf
# --- original.conf
# +++ modificado.conf
# @@ -10,3 +10,4 @@
#  linha igual
# -linha removida
# +linha adicionada
# +outra linha nova

# Comparar apenas se são diferentes (sem mostrar detalhes)
diff -q arquivo1.txt arquivo2.txt

# Comparar diretórios recursivamente
diff -r dir1/ dir2/

# Ignorar espaços em branco
diff -w arquivo1.txt arquivo2.txt

# Ignorar maiúsculas/minúsculas
diff -i arquivo1.txt arquivo2.txt`}),a.jsx(e,{title:"Gerando e aplicando patches com diff",code:`# Gerar um patch
diff -u original.conf modificado.conf > mudancas.patch

# Aplicar o patch
patch original.conf < mudancas.patch

# Reverter um patch
patch -R original.conf < mudancas.patch`}),a.jsxs(o,{type:"info",title:"Alternativas visuais",children:["Para comparações mais complexas, use ",a.jsx("code",{children:"vimdiff"})," (abre os dois arquivos lado a lado no Vim com destaque colorido) ou instale ",a.jsx("code",{children:"meld"})," para uma interface gráfica."]}),a.jsx("h2",{children:"9. file — Identificando Tipos de Arquivo"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"file"}),' analisa o conteúdo de um arquivo e identifica seu tipo real, independente da extensão. Ele examina os "bytes mágicos" no início do arquivo.']}),a.jsx(e,{title:"Usando file",code:`# Identificar tipo de arquivo
file /bin/bash
# /bin/bash: ELF 64-bit LSB pie executable, x86-64...

file /etc/pacman.conf
# /etc/pacman.conf: ASCII text

file imagem.jpg
# imagem.jpg: JPEG image data, JFIF standard 1.01...

file documento.pdf
# documento.pdf: PDF document, version 1.4

# Verificar tipo sem considerar o nome do arquivo
file -b arquivo.txt
# ASCII text

# Mostrar tipo MIME
file -i documento.pdf
# documento.pdf: application/pdf; charset=binary

# Verificar múltiplos arquivos
file *
file /usr/bin/*

# Seguir links simbólicos
file -L /bin/python

# Caso prático: alguém renomeou um executável para .txt
file suspeito.txt
# suspeito.txt: ELF 64-bit LSB executable...  (não é texto!)`}),a.jsxs(o,{type:"warning",title:"Extensões mentem, file não",children:["No Linux, a extensão do arquivo é apenas uma convenção — o sistema não depende dela. Use ",a.jsx("code",{children:"file"})," quando suspeitar que um arquivo não é o que parece."]}),a.jsx("h2",{children:"10. strings — Extraindo Texto de Binários"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"strings"})," extrai sequências de caracteres legíveis de arquivos binários. É útil para inspecionar executáveis, encontrar mensagens de erro embutidas, ou verificar o que um programa desconhecido faz."]}),a.jsx(e,{title:"Usando strings",code:`# Extrair strings de um binário
strings /usr/bin/ls

# Definir tamanho mínimo de string (padrão é 4 caracteres)
strings -n 10 /usr/bin/bash    # Apenas strings com 10+ caracteres

# Mostrar o offset (posição) de cada string no arquivo
strings -t x /usr/bin/ls       # Offset em hexadecimal
strings -t d /usr/bin/ls       # Offset em decimal

# Casos práticos
# Ver a versão de um programa compilado
strings /usr/bin/gcc | grep "version"

# Encontrar URLs embutidas em um programa
strings programa | grep "http"

# Verificar se um arquivo binário contém certos textos
strings backup.db | grep "senha"

# Inspecionar um arquivo binário suspeito (sem executar!)
strings arquivo-suspeito | head -50`}),a.jsxs(o,{type:"danger",title:"Nunca execute arquivos suspeitos",children:["Se você recebeu um arquivo binário desconhecido, use ",a.jsx("code",{children:"file"})," e ",a.jsx("code",{children:"strings"}),"para inspecioná-lo ANTES de executar. Nunca rode ",a.jsx("code",{children:"chmod +x"})," e execute algo que você não confia."]}),a.jsx("h2",{children:"Tabela de Referência Rápida"}),a.jsx(e,{title:"Quando usar cada comando",language:"text",code:`EXIBIR CONTEÚDO:
  cat arquivo          Arquivos curtos, exibição rápida
  less arquivo         Arquivos longos, navegação interativa
  more arquivo         Paginação simples (prefira less)

PARTES DO ARQUIVO:
  head -n 20 arquivo   Primeiras 20 linhas
  tail -n 20 arquivo   Últimas 20 linhas
  tail -f arquivo      Monitorar em tempo real

BUSCAR E ANALISAR:
  grep "padrão" arq    Buscar texto no arquivo
  grep -r "padrão" .   Buscar em todos os arquivos do diretório
  wc -l arquivo        Contar linhas

COMPARAR E IDENTIFICAR:
  diff arq1 arq2       Comparar dois arquivos
  diff -u arq1 arq2    Comparar em formato unificado
  file arquivo         Identificar tipo do arquivo
  strings binario      Extrair texto legível de binário`}),a.jsx("h2",{children:"tac - O Inverso do cat"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"tac"})," (cat escrito ao contrário) mostra o conteúdo de um arquivo de trás para frente — a última linha aparece primeiro e a primeira linha aparece por último."]}),a.jsx(e,{title:"tac - exibir arquivo invertido",code:`# Arquivo original:
cat numeros.txt
# 1
# 2
# 3
# 4
# 5

# Invertido com tac:
tac numeros.txt
# 5
# 4
# 3
# 2
# 1

# Útil para ver logs mais recentes primeiro:
tac /var/log/pacman.log | head -20

# Inverter a ordem de linhas de um arquivo e salvar:
tac arquivo.txt > arquivo_invertido.txt

# Combinar com grep para encontrar a ÚLTIMA ocorrência:
tac /var/log/pacman.log | grep -m 1 "upgraded linux"
# Mostra a atualização mais recente do kernel`}),a.jsxs(o,{type:"success",title:"Combine tudo com pipes!",children:["O verdadeiro poder desses comandos aparece quando você os combina com pipes (",a.jsx("code",{children:"|"}),"). Por exemplo: ",a.jsx("code",{children:'cat log.txt | grep "error" | wc -l'})," conta quantos erros existem em um arquivo de log. Veja a página sobre Redirecionamento e Pipes para dominar essa técnica."]})]})}export{u as default};
