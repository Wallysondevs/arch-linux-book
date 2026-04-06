import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SwapZram() {
  return (
    <PageContainer
      title="Swap, Zram & Zswap"
      subtitle="Entenda memória virtual no Linux: swap partitions, swap files, zram (swap comprimido na RAM) e zswap para performance máxima."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O que é Swap?</h2>
      <p>
        Swap é uma área de armazenamento usada como extensão da memória RAM. Quando a RAM está cheia,
        o sistema move dados menos usados para o swap, liberando RAM para processos ativos.
        No Arch Linux, você pode usar uma <strong>partição de swap</strong> ou um <strong>arquivo de swap</strong>.
      </p>

      <AlertBox type="info" title="Preciso de swap?">
        <strong>Sim, na maioria dos casos.</strong> Mesmo com bastante RAM, o swap é necessário para hibernação
        e como rede de segurança contra falta de memória. Sem swap, processos podem ser mortos pelo OOM killer
        quando a RAM acabar.
      </AlertBox>

      <h2>Swap Partition</h2>

      <CodeBlock
        title="Criar e ativar uma partição de swap"
        code={`# Formatar a partição como swap
sudo mkswap /dev/sda3

# Ativar a swap
sudo swapon /dev/sda3

# Verificar
swapon --show
free -h

# Adicionar ao fstab para persistir após reboot
# UUID=xxx  none  swap  defaults  0 0
echo "UUID=$(sudo blkid -s UUID -o value /dev/sda3)  none  swap  defaults  0 0" | sudo tee -a /etc/fstab`}
      />

      <h2>Swap File</h2>
      <p>
        Arquivos de swap são mais flexíveis — você pode criar, redimensionar e remover sem reparticionar o disco.
      </p>

      <CodeBlock
        title="Criar um swap file"
        code={`# Criar arquivo de 8GB (ajuste conforme necessidade)
sudo dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress

# Ajustar permissões (IMPORTANTE: só root pode ler)
sudo chmod 600 /swapfile

# Formatar como swap
sudo mkswap /swapfile

# Ativar
sudo swapon /swapfile

# Verificar
swapon --show
free -h

# Adicionar ao fstab
echo '/swapfile none swap defaults 0 0' | sudo tee -a /etc/fstab`}
      />

      <CodeBlock
        title="Alterar tamanho do swap file"
        code={`# Desativar swap
sudo swapoff /swapfile

# Recriar com novo tamanho (16GB)
sudo dd if=/dev/zero of=/swapfile bs=1M count=16384 status=progress
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Verificar
free -h`}
      />

      <CodeBlock
        title="Remover swap file"
        code={`# Desativar
sudo swapoff /swapfile

# Remover arquivo
sudo rm /swapfile

# Remover entrada do fstab
sudo vim /etc/fstab  # Apagar a linha do /swapfile`}
      />

      <AlertBox type="warning" title="Swap file em Btrfs">
        Em Btrfs, o swap file precisa de tratamento especial. Ele deve estar em um subvolume dedicado
        sem compressão e sem COW. A partir do kernel 5.0+, o Btrfs suporta swap files nativamente.
      </AlertBox>

      <CodeBlock
        title="Swap file em Btrfs (método correto)"
        code={`# Criar subvolume dedicado para swap
sudo btrfs subvolume create /swap

# Criar o arquivo com atributos corretos
sudo truncate -s 0 /swap/swapfile
sudo chattr +C /swap/swapfile  # Desabilitar COW
sudo btrfs property set /swap/swapfile compression none

# Criar com tamanho desejado
sudo dd if=/dev/zero of=/swap/swapfile bs=1M count=8192 status=progress
sudo chmod 600 /swap/swapfile
sudo mkswap /swap/swapfile
sudo swapon /swap/swapfile

# fstab:
# /swap/swapfile none swap defaults 0 0`}
      />

      <h2>Swappiness</h2>
      <p>
        O parâmetro <code>swappiness</code> controla a tendência do kernel de usar swap.
        Valores variam de 0 a 200 (padrão: 60).
      </p>

      <CodeBlock
        title="Configurar swappiness"
        code={`# Ver valor atual
cat /proc/sys/vm/swappiness

# Alterar temporariamente (até reiniciar)
sudo sysctl vm.swappiness=10

# Tornar permanente
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf

# Valores recomendados:
# Desktop com bastante RAM: 10-20
# Servidor: 10
# Desktop com pouca RAM: 60 (padrão)
# Com zram: 180 (recomendado)`}
      />

      <h2>Zram — Swap Comprimido na RAM</h2>
      <p>
        O <strong>zram</strong> cria um dispositivo de bloco comprimido na RAM. Em vez de usar o disco como swap,
        ele comprime dados na própria memória. Isso é <strong>significativamente mais rápido</strong> que swap em disco
        (mesmo SSD) e é especialmente útil para sistemas com pouca RAM.
      </p>

      <AlertBox type="info" title="Por que usar zram?">
        Com compressão zstd, o zram pode efetivamente duplicar ou triplicar sua RAM disponível.
        Um sistema com 8GB de RAM + zram pode se comportar como se tivesse 16-24GB.
        O zram é recomendado pelo Fedora, Ubuntu e ChromeOS.
      </AlertBox>

      <h3>Configuração Manual do Zram</h3>

      <CodeBlock
        title="Configurar zram manualmente"
        code={`# Carregar o módulo
sudo modprobe zram

# Configurar tamanho (metade da RAM é um bom ponto de partida)
echo zstd | sudo tee /sys/block/zram0/comp_algorithm
echo 4G | sudo tee /sys/block/zram0/disksize

# Formatar e ativar
sudo mkswap /dev/zram0
sudo swapon -p 100 /dev/zram0  # -p 100 dá prioridade alta

# Verificar
swapon --show
zramctl`}
      />

      <h3>Usando zram-generator (Recomendado)</h3>

      <CodeBlock
        title="Instalar e configurar zram-generator"
        code={`# Instalar
sudo pacman -S zram-generator

# Criar configuração
sudo tee /etc/systemd/zram-generator.conf << 'EOF'
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
swap-priority = 100
fs-type = swap
EOF

# Recarregar systemd e ativar
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service

# Verificar
zramctl
swapon --show`}
      />

      <CodeBlock
        title="Configurações avançadas do zram-generator"
        code={`# /etc/systemd/zram-generator.conf
[zram0]
# Tamanho: metade da RAM (pode ser min(ram / 2, 8192) para limitar)
zram-size = min(ram / 2, 8192)

# Algoritmo de compressão
# zstd = melhor ratio de compressão
# lz4 = mais rápido, menos compressão
compression-algorithm = zstd

# Prioridade (maior = preferido)
swap-priority = 100

# Tipo
fs-type = swap`}
      />

      <h2>Zswap — Cache de Swap Comprimido</h2>
      <p>
        O <strong>zswap</strong> é diferente do zram. Ele funciona como uma camada de cache entre a RAM e o swap em disco.
        Antes de escrever no swap, o zswap tenta comprimir a página na RAM.
        Se não couber, aí sim vai para o disco.
      </p>

      <CodeBlock
        title="Habilitar e configurar zswap"
        code={`# Verificar se está habilitado
cat /sys/module/zswap/parameters/enabled

# Habilitar via parâmetro do kernel
# Adicionar ao GRUB:
GRUB_CMDLINE_LINUX_DEFAULT="zswap.enabled=1 zswap.compressor=zstd zswap.max_pool_percent=20"

# Ou para systemd-boot, adicionar na linha options:
options ... zswap.enabled=1 zswap.compressor=zstd zswap.max_pool_percent=20

# Verificar configuração após reboot
grep . /sys/module/zswap/parameters/*`}
      />

      <h2>Comparação: Swap vs Zram vs Zswap</h2>

      <CodeBlock
        title="Resumo das diferenças"
        code={`# ┌─────────────────┬───────────────────┬──────────────────┬──────────────────┐
# │                 │ Swap (disco)      │ Zram             │ Zswap            │
# ├─────────────────┼───────────────────┼──────────────────┼──────────────────┤
# │ Localização     │ Disco/SSD         │ RAM (comprimido) │ RAM + Disco      │
# │ Velocidade      │ Lento (disco)     │ Muito rápido     │ Rápido           │
# │ Uso de RAM      │ Nenhum            │ Sim (comprimido) │ Sim (cache)      │
# │ Hibernação      │ Sim               │ Não              │ Sim              │
# │ Recomendado     │ HDD / Hibernação  │ SSD / Desktop    │ Servidores       │
# └─────────────────┴───────────────────┴──────────────────┴──────────────────┘

# Recomendação geral para desktop:
# 1. Zram (swap comprimido na RAM) — melhor para maioria
# 2. Swap file pequeno para hibernação se necessário
# 3. Swappiness alto (180) com zram`}
      />

      <h2>Monitoramento de Swap</h2>

      <CodeBlock
        title="Comandos para monitorar uso de swap"
        code={`# Ver uso de swap
free -h
swapon --show

# Ver qual processo usa mais swap
grep VmSwap /proc/*/status | sort -k2 -n -r | head -20

# Ou usando smem
sudo pacman -S smem
smem -s swap -r

# Monitorar em tempo real
watch -n 1 'free -h && echo "---" && swapon --show'

# Ver estatísticas do zram
zramctl

# Limpar swap (mover tudo de volta para RAM se tiver espaço)
sudo swapoff -a && sudo swapon -a`}
      />

      <AlertBox type="info" title="Configuração recomendada para desktop moderno">
        Para um desktop com 16GB de RAM e SSD: use <strong>zram</strong> com metade da RAM (8GB),
        algoritmo <strong>zstd</strong>, e swappiness de <strong>180</strong>. 
        Se precisar de hibernação, adicione um swap file do tamanho da RAM.
      </AlertBox>
    </PageContainer>
  );
}
