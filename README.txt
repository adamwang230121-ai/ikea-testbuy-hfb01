━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IKEA Test Buy PWA — 安装说明
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【什么是 PWA？】
PWA（渐进式网页应用）可以像原生 APP 一样安装在手机桌面，
支持离线使用，无需应用商店，直接通过链接分享给同事。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
方法一：部署到内网服务器（推荐团队使用）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 将整个 testbuy-pwa 文件夹上传到你们的内网 Web 服务器
   （Nginx / Apache / IIS 均可）

2. 确保服务器支持 HTTPS（有 SSL 证书）

3. 将 index.html 设为根目录入口

4. 团队成员用 Android Chrome 访问该地址：
   - 打开 Chrome，输入网址
   - 点击右上角菜单 (⋮)
   - 选择「添加到主屏幕」或「安装应用」
   - 点击「安装」→ 桌面出现 IKEA Test Buy 图标

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
方法二：本机局域网分享（快速测试）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

前提：电脑和手机连同一个 WiFi

1. 打开命令行，进入 testbuy-pwa 文件夹：
   cd "C:\Users\yeff\Downloads\FY27 BP Process with AI\Merchandising Basics HFB01\testbuy-pwa"

2. 安装 HTTPS 代理工具（只需一次）：
   npm install -g local-ssl-proxy

3. 启动本地服务器：
   npx serve . -l 8080 &
   local-ssl-proxy --source 8443 --target 8080

4. 查看本机 IP（运行）：
   ipconfig | findstr IPv4

5. 手机 Chrome 访问：
   https://<你的IP>:8443
   （首次会提示证书不安全，点「高级」→「继续访问」）

6. 点击底部横幅「安装到手机桌面」即可

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
方法三：部署到免费云服务（最简单）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

推荐部署到 Cloudflare Pages（免费，自带HTTPS）：

1. 注册 Cloudflare 账号（免费）
2. 进入 Pages → Create a project → Direct Upload
3. 上传 testbuy-pwa 整个文件夹
4. 系统自动分配 HTTPS 域名（如 testbuy-ikea.pages.dev）
5. 将链接分享给团队，所有人可安装

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
文件说明
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
index.html     — 主应用（所有功能）
manifest.json  — PWA 配置（图标、名称、主题色）
sw.js          — Service Worker（离线缓存）
server.js      — 本地开发服务器（Node.js）
icons/         — 各尺寸应用图标

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
技术支持：Adam Wang | IKEA Digital Hub
生成日期：2026-05-18
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
