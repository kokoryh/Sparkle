# Bilibili 增强

## 参数说明

| 参数             | 可选值 / 格式               | 默认值 | 说明                                                                     |
| ---------------- | --------------------------- | ------ | ------------------------------------------------------------------------ |
| 动态最常访问     | `auto` / `show` / `hide`    | `auto` | `auto`：仅当列表中存在直播状态时显示；`show`：始终显示；`hide`：始终隐藏 |
| 创作中心         | `0` / `1`                   | `0`    | `0`：隐藏；`1`：显示                                                     |
| 过滤置顶评论广告 | `0` / `1`                   | `1`    | `0`：关闭；`1`：开启                                                     |
| 优化评论区加载   | 配置为 `#` 时关闭           | 开启   | 默认开启；配置为 `#` 时关闭                                              |
| 空降助手         | 配置为 `#` 时关闭           | 开启   | 默认开启；配置为 `#` 时关闭                                              |
| 空降助手策略     | 策略名称                    | DIRECT | 默认直连；建议配置为代理策略（视网络环境而定）                           |
| 日志等级         | `1` / `2` / `3` / `4` / `5` | `4`    | `1`：DEBUG；`2`：INFO；`3`：WARN；`4`：ERROR；`5`：OFF                   |

## 常见问题

- **开启空降助手后不显示弹幕**

  MitM添加主机名 `-raw.githubusercontent.com` 后重试

- **是否支持Script Hub？**

  不支持

## 支持的APP

| Surge                                                                                                                  | Loon                                                                                                                                                                                   | Egern                                                                                                                                                                               | QuantumultX | Shadowrocket |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| [模块地址](https://raw.githubusercontent.com/kokoryh/Sparkle/refs/heads/master/release/surge/module/bilibili.sgmodule) | [一键安装](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Fkokoryh%2FSparkle%2Frefs%2Fheads%2Fmaster%2Frelease%2Floon%2Fplugin%2Fbilibili.lpx) | [一键安装](https://egernapp.com/modules/new?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkokoryh%2FSparkle%2Frefs%2Fheads%2Fmaster%2Frelease%2Fsurge%2Fmodule%2Fbilibili.sgmodule) | 不支持      | 不支持       |

## 特别鸣谢

- [@app2smile](https://github.com/app2smile/rules)
- [@BiliUniverse](https://github.com/BiliUniverse/Universe)
- [@Maasea](https://github.com/Maasea/sgmodule)

