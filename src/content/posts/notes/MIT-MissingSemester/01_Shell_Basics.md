---
title: "[Note - Missing Semester] Ch1 Shell基础 - Introduction to the Shell"
published: 2026-03-08T20:24:31
description: 笔记 - 计算机教育中缺失的一课 | 这是一篇基于 MIT 开设的一门旨在填补计算机专业教育中“工具技能”空白的课程的笔记。
image: ./assets/01-cover.png
tags:
  - Linux
  - MIT
  - Tech
category: Notes
draft: false
lang: ""
---
:::note
本文档旨在记录观看 MIT Missing Semester 课程时的核心笔记，涵盖 Shell 基础概念、常用命令、现代替代工具与 Shell 编程。
:::
# 1. Shell 概述
## 1.1 什么是 Shell？
Shell 是位于操作系统内核与用户之间的外围薄层程序。它为用户提供了一个直接访问系统功能的接口，允许用户通过文本命令与操作系统进行交互。Shell 通常以**命令行界面 (CLI)** 的形式存在。
## 1.2 如何启动？
- **Linux**: 按下 `Ctrl` + `Alt` + `T`。
- **macOS**: 按下 `Cmd` + `Space`，搜索 "Terminal" 并打开。
- **Windows**: 建议安装并使用 **适用于 Linux 的 Windows 子系统 (WSL)**，或使用 Linux 虚拟机。

---

# 2. 基础命令
## 2.1 `echo`
`echo` 是一个基础命令，用于将参数文本输出到**标准输出**（通常是终端屏幕），或将其重定向到文件中。  
**基本语法**：

```bash
echo [选项] <字符串>
```

### 2.1.1 直接输出字符串

```bash
echo Hello, Shell!
# 或
echo "Hello, Shell!"
# 输出: Hello, Shell!
```

### 2.1.2 常用选项 (`Options`)
- `-n`：禁止在输出末尾自动换行。
- `-e`：启用反斜杠转义字符的解释（在 Linux/GNU 环境下通常默认开启）。

### 2.1.3 高级用法
#### A. 变量替换
`echo` 会自动展开环境变量和 Shell 变量：

```bash
NAME="Alice"
echo "Hello, $NAME"
# 输出: Hello, Alice
```

#### B. 命令替换
`echo` 可以输出其他命令的执行结果：

```bash
echo "Current date is: $(date)"
# 输出示例: Current date is: Tue Mar 10 19:54:54 CST 2026
# 注：具体时间取决于命令执行时的系统时间。
```

#### C. 重定向到文件
`echo` 常用于创建文件或向文件追加内容：
- **覆盖写入 (`>`)**：若文件存在则清空后重写；若不存在则创建。

    ```bash
    echo "First line" > file.txt
    ```

- **追加写入 (`>>`)**：在文件末尾添加内容，保留原有内容。    

    ```bash
    echo "Second line" >> file.txt
    ```

- **创建空文件**：

    ```bash
    echo -n > emptyfile.txt
    ```

#### D. 输出特殊字符
若需输出 `$`、`!` 等特殊字符且不被 Shell 解释，请使用**单引号**：

```bash
echo 'Price is $100'
# 输出: Price is $100
```

---

## 2.2 `cd`
`cd` (**C**hange **D**irectory) 用于改变当前工作目录。
### 2.2.1 相对路径与绝对路径
- **相对路径**：基于当前目录的位置。
    - 示例：`cd projects/missing-semester`（假设当前位于 `/home/ssj`）。
    - *适用场景*：在当前目录附近移动时更为便捷。
- **绝对路径**：从根目录 `/` 开始的完整路径。
    - 示例：`cd /home/ssj/projects/missing-semester`。
    - *适用场景*：需要从深层子目录跳转至完全无关的其他目录时。

### 2.2.2 快速切换目录 (`cd -`)
利用 `cd -` 可在最近两个访问过的目录间快速切换。

```bash
$ cd /var/log          # 进入日志目录
$ cd /etc/nginx        # 进入配置目录
$ cd -                 # 瞬间返回 /var/log
$ cd -                 # 再次瞬间返回 /etc/nginx
```

### 2.2.3 其他基础用法

| 命令            | 功能             | 解释                                                                                  |
| :------------ | :------------- | :---------------------------------------------------------------------------------- |
| `cd ..`       | 返回**上一级**目录    | `..` 代表父目录。例如在 `/home/user/docs` 执行后变为 `/home/user`。  <br>可叠加使用，如 `cd ../..` 返回上两级。 |
| `cd .`        | 留在**当前**目录     | `.` 代表当前目录。通常用作占位符或脚本中的空操作。                                                         |
| `cd` 或 `cd ~` | 回到 **Home 目录** | 直接输入 `cd` 等价于 `cd ~`，将返回当前用户的家目录（如 `/home/ssj`）。                                    |
### 2.2.4 利用 `Tab` 键自动补全
Shell 支持通过 `Tab` 键自动补全路径，提高效率。
- **操作**：输入 `cd Doc` 后按下 `Tab` 键。
- **效果**：若目录下唯一匹配项为 `Documents`，Shell 会自动补全为 `cd Documents/`。
- **多匹配项**：若存在多个匹配项，连续按两次 `Tab` 将显示所有可选列表。

