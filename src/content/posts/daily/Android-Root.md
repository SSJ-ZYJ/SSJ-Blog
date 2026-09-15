---

title: HyperOS 玩机记录——解 BL 锁、KernelSU Root 与模块配置
published: 2026-09-13T16:42:00+08:00
description: 记录 REDMI K80 Ultra 在 HyperOS 3 与 Android 16 下，从解 BL 锁、KernelSU Root 到模块与环境隐藏的一次完整折腾过程。
image: "/assets/Android-Root/cover.png"
tags:
  - Tech
  - Android
  - Root
category: Daily
draft: false
lang: zh-CN

---

> [!NOTE]
>
> 最近给我的 REDMI K80 Ultra 解了 BL 锁，并配置了 KernelSU、Root、模块与环境隐藏。这篇文章主要记录当前使用环境、解锁方案和模块配置，方便后续系统更新或重新配置时查阅。
>
> 本文不是解 BL 锁或 Root 教程。不同设备、系统版本和安全补丁之间差异较大，而且这次使用的也不是常规官方解锁流程，不适合直接照搬。

<!-- -->

> [!WARNING] 风险提示
>
> 解锁 Bootloader、Root、修改系统环境都有造成数据丢失、系统无法启动甚至设备变砖的可能。
>
> 本文仅记录我自己的设备与使用情况，不构成任何刷机教程。不要在不清楚操作含义，也没有完整备份和救砖能力的情况下照搬操作。

---

## 设备信息

当前设备环境如下。

| 项目 | 当前环境 |
| --- | --- |
| 设备 | REDMI K80 Ultra |
| SoC | MediaTek Dimensity 9400+ |
| 系统 | Xiaomi HyperOS 3.0.303.2.WONCNXM Beta |
| Android | Android 16 |
| 系统安全补丁 | 2026-08-05 |
| Vendor 安全补丁 | 2026-08-05 |

检查设备环境时，`ro.build.version.security_patch` 与 `ro.vendor.build.security_patch` 都已经是 `2026-08-05`，但部分认证信息中的 `post-security-patch-level` 仍然显示为 `2026-05-01`。后续处理完整性检测和 Key Attestation 时，需要分别确认这些字段，而不能只看系统设置里的安全补丁日期。

---

## Bootloader 解锁

Bootloader 负责验证设备准备启动的系统镜像，Android Verified Boot 也依赖这条信任链保证系统完整性。为了进一步自定义设备，并体验默认系统之外的视效和交互，我需要先解 BL 锁。REDMI K80 Ultra 并不是通过传统的官方 Mi Unlock 流程完成，而是使用了针对该设备可用的第三方漏洞方案。

