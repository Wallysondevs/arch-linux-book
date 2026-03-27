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
mkdir MeusDiretorio

# Criar com caminho completo (incluindo pais que não existem)
mkdir -p /home/joao/Projetos/novo-site/src/components

# Criar múltiplos diretórios de uma vez
mkdir pasta1 pasta2 pasta3

# Criar com permissões específicas
mkdir -m 755 diretorio-publico
mkdir -m 700 diretorio-privado

# Criar estrutura de projeto de uma vez:
mkdir -p meu-projeto/{src,tests,docs,public/{css,js,img}}`}
      />

      <h2>touch — Criar Arquivos e Atualizar Timestamps</h2>
      <CodeBlock
        title="Criando e tocando arquivos"
        code={`# Criar um arquivo vazio
touch arquivo.txt

# Criar múltiplos arquivos
touch index.html style.css script.js

# Atualizar a data de modificação de um arquivo existente
touch arquivo-existente.txt

# Criar com data de modificação específica
touch -t 202401011200 arquivo.txt  # 2024-01-01 12:00`}
      />

      <h2>cp — Copiar Arquivos e Diretórios</h2>
      <CodeBlock
        title="Copiando com precisão"
        code={`# Copiar um arquivo para outro local
cp arquivo.txt /tmp/

# Copiar e renomear ao mesmo tempo
cp arquivo.txt /tmp/copia-do-arquivo.txt

# Copiar múltiplos arquivos para um diretório
cp foto1.jpg foto2.jpg video.mp4 /media/backup/

# Copiar diretório (recursivo — OBRIGATÓRIO o -r)
cp -r /home/joao/Projetos /media/backup/

# Copiar preservando atributos (permissões, timestamps, donos)
cp -a /home/joao/Projetos /media/backup/

# Copiar somente se o arquivo de destino for mais antigo (sincronizar)
cp -u arquivo.txt /media/backup/

# Copiar com progresso (para arquivos grandes)
cp --progress arquivo-grande.iso /media/usb/

# Perguntar antes de sobrescrever
cp -i arquivo.txt /tmp/    # "-i" = interactive

# Copiar sem sobrescrever (pular se destino existir)
cp -n arquivo.txt /tmp/    # "-n" = no-clobber

# Fazer backup automático antes de sobrescrever
cp -b arquivo.txt /tmp/    # Cria /tmp/arquivo.txt~`}
      />

      <h2>mv — Mover e Renomear</h2>
      <CodeBlock
        title="Movendo e renomeando"
        code={`# Renomear um arquivo
mv nome-antigo.txt nome-novo.txt

# Mover um arquivo para outro diretório
mv arquivo.txt /tmp/

# Mover e renomear ao mesmo tempo
mv rascunho.txt /home/joao/Documents/relatorio-final.txt

# Mover múltiplos arquivos para um diretório
mv *.jpg /home/joao/Pictures/

# Mover diretório inteiro
mv Projetos/ /media/backup/

# Perguntar antes de sobrescrever
mv -i arquivo.txt /tmp/

# Não sobrescrever (pular se destino existir)
mv -n arquivo.txt /tmp/

# Renomear em lote (usando rename ou um loop):
# Renomear todos os .jpeg para .jpg:
rename 's/.jpeg/.jpg/' *.jpeg

# Ou com loop bash:
for f in *.jpeg; do mv "$f" "\${f%.jpeg}.jpg"; done`}
      />

      <h2>rm — Remover Arquivos e Diretórios</h2>
      <AlertBox type="danger" title="Não existe lixeira no terminal!">
        Arquivos removidos com <code>rm</code> são deletados permanentemente — sem lixeira,
        sem confirmação (a menos que você use <code>-i</code>). Tenha certeza antes de executar,
        especialmente com wildcards (*). Um <code>rm -rf /*</code> por engano pode destruir
        o sistema inteiro.
      </AlertBox>
      <CodeBlock
        title="Removendo arquivos com segurança"
        code={`# Remover um arquivo
rm arquivo.txt

# Remover múltiplos arquivos
rm foto1.jpg foto2.jpg video.mp4

# Remover com confirmação para cada arquivo
rm -i *.log

# Remover diretório VAZIO
rmdir diretorio-vazio/

# Remover diretório e TODO o conteúdo (recursivo)
rm -r diretorio/

# Forçar remoção sem confirmação (PERIGOSO — use com cuidado)
rm -rf diretorio/

# Verificar o que seria removido antes de remover:
ls diretorio/   # Ver o conteúdo primeiro
rm -ri diretorio/  # Remover com confirmação para cada item

# Alternativa mais segura: mover para /tmp antes de deletar
mv arquivo-importante.conf /tmp/
# Depois que confirmar que não precisa mais:
rm /tmp/arquivo-importante.conf`}
      />

      <h2>ln — Links Simbólicos e Hard Links</h2>
      <CodeBlock
        title="Criando links"
        code={`# Link simbólico (symlink) — como um atalho
ln -s /caminho/original /caminho/do/link

# Exemplos práticos:
# Apontar /usr/local/python para uma versão específica:
ln -s /usr/bin/python3.12 /usr/local/bin/python

# Criar link de uma pasta (muito útil para desenvolvimento):
ln -s /opt/meu-projeto /home/joao/meu-projeto

# Link simbólico de arquivo de configuração:
ln -s /etc/nginx/sites-available/meu-site /etc/nginx/sites-enabled/meu-site

# Ver para onde um symlink aponta:
ls -la /etc/nginx/sites-enabled/

# Remover um symlink (NÃO use rm -r):
rm /etc/nginx/sites-enabled/meu-site  # Correto
# unlink /etc/nginx/sites-enabled/meu-site  # Alternativa

# Hard link — dois nomes para o mesmo dado no disco
ln /arquivo/original.txt /outro/caminho/copia.txt
# Hard links compartilham o mesmo inode (bloco no disco)
# Deletar um não apaga o outro`}
      />

      <h2>Wildcards — Curingas</h2>
      <CodeBlock
        title="Usando curingas para selecionar múltiplos arquivos"
        code={`# * = qualquer sequência de caracteres
ls *.txt       # todos os arquivos .txt
rm *.log       # remover todos os arquivos .log
cp *.jpg /tmp/ # copiar todos os .jpg

# ? = um único caractere qualquer
ls foto?.jpg   # foto1.jpg, foto2.jpg, fotoA.jpg (mas não foto10.jpg)

# [] = qualquer caractere dentro dos colchetes
ls foto[123].jpg   # foto1.jpg, foto2.jpg, foto3.jpg
ls arquivo[a-z].txt # arquivoa.txt, arquivob.txt ... arquivoz.txt
ls *.[ch]           # todos os .c e .h (código C)

# {} = alternativas separadas por vírgula (brace expansion)
echo {a,b,c}.txt  # a.txt b.txt c.txt
mkdir -p projeto/{src,docs,tests}
cp arquivo.{txt,backup}  # copia arquivo.txt para arquivo.backup

# Exemplo prático: copiar apenas PDF e DOCX
cp *.{pdf,docx} /media/pendrive/`}
      />

      <h2>stat — Informações Detalhadas de Arquivos</h2>
      <CodeBlock
        title="Inspecionando metadados de arquivos"
        code={`# Ver informações detalhadas de um arquivo
stat arquivo.txt

# Saída:
#   File: arquivo.txt
#   Size: 1234      Blocks: 8   IO Block: 4096  regular file
# Device: 8,3 (sda3)  Inode: 123456  Links: 1
# Access: (0644/-rw-r--r--)  Uid: (1000/joao)  Gid: (1000/joao)
# Access: 2024-03-27 10:00:00.000000000 -0300  ← último acesso
# Modify: 2024-03-27 09:30:00.000000000 -0300  ← última modificação
# Change: 2024-03-27 09:30:00.000000000 -0300  ← última mudança de metadado

# Ver apenas o tamanho em bytes:
stat -c %s arquivo.txt

# Ver apenas as permissões em formato octal:
stat -c %a arquivo.txt`}
      />
    </PageContainer>
  );
}
