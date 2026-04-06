import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as r}from"./CodeBlock-DEDRw1y6.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return e.jsxs(o,{title:"Impressão (CUPS)",subtitle:"Configure impressoras no Arch Linux usando CUPS: impressoras USB, de rede, Wi-Fi e compartilhamento.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx("h2",{children:"O que é CUPS?"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"CUPS"})," (Common Unix Printing System) é o sistema de impressão padrão do Linux. Ele suporta impressoras USB, de rede e Wi-Fi, e oferece uma interface web para configuração."]}),e.jsx("h2",{children:"Instalação"}),e.jsx(r,{title:"Instalar CUPS e drivers",code:`# Instalar CUPS
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
sudo systemctl enable --now avahi-daemon`}),e.jsx("h2",{children:"Interface Web"}),e.jsx(r,{title:"Configurar via interface web",code:`# Acessar interface web do CUPS
# Abrir no navegador: http://localhost:631

# Adicionar impressora:
# 1. Ir em Administration → Add Printer
# 2. Selecionar a impressora detectada
# 3. Escolher o driver correto
# 4. Definir como padrão se desejado

# Se pedir autenticação, usar seu usuário (que deve estar no grupo sys)
sudo gpasswd -a usuario sys`}),e.jsx("h2",{children:"Linha de Comando"}),e.jsx(r,{title:"Gerenciar impressão pelo terminal",code:`# Listar impressoras
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
lpstat -t`}),e.jsx("h2",{children:"Impressora de Rede"}),e.jsx(r,{title:"Adicionar impressora de rede",code:`# Descobrir impressoras na rede
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
lpoptions -d MinhaImpressora`}),e.jsx("h2",{children:"Troubleshooting"}),e.jsx(r,{title:"Resolver problemas de impressão",code:`# Ver logs do CUPS
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
# Adicionar novamente via interface web`})]})}export{m as default};