这次实际参考的是酷安 `@AC极光_Official` 发布的教程：[如何解锁您的红米K80至尊版](https://www.coolapk.com/feed/72735553?s=ZTBjOTZmMjAxZWViMmVjZzZhNzljOWZiega1651)。工具本身也注明，核心解锁文件来自酷安 `@道可道official`。

### 内核漏洞与临时 Root

一开始我认为这套方案可能利用了 MediaTek Download Agent 一类的底层漏洞，但在直接静态检查解锁工具本体后，可以确认它实际走的是另一条路线。整个流程发生在 Android 已经正常启动之后。脚本会先通过 ADB 将对应系统版本的 `preload.so` 推送到 `/data/local/tmp`，再利用 `LD_PRELOAD` 触发其中的漏洞代码，获得一次临时 Root。取得足够权限以后，工具才会继续把修改过的 LK 镜像写入设备的 `lk_a` 和 `lk_b` 分区。

从工具中的字符串和调用逻辑来看，`preload.so` 内包含 `KernelSnitch`、`pselect`、`futex`、`pipe physrw`、`kernel_read64`、`kernel_write_data` 等非常明确的内核利用特征。其中针对 305 版本的 payload 里还能直接找到 `GhostLock` 相关字符串，因此这一版可以比较明确地判断使用了 **GhostLock 系列 Android Kernel Exploit** 来取得临时 Root。

OS2 和 OS3 对应的 `preload.so` 没有直接出现 `GhostLock` 名称，但仍能看到 `KernelSnitch + Futex PI + pselect + pipe physrw` 这一组相同的利用特征。现有静态证据足以排除之前猜测的 heapb8 / MediaTek DA2 路线，但无法证明这两个 payload 与某个公开 GhostLock 仓库完全一致，只能确认它们属于同源或高度相关的内核利用链。

从利用位置来看，**GhostLock 属于 Android / Linux Kernel 层面的漏洞利用，并不是所谓“天玑 SoC 漏洞”。** Dimensity 9400+（MT6991）的设备特异性更多出现在后半段。工具需要使用与 MT6991 匹配的 LK 镜像，临时 Root 只是为了获得写入这些受保护分区所需的权限。

静态检查 `main/lk.dll` 时能看到 `MediaTek`、`MT6991`、`fastboot`、`oem unlock`、`oem setmtklks`、`Start unlock flow` 等字符串。这个文件虽然使用 `.dll` 扩展名，却不是 Windows DLL，而是针对 MT6991 修改过的 LK（Little Kernel）镜像。脚本先在已经启动的 Android 中通过 ADB 推送并触发 `preload.so`，拿到临时 Root 后写入 `lk_a`、`lk_b`，随后重启到 Fastboot，由修改后的 LK 参与后续解锁状态处理。

这套方案同时受内核版本和 LK 版本约束。系统安全更新可能修掉临时 Root 所依赖的内核漏洞，OTA 也可能重新写入 LK 分区。即使漏洞本身还能触发，只要系统里的分区布局、LK 版本或启动链发生变化，原来的工具也未必还能直接使用。

解 BL 锁后，系统仍可正常进入 HyperOS，但设备已不再处于厂商默认的完整安全状态。后续的 Root、完整性检测和环境隐藏问题，也都建立在这一前提上。

---

## KernelSU Root

解 BL 锁以后，我选择了 **KernelSU**。它和单纯在用户空间放一个 `su` 的思路不同，Root 授权本身由内核侧参与处理，只有被允许的应用才能取得 `su` 权限。KernelSU Manager 更多负责授权、模块和配置管理，并不是所有应用都能直接看到或调用 `su`。

KernelSU 的 App Profile 还能继续限制已经获得 Root 的进程，例如调整 `uid`、`gid`、附加组、Linux capabilities 和 SELinux 规则。也就是说，给某个应用 Root 并不一定等于把所有系统权限一次性放开。对于只需要网络、Shell 或少量系统能力的工具，可以把权限范围压得更小。

### 模块与挂载

KernelSU 模块经常被概括成 Systemless，但这里的重点并不是“没有修改”，而是尽量不直接改写原始系统分区。像启动脚本、`system.prop` 和 sepolicy 规则，本身不一定需要文件挂载；如果模块需要替换 `/system` 等分区里的文件，则需要由 Metamodule 提供挂载能力。应用最终看到的是修改后的运行时视图，原始分区内容仍然可以保持不变。

我现在使用的 [Hybrid Mount META](https://github.com/Hybrid-Mount/meta-hybrid_mount) 就属于这一层。它作为 Metamodule 负责模块文件的挂载编排，可以在 OverlayFS、Magic Mount 等后端之间选择。这样一来，普通模块只负责提供要修改的文件或脚本，具体怎样把这些内容映射进系统，由 Metamodule 统一处理。排查模块问题时也需要把“模块自己的逻辑”和“挂载是否成功”分开看。

### Zygisk 与 LSPosed

KernelSU 本身不内置 Zygisk，所以当前环境里由 [Zygisk Next](https://github.com/Dr-TSNG/ZygiskNext) 提供 Zygisk API。它位于 KernelSU 和 LSPosed 之间，负责给依赖 Zygisk 的模块提供运行环境。[LSPosed](https://github.com/LSPosed/LSPosed) 再通过这套环境进入 Zygote 派生出的应用进程，并按作用域加载对应的 Xposed 模块。

在我现在这套配置里，加载顺序就是 KernelSU → Zygisk Next → LSPosed → 具体的 LSPosed 模块。这里任何一层失效，问题都会传到上面。例如 Zygisk Next 没有正常注入时，LSPosed Manager 仍可能存在，但 HyperCeiler、HyperIsland、HyperLight 这类模块不会真正进入目标进程。

### 当前模块

当前配置里的模块并不都在做同一件事。KernelSU 侧主要负责挂载、运行环境和隐藏相关处理，LSPosed 侧则更多用于界面与应用行为修改。

| 类型 | 模块 | 当前用途 |
| --- | --- | --- |
| KernelSU | [Hybrid Mount META](https://github.com/Hybrid-Mount/meta-hybrid_mount) | 提供 Metamodule 挂载能力，负责普通模块的 Systemless 文件映射 |
| KernelSU | [辅助隐藏（Hide Bootloader）](https://www.coolapk.com/feed/73731878?s=Zjg0YTE4ZTQxZWViMmVjZzZhYTgwZmU4ega1661) | 当前隐藏方案中用于处理 Bootloader 与相关环境信息 |
| KernelSU | [HMA-OSS Zygisk](https://github.com/frknkrc44/HMA-OSS) | 通过 Zygisk 处理应用列表查询，隐藏不希望被目标应用发现的软件 |
| KernelSU | [解决设备黑](https://www.coolapk.com/feed/73731878?s=Zjg0YTE4ZTQxZWViMmVjZzZhYTgwZmU4ega1661) | 针对当前环境中的特定游戏与 DRM 场景做兼容处理 |
| KernelSU | [TEESimulator-RS](https://github.com/Enginex0/TEESimulator-RS) | 处理 hardware-backed key 与 Key Attestation 相关请求 |
| KernelSU | [LSPosed](https://github.com/LSPosed/LSPosed) | 提供 Xposed Hook 框架 |
| KernelSU | [Zygisk Next](https://github.com/Dr-TSNG/ZygiskNext) | 为 KernelSU 提供独立的 Zygisk API 实现 |
| LSPosed | [星野 Scene](https://t.me/scene2023) | Scene 相关扩展，当前版本包含 Launcher 自动解冻功能 |
| LSPosed | [HyperCeiler](https://github.com/ReChronoRain/HyperCeiler) | 对 HyperOS 系统界面和行为进行细粒度修改 |
| LSPosed | [HyperIsland](https://github.com/1812z/HyperIsland) | 扩展 HyperOS 超级岛相关功能 |
| LSPosed | [HyperLight](https://github.com/KiminonawaResa/HyperLight) | 主要用于 HyperOS 视觉效果调整 |

### 环境隐藏

现在的 Root 检测已经不是“有没有 `su`”这么单一。应用可以从用户空间痕迹、安装包列表、系统属性、挂载状态、Bootloader 状态、Zygisk/Hook 痕迹以及 Key Attestation 等不同位置判断设备环境。不同检测项拿到的信息来源不同，所以一个模块通常只能处理其中一部分。

目前我使用的是酷安 `@小白qwqQAQ` 发布的 [**小白一键隐藏 v2.2.0**](https://www.coolapk.com/feed/73731878?s=Zjg0YTE4ZTQxZWViMmVjZzZhYTgwZmU4ega1661)。它会自动配置 Zygisk Next、HMA-OSS、密钥与安全日期等组件，把原本需要分别处理的几项环境配置集中到一起。真正起作用的仍然是这些底层组件本身，所以排查问题时不能只看“一键隐藏”是否安装成功。

HMA-OSS 主要针对应用列表。部分应用会主动枚举已安装软件，如果直接发现 Root 管理器、Fake Location 或其他常见工具，即使它们没有找到 `su`，也可能继续判定设备环境异常。HMA-OSS 的作用就是在 Zygisk 层处理这类应用列表查询。

Key Attestation 又是另一条链路。它涉及 `keystore2`、证书链、硬件支持信息以及安全补丁等级等内容，并不只是读取几个 `ro.*` 属性。当前使用的 TEESimulator-RS 就放在这一层，所以前面提到的 `ro.build.version.security_patch`、Vendor 补丁日期和 `post-security-patch-level` 不一致，实际配置时不能混成一个值看待。

不同隐藏方案也不适合直接叠加。两个模块如果同时改 Boot 属性、挂载规则、包名可见性或者 Attestation 结果，最后出现的问题通常不是“隐藏得更多”，而是两边互相覆盖。更换方案时最好先确认旧模块动过哪些位置，再决定哪些组件需要一起替换。

### 环境检测

我现在更关注检测失败发生在哪一层，而不是只看某个检测工具最后给出的“通过 / 不通过”。如果是应用列表暴露，应该先查 HMA 和作用目标；如果是 Bootloader 或系统属性异常，就看对应的 Boot 信息和隐藏模块；如果问题落在 Key Attestation，则要检查证书链、Keybox 和安全补丁字段。把这些问题分开后，比不断叠加新模块更容易定位。

检测结果也不是固定的。应用更新后可以增加新的检测路径，系统 OTA 会改变 Kernel、属性和安全补丁信息，隐藏模块本身也可能因为 Android 或 HyperOS 更新而失效。因此每次大版本更新后，我都会把 Root 权限、Zygisk、LSPosed、模块挂载和完整性检测分别确认，而不是只看 KernelSU Manager 是否还能正常打开。

---

## OTA 与后续维护

这套环境里，OTA 需要同时考虑两件事。第一件是 KernelSU 本身依赖当前 Kernel 和启动相关组件，系统更新如果替换了这些内容，Root 状态可能随之变化；第二件是这次解 BL 锁还依赖写入 `lk_a`、`lk_b` 的修改版 MT6991 LK，OTA 如果重新写入对应分区，也可能影响现有解锁状态。

如果更新过程涉及 A/B 槽位切换，还要注意新槽位里的 Kernel、启动镜像和相关分区是否仍然带有当前所需的修改。即使系统能够正常开机，也不能据此判断 KernelSU、Zygisk 和模块环境已经完整保留。

另外，OTA 往往会同步改变安全补丁等级。环境隐藏中如果存在手动配置或自动生成的安全日期、证书和 Attestation 参数，升级后也需要重新核对，否则很容易出现系统已经是新版本，但认证侧仍然保留旧信息的情况。

---

## 后记

折腾到现在，这台 K80 Ultra 日常用起来和原本并没有太大区别。真正能直接感知到的变化，还是 HyperCeiler、HyperIsland、HyperLight 带来的界面和交互调整。Root、Zygisk、LSPosed 以及一整套环境隐藏组件大多数时候都待在后台，只有模块失效、应用检测异常或者系统更新时才会重新注意到它们。

不过真正让人一直想继续折腾下去的，还是那点对未知的好奇，这或许就是技术带给我们的乐趣。
