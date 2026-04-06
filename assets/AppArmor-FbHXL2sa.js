import{j as r}from"./ui-K-J8Jkwj.js";import{P as e}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return r.jsxs(e,{title:"AppArmor",subtitle:"Controle de acesso mandatório (MAC) no Linux: restrinja o que cada programa pode acessar para aumentar a segurança.",difficulty:"avancado",timeToRead:"18 min",children:[r.jsx("h2",{children:"O que é AppArmor?"}),r.jsxs("p",{children:["O ",r.jsx("strong",{children:"AppArmor"})," (Application Armor) é um sistema de controle de acesso mandatório (MAC) que confina programas a um conjunto limitado de recursos. Enquanto permissões tradicionais controlam quem pode acessar arquivos, o AppArmor controla o que cada programa pode fazer — independente de quem o executa."]}),r.jsx(a,{title:"Instalar e habilitar AppArmor",code:`# Instalar
sudo pacman -S apparmor

# Habilitar parâmetro do kernel
# GRUB: editar /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="... apparmor=1 security=apparmor"
sudo grub-mkconfig -o /boot/grub/grub.cfg

# systemd-boot: editar entrada
options ... apparmor=1 security=apparmor

# Habilitar serviço
sudo systemctl enable --now apparmor.service

# Reiniciar
sudo reboot

# Verificar status
sudo aa-status
# ou
sudo apparmor_status`}),r.jsx("h2",{children:"Modos de Operação"}),r.jsx(a,{title:"Modos do AppArmor",code:`# Enforce (Enforced) — bloqueia acessos não autorizados
# Complain — registra violações sem bloquear (para criar/testar perfis)
# Unconfined — sem restrições

# Ver status de todos os perfis
sudo aa-status

# Mudar perfil para modo complain
sudo aa-complain /etc/apparmor.d/usr.bin.firefox

# Mudar perfil para modo enforce
sudo aa-enforce /etc/apparmor.d/usr.bin.firefox

# Desabilitar um perfil
sudo aa-disable /etc/apparmor.d/usr.bin.firefox`}),r.jsx("h2",{children:"Perfis AppArmor"}),r.jsx(a,{title:"Gerenciar perfis",code:`# Perfis ficam em /etc/apparmor.d/
ls /etc/apparmor.d/

# Instalar perfis extras (comunidade)
sudo pacman -S apparmor-profiles

# Recarregar todos os perfis
sudo apparmor_parser -r /etc/apparmor.d/

# Recarregar um perfil específico
sudo apparmor_parser -r /etc/apparmor.d/usr.bin.firefox

# Ver log de violações
sudo journalctl -k | grep apparmor
# ou
sudo dmesg | grep apparmor`}),r.jsx("h3",{children:"Criando Perfis com aa-genprof"}),r.jsx(a,{title:"Criar perfil automaticamente",code:`# Instalar ferramentas
sudo pacman -S apparmor-utils

# Gerar perfil interativamente
# 1. Iniciar o gerador (em um terminal)
sudo aa-genprof /usr/bin/meu-programa

# 2. Em outro terminal, usar o programa normalmente
# O aa-genprof monitora todos os acessos

# 3. Voltar ao terminal do aa-genprof
# Pressione 'S' para escanear logs
# Para cada acesso, escolha:
#   (A)llow — permitir
#   (D)eny — negar
#   (I)nherit — herdar do perfil pai
#   (G)lob — usar padrão wildcard

# 4. Pressione 'F' para finalizar e salvar`}),r.jsx("h3",{children:"Exemplo de Perfil Manual"}),r.jsx(a,{title:"Perfil AppArmor para um script",code:`# /etc/apparmor.d/usr.local.bin.meu-script
#include <tunables/global>

/usr/local/bin/meu-script {
  #include <abstractions/base>
  #include <abstractions/bash>

  # Permitir leitura de configurações
  /etc/meu-script.conf r,
  
  # Permitir escrita em diretório específico
  /var/log/meu-script/ rw,
  /var/log/meu-script/** rw,
  
  # Permitir execução de comandos específicos
  /usr/bin/grep ix,
  /usr/bin/awk ix,
  /usr/bin/curl ix,
  
  # Permitir rede
  network inet tcp,
  network inet udp,
  
  # Negar acesso a tudo mais (implícito)
}

# Carregar o perfil
sudo apparmor_parser -r /etc/apparmor.d/usr.local.bin.meu-script`}),r.jsx("h2",{children:"AppArmor para Aplicações Comuns"}),r.jsx(a,{title:"Perfis úteis para desktop",code:`# Firefox (geralmente já vem com perfil)
sudo aa-enforce /etc/apparmor.d/usr.lib.firefox.firefox

# Confinar o Thunderbird
sudo aa-genprof /usr/bin/thunderbird

# Confinar navegador Chromium
sudo aa-genprof /usr/bin/chromium

# Ver perfis em modo enforce
sudo aa-status | grep enforce

# Ver perfis em modo complain
sudo aa-status | grep complain`}),r.jsxs(o,{type:"info",title:"AppArmor vs SELinux",children:[r.jsx("strong",{children:"AppArmor"}),": mais simples, baseado em caminhos de arquivos, mais fácil de aprender. Usado por Ubuntu, openSUSE, Debian.",r.jsx("br",{}),r.jsx("br",{}),r.jsx("strong",{children:"SELinux"}),": mais poderoso e granular, baseado em labels/contextos, mais complexo. Usado por Fedora, RHEL, CentOS.",r.jsx("br",{}),r.jsx("br",{}),"Para Arch Linux, AppArmor é a escolha mais prática por sua simplicidade."]})]})}export{u as default};
