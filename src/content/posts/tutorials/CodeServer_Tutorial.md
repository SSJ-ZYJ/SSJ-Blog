---
title: "Code Server 配置基础编程环境指南"
published: 2026-02-27T18:38:31
description: Dev-C++ 没有代码补全、高亮等功能，学校机房又没有好用的IDE？来试试自己部署一个 Code Server 吧！
image: "/assets/codeserver/cover.png"
tags:
  - Tech
  - Linux
  - CodeServer
  - VSCode
category: Tutorial
draft: false
lang: ""
---
> [!NOTE] 前言  
> 基于系统：Ubuntu 24.04 LTS  
> 配置环境：C/C++ & clang  
> 使用的 docker 镜像：[linuxserver/docker-code-server](https://github.com/linuxserver/docker-code-server)

> [!WARNING] 安全警告  
> 本文配置**仅供学习与算法练习使用**，请勿作为生产环境或 Linux 操作系统的使用规范参考。  
> 文中涉及以 root 用户运行容器、修改系统配置等操作，存在安全风险。请勿在生产服务器或暴露于公网的环境中采用此类配置。

---

# 系统配置
## 零 · docker-compose 修改
将 `PUID` 和 `PGID` 均设置为 `0`：

```yaml
environment:
  - PUID=0
  - PGID=0
```

这样配置后，容器内的进程将以 root 用户身份运行，避免在 code-server 中修改文件时出现权限不足的问题。

> [!CAUTION] 风险提示  
> 以 root 身份运行容器意味着容器内的进程拥有最高权限。如果 code-server 被攻击者利用，可能导致宿主机被入侵。请注意：
> - 不要将 code-server 直接部署在云服务器上，请部署在 docker 容器内
> - 如需更高安全性，请使用非 root 用户并正确配置文件权限

--- 

## 一 · 换源
### code-server 插件仓库换源
**更改后需重启容器！**  
*linuxserver/code-server* 容器的路径：`/app/code-server/lib/vscode/product.json`

找到文件中的 `extensionsGallery` 字段，替换为以下内容：

```json
{
  "linkProtectionTrustedDomains": [
    "https://marketplace.visualstudio.com",
    "https://open-vsx.org"
  ],
  "extensionsGallery": {
    "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
    "cacheUrl": "https://vscode.blob.core.windows.net/gallery/index",
    "itemUrl": "https://marketplace.visualstudio.com/items",
    "controlUrl": "",
    "recommendationsUrl": ""
  }
}
```

### apt 软件换源
***修改前请备份！***  
系统原 apt 源文件：

```text
deb http://archive.ubuntu.com/ubuntu/ noble main restricted
deb-src http://archive.ubuntu.com/ubuntu/ noble main restricted
deb http://archive.ubuntu.com/ubuntu/ noble-updates main restricted
deb-src http://archive.ubuntu.com/ubuntu/ noble-updates main restricted
deb http://archive.ubuntu.com/ubuntu/ noble universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ noble universe multiverse
deb http://archive.ubuntu.com/ubuntu/ noble-updates universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ noble-updates universe multiverse
deb http://archive.ubuntu.com/ubuntu/ noble-security main restricted
deb-src http://archive.ubuntu.com/ubuntu/ noble-security main restricted
deb http://archive.ubuntu.com/ubuntu/ noble-security universe multiverse
deb-src http://archive.ubuntu.com/ubuntu/ noble-security universe multiverse
```

路径：`/etc/apt/sources.list`  
也可使用容器自带的命令行文本编辑器 `nano` 进行修改：

```bash
nano /etc/apt/sources.list
```

> [!TIP] 提示  
> 由于本文配置以 root 用户运行容器，因此无需使用 `sudo`。如果你使用的是非 root 用户配置，请在命令前添加 `sudo`。

以下为换到腾讯源的配置：

```text
deb https://mirrors.cloud.tencent.com/ubuntu/ noble main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-updates main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-updates main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-backports main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-backports main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-security main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-security main restricted universe multiverse
```

随后需要执行以下命令，更新软件包索引：

```bash
apt update
```

## 二 · 配置代理
> [!INFO] 说明  
> 本节配置代理是为了加速从 GitHub 等境外网站下载资源。如果你无需代理即可正常访问，可跳过此节。

### 安装 Wget 软件包

```bash
apt install -y wget
```

**验证安装：** `wget --version`
### 下载 mihomo（Clash Meta）.deb 安装包
前往 [Releases · MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo/releases) 下载对应版本。  
下载的文件名应为 `mihomo-linux-amd64-v版本号.deb`（根据你的 CPU 架构选择，amd64 适用于大多数 x86_64 服务器）。

如果无法直接访问 GitHub，可以使用 [GitHub 加速下载代理](https://gh-proxy.com/) 获取下载链接。

### 安装 mihomo

```bash
apt install ./mihomo-linux-amd64-v版本号.deb
```

### 配置 mihomo
将你的 Clash 订阅配置文件保存到 `~/.config/mihomo/config.yaml`。

> [!TIP] 提示  
> 确保配置文件中的 `mixed-port` 或 `socks-port`/`http-port` 设置为 `7897`，以与本文后续的代理配置保持一致。如果你的配置使用其他端口，请相应修改后续命令中的端口号。

### 运行与终止 mihomo
前台运行（用于测试配置是否正确）：

```bash
mihomo -d ~/.config/mihomo
```

> [!NOTE] 参数说明  
> `-d` 参数指定配置文件目录，而非"后台运行"。mihomo 默认会读取该目录下的 `config.yaml` 文件。

#### 后台运行 · 方法一：

```bash
nohup mihomo -d . > mihomo.log 2>&1 &  # 日志输出到 mihomo.log
pgrep mihomo                            # 查看 mihomo PID
kill <PID>                              # 终止运行
```

#### 后台运行 · 方法二：
使用 `screen` 工具管理会话：

```bash
apt install -y screen           # 安装 screen
screen -S mihomo                # 创建名为 mihomo 的会话
mihomo -d ~/.config/mihomo      # 在会话中运行
# 按 Ctrl+A 然后按 D           # 脱离该会话（程序继续运行）
screen -r mihomo                # 重新连接该会话
screen -S mihomo -X quit        # 终止会话（或在会话中按 Ctrl+C）
```

### 配置终端环境变量
打开 `~/.bashrc` 文件进行编辑：

```bash
nano ~/.bashrc
```

在文件底部添加以下函数：

```bash
# --- Proxy Control for Clash (port 7897) ---
auto_proxy() {
    if timeout 1 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/7897' 2>/dev/null; then
        export http_proxy=http://127.0.0.1:7897
        export https_proxy=http://127.0.0.1:7897
        export HTTP_PROXY=http://127.0.0.1:7897
        export HTTPS_PROXY=http://127.0.0.1:7897
        echo 'Acquire::http::Proxy "http://127.0.0.1:7897";' | sudo tee /etc/apt/apt.conf.d/80proxy >/dev/null
        echo 'Acquire::https::Proxy "http://127.0.0.1:7897";' | sudo tee -a /etc/apt/apt.conf.d/80proxy >/dev/null
        echo "✅ Apt proxy enabled"
        echo "✅ Proxy enabled (Clash detected on :7897)"
    else
        unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
        sudo rm -f /etc/apt/apt.conf.d/80proxy
        echo "⚠️ Clash not running on :7897 – proxy disabled"
    fi
}
```

> [!TIP] 提示  
> 由于本文配置以 root 用户运行容器，`~/.bashrc` 即为 `/root/.bashrc`，无需重复添加。

最后执行以下命令让配置立即生效：

```bash
source ~/.bashrc
```

### 使用代理
每次使用前需先启动 mihomo（参见 [[#运行与终止 mihomo]]）。  
然后在 shell 中执行 `auto_proxy`，该函数会自动检测 mihomo 是否运行并相应地设置或取消代理环境变量。

> [!NOTE] 工作原理  
> `auto_proxy` 函数会尝试连接 `127.0.0.1:7897`，如果连接成功则设置代理环境变量，否则清除代理设置。
## 三 · 更换 shell
[fish](https://fishshell.com/)（friendly interactive shell）提供了更好的自动补全、语法高亮和用户友好的交互体验。
### 安装 fish-shell

```bash
sudo apt update
sudo apt install -y fish
```

### 验证安装

```bash
fish --version
```

### 将 fish-shell 设置为默认 shell
#### 添加 `/usr/bin/fish` 到 Shell 列表

```bash
grep -q '/usr/bin/fish' /etc/shells || echo '/usr/bin/fish' >> /etc/shells
```

#### 更改当前用户的默认 shell

```bash
chsh -s /usr/bin/fish
```

> [!TIP] 提示  
> 更改默认 shell 后，需要重新登录或重启容器才能生效。

#### 修改 code-server 默认终端配置文件
打开 `/config/data/User/settings.json` 文件，添加以下配置项：

```json
"terminal.integrated.defaultProfile.linux": "fish"
```

> [!WARNING] 注意  
> 如果该文件中已有其他配置项，请确保在上一行末尾添加逗号 `,` 以保持 JSON 格式正确。 
### 为 fish-shell 配置代理
将以下内容保存为：**`~/.config/fish/functions/auto_proxy.fish`**

```fish
# ~/.config/fish/functions/auto_proxy.fish
# Auto-detect Clash on 127.0.0.1:7897 and toggle proxy for terminal + apt
function auto_proxy
    # Use Bash's /dev/tcp to test port (works in most containers)
    if bash -c 'timeout 1 cat < /dev/null > /dev/tcp/127.0.0.1/7897' 2>/dev/null
        # Enable terminal proxy
        set -gx http_proxy http://127.0.0.1:7897
        set -gx https_proxy http://127.0.0.1:7897
        set -gx HTTP_PROXY http://127.0.0.1:7897
        set -gx HTTPS_PROXY http://127.0.0.1:7897
        # Enable apt proxy
        echo 'Acquire::http::Proxy "http://127.0.0.1:7897";' | sudo tee /etc/apt/apt.conf.d/80proxy >/dev/null
        echo 'Acquire::https::Proxy "http://127.0.0.1:7897";' | sudo tee -a /etc/apt/apt.conf.d/80proxy >/dev/null
        echo "✅ Proxy enabled (Clash detected on :7897)"
        echo "✅ Apt proxy enabled"
    else
        # Disable terminal proxy
        set -e http_proxy https_proxy HTTP_PROXY HTTPS_PROXY

        # Disable apt proxy
        sudo rm -f /etc/apt/apt.conf.d/80proxy
        echo "⚠️ Clash not running on :7897 – proxy disabled"
    end
end
```

随后在 fish-shell 中执行 `auto_proxy` 即可自动设置代理。
#### 在 Fish 提示符中显示代理状态
编辑 `~/.config/fish/config.fish`：

```fish
# ~/.config/fish/config.fish
# ----------------------------
# Auto Proxy + Prompt Indicator
# ----------------------------

# 定义一个函数，在提示符前更新代理状态
function __update_proxy_status --on-variable PWD --on-event fish_prompt
    # 只检查当前环境变量
    if set -q http_proxy
        and string match -q "*7897*" $http_proxy
        set -g __proxy_active yes
    else
        set -e __proxy_active
    end
end

# 触发一次初始化
__update_proxy_status

# 注入代理状态到提示符
function fish_right_prompt
    if set -q __proxy_active
        set_color yellow
        echo -n "🐟[PROXY]"
        set_color normal
    end
end
```

### 安装 fisher（可选）
[fisher](https://github.com/jorgebucaran/fisher) 是 fish 的插件管理器。

```bash
curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher
```

> [!WARNING] 注意  
> 该命令需要在 fish-shell 中执行。如果当前仍在 bash 中，请先输入 `fish` 切换到 fish-shell。

**验证安装：** `fisher --version`
# 配置 C/C++ 环境
## 一、安装工具链

```bash
apt install -y clangd-18 clang-format-18 cmake gdb build-essential
```

> [!INFO] 包说明
> - `clangd-18`：C/C++ 语言服务器，提供代码补全、错误诊断等功能
> - `clang-format-18`：代码格式化工具
> - `cmake`：跨平台构建系统
> - `gdb`：GNU 调试器
> - `build-essential`：包含 gcc、g++、make 等基础编译工具

### 创建符号链接
Ubuntu 24.04 中的 `clangd` 包名为 `clangd-18`，需要创建符号链接以便直接使用 `clangd` 命令：

```bash
update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-18 100
update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-18 100
```

### 验证安装

```bash
clangd --version
clang-format --version
```

## 二、在 code-server 中安装 clangd 扩展
在 code-server 的扩展市场中搜索并安装 `clangd` 扩展（作者为 **LLVM**）。

> [!TIP] 提示  
> 安装扩展后，clangd 会自动检测项目中的 `compile_commands.json` 文件以提供准确的代码补全和错误诊断。对于简单的单文件项目，clangd 也能正常工作。
## 三、仿 CS50 `make` 命令
在 CS50 课程中，可以使用 `make hello` 快速编译 `hello.c` 并生成可执行文件。以下配置实现类似功能。

> [!WARNING] 适用范围  
> 此 Makefile **仅适用于学习阶段的小型算法程序**（单文件或简单结构）。对于复杂项目，请使用标准的项目级 Makefile 或 CMake。

### 全局 Makefile
将以下内容保存为 `~/.makefile`：

```makefile
# =============================================================================
# CS50-style Global Makefile for C/C++
# Usage: make target      (e.g., make hello → compiles hello.c or hello.cpp)
# Place this at ~/.makefile and set MAKEFLAGS=--file=~/.makefile
# =============================================================================
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:

# Compilers
CC      = gcc
CXX     = g++

# Flags
CFLAGS   = -g -O0 -std=c11 -Wall -Wextra -Werror
CXXFLAGS = -g -O0 -std=c++17 -Wall -Wextra -Werror

# Determine source: prefer .cpp over .c
SOURCE =
ifneq ($(wildcard $(@).cpp),)
    SOURCE = $(@).cpp
    REAL_CC = $(CXX)
    REAL_FLAGS = $(CXXFLAGS)
else ifneq ($(wildcard $(@).c),)
    SOURCE = $(@).c
    REAL_CC = $(CC)
    REAL_FLAGS = $(CFLAGS)
endif

# Default rule: build any target if source exists
%:
ifeq ($(SOURCE),)
    $(error No source file found for target "$(@)". Expected $(@).c or $(@).cpp)
endif
    @echo "clang $(SOURCE) -> $(@)"
    @$(REAL_CC) $(REAL_FLAGS) -o $@ $(SOURCE)

# Clean: remove all files that are executable and match a .c/.cpp name
clean:
    @for src in *.c *.cpp; do \
        if [ -f "$$src" ]; then \
            target="$$(basename "$$src" .c | sed 's/\.cpp$$//')"; \
            if [ -f "$$target" ] && [ -x "$$target" ]; then \
                rm -v "$$target"; \
            fi; \
        fi; \
    done 2>/dev/null || true
    @echo "All compiled programs removed."
.PHONY: clean
```

### 让 `make` 自动使用这个全局 Makefile
在 fish-shell 中设置环境变量：

```bash
set -Ux MAKEFLAGS --file=$HOME/.makefile
```

> [!INFO] 说明  
> `-Ux` 参数表示将变量设置为全局导出环境变量，重启后仍然有效。

**验证是否生效：** `echo $MAKEFLAGS` 应输出 `--file=/root/.makefile`（或你的实际 home 路径）。
### 防止错误使用 `make`（可选）
创建一个包装脚本，当用户错误地输入 `make hello.c` 时给出提示：

将以下内容保存为 `~/bin/make`：

```bash
#!/bin/bash
# ~/bin/make — 智能包装器，防止 .c/.cpp 错误

args=""
invalid_args=0

for arg; do
    case "$arg" in
        (*.c|*.cpp)
            arg="${arg%.*}"
            invalid_args=1
            ;;
    esac
    args="$args $arg"
done

if [ "$invalid_args" -eq 1 ]; then
    echo "💡 Did you mean 'make$args'?" >&2
    exit 1
fi

# 禁止传入目录
if [[ -d "$1" ]]; then
    echo "❌ '$1' is a directory." >&2
    exit 1
fi

# 调用系统 make（会自动加载 ~/.makefile）
exec /usr/bin/make "$@"
```

然后执行以下步骤：

```bash
mkdir -p ~/bin                           # 创建 bin 目录
chmod +x ~/bin/make                      # 设置可执行权限
set -U fish_user_paths ~/bin $fish_user_paths  # 将 ~/bin 添加到 PATH
```

#### 验证

```bash
which make
```

应输出：`/config/bin/make`（或 `/root/bin/make`，取决于你的 home 路径）。
