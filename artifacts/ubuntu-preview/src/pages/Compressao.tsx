import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Compressao() {
  return (
    <PageContainer
      title="Compressão e Arquivamento"
      subtitle="tar, gzip, bzip2, xz, zip, zstd — comprimindo, descomprimindo e gerenciando arquivos no Ubuntu."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Compressão é essencial para economizar espaço em disco, transferir arquivos pela
        rede e criar backups. O Linux oferece várias ferramentas de compressão com
        diferentes balanços entre velocidade e taxa de compressão.
      </p>

      <h2>tar — O Canivete Suíço do Arquivamento</h2>
      <p>
        O <code>tar</code> (Tape ARchive) agrupa múltiplos arquivos em um único arquivo
        <code>.tar</code>. Combinado com um algoritmo de compressão, cria os famosos
        <code>.tar.gz</code>, <code>.tar.bz2</code> e <code>.tar.xz</code>.
      </p>
      <CodeBlock
        title="tar: criar e extrair arquivos"
        code={`# === CRIAR ARQUIVOS ===

# Criar arquivo .tar (sem compressão, apenas agrupar)
tar -cvf arquivo.tar pasta/

# Criar .tar.gz (com compressão gzip — o mais comum)
tar -czvf arquivo.tar.gz pasta/

# Criar .tar.bz2 (compressão bzip2 — melhor compressão, mais lento)
tar -cjvf arquivo.tar.bz2 pasta/

# Criar .tar.xz (compressão xz — máxima compressão)
tar -cJvf arquivo.tar.xz pasta/

# Criar com zstd (moderno, rápido e boa compressão)
tar -czvf arquivo.tar.zst --use-compress-program=zstd pasta/

# === FLAGS DO TAR ===
# -c = create (criar)
# -x = extract (extrair)
# -v = verbose (mostrar o que está sendo processado)
# -f = file (nome do arquivo tar)
# -z = gzip
# -j = bzip2
# -J = xz

# === EXTRAIR ARQUIVOS ===

# Extrair arquivo .tar (sem compressão)
tar -xvf arquivo.tar

# Extrair arquivo .tar.gz
tar -xzvf arquivo.tar.gz

# Extrair arquivo .tar.bz2
tar -xjvf arquivo.tar.bz2

# Extrair arquivo .tar.xz
tar -xJvf arquivo.tar.xz

# Extrair em diretório específico
tar -xzvf arquivo.tar.gz -C /destino/

# === VER CONTEÚDO SEM EXTRAIR ===

# Listar conteúdo de um .tar.gz
tar -tzvf arquivo.tar.gz

# === EXEMPLOS PRÁTICOS ===

# Backup do diretório home:
tar -czvf backup_home_\$(date +%Y%m%d).tar.gz /home/joao/

# Extrair apenas um arquivo específico de dentro do tar:
tar -xzvf backup.tar.gz home/joao/Documents/relatorio.pdf`}
      />

      <h2>gzip — Compressão Rápida</h2>
      <CodeBlock
        title="Comprimindo com gzip"
        code={`# Comprimir um arquivo (substitui o original por .gz)
gzip arquivo.txt
# Resultado: arquivo.txt.gz (original é removido!)

# Comprimir mantendo o original
gzip -k arquivo.txt
# Resultado: arquivo.txt.gz e arquivo.txt mantido

# Descomprimir
gzip -d arquivo.txt.gz
# ou:
gunzip arquivo.txt.gz

# Descomprimir mantendo o .gz
gunzip -k arquivo.txt.gz

# Ver estatísticas de compressão sem comprimir
gzip -l arquivo.tar.gz

# Nível de compressão (1=rápido, 9=máximo)
gzip -9 arquivo.txt  # Máxima compressão
gzip -1 arquivo.txt  # Mais rápido (menor compressão)

# Ler arquivo .gz sem descomprimir:
zcat arquivo.txt.gz
zless arquivo.txt.gz
zgrep "erro" arquivo.txt.gz`}
      />

      <h2>bzip2 e xz — Melhor Compressão</h2>
      <CodeBlock
        title="bzip2 e xz para arquivos menores"
        code={`# === BZIP2 ===
# Comprimir (remove o original)
bzip2 arquivo.txt
# Resultado: arquivo.txt.bz2

# Descomprimir
bunzip2 arquivo.txt.bz2

# Manter original:
bzip2 -k arquivo.txt

# === XZ ===
# Comprimir (melhor taxa de compressão, mais lento)
xz arquivo.txt
# Resultado: arquivo.txt.xz

# Descomprimir
unxz arquivo.txt.xz
xz -d arquivo.txt.xz

# Manter original:
xz -k arquivo.txt

# === COMPARAÇÃO DE EFICIÊNCIA ===
# Arquivo de 100MB:
# gzip:  comprime em 2s  → 45MB (ratio 2.2x)
# bzip2: comprime em 8s  → 40MB (ratio 2.5x)
# xz:    comprime em 30s → 35MB (ratio 2.9x)
# zstd:  comprime em 1s  → 42MB (ratio 2.4x) ← melhor custo-benefício`}
      />

      <h2>zip e unzip — Compatível com Windows</h2>
      <CodeBlock
        title="Criando arquivos zip"
        code={`# Criar arquivo zip
zip arquivo.zip arquivo1.txt arquivo2.txt

# Criar zip de um diretório inteiro (recursivo)
zip -r backup.zip pasta/

# Proteger com senha
zip -e -r privado.zip pasta-secreta/

# Criar zip com máxima compressão (0-9)
zip -9 -r arquivo.zip pasta/

# Ver conteúdo de um zip sem extrair
unzip -l arquivo.zip

# Extrair arquivo zip
unzip arquivo.zip

# Extrair em diretório específico
unzip arquivo.zip -d /destino/

# Extrair arquivo específico do zip
unzip arquivo.zip "pasta/arquivo-especifico.txt"

# Extrair sem sobrescrever arquivos existentes
unzip -n arquivo.zip

# Instalar zip e unzip (se não estiver instalado)
sudo apt install zip unzip`}
      />

      <h2>7zip — Alta Compressão</h2>
      <CodeBlock
        title="Usando 7zip no Ubuntu"
        code={`# Instalar 7zip
sudo apt install p7zip-full p7zip-rar

# Criar arquivo 7z
7z a arquivo.7z pasta/
7z a -p arquivo.7z pasta/    # Com senha

# Extrair
7z x arquivo.7z

# Extrair em diretório específico
7z x arquivo.7z -o/destino/

# Listar conteúdo
7z l arquivo.7z

# Testar integridade do arquivo
7z t arquivo.7z

# Criar arquivo com máxima compressão
7z a -mx=9 arquivo.7z pasta/`}
      />

      <h2>Dicas Práticas de Compressão</h2>
      <AlertBox type="info" title="Quando usar cada formato">
        <ul className="mt-1 mb-0">
          <li><strong>.tar.gz</strong>: Padrão Linux, compatível em todo lugar. Use para a maioria dos casos.</li>
          <li><strong>.tar.xz</strong>: Quando o tamanho final importa muito (ex: releases de software). Mais lento.</li>
          <li><strong>.tar.zst</strong>: Moderno, rápido e boa compressão. Cada vez mais popular (pacotes do Arch/Ubuntu 23+).</li>
          <li><strong>.zip</strong>: Para compatibilidade com Windows e macOS.</li>
          <li><strong>.7z</strong>: Máxima compressão, mas menos universal no Linux.</li>
        </ul>
      </AlertBox>

      <CodeBlock
        title="Script de backup com compressão"
        code={`#!/bin/bash
# Script de backup completo com compressão

BACKUP_DIR="/mnt/backup"
DATA=\$(date +%Y-%m-%d)
ORIGEM="/home/joao"

mkdir -p "\$BACKUP_DIR"

echo "Iniciando backup de \$ORIGEM..."

# Backup comprimido com progresso
tar -czvf "\$BACKUP_DIR/home_\$DATA.tar.gz" \\
    --exclude="\$ORIGEM/.cache" \\
    --exclude="\$ORIGEM/.local/share/Trash" \\
    "\$ORIGEM" 2>&1 | tee /tmp/backup.log

echo "Backup concluído: \$BACKUP_DIR/home_\$DATA.tar.gz"
du -sh "\$BACKUP_DIR/home_\$DATA.tar.gz"`}
      />
    </PageContainer>
  );
}
