import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function ManipulacaoArquivos() {
  return (
    <PageContainer
      title="Manipulação de Arquivos e Diretórios"
      subtitle="Domine touch, mkdir, cp, mv, rm e ln com saída real de cada flag (-v mostra TUDO). Do básico ao uso profissional, com proteções contra acidentes."
      difficulty="iniciante"
      timeToRead="40 min"
    >
      <p>
        No Linux, "tudo é um arquivo". Saber criar, copiar, mover e deletar via linha de comando é
        obrigatório. Aqui, todo comando aparece com a saída <strong>real</strong> que ele produz quando
        rodado com <code>-v</code> (verbose) — assim você nunca fica em dúvida se o comando funcionou.
      </p>

      <AlertBox type="info" title="Sobre flags">
        Flags são letras precedidas de <code>-</code> que modificam o comando. <code>cp -r</code> copia
        recursivamente. Podem ser combinadas: <code>cp -riv</code> ≡ <code>cp -r -i -v</code>. Quase
        todos os comandos desta página têm <code>-v</code> (verbose), <code>-i</code> (interativo) e
        <code>-f</code> (force) — combine para ter segurança e feedback.
      </AlertBox>

      <h2>1. <code>touch</code> — Criar arquivos vazios</h2>
      <p>
        Cria um arquivo vazio. Se o arquivo existe, atualiza atime/mtime para "agora" sem mudar o conteúdo.
      </p>

      <TerminalBlock
        title="touch — sem saída em sucesso"
        lines={[
          { type: "command", text: "touch notas.txt" },
          { type: "command", text: "ls -l notas.txt" },
          { type: "output", text: "-rw-r--r-- 1 user user 0 Jan 15 10:30 notas.txt" },
          { type: "comment", text: "0 bytes — arquivo vazio criado. touch só fala se houver erro." },
        ]}
      />

      <TerminalBlock
        title="touch -v — mostra exatamente o que foi feito (GNU coreutils)"
        lines={[
          { type: "command", text: "touch -v a.txt b.txt c.txt" },
          { type: "output", text: `touch: setting times of 'a.txt'\ntouch: setting times of 'b.txt'\ntouch: setting times of 'c.txt'` },
          { type: "comment", text: "Em alguns sistemas, -v é silencioso. Mas em Arch (GNU coreutils), imprime cada arquivo." },
        ]}
      />

      <TerminalBlock
        title="touch -c — não cria se NÃO existir"
        lines={[
          { type: "command", text: "ls naoexiste.txt" },
          { type: "output", text: `ls: cannot access 'naoexiste.txt': No such file or directory` },
          { type: "command", text: "touch -c naoexiste.txt" },
          { type: "command", text: "ls naoexiste.txt" },
          { type: "output", text: `ls: cannot access 'naoexiste.txt': No such file or directory` },
          { type: "comment", text: "-c suprime a criação. Útil para apenas atualizar mtime de arquivos existentes." },
        ]}
      />

      <TerminalBlock
        title="touch -d e -t — definir data/hora arbitrária"
        lines={[
          { type: "command", text: `touch -d "2020-06-15 14:30:00" antigo.txt` },
          { type: "command", text: "ls -l antigo.txt" },
          { type: "output", text: "-rw-r--r-- 1 user user 0 Jun 15  2020 antigo.txt" },
          { type: "command", text: "touch -t 202601011200 futuro.txt" },
          { type: "command", text: "ls -l futuro.txt" },
          { type: "output", text: "-rw-r--r-- 1 user user 0 Jan  1  2026 futuro.txt" },
        ]}
      />

      <TerminalBlock
        title="touch -r — copiar timestamp de outro arquivo"
        lines={[
          { type: "command", text: "ls -l --time-style=long-iso modelo.txt alvo.txt" },
          { type: "output", text: "-rw-r--r-- 1 user user 120 2024-03-08 11:15 modelo.txt\n-rw-r--r-- 1 user user   0 2025-01-15 10:30 alvo.txt" },
          { type: "command", text: "touch -r modelo.txt alvo.txt" },
          { type: "command", text: "ls -l --time-style=long-iso modelo.txt alvo.txt" },
          { type: "output", text: "-rw-r--r-- 1 user user 120 2024-03-08 11:15 modelo.txt\n-rw-r--r-- 1 user user   0 2024-03-08 11:15 alvo.txt" },
          { type: "comment", text: "alvo.txt agora tem o mesmo timestamp do modelo.txt" },
        ]}
      />

      <CommandFlagList
        command="touch"
        items={[
          { flag: "-c", long: "--no-create", description: "Não cria o arquivo se ele não existir.", example: "touch -c arq" },
          { flag: "-a", description: "Atualiza apenas atime (acesso).", example: "touch -a arq" },
          { flag: "-m", description: "Atualiza apenas mtime (modificação).", example: "touch -m arq" },
          { flag: "-d STRING", long: "--date", description: `Data legível: "yesterday", "1 hour ago", "2025-01-01 12:00".`, example: `touch -d "yesterday" arq` },
          { flag: "-t STAMP", description: "Formato [[CC]YY]MMDDhhmm[.ss]. Ex: 202601011200.", example: "touch -t 202601011200 arq" },
          { flag: "-r REF", long: "--reference", description: "Copia o timestamp de outro arquivo.", example: "touch -r ref alvo" },
        ]}
      />

      <h2>2. <code>mkdir</code> — Criar diretórios</h2>

      <TerminalBlock
        title="mkdir — criar uma pasta"
        lines={[
          { type: "command", text: "mkdir minha_pasta" },
          { type: "command", text: "ls -ld minha_pasta" },
          { type: "output", text: "drwxr-xr-x 2 user user 4096 Jan 15 10:35 minha_pasta" },
        ]}
      />

      <TerminalBlock
        title="mkdir SEM -p falha se o pai não existir"
        lines={[
          { type: "command", text: "mkdir projetos/2026/janeiro" },
          { type: "error", text: `mkdir: cannot create directory 'projetos/2026/janeiro': No such file or directory` },
        ]}
      />

      <TerminalBlock
        title="mkdir -pv — cria toda a hierarquia, com saída"
        command="mkdir -pv projetos/2026/janeiro"
        output={`mkdir: created directory 'projetos'
mkdir: created directory 'projetos/2026'
mkdir: created directory 'projetos/2026/janeiro'`}
      />

      <TerminalBlock
        title="-p também NÃO dá erro se o diretório já existe (perfeito para scripts)"
        lines={[
          { type: "command", text: "mkdir minha_pasta" },
          { type: "error", text: `mkdir: cannot create directory 'minha_pasta': File exists` },
          { type: "command", text: "mkdir -p minha_pasta" },
          { type: "comment", text: "(sem saída — sucesso silencioso, exit code 0)" },
        ]}
      />

      <TerminalBlock
        title="mkdir -m — definir permissões na criação"
        lines={[
          { type: "command", text: "mkdir -m 750 -v pasta_restrita" },
          { type: "output", text: `mkdir: created directory 'pasta_restrita'` },
          { type: "command", text: "ls -ld pasta_restrita" },
          { type: "output", text: "drwxr-x--- 2 user user 4096 Jan 15 10:36 pasta_restrita" },
          { type: "comment", text: "750 = dono rwx, grupo r-x, outros nada — equivale a chmod 750 depois" },
        ]}
      />

      <TerminalBlock
        title="Brace expansion + mkdir -p — estrutura inteira em um comando"
        lines={[
          { type: "command", text: `mkdir -pv meu-site/{src/{components,pages,hooks},public,tests}` },
          { type: "output", text: `mkdir: created directory 'meu-site'\nmkdir: created directory 'meu-site/src'\nmkdir: created directory 'meu-site/src/components'\nmkdir: created directory 'meu-site/src/pages'\nmkdir: created directory 'meu-site/src/hooks'\nmkdir: created directory 'meu-site/public'\nmkdir: created directory 'meu-site/tests'` },
          { type: "command", text: "tree meu-site" },
          { type: "output", text: `meu-site\n├── public\n├── src\n│   ├── components\n│   ├── hooks\n│   └── pages\n└── tests\n\n6 directories, 0 files` },
        ]}
      />

      <CommandFlagList
        command="mkdir"
        items={[
          { flag: "-p", long: "--parents", description: "Cria diretórios pais conforme necessário, e não falha se já existir.", example: "mkdir -p a/b/c" },
          { flag: "-v", long: "--verbose", description: "Mostra cada diretório criado.", example: "mkdir -pv a/b/c" },
          { flag: "-m MODO", long: "--mode", description: "Define permissões na criação (octal ou simbólico).", example: "mkdir -m 750 priv" },
        ]}
      />

      <h2>3. <code>cp</code> — Copiar arquivos e diretórios</h2>
      <p>
        Sintaxe: <code>cp [flags] origem destino</code>. Por padrão, <strong>sobrescreve o destino sem
        avisar</strong> — sempre use <code>-i</code> ou <code>-n</code> em uso interativo.
      </p>

      <TerminalBlock
        title="cp — copiar arquivo simples (sem saída em sucesso)"
        lines={[
          { type: "command", text: "cp foto.jpg foto_backup.jpg" },
          { type: "command", text: "ls -l foto*.jpg" },
          { type: "output", text: "-rw-r--r-- 1 user user 245678 Jan 15 10:40 foto.jpg\n-rw-r--r-- 1 user user 245678 Jan 15 10:40 foto_backup.jpg" },
        ]}
      />

      <TerminalBlock
        title="cp -v — mostra cada cópia com seta '->'"
        command="cp -v doc1.txt doc2.txt ~/Documents/"
        output={`'doc1.txt' -> '/home/user/Documents/doc1.txt'
'doc2.txt' -> '/home/user/Documents/doc2.txt'`}
      />

      <TerminalBlock
        title="cp pasta/ destino — SEM -r dá erro"
        lines={[
          { type: "command", text: "cp projetos/ backup/" },
          { type: "error", text: "cp: -r not specified; omitting directory 'projetos/'" },
        ]}
      />

      <TerminalBlock
        title="cp -rv — copiar pasta recursivamente, com saída por arquivo"
        command="cp -rv projetos/ backup/"
        output={`'projetos/' -> 'backup/'
'projetos/site' -> 'backup/site'
'projetos/site/package.json' -> 'backup/site/package.json'
'projetos/site/src' -> 'backup/site/src'
'projetos/site/src/main.tsx' -> 'backup/site/src/main.tsx'
'projetos/site/src/components' -> 'backup/site/src/components'
'projetos/site/src/components/Header.tsx' -> 'backup/site/src/components/Header.tsx'
'projetos/api' -> 'backup/api'
'projetos/api/server.js' -> 'backup/api/server.js'
'projetos/api/package.json' -> 'backup/api/package.json'`}
      />

      <TerminalBlock
        title="cp -i — pergunta antes de sobrescrever"
        lines={[
          { type: "command", text: "cp -i importante.txt ~/backup/" },
          { type: "output", text: `cp: overwrite '/home/user/backup/importante.txt'? y` },
          { type: "comment", text: "y/Y = sim; qualquer outra coisa = não. -n nunca sobrescreve, sem perguntar." },
        ]}
      />

      <TerminalBlock
        title="cp -av — backup PERFEITO (preserva tudo, mostra tudo)"
        command="cp -av ~/projetos/ ~/backup/projetos/"
        output={`'/home/user/projetos/' -> '/home/user/backup/projetos/'
'/home/user/projetos/site' -> '/home/user/backup/projetos/site'
'/home/user/projetos/site/.git' -> '/home/user/backup/projetos/site/.git'
'/home/user/projetos/site/package.json' -> '/home/user/backup/projetos/site/package.json'
'/home/user/projetos/site/src' -> '/home/user/backup/projetos/site/src'
'/home/user/projetos/site/src/main.tsx' -> '/home/user/backup/projetos/site/src/main.tsx'
'/home/user/projetos/site/src/components' -> '/home/user/backup/projetos/site/src/components'
'/home/user/projetos/site/src/components/Header.tsx' -> '/home/user/backup/projetos/site/src/components/Header.tsx'`}
        comment="-a = -dR --preserve=all → preserva permissões, datas, dono, links simbólicos, atributos estendidos"
      />

      <TerminalBlock
        title="cp -u — só copia se origem for MAIS NOVA (sincronização incremental)"
        lines={[
          { type: "command", text: "cp -uv *.txt ~/backup/" },
          { type: "output", text: `'novo.txt' -> '/home/user/backup/novo.txt'\n'modificado.txt' -> '/home/user/backup/modificado.txt'` },
          { type: "comment", text: "arquivos com mtime igual ou mais antigo no destino são SILENCIOSAMENTE pulados" },
        ]}
      />

      <CommandFlagList
        command="cp"
        items={[
          { flag: "-r", long: "--recursive", description: "Copia diretórios recursivamente. OBRIGATÓRIO para pastas.", example: "cp -r src/ dest/" },
          { flag: "-i", long: "--interactive", description: "Pergunta antes de sobrescrever.", example: "cp -i a b" },
          { flag: "-n", long: "--no-clobber", description: "Nunca sobrescreve (silenciosamente pula).", example: "cp -n a b" },
          { flag: "-v", long: "--verbose", description: "Imprime cada arquivo copiado.", example: "cp -v a b" },
          { flag: "-p", long: "--preserve", description: "Preserva mtime, permissões, dono.", example: "cp -p a b" },
          { flag: "-a", long: "--archive", description: "Modo arquivo: -dR --preserve=all. Backup perfeito.", example: "cp -av src/ bk/" },
          { flag: "-u", long: "--update", description: "Copia apenas se origem for mais nova ou destino não existir.", example: "cp -u a b" },
          { flag: "-l", long: "--link", description: "Cria hard links em vez de copiar (economiza espaço).", example: "cp -l a b" },
          { flag: "-s", long: "--symbolic-link", description: "Cria symlinks em vez de copiar.", example: "cp -s a b" },
          { flag: "--backup=TIPO", description: "Faz backup do destino antes de sobrescrever (numbered, simple).", example: "cp --backup=numbered a b" },
        ]}
      />

      <AlertBox type="danger" title="cp sobrescreve sem aviso por padrão">
        Em uso interativo, sempre adicione <code>-i</code> ou <code>-n</code>. Em scripts, prefira
        <code>-n</code> para não destruir dados existentes acidentalmente. Para backups, use
        <code>cp -av</code> (preserva tudo, verbose).
      </AlertBox>

      <h2>4. <code>mv</code> — Mover e renomear</h2>
      <p>
        No Linux, renomear é a mesma operação que mover (apenas o caminho destino muda).
        O <code>mv</code> também sobrescreve sem aviso por padrão.
      </p>

      <TerminalBlock
        title="mv — renomear (sem saída em sucesso)"
        lines={[
          { type: "command", text: "mv projeto_velho.txt projeto_novo.txt" },
          { type: "command", text: "ls projeto_*" },
          { type: "output", text: "projeto_novo.txt" },
        ]}
      />

      <TerminalBlock
        title="mv -v — mostra a operação com 'renamed ... ->'"
        command="mv -v relatorio.pdf ~/Documents/"
        output={`renamed 'relatorio.pdf' -> '/home/user/Documents/relatorio.pdf'`}
      />

      <TerminalBlock
        title="mv múltiplos arquivos para um diretório"
        command="mv -v *.jpg ~/Pictures/"
        output={`renamed 'foto1.jpg' -> '/home/user/Pictures/foto1.jpg'
renamed 'foto2.jpg' -> '/home/user/Pictures/foto2.jpg'
renamed 'foto3.jpg' -> '/home/user/Pictures/foto3.jpg'
renamed 'screenshot.jpg' -> '/home/user/Pictures/screenshot.jpg'`}
      />

      <TerminalBlock
        title="mv -i — confirmação antes de sobrescrever"
        lines={[
          { type: "command", text: "mv -i config.yml ~/backup/" },
          { type: "output", text: `mv: overwrite '/home/user/backup/config.yml'? n` },
          { type: "comment", text: "n = não sobrescreveu; o arquivo de origem permanece" },
        ]}
      />

      <TerminalBlock
        title="mv -b — fazer backup antes de sobrescrever"
        lines={[
          { type: "command", text: "mv -bv config.yml ~/backup/" },
          { type: "output", text: `renamed '/home/user/backup/config.yml' -> '/home/user/backup/config.yml~'\nrenamed 'config.yml' -> '/home/user/backup/config.yml'` },
          { type: "command", text: "ls ~/backup/config*" },
          { type: "output", text: `/home/user/backup/config.yml  /home/user/backup/config.yml~` },
          { type: "comment", text: "o destino antigo virou config.yml~ e o novo tomou seu lugar" },
        ]}
      />

      <TerminalBlock
        title="Renomear em lote com loop bash"
        lines={[
          { type: "command", text: `for f in *.txt; do mv -v "$f" "2026_$f"; done` },
          { type: "output", text: `renamed 'a.txt' -> '2026_a.txt'\nrenamed 'b.txt' -> '2026_b.txt'\nrenamed 'notas.txt' -> '2026_notas.txt'` },
        ]}
      />

      <CommandFlagList
        command="mv"
        items={[
          { flag: "-i", long: "--interactive", description: "Pergunta antes de sobrescrever.", example: "mv -i a b" },
          { flag: "-n", long: "--no-clobber", description: "Nunca sobrescreve.", example: "mv -n a b" },
          { flag: "-f", long: "--force", description: "Força (sobrescreve sem perguntar — anula -i).", example: "mv -f a b" },
          { flag: "-v", long: "--verbose", description: "Mostra cada renomeação.", example: "mv -v a b" },
          { flag: "-u", long: "--update", description: "Move apenas se origem mais nova ou destino não existe.", example: "mv -u a b" },
          { flag: "-b", long: "--backup", description: "Faz backup do destino antes de sobrescrever (com ~).", example: "mv -b a b" },
        ]}
      />

      <h2>5. <code>rm</code> — Remover (sem lixeira!)</h2>
      <p>
        O <code>rm</code> apaga definitivamente — não há lixeira. Sem flags certas, é o comando mais
        perigoso desta página. Use <code>-i</code> ou <code>-I</code> para se proteger.
      </p>

      <TerminalBlock
        title="rm — sem saída em sucesso"
        lines={[
          { type: "command", text: "rm arquivo.txt" },
          { type: "command", text: "ls arquivo.txt" },
          { type: "output", text: `ls: cannot access 'arquivo.txt': No such file or directory` },
        ]}
      />

      <TerminalBlock
        title="rm -v — mostra cada remoção"
        command={`rm -v *.tmp`}
        output={`removed 'cache.tmp'
removed 'session.tmp'
removed 'upload-9821.tmp'`}
      />

      <TerminalBlock
        title="rm em diretório SEM -r dá erro"
        lines={[
          { type: "command", text: "rm pasta_antiga/" },
          { type: "error", text: `rm: cannot remove 'pasta_antiga/': Is a directory` },
        ]}
      />

      <TerminalBlock
        title="rm -rv — recursivo + verbose (recomendado)"
        command="rm -rv pasta_antiga/"
        output={`removed 'pasta_antiga/sub/file.txt'
removed 'pasta_antiga/sub/old.log'
removed directory 'pasta_antiga/sub'
removed 'pasta_antiga/readme.md'
removed directory 'pasta_antiga'`}
      />

      <TerminalBlock
        title="rm -i — pergunta CADA arquivo (mais seguro)"
        lines={[
          { type: "command", text: "rm -iv *.log" },
          { type: "output", text: `rm: remove regular file 'app.log'? y\nremoved 'app.log'\nrm: remove regular file 'error.log'? n\nrm: remove regular file 'access.log'? y\nremoved 'access.log'` },
        ]}
      />

      <TerminalBlock
        title="rm -I — pergunta UMA vez se for 3+ arquivos (menos chato)"
        lines={[
          { type: "command", text: "rm -I *.tmp" },
          { type: "output", text: `rm: remove 12 arguments? y` },
          { type: "comment", text: "-I é um meio-termo seguro entre nada e -i. Recomendado em aliases." },
        ]}
      />

      <TerminalBlock
        title="rm -rf — apagar tudo SEM confirmar (perigoso!)"
        lines={[
          { type: "command", text: "rm -rf /tmp/build_cache/" },
          { type: "comment", text: "(sem saída — silencioso. Use -v se quiser ver o que foi destruído)" },
        ]}
      />

      <CommandFlagList
        command="rm"
        items={[
          { flag: "-r", long: "--recursive", description: "Remove diretórios recursivamente.", example: "rm -r dir/" },
          { flag: "-f", long: "--force", description: "Sem prompt; ignora arquivos inexistentes.", example: "rm -f arq" },
          { flag: "-i", description: "Pergunta antes de CADA remoção.", example: "rm -i *.txt" },
          { flag: "-I", description: "Pergunta UMA vez se forem 3+ arquivos ou recursivo.", example: "rm -I dir/" },
          { flag: "-v", long: "--verbose", description: "Mostra cada remoção.", example: "rm -v arq" },
          { flag: "-d", long: "--dir", description: "Remove diretórios vazios (como rmdir).", example: "rm -d vazio/" },
          { flag: "--preserve-root", description: "Recusa-se a apagar '/' (padrão na maioria das distros).", example: "rm -rf --preserve-root /" },
        ]}
      />

      <AlertBox type="danger" title="O infame rm -rf — leia antes de digitar">
        <ul>
          <li><strong>Confirme o caminho com <code>ls -la</code> antes</strong> de qualquer <code>rm -rf</code>.</li>
          <li>Nunca use com variáveis sem testar: se <code>$DIR</code> estiver vazia, <code>rm -rf $DIR/</code> vira <code>rm -rf /</code> (destrói o sistema). Sempre cite: <code>rm -rf "$DIR"/</code> e valide com <code>[ -n "$DIR" ]</code> antes.</li>
          <li>Prefira <code>rm -rIv</code> em uso interativo: confirma uma vez e mostra o que apagou.</li>
          <li>Para "lixeira de verdade", instale <code>trash-cli</code> (<code>sudo pacman -S trash-cli</code>) e use <code>trash</code> em vez de <code>rm</code>.</li>
        </ul>
      </AlertBox>

      <h3><code>rmdir</code> — Apenas diretórios vazios</h3>

      <TerminalBlock
        title="rmdir — só apaga se ESTIVER vazio"
        lines={[
          { type: "command", text: "rmdir -v pasta_vazia/" },
          { type: "output", text: `rmdir: removing directory, 'pasta_vazia/'` },
          { type: "command", text: "rmdir pasta_com_conteudo/" },
          { type: "error", text: `rmdir: failed to remove 'pasta_com_conteudo/': Directory not empty` },
        ]}
      />

      <TerminalBlock
        title="rmdir -p — apaga toda a hierarquia se TODOS os níveis estiverem vazios"
        command="rmdir -pv projetos/2026/janeiro"
        output={`rmdir: removing directory, 'projetos/2026/janeiro'
rmdir: removing directory, 'projetos/2026'
rmdir: removing directory, 'projetos'`}
      />

      <h2>6. <code>ln</code> — Criar links</h2>
      <p>
        Existem dois tipos de link: <strong>hard link</strong> (mesmo inode, mesmo conteúdo no disco) e
        <strong> symlink</strong> (atalho que aponta para um caminho). 99% das vezes você quer symlink (<code>-s</code>).
      </p>

      <TerminalBlock
        title="Diferença visual com ls -li"
        lines={[
          { type: "command", text: "echo 'conteudo original' > original.txt" },
          { type: "command", text: "ln original.txt hard_link.txt" },
          { type: "command", text: "ln -s original.txt sym_link.txt" },
          { type: "command", text: "ls -li *.txt" },
          { type: "output", text: `1310741 -rw-r--r-- 2 user user 18 Jan 15 11:00 hard_link.txt
1310741 -rw-r--r-- 2 user user 18 Jan 15 11:00 original.txt
1310742 lrwxrwxrwx 1 user user 12 Jan 15 11:00 sym_link.txt -> original.txt` },
        ]}
      />

      <OutputBlock
        title="Lendo a saída acima"
        output={`1310741 -rw-r--r-- 2 user user 18 hard_link.txt
1310741 -rw-r--r-- 2 user user 18 original.txt
1310742 lrwxrwxrwx 1 user user 12 sym_link.txt -> original.txt`}
        annotations={[
          { line: 0, note: "MESMO inode, link count = 2" },
          { line: 1, note: "MESMO inode — fisicamente o mesmo arquivo" },
          { line: 2, note: "outro inode, tipo 'l', mostra o destino" },
        ]}
      />

      <TerminalBlock
        title="ln -sv — criar symlink com saída"
        command="ln -sv /etc/nginx/nginx.conf ~/nginx.conf"
        output={`'/home/user/nginx.conf' -> '/etc/nginx/nginx.conf'`}
      />

      <TerminalBlock
        title="ln -sf — substitui um symlink existente atomicamente"
        lines={[
          { type: "command", text: "ls -l ~/.bashrc" },
          { type: "output", text: `lrwxrwxrwx 1 user user 28 Jan 10 11:00 /home/user/.bashrc -> /home/user/dotfiles/bashrc.v1` },
          { type: "command", text: "ln -sfv /home/user/dotfiles/bashrc.v2 ~/.bashrc" },
          { type: "output", text: `'/home/user/.bashrc' -> '/home/user/dotfiles/bashrc.v2'` },
          { type: "comment", text: "Sem -f, o ln daria erro 'File exists'. Com -f, ele remove o link antigo e cria o novo." },
        ]}
      />

      <TerminalBlock
        title="Symlink quebrado — destino sumiu"
        lines={[
          { type: "command", text: "ln -s /tmp/temporario link_quebrado" },
          { type: "command", text: "rm /tmp/temporario" },
          { type: "command", text: "ls -l link_quebrado" },
          { type: "output", text: `lrwxrwxrwx 1 user user 14 Jan 15 11:05 link_quebrado -> /tmp/temporario` },
          { type: "command", text: "cat link_quebrado" },
          { type: "error", text: `cat: link_quebrado: No such file or directory` },
          { type: "command", text: "find . -xtype l" },
          { type: "output", text: "./link_quebrado" },
          { type: "comment", text: "find -xtype l lista todos os symlinks com destino inexistente" },
        ]}
      />

      <CommandFlagList
        command="ln"
        items={[
          { flag: "-s", long: "--symbolic", description: "Cria link SIMBÓLICO (a versão que você quase sempre usa).", example: "ln -s alvo link" },
          { flag: "-f", long: "--force", description: "Remove o destino antes de criar (substitui).", example: "ln -sf alvo link" },
          { flag: "-v", long: "--verbose", description: "Mostra o link criado.", example: "ln -sv alvo link" },
          { flag: "-r", long: "--relative", description: "Cria symlink com caminho RELATIVO em vez de absoluto.", example: "ln -srv ../alvo link" },
          { flag: "-n", long: "--no-dereference", description: "Trata destino existente como arquivo (não desce em symlink-pra-diretório).", example: "ln -sfn novo link" },
          { flag: "-i", long: "--interactive", description: "Pergunta antes de sobrescrever.", example: "ln -si alvo link" },
          { flag: "-b", long: "--backup", description: "Faz backup do destino antes de sobrescrever.", example: "ln -sb alvo link" },
        ]}
      />

      <h3>Casos reais de uso de symlinks</h3>

      <TerminalBlock
        title="Habilitar/desabilitar site do nginx (padrão sites-available/sites-enabled)"
        lines={[
          { type: "command", text: "sudo ln -sv /etc/nginx/sites-available/meusite.conf /etc/nginx/sites-enabled/" },
          { type: "output", text: `'/etc/nginx/sites-enabled/meusite.conf' -> '/etc/nginx/sites-available/meusite.conf'` },
          { type: "command", text: "sudo nginx -t && sudo systemctl reload nginx" },
          { type: "output", text: `nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful` },
          { type: "comment", text: "Para desabilitar: sudo rm /etc/nginx/sites-enabled/meusite.conf (o original em sites-available fica intacto)" },
        ]}
      />

      <TerminalBlock
        title="Trocar a versão padrão do Python"
        lines={[
          { type: "command", text: "ls -l /usr/bin/python" },
          { type: "output", text: `lrwxrwxrwx 1 root root 9 Jan 1 00:00 /usr/bin/python -> python3.12` },
          { type: "command", text: "sudo ln -sfv python3.11 /usr/bin/python" },
          { type: "output", text: `'/usr/bin/python' -> 'python3.11'` },
          { type: "command", text: "python --version" },
          { type: "output", text: "Python 3.11.10" },
        ]}
      />

      <AlertBox type="info" title="Hard link vs Symlink — quando usar cada um?">
        <ul>
          <li><strong>Symlink</strong> (<code>ln -s</code>): atalho. Funciona com diretórios, atravessa filesystems, mas quebra se o destino sumir. Use para configurações, dotfiles, "versão atual" de algo.</li>
          <li><strong>Hard link</strong> (<code>ln</code> sem flag): segundo nome para o mesmo inode. Não funciona com diretórios, não atravessa filesystems. Continua funcionando se o original for apagado. Use para deduplicação (ex: <code>rsync --link-dest</code> em backups incrementais).</li>
        </ul>
      </AlertBox>

      <h2>Tabela de Referência Rápida</h2>
      <CodeBlock
        title="Flags mais usadas de cada comando"
        language="text"
        code={`TOUCH
  touch arq            Criar arquivo vazio
  touch -c arq         Não criar se não existir
  touch -d "ontem" arq Definir data específica
  touch -r ref alvo    Copiar timestamp de outro arquivo

MKDIR
  mkdir pasta              Criar
  mkdir -pv a/b/c          Criar hierarquia inteira (verbose)
  mkdir -m 750 priv        Criar com permissões definidas

CP  (origem destino)
  cp -rv  src/ dest/       Copiar pasta recursivamente, mostrando
  cp -i   a b              Perguntar antes de sobrescrever
  cp -av  pasta/ backup/   BACKUP PERFEITO (preserva tudo)
  cp -u   a b              Copiar só se origem mais nova
  cp -n   a b              Nunca sobrescrever

MV
  mv -iv  a b              Mostrar + perguntar antes
  mv -v   *.jpg ~/Pics/    Mover múltiplos
  mv -bv  a b              Backup do destino antes

RM
  rm  -v   arq             Apagar mostrando
  rm  -i   *.txt           Perguntar cada um
  rm  -I   dir/*           Perguntar uma vez (se 3+)
  rm  -rv  pasta/          Recursivo + verbose (RECOMENDADO)
  rm  -rf  /tmp/cache/     Forçar sem perguntar (CUIDADO!)
  rmdir pasta/             Só se VAZIO

LN
  ln -sv   alvo link       Criar symlink (mostrando)
  ln -sfv  alvo link       Substituir symlink existente
  ln -sr   alvo link       Symlink com caminho relativo
  find . -xtype l          Listar symlinks quebrados`}
      />

      <AlertBox type="success" title="Próximos passos">
        Você já sabe navegar, visualizar e manipular arquivos. Próximo passo: entender a hierarquia
        de diretórios do Linux (FHS) e o sistema de permissões (rwx, chmod, chown). Veja as páginas
        de Sistema de Arquivos e Permissões.
      </AlertBox>
    </PageContainer>
  );
}
