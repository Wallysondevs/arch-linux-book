import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JavaSdks() {
  return (
    <PageContainer
      title="Java, Flutter & SDKs"
      subtitle="Instale e gerencie Java (JDK/JRE), Flutter, Android SDK e outros SDKs de desenvolvimento no Arch Linux."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>Java no Arch Linux</h2>
      <p>
        O Arch Linux tem excelente suporte ao Java. Você pode instalar via pacman (recomendado) 
        ou manualmente baixando o binário da Oracle/Adoptium. O Arch tem um sistema próprio 
        para gerenciar múltiplas versões do Java: o <code>archlinux-java</code>.
      </p>

      <h3>Instalar Java via Pacman (Recomendado)</h3>
      <CodeBlock
        title="Instalar Java pelo pacman"
        code={`# OpenJDK (open-source, recomendado)
# Versão mais recente:
sudo pacman -S jdk-openjdk

# Apenas o runtime (JRE, se não precisa compilar):
sudo pacman -S jre-openjdk

# Versão LTS específica (Java 21):
sudo pacman -S jdk21-openjdk

# Versão 17 LTS:
sudo pacman -S jdk17-openjdk

# Versão 11 LTS:
sudo pacman -S jdk11-openjdk

# Verificar instalação
java --version
javac --version`}
      />

      <h3>Gerenciar Múltiplas Versões do Java</h3>
      <CodeBlock
        title="archlinux-java — gerenciar versões do Java"
        code={`# Ver versões instaladas e qual está ativa
archlinux-java status

# Exemplo de saída:
# Available Java environments:
#   java-11-openjdk
#   java-17-openjdk
#   java-21-openjdk (default)

# Mudar a versão ativa
sudo archlinux-java set java-17-openjdk

# Verificar
java --version
# openjdk 17.0.x ...

# Mudar de volta
sudo archlinux-java set java-21-openjdk

# Onde ficam as instalações:
ls /usr/lib/jvm/
# java-11-openjdk/  java-17-openjdk/  java-21-openjdk/`}
      />

      <AlertBox type="info" title="JAVA_HOME">
        O <code>archlinux-java</code> configura automaticamente o <code>JAVA_HOME</code> para a versão ativa.
        Se algum programa pedir, o valor é <code>/usr/lib/jvm/default</code> (symlink para a versão ativa).
        Adicione ao seu <code>~/.bashrc</code>: <code>export JAVA_HOME=/usr/lib/jvm/default</code>
      </AlertBox>

      <h3>Instalar Java Manualmente (Binário)</h3>
      <p>
        Se precisar de uma versão específica não disponível no pacman (como Oracle JDK proprietário),
        você pode baixar e instalar o binário manualmente.
      </p>

      <CodeBlock
        title="Instalar Java a partir do binário oficial"
        code={`# 1. Baixar do site oficial
# Oracle: https://www.oracle.com/java/technologies/downloads/
# Adoptium (Temurin): https://adoptium.net/
# Amazon Corretto: https://aws.amazon.com/corretto/

# Exemplo com Adoptium Temurin 21:
wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz

# 2. Extrair
tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz

# 3. Mover para /usr/lib/jvm (padrão do Arch)
sudo mv jdk-21.0.2+13 /usr/lib/jvm/temurin-21

# 4. Configurar como alternativa
sudo archlinux-java fix

# 5. Ou configurar manualmente no ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/temurin-21' >> ~/.bashrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 6. Verificar
java --version
which java`}
      />

      <CodeBlock
        title="Oracle JDK via AUR"
        code={`# Mais fácil: instalar Oracle JDK pelo AUR
yay -S jdk

# Ou versão específica
yay -S jdk17
yay -S jdk21

# O AUR cuida de tudo: download, instalação, integração com archlinux-java`}
      />

      <h2>Flutter no Arch Linux</h2>

      <h3>Instalar Flutter via Pacman</h3>
      <CodeBlock
        title="Instalar Flutter pelo repositório oficial"
        code={`# O Flutter está no repositório extra do Arch!
sudo pacman -S flutter

# Aceitar licenças do Android
flutter doctor --android-licenses

# Verificar instalação
flutter doctor

# O Flutter fica em /opt/flutter
# O PATH já é configurado automaticamente`}
      />

      <h3>Instalar Flutter Manualmente (Binário)</h3>
      <CodeBlock
        title="Instalar Flutter a partir do binário oficial"
        code={`# 1. Baixar do site oficial
# https://docs.flutter.dev/get-started/install/linux
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.19.0-stable.tar.xz

# 2. Extrair no local desejado
tar -xJf flutter_linux_3.19.0-stable.tar.xz

# 3. Mover para um local permanente
sudo mv flutter /opt/flutter
# Ou no home do usuário:
mv flutter ~/desenvolvimento/flutter

# 4. Adicionar ao PATH
echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.bashrc
# Ou para Zsh:
echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.zshrc
source ~/.bashrc

# 5. Verificar
flutter --version
flutter doctor

# 6. Configurar o Chrome (para desenvolvimento web)
echo 'export CHROME_EXECUTABLE=/usr/bin/google-chrome-stable' >> ~/.bashrc
# Ou para Chromium:
echo 'export CHROME_EXECUTABLE=/usr/bin/chromium' >> ~/.bashrc`}
      />

      <h3>Dependências do Flutter</h3>
      <CodeBlock
        title="Instalar tudo que o Flutter precisa"
        code={`# Dependências básicas
sudo pacman -S git curl unzip which

# Para desenvolvimento Android:
sudo pacman -S android-tools  # adb, fastboot

# Android Studio (IDE completa)
yay -S android-studio

# Ou apenas o Android SDK (sem IDE)
yay -S android-sdk android-sdk-platform-tools android-sdk-build-tools

# Configurar Android SDK
echo 'export ANDROID_HOME=~/Android/Sdk' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"' >> ~/.bashrc

# Para desenvolvimento Linux desktop:
sudo pacman -S clang cmake ninja pkg-config gtk3

# Para desenvolvimento web:
sudo pacman -S chromium
# ou
yay -S google-chrome

# Verificar tudo
flutter doctor -v`}
      />

      <h2>Android Studio</h2>

      <CodeBlock
        title="Instalar Android Studio"
        code={`# Via AUR (recomendado — gerencia atualizações)
yay -S android-studio

# Ou manualmente:
# 1. Baixar de https://developer.android.com/studio
wget https://dl.google.com/dl/android/studio/ide-zips/2024.1.1.1/android-studio-2024.1.1.1-linux.tar.gz

# 2. Extrair
tar -xzf android-studio-*.tar.gz

# 3. Mover para /opt
sudo mv android-studio /opt/android-studio

# 4. Criar atalho no menu
sudo tee /usr/share/applications/android-studio.desktop << 'EOF'
[Desktop Entry]
Name=Android Studio
Comment=IDE para desenvolvimento Android
Exec=/opt/android-studio/bin/studio.sh
Icon=/opt/android-studio/bin/studio.svg
Terminal=false
Type=Application
Categories=Development;IDE;
StartupWMClass=jetbrains-studio
EOF

# 5. Criar link para o executável
sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio

# Agora pode abrir pelo menu ou digitando: android-studio`}
      />

      <h2>Node.js & nvm</h2>

      <CodeBlock
        title="Gerenciar múltiplas versões do Node.js"
        code={`# Método 1: Via pacman (uma versão)
sudo pacman -S nodejs npm

# Método 2: nvm (gerenciador de versões — recomendado)
# Instalar nvm
yay -S nvm
# Ou manualmente:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Adicionar ao shell (se instalou manualmente)
echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.bashrc
source ~/.bashrc

# Instalar versões do Node
nvm install --lts        # Versão LTS mais recente
nvm install 20           # Versão 20 específica
nvm install node         # Versão mais recente

# Mudar versão ativa
nvm use 20
nvm use --lts

# Definir versão padrão
nvm alias default 20

# Listar versões instaladas
nvm ls`}
      />

      <h2>Python & pyenv</h2>

      <CodeBlock
        title="Gerenciar múltiplas versões do Python"
        code={`# Python do sistema (NÃO instale pip packages com sudo!)
sudo pacman -S python python-pip

# Para múltiplas versões, use pyenv
yay -S pyenv

# Adicionar ao shell
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init --path)"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Instalar versão específica
pyenv install 3.12.0

# Definir versão global
pyenv global 3.12.0

# Versão por projeto
cd meu-projeto
pyenv local 3.11.0`}
      />

      <AlertBox type="warning" title="NUNCA use sudo pip install">
        No Arch Linux, instalar pacotes Python com <code>sudo pip install</code> pode quebrar o sistema.
        Use sempre ambientes virtuais (<code>python -m venv</code>), <code>pipx</code> para ferramentas CLI,
        ou <code>pyenv</code> para gerenciar versões.
      </AlertBox>

      <h2>Go (Golang)</h2>

      <CodeBlock
        title="Instalar e configurar Go"
        code={`# Via pacman
sudo pacman -S go

# Configurar GOPATH
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH="$PATH:$GOPATH/bin"' >> ~/.bashrc
source ~/.bashrc

# Ou instalação manual do binário:
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
echo 'export PATH="$PATH:/usr/local/go/bin"' >> ~/.bashrc

# Verificar
go version`}
      />

      <h2>.NET / C#</h2>

      <CodeBlock
        title="Instalar .NET SDK"
        code={`# Via pacman
sudo pacman -S dotnet-sdk

# Ou versão específica via AUR
yay -S dotnet-sdk-8.0

# Verificar
dotnet --version

# Ou instalação manual:
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0
echo 'export PATH="$PATH:$HOME/.dotnet"' >> ~/.bashrc`}
      />

      <h2>Dicas Gerais para SDKs</h2>

      <CodeBlock
        title="Boas práticas para instalar SDKs"
        code={`# 1. Organização — criar pasta para SDKs manuais
mkdir -p ~/desenvolvimento/sdks

# 2. Usar /opt para instalações globais
# /opt/flutter, /opt/android-studio, /opt/jdk-21

# 3. Prefira gerenciadores de versão
# Java: archlinux-java (nativo do Arch)
# Node: nvm ou fnm
# Python: pyenv
# Ruby: rbenv ou rvm
# Rust: rustup (já é gerenciador)

# 4. Centralizar variáveis de ambiente
# Criar arquivo separado para SDKs
cat > ~/.sdk-env << 'EOF'
export JAVA_HOME=/usr/lib/jvm/default
export FLUTTER_HOME=/opt/flutter
export ANDROID_HOME=~/Android/Sdk
export GOPATH=~/go
export PATH="$JAVA_HOME/bin:$FLUTTER_HOME/bin:$ANDROID_HOME/tools:$GOPATH/bin:$PATH"
EOF

# Carregar no .bashrc
echo 'source ~/.sdk-env' >> ~/.bashrc

# 5. Verificar tudo
echo "Java: $(java --version 2>&1 | head -1)"
echo "Flutter: $(flutter --version 2>&1 | head -1)"
echo "Node: $(node --version 2>/dev/null || echo 'não instalado')"
echo "Python: $(python --version)"
echo "Go: $(go version 2>/dev/null || echo 'não instalado')"
echo "Rust: $(rustc --version 2>/dev/null || echo 'não instalado')"`}
      />
    </PageContainer>
  );
}
