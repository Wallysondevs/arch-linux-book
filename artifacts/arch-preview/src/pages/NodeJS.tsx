import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function NodeJS() {
  return (
    <PageContainer
      title="Node.js no Arch"
      subtitle="Instale Node + npm direto do repo, ou use nvm/fnm para múltiplas versões. Conheça pnpm, yarn e o ecossistema completo."
      difficulty="iniciante"
      timeToRead="30 min"
      category="Linguagens"
    >
      <p>
        O Node.js é o runtime JavaScript do servidor — base de Express, Next.js, NestJS, Vite, etc.
        No Arch há duas formas: o pacote oficial <code>nodejs</code> (sempre na última LTS ou current)
        ou um gerenciador de versões para alternar entre Node 18, 20, 22, 24…
      </p>

      <h2>1. Instalação direta (versão única)</h2>

      <TerminalBlock
        command="sudo pacman -S nodejs npm"
        output={`resolving dependencies...
Packages (3) c-ares-1.33.1-1  nodejs-22.9.0-1  npm-10.9.0-1

Total Download Size:    16.84 MiB
Total Installed Size:   78.21 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="node --version && npm --version"
        output={`v22.9.0
10.9.0`}
      />

      <AlertBox type="info" title="LTS vs current">
        O pacote <code>nodejs</code> segue a versão atual (current). Se você precisa especificamente
        da LTS, instale <code>nodejs-lts-iron</code> (v20) ou <code>nodejs-lts-jod</code> (v22).
        Não dá pra ter as duas instaladas — para isso use <code>nvm</code>/<code>fnm</code>.
      </AlertBox>

      <h2>2. Múltiplas versões com nvm</h2>

      <TerminalBlock command="yay -S nvm" />

      <TerminalBlock
        comment="adicione no ~/.bashrc"
        command={`cat >> ~/.bashrc <<'EOF'
source /usr/share/nvm/init-nvm.sh
EOF
source ~/.bashrc`}
      />

      <TerminalBlock
        command="nvm install --lts"
        output={`Installing latest LTS version.
Downloading and installing node v22.9.0...
Downloading https://nodejs.org/dist/v22.9.0/node-v22.9.0-linux-x64.tar.xz...
######################################################################### 100%
Now using node v22.9.0 (npm v10.9.0)
Creating default alias: default -> lts/* (-> v22.9.0)`}
      />

      <TerminalBlock
        command="nvm install 18 && nvm install 20"
        output={`Downloading and installing node v18.20.4...
Now using node v18.20.4 (npm v10.7.0)
Downloading and installing node v20.18.0...
Now using node v20.18.0 (npm v10.8.2)`}
      />

      <TerminalBlock
        command="nvm ls"
        output={`        v18.20.4
        v20.18.0
->      v22.9.0
default -> lts/* (-> v22.9.0)
iojs -> N/A
unstable -> N/A
node -> stable (-> v22.9.0) (default)
stable -> 22.9 (-> v22.9.0) (default)
lts/* -> lts/jod (-> v22.9.0)
lts/argon -> v4.9.1 (-> N/A)
lts/iron -> v20.18.0`}
      />

      <TerminalBlock
        command="nvm use 18"
        output="Now using node v18.20.4 (npm v10.7.0)"
      />

      <h3>Alternativa: fnm (mais rápido, escrito em Rust)</h3>
      <TerminalBlock command="sudo pacman -S fnm" />
      <TerminalBlock
        command="fnm install --lts && fnm use 22"
        output={`Installing Node v22.9.0 (x64)
Using Node v22.9.0`}
      />

      <h2>3. npm — comandos do dia-a-dia</h2>

      <CommandFlagList
        command="npm"
        items={[
          { flag: "init", description: "Cria package.json interativo. -y para defaults.", example: "npm init -y" },
          { flag: "install", description: "Instala dependências do package.json. Sem args = todas.", example: "npm install express" },
          { flag: "i -D PKG", description: "Instala como devDependency (build tools, types)." },
          { flag: "i -g PKG", description: "Global (vai pra ~/.npm-global ou /usr/lib se sudo)." },
          { flag: "uninstall PKG", description: "Remove pacote." },
          { flag: "update", description: "Atualiza dependências respeitando semver." },
          { flag: "outdated", description: "Mostra pacotes com versão mais nova disponível." },
          { flag: "audit fix", description: "Corrige vulnerabilidades conhecidas." },
          { flag: "run SCRIPT", description: "Roda um script do package.json.", example: "npm run dev" },
          { flag: "ci", description: "Install determinístico (usa lockfile, falha se package-lock divergir)." },
          { flag: "exec PKG", description: "Roda binário sem instalar (= npx).", example: "npm exec create-vite@latest" },
        ]}
      />

      <h2>4. Iniciando um projeto</h2>

      <TerminalBlock
        command="mkdir hello-arch && cd hello-arch && npm init -y"
        output={`Wrote to /home/user/hello-arch/package.json:

{
  "name": "hello-arch",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`}
      />

      <TerminalBlock
        command="npm install express"
        output={`added 64 packages, and audited 65 packages in 3s

12 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`}
      />

      <CodeBlock
        title="index.js"
        language="js"
        code={`const express = require('express');
const app = express();

app.get('/', (_req, res) => res.json({ host: 'archlinux', node: process.version }));

app.listen(3000, () => console.log('http://127.0.0.1:3000'));`}
      />

      <TerminalBlock
        command="node index.js"
        output="http://127.0.0.1:3000"
      />

      <TerminalBlock
        comment="em outro terminal"
        command="curl -s http://127.0.0.1:3000"
        output={`{"host":"archlinux","node":"v22.9.0"}`}
      />

      <h2>5. pnpm — gerenciador rápido com hard links</h2>

      <TerminalBlock command="sudo pacman -S pnpm" />

      <TerminalBlock command="pnpm --version" output="9.12.0" />

      <p>
        O pnpm cria um <strong>store global</strong> em <code>~/.local/share/pnpm/store</code> e usa
        hard links em cada projeto. Resultado: instalações <strong>3-5× mais rápidas</strong> e
        <strong>economia massiva de disco</strong> (cada versão só ocupa espaço uma vez na máquina).
      </p>

      <TerminalBlock
        command="pnpm init && pnpm add react react-dom"
        output={`Wrote to /home/user/proj/package.json
 WARN  deprecated subset of dependencies has been added.
Packages: +5
+++++
Progress: resolved 8, reused 5, downloaded 0, added 5, done

dependencies:
+ react 18.3.1
+ react-dom 18.3.1`}
      />

      <CommandFlagList
        command="pnpm"
        items={[
          { flag: "add PKG", description: "Adiciona dependência (= npm install)." },
          { flag: "add -D PKG", description: "devDependency." },
          { flag: "add -g PKG", description: "Global (em ~/.local/share/pnpm/global)." },
          { flag: "remove PKG", description: "Remove." },
          { flag: "install", description: "Instala tudo do package.json + lockfile." },
          { flag: "dlx PKG", description: "Roda binário sem instalar (= npx).", example: "pnpm dlx create-vite@latest" },
          { flag: "store prune", description: "Remove versões não referenciadas no store global." },
          { flag: "-r SCRIPT", long: "--recursive", description: "Roda em todos os pacotes do workspace (monorepo)." },
        ]}
      />

      <h2>6. yarn — alternativa clássica</h2>

      <TerminalBlock command="sudo pacman -S yarn" />

      <TerminalBlock
        command="yarn --version"
        output="1.22.22"
      />

      <p>
        Para Yarn 2/3/4 (Berry), use o <code>corepack</code> que vem com o Node ≥16:
      </p>

      <TerminalBlock command="sudo corepack enable" />
      <TerminalBlock
        command="corepack prepare yarn@stable --activate"
        output="Preparing yarn@stable for immediate activation..."
      />

      <h2>7. Anatomia do package.json</h2>

      <CodeBlock
        title="package.json — exemplo completo"
        language="json"
        code={`{
  "name": "minha-app",
  "version": "1.2.3",
  "type": "module",
  "scripts": {
    "dev":   "vite",
    "build": "vite build && tsc --noEmit",
    "lint":  "eslint . --max-warnings=0",
    "test":  "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "typescript": "^5.6.0",
    "@types/react": "^18.3.10"
  },
  "engines": { "node": ">=20" }
}`}
      />

      <OutputBlock
        title="prefixos de versão"
        output={`"^18.3.1"   compatível: 18.x.x  (qualquer 18, mas não 19)
"~18.3.1"   patch only: 18.3.x   (não pula minor)
"18.3.1"    fixo
">=18 <20"  range manual
"latest"    sempre o mais novo (perigoso)
"file:../x" caminho local
"github:u/r" repositório git`}
      />

      <h2>8. Scripts: rodando tarefas</h2>

      <TerminalBlock
        command="npm run dev"
        output={`> minha-app@1.2.3 dev
> vite

  VITE v5.4.0  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`}
      />

      <TerminalBlock
        command="pnpm build"
        output={`> minha-app@1.2.3 build
> vite build && tsc --noEmit

vite v5.4.0 building for production...
✓ 24 modules transformed.
dist/index.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/index-7B3aF.css     12.42 kB │ gzip:  3.21 kB
dist/assets/index-9Z2cD.js     142.17 kB │ gzip: 47.84 kB
✓ built in 1.84s`}
      />

      <h2>9. npx / pnpm dlx — rodar sem instalar</h2>

      <TerminalBlock
        command="npx create-vite@latest meu-app -- --template react-ts"
        output={`Need to install the following packages:
  create-vite@5.5.2
Ok to proceed? (y) y

✔ Project name: … meu-app
✔ Select a framework: › React
✔ Select a variant:   › TypeScript
Done.

Now run:

  cd meu-app
  npm install
  npm run dev`}
      />

      <h2>10. Diagnóstico</h2>

      <TerminalBlock
        command="npm doctor"
        output={`Connecting to the registry
ok  
Checking npm version
ok  current: v10.9.0, latest: v10.9.0
Checking node version
ok  current: v22.9.0, recommended: v22.9.0
Checking configured npm registry
ok  using default registry (https://registry.npmjs.org/)
Checking for git executable in PATH
ok  /usr/bin/git
Verifying the npm cache
verifying cache contents
Verified contents of cache directory.
Checking npm cache folder permissions
ok  /home/user/.npm`}
      />

      <TerminalBlock
        command="npm ls --depth=0"
        output={`hello-arch@1.0.0 /home/user/hello-arch
└── express@4.21.0`}
      />

      <TerminalBlock
        command="npm outdated"
        output={`Package  Current   Wanted   Latest  Location              Depended by
express   4.21.0   4.21.0   5.0.1  node_modules/express  hello-arch`}
      />

      <h2>11. Troubleshooting clássico</h2>

      <TerminalBlock
        command="npm i -g create-vite"
        exitCode={1}
        output={`npm error code EACCES
npm error syscall mkdir
npm error path /usr/lib/node_modules/create-vite
npm error errno -13
npm error Error: EACCES: permission denied, mkdir '/usr/lib/node_modules/create-vite'`}
      />

      <p>
        Solução recomendada: configure um prefixo de usuário para globals (sem sudo):
      </p>

      <TerminalBlock
        command={`mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc && source ~/.bashrc`}
      />

      <TerminalBlock command="npm i -g create-vite" output="added 1 package in 1s" />

      <AlertBox type="warning" title="Cuidado com node_modules em backups">
        <code>node_modules/</code> pode ocupar centenas de MB e é totalmente reproduzível pelo
        lockfile. Sempre adicione no <code>.gitignore</code> e exclua dos backups (rsync com{" "}
        <code>--exclude='node_modules'</code>).
      </AlertBox>

      <h2>Cola visual</h2>
      <OutputBlock
        title="comandos essenciais"
        output={`# instalação
sudo pacman -S nodejs npm        # versão única
yay -S nvm                       # múltiplas versões
sudo pacman -S pnpm yarn         # gerenciadores alternativos

# começar
mkdir app && cd app && npm init -y
npm i express
node index.js

# scripts
npm run dev / build / test
pnpm dlx create-vite@latest

# diagnóstico
npm ls --depth=0
npm outdated
npm doctor`}
      />
    </PageContainer>
  );
}
