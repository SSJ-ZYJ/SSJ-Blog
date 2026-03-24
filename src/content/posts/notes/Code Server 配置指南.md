---
title: Code Server 配置指南
published: 2026-03-23T20:38:31
description: Dev-C++ 没有代码补全、高亮等功能，学校机房又没有好用的IDE？来试试自己部署一个 Code Server 吧！
image: ""
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
> 使用的docker镜像：[linuxserver/docker-code-server](https://github.com/linuxserver/docker-code-server)
---

# 系统配置
## 零 · docker-compose 修改：
- PUID=0 : PGID=0
- 默认以 root 身份登入，防止用 codeserver 修改文件无权限。

--- 

## 一 · 换源
### code-server 插件仓库换源
**更改后需重启容器！**  
*linuxserver/codeserver* 容器的路径：`/app/code-server/lib/vscode/product.json`

```json
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
},
```

### apt 软件换源
***修改前请备份！***  
系统原apt源文件：

```json
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
也可使用容器自带的命令行文本编辑器`nano`进行修改：`sudo nano /etc/apt/sources.list`。  
（如果修改了docker compose 内的 PUID 和 GUID 则无需使用 sudo ，因为默认登入就为 root 账户）  
以下为换到腾讯源：

```json
deb https://mirrors.cloud.tencent.com/ubuntu/ noble main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-updates main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-updates main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-backports main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-backports main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ noble-security main restricted universe multiverse
# deb-src https://mirrors.cloud.tencent.com/ubuntu/ noble-security main restricted universe multiverse
```

随后需要执行以下命令，更新软件包索引。
- `apt update`
## 二 · 配置代理
### 安装 Wget 软件包
`sudo apt install -y wget`  
**验证安装：**`wget --version`
### 下载 mihomo(clash meta) .deb安装包
[Releases · MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo/releases)  
下载的名称应为`mihomo-linux-amd64-v版本号.deb`  
右键复制该 release 文件，粘贴到[GitHub加速下载代理 - 快速访问 GitHub 文件](https://gh-proxy.com/) 转换为 Wget 格式。  
随后将输出的命令复制到终端运行。
### 安装 mihomo
`apt install ./mihomo-linux-amd64-v版本号.deb`
### 配置 mihomo
将本地 clash 配置文件复制到 `~/.config/mihomo/config.yaml` 内。
### 运行与终止 mihomo
前台运行（测试）：`mihomo -d ~/.config/mihomo`
#### 后台运行 · 方法一：
后台运行：`nohup mihomo -d . > mihomo.log 2>&1 &`（日志输出到 mihomo.log ）  
查看 mihomo PID：`pgrep mihomo`  
终止运行：`kill <PID>`
#### 后台运行 · 方法二：
安装 screen ：`sudo apt install -y screen`  
创建名为 mihomo 的会话：`screen -S mihomo`  
在会话中前台运行：`mihomo -d ~/.config/mihomo`  
脱离该会话：`Ctrl+A`+`D`  
重新连接该会话：`screen -r mihomo`  
终止会话：`screen -S mihomo -X quit` 或 在会话中按`Ctrl+C`
### 配置终端环境变量
打开 `~/.bashrc` 文件。或使用自带 `nano` 编辑器打开：`nano ~/.bashrc`  
在文件底部添加：

```json
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

同时打开 `/root/.bashrc` 文件，在文件底部添加相同内容。  
最后输入`source ~/.bashrc`和`source /root/.bashrc`让配置立即生效。
### 使用代理
每次需先执行 [[#运行与终止 mihomo]] 步骤。  
随后在 shell 中输入 `auto_proxy` ，将会自动根据是否开启 mihomo 而自动 设置/取消设置 代理。  
每次开启/关闭代理时均需执行该命令。
## 三 · 更换 shell
fish (friendly interactive shell) 比自带的 bash 更好用。
### 安装 fish-shell
`sudo apt update`  
`sudo apt install -y fish`
### 验证安装
`fish --version`
### 将 fish-shell 设置为默认shell
#### 添加 `/usr/bin/fish` 到 Shell 列表中
`grep -q '/usr/bin/fish' /etc/shells || echo '/usr/bin/fish' | sudo tee -a /etc/shells`
#### 更改当前用户的默认 shell
`chsh -s /usr/bin/fish`
#### 修改 codeserver 默认终端配置文件
打开路径下文件：`/config/data/User/settings.json`  
添加以下内容：  
`    "terminal.integrated.defaultProfile.linux": "fish"`  
注意，上一行末尾应加 `,` 
### 为 fish-shell 配置代理
将以下内容保存为： **`~/.config/fish/functions/auto_proxy.fish`**

```bash
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

随后在 fish-shell 中输入 `auto_proxy` ，将会自动根据是否开启 mihomo 而自动 设置/取消设置 代理。
#### 在 Fish 提示符中显示代理状态 
编辑 `~/.config/fish/config.fish`：

```bash
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

### 安装 fisher （可选）
**fisher 项目：**[jorgebucaran/fisher: A plugin manager for Fish](https://github.com/jorgebucaran/fisher)  
`curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher`  
***注意：该行命令需要再 fish-shell 中执行。***  
**验证安装：**`fisher --version`
# 配置 C/Cpp 环境
## 一、安装工具链
`apt install -y clangd-18 clangd-18 clang-format-18 cmake gdb build-essential`
### 创建符号链接：
Ubuntu 24.04 的 `clangd` 包名是 `clangd-18`，我们需要创建符号链接以便工具识别。

``` bash
sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-18 100
sudo update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-18 100
```

### 验证安装：
`clangd --version`  
`clang-format --version`
## 二、在 code server 中安装 clangd 拓展
注意：插件作者为 `LLVM` 。
## 三、仿 CS50 `make` 命令
在 cs50 里，我们可以使用 `make hello` → `./hello`。
### 全局 Makefile（仅适用于学习阶段的小算法程序）
将以下内容写入 `~/.makefile` 中：

```cpp
# =============================================================================
# CS50-style Global Makefile for C/C++
# Usage: make target      (e.g., make hello → compiles hello.c or hello.cpp)
# Place this at ~/.makefile and set MAKEFLAGS=--file=~/.makefile
# ============================================================================= 
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:

# Compilers
CC      = gcc
CXX     = g++  

# Flags
CFLAGS   = -g -O0 -std=c11 -Wall -Wextra -Werror
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

### 让 `make` 自动使用这个全局 Makefile
在 fish-shell 中设置：`set -Ux MAKEFLAGS --file=$HOME/.makefile`  
**验证是否生效：**`echo $MAKEFLAGS`
### 防止错误使用 `make`
将以下内容添加到 `~/bin/make` 中：

``` bash
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

# 禁止传入目录（可选）
if [[ -d "$1" ]]; then
    echo "❌ '$1' is a directory." >&2
    exit 1
fi

# 调用系统 make（会自动加载 ~/.makefile）
exec /usr/bin/make "$@"
```

#### 将 ~/bin 插入 PATH 开头
`set -U fish_user_paths ~/bin $fish_user_paths`
#### 设置可执行权限
`chmod +x ~/bin/make`
#### 验证
`which make` 应输出：`/config/bin/make`
