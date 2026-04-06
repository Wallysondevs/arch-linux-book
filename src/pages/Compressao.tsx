import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Compressao() {
  return (
    <PageContainer
      title="Compressão e Arquivamento"
      subtitle="Aprenda a compactar, descompactar e arquivar arquivos no Linux usando tar, gzip, bzip2, xz, zip e 7z."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <h2>Arquivamento vs Compressão</h2>
      <p>
        É importante entender a diferença entre esses dois conceitos:
      </p>
      <ul>
        <li><strong>Arquivamento</strong> — Combinar múltiplos arquivos e diretórios em um único arquivo (ex: <code>tar</code>). Não reduz o tamanho.</li>
        <li><strong>Compressão</strong> — Reduzir o tamanho de um arquivo usando algoritmos (ex: <code>gzip</code>, <code>bzip2</code>, <code>xz</code>).</li>
      </ul>
      <p>
        Na prática, quase sempre usamos os dois juntos: primeiro arquivamos com <code>tar</code>,
        depois comprimimos com um algoritmo.
      </p>

      <h2>tar — O Canivete Suíço</h2>
      <p>
        O <code>tar</code> (Tape ARchive) é a ferramenta fundamental para arquivamento no Linux.
        Ele não comprime por padrão, mas pode chamar compressores automaticamente.
      </p>

      <h3>Flags Principais</h3>
      <CodeBlock
        title="Flags essenciais do tar"
        code={`# Flags de ação (uma obrigatória):
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
--exclude  # Excluir padrões`}
      />

      <h3>Criando Arquivos tar</h3>
      <CodeBlock
        title="Criar arquivos tar com diferentes compressões"
        code={`# Arquivo tar sem compressão
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
tar -czvf backup.tar.gz /home/usuario -X exclusoes.txt`}
      />

      <h3>Extraindo Arquivos tar</h3>
      <CodeBlock
        title="Extrair arquivos tar"
        code={`# Extrair tar simples
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
tar -xzvf backup.tar.gz --wildcards '*.conf'`}
      />

      <h3>Listando Conteúdo</h3>
      <CodeBlock
        title="Ver conteúdo sem extrair"
        code={`# Listar conteúdo de um tar
tar -tvf arquivo.tar

# Listar conteúdo de um tar.gz
tar -tzvf arquivo.tar.gz

# Listar apenas nomes dos arquivos
tar -tf arquivo.tar.gz

# Buscar arquivo específico na listagem
tar -tf backup.tar.gz | grep "pacman.conf"`}
      />

      <AlertBox type="success" title="Dica: tar detecta compressão automaticamente">
        Nas versões modernas do tar, você pode omitir as flags de compressão na extração.
        O comando <code>tar -xvf arquivo.tar.gz</code> funciona sem o <code>-z</code> porque
        o tar detecta o formato automaticamente.
      </AlertBox>

      <h2>gzip / gunzip</h2>
      <p>
        O <code>gzip</code> é o compressor mais comum no Linux. Ele comprime arquivos individuais
        (não diretórios). Oferece bom equilíbrio entre velocidade e compressão.
      </p>
      <CodeBlock
        title="Usando gzip"
        code={`# Comprimir arquivo (SUBSTITUI o original)
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
zgrep "erro" arquivo.txt.gz`}
      />

      <h2>bzip2 / bunzip2</h2>
      <p>
        O <code>bzip2</code> oferece melhor compressão que o gzip, mas é mais lento.
        Ideal para quando o tamanho final importa mais que a velocidade.
      </p>
      <CodeBlock
        title="Usando bzip2"
        code={`# Comprimir (substitui o original)
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
bzcat arquivo.txt.bz2`}
      />

      <h2>xz / unxz</h2>
      <p>
        O <code>xz</code> oferece a melhor taxa de compressão entre os três, mas é o mais lento.
        É o formato padrão usado nos pacotes do Arch Linux (<code>.pkg.tar.zst</code> mais recentemente,
        mas <code>.tar.xz</code> ainda é muito comum).
      </p>
      <CodeBlock
        title="Usando xz"
        code={`# Comprimir
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
xzcat arquivo.txt.xz`}
      />

      <h3>Comparação de Compressores</h3>
      <CodeBlock
        title="Comparação geral"
        language="text"
        code={`Compressor  | Extensão   | Velocidade | Compressão | Uso de RAM
------------|------------|------------|------------|----------
gzip        | .gz        | Rápido     | Boa        | Baixo
bzip2       | .bz2       | Médio      | Melhor     | Médio
xz          | .xz        | Lento      | Excelente  | Alto
zstd        | .zst       | Muito rápido | Muito boa | Médio`}
      />

      <AlertBox type="info" title="zstd — O compressor moderno">
        O <code>zstd</code> (Zstandard) é um compressor relativamente novo desenvolvido pelo Facebook.
        Ele oferece compressão comparável ao xz com velocidade próxima ao gzip. O Arch Linux
        usa <code>.pkg.tar.zst</code> para seus pacotes por esse motivo.
        Instale com <code>sudo pacman -S zstd</code>.
      </AlertBox>

      <h2>zip / unzip</h2>
      <p>
        O <code>zip</code> é o formato mais comum no Windows. No Linux, é útil quando você precisa
        compartilhar arquivos com usuários de Windows ou trabalhar com arquivos recebidos neste formato.
      </p>
      <CodeBlock
        title="Usando zip"
        code={`# Instalar (pode não vir pré-instalado)
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
unzip -t arquivo.zip`}
      />

      <h2>7z (p7zip)</h2>
      <p>
        O 7-Zip oferece excelente compressão e suporta vários formatos. Útil para
        compatibilidade com Windows e para quando você precisa da melhor compressão possível.
      </p>
      <CodeBlock
        title="Usando 7z"
        code={`# Instalar
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
7z x arquivo.cab`}
      />

      <h2>Exemplos Práticos do Dia a Dia</h2>
      <CodeBlock
        title="Cenários comuns"
        code={`# Fazer backup do home excluindo cache
tar -czvf backup_home.tar.gz \\
    --exclude='.cache' \\
    --exclude='.local/share/Trash' \\
    --exclude='node_modules' \\
    --exclude='.npm' \\
    /home/usuario/

# Backup com data no nome
tar -czvf "backup_\$(date +%Y%m%d_%H%M%S).tar.gz" documentos/

# Transferir diretório entre máquinas via SSH
tar -czf - /home/usuario/projeto | ssh servidor 'tar -xzf - -C /backup/'

# Descomprimir arquivo que não sei o formato
file arquivo_misterioso.xyz    # Identifica o tipo real

# Verificar espaço antes de extrair
tar -tzvf arquivo.tar.gz | awk '{sum+=$3} END {print sum/1024/1024 " MB"}'`}
      />

      <AlertBox type="warning" title="Cuidado com tar como root">
        Ao extrair um tar como root, os arquivos serão criados com as permissões e donos originais.
        Use <code>--no-same-owner</code> se não quiser manter o dono original, ou
        <code>--no-same-permissions</code> para ignorar permissões do arquivo.
      </AlertBox>

      <AlertBox type="danger" title="Tar bombs">
        Sempre verifique o conteúdo de um arquivo tar antes de extrair com <code>tar -tf arquivo.tar.gz</code>.
        Alguns arquivos maliciosos não têm um diretório raiz e despejam centenas de arquivos no diretório atual,
        criando uma bagunça conhecida como "tar bomb". Extraia sempre em um diretório temporário quando
        não tiver certeza do conteúdo.
      </AlertBox>
    </PageContainer>
  );
}
