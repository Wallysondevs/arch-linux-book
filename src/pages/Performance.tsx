import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Performance() {
  return (
    <PageContainer
      title="Performance & Tuning"
      subtitle="Otimize a performance do Arch Linux: CPU, memória, disco, I/O scheduler, benchmarks e monitoramento avançado."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <h2>Visão Geral</h2>
      <p>
        O Arch Linux oferece controle total sobre a performance do sistema. Desde a escolha do 
        scheduler de I/O até parâmetros do kernel, cada aspecto pode ser ajustado para o seu 
        caso de uso específico — desktop responsivo, estação de trabalho ou servidor de alto desempenho.
      </p>

      <h2>I/O Schedulers</h2>
      <p>
        O I/O scheduler determina como o kernel ordena as operações de leitura/escrita no disco.
        A escolha correta pode ter impacto significativo na responsividade do sistema.
      </p>

      <CodeBlock
        title="Gerenciar I/O schedulers"
        code={`# Ver scheduler atual
cat /sys/block/sda/queue/scheduler
# [mq-deadline] kyber bfq none

# Ver scheduler de NVMe
cat /sys/block/nvme0n1/queue/scheduler

# Mudar temporariamente
echo bfq | sudo tee /sys/block/sda/queue/scheduler

# Recomendações:
# SSD/NVMe: mq-deadline ou none (kyber para alto throughput)
# HDD: bfq (melhor para desktop) ou mq-deadline

# Tornar permanente via regra udev
# /etc/udev/rules.d/60-ioscheduler.rules
ACTION=="add|change", KERNEL=="sd*", ATTR{queue/rotational}=="1", ATTR{queue/scheduler}="bfq"
ACTION=="add|change", KERNEL=="sd*", ATTR{queue/rotational}=="0", ATTR{queue/scheduler}="mq-deadline"
ACTION=="add|change", KERNEL=="nvme*", ATTR{queue/scheduler}="none"`}
      />

      <h2>Monitoramento de Performance</h2>

      <CodeBlock
        title="Ferramentas de monitoramento"
        code={`# htop — monitor de processos interativo
sudo pacman -S htop
htop

# btop — monitor moderno e bonito
sudo pacman -S btop
btop

# iotop — monitorar I/O de disco
sudo pacman -S iotop
sudo iotop

# iostat — estatísticas de I/O
sudo pacman -S sysstat
iostat -x 1

# vmstat — estatísticas de memória virtual
vmstat 1

# mpstat — estatísticas por CPU
mpstat -P ALL 1

# sar — coletor de dados de performance (histórico)
sar -u 1 5    # CPU
sar -r 1 5    # Memória
sar -d 1 5    # Disco

# perf — profiling avançado do kernel
sudo pacman -S perf
sudo perf top
sudo perf stat ls

# nethogs — bandwidth por processo
sudo pacman -S nethogs
sudo nethogs

# iftop — bandwidth por conexão
sudo pacman -S iftop
sudo iftop`}
      />

      <h2>Otimizações do Kernel</h2>

      <CodeBlock
        title="Kernel custom para performance"
        code={`# Opção 1: linux-zen (performance desktop)
sudo pacman -S linux-zen linux-zen-headers

# Opção 2: linux-lts (estabilidade)
sudo pacman -S linux-lts linux-lts-headers

# Opção 3: linux-hardened (segurança)
sudo pacman -S linux-hardened linux-hardened-headers

# Após instalar, atualizar bootloader
sudo grub-mkconfig -o /boot/grub/grub.cfg
# ou atualizar entry do systemd-boot

# Comparação:
# linux       — kernel padrão, atualizado frequentemente
# linux-zen   — patches de performance para desktop
# linux-lts   — suporte de longo prazo, mais estável
# linux-hardened — patches de segurança extra`}
      />

      <AlertBox type="info" title="linux-zen para desktop">
        O kernel <strong>linux-zen</strong> inclui patches que melhoram a responsividade do desktop:
        MuQSS scheduler, melhor preempção, frequência de timer mais alta (1000Hz), 
        e otimizações para workloads interativos. Ideal para gaming e uso desktop.
      </AlertBox>

      <h2>Otimização de Compilação</h2>

      <CodeBlock
        title="Otimizar compilação de pacotes"
        code={`# Editar /etc/makepkg.conf
sudo vim /etc/makepkg.conf

# Usar todos os cores para compilar
MAKEFLAGS="-j$(nproc)"

# Otimizações de compilação
CFLAGS="-march=native -O2 -pipe -fno-plt -fexceptions"
CXXFLAGS="$CFLAGS -Wp,-D_GLIBCXX_ASSERTIONS"

# Compressão de pacotes (zstd é mais rápido que xz)
PKGEXT='.pkg.tar.zst'
COMPRESSZST=(zstd -c -T0 --ultra -20 -)

# Usar ccache para acelerar recompilações
sudo pacman -S ccache
# Adicionar ao PATH em /etc/makepkg.conf:
# BUILDENV=(... ccache ...)`}
      />

      <h2>Benchmarks</h2>

      <CodeBlock
        title="Ferramentas de benchmark"
        code={`# CPU benchmark
sudo pacman -S sysbench
sysbench cpu --threads=$(nproc) run

# Disco benchmark
sudo pacman -S fio
# Teste de leitura sequencial
fio --name=seq-read --ioengine=libaio --iodepth=32 --rw=read \\
    --bs=1M --size=1G --numjobs=1 --runtime=10

# Teste de escrita aleatória (simula uso real)
fio --name=rand-write --ioengine=libaio --iodepth=32 --rw=randwrite \\
    --bs=4K --size=1G --numjobs=1 --runtime=10

# Teste rápido de disco
dd if=/dev/zero of=/tmp/test bs=1M count=1024 oflag=direct
dd if=/tmp/test of=/dev/null bs=1M iflag=direct

# Memória benchmark
sysbench memory --threads=$(nproc) run

# Rede
sudo pacman -S iperf3
# Servidor: iperf3 -s
# Cliente: iperf3 -c IP_DO_SERVIDOR

# Benchmark completo com Phoronix
yay -S phoronix-test-suite
phoronix-test-suite benchmark pts/compress-gzip`}
      />

      <h2>Ananicy-cpp — Prioridade Automática</h2>

      <CodeBlock
        title="Gerenciar prioridade de processos automaticamente"
        code={`# Instalar ananicy-cpp (versão C++ do ananicy)
yay -S ananicy-cpp cachyos-ananicy-rules

# Habilitar
sudo systemctl enable --now ananicy-cpp

# O ananicy automaticamente ajusta nice, ionice e cgroups
# para centenas de aplicações conhecidas

# Ver regras ativas
ls /etc/ananicy.d/
ls /usr/lib/ananicy.d/

# Criar regra personalizada
sudo tee /etc/ananicy.d/99-custom.rules << 'EOF'
# Dar prioridade alta para o Neovim
{"name": "nvim", "type": "Doc-Editor"}
# Dar prioridade baixa para compilações
{"name": "make", "type": "BG_CPUIO"}
EOF`}
      />

      <h2>Prelink e Preload</h2>

      <CodeBlock
        title="Acelerar carregamento de programas"
        code={`# preload — aprende quais programas você usa e pré-carrega na RAM
yay -S preload
sudo systemctl enable --now preload

# Verificar status
systemctl status preload

# earlyoom — mata processos antes do OOM killer do kernel
sudo pacman -S earlyoom
sudo systemctl enable --now earlyoom

# Configurar em /etc/default/earlyoom
# EARLYOOM_ARGS="-r 3600 -m 5 -s 5"
# Mata quando RAM < 5% e Swap < 5%`}
      />

      <h2>Otimizações por Caso de Uso</h2>

      <CodeBlock
        title="Resumo de otimizações recomendadas"
        code={`# Desktop / Gaming:
# - Kernel: linux-zen
# - I/O scheduler: bfq (HDD) ou mq-deadline (SSD)
# - Swappiness: 10 (com RAM suficiente) ou 180 (com zram)
# - Ananicy-cpp para prioridade automática
# - vm.vfs_cache_pressure = 50
# - earlyoom habilitado

# Servidor:
# - Kernel: linux-lts
# - I/O scheduler: mq-deadline ou none
# - sysctl de rede otimizado (BBR, buffers maiores)
# - Desabilitar serviços desnecessários
# - Monitorar com sar/iostat/vmstat

# Laptop:
# - TLP ou auto-cpufreq
# - powertop --auto-tune
# - fstrim.timer para SSD
# - Governador schedutil ou powersave
# - Zram em vez de swap em disco

# Estação de trabalho (compilação/dev):
# - MAKEFLAGS="-j$(nproc)"
# - ccache habilitado
# - tmpfs para /tmp (compilar na RAM)
# - I/O scheduler: mq-deadline
# - Bastante RAM + zram`}
      />
    </PageContainer>
  );
}
