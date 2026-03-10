---
title: "[Note - Missing Semester] Ch1 Shell基础 - Introduction to the Shell"
published: 2026-03-08
description: 【笔记 - 计算机教育中缺失的一课】 | 这是一篇基于 MIT 开设的一门旨在填补计算机专业教育中“工具技能”空白的课程的笔记。
image: "./01-cover.png"
tags:
  - Linux
  - MIT
  - Tech
category: Notes
draft: true
lang: ""
---
# 基础命令
## 1. echo
一个可以将参数文本输出到标准输出（通常是终端屏幕），或者将其重定向到文件中的基础命令。  
基本语法：`echo <option> <string>`  

### 1.1 直接输出字符串
`echo Hello, Shell!`或`echo "Hello, Shell!"`  
输出：`Hello, Shell!`  

### 1.2 `option` 常用选项
1. `-n`：取消末尾自动换行；  
2. `-e`：启用反斜杠转义字符解释（Linux/GNU下一般默认开启）  

### 1.3 高级用法  
#### A. 变量替换  
`echo` 会自动展开环境变量和 Shell 变量：
```bash
NAME="Alice"
echo "Hello, $NAME"
# 输出: Hello, Alice
```
#### B. 命令替换
`echo`可以输出其他命令的执行结果：
```bash
echo "Current date is: $(date)"
# 输出：Current date is: Tue Mar 10 19:54:54 CST 2026 
# 输出内容会随时间变化而不同，以所处时空输出命令后的那一时刻为准
```
#### C. 重定向到文件
`echo`可以用于创建文件或追加内容。
- **覆盖写入 (`>`)**：如果文件存在则清空重写，不存在则创建。
    ```bash
    echo "First line" > file.txt
    ```
- **追加写入 (`>>`)**：在文件末尾添加内容，不覆盖原有内容。
    ```bash
    echo "Second line" >> file.txt
    ```
    - **创建空文件**：
    ```bash
    echo -n > emptyfile.txt
    ```
#### D. 输出特殊字符
如果需要输出 `$`、`!` 等特殊字符而不被 Shell 解释，可以使用单引号：
```bash
echo 'Price is $100'
# 输出: Price is $100
```