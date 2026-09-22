# 第三方材料说明

本项目的 AGPL-3.0 许可证只覆盖本仓库中由项目贡献者拥有权利、且没有另行说明的原创程序代码。以下材料继续适用各自的许可证和条款。

## Patrick Hand

- 用途：英文字帖的默认显示字体
- 来源：[Google Fonts / Patrick Hand](https://github.com/google/fonts/tree/main/ofl/patrickhand)
- 许可证：SIL Open Font License 1.1
- 当前使用方式：字体与许可证保存在 `assets/vendor/patrick-hand/`，由网站本地加载

再分发字体时，请同时保留目录中的 `OFL.txt` 和版权信息。

## pinyin-pro 3.18.2

- 用途：汉字拼音转换
- 来源：[pinyin-pro](https://github.com/zh-lx/pinyin-pro)
- 许可证：MIT（以所使用版本的上游许可证为准）
- 当前使用方式：浏览器版本、`package.json` 和 MIT `LICENSE` 保存在 `assets/vendor/pinyin-pro/`，由网站本地加载

## Hanzi Writer Data 2.0.1

- 用途：汉字笔画轮廓、中线与顺序数据
- 来源：[hanzi-writer-data](https://github.com/chanind/hanzi-writer-data)
- 许可证：上游仓库所附 ARPHIC Public License
- 当前使用方式：完整数据保存在 `assets/hanzi-writer-data/`，页面按所需汉字加载本地 JSON 数据

再分发、镜像或修改这些数据前，请直接阅读上游版本中的 `ARPHICPL.TXT`。

## 系统字体

页面列出的 Arial、Arial Rounded、楷体、宋体、黑体等是 CSS 字体族名称。本仓库不包含这些字体文件；实际显示取决于用户设备上安装的字体及其许可。

## 网络加载

上述字体、拼音库和笔画数据均由网站本地加载，不依赖第三方 CDN。来源链接仅用于说明上游项目，用户主动点击后才会访问相应外部网站。
