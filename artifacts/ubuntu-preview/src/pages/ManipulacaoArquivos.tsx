import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ManipulacaoArquivos() {
  return (
    <PageContainer
      title="Manipulação de Arquivos"
      subtitle="cp, mv, rm, mkdir, touch, ln — criando, copiando, movendo e removendo arquivos e diretórios com segurança e eficiência."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Manipular arquivos é uma das atividades mais básicas e importantes no terminal Linux.
        Esses comandos parecem simples mas têm opções poderosas que economizam muito tempo
        no dia a dia. Aprenda-os bem — você os usará constantemente.
      </p>

      <h2>mkdir — Criar Diretórios</h2>
      <CodeBlock
        title="Criando diretórios"
        code={`# Criar um diretório simples
mkdir MeuDiretorio

# -p = parents (criar diretórios pais se não existirem)
# Sem -p, daria erro se /home/joao/Projetos/novo-site não existisse
mkdir -p /home/joao/Projetos/novo-site/src/components

# Criar múltiplos diretórios de uma vez (apenas separe por espaço)
mkdir pasta1 pasta2 pasta3

# -m = mode (definir permissões ao criar)
# 755 = dono pode tudo, grupo e outros só podem ler e entrar
mkdir -m 755 diretorio-publico
# 700 = apenas o dono tem acesso (grupo e outros não podem nem entrar)
mkdir -m 700 diretorio-privado

# Criar estrutura completa de projeto de uma vez com chaves {}:
# {src,tests,docs} = criar três pastas: src, tests e docs
mkdir -p meu-projeto/{src,tests,docs,public/{css,js,img}}`}
      />

      <h2>touch — Criar Arquivos Vazios</h2>
      <CodeBlock
        title="Criando arquivos com touch"
        code={`# Criar um arquivo vazio
touch arquivo.txt
# Se o arquivo já existir, touch apenas atualiza sua data de modificação.

# Criar múltiplos arquivos de uma vez
touch index.html style.css script.js

# -t = timestamp (definir data de modificação específica)
# Formato: AAAAMMDDHHMM
touch -t 202401011200 arquivo.txt
# Define a data como 2024-01-01 às 12:00`}
      />

      <h2>cp — Copiar Arquivos e Diretórios</h2>
      <CodeBlock
        title="Copiando com todas as flags explicadas"
        code={`# Copiar um arquivo para outro local
cp arquivo.txt /tmp/

# Copiar e renomear ao mesmo tempo (especifique o nome de destino)
cp arquivo.txt /tmp/copia-do-arquivo.txt

# Copiar múltiplos arquivos para um diretório (destino deve ser diretório)
cp foto1.jpg foto2.jpg video.mp4 /media/backup/

# -r = recursive (recursivo) — OBRIGATÓRIO para copiar diretórios!
# Sem -r, dá erro ao tentar copiar uma pasta.
cp -r /home/joao/Projetos /media/backup/

# -a = archive (arquivo/preservar tudo)
# Equivale a -r + preservar permissões, timestamps, links simbólicos e donos
# Use quando quiser uma cópia IDÊNTICA ao original
cp -a /home/joao/Projetos /media/backup/

# -u = update (atualizar)
# Copia apenas se o arquivo de origem for MAIS NOVO que o destino
# Útil para sincronização manual
cp -u arquivo.txt /media/backup/

# -v = verbose (verboso)
# Mostra cada arquivo sendo copiado (útil para ver o progresso)
cp -rv /home/joao/Projetos /media/backup/

# -i = interactive (interativo)
# Pergunta antes de sobrescrever arquivos existentes no destino
cp -i arquivo.txt /tmp/

# -n = no-clobber (não substituir)
# NUNCA sobrescreve — pula silenciosamente se o destino existir
cp -n arquivo.txt /tmp/

# -b = backup (fazer cópia de segurança antes de sobrescrever)
# Cria /tmp/arquivo.txt~ antes de sobrescrever com o novo
cp -b arquivo.txt /tmp/

# --progress = mostrar barra de progresso (para arquivos grandes)
cp --progress arquivo-grande.iso /media/usb/`}
      />

      <h2>mv — Mover e Renomear</h2>
      <CodeBlock
        title="Movendo e renomeando arquivos"
        code={`# Renomear um arquivo (mover para o mesmo lugar com novo nome)
mv nome-antigo.txt nome-novo.txt

# Mover um arquivo para outro diretório
mv arquivo.txt /tmp/

# Mover e renomear ao mesmo tempo
mv rascunho.txt /home/joao/Documents/relatorio-final.txt

# Mover múltiplos arquivos para um diretório
# Quando o destino é um diretório, todos os arquivos vão para lá
mv *.jpg /home/joao/Pictures/

# Mover diretório inteiro (não precisa de -r como o cp)
mv Projetos/ /media/backup/

# -i = interactive (interativo)
# Pergunta "sobrescrever?" antes de substituir arquivo existente
mv -i arquivo.txt /tmp/

# -n = no-clobber (não substituir)
# Nunca sobrescreve — ignora silenciosamente se o destino existir
mv -n arquivo.txt /tmp/

# -v = verbose (verboso)
# Mostra o que está sendo movido
mv -v pasta-antiga/ /nova/localização/

# Renomear em lote com um loop:
for f in *.jpeg; do
    mv "\$f" "\${f%.jpeg}.jpg"
    # \${f%.jpeg} = remove a extensão .jpeg do nome
    # então adiciona .jpg no lugar
done`}
      />

      <h2>rm — Remover Arquivos e Diretórios</h2>
      <AlertBox type="danger" title="Não existe lixeira no terminal!">
        Arquivos removidos com <code>rm</code> são deletados permanentemente — sem lixeira,
        sem "Ctrl+Z". Se usar curingas (*) com descuido, pode apagar coisas importantes.
        Na dúvida, use <code>rm -i</code> para confirmar cada remoção, ou mova para
        <code>/tmp/</code> primeiro e só depois delete.
      </AlertBox>
      <CodeBlock
        title="Removendo arquivos com segurança"
        code={`# Remover um arquivo (não pede confirmação)
rm arquivo.txt

# Remover múltiplos arquivos de uma vez
rm foto1.jpg foto2.jpg video.mp4

# -i = interactive (interativo) — RECOMENDADO para iniciantes!
# Pergunta "remover este arquivo?" para cada arquivo antes de deletar
rm -i *.log

# -r = recursive (recursivo)
# Necessário para remover diretórios e todo o seu conteúdo
rm -r diretorio/

# -f = force (forçar)
# Remove sem pedir confirmação e sem dar erro se o arquivo não existir
rm -f arquivo-que-pode-nao-existir.txt

# -rf combinados = remover diretório inteiro sem confirmação (MUITO PERIGOSO!)
rm -rf diretorio/
# Use com extremo cuidado. rm -rf /pasta-errada pode destruir o sistema.

# -v = verbose (verboso)
# Mostra cada arquivo sendo removido
rm -rv diretorio/

# Prática mais segura: verificar ANTES de remover
ls *.log       # Ver o que seria removido
rm -i *.log    # Remover com confirmação um a um

# Alternativa segura: mover para /tmp antes de deletar definitivamente
mv arquivo-duvidoso.conf /tmp/
# O /tmp é limpo automaticamente no reboot — dá tempo de recuperar se errar`}
      />

      <h2>ln — Links Simbólicos</h2>
      <CodeBlock
        title="Criando links (atalhos) no Linux"
        code={`# -s = symbolic (simbólico) — o tipo de link mais comum
# Um symlink é como um "atalho" do Windows: aponta para outro arquivo/pasta
ln -s /caminho/original /caminho/do/link

# Exemplos práticos:

# Criar atalho para uma versão específica do Python:
ln -s /usr/bin/python3.12 /usr/local/bin/python

# Criar atalho de uma pasta de projeto no seu home:
ln -s /opt/meu-projeto /home/joao/meu-projeto
# Agora /home/joao/meu-projeto aponta para /opt/meu-projeto

# Ativar site no Nginx (symlink de sites-available para sites-enabled):
ln -s /etc/nginx/sites-available/meu-site /etc/nginx/sites-enabled/meu-site

# Ver para onde um symlink aponta:
ls -la /etc/nginx/sites-enabled/
# lrwxrwxrwx  meu-site -> ../sites-available/meu-site
# ^ l = link simbólico

# Remover um symlink (use rm, NÃO use rm -r!):
rm /etc/nginx/sites-enabled/meu-site   # CORRETO — remove apenas o link
# rm -r /etc/nginx/sites-enabled/meu-site  ← ERRADO: removeria o destino também!`}
      />

      <h2>Wildcards — Curingas</h2>
      <CodeBlock
        title="Selecionando múltiplos arquivos com padrões"
        code={`# * = qualquer sequência de caracteres (zero ou mais)
ls *.txt          # todos os arquivos que TERMINAM em .txt
rm *.log          # remover todos os arquivos que terminam em .log
cp *.jpg /tmp/    # copiar todos os .jpg

# ? = exatamente UM caractere qualquer
ls foto?.jpg      # foto1.jpg, foto2.jpg (mas NÃO foto10.jpg — são 2 chars)

# [] = qualquer caractere DENTRO dos colchetes
ls foto[123].jpg    # aceita: foto1.jpg, foto2.jpg, foto3.jpg
ls arquivo[a-z].txt # aceita: arquivoa.txt, arquivob.txt ... arquivoz.txt
ls *.[ch]           # aceita: arquivo.c e arquivo.h (código em C)

# {} = alternativas separadas por vírgula (brace expansion)
# Não é um curinga, mas expande para múltiplos termos antes de executar
echo arquivo.{txt,pdf,jpg}
# Saída: arquivo.txt arquivo.pdf arquivo.jpg

mkdir -p projeto/{src,docs,tests}
# Equivale a:
# mkdir -p projeto/src
# mkdir -p projeto/docs
# mkdir -p projeto/tests

cp arquivo.{conf,conf.bak}
# Equivale a: cp arquivo.conf arquivo.conf.bak (cria backup renomeando)`}
      />
    </PageContainer>
  );
}
