---

title: 把开发环境搬到云端——基于 CNB 搭建的 CloudIDE 使用指南
published: 2026-09-10T19:52:16+08:00
description: 学校机房没有好用的 IDE？现下现配又十分麻烦……来试试开箱即用的 CloudIDE 吧！
image: "/assets/CloudIDE/cover.png"
tags:
 - Tech
 - Linux
 - CNB
 - Docker
 - CodeServer
category: Tutorial
draft: false
lang: zh-CN

---

> [!NOTE] 前言
>
> 在一台新电脑上开始写代码，往往意味着先花上一段时间重新安装开发环境。
>
> JDK、Node.js、Python、C/C++ 编译工具链、Git、各种 VS Code 扩展……如果只是临时换了一台设备，或者需要在学校机房、公共电脑甚至平板上简单修改一下项目，这些环境配置反而会成为最大的成本。
>
> CNB 提供了一个很有意思的功能——**云原生开发**。它可以基于 Docker 创建远程开发环境，并通过浏览器中的 WebIDE、VS Code 或其他支持的客户端连接。开发环境不再依赖当前使用的电脑，而是随着 Docker 镜像一起被描述和复现。

---

## CloudIDE

项目仓库：[☁️ CloudIDE](https://cnb.cool/ssj-space/CloudIDE)

它的目标很简单：

> **打开浏览器，打开工作区，然后直接开始写代码。**

### CloudIDE 与 CNB 原生开发环境

CNB 本身已经提供了默认的云原生开发环境。

在仓库中点击「云原生开发」，CNB 就可以创建一个临时的远程开发环境。

默认环境用于一般开发已经足够，但如果经常使用，就会发现每次进入环境后，自己的开发环境仍然需要重新准备。

例如：

* 安装常用语言环境
* 安装 VS Code 扩展
* 配置中文界面
* 调整终端和编辑器设置
* 配置 AI 编程工具
* 安装常用 CLI 工具

CloudIDE 则提前准备好了这些常用环境和配置。

普通使用时无需重新安装整套开发环境，创建 Workspace 后即可直接开始开发。

---

## 如何使用 CloudIDE

### 0. 注册 CNB 账号

首先需要一个 CNB 账号，[CNB 平台](https://cnb.cool) 链接。

如果还没有使用过 CNB，可以先完成注册并创建自己的组织（组织名随意），后续 Fork 的 CloudIDE 仓库会存放在该组织下。

### 1. 将 CloudIDE Fork 到自己的 CNB 组织

打开 [CloudIDE 项目仓库](https://cnb.cool/ssj-space/CloudIDE)，将其 Fork 到自己的组织。

![Fork CloudIDE](/assets/CloudIDE/fork-cloudide.png)

一般来讲，仅仅 Fork 仓库的 `main` 分支即可（但由于本项目无其他分支，所以 Fork 整个仓库也完全没问题）。

完成后会默认打开属于自己的仓库页面：

```text
https://cnb.cool/your-space-name/CloudIDE
```

***同时，以后可以直接从自己的仓库启动 CloudIDE。***

### 2. 启动云原生开发

进入刚刚 Fork 的 CloudIDE 仓库。

在仓库页面右上角找到绿色的「云原生开发」按钮并点击。

![启动 CloudIDE](/assets/CloudIDE/start-cloudide.png)

CNB 会创建对应的开发环境，并启动 WebIDE。

CloudIDE 使用的是已经准备好的开发镜像，因此普通启动时不需要现场重新安装 JDK、编译器、VS Code 扩展等环境。

整个过程可以简单理解为：

```text
启动 CloudIDE
      ↓
创建 Workspace
      ↓
启动 WebIDE
      ↓
开始写代码
```

等待 Workspace 创建完成后即可进入编辑器。
![进入 CloudIDE](/assets/CloudIDE/enter-cloudide.png)

### 3. 更新仓库

在每一次点击「云原生开发」按钮前，请检查上游仓库是否存新提交。

若存在新提交，请先在 CNB 平台中点击「同步更新」按钮，将上游仓库的更新同步到自己的仓库。以获得最新的 CloudIDE 功能和环境。

![更新仓库](/assets/CloudIDE/update-repo.png)

---

## 使用开发环境

进入 WebIDE 后，使用方式和本地 VS Code 基本一致。

可以先打开终端检查当前环境，例如：

```bash
git --version

# C/C++：

gcc --version
g++ --version

# Java：

java -version

# Node.js：

node -v

# Python：

python3 --version
```

> [!INFO]
> CloudIDE 中实际预装的软件及版本可能会随着项目更新发生变化，具体以仓库 README 中的说明为准。

### 用 CloudIDE 开始一个新项目

进入 WebIDE 后，就可以像普通 Linux 环境一样创建项目。

例如创建一个简单的 C++ 程序：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello CloudIDE!" << '\n';
    return 0;
}
```

编译：

```bash
g++ main.cpp -o main
```

运行：

```bash
./main
```

输出：

```text
Hello CloudIDE!
```

说明当前 C++ 环境已经可以正常使用。

---

### Clone 已有项目

更多时候，我们会直接在 CloudIDE 中继续已有项目。

使用 Git Clone 即可：

```bash
git clone <repository-url>
```

然后进入项目：

```bash
cd <project>
```

之后就可以像本地开发一样进行修改、编译和运行。

完成修改后不要忘记提交代码：

```bash
git add .
git commit -m "your commit message"
git push
```

---

### 端口预览

CloudIDE 并不仅适合运行命令行程序。

如果运行的是 Web 项目，例如：

```bash
npm run dev
```

或者临时启动一个 HTTP 服务：

```bash
python3 -m http.server 8000
```

程序监听端口后，可以通过 WebIDE 中的 `PORTS` 面板访问对应服务。

整个 Web 开发流程可以直接在浏览器中完成：

```text
写代码
↓
启动服务
↓
转发端口
↓
浏览器预览
↓
继续修改代码
```

本地电脑主要负责输入、显示和网络连接，实际的编译、运行和依赖环境都位于云端。

---

### 数据存储

数据会不会随着 CloudIDE 关闭而消失，是使用临时云开发环境时需要特别注意的问题。

CloudIDE 并不是一台永久运行的 VPS。

CNB Workspace 存在生命周期，长时间没有操作后环境可能会被自动释放。

因此仍然建议保持正常的 Git 使用习惯：

```bash
git add .
git commit
git push
```

不要把 CloudIDE 当成网盘。

虽然 CNB 提供了 Workspace 代码备份和部分配置恢复能力，但对于真正重要的项目：

> **Git 仓库才应该是最终的数据来源。**

可以简单理解为：

```text
Environment is disposable.
Code is persistent.
```

开发环境可以重新创建，代码则应该及时提交并推送到远程仓库。

---

## 注意事项

CloudIDE 更适合学校机房、临时设备、新电脑以及不方便配置完整开发环境的场景。

但因为实际开发环境运行在云端，所以使用体验会受到网络质量影响。

另外，CloudIDE 当前运行在 Linux 环境中。

如果项目依赖 Windows API、桌面 GUI、USB 设备或其他本地硬件能力，就不一定适合直接放到 CloudIDE 中运行。

---

## 后记

CloudIDE 目前仍然只是一个很小的项目。

它没有重新实现 VS Code，也没有自己开发一套云开发平台。我只是把 CNB 已有的云原生开发能力和自己的开发环境配置组合到了一起。

但对于学校机房或者临时换设备这样的场景，它确实省去了不少重新配置环境的时间。

以前换一台电脑，可能意味着重新安装：

* IDE
* 编译器
* SDK
* 插件
* 各种开发工具

现在只需要：

```text
打开浏览器
↓
进入 CNB
↓
启动 CloudIDE
↓
开始写代码
```

至于开发机本身？

**用完释放，下次再重新创建一个就好了。**
