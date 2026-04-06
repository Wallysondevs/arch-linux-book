import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as n}from"./CodeBlock-DEDRw1y6.js";import{A as t}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function c(){return e.jsxs(s,{title:"Node.js no Arch Linux",subtitle:"Instale e gerencie Node.js com nvm e fnm, trabalhe com npm, pnpm e yarn, e configure um ambiente de desenvolvimento JavaScript/TypeScript completo.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx("h2",{children:"Instalando Node.js"}),e.jsx("p",{children:"Existem três formas principais de instalar Node.js no Arch Linux, cada uma com seus casos de uso:"}),e.jsx("h3",{children:"1. Via Pacman (versão estável)"}),e.jsx(n,{title:"Node.js via pacman",code:`# Instalar Node.js LTS do repositório
sudo pacman -S nodejs npm

# Verificar versão
node --version
npm --version

# Instalar Node.js atual (sempre mais recente)
sudo pacman -S nodejs-current npm`}),e.jsx("h3",{children:"2. Via nvm (recomendado para desenvolvedores)"}),e.jsx(n,{title:"Usar nvm para múltiplas versões",code:`# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Adicionar ao ~/.bashrc (normalmente feito automaticamente)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
source ~/.bashrc

# Instalar versões do Node.js
nvm install node       # Última versão
nvm install --lts      # LTS mais recente
nvm install 20.18.0    # Versão específica
nvm install 18         # Última v18

# Listar versões instaladas
nvm ls

# Usar uma versão
nvm use 20
nvm use --lts
nvm use node   # Mais recente

# Definir padrão
nvm alias default 20

# Ver versão atual
node --version`}),e.jsx("h3",{children:"3. Via fnm (mais rápido que nvm)"}),e.jsx(n,{title:"fnm - Fast Node Manager",code:`# Instalar fnm
sudo pacman -S fnm

# Configurar no ~/.bashrc
eval "$(fnm env --use-on-cd)"

# Instalar Node.js
fnm install --lts
fnm install 20
fnm install 18

# Usar versão
fnm use 20
fnm default 20

# Arquivo .node-version ou .nvmrc no projeto (auto-load)
echo "20" > .node-version`}),e.jsx("h2",{children:"Gerenciadores de Pacotes"}),e.jsx(n,{title:"npm, pnpm e yarn",code:`# === npm (incluído com Node.js) ===

# Instalar pacote localmente (projeto)
npm install express
npm install --save-dev typescript jest

# Instalar globalmente (ferramentas de linha de comando)
npm install -g typescript ts-node nodemon

# Ver pacotes globais
npm list -g --depth=0

# Scripts do projeto
npm run dev
npm run build
npm test

# === pnpm (mais eficiente - recomendado) ===

# Instalar pnpm
sudo pacman -S pnpm
# ou: npm install -g pnpm

# Uso similar ao npm
pnpm install
pnpm add express
pnpm add --save-dev typescript
pnpm run dev

# === yarn ===

# Instalar yarn
sudo pacman -S yarn

# Uso
yarn install
yarn add express
yarn dev`}),e.jsx("h2",{children:"TypeScript"}),e.jsx(n,{title:"Configurar TypeScript",code:`# Instalar TypeScript globalmente
npm install -g typescript

# Verificar versão
tsc --version

# Criar projeto TypeScript
mkdir meu-projeto && cd meu-projeto
npm init -y
npm install --save-dev typescript @types/node ts-node

# Inicializar tsconfig
npx tsc --init

# Ou criar tsconfig.json manualmente:
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Compilar
tsc
# Watch mode
tsc --watch

# Rodar TypeScript diretamente
ts-node src/index.ts`}),e.jsx("h2",{children:"Ferramentas Essenciais"}),e.jsx(n,{title:"Ferramentas de desenvolvimento Node.js",code:`# Prettier - Formatação de código
npm install -g prettier

# ESLint - Linting
npm install -g eslint

# Nodemon - Reiniciar servidor automaticamente
npm install -g nodemon
nodemon src/index.js

# PM2 - Gerenciador de processos em produção
npm install -g pm2
pm2 start app.js --name meu-app
pm2 start app.js --watch    # Watch mode
pm2 logs meu-app
pm2 list
pm2 startup   # Iniciar no boot do sistema

# http-server - Servidor HTTP simples
npm install -g http-server
http-server ./public -p 8080

# Verificar vulnerabilidades no projeto
npm audit
npm audit fix`}),e.jsxs(t,{type:"info",title:"Node.js com processos do sistema",children:["Para scripts Node.js que precisam de acesso ao sistema (como ouvir na porta 80), não rode como root. Em vez disso, use ",e.jsx("code",{children:"authbind"})," ou configure redirecionamento de porta com iptables/nftables: ",e.jsx("code",{children:"iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000"})]})]})}export{c as default};
