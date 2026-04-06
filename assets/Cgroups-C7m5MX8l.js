import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as s}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function d(){return e.jsxs(o,{title:"Cgroups & Namespaces",subtitle:"As bases de containers: entenda como o Linux isola processos, limita recursos e cria ambientes separados.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsx("h2",{children:"O que são Cgroups?"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Control Groups (cgroups)"})," são um mecanismo do kernel Linux para limitar, priorizar e monitorar recursos (CPU, memória, I/O, rede) de grupos de processos. Eles são a base tecnológica que torna containers (Docker, Podman) possíveis."]}),e.jsx("h2",{children:"Cgroups v2"}),e.jsx(s,{title:"Verificar e usar cgroups",code:`# Verificar se cgroups v2 está ativo (padrão em kernels modernos)
mount | grep cgroup2
# ou
stat -f /sys/fs/cgroup | grep Type
# Type: cgroup2fs

# Ver hierarquia de cgroups
ls /sys/fs/cgroup/

# Ver cgroups do processo atual
cat /proc/self/cgroup

# Ver uso de recursos do cgroup raiz
cat /sys/fs/cgroup/cpu.stat
cat /sys/fs/cgroup/memory.stat`}),e.jsx("h2",{children:"Limitando Recursos com systemd"}),e.jsx("p",{children:"O systemd é a interface mais prática para usar cgroups. Cada serviço roda em seu próprio cgroup."}),e.jsx(s,{title:"Limitar recursos de serviços",code:`# Ver cgroups de um serviço
systemctl show nginx.service | grep -i cgroup

# Limitar CPU de um serviço (50% de um core)
sudo systemctl set-property nginx.service CPUQuota=50%

# Limitar memória (512MB máximo)
sudo systemctl set-property nginx.service MemoryMax=512M

# Limitar I/O
sudo systemctl set-property nginx.service IOWeight=50

# Aplicar múltiplos limites de uma vez
sudo systemctl set-property nginx.service \\
  CPUQuota=200% \\
  MemoryMax=1G \\
  MemorySwapMax=0 \\
  IOWeight=100

# Os limites persistem em /etc/systemd/system/nginx.service.d/`}),e.jsx(s,{title:"Limitar recursos de um comando específico",code:`# Executar com limite de recursos usando systemd-run
systemd-run --scope -p MemoryMax=500M -p CPUQuota=100% make -j$(nproc)

# Compilar com limite de memória
systemd-run --scope -p MemoryMax=4G -p MemorySwapMax=0 makepkg -s

# Com nome personalizado
systemd-run --scope --unit=minha-compilacao -p CPUQuota=200% -p MemoryMax=8G make`}),e.jsx("h2",{children:"Namespaces"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Namespaces"}),' isolam diferentes aspectos do sistema para um processo, fazendo ele "pensar" que tem seu próprio sistema operacional. São 8 tipos de namespaces no Linux:']}),e.jsx(s,{title:"Tipos de namespaces",code:`# PID    — Processos isolados (PID 1 próprio)
# NET    — Rede isolada (interfaces, IPs, rotas próprias)
# MNT    — Montagens isoladas (filesystem próprio)
# UTS    — Hostname isolado
# IPC    — Comunicação entre processos isolada
# USER   — Mapeamento de UIDs isolado
# CGROUP — Hierarquia de cgroups isolada
# TIME   — Relógio isolado (kernel 5.6+)

# Ver namespaces do processo atual
ls -la /proc/self/ns/

# Listar todos os namespaces
lsns`}),e.jsx(s,{title:"Criar namespaces manualmente",code:`# Criar namespace de rede isolado
sudo ip netns add minha-rede

# Executar comando no namespace
sudo ip netns exec minha-rede ip addr
sudo ip netns exec minha-rede ping 8.8.8.8  # Vai falhar (sem rede)

# Listar namespaces de rede
ip netns list

# Criar processo com namespaces isolados
sudo unshare --mount --pid --fork --mount-proc bash
# Agora você está em um ambiente com PID e montagens isolados
# ps aux mostrará apenas processos deste namespace

# Criar container mínimo com unshare
sudo unshare -UmpfinR /mnt/arch bash
# -U = user namespace
# -m = mount namespace
# -p = PID namespace
# -f = fork
# -i = IPC namespace
# -n = network namespace
# -R = set root directory`}),e.jsx("h2",{children:"Monitorando Cgroups"}),e.jsx(s,{title:"Monitorar uso de recursos por cgroup",code:`# Ver árvore de cgroups com systemd
systemd-cgls

# Uso de recursos por cgroup
systemd-cgtop

# Ver limites de um serviço
systemctl show nginx.service -p MemoryMax,CPUQuota,IOWeight

# Ver uso atual de memória de um cgroup
cat /sys/fs/cgroup/system.slice/nginx.service/memory.current
cat /sys/fs/cgroup/system.slice/nginx.service/memory.max

# Ver uso de CPU
cat /sys/fs/cgroup/system.slice/nginx.service/cpu.stat

# Estatísticas de I/O
cat /sys/fs/cgroup/system.slice/nginx.service/io.stat`}),e.jsx("h2",{children:"Cgroups para Usuários"}),e.jsx(s,{title:"Limitar recursos por usuário",code:`# O systemd cria um cgroup por sessão de usuário
# /sys/fs/cgroup/user.slice/user-1000.slice/

# Limitar memória total do usuário
sudo mkdir -p /etc/systemd/system/user-1000.slice.d/
sudo tee /etc/systemd/system/user-1000.slice.d/memory.conf << 'EOF'
[Slice]
MemoryMax=16G
MemorySwapMax=4G
EOF

sudo systemctl daemon-reload

# Ver uso por usuário
systemd-cgtop -m`}),e.jsx(r,{type:"info",title:"Cgroups na prática",children:"No dia a dia, você raramente manipula cgroups diretamente. Docker, Podman, systemd e até navegadores web (Chrome) usam cgroups internamente para isolamento e controle de recursos. Entender cgroups ajuda a diagnosticar problemas de performance e segurança."})]})}export{d as default};
