import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(r,{title:"Redirecionamento e Pipes",subtitle:"Aprenda a redirecionar entrada e saída de comandos, usar pipes para encadear processos e dominar o fluxo de dados no terminal.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Conceitos Fundamentais"}),e.jsx("p",{children:"No Linux, todo processo tem três fluxos de dados padrão:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"stdin (0)"})," — Entrada padrão (normalmente o teclado)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"stdout (1)"})," — Saída padrão (normalmente a tela do terminal)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"stderr (2)"})," — Saída de erros (também a tela, mas separada da saída padrão)"]})]}),e.jsx("p",{children:"O redirecionamento permite alterar de onde vêm e para onde vão esses fluxos, permitindo salvar saídas em arquivos, encadear comandos e muito mais."}),e.jsx("h2",{children:"Redirecionamento de Saída (stdout)"}),e.jsxs("h3",{children:["Sobrescrever arquivo com ",">"]}),e.jsx(a,{title:"Redirecionar saída para arquivo (sobrescreve)",code:`# Salvar a listagem de arquivos em um arquivo
ls -la > listagem.txt

# Salvar a saída de um comando
date > data_atual.txt

# Salvar informações do sistema
uname -a > sistema.txt

# CUIDADO: isso apaga o conteúdo anterior do arquivo!
echo "primeira linha" > arquivo.txt
echo "segunda linha" > arquivo.txt
cat arquivo.txt
# Resultado: apenas "segunda linha"`}),e.jsxs("h3",{children:["Acrescentar ao arquivo com ",">>"]}),e.jsx(a,{title:"Redirecionar saída para arquivo (acrescenta)",code:`# Adicionar ao final do arquivo sem apagar o conteúdo
echo "primeira linha" > log.txt
echo "segunda linha" >> log.txt
echo "terceira linha" >> log.txt
cat log.txt
# Resultado: todas as três linhas

# Criar um log contínuo
date >> meu_log.txt
echo "Backup realizado com sucesso" >> meu_log.txt

# Acrescentar a saída de comandos
ls /etc >> lista_configs.txt
ls /var >> lista_configs.txt`}),e.jsxs(o,{type:"danger",title:"Não confunda > com >>",children:["Usar ",e.jsx("code",{children:">"})," em um arquivo existente ",e.jsx("strong",{children:"apaga todo o conteúdo"})," antes de escrever. Use ",e.jsx("code",{children:">>"})," quando quiser preservar o conteúdo existente e adicionar ao final."]}),e.jsx("h2",{children:"Redirecionamento de Erros (stderr)"}),e.jsx(a,{title:"Redirecionar apenas erros",code:`# Redirecionar stderr para um arquivo
ls /diretorio_inexistente 2> erros.txt

# Redirecionar stderr e acrescentar
comando_invalido 2>> erros.txt

# Redirecionar stdout e stderr para arquivos DIFERENTES
ls /home /inexistente > saida.txt 2> erros.txt

# Redirecionar stdout e stderr para o MESMO arquivo
ls /home /inexistente > tudo.txt 2>&1

# Sintaxe moderna (Bash 4+) para redirecionar ambos
ls /home /inexistente &> tudo.txt

# Acrescentar ambos ao mesmo arquivo
ls /home /inexistente &>> tudo.txt`}),e.jsxs(o,{type:"info",title:"Entendendo 2>&1",children:["O ",e.jsx("code",{children:"2>&1"})," significa: redirecione o file descriptor 2 (stderr) para onde o file descriptor 1 (stdout) está apontando. A ordem importa! O redirecionamento de stdout deve vir antes."]}),e.jsx("h2",{children:"Redirecionamento de Entrada (stdin)"}),e.jsx(a,{title:"Redirecionar entrada de um arquivo",code:`# Usar arquivo como entrada de um comando
sort < nomes.txt

# Contar palavras de um arquivo
wc -l < arquivo.txt

# Enviar email com conteúdo de arquivo (se mail estiver instalado)
mail usuario@exemplo.com < mensagem.txt

# Combinar entrada e saída
sort < desordenado.txt > ordenado.txt`}),e.jsxs("h2",{children:["Here Documents (","<<EOF",")"]}),e.jsx("p",{children:"Here documents permitem passar múltiplas linhas de texto como entrada para um comando, diretamente no script, sem precisar de um arquivo separado."}),e.jsx(a,{title:"Usando here documents",code:`# Criar arquivo com múltiplas linhas
cat << EOF > config.txt
# Arquivo de configuração
servidor=192.168.1.1
porta=8080
usuario=admin
EOF

# Usar com qualquer comando
mysql -u root << EOF
CREATE DATABASE meu_banco;
USE meu_banco;
CREATE TABLE usuarios (id INT, nome VARCHAR(100));
EOF

# Here document com indentação (usar <<- com tabs)
if true; then
	cat <<- EOF
	Esta linha pode ser indentada com tabs
	E o EOF também
	EOF
fi

# Here string (<<<) - para uma única linha
grep "erro" <<< "esta linha contém um erro"
wc -w <<< "contando palavras desta frase"`}),e.jsx("h2",{children:"O /dev/null — O Buraco Negro do Linux"}),e.jsx(a,{title:"Descartando saída com /dev/null",code:`# Descartar toda a saída (stdout)
comando_barulhento > /dev/null

# Descartar apenas erros
find / -name "*.conf" 2> /dev/null

# Descartar TUDO (stdout e stderr)
comando_qualquer &> /dev/null

# Uso comum: verificar se comando existe sem mostrar saída
if command -v git &> /dev/null; then
    echo "Git está instalado"
fi

