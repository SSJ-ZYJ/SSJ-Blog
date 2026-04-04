---
title: VSCode - C/C++ 环境配置、插件配置与使用指南
published: 2026-03-25T20:34:31
description: Dev-C++ 已过时，过于简陋，Visual Studio / CLion 对于写个小算法程序又稍显臃肿……来试试 VSCode 吧！
image: /assets/vscode-cpp-setup/Cover.png
tags:
  - VSCode
  - Tech
category: Tutorial
draft: false
lang: ""
---
> [!IMPORTANT] 适用范围声明  
> 本教程 **仅适用于 Windows 操作系统** 的用户。
> 
> 本教程的目标读者为 **初学者**，主要用于编写 **算法竞赛/练习题**（如洛谷、Codeforces、LeetCode 等平台的题目），不涉及复杂项目开发。
> 
> 本教程 **不包含 CMake 等构建工具** 的使用方法，如需进行大型项目开发，请参考其他文档。	

# 一、配置 C/C++ 环境

## 1. 下载与安装 MSYS2

> [!INFO] 什么是 MSYS2？  
> MSYS2 是一个基于 Cygwin 和 MinGW-w64 构建的现代化 Windows 软件分发与开发平台，核心使用 `pacman` 包管理器统一管理类 Unix 工具链与原生 Windows 编译环境。

