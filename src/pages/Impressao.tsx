import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Impressao() {
  return (
    <PageContainer
      title="Impressão (CUPS)"
      subtitle="Configure impressoras no Arch Linux usando CUPS: impressoras USB, de rede, Wi-Fi e compartilhamento."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <h2>O que é CUPS?</h2>
      <p>
        O <strong>CUPS</strong> (Common Unix Printing System) é o sistema de impressão padrão do Linux.
        Ele suporta impressoras USB, de rede e Wi-Fi, e oferece uma interface web para configuração.
      </p>

      <h2>Instalação</h2>

      <CodeBlock
        title="Instalar CUPS e drivers"
        code={`# Instalar CUPS
sudo pacman -S cups cups-pdf

# Drivers genéricos (cobrem a maioria das impressoras)
sudo pacman -S gutenprint foomatic-db foomatic-db-ppds

# Driver HP (impressoras HP)
sudo pacman -S hplip

# Driver Epson (do AUR)
yay -S epson-inkjet-printer-escpr

# Driver Brother (do AUR, verificar modelo)
yay -S brother-mfc-l2710dw

# Habilitar e iniciar CUPS
sudo systemctl enable --now cups

# Para descoberta automática de impressoras de rede
sudo pacman -S avahi nss-mdns
sudo systemctl enable --now avahi-daemon`}
      />

      <h2>Interface Web</h2>

      <CodeBlock
        title="Configurar via interface web"
        code={`# Acessar interface web do CUPS
# Abrir no navegador: http://localhost:631

# Adicionar impressora:
# 1. Ir em Administration → Add Printer
# 2. Selecionar a impressora detectada
# 3. Escolher o driver correto
# 4. Definir como padrão se desejado

# Se pedir autenticação, usar seu usuário (que deve estar no grupo sys)
sudo gpasswd -a usuario sys`}
      />

      <h2>Linha de Comando</h2>

      <CodeBlock
        title="Gerenciar impressão pelo terminal"
        code={`# Listar impressoras
lpstat -p -d

# Definir impressora padrão
lpoptions -d NomeDaImpressora

# Imprimir arquivo
lp documento.pdf
lp -d NomeDaImpressora documento.pdf

# Imprimir com opções
lp -n 2 documento.pdf          # 2 cópias
lp -o sides=two-sided-long-edge documento.pdf  # Frente e verso
lp -o media=A4 documento.pdf   # Papel A4
lp -o landscape documento.pdf  # Paisagem

# Ver fila de impressão
lpq

# Cancelar impressão
cancel -a                      # Cancelar tudo
cancel ID_DO_JOB               # Cancelar job específico

# Verificar status
lpstat -t`}
      />

      <h2>Impressora de Rede</h2>

      <CodeBlock
        title="Adicionar impressora de rede"
        code={`# Descobrir impressoras na rede
avahi-browse -a | grep Printer
# ou
lpinfo -v

# Adicionar via linha de comando
sudo lpadmin -p MInhaImpressora -E \\
  -v "ipp://192.168.1.50/ipp/print" \\
  -m everywhere

# Para impressoras HP de rede
hp-setup -i 192.168.1.50

# Definir como padrão
lpoptions -d MinhaImpressora`}
      />

      <h2>Troubleshooting</h2>

      <CodeBlock
        title="Resolver problemas de impressão"
        code={`# Ver logs do CUPS
journalctl -u cups -f

# Logs detalhados
sudo cupsctl --debug-logging
# Após diagnosticar, desabilitar:
sudo cupsctl --no-debug-logging

# Impressora não detectada (USB):
lsusb | grep -i print
sudo dmesg | grep -i print

# Reiniciar CUPS
sudo systemctl restart cups

# Remover e readicionar impressora
sudo lpadmin -x NomeDaImpressora
# Adicionar novamente via interface web`}
      />
    </PageContainer>
  );
}
