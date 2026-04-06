import{j as a}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function d(){return a.jsxs(o,{title:"Rust no Arch Linux",subtitle:"A linguagem de sistemas mais amada. Instale Rust com rustup, use Cargo, compile binários nativos e descubra o ecossistema de ferramentas modernas escritas em Rust.",difficulty:"intermediario",timeToRead:"15 min",children:[a.jsx("h2",{children:"Instalando Rust com rustup"}),a.jsxs("p",{children:["O método oficial e recomendado para instalar Rust é via ",a.jsx("code",{children:"rustup"}),", o gerenciador de toolchains Rust. Não use o pacman para Rust — o rustup gerencia versões muito melhor."]}),a.jsx(e,{title:"Instalar Rust via rustup",code:`# Instalar rustup (método oficial)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Ou via pacman (instala rustup sem o Rust em si)
sudo pacman -S rustup
rustup default stable

# Recarregar PATH
source ~/.cargo/env
# ou:
source $HOME/.cargo/env

# Verificar instalação
rustc --version      # Compilador
cargo --version      # Gerenciador de pacotes e build system
rustup --version     # Gerenciador de toolchains`}),a.jsx("h2",{children:"Gerenciar Toolchains"}),a.jsx(e,{title:"Múltiplas versões do Rust",code:`# Componentes instalados
rustup show

# Atualizar Rust
rustup update

# Instalar toolchains adicionais
rustup install stable     # Versão estável (padrão)
rustup install nightly    # Versão nightly (recursos experimentais)
rustup install 1.75.0     # Versão específica

# Definir padrão
rustup default stable
rustup default nightly

# Usar versão específica em um projeto
rustup override set nightly   # No diretório atual

# Arquivo rust-toolchain.toml no projeto:
# [toolchain]
# channel = "nightly"

# Adicionar componentes
rustup component add clippy        # Linter
rustup component add rustfmt       # Formatador
rustup component add rust-analyzer # LSP (IDE support)

# Compilar para outras plataformas (cross-compilation)
rustup target add x86_64-pc-windows-gnu    # Compilar para Windows
rustup target add aarch64-unknown-linux-gnu # ARM64`}),a.jsx("h2",{children:"Cargo - O Build System do Rust"}),a.jsx(e,{title:"Usar o Cargo",code:`# Criar novo projeto
cargo new meu-projeto       # Binário (executável)
cargo new --lib minha-lib   # Biblioteca

# Estrutura do projeto:
# meu-projeto/
# ├── Cargo.toml    ← Manifesto do projeto
# ├── Cargo.lock    ← Versões exatas das dependências
# └── src/
#     └── main.rs   ← Código fonte

# Compilar
cargo build              # Debug (mais rápido, sem otimização)
cargo build --release    # Release (otimizado para produção)

# Compilar e executar
cargo run
cargo run --release
cargo run -- arg1 arg2   # Passar argumentos ao programa

# Testes
cargo test               # Rodar todos os testes
cargo test nome_teste    # Teste específico
cargo test --release     # Testes em modo release

# Verificar código sem compilar (muito mais rápido)
cargo check

# Documentação
cargo doc                # Gerar documentação
cargo doc --open         # Gerar e abrir no navegador

# Formatação
cargo fmt                # Formatar código

# Linting
cargo clippy             # Linter avançado

# Benchmarks
cargo bench`}),a.jsx("h2",{children:"Cargo.toml - Configuração do Projeto"}),a.jsx(e,{title:"Cargo.toml",code:`[package]
name = "meu-projeto"
version = "0.1.0"
edition = "2021"
authors = ["Seu Nome <email@exemplo.com>"]
description = "Descrição do projeto"
license = "MIT"

[dependencies]
# Crates (pacotes) externos
serde = { version = "1.0", features = ["derive"] }    # Serialização
serde_json = "1.0"    # JSON
tokio = { version = "1.0", features = ["full"] }      # Async runtime
reqwest = { version = "0.12", features = ["json"] }   # HTTP client
clap = { version = "4.0", features = ["derive"] }     # Argumentos CLI
anyhow = "1.0"        # Tratamento de erros

[dev-dependencies]
# Apenas para testes
proptest = "1.0"
mockall = "0.12"

[profile.release]
opt-level = 3        # Otimização máxima
lto = true           # Link-Time Optimization
codegen-units = 1    # Melhor otimização, compilação mais lenta`}),a.jsx("h2",{children:"Ferramentas da Comunidade Rust"}),a.jsx("p",{children:"O Rust tem um ecossistema incrível de ferramentas escritas em Rust que você pode instalar no Arch Linux e usar no dia a dia:"}),a.jsx(e,{title:"Ferramentas Rust essenciais",code:`# Instalar ferramentas via cargo
cargo install cargo-update   # Atualizar binários instalados
cargo install cargo-expand   # Expandir macros
cargo install cargo-audit    # Verificar vulnerabilidades
cargo install cargo-outdated # Ver dependências desatualizadas

# === Substitutos modernos para ferramentas clássicas ===

# bat - cat com syntax highlighting
sudo pacman -S bat
bat arquivo.rs

# eza - ls moderno
sudo pacman -S eza
eza -la
eza --tree --level 2

# ripgrep - grep ultrarrápido
sudo pacman -S ripgrep
rg "fn main" src/
rg -t rust "use std" .

# fd - find moderno
sudo pacman -S fd
fd "*.rs" src/
fd -e toml .

# dust - du moderno
sudo pacman -S dust
dust /home

# bottom (btm) - htop moderno
sudo pacman -S bottom
btm

# zoxide - cd com salto inteligente
sudo pacman -S zoxide
# Adicionar ao ~/.bashrc: eval "$(zoxide init bash)"
z projetos    # Pula para o diretório 'projetos' mais usado

# starship - prompt shell ultra-rápido
sudo pacman -S starship
# Adicionar ao ~/.bashrc: eval "$(starship init bash)"`}),a.jsx("h2",{children:"Cross-Compilation"}),a.jsx(e,{title:"Compilar para outras plataformas",code:`# Compilar para Windows a partir do Linux
rustup target add x86_64-pc-windows-gnu
sudo pacman -S mingw-w64-gcc    # Linker para Windows

# Configurar em .cargo/config.toml:
[target.x86_64-pc-windows-gnu]
linker = "x86_64-w64-mingw32-gcc"

# Compilar
cargo build --target x86_64-pc-windows-gnu --release
# Resultado em: target/x86_64-pc-windows-gnu/release/meu-projeto.exe

# Para ARM (Raspberry Pi):
rustup target add armv7-unknown-linux-gnueabihf
sudo pacman -S arm-linux-gnueabihf-gcc

[target.armv7-unknown-linux-gnueabihf]
linker = "arm-linux-gnueabihf-gcc"

cargo build --target armv7-unknown-linux-gnueabihf --release`})]})}export{d as default};
