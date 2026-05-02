import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Java() {
  return (
    <PageContainer
      title="Java no Arch"
      subtitle="Múltiplas JDKs convivendo, archlinux-java para alternar versões, javac/java/jar, Maven e Gradle."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Linguagens"
    >
      <p>
        O Arch oferece <strong>várias versões da OpenJDK</strong> simultaneamente, e fornece um
        utilitário próprio — <code>archlinux-java</code> — para escolher qual delas é a "padrão" do
        sistema. Isso evita o cipoal de <code>update-alternatives</code> de outras distros.
      </p>

      <AlertBox type="info" title="Pacotes que importam">
        <code>jre-openjdk</code> (runtime) · <code>jdk-openjdk</code> (compilador + runtime, versão atual) ·
        <code>jdk21-openjdk</code> · <code>jdk17-openjdk</code> · <code>jdk11-openjdk</code> ·
        <code>jdk8-openjdk</code> (LTS antigas). Para builds, instale o <strong>jdk-*</strong>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S jdk-openjdk"
        output={`resolving dependencies...
Packages (3) java-environment-common-3-5  java-runtime-common-3-5
             jdk-openjdk-23.0.1.u11-1

Total Download Size:    192.42 MiB
Total Installed Size:   315.11 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="java --version && javac --version"
        output={`openjdk 23.0.1 2024-10-15
OpenJDK Runtime Environment (build 23.0.1+11)
OpenJDK 64-Bit Server VM (build 23.0.1+11, mixed mode, sharing)
javac 23.0.1`}
      />

      <h3>Instalando múltiplas versões</h3>

      <TerminalBlock
        command="sudo pacman -S jdk21-openjdk jdk17-openjdk"
        output={`Packages (2) jdk17-openjdk-17.0.13.u11-1  jdk21-openjdk-21.0.5.u11-1
Total Installed Size:  611.42 MiB`}
      />

      <h2>2. archlinux-java — alternando entre JDKs</h2>

      <TerminalBlock
        command="archlinux-java status"
        output={`Available Java environments:
  java-17-openjdk
  java-21-openjdk
  java-23-openjdk (default)`}
      />

      <TerminalBlock
        command="sudo archlinux-java set java-21-openjdk"
      />

      <TerminalBlock
        command="java --version"
        output={`openjdk 21.0.5 2024-10-15 LTS
OpenJDK Runtime Environment (build 21.0.5+11-LTS)
OpenJDK 64-Bit Server VM (build 21.0.5+11-LTS, mixed mode, sharing)`}
      />

      <CommandFlagList
        command="archlinux-java"
        items={[
          { flag: "status", description: "Lista JDKs disponíveis e marca a default." },
          { flag: "get", description: "Apenas o nome da JDK ativa.", example: "archlinux-java get" },
          { flag: "set NAME", description: "Define a default (precisa sudo).", example: "sudo archlinux-java set java-17-openjdk" },
          { flag: "unset", description: "Remove os symlinks (sem default)." },
          { flag: "fix", description: "Recria symlinks (após problema)." },
        ]}
      />

      <h3>Como funciona — symlinks em /usr/lib/jvm/default</h3>

      <TerminalBlock
        command="ls -l /usr/lib/jvm/"
        output={`drwxr-xr-x 9 root root 4096 Mar 25 16:54 java-17-openjdk
drwxr-xr-x 9 root root 4096 Mar 25 16:54 java-21-openjdk
drwxr-xr-x 9 root root 4096 Mar 25 16:54 java-23-openjdk
lrwxrwxrwx 1 root root   15 Mar 25 16:55 default -> java-21-openjdk
lrwxrwxrwx 1 root root   19 Mar 25 16:55 default-runtime -> java-21-openjdk/`}
      />

      <TerminalBlock
        command="readlink -f $(which java)"
        output="/usr/lib/jvm/java-21-openjdk/bin/java"
      />

      <h3>JAVA_HOME para builds</h3>

      <TerminalBlock
        comment="exporte uma vez no ~/.bashrc"
        command={`echo 'export JAVA_HOME=/usr/lib/jvm/default' >> ~/.bashrc && source ~/.bashrc`}
      />

      <TerminalBlock command="echo $JAVA_HOME" output="/usr/lib/jvm/default" />

      <h2>3. Hello world — javac, java, jar</h2>

      <CodeBlock
        title="Hello.java"
        language="java"
        code={`public class Hello {
    public static void main(String[] args) {
        String host = System.getProperty("os.name");
        System.out.printf("Olá do %s, Java %s%n",
            host, Runtime.version());
    }
}`}
      />

      <TerminalBlock
        comment="compila → Hello.class"
        command="javac Hello.java"
      />

      <TerminalBlock
        command="java Hello"
        output="Olá do Linux, Java 21.0.5+11-LTS"
      />

      <h3>Empacotando em .jar</h3>

      <CodeBlock
        title="MANIFEST.MF"
        code={`Manifest-Version: 1.0
Main-Class: Hello`}
      />

      <TerminalBlock
        command="jar cfm hello.jar MANIFEST.MF Hello.class"
      />

      <TerminalBlock
        command="java -jar hello.jar"
        output="Olá do Linux, Java 21.0.5+11-LTS"
      />

      <TerminalBlock
        command="jar tf hello.jar"
        output={`META-INF/
META-INF/MANIFEST.MF
Hello.class`}
      />

      <h3>Single-file run (Java 11+)</h3>

      <TerminalBlock
        comment="dispensa javac para programas de 1 arquivo"
        command="java Hello.java"
        output="Olá do Linux, Java 21.0.5+11-LTS"
      />

      <h2>4. Maven</h2>

      <TerminalBlock command="sudo pacman -S maven" />

      <TerminalBlock
        command="mvn --version"
        output={`Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Maven home: /usr/share/maven
Java version: 21.0.5, vendor: Arch Linux, runtime: /usr/lib/jvm/java-21-openjdk
Default locale: pt_BR, platform encoding: UTF-8
OS name: "linux", version: "6.12.1-arch1-1", arch: "amd64", family: "unix"`}
      />

      <TerminalBlock
        command={`mvn archetype:generate -DgroupId=com.exemplo -DartifactId=app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`}
        output={`[INFO] Scanning for projects...
[INFO] ------------------< org.apache.maven:standalone-pom >-------------------
[INFO] Building Maven Stub Project (No POM) 1
[INFO] --- maven-archetype-plugin:3.2.1:generate (default-cli) @ standalone-pom ---
[INFO] Generating project in Batch mode
[INFO] Project created from Archetype in dir: /home/user/app
[INFO] BUILD SUCCESS
[INFO] Total time:  4.121 s`}
      />

      <CodeBlock
        title="app/pom.xml (trecho)"
        language="xml"
        code={`<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`}
      />

      <TerminalBlock
        command="cd app && mvn package"
        output={`[INFO] Scanning for projects...
[INFO] ----< com.exemplo:app >-----
[INFO] Building app 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) @ app ---
[INFO] --- maven-compiler-plugin:3.13.0:compile (default-compile) @ app ---
[INFO] Compiling 1 source file with javac [debug target 21] to target/classes
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ app ---
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] --- maven-jar-plugin:3.4.1:jar (default-jar) @ app ---
[INFO] Building jar: /home/user/app/target/app-1.0-SNAPSHOT.jar
[INFO] BUILD SUCCESS
[INFO] Total time:  6.412 s`}
      />

      <CommandFlagList
        command="mvn (lifecycle phases)"
        items={[
          { flag: "clean", description: "Apaga target/." },
          { flag: "compile", description: "Compila src/main/java." },
          { flag: "test", description: "Roda src/test/java." },
          { flag: "package", description: "Gera o .jar/.war em target/." },
          { flag: "verify", description: "Roda integration tests." },
          { flag: "install", description: "Coloca artefato em ~/.m2/repository." },
          { flag: "dependency:tree", description: "Mostra árvore de dependências.", example: "mvn dependency:tree" },
          { flag: "exec:java", description: "Roda main class.", example: "mvn exec:java -Dexec.mainClass=com.exemplo.App" },
        ]}
      />

      <h2>5. Gradle</h2>

      <TerminalBlock command="sudo pacman -S gradle" />

      <TerminalBlock
        command="gradle --version"
        output={`
------------------------------------------------------------
Gradle 8.10.2
------------------------------------------------------------

Build time:    2024-09-23 21:28:39 UTC
Kotlin:        1.9.24
Groovy:        3.0.22
Ant:           Apache Ant(TM) version 1.10.14 compiled on August 16 2023
Launcher JVM:  21.0.5 (Arch Linux 21.0.5+11-LTS)
Daemon JVM:    /usr/lib/jvm/default
OS:            Linux 6.12.1-arch1-1 amd64`}
      />

      <TerminalBlock
        command="gradle init --type java-application --dsl kotlin"
        output={`Project name (default: app): meu-app
Source package (default: meu.app): com.exemplo
Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no): no