# Uso comum: cron jobs silenciosos
# No crontab:
# 0 3 * * * /home/user/backup.sh &> /dev/null`}),e.jsxs(o,{type:"info",title:"O que é /dev/null?",children:[e.jsx("code",{children:"/dev/null"})," é um dispositivo especial que descarta tudo que é escrito nele. Ler dele retorna EOF imediatamente. É perfeito para silenciar saídas indesejadas."]}),e.jsx("h2",{children:"Pipes (|)"}),e.jsx("p",{children:"Pipes são um dos recursos mais poderosos do Linux. Eles conectam a saída (stdout) de um comando à entrada (stdin) do próximo, permitindo criar cadeias de processamento."}),e.jsx(a,{title:"Exemplos básicos de pipes",code:`# Listar arquivos e filtrar
ls -la | grep ".txt"

# Contar quantos processos estão rodando
ps aux | wc -l

# Ver os 10 maiores arquivos
du -ah /var | sort -rh | head -10

# Encontrar processos do Firefox
ps aux | grep firefox

# Listar pacotes instalados e contar
pacman -Q | wc -l

# Ordenar e remover duplicatas
cat lista.txt | sort | uniq

# Pipeline complexo: top 5 IPs em um log de acesso
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5`}),e.jsx("h3",{children:"Pipes com Comandos Úteis"}),e.jsx(a,{title:"Combinações poderosas",code:`# Monitorar log em tempo real filtrando por erros
tail -f /var/log/syslog | grep -i "error"

# Encontrar os 10 maiores diretórios
du -sh /* 2>/dev/null | sort -rh | head -10

# Listar extensões de arquivos únicas
find . -type f | sed 's/.*\\.//' | sort -u

# Contar arquivos por extensão
find . -type f | sed 's/.*\\.//' | sort | uniq -c | sort -rn

# Processar CSV
cat dados.csv | cut -d',' -f2 | sort | uniq -c | sort -rn

# Verificar portas em uso
ss -tulanp | grep LISTEN | awk '{print $5}' | sort`}),e.jsx("h2",{children:"Comando tee"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"tee"}),' lê da entrada padrão e escreve tanto na saída padrão quanto em um arquivo simultaneamente. É como um "T" na tubulação.']}),e.jsx(a,{title:"Usando tee",code:`# Salvar saída em arquivo E mostrar na tela
ls -la | tee listagem.txt

# Acrescentar ao arquivo em vez de sobrescrever
ls -la | tee -a listagem.txt

# Usar tee no meio de um pipeline
cat log.txt | grep "ERROR" | tee erros.txt | wc -l

# Escrever em múltiplos arquivos
echo "dados" | tee arquivo1.txt arquivo2.txt arquivo3.txt

# Uso comum: comando que precisa de sudo para escrever
echo "192.168.1.100 meu-servidor" | sudo tee -a /etc/hosts`}),e.jsxs(o,{type:"warning",title:"sudo e redirecionamento",children:[e.jsxs("code",{children:['sudo echo "texto" ',">"," /etc/arquivo"]})," NÃO funciona porque o redirecionamento é executado pelo shell do usuário, não pelo sudo. Use ",e.jsx("code",{children:'echo "texto" | sudo tee /etc/arquivo'})," em vez disso."]}),e.jsx("h2",{children:"Substituição de Processos"}),e.jsx("p",{children:"A substituição de processos permite tratar a saída de um comando como se fosse um arquivo."}),e.jsx(a,{title:"Substituição de processos",code:`# Comparar saída de dois comandos
diff <(ls /dir1) <(ls /dir2)

# Comparar pacotes instalados em duas máquinas
diff <(ssh maq1 'pacman -Q') <(ssh maq2 'pacman -Q')

# Alimentar loop com saída de comando
while IFS= read -r linha; do
    echo "Processando: $linha"
done < <(find . -name "*.log")`}),e.jsx("h2",{children:"Encadeamento de Comandos"}),e.jsx(a,{title:"Operadores de encadeamento",code:`# Ponto e vírgula: executa sequencialmente (independente do resultado)
mkdir pasta; cd pasta; touch arquivo.txt

# && (AND): executa o próximo SOMENTE se o anterior teve sucesso
make && make install

# || (OR): executa o próximo SOMENTE se o anterior falhou
ping -c 1 google.com || echo "Sem internet"

# Combinando && e ||
test -f arquivo.txt && echo "Existe" || echo "Não existe"

# Agrupamento com chaves (executa no shell atual)
{ echo "Início"; date; echo "Fim"; } > log.txt

# Agrupamento com parênteses (executa em subshell)
(cd /tmp && ls) # O cd não afeta o shell atual`}),e.jsx("h2",{children:"Resumo Visual dos Redirecionamentos"}),e.jsx(a,{title:"Referência rápida",code:`comando > arquivo      # stdout para arquivo (sobrescreve)
comando >> arquivo     # stdout para arquivo (acrescenta)
comando 2> arquivo     # stderr para arquivo
comando 2>> arquivo    # stderr para arquivo (acrescenta)
comando &> arquivo     # stdout + stderr para arquivo
comando &>> arquivo    # stdout + stderr para arquivo (acrescenta)
comando < arquivo      # arquivo como stdin
comando << EOF         # here document como stdin
comando <<< "string"   # here string como stdin
cmd1 | cmd2            # pipe: stdout de cmd1 vira stdin de cmd2
cmd1 | tee arq | cmd2  # tee: salva e passa adiante
diff <(cmd1) <(cmd2)   # substituição de processos
comando > /dev/null    # descartar saída`})]})}export{u as default};
