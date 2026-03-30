import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Avancado() {
  return (
    <PageContainer 
      title="Comandos Avançados: O Poder do Terminal" 
      subtitle="Filtros, regex, processamento de texto e automação com grep, awk, sed, find e xargs."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <p>
        A verdadeira mágica do Linux acontece quando você combina pequenos programas que fazem uma 
        única coisa bem feita (filosofia UNIX). Bem-vindo ao mundo do processamento de dados via terminal.
      </p>

      <h2>1. Busca com GREP</h2>
      <p>O <code>grep</code> procura padrões e expressões regulares dentro de textos ou saídas de outros comandos.</p>
      
      <CodeBlock code={`# Buscar a palavra "error" (case-insensitive) num arquivo
grep -i "error" /var/log/syslog

# Buscar recursivamente (-r) mostrando a linha do arquivo (-n)
grep -rn "TODO:" /home/dev/projeto/

# Inverter a busca (mostrar linhas que NÃO contêm a palavra)
grep -v "success" logs.txt

# Mostrar o contexto: 3 linhas antes (-B) e 3 depois (-A) do match
grep -A 3 -B 3 "Exception" app.log

# Usar Regex Estendido (-E)
grep -E "[0-9]{3}-[0-9]{3}-[0-9]{4}" contatos.txt`} />

      <h2>2. O canivete suíço: FIND</h2>
      <p>Diferente do <code>locate</code>, o <code>find</code> varre o disco em tempo real baseado em diversos critérios.</p>
      
      <CodeBlock code={`# Buscar arquivos pelo nome na pasta atual e subpastas
find . -name "*.jpg"

# Buscar apenas diretórios (-type d) ou arquivos (-type f)
find /etc -type d -name "nginx"

# Buscar arquivos modificados nos últimos 7 dias
find /home -mtime -7

# Buscar arquivos maiores que 1GB
find / -size +1G

# O PODER DO -exec: Encontrar e deletar arquivos .tmp
find . -name "*.tmp" -exec rm -f {} +`} />

      <h2>3. Automação pesada com XARGS</h2>
      <p>O <code>xargs</code> pega a saída padrão e a transforma em argumentos para outro comando. 
      É mais eficiente que o <code>-exec</code> do find.</p>
      
      <CodeBlock code={`# Encontra imagens antigas e passa para o rm deletar de uma vez só
find . -name "*.png" -mtime +30 | xargs rm -f

# Executar comandos em PARALELO (-P 4 usa 4 threads) para converter arquivos
ls *.mp4 | xargs -n 1 -P 4 -I {} ffmpeg -i {} {}.mp3`} />

      <h2>4. Manipulação com SED (Stream Editor)</h2>
      <p>O <code>sed</code> é perfeito para localizar e substituir textos em massa sem abrir o arquivo.</p>

      <CodeBlock code={`# Substituir a primeira ocorrência de "foo" por "bar" por linha
sed 's/foo/bar/' arquivo.txt

# Substituir TODAS as ocorrências na linha (g = global)
sed 's/foo/bar/g' arquivo.txt

# Editar o arquivo IN-PLACE (-i) alterando ele de verdade e criando backup
sed -i.bak 's/localhost/127.0.0.1/g' config.yml

# Deletar da linha 5 até a 10
sed '5,10d' texto.txt`} />

      <h2>5. A linguagem AWK</h2>
      <p><code>awk</code> é uma linguagem de programação completa disfarçada de comando, focada em manipulação de colunas e dados tabulares.</p>

      <CodeBlock code={`# Imprimir apenas a primeira ($1) e terceira ($3) coluna de um arquivo
awk '{print $1, $3}' dados.txt

# Separador customizado (Ex: CSV). Onde a vírgula é o separador (-F',')
awk -F',' '{print $2}' clientes.csv

# Imprimir as linhas onde a terceira coluna é maior que 100
awk '$3 > 100' saldos.txt

# Somar todos os valores da primeira coluna e imprimir o total no final
awk '{soma += $1} END {print "Total:", soma}' compras.txt`} />

      <AlertBox type="success" title="Juntando tudo com PIPES (|)">
        <p>O verdadeiro poder vem de canalizar a saída de um programa para outro:</p>
        <p className="font-mono text-sm mt-2 bg-black/30 p-2 rounded">
          {`cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5`}
        </p>
        <p className="text-sm mt-1">Isso pega um log web, filtra erros 404, pega os IPs, ordena, conta as ocorrências, ordena numericamente do maior pro menor, e mostra os 5 IPs que mais geraram erro 404.</p>
      </AlertBox>

    </PageContainer>
  );
}
