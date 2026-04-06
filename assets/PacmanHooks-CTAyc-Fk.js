import{j as o}from"./ui-K-J8Jkwj.js";import{P as e}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as t}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return o.jsxs(e,{title:"Pacman Hooks",subtitle:"Automatize tarefas com hooks do pacman: execute scripts antes ou depois de instalar, atualizar ou remover pacotes.",difficulty:"avancado",timeToRead:"15 min",children:[o.jsx("h2",{children:"O que são Pacman Hooks?"}),o.jsx("p",{children:"Pacman hooks (ganchos) são scripts que executam automaticamente antes ou depois de operações do pacman. Eles permitem automatizar tarefas como limpar cache, atualizar o GRUB, reconstruir o initramfs, ou qualquer ação personalizada."}),o.jsx("h2",{children:"Onde ficam os Hooks?"}),o.jsx(a,{title:"Diretórios de hooks",code:`# Hooks do sistema (pacotes instalados colocam hooks aqui)
ls /usr/share/libalpm/hooks/

# Hooks personalizados do usuário (prioridade sobre /usr)
ls /etc/pacman.d/hooks/
# Se não existir:
sudo mkdir -p /etc/pacman.d/hooks`}),o.jsx("h2",{children:"Estrutura de um Hook"}),o.jsx(a,{title:"Anatomia de um pacman hook",code:`# /etc/pacman.d/hooks/nome-do-hook.hook

[Trigger]
Type = Package           # Package ou File
Operation = Install       # Install, Upgrade, Remove
Target = linux            # Nome do pacote ou padrão de arquivo

[Action]
Description = Descrição do que o hook faz
When = PostTransaction    # PreTransaction ou PostTransaction
Exec = /usr/bin/comando   # Comando a executar
Depends = pacote          # Dependências do hook (opcional)
NeedsTargets             # Recebe lista de targets via stdin (opcional)
AbortOnFail              # Abortar transação se falhar (opcional, apenas Pre)`}),o.jsx("h2",{children:"Exemplos Práticos"}),o.jsx("h3",{children:"Limpar Cache do Pacman"}),o.jsx(a,{title:"Hook para limpar cache automaticamente",code:`# /etc/pacman.d/hooks/clean-cache.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Limpando cache do pacman (mantendo 3 versões)...
When = PostTransaction
Exec = /usr/bin/paccache -rk3
Depends = pacman-contrib`}),o.jsx("h3",{children:"Atualizar GRUB"}),o.jsx(a,{title:"Hook para atualizar GRUB ao mudar kernel",code:`# /etc/pacman.d/hooks/grub-update.hook
[Trigger]
Type = Package
Operation = Install
Operation = Upgrade
Operation = Remove
Target = linux
Target = linux-lts
Target = linux-zen

[Action]
Description = Atualizando configuração do GRUB...
When = PostTransaction
Exec = /usr/bin/grub-mkconfig -o /boot/grub/grub.cfg
Depends = grub`}),o.jsx("h3",{children:"Backup da Lista de Pacotes"}),o.jsx(a,{title:"Hook para salvar lista de pacotes após cada operação",code:`# /etc/pacman.d/hooks/backup-pkglist.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Salvando lista de pacotes instalados...
When = PostTransaction
Exec = /bin/sh -c 'pacman -Qqe > /home/usuario/backup/pkglist.txt && pacman -Qqem > /home/usuario/backup/aurlist.txt'`}),o.jsx("h3",{children:"Notificação de Atualizações do Kernel"}),o.jsx(a,{title:"Hook para lembrar de reiniciar após atualizar kernel",code:`# /etc/pacman.d/hooks/kernel-reboot-notify.hook
[Trigger]
Type = Package
Operation = Upgrade
Target = linux
Target = linux-lts
Target = linux-zen

[Action]
Description = >>> KERNEL ATUALIZADO! Reinicie o computador para usar o novo kernel. <<<
When = PostTransaction
Exec = /usr/bin/echo "Reinicie com: sudo reboot"`}),o.jsx("h3",{children:"Atualizar fontes após instalação"}),o.jsx(a,{title:"Hook para atualizar cache de fontes",code:`# /etc/pacman.d/hooks/font-cache.hook
[Trigger]
Type = File
Operation = Install
Operation = Upgrade
Operation = Remove
Target = usr/share/fonts/*

[Action]
Description = Atualizando cache de fontes...
When = PostTransaction
Exec = /usr/bin/fc-cache -f`}),o.jsx("h3",{children:"Reconstruir mkinitcpio"}),o.jsx(a,{title:"Hook para reconstruir initramfs (já existe por padrão)",code:`# Este hook já vem com o pacote 'mkinitcpio'
# /usr/share/libalpm/hooks/90-mkinitcpio-install.hook
# Reconstrui automaticamente ao atualizar o kernel

# Se precisar de um hook personalizado:
# /etc/pacman.d/hooks/custom-mkinitcpio.hook
[Trigger]
Type = File
Operation = Install
Operation = Upgrade
Target = usr/lib/modules/*/vmlinuz
Target = usr/lib/initcpio/*

[Action]
Description = Reconstruindo initramfs personalizado...
When = PostTransaction
Exec = /usr/bin/mkinitcpio -P
Depends = mkinitcpio`}),o.jsx("h3",{children:"Snapshot Btrfs antes de atualizar"}),o.jsx(a,{title:"Hook para criar snapshot Btrfs antes de atualizações",code:`# /etc/pacman.d/hooks/btrfs-snapshot.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Criando snapshot Btrfs pré-atualização...
When = PreTransaction
Exec = /usr/bin/btrfs subvolume snapshot / /.snapshots/pre-pacman
AbortOnFail`}),o.jsx("h2",{children:"Hook com Script Personalizado"}),o.jsx(a,{title:"Usar script externo como hook",code:`# 1. Criar o script
sudo tee /usr/local/bin/pacman-hook-custom.sh << 'SCRIPT'
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M)
LOG="/var/log/pacman-hooks.log"

echo "=== Hook executado em $DATE ===" >> "$LOG"

# Ler targets do stdin se NeedsTargets estiver definido
while read -r target; do
    echo "  Pacote: $target" >> "$LOG"
done

echo "" >> "$LOG"
SCRIPT

sudo chmod +x /usr/local/bin/pacman-hook-custom.sh

# 2. Criar o hook
sudo tee /etc/pacman.d/hooks/custom-log.hook << 'EOF'
[Trigger]
Operation = Upgrade
Type = Package
Target = *

[Action]
Description = Logando pacotes atualizados...
When = PostTransaction
Exec = /usr/local/bin/pacman-hook-custom.sh
NeedsTargets
EOF`}),o.jsx("h2",{children:"Listando e Verificando Hooks"}),o.jsx(a,{title:"Gerenciar hooks",code:`# Listar todos os hooks ativos
ls /usr/share/libalpm/hooks/ /etc/pacman.d/hooks/ 2>/dev/null

# Ver conteúdo de um hook
cat /usr/share/libalpm/hooks/30-systemd-update.hook

# Desabilitar um hook do sistema (criando override vazio)
sudo ln -s /dev/null /etc/pacman.d/hooks/nome-do-hook.hook

# Ver log do pacman (que mostra execução de hooks)
cat /var/log/pacman.log | tail -50`}),o.jsxs(t,{type:"info",title:"Dica: pacman-contrib",children:["O pacote ",o.jsx("code",{children:"pacman-contrib"})," inclui ferramentas úteis como ",o.jsx("code",{children:"paccache"})," (limpar cache),",o.jsx("code",{children:"pacdiff"})," (gerenciar .pacnew), ",o.jsx("code",{children:"rankmirrors"}),", e vários hooks úteis.",o.jsx("br",{}),o.jsx("br",{}),o.jsx("code",{children:"sudo pacman -S pacman-contrib"})]})]})}export{m as default};