---

## 2.3 `man` & `tldr`
当遗忘命令的具体用法或参数时，可使用以下两种工具：传统的 **`man`** (Manual Pages) 与现代社区驱动的 **`tldr`** (Too Long; Didn't Read)。
### 2.3.1 `man` (手册页)
- **常见用法**：
    - `man <command>`：查看指定命令的详细手册。
    - `/keyword`：在手册中搜索关键词（按 `n` 查找下一个匹配项，按 `q` 退出）。

### 2.3.2 `tldr` (简化手册)
`tldr` 是一个开源社区项目，旨在提供精简的、基于示例的命令帮助页面。对于复杂命令（如 `tar`, `ffmpeg`, `git`），`man` 手册往往篇幅过长，而 `tldr` 则更加直观实用。
- **常见用法**：
    - `tldr <command>`：查看指定命令的简化帮助页及常用示例。
    - `tldr --update`：从 GitHub 拉取最新的社区贡献页面以更新本地缓存。
    - `tldr --random`：随机显示一个命令的用法，适合碎片化学习。

---

## 2.4 `ls`
`ls` (**L**i**s**t) 用于列出目录内容。
- `ls`：默认列出当前目录下的非隐藏文件和文件夹。
- `ls -a` (**All**)：列出**所有**文件，包括以 `.` 开头的隐藏文件（如 `.bashrc`, `.git`）。
    - `ls -A`：列出隐藏文件，但排除 `.` (当前目录) 和 `..` (上级目录)。
- `ls <PATH>`：列出指定路径下的所有内容。

---

## 2.5 `which`
`which` 命令用于在系统的 `PATH` 环境变量指定的目录中查找并返回指定可执行文件的完整路径。
- **基本用法**：

    ```bash
    which <command_name>
    # 示例:
    $ which date
    # 输出: /usr/sbin/date
    ```

- **查找所有匹配项**：

    ```bash
    which -a <command_name>
    # 示例:
    $ which -a sh
    # 输出:
    # /home/jon/.nix-profile/bin/sh
    # /run/current-system/sw/bin/sh
    ```

---

## 2.6 `cat` & `bat`
### 2.6.1 `cat`
`cat` (**Cat**enate) 是 Linux/Unix 的标准命令，用于查看文件内容、连接文件或重定向输出。其功能简单直接，但输出无格式高亮。
- **用法**：`cat <file>`

<figure style="text-align: center; margin: 0 auto;">
  <img src="/assets/mit-missingsemester/01_Shell_Basics.png" alt="cat 样式示例" width="600" style="display: block; margin: 0 auto;">
  <figcaption>cat 样式示例</figcaption>
</figure>

### 2.6.2 `bat` (现代替代品)
`bat` (常被称为 `batcat`) 是 `cat` 的现代化增强版，主要特性包括：
- **语法高亮**：支持多种编程语言。
- **行号显示**：自动显示行号。
- **自动分页**：长文件自动调用分页器（类似 `less`）。
- **Git 集成**：侧边栏显示 Git 修改状态。
- **主题定制**：支持多种颜色主题。
- **用法**：`bat <file>`  

<figure style="text-align: center; margin: 0 auto;">
  <img src="/assets/mit-missingsemester/01_Shell_Basics-1.png" alt="bat 样式示例" width="600" style="display: block; margin: 0 auto;">
  <figcaption>bat 样式示例</figcaption>
</figure>

### 其他相关命令
- `sort <file>`：将文件内容按行排序后输出。
- `uniq <file>`：移除文件中**连续**的重复行（通常需先排序）。
- `head <file>`：查看文件开头（默认前 10 行）。
    - `head -n 20 <file>`：查看前 20 行。
- `tail <file>`：查看文件结尾（默认后 10 行）。
    - `tail -f <file>`：**实时追踪**文件的新增内容，查看日志文件时的必备工具。

---

## 2.7 `grep`
`grep` 用于在文件中按指定模式（正则表达式）搜索并匹配内容。
- **基本用法**：`grep [选项] <pattern> <file>`
- **常用参数**：
    - `-r`：递归搜索目录。
    - `-i`：忽略大小写。
    - `-v`：反向匹配（显示**不**包含该模式的行）。
    - `-E`：使用扩展正则表达式。
    - `-l`：仅打印匹配的文件名。
    - `-c`：仅打印匹配的行数。
- **示例**：

    ```bash
    grep "ERROR" logfile.txt
    # 在 logfile.txt 中搜索包含 "ERROR" 的行并完整打印。
    ```

:::note[💡 现代工具推荐：`ripgrep` (`rg`)]
比 `grep` 速度更快，默认忽略 `.gitignore` 中的文件，默认递归搜索，用户体验更佳。
:::

---

## 2.8 `find`
`find` 用于按指定条件在目录树中查找文件。
- **基本用法**：`find <path> [条件]`
- **常用条件**：
    - `-name "*.py"`：按文件名匹配。
    - `-type f`：仅查找普通文件（排除目录）。
    - `-mtime +30`：查找 30 天前被修改过的文件。
    - `-size +100M`：查找大于 100 MB 的文件。
    - `-exec <cmd> {} \;`：对找到的每个文件执行指定命令。
- **示例**：

    ```bash
    find . -name "*.log" -mtime +7 -exec rm {} \;
    # 删除当前目录及其子目录下 7 天前修改过的 .log 文件。
    ```

:::note[💡 现代工具推荐：`fd`]
`find` 的现代替代品。默认彩色输出，默认忽略隐藏文件和 `.gitignore`，语法更简洁（例如 `fd pattern` 等同于 `find . -name '*pattern*'`）。
:::

---

## 2.9 `sed`
`sed` (**S**tream **Ed**itor) 是一款流编辑器，常用于对文件内容进行筛选、替换等操作。
- **基本用法**：`sed [选项] '脚本' <file>`
- **常用参数与指令**：
    - `-i`：直接修改文件内容（In-place）。
    - `-n` / `--quiet` / `--silent`：仅显示经脚本处理后的行（配合 `p` 指令使用）。
    - `s`：替换指令 (Substitution)。
    - `g`：全局替换标志（否则每行仅替换第一个匹配项）。
    - `p`：打印指令，通常与 `-n` 连用以输出特定行。
- **示例**：
    - 全局替换：

        ```bash
        sed 's/old/new/g' <file>
        # 将文件中所有的 "old" 替换为 "new" 并输出结果。
        ```

    - 打印特定行：

        ```bash
        sed -n '10,20p' <file>
        # 仅打印文件的第 10 到 20 行。
        ```

---

## 2.10 `awk`
`awk` 是一种强大的文本分析与数据提取语言，支持数学运算、变量定义及 `BEGIN`/`END` 块处理。
- **基本用法**：`awk [选项] '模式 {动作}' <file>`
- **用法示例**：
    - 打印第二列：

        ```bash
        awk '{print $2}' file
        ```

    - 指定分隔符（如 CSV 文件）：

        ```bash
        awk -F',' '{print $2}' file.csv
        # 以逗号为分隔符，打印第二列。
        ```

    - 条件逻辑：

        ```bash
        awk '$2 > 100 {print $1}' file
        # 仅当第二列数值大于 100 时，打印第一列。
        ```

# 3. Shell 编程
## 3.1 管道 (Pipes `|`)
管道`|`，它将前一个命令的**标准输出 (stdout)** 直接作为后一个命令的**标准输入 (stdin)**。
- **用法示例**：

    ```bash
    # 统计当前目录下出现频率最高的5个文件扩展名
    find . -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -n 5
    
    # 解析 SSH 日志，提取断开连接的用户名并统计 Top 10
    ssh myserver 'journalctl -u sshd -b-1 | grep "Disconnected from"' \
      | sed -E 's/.*Disconnected from .* user (.*) [^ ]+ port.*/\1/' \
      | sort | uniq -c \
      | sort -nk1,1 | tail -n10 \
      | awk '{print $2}' | paste -sd,
    ```

## 3.2 重定向 (Redirections)
- `> file`: 将 stdout 写入文件（覆盖）。
- `>> file`: 将 stdout 追加到文件。
- `< file`: 从文件读取 stdin。
- `2> file`: 将 stderr (错误输出) 写入文件。
- `&> file` 或 `> file 2>&1`: 将 stdout 和 stderr 都写入同一文件。
- **`tee` 命令**: 既将输出打印到屏幕，又写入文件。
    - *用法*: `verbose_command | tee log.txt | grep "ERROR"` (既能看日志又能存盘还能过滤)。

## 3.3 控制流与脚本
Shell 是一门完整的编程语言，支持变量、循环和条件判断。
- **条件判断**:

    ```bash
    if [ -f "config.txt" ]; then
        echo "File exists"
    else
        echo "File missing"
    fi
    # 推荐使用 [[ ]] 而非 [ ]，因为它更安全且支持更多特性
    if [[ "$var" == "hello" ]]; then …; fi
    ```

- **循环**:
    - **For 循环**:

        ```bash
        # 遍历文件
        for file in *.txt; do
            echo "Processing $file"
        done
        
        # 命令替换生成序列
        for i in $(seq 1 5); do
            echo "Iteration $i"
        done
        ```

    - **While 循环**:

        ```bash
        while [[ condition ]]; do
            # 执行操作
            sleep 1
        done
        ```

- **编写一个健壮的脚本**:  
    在脚本开头加入 `set` 标志以避免常见错误：

    ```bash
    #!/bin/bash
    set -euo pipefail
    
    # -e: 任何命令失败立即退出脚本
    # -u: 使用未定义变量时报错
    # -o pipefail: 管道中任何命令失败视为整个管道失败
    ```

- **后台运行**:
    - `command &`: 在后台运行命令。
    - `$!`: 获取最后一个后台进程的 PID。
    - `kill $PID`: 终止进程。