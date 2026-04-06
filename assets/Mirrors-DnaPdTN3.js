import{j as r}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return r.jsxs(s,{title:"Mirrors & Reflector",subtitle:"Como configurar, otimizar e manter os espelhos (mirrors) do Arch Linux para downloads mais rápidos e confiáveis.",difficulty:"iniciante",timeToRead:"15 min",children:[r.jsx("h2",{children:"O que são Mirrors?"}),r.jsxs("p",{children:["Mirrors (espelhos) são servidores distribuídos ao redor do mundo que hospedam cópias dos repositórios oficiais do Arch Linux. Quando você roda ",r.jsx("code",{children:"pacman -Syu"}),", o pacman baixa os pacotes de um desses espelhos. Escolher espelhos rápidos e atualizados é crucial para uma experiência fluida."]}),r.jsx("h2",{children:"O Arquivo mirrorlist"}),r.jsxs("p",{children:["A lista de espelhos fica em ",r.jsx("code",{children:"/etc/pacman.d/mirrorlist"}),". O pacman usa os espelhos nesta ordem — o primeiro da lista tem prioridade."]}),r.jsx(e,{title:"Ver a lista atual de mirrors",code:"cat /etc/pacman.d/mirrorlist"}),r.jsx(e,{title:"Fazer backup antes de modificar",code:"sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup"}),r.jsx(o,{type:"warning",title:"Sempre faça backup",children:"Antes de modificar o mirrorlist, sempre faça uma cópia de segurança. Se todos os mirrors falharem, você não conseguirá instalar nada."}),r.jsx("h2",{children:"Reflector — Automação Inteligente"}),r.jsxs("p",{children:["O ",r.jsx("code",{children:"reflector"})," é uma ferramenta que busca os mirrors mais recentes da lista oficial do Arch Linux, filtra por critérios como velocidade, país e protocolo, e gera um mirrorlist otimizado automaticamente."]}),r.jsx(e,{title:"Instalar o reflector",code:"sudo pacman -S reflector"}),r.jsx(e,{title:"Gerar mirrorlist com os 10 mirrors mais rápidos do Brasil",code:`sudo reflector --country Brazil \\
  --age 12 \\
  --protocol https \\
  --sort rate \\
  --number 10 \\
  --save /etc/pacman.d/mirrorlist`}),r.jsx("p",{children:"Explicação dos parâmetros:"}),r.jsxs("ul",{children:[r.jsxs("li",{children:[r.jsx("code",{children:"--country Brazil"})," — filtra apenas mirrors brasileiros"]}),r.jsxs("li",{children:[r.jsx("code",{children:"--age 12"})," — apenas mirrors sincronizados nas últimas 12 horas"]}),r.jsxs("li",{children:[r.jsx("code",{children:"--protocol https"})," — usa apenas conexões seguras HTTPS"]}),r.jsxs("li",{children:[r.jsx("code",{children:"--sort rate"})," — ordena por velocidade de download"]}),r.jsxs("li",{children:[r.jsx("code",{children:"--number 10"})," — seleciona os 10 melhores"]}),r.jsxs("li",{children:[r.jsx("code",{children:"--save"})," — salva diretamente no mirrorlist"]})]}),r.jsx(e,{title:"Usar mirrors de vários países da América do Sul",code:`sudo reflector --country Brazil,Argentina,Chile \\
  --age 24 \\
  --protocol https \\
  --sort rate \\
  --number 20 \\
  --save /etc/pacman.d/mirrorlist`}),r.jsx(e,{title:"Mirrors mais rápidos do mundo (sem filtro de país)",code:`sudo reflector \\
  --latest 50 \\
  --age 12 \\
  --protocol https \\
  --sort rate \\
  --number 20 \\
  --save /etc/pacman.d/mirrorlist`}),r.jsx("h2",{children:"Listar Países Disponíveis"}),r.jsx(e,{title:"Ver todos os países com mirrors disponíveis",code:"reflector --list-countries"}),r.jsx("h2",{children:"Reflector Automático com Systemd"}),r.jsx("p",{children:"Você pode configurar o reflector para atualizar os mirrors automaticamente usando um timer do systemd."}),r.jsx(e,{title:"Configurar o reflector como serviço",code:`# Editar a configuração do reflector
sudo vim /etc/xdg/reflector/reflector.conf

# Conteúdo recomendado:
--save /etc/pacman.d/mirrorlist
--country Brazil
--protocol https
--latest 10
--sort rate
--age 12`}),r.jsx(e,{title:"Habilitar o timer do reflector",code:`# Habilitar e iniciar o timer (atualiza semanalmente)
sudo systemctl enable --now reflector.timer

# Executar manualmente uma vez
sudo systemctl start reflector.service

# Verificar status
systemctl status reflector.timer
systemctl status reflector.service`}),r.jsx("h2",{children:"Testar Velocidade dos Mirrors Manualmente"}),r.jsx(e,{title:"Usando rankmirrors (pacman-contrib)",code:`# Instalar pacman-contrib
sudo pacman -S pacman-contrib

# Fazer backup
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup

# Descommentar todos os mirrors e ranquear os 6 mais rápidos
sed -e 's/^#Server/Server/' -e '/^#/d' /etc/pacman.d/mirrorlist.backup | \\
  rankmirrors -n 6 - | \\
  sudo tee /etc/pacman.d/mirrorlist`}),r.jsx("h2",{children:"Verificar Status dos Mirrors"}),r.jsx(e,{title:"Verificar a saúde dos mirrors",code:`# Ver quando o mirror foi sincronizado pela última vez
curl -s 'https://archlinux.org/mirrors/status/json/' | python -m json.tool | head -50

# Ou acessar a página web
# https://archlinux.org/mirrors/status/`}),r.jsxs(o,{type:"info",title:"Dica importante",children:["Após alterar o mirrorlist, sempre force a atualização do banco de dados de pacotes com",r.jsx("code",{children:"sudo pacman -Syyu"})," (dois ",r.jsx("code",{children:"y"})," para forçar o refresh)."]}),r.jsx("h2",{children:"Mirrors para Repositórios Específicos"}),r.jsxs("p",{children:["Você também pode configurar mirrors diferentes para repositórios específicos diretamente no ",r.jsx("code",{children:"/etc/pacman.conf"}),":"]}),r.jsx(e,{title:"Configurar mirror específico por repositório",code:`# Em /etc/pacman.conf, você pode adicionar:
[core]
Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch

[extra]
Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch

# $repo será substituído pelo nome do repositório (core, extra)
# $arch será substituído pela arquitetura (x86_64)`}),r.jsx("h2",{children:"Troubleshooting de Mirrors"}),r.jsx(e,{title:"Problemas comuns e soluções",code:`# Erro: "failed to update core" ou "unable to lock database"
# Solução 1: Remover lock file
sudo rm /var/lib/pacman/db.lck

# Erro: "error: failed retrieving file" 
# Solução: Atualizar mirrors
sudo reflector --country Brazil --sort rate --number 10 --save /etc/pacman.d/mirrorlist
sudo pacman -Syyu

# Erro: "signature is unknown trust"
# Solução: Atualizar keyring
sudo pacman -S archlinux-keyring
sudo pacman -Syyu`})]})}export{p as default};