前往 MSYS2 官方网站：[MSYS2](https://www.msys2.org/)

根据自己设备的处理器架构选择合适的安装包：

> [!NOTE] 如何判断自己的计算机处理器架构？
> 
> #### 方法一：通过"设置"查看
> 
> 1. 按键盘快捷键 `Win + I` 打开"设置"（或者点击开始菜单 → 设置齿轮图标）；
> 2. 在左侧点击 **"系统"** ，右侧下滑到底部，点击 **"系统信息"** ；
> 3. 在 **"设备规格"** 区域找到 **"系统类型"** 一栏：
>    - 如果显示 **"基于 x64 的处理器"** ：则为 **x86/x64** 架构（绝大多数 Intel 或 AMD 芯片）。
>    - 如果显示 **"基于 ARM 的处理器"** ：则为 **ARM64** 架构（常见于搭载高通骁龙芯片如 Surface Pro X 等设备）。
> 
> 例如以下就是一台搭载基于 x86 64 位架构处理器的设备：  
> ![](/assets/vscode-cpp-setup/CPU_Architecture.png)
> 
> #### 方法二：使用命令提示符
> 
> 4. 按下 **`Win + R`**，输入 `cmd` 并回车（**注意：不要使用 PowerShell**）。
> 5. 在黑色窗口中输入以下命令并回车：
> 
> ```bash
> echo %PROCESSOR_ARCHITECTURE%
> ```
> 
> 6. 查看输出结果：
>    - 显示 **`AMD64`**：代表 **x64** 架构（注意：即使是 Intel 处理器也会显示 AMD64，这是历史命名原因）。
>    - 显示 **`ARM64`**：代表 **ARM** 架构。

随后，一路"下一步"进行安装，默认安装路径为 `C:\msys64`，请牢记此路径。

### 更新 MSYS2

如果你在安装时一路"下一步"，安装完成后应该会自动启动 `MSYS2 MSYS` 终端。如果没有，请手动在开始菜单中找到 `MSYS2 MSYS` 程序并点击打开。

随后在终端内输入：

```bash
pacman -Syu
```

执行软件包更新，期间确认请输入 `y`。

## 2. 安装 C/C++ 工具链

在 `MSYS2 UCRT64` **终端** 中执行：

```bash
pacman -S --needed --noconfirm mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-clang-tools-extra mingw-w64-ucrt-x86_64-cmake mingw-w64-ucrt-x86_64-ninja
```

> [!NOTE] 命令说明
> - `mingw-w64-ucrt-x86_64-toolchain`：包含 GCC/G++ 编译器、GDB 调试器等核心工具
> - `mingw-w64-ucrt-x86_64-clang-tools-extra`：包含 Clangd 语言服务器，用于代码补全和语法检查
> - `mingw-w64-ucrt-x86_64-cmake` 和 `mingw-w64-ucrt-x86_64-ninja`：构建工具（本教程暂不深入使用）

### 验证安装

```bash
clangd --version  # 显示版本即成功
where clangd      # 应显示路径而不是提示未找到文件
where g++         # 应显示路径而不是提示未找到文件
```

以下为正确安装后的输出截图（版本号可能随时间发展而变动，请以实际安装显示为准）：  
![](/assets/vscode-cpp-setup/Verification-01.png)

### 配置环境变量

将 `C:\msys64\ucrt64\bin` 添加到系统环境变量中。

> [!TIP]  
> 若你在安装 MSYS2 时更改了安装路径，请自行将 `C:\msys64` 替换为你的实际安装路径。

> [!NOTE] Windows 系统下如何配置环境变量？
> 
> 1. 按 `Win + I` 打开设置（或在开始菜单找到设置打开）；
> 2. 在左侧点击 **"系统"** ，右侧下滑到底部，点击 **"系统信息"** ；
> 3. 在 **"设备规格"** 区域 **下方** 找到 **"高级系统设置"** ；  
> ![](/assets/vscode-cpp-setup/Path-01.png)
> 4. 点击 **"环境变量"** → **"系统变量"** → **"Path"** ；  
> ![](/assets/vscode-cpp-setup/Path-02.png)
> 5. 点击 **"浏览"** ，或 **"新建"** ，将上述路径添加到 Path 中。  
> ![400](/assets/vscode-cpp-setup/Path-03.png)
> 6. 点击"确定"保存设置。

**验证环境变量：**

在 Windows Terminal（终端）（CMD 或 PowerShell）中，执行：

```bash
clangd --version
g++ --version
```

正确配置后输出（版本号可能随时间发展而变动，请以实际安装显示为准）：  
![](/assets/vscode-cpp-setup/Verification-02.png)

# 二、安装与配置 VSCode

## 1. 下载与安装 VSCode

### 下载 VSCode

前往 VSCode 官网下载网站：[Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/Download)

根据 CPU 架构，下载 `System Installer`：  
![161](/assets/vscode-cpp-setup/VSCode-Download.png)

### 安装 VSCode

双击安装包，若有 UAC 弹窗，请点击 **"允许"** 或 **"是"** 。

随后，一路"下一步"安装，根据自己磁盘与程序存储路径偏好，选择合适的安装路径，并请牢记。

安装时，推荐勾选以下选项（是否创建快捷方式请按个人需求勾选）：  
![418](/assets/vscode-cpp-setup/VSCode-Installer.png)

## 2. 配置 VSCode

### 安装并切换简体中文语言包

> [!INFO] 观前提示  
> 若具有一定的英语阅读能力，且无需更换程序语言为简体中文，可跳过此步。

搜索并安装：`Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code` 插件。

![](/assets/vscode-cpp-setup/VSCode-LP.png)

随后，点击 `Change Language And Restart` 按钮，VSCode 会自动重启并切换为简体中文。  
![473](/assets/vscode-cpp-setup/VSCode-LP-R.png)

### 安装 C/C++ 相关插件

> [!INFO] 弹窗提示  
> 安装过程中，若遇到 **"是否信任发布者"** 弹窗，请点击 **"信任发布者并安装"** 。

搜索并安装：`C/C++`、`C/C++ Compile Run` 插件。  
![616](/assets/vscode-cpp-setup/VSCode-Extension-01.png)

搜索并安装：`clangd`、`Clang-Format` 插件。  
![616](/assets/vscode-cpp-setup/VSCode-Extension-02.png)  
![616](/assets/vscode-cpp-setup/VSCode-Extension-03.png)

### 配置相关插件

#### 关闭 IntelliSense

首先，打开或新建任意 `.cpp` 后缀的文件，推荐写一个小程序，方便后续配置。

此时，通常情况下，`clangd` 插件会提示功能冲突，如下图：  
![424](/assets/vscode-cpp-setup/VSCode-Extension-04.png)

请点击 `Disable IntelliSense` 按钮，关闭微软 C/C++ 插件的 IntelliSense 功能（代码自动补全、语法检查等），以避免与 `clangd` 冲突。

若错误点击，请依次点击以下按钮，打开 `VSCode 用户设置（JSON）`：  
![](/assets/vscode-cpp-setup/VSCode-Extension-05.png)

随后在文件末尾添加如下内容（请务必遵循 JSON 语法规范）：

```json
"C_Cpp.intelliSenseEngine": "disabled"
```

> [!TIP]  
> 若上一行有配置项，请在末尾加上 `,`（英文半角逗号）。  
> 如下图所示：  
> ![500](/assets/vscode-cpp-setup/VSCode-Extension-06.png)

#### 配置 Clang-Format 插件

> [!NOTE] Clang-Format 插件是什么？  
> Clang-Format 是一款专用于 C/C++/Objective-C 等代码的自动格式化工具，可统一代码风格，提高可读性。

可以通过 **"右键 → 格式化文档"** 或按默认键盘快捷键 **`Shift + Alt + F`** 进行格式化操作。

初次操作，可能会出现如下弹窗，提示选择一个格式化程序：  
![407](/assets/vscode-cpp-setup/Clang-Format-01.png)

点击 **"配置"**，选择 **Clang-Format**，如图所示：  
![](/assets/vscode-cpp-setup/Clang-Format-02.png)

随后，代码会被自动格式化。

若不喜欢默认的格式化风格，可前往 [Clang-format configurator](https://clang-format-configurator.site/) 网站，可视化定制自己喜欢的风格方案，生成相应的 `.clang-format` 文件。

将生成的 `.clang-format` 文件放置到一个固定的位置，推荐为用户主目录，如：`C:\Users\SSJ_VMdemo\`

> [!CAUTION] 注意  
> "SSJ_VMdemo" 是我在虚拟机中的用户名，请自行替换为你自己的用户名。若不清楚用户名，请前往 `C:\Users\` 目录下查看。

随后，在 Clang-Format 插件设置中，指定格式化文件的绝对路径：`file:C:/Users/SSJ_VMdemo/.clang-format`。如下图：  
![](/assets/vscode-cpp-setup/Clang-Format-03.png)

最后，附上SSJ习惯的格式化风格文件，仅供参考：

```yaml
# 基础风格
BasedOnStyle: LLVM

# 大括号风格
BreakBeforeBraces: Attach

# 宏对齐
AlignConsecutiveMacros: AcrossEmptyLinesAndComments

# 括号前的空格
SpaceBeforeParens: ControlStatements

# 赋值运算符前的空格
SpaceBeforeAssignmentOperators: true

# 最大空行数
MaxEmptyLinesToKeep: 1

# 尾部注释对齐
AlignTrailingComments: true
SpacesBeforeTrailingComments: 1

# 转义换行符对齐
AlignEscapedNewlines: Left

# 声明参数换行
AllowAllParametersOfDeclarationOnNextLine: true
BinPackParameters: true

# 缩进设置
UseTab: Never
TabWidth: 4
IndentWidth: 4
```

#### 常见问题预案

- **弹窗提示报错：`The 'clangd' language server was not found on your PATH.`**
  - 解决方式一：检查是否正确配置环境变量；
  - 解决方式二：在 `clangd` 插件设置中，设置 `clangd` 可执行文件的绝对路径。如图所示：  
	![592](/assets/vscode-cpp-setup/VSCode-Extension-07.png)

- **打开 `.cpp` 文件，提示 `fatal error: 'iostream' file not found` 或其他头文件无法找到**
  - 检查一：是否正确配置环境变量；
  - 检查二：是否按照本指南正确安装并配置 C/C++ 环境。

## 3. 运行与调试 C/C++ 程序

### 编译与运行 C/C++ 程序

若按上述步骤正确配置后，可直接通过右上角按钮，一键编译与运行 C/C++ 程序（默认快捷键 `F6`），如图：  
![560](/assets/vscode-cpp-setup/CPP-demo-02.png)

截图中的示例程序（供后续配置使用）：

```cpp
// hello.cpp
#include <iostream>

int main(void) {
	std::string hello = {"Hello, VSCode!"};
	for (char c : hello) {
		std::cout << c;
	}
	std::cout << std::endl;
}
```

### 调试 C/C++ 程序

> [!INFO] 调试前提示  
> 调试前，请务必 **添加（设置）断点** ！

若按上述步骤正确配置后，可直接通过右上角按钮进行调试（默认快捷键 `F5`），如图：  
![683](/assets/vscode-cpp-setup/CPP-demo-03.png)

### 常见问题预案

- **无法正常编译运行/调试程序**
  - 检查一：是否正确配置环境变量；
  - 检查二：是否按照本指南正确安装并配置 C/C++ 环境。

- **对示例程序的疑问**
  - **示例程序为何如此复杂？**
	- 为演示后续调试功能，将简单的 `Hello, VSCode` 程序复杂化，其输出效果与直接打印相同。
  - **示例中的 `for` 循环为何与常见写法不同？**
	- 使用了 C++11 引入的范围 for 循环（Range-based for loop），可缩减代码量，提高可读性。与下述传统写法功能一致：

	```cpp
	// hello.cpp
	#include <iostream>

	int main(void) {
		std::string hello = "Hello, VSCode!";
		for (std::string::iterator c = hello.begin(); c != hello.end(); c++) {
			std::cout << *c;
		}
		std::cout << std::endl;
	}
	```

# 三、Extras

## 1. Competitive Programming Helper (CPH) 插件

- 在 VSCode 中搜索并安装 `CPH` 插件。如下图：  
  ![555](/assets/vscode-cpp-setup/VSCode-Extension-08.png)

- 在浏览器中安装 `Competitive Companion` 插件。如下图：
  - Google Chrome 浏览器：  
	![485](/assets/vscode-cpp-setup/CPH-01.png)
  - Microsoft Edge 浏览器：  
	![485](/assets/vscode-cpp-setup/CPH-02.png)
  - Mozilla Firefox 浏览器：  
	![485](/assets/vscode-cpp-setup/CPH-03.png)

随后，在绝大多数 OJ 平台（如洛谷、LeetCode、Codeforces 等，不支持头歌平台），在开启 VSCode 并打开任意文件夹（推荐新建一个空文件夹存放相关文件）的前提下，点击浏览器插件的"加号"图标，即可将题目信息提取到 VSCode 中。

## 2. Luogu 插件

- 在 VSCode 中搜索并安装 `vscode-luogu` 插件。如下图：  
  ![555](/assets/vscode-cpp-setup/VSCode-Extension-09.png)

### 使用方法

使用前，请在侧边栏或按 `Ctrl + Alt + G` 再按 `L`，在 VSCode 内登录洛谷账号。

按 `Ctrl + Shift + P` 打开命令面板，输入 `luogu` 即可查看所有用法。

常用快捷键：

| 默认快捷键                  | 功能                  |
| ---------------------- | ------------------- |
| `Ctrl + Alt + G` + `T` | 打开题单广场              |
| `Ctrl + Alt + G` + `P` | 输入题号/比赛编号，打开对应题目/比赛 |
| `Ctrl + Alt + G` + `S` | 提交代码                |
| `Ctrl + Alt + G` + `F` | 打卡                  |

## 3. VSCode 主题美化

### GitHub Theme

项目 GitHub 地址：[GitHub's VS Code themes](https://github.com/primer/github-vscode-theme)

SSJ个人很喜欢 `GitHub Theme` 插件提供的 `GitHub Dark Colorblind (Beta)` 样式主题。

### One Dark Pro

项目 GitHub 地址：[Atom's iconic One Dark theme for Visual Studio Code](https://github.com/Binaryify/OneDark-Pro)

也可以安装 `One Dark Pro` 插件，它提供的多款样式也十分美观。

## 4. VSCode 推荐设置

> [!INFO] 提示  
> 以下内容，均可在设置中搜索配置名称进行调整。

### 控制字体大小

- 配置名称：`Editor: Font Size`
- 设置值：`16`

### Ctrl + 滚轮调整字体大小

- 配置名称：`Editor: Mouse Wheel Zoom`
- 设置值：`true`

### 平滑光标移动动画

- 配置名称：`Editor: Cursor Smooth Caret Animation`
- 设置值：`on`

### 平滑滚动

- 配置名称：`Editor: Smooth Scrolling`
- 设置值：`on`

### 保存时自动格式化

- 配置名称：`Editor: Format On Save`
- 设置值：`on`

### 粘贴后自动格式化

- 配置名称：`Editor: Format On Paste`
- 设置值：`on`
