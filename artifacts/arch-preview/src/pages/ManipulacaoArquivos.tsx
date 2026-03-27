import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ManipulacaoArquivos() {
  return (
    <PageContainer
      title="Manipulação de Arquivos e Diretórios"
      subtitle="Domine cp, mv, rm, mkdir, touch e ln com explicação completa de cada flag. Do básico ao uso profissional, com exemplos reais do dia a dia no Arch Linux."
      difficulty="iniciante"
      timeToRead="30 min"
    >
      <p>
        No Linux, "tudo é um arquivo". Portanto, saber criar, copiar, mover e deletar arquivos
        via linha de comando é uma habilidade obrigatória. Nesta página, cada flag de cada
        comando é explicada para que você saiba exatamente o que está acontecendo — sem decorar,
        mas entendendo.
      </p>

      <AlertBox type="info" title="O que são flags?">
        <p>
          Flags (ou opções) são letras ou palavras precedidas de hífen que modificam o comportamento
          de um comando. Exemplo: <code>cp -r pasta/ destino/</code> — o <code>-r</code> é uma flag
          que diz "copie recursivamente (incluindo subdiretórios)". Sem ela, o <code>cp</code> se recusaria
          a copiar pastas. Cada flag tem uma função específica e podem ser combinadas: <code>cp -riv</code>
          equivale a <code>cp -r -i -v</code>.
        </p>
      </AlertBox>

      <h2>1. touch — Criar Arquivos Vazios</h2>
      <p>
        O <code>touch</code> cria um arquivo vazio. Se o arquivo já existir, atualiza a data
        de acesso e modificação para o momento atual sem alterar o conteúdo.
      </p>

      <CodeBlock
        title="touch — flags explicadas"
        code={`# Criar um arquivo vazio
touch notas.txt

# Criar vários arquivos de uma vez
touch a.txt b.txt c.txt

# === FLAGS DO touch ===

touch -c arquivo.txt
# -c (--no-create) = não cria o arquivo se ele não existir
#    Útil quando você quer atualizar a data de um arquivo que existe,
#    mas não quer criar um acidentalmente se ele não existir.

touch -a arquivo.txt
# -a (--time=access) = atualiza apenas a data de ACESSO (atime)
#    Não muda a data de modificação (mtime)

touch -m arquivo.txt
# -m (--time=modify) = atualiza apenas a data de MODIFICAÇÃO (mtime)
#    Não muda a data de acesso (atime)

touch -t 202601011200 arquivo.txt
# -t AAAAMMDDHHMM = define data/hora específica
#    202601011200 = 2026-01-01 às 12:00
#    Formatos aceitos: AAMMDDHHMM ou AAAAMMDDHHMMSS

touch -d "2026-01-01 12:00:00" arquivo.txt
# -d (--date) = define data em formato legível por humanos
#    Aceita strings como "yesterday", "1 hour ago", "next Monday"

touch -r modelo.txt alvo.txt
# -r (--reference) = copia a data de outro arquivo para este
#    O alvo.txt vai ter exatamente as mesmas datas que modelo.txt`}
      />

      <AlertBox type="success" title="Uso real do touch">
        <p>O uso mais comum do <code>touch</code> em scripts é criar um arquivo de "flag" ou "lock"
        para indicar que um processo está rodando: <code>touch /tmp/backup.running</code>. Quando
        o processo termina, ele deleta o arquivo. Outros processos verificam se esse arquivo existe
        antes de iniciar.</p>
      </AlertBox>

      <h2>2. mkdir — Criar Diretórios</h2>
      <p>
        O <code>mkdir</code> (Make Directory) cria novos diretórios. Simples de usar, mas com
        flags essenciais para o dia a dia.
      </p>

      <CodeBlock
        title="mkdir — flags explicadas"
        code={`# Criar um diretório simples
mkdir minha_pasta

# Criar múltiplos diretórios de uma vez
mkdir pasta1 pasta2 pasta3

# === FLAGS DO mkdir ===

mkdir -p projetos/2026/janeiro
# -p (--parents) = cria toda a hierarquia de diretórios necessária
#    Se "projetos" não existe, cria "projetos", depois "2026" dentro,
#    depois "janeiro" dentro. Sem -p, daria erro se o pai não existisse.
#    O -p também não dá erro se o diretório já existe (útil em scripts!).

mkdir -v nova_pasta
# -v (--verbose) = mostra o que está sendo feito
#    Saída: mkdir: created directory 'nova_pasta'
#    Útil para confirmar que tudo foi criado

mkdir -m 750 pasta_restrita
# -m MODO (--mode) = define as permissões ao criar
#    750 = dono: rwx, grupo: r-x, outros: ---
#    Equivale a mkdir pasta_restrita && chmod 750 pasta_restrita
#    Mas em um único comando

# Combinação mais usada em scripts:
mkdir -p -v projetos/site/src/components
# -p = cria toda a hierarquia
# -v = mostra tudo que foi criado`}
      />

      <CodeBlock
        title="Estruturas de projeto com mkdir -p"
        code={`# Criar estrutura de projeto de uma vez (padrão profissional)
mkdir -p meu-site/{src/{components,pages,hooks},public,tests}

# O que isso cria:
# meu-site/
# ├── src/
# │   ├── components/
# │   ├── pages/
# │   └── hooks/
# ├── public/
# └── tests/

# Verificar com tree:
tree meu-site
# (instale com: sudo pacman -S tree)`}
      />

      <h2>3. cp — Copiar Arquivos e Diretórios</h2>
      <p>
        O <code>cp</code> (Copy) copia arquivos ou diretórios. Sintaxe: <code>cp [flags] origem destino</code>.
        É um dos comandos mais usados — mas também um dos mais perigosos se usado errado, pois pode
        sobrescrever arquivos sem aviso.
      </p>

      <CodeBlock
        title="cp — flags explicadas uma por uma"
        code={`# Copiar arquivo para outro nome (mesma pasta)
cp foto.jpg foto_backup.jpg

# Copiar arquivo para outro diretório (mantendo o nome)
cp documento.pdf ~/Documentos/

# Copiar múltiplos arquivos para uma pasta
cp doc1.txt doc2.txt ~/Documentos/

# === FLAGS DO cp ===

cp -r pasta_projetos/ backup_projetos/
# -r (--recursive) = copia recursivamente (pastas + todo o conteúdo)
#    OBRIGATÓRIO para copiar diretórios!
#    Sem -r, o cp se recusa a copiar pastas e dá erro.
#    Alternativa: -R (efeito idêntico, maiúsculo ou minúsculo)

cp -i importante.txt ~/backup/
# -i (--interactive) = pergunta antes de sobrescrever arquivos existentes
#    Saída: cp: overwrite '~/backup/importante.txt'? (y/n)
#    y = sim, sobrescreve | n = não, pula
#    Útil para evitar sobrescritas acidentais

cp -v foto.jpg ~/Fotos/
# -v (--verbose) = mostra o que está sendo copiado
#    Saída: 'foto.jpg' -> '~/Fotos/foto.jpg'
#    Bom para confirmar que a cópia foi feita corretamente

cp -p original.sh backup.sh
# -p (--preserve) = preserva atributos do arquivo original:
#    - Data de modificação (mtime)
#    - Permissões (chmod)
#    - Dono e grupo (chown)
#    Sem -p, o arquivo copiado fica com a data atual e suas permissões padrão

cp -a pasta_original/ pasta_backup/
# -a (--archive) = modo "arquivo completo", equivale a -r -p --no-dereference
#    Copia TUDO: conteúdo, permissões, datas, dono, grupo, links simbólicos
#    É o modo correto para backups — não perde nenhuma informação

cp -u arquivo.txt ~/backup/
# -u (--update) = copia apenas se a origem for mais nova que o destino
#    ou se o destino não existir
#    Ótimo para sincronização incremental (não recopiar o que não mudou)

cp -n arquivo.txt ~/destino/
# -n (--no-clobber) = nunca sobrescreve arquivos existentes
#    Diferente de -i (que pergunta), -n simplesmente pula sem avisar

cp -l arquivo.txt link_para_arquivo.txt
# -l (--link) = cria hard links em vez de cópias
#    Hard links apontam para os mesmos dados no disco
#    Economiza espaço (não duplica os dados)

cp -s arquivo.txt link.txt
# -s (--symbolic-link) = cria link simbólico em vez de copiar
#    Equivale a: ln -s arquivo.txt link.txt

cp --backup=numbered arquivo.txt ~/backup/
# --backup = cria backup do arquivo de destino antes de sobrescrever
#    =numbered: nomes como arquivo.txt.~1~, arquivo.txt.~2~, etc.
#    =simple: apenas arquivo.txt~`}
      />

      <CodeBlock
        title="Combinações mais usadas no dia a dia"
        code={`# Copiar pasta inteira preservando tudo (para backup)
cp -av ~/projetos/ ~/backup/projetos/
# -a = preserva tudo (permissões, datas, links)
# -v = mostra o progresso

# Copiar com confirmação antes de sobrescrever
cp -riv fotos_antigas/ fotos_backup/
# -r = recursivo (pastas)
# -i = pergunta antes de sobrescrever
# -v = mostra cada arquivo copiado

# Copiar apenas arquivos modificados (sincronização)
cp -ru ~/projetos/ ~/backup/
# -r = recursivo
# -u = só copia o que é mais novo

# Copiar arquivo protegido (dando erro informativo)
cp -vi /etc/pacman.conf ~/backup/
# -v = verbose
# -i = interativo (pede confirmação se sobrescrever)`}
      />

      <AlertBox type="danger" title="Cuidado: cp sobrescreve sem aviso!">
        <p>Por padrão, <code>cp</code> sobrescreve arquivos existentes no destino sem perguntar.
        Se você copiar <code>foto.jpg</code> para um lugar onde já tem um <code>foto.jpg</code>,
        o arquivo original <strong>é perdido para sempre</strong>. Use <code>-i</code> para
        sempre ser perguntado, ou <code>-n</code> para nunca sobrescrever.</p>
      </AlertBox>

      <h2>4. mv — Mover e Renomear</h2>
      <p>
        O <code>mv</code> (Move) serve para <strong>mover</strong> arquivos para outro diretório
        e para <strong>renomear</strong> (que no Linux é a mesma coisa — mover de "nome A" para "nome B").
        Diferente do <code>cp</code>, o arquivo original some do local de origem.
      </p>

      <CodeBlock
        title="mv — flags explicadas"
        code={`# Renomear um arquivo
mv projeto_velho.txt projeto_novo.txt

# Mover para outro diretório
mv relatorio.pdf ~/Documentos/

# Mover múltiplos arquivos para um diretório
mv *.jpg ~/Fotos/

# Renomear um diretório inteiro
mv pasta_antiga/ pasta_nova/

# === FLAGS DO mv ===

mv -i arquivo.txt ~/backup/
# -i (--interactive) = pergunta antes de sobrescrever
#    Saída: mv: overwrite '~/backup/arquivo.txt'? (y/n)
#    y = confirma a movimentação | n = cancela
#    MUITO recomendado para uso interativo

mv -v relatorio.pdf ~/Documentos/
# -v (--verbose) = mostra o que está sendo movido
#    Saída: renamed 'relatorio.pdf' -> '~/Documentos/relatorio.pdf'
#    Bom para confirmar que o arquivo foi para o lugar certo

mv -n arquivo.txt ~/destino/
# -n (--no-clobber) = não sobrescreve se o destino já existir
#    Pula silenciosamente se o arquivo de destino existir
#    Oposto de sobrescrever — protege o destino

mv -u arquivo.txt ~/backup/
# -u (--update) = move apenas se a origem for mais nova que o destino
#    ou se o arquivo não existir no destino
#    Útil para sincronização: não substitui versões mais recentes

mv -b arquivo.txt ~/backup/
# -b (--backup) = cria backup do arquivo de destino antes de substituir
#    O backup fica com ~ no final: arquivo.txt~
#    Evita perder o arquivo que estava no destino

mv --backup=numbered *.conf ~/backup/
# --backup=numbered = backup com números: arquivo.conf.~1~, arquivo.conf.~2~
#    Permite múltiplos backups sem sobrescrever o anterior

mv -f arquivo.txt ~/destino/
# -f (--force) = força a movimentação, ignorando -i se estiver definido
#    Útil em scripts onde você não quer prompts de confirmação`}
      />

      <CodeBlock
        title="Renomeação em lote (truques práticos)"
        code={`# Renomear adicionando prefixo (usando loop)
for f in *.txt; do mv -v "$f" "2026_$f"; done
# Renomeia: notas.txt → 2026_notas.txt, etc.
# As aspas ao redor de $f protegem nomes com espaços

# Mover todos os .jpg para a pasta Fotos
mv -v *.jpg ~/Fotos/

# Mudar extensão de todos os arquivos
for f in *.txt; do mv -v "$f" "\${f%.txt}.md"; done
# \${f%.txt} remove o sufixo .txt do nome — depois adiciona .md

# Mover arquivo e confirmar
mv -iv relatorio_final.pdf ~/Documentos/
# -i = confirma se sobrescrever | -v = mostra o que foi feito`}
      />

      <h2>5. rm — Remover Arquivos e Diretórios</h2>
      <p>
        O <code>rm</code> (Remove) apaga arquivos e diretórios. <strong>Ele não envia para a lixeira —
        apagou, sumiu para sempre.</strong> É o comando mais perigoso desta página e merece atenção total.
      </p>

      <CodeBlock
        title="rm — flags explicadas"
        code={`# Apagar um arquivo simples
rm arquivo.txt

# Apagar múltiplos arquivos
rm a.txt b.txt c.txt

# Apagar com wildcard (CUIDADO: confirme o que vai ser apagado antes!)
rm *.log

# === FLAGS DO rm ===

rm -i importante.txt
# -i (--interactive) = pergunta antes de apagar CADA arquivo
#    Saída: rm: remove 'importante.txt'? (y/n)
#    y = apaga | n = pula
#    Recomendado sempre que não tiver certeza

rm -I pasta/*
# -I = pergunta uma única vez antes de apagar 3+ arquivos
#    "remove 15 arguments recursively? y/n"
#    Menos verboso que -i mas ainda protege contra acidentes em massa

rm -v arquivo.txt
# -v (--verbose) = mostra o que está sendo apagado
#    Saída: removed 'arquivo.txt'
#    Útil para confirmar o que foi deletado

rm -r pasta_antiga/
# -r (--recursive) = apaga diretório e TODO o seu conteúdo
#    OBRIGATÓRIO para apagar diretórios!
#    Sem -r, o rm se recusa a apagar pastas e dá erro.
#    Alternativa: -R (maiúsculo, efeito idêntico)

rm -f arquivo_protegido.txt
# -f (--force) = força a remoção sem perguntar, mesmo se protegido contra escrita
#    Ignora arquivos que não existem (sem dar erro)
#    NÃO pede confirmação mesmo com -i (cancela o -i)
#    Use com extremo cuidado!

rm -rf pasta_desnecessaria/
# -r = recursivo (apaga pasta + conteúdo)
# -f = força (sem confirmações, sem erros se não existir)
# Combinação MUITO PERIGOSA — apaga tudo sem perguntar nada!
# Confirme DUAS VEZES o caminho antes de usar

rm -d pasta_vazia/
# -d (--dir) = apaga diretórios VAZIOS (sem precisar de -r)
#    Equivale ao rmdir, mas como flag do rm
#    Dá erro se o diretório não estiver vazio`}
      />

      <AlertBox type="danger" title="O infame rm -rf — leia antes de usar">
        <p>O <code>rm -rf</code> apaga tudo recursivamente e à força, sem pedir confirmação.
        É extremamente útil, mas também extremamente destrutivo.</p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Antes de executar:</strong><br/>
          1. Confirme o caminho: <code>ls -la pasta_que_vou_apagar/</code><br/>
          2. Nunca use com variáveis sem testar: se <code>$DIR</code> estiver vazia, <code>rm -rf $DIR/</code>
          vira <code>rm -rf /</code> (destroi o sistema)<br/>
          3. Prefira: <code>rm -riv</code> para ter confirmação e ver o que está sendo apagado
        </p>
      </AlertBox>

      <CodeBlock
        title="Uso seguro do rm no dia a dia"
        code={`# SEGURO: perguntar antes de cada arquivo
rm -iv arquivo.txt

# SEGURO: perguntar antes de apagar uma pasta
rm -riv pasta_antiga/

# PERIGO: apagar silenciosamente — tenha certeza do caminho!
rm -rf /home/usuario/cache/

# VERIFICAR ANTES DE APAGAR (boa prática):
# 1. Liste o que vai apagar:
ls -la *.tmp

# 2. Se parecer certo, apague:
rm -v *.tmp

# Alternativa segura: mover para /tmp antes de apagar definitivamente
mv pasta_suspeita/ /tmp/
# (o /tmp é limpo automaticamente no reboot)

# Encontrar e apagar arquivos com find (mais seguro que wildcard)
find /var/log -name "*.log" -mtime +30
# Primeiro veja o que seria apagado ↑

find /var/log -name "*.log" -mtime +30 -delete
# Agora apague — só arquivos .log com mais de 30 dias`}
      />

      <h3>rmdir — Remover Diretórios Vazios</h3>
      <p>
        O <code>rmdir</code> só apaga diretórios <em>completamente vazios</em>.
        É mais seguro que <code>rm -r</code> pois se recusa a apagar se houver qualquer arquivo dentro.
      </p>

      <CodeBlock
        title="rmdir — flags explicadas"
        code={`# Apagar diretório vazio
rmdir pasta_vazia/

# Apagar múltiplos diretórios vazios
rmdir pasta1/ pasta2/ pasta3/

# === FLAGS DO rmdir ===

rmdir -p projetos/site/src/
# -p (--parents) = apaga a hierarquia toda se todos os níveis estiverem vazios
#    Primeiro apaga src/, depois tenta apagar site/ (se vazio), depois projetos/
#    Se algum nível não estiver vazio, para ali sem dar erro

rmdir -v pasta_vazia/
# -v (--verbose) = mostra o que foi apagado
#    Saída: rmdir: removing directory, 'pasta_vazia/'

rmdir --ignore-fail-on-non-empty pasta/
# --ignore-fail-on-non-empty = não dá erro se o diretório não estiver vazio
#    Simplesmente ignora o diretório com conteúdo e continua
#    Útil em scripts onde você quer tentar limpar sem gerar erros fatais`}
      />

      <h2>6. ln — Criar Links</h2>
      <p>
        O <code>ln</code> (Link) cria links entre arquivos. Existem dois tipos: <strong>links simbólicos</strong>
        (atalhos — apontam para o caminho do arquivo) e <strong>hard links</strong> (apontam diretamente
        para os dados no disco). Em 99% dos casos, você vai querer links simbólicos (<code>-s</code>).
      </p>

      <CodeBlock
        title="Diferença entre hard link e symlink"
        code={`# HARD LINK — aponta para os mesmos dados (mesmo inode no disco)
ln arquivo_real.txt hard_link.txt

# SYMLINK (link simbólico) — atalho que aponta para o caminho do arquivo
ln -s arquivo_real.txt symlink.txt

# Diferença na prática:
ls -li  # O -i mostra o número do inode
# 123456 -rw-r--r-- 2 usuario usuario 1024 jan 15 arquivo_real.txt
# 123456 -rw-r--r-- 2 usuario usuario 1024 jan 15 hard_link.txt
# ← Mesmo inode! São o mesmo arquivo no disco, com dois nomes.

# 789012 lrwxrwxrwx 1 usuario usuario   16 jan 15 symlink.txt -> arquivo_real.txt
# ← Inode diferente. É um atalho. Se mover/apagar o original, quebra.`}
      />

      <CodeBlock
        title="ln — flags explicadas"
        code={`# Criar symlink básico
ln -s /caminho/do/arquivo_real.txt atalho.txt

# Criar symlink para diretório
ln -s /etc/nginx/ ~/nginx-config

# === FLAGS DO ln ===

ln -s arquivo_original.txt atalho.txt
# -s (--symbolic) = cria link SIMBÓLICO (atalho)
#    O mais usado. O link aparece com l no ls -l e mostra o -> destino
#    OBRIGATÓRIO para links de diretórios e para links em sistemas de arquivos diferentes

ln -sf novo_alvo.txt atalho_existente.txt
# -f (--force) = força a criação mesmo se o link já existir
#    Remove o link antigo antes de criar o novo
#    Útil para atualizar links que já existem

ln -sv /etc/nginx/nginx.conf ~/nginx.conf
# -v (--verbose) = mostra o que foi criado
#    Saída: '~/nginx.conf' -> '/etc/nginx/nginx.conf'

ln -sn arquivo.txt link.txt
# -n (--no-dereference) = trata link existente como arquivo normal
#    Útil quando o destino já é um link simbólico

ln -sr ../../arquivo.txt link.txt
# -r (--relative) = cria link com caminho RELATIVO em vez de absoluto
#    Portátil: funciona mesmo que você mova a estrutura de pastas

ln -sb arquivo.txt link.txt
# -b (--backup) = cria backup do link de destino antes de substituir
#    O backup fica com ~ no final: link.txt~`}
      />

      <CodeBlock
        title="Casos de uso reais de symlinks"
        code={`# === USO 1: Configurações centralizadas ===
# Linkar arquivo de configuração do nginx para a pasta "sites-enabled"
sudo ln -s /etc/nginx/sites-available/meusite.conf \\
           /etc/nginx/sites-enabled/meusite.conf

# Para desabilitar o site: rm o link (o original em sites-available fica intacto)
sudo rm /etc/nginx/sites-enabled/meusite.conf

# === USO 2: Múltiplas versões do Python ===
# Ver onde o python3 aponta:
ls -la /usr/bin/python3
# /usr/bin/python3 -> python3.12  (link para a versão atual)

# Trocar a versão padrão:
sudo ln -sf /usr/bin/python3.11 /usr/bin/python3

# === USO 3: Atalho para pasta de projeto ===
ln -s ~/Documentos/projetos/meu-site ~/meu-site
# Agora: cd ~/meu-site  (ao invés de cd ~/Documentos/projetos/meu-site)

# === USO 4: Dotfiles centralizados ===
# Guardar .bashrc em um repositório git e linkar:
ln -sf ~/dotfiles/.bashrc ~/.bashrc
ln -sf ~/dotfiles/.vimrc ~/.vimrc

# === Verificar links quebrados ===
find . -xtype l  # Lista links simbólicos cujo destino não existe mais`}
      />

      <AlertBox type="info" title="Quando usar hard link vs symlink?">
        <ul>
          <li><strong>Symlink:</strong> Para atalhos de arquivos ou diretórios. Pode cruzar sistemas de arquivos (ex: de /home para /mnt). Se o original for movido ou apagado, o link quebra.</li>
          <li><strong>Hard link:</strong> Para criar um segundo nome para o mesmo arquivo. Só funciona no mesmo sistema de arquivos. Não pode linkar diretórios. Se o original for apagado, o hard link continua funcionando (os dados só somem quando o último hard link for removido).</li>
        </ul>
      </AlertBox>

      <h2>7. Tabela de Referência Rápida</h2>
      <CodeBlock
        language="text"
        title="Flags mais usadas de cada comando"
        code={`TOUCH
  touch arquivo.txt        Criar arquivo vazio
  touch -c arquivo.txt     Não criar se não existir
  touch -d "ontem" arq     Definir data específica

MKDIR
  mkdir pasta              Criar diretório
  mkdir -p a/b/c           Criar hierarquia inteira
  mkdir -m 750 pasta       Criar com permissões definidas

CP
  cp -r  pasta/ dest/      Copiar pasta recursivamente
  cp -i  arq dest/         Perguntar antes de sobrescrever
  cp -v  arq dest/         Mostrar o que está sendo copiado
  cp -a  pasta/ backup/    Cópia completa (backup perfeito)
  cp -u  arq dest/         Copiar só se mais novo
  cp -n  arq dest/         Nunca sobrescrever

MV
  mv -i  arq dest/         Perguntar antes de sobrescrever
  mv -v  arq dest/         Mostrar o que está sendo movido
  mv -n  arq dest/         Não sobrescrever existentes
  mv -b  arq dest/         Backup do destino antes de substituir

RM
  rm -i  arquivo           Perguntar antes de apagar
  rm -v  arquivo           Mostrar o que foi apagado
  rm -r  pasta/            Apagar pasta e conteúdo
  rm -f  arquivo           Forçar sem confirmação
  rm -ri pasta/            Recursivo + perguntar (SEGURO)

RMDIR
  rmdir pasta/             Apagar diretório VAZIO
  rmdir -p a/b/c/          Apagar hierarquia vazia

LN
  ln -s  original atalho   Criar link simbólico
  ln -sf original atalho   Criar/substituir link
  ln -sv original atalho   Criar e mostrar o que criou
  ln -sr original atalho   Link com caminho relativo`}
      />
    </PageContainer>
  );
}
