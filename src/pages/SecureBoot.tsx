import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SecureBoot() {
  return (
    <PageContainer
      title="Secure Boot"
      subtitle="Configure o UEFI Secure Boot no Arch Linux: assine seu kernel, bootloader e módulos para boot seguro verificado."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <h2>O que é Secure Boot?</h2>
      <p>
        O <strong>Secure Boot</strong> é uma funcionalidade do UEFI que verifica a assinatura digital de cada 
        componente carregado durante o boot (bootloader, kernel, drivers). Ele impede que malware modifique 
        o processo de inicialização (bootkits/rootkits). Por padrão, o Secure Boot confia nas chaves da Microsoft.
      </p>

      <AlertBox type="info" title="Preciso de Secure Boot?">
        Para a maioria dos usuários desktop, o Secure Boot é opcional. Ele adiciona uma camada de segurança
        contra ataques físicos e malware de boot. É obrigatório em alguns ambientes corporativos e em 
        dual-boot com Windows 11.
      </AlertBox>

      <h2>Opção 1: sbctl (Mais Simples)</h2>
      <p>
        O <code>sbctl</code> é a ferramenta mais fácil para configurar Secure Boot no Arch. 
        Ele gera suas próprias chaves e assina automaticamente.
      </p>

      <CodeBlock
        title="Configurar Secure Boot com sbctl"
        code={`# 1. Desabilitar Secure Boot na BIOS/UEFI primeiro
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
# Deve mostrar: Secure Boot: Enabled`}
      />

      <AlertBox type="warning" title="Chaves Microsoft">
        Use <code>-m</code> (Microsoft keys) ao registrar chaves se você faz dual-boot com Windows ou
        precisa de drivers UEFI assinados pela Microsoft (como drivers de GPU). Sem as chaves da Microsoft,
        Windows não vai bootar.
      </AlertBox>

      <h2>Opção 2: shim (Compatibilidade Máxima)</h2>

      <CodeBlock
        title="Usar shim (assinado pela Microsoft)"
        code={`# O shim é um bootloader pré-assinado pela Microsoft
# que carrega um segundo bootloader (como GRUB)

# Instalar
yay -S shim-signed

# O shim funciona como intermediário:
# UEFI → shim (assinado Microsoft) → GRUB → kernel

# Útil quando:
# - Não quer/pode modificar as chaves UEFI
# - Ambiente corporativo com Secure Boot obrigatório
# - Compatibilidade máxima`}
      />

      <h2>Assinando Módulos do Kernel (DKMS)</h2>

      <CodeBlock
        title="Assinar módulos DKMS para Secure Boot"
        code={`# Módulos de terceiros (NVIDIA, VirtualBox) precisam ser assinados
# O sbctl faz isso automaticamente se configurado

# Verificar módulos não assinados
sudo sbctl verify

# Para módulos DKMS, criar hook de assinatura
# /etc/dkms/framework.conf.d/sign-modules.conf
mok_signing_key="/var/lib/sbctl/keys/db/db.key"
mok_certificate="/var/lib/sbctl/keys/db/db.pem"
sign_tool="/usr/bin/sbsign"

# Reconstruir módulos DKMS
sudo dkms autoinstall`}
      />

      <h2>Troubleshooting</h2>

      <CodeBlock
        title="Resolver problemas com Secure Boot"
        code={`# Sistema não boota após habilitar Secure Boot:
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
journalctl -b | grep -i secure`}
      />
    </PageContainer>
  );
}
