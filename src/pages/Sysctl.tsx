import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sysctl() {
  return (
    <PageContainer
      title="sysctl: Parâmetros do Kernel"
      subtitle="Ajuste parâmetros do kernel em tempo real: rede, memória, segurança, performance e muito mais com sysctl."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <h2>O que é o sysctl?</h2>
      <p>
        O <code>sysctl</code> permite ler e modificar parâmetros do kernel Linux em tempo real,
        sem precisar recompilar ou reiniciar. Esses parâmetros controlam o comportamento da rede,
        memória, segurança, sistema de arquivos e muito mais.
        Os parâmetros ficam expostos em <code>/proc/sys/</code>.
      </p>

      <h2>Comandos Básicos</h2>

      <CodeBlock
        title="Operações básicas com sysctl"
        code={`# Listar TODOS os parâmetros
sysctl -a

# Buscar parâmetros específicos
sysctl -a | grep swappiness
sysctl -a | grep tcp

# Ver valor de um parâmetro
sysctl vm.swappiness
sysctl net.ipv4.ip_forward

# Alterar temporariamente (até reiniciar)
sudo sysctl vm.swappiness=10
sudo sysctl net.ipv4.ip_forward=1

# Alterar via /proc/sys
echo 10 | sudo tee /proc/sys/vm/swappiness`}
      />

      <h2>Configuração Permanente</h2>

      <CodeBlock
        title="Tornar alterações permanentes"
        code={`# Criar arquivo de configuração
sudo vim /etc/sysctl.d/99-custom.conf

# Formato:
parametro = valor

# Aplicar configurações sem reiniciar
sudo sysctl --system

# Ou aplicar um arquivo específico
sudo sysctl -p /etc/sysctl.d/99-custom.conf`}
      />

      <h2>Otimizações de Rede</h2>

      <CodeBlock
        title="Parâmetros de rede recomendados"
        code={`# /etc/sysctl.d/99-network.conf

# Habilitar roteamento (necessário para VPN, containers, NAT)
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1

# Proteção contra SYN flood
net.ipv4.tcp_syncookies = 1

# Tamanho do buffer TCP (performance)
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# Reutilizar sockets TCP em TIME_WAIT
net.ipv4.tcp_tw_reuse = 1

# Tamanho da fila de conexões pendentes
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535

# TCP Fast Open
net.ipv4.tcp_fastopen = 3

# BBR congestion control (melhor para internet moderna)
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# Desabilitar ICMP redirect (segurança)
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# Proteção contra IP spoofing
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1`}
      />

      <AlertBox type="info" title="TCP BBR">
        O algoritmo de congestionamento <strong>BBR</strong> (Bottleneck Bandwidth and RTT) do Google 
        pode melhorar significativamente a velocidade de rede. Para habilitá-lo, 
        o módulo <code>tcp_bbr</code> precisa estar disponível no kernel.
      </AlertBox>

      <h2>Otimizações de Memória</h2>

      <CodeBlock
        title="Parâmetros de memória e swap"
        code={`# /etc/sysctl.d/99-memory.conf

# Swappiness (10-20 para desktop com bastante RAM)
vm.swappiness = 10

# Pressão de cache (quanto cache manter antes de liberar)
vm.vfs_cache_pressure = 50

# Porcentagem de RAM suja (dirty) antes de forçar escrita
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5

# Para sistemas com muita RAM (32GB+)
vm.dirty_bytes = 268435456
vm.dirty_background_bytes = 134217728

# Overcommit de memória
# 0 = heurística (padrão)
# 1 = sempre permitir
# 2 = nunca overcommit
vm.overcommit_memory = 0

# Mínimo de memória livre (KB) antes de matar processos
vm.min_free_kbytes = 65536`}
      />

      <h2>Segurança</h2>

      <CodeBlock
        title="Parâmetros de segurança do kernel"
        code={`# /etc/sysctl.d/99-security.conf

# Esconder informações do kernel
kernel.kptr_restrict = 2        # Esconder ponteiros do kernel
kernel.dmesg_restrict = 1       # Restringir dmesg a root
kernel.printk = 3 3 3 3         # Reduzir mensagens no console

# Proteção contra ataques
kernel.randomize_va_space = 2   # ASLR completo
kernel.kexec_load_disabled = 1  # Desabilitar kexec (após boot)
kernel.yama.ptrace_scope = 2    # Restringir ptrace

# Desabilitar SysRq (ou limitar)
kernel.sysrq = 0
# ou permitir apenas sync e reboot:
# kernel.sysrq = 176

# Proteções de rede
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Desabilitar IPv6 (se não usar)
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1`}
      />

      <h2>Performance para Desktop</h2>

      <CodeBlock
        title="Configuração recomendada para desktop"
        code={`# /etc/sysctl.d/99-desktop.conf

# Reduzir latência de rede
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# Otimizar uso de memória
vm.swappiness = 10
vm.vfs_cache_pressure = 50
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5

# Tamanho do inotify (necessário para IDEs, editores)
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 1024

# Limites de arquivos abertos
fs.file-max = 2097152

# Performance de disco
vm.min_free_kbytes = 65536`}
      />

      <h2>Performance para Servidor</h2>

      <CodeBlock
        title="Configuração recomendada para servidor"
        code={`# /etc/sysctl.d/99-server.conf

# Rede otimizada para alto tráfego
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fastopen = 3
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# Buffers de rede
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# Memória
vm.swappiness = 10
vm.overcommit_memory = 0

# Limites
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288

# Segurança
net.ipv4.conf.all.rp_filter = 1
net.ipv4.tcp_syncookies = 1`}
      />

      <h2>Verificação e Troubleshooting</h2>

      <CodeBlock
        title="Verificar e diagnosticar sysctl"
        code={`# Ver todos os arquivos de configuração carregados
sudo sysctl --system 2>&1

# Verificar se um módulo está carregado (ex: BBR)
lsmod | grep bbr
# Se não estiver: sudo modprobe tcp_bbr

# Ver valor antes e depois
sysctl vm.swappiness
sudo sysctl vm.swappiness=10
sysctl vm.swappiness

# Verificar todos os erros
dmesg | grep -i sysctl`}
      />

      <AlertBox type="danger" title="Cuidado ao modificar">
        Parâmetros do sysctl afetam diretamente o comportamento do kernel. Valores incorretos podem
        causar instabilidade, perda de dados ou problemas de segurança. Sempre teste em ambiente
        não-crítico e pesquise cada parâmetro antes de alterar.
      </AlertBox>
    </PageContainer>
  );
}