> Task :init
Get more help with your project: https://docs.gradle.org/8.10.2/samples/sample_building_java_applications.html

BUILD SUCCESSFUL in 2s`}
      />

      <CodeBlock
        title="build.gradle.kts"
        language="kotlin"
        code={`plugins {
    application
    id("org.jetbrains.kotlin.jvm") version "1.9.24" apply false
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.guava:guava:33.3.1-jre")
    testImplementation("org.junit.jupiter:junit-jupiter:5.11.0")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

application {
    mainClass.set("com.exemplo.App")
}

tasks.test { useJUnitPlatform() }`}
      />

      <TerminalBlock
        command="gradle build"
        output={`> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes
> Task :jar
> Task :startScripts
> Task :distTar
> Task :distZip
> Task :assemble
> Task :compileTestJava
> Task :testClasses
> Task :test

BUILD SUCCESSFUL in 8s
8 actionable tasks: 8 executed`}
      />

      <TerminalBlock
        command="gradle run"
        output={`> Task :run
Hello World!

BUILD SUCCESSFUL in 1s
2 actionable tasks: 1 executed, 1 up-to-date`}
      />

      <h2>6. Maven vs Gradle — qual escolher?</h2>

      <OutputBlock
        title="comparativo"
        output={`critério                Maven                  Gradle
----------------------  ---------------------  ---------------------
sintaxe                 XML (verboso)          Kotlin/Groovy DSL
performance build       boa                    excelente (cache)
ecossistema             enorme, padrão Java    enorme (Android)
curva de aprendizado    baixa                  média
configuração simples    pom.xml de 30 linhas   build.gradle de 15
plugins                 mvn xxx:plugin         tasks customizáveis
incremental builds      limitado               nativo
quando usar             projetos corporativos  Android / multi-projeto`}
      />

      <h2>7. SDKMAN! — alternativa multiversão (AUR)</h2>

      <p>
        Se você quer JDKs da Oracle, GraalVM, Amazon Corretto, etc, sem ficar caçando AURs, use o
        <code> sdkman</code>:
      </p>

      <TerminalBlock command="curl -s 'https://get.sdkman.io' | bash" />

      <TerminalBlock
        command="source ~/.sdkman/bin/sdkman-init.sh && sdk list java | head -10"
        output={`================================================================================
Available Java Versions for Linux 64bit
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 Corretto      |     | 21.0.5       | amzn    |            | 21.0.5-amzn
 GraalVM CE    |     | 23.0.1       | graalce |            | 23.0.1-graalce
 GraalVM Oracle|     | 21.0.5       | graal   |            | 21.0.5-graal
 Liberica      |     | 21.0.5.fx    | librca  |            | 21.0.5.fx-librca
 Oracle        |     | 23.0.1       | oracle  |            | 23.0.1-oracle
 Temurin       |     | 21.0.5       | tem     |            | 21.0.5-tem`}
      />

      <h2>8. Diagnóstico</h2>

      <TerminalBlock
        command={`java -XshowSettings:properties -version 2>&1 | grep -E '^\\s+(java|os|user)\\.'`}
        output={`    java.class.path =
    java.class.version = 65.0
    java.home = /usr/lib/jvm/java-21-openjdk
    java.io.tmpdir = /tmp
    java.runtime.name = OpenJDK Runtime Environment
    java.runtime.version = 21.0.5+11-LTS
    java.specification.version = 21
    java.vendor = Arch Linux
    java.vendor.version = 21.0.5+11-LTS
    java.version = 21.0.5
    java.vm.name = OpenJDK 64-Bit Server VM
    os.arch = amd64
    os.name = Linux
    os.version = 6.12.1-arch1-1
    user.dir = /home/user
    user.home = /home/user
    user.name = user`}
      />

      <TerminalBlock
        comment="lista processos JVM rodando"
        command="jps -lv"
        output={`5421 com.exemplo.App -Xmx512m -Dfile.encoding=UTF-8
5599 sun.tools.jps.Jps -Dapplication.home=/usr/lib/jvm/java-21-openjdk -Xms8m -Djdk.module.main=jdk.jcmd`}
      />

      <TerminalBlock
        command="jstack 5421 | head -20"
        output={`2026-03-25 17:11:42
Full thread dump OpenJDK 64-Bit Server VM (21.0.5+11-LTS mixed mode, sharing):

Threads class SMR info:
_java_thread_list=0x..., length=11, ...

"main" #1 prio=5 os_prio=0 cpu=21.84ms elapsed=8.21s tid=0x... nid=0x1535 waiting on condition  [0x...]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
        at java.lang.Thread.sleep0(java.base@21.0.5/Native Method)
        at java.lang.Thread.sleep(java.base@21.0.5/Thread.java:509)`}
      />

      <AlertBox type="success" title="Setup recomendado para 2026">
        Instale <code>jdk-openjdk</code> (current) e <code>jdk21-openjdk</code> (LTS). Use{" "}
        <code>archlinux-java</code> para alternar quando precisar. Para builds, padronize na LTS 21
        — funciona com Spring Boot 3.x, Quarkus, Micronaut e a maioria do ecossistema atual.
      </AlertBox>

      <h2>Cola visual</h2>
      <OutputBlock
        title="comandos essenciais"
        output={`# instalação
sudo pacman -S jdk-openjdk maven gradle

# alternar versão
sudo archlinux-java set java-21-openjdk
echo $JAVA_HOME                  # /usr/lib/jvm/default

# compilação manual
javac Hello.java && java Hello
java Hello.java                  # single-file (11+)
jar cfm app.jar MANIFEST.MF *.class

# maven
mvn package
mvn dependency:tree
mvn exec:java -Dexec.mainClass=com.x.App

# gradle
gradle init --type java-application
gradle build
gradle run`}
      />
    </PageContainer>
  );
}
