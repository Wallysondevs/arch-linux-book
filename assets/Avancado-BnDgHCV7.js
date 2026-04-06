import{j as a}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return a.jsxs(o,{title:"Comandos Avançados: O Poder do Terminal",subtitle:"Filtros, regex, processamento de texto e automação com grep, awk, sed, find e xargs.",difficulty:"avancado",timeToRead:"25 min",children:[a.jsx("p",{children:"A verdadeira mágica do Linux acontece quando você combina pequenos programas que fazem uma única coisa bem feita (filosofia UNIX). Bem-vindo ao mundo do processamento de dados via terminal."}),a.jsx("h2",{children:"1. Busca com GREP"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"grep"})," procura padrões e expressões regulares dentro de textos ou saídas de outros comandos."]}),a.jsx(e,{code:`# Buscar a palavra "error" (case-insensitive) num arquivo
grep -i "error" /var/log/syslog

# Buscar recursivamente (-r) mostrando a linha do arquivo (-n)
grep -rn "TODO:" /home/dev/projeto/

# Inverter a busca (mostrar linhas que NÃO contêm a palavra)
grep -v "success" logs.txt

# Mostrar o contexto: 3 linhas antes (-B) e 3 depois (-A) do match
grep -A 3 -B 3 "Exception" app.log

# Usar Regex Estendido (-E)
grep -E "[0-9]{3}-[0-9]{3}-[0-9]{4}" contatos.txt`}),a.jsx("h2",{children:"2. O canivete suíço: FIND"}),a.jsxs("p",{children:["Diferente do ",a.jsx("code",{children:"locate"}),", o ",a.jsx("code",{children:"find"})," varre o disco em tempo real baseado em diversos critérios."]}),a.jsx(e,{code:`# Buscar arquivos pelo nome na pasta atual e subpastas
find . -name "*.jpg"

# Buscar apenas diretórios (-type d) ou arquivos (-type f)
find /etc -type d -name "nginx"

# Buscar arquivos modificados nos últimos 7 dias
find /home -mtime -7

# Buscar arquivos maiores que 1GB
find / -size +1G

# O PODER DO -exec: Encontrar e deletar arquivos .tmp
find . -name "*.tmp" -exec rm -f {} +`}),a.jsx("h2",{children:"3. Automação pesada com XARGS"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"xargs"})," pega a saída padrão e a transforma em argumentos para outro comando. É mais eficiente que o ",a.jsx("code",{children:"-exec"})," do find."]}),a.jsx(e,{code:`# Encontra imagens antigas e passa para o rm deletar de uma vez só
find . -name "*.png" -mtime +30 | xargs rm -f

# Executar comandos em PARALELO (-P 4 usa 4 threads) para converter arquivos
ls *.mp4 | xargs -n 1 -P 4 -I {} ffmpeg -i {} {}.mp3`}),a.jsx("h2",{children:"4. Manipulação com SED (Stream Editor)"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"sed"})," é perfeito para localizar e substituir textos em massa sem abrir o arquivo."]}),a.jsx(e,{code:`# Substituir a primeira ocorrência de "foo" por "bar" por linha
sed 's/foo/bar/' arquivo.txt

# Substituir TODAS as ocorrências na linha (g = global)
sed 's/foo/bar/g' arquivo.txt

# Editar o arquivo IN-PLACE (-i) alterando ele de verdade e criando backup
sed -i.bak 's/localhost/127.0.0.1/g' config.yml

# Deletar da linha 5 até a 10
sed '5,10d' texto.txt`}),a.jsx("h2",{children:"5. A linguagem AWK"}),a.jsxs("p",{children:[a.jsx("code",{children:"awk"})," é uma linguagem de programação completa disfarçada de comando, focada em manipulação de colunas e dados tabulares."]}),a.jsx(e,{code:`# Imprimir apenas a primeira ($1) e terceira ($3) coluna de um arquivo
awk '{print $1, $3}' dados.txt

# Separador customizado (Ex: CSV). Onde a vírgula é o separador (-F',')
awk -F',' '{print $2}' clientes.csv

# Imprimir as linhas onde a terceira coluna é maior que 100
awk '$3 > 100' saldos.txt

# Somar todos os valores da primeira coluna e imprimir o total no final
awk '{soma += $1} END {print "Total:", soma}' compras.txt`}),a.jsxs(r,{type:"success",title:"Juntando tudo com PIPES (|)",children:[a.jsx("p",{children:"O verdadeiro poder vem de canalizar a saída de um programa para outro:"}),a.jsx("p",{className:"font-mono text-sm mt-2 bg-black/30 p-2 rounded",children:`cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5`}),a.jsx("p",{className:"text-sm mt-1",children:"Isso pega um log web, filtra erros 404, pega os IPs, ordena, conta as ocorrências, ordena numericamente do maior pro menor, e mostra os 5 IPs que mais geraram erro 404."})]})]})}export{l as default};
