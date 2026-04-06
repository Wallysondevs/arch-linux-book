import{j as o}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return o.jsxs(a,{title:"Secure Boot",subtitle:"Configure o UEFI Secure Boot no Arch Linux: assine seu kernel, bootloader e módulos para boot seguro verificado.",difficulty:"avancado",timeToRead:"20 min",children:[o.jsx("h2",{children:"O que é Secure Boot?"}),o.jsxs("p",{children:["O ",o.jsx("strong",{children:"Secure Boot"})," é uma funcionalidade do UEFI que verifica a assinatura digital de cada componente carregado durante o boot (bootloader, kernel, drivers). Ele impede que malware modifique o processo de inicialização (bootkits/rootkits). Por padrão, o Secure Boot confia nas chaves da Microsoft."]}),o.jsx(s,{type:"info",title:"Preciso de Secure Boot?",children:"Para a maioria dos usuários desktop, o Secure Boot é opcional. Ele adiciona uma camada de segurança contra ataques físicos e malware de boot. É obrigatório em alguns ambientes corporativos e em dual-boot com Windows 11."}),o.jsx("h2",{children:"Opção 1: sbctl (Mais Simples)"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"sbctl"})," é a ferramenta mais fácil para configurar Secure Boot no Arch. Ele gera suas próprias chaves e assina automaticamente."]}),o.jsx(e,{title:"Configurar Secure Boot com sbctl",code:`# 1. Desabilitar Secure Boot na BIOS/UEFI primeiro
# Entrar no setup da BIOS e desabilitar

# 2. Instalar sbctl
sudo pacman -S sbctl

# 3. Verificar status
sbctl status

# 4. Gerar suas chaves de assinatura
sudo sbctl create-keys

# 5. Registrar as chaves na UEFI
sudo sbctl enroll-keys -m
# -m inclui chaves da Microsoft (necessário para dual-boot Windows)

# 6. Verificar o que precisa ser assinado
sudo sbctl verify

# 7. Assinar os arquivos
sudo sbctl sign -s /boot/vmlinuz-linux
sudo sbctl sign -s /boot/EFI/BOOT/BOOTX64.EFI
sudo sbctl sign -s /boot/EFI/systemd/systemd-bootx64.efi
# ou para GRUB:
sudo sbctl sign -s /boot/EFI/GRUB/grubx64.efi

# -s = salvar para reassinar automaticamente

# 8. Verificar novamente
sudo sbctl verify

# 9. Reiniciar e habilitar Secure Boot na BIOS/UEFI

# 10. Verificar após reboot
sbctl status
# Deve mostrar: Secure Boot: Enabled`}),o.jsxs(s,{type:"warning",title:"Chaves Microsoft",children:["Use ",o.jsx("code",{children:"-m"})," (Microsoft keys) ao registrar chaves se você faz dual-boot com Windows ou precisa de drivers UEFI assinados pela Microsoft (como drivers de GPU). Sem as chaves da Microsoft, Windows não vai bootar."]}),o.jsx("h2",{children:"Opção 2: shim (Compatibilidade Máxima)"}),o.jsx(e,{title:"Usar shim (assinado pela Microsoft)",code:`# O shim é um bootloader pré-assinado pela Microsoft
# que carrega um segundo bootloader (como GRUB)

# Instalar
yay -S shim-signed

# O shim funciona como intermediário:
# UEFI → shim (assinado Microsoft) → GRUB → kernel

# Útil quando:
# - Não quer/pode modificar as chaves UEFI
# - Ambiente corporativo com Secure Boot obrigatório
# - Compatibilidade máxima`}),o.jsx("h2",{children:"Assinando Módulos do Kernel (DKMS)"}),o.jsx(e,{title:"Assinar módulos DKMS para Secure Boot",code:`# Módulos de terceiros (NVIDIA, VirtualBox) precisam ser assinados
# O sbctl faz isso automaticamente se configurado

# Verificar módulos não assinados
sudo sbctl verify

# Para módulos DKMS, criar hook de assinatura
# /etc/dkms/framework.conf.d/sign-modules.conf
mok_signing_key="/var/lib/sbctl/keys/db/db.key"
mok_certificate="/var/lib/sbctl/keys/db/db.pem"
sign_tool="/usr/bin/sbsign"

# Reconstruir módulos DKMS
sudo dkms autoinstall`}),o.jsx("h2",{children:"Troubleshooting"}),o.jsx(e,{title:"Resolver problemas com Secure Boot",code:`# Sistema não boota após habilitar Secure Boot:
# 1. Entrar na BIOS/UEFI
# 2. Desabilitar Secure Boot
# 3. Bootar normalmente
# 4. Verificar assinaturas: sudo sbctl verify
# 5. Assinar arquivos faltantes
# 6. Tentar novamente

# Verificar se Secure Boot está ativo (de dentro do Linux)
mokutil --sb-state

# Listar chaves registradas
mokutil --list-enrolled

# Ver chaves do sbctl
sudo sbctl list-enrolled-keys

# Resetar chaves para padrão de fábrica
# (fazer isso na BIOS/UEFI, opção "Reset to factory keys")

# Logs de boot seguro
journalctl -b | grep -i secure`})]})}export{m as default};
