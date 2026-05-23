# 善心记录 — 部署指南

本应用是纯前端 PWA（`dist/` 静态文件）。**记账数据存在手机浏览器里（IndexedDB）**，不会上传到 GitHub 或任何服务器。把网站部署到网上，只是为了让你用 **HTTPS 链接** 在手机上打开并「添加到主屏幕」。

---

## 一、先选一种方式

| 方式 | 适合谁 | 优点 | 注意 |
|------|--------|------|------|
| **GitHub Pages** | 有 GitHub 账号，想固定网址 | 免费、自动 HTTPS、可设为私有仓库 | 仓库需开启 Pages；项目站路径要带仓库名 |
| **仅局域网** | 不想代码上网 | 最私密 | 电脑关机后手机打不开；需同一 Wi‑Fi |
| **Cloudflare Pages / Netlify** | 想要自定义域名 | 部署简单 | 需注册对应平台 |

**推荐：** 用 **GitHub 私有仓库 + GitHub Pages**，只有自己能打开（不公开仓库即可）。

---

## 二、部署到 GitHub Pages（推荐）

### 第 1 步：把代码推到 GitHub

1. 在 [GitHub](https://github.com) 新建仓库，例如名叫 `shanxinjulu`（名字可自定，后面路径会用到）。
2. 在本项目目录打开终端，执行（把下面的地址换成你的仓库）：

```bash
cd d:\Desktop\shanxinjulu
git init
git add .
git commit -m "Initial commit: 善心记录 PWA"
git branch -M main
git remote add origin https://github.com/你的用户名/shanxinjulu.git
git push -u origin main
```

若还没有安装 Git，可先安装 [Git for Windows](https://git-scm.com/download/win)。

`.gitignore` 已忽略 `node_modules` 和 `dist`，不要把这些推上去。

### 第 2 步：确认 GitHub Actions 工作流

仓库里已有文件 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)。  
每次推送到 `main` 分支时会自动：

1. `npm ci` → `npm run build`
2. 按仓库名设置路径（例如 `/shanxinjulu/`）
3. 发布到 GitHub Pages

**无需改代码**，只要仓库名与访问路径一致即可。

### 第 3 步：在 GitHub 上开启 Pages

1. 打开仓库 → **Settings** → **Pages**
2. **Build and deployment** → **Source** 选 **GitHub Actions**（不要选 “Deploy from a branch”）
3. 保存后，到 **Actions** 标签页，等最新一次 **Deploy to GitHub Pages** 跑绿勾

### 第 4 步：访问地址

- **项目站**（仓库名不是 `用户名.github.io`）  
  地址为：  
  `https://你的用户名.github.io/仓库名/`  
  **路径必须与 GitHub 仓库名完全一致（区分大小写）。**

  本仓库示例（Logan-YK / Shanxinjilu）：

  **`https://logan-yk.github.io/Shanxinjilu/`**

  注意末尾的 `/`，以及 **`Shanxinjilu` 首字母大写**。  
  下面地址会 404，不要用：
  - `https://logan-yk.github.io/`（缺少仓库名）
  - `https://logan-yk.github.io/shanxinjilu/`（大小写不对）

- **用户站**（仓库必须命名为 `你的用户名.github.io`）  
  地址为：`https://你的用户名.github.io/`  
  此时需在构建时把基础路径设为 `/`（见下文「特殊：用户站」）。

在 GitHub 仓库页：**Settings → Pages**，部署成功后会显示 **Visit site** 链接，以该链接为准（最不容易写错）。

### 第 5 步：在 Vivo X200 Pro 上安装

1. 手机 **Chrome** 打开上一步的 **https** 地址（必须带 `https`，不要用 `file://`）。  
   正确地址示例：**https://logan-yk.github.io/Shanxinjilu/**
2. 菜单 → **添加到主屏幕** / **安装应用**。
3. 从桌面图标打开即可；之后可离线使用界面，数据仍在手机本机。

**桌面图标不显示（Android / Vivo 常见）：**

- **必须用 Google Chrome** 打开并「添加到主屏幕」。Vivo 自带浏览器、微信内置浏览器通常只能加**书签**，图标常是空白网页标。
- iPhone 可用 SVG；Android 需要 **PNG**（manifest 里已配置绝对路径）。
- 更新图标后：**先完全卸载旧快捷方式**（见下文「彻底清理」），再用 Chrome 重新安装。

### 彻底清理 Vivo 上的旧数据与旧图标（重要）

「清除浏览记录 / 缓存」**往往删不掉账本**，也**换不了桌面图标**。按顺序做：

**第 1 步：删掉桌面上的「善心记录」**

- 长按桌面图标 → **移除** / **卸载** / **删除**（不要只拖到文件夹里）。

**第 2 步：清 Chrome 里该网站的数据（账本在这里）**

1. 打开 **Chrome**（不是 Vivo 浏览器）。
2. 地址栏输入 `chrome://settings/siteData` 或：  
   **设置** → **隐私和安全** → **网站设置** → **所有网站**。
3. 搜索 `github.io` 或 `logan-yk`。
4. 点 **logan-yk.github.io** → **清除并重置**（或「删除数据」）。

或：Chrome → **设置** → **隐私** → **清除浏览数据** → **高级** → 时间范围 **全部** → 勾选 **Cookie 和网站数据** + **缓存的图片和文件** → 清除。

**第 3 步：确认账本已清空（可选）**

- Chrome 重新打开 https://logan-yk.github.io/Shanxinjilu/  
- 若各分类金额全是 0、无历史记录，说明 IndexedDB 已清掉。

**第 4 步：重新安装**

1. 仍用 **Chrome** 打开上述网址（等 5 秒让页面加载完）。
2. 右上角 **⋮** → **添加到主屏幕** 或 **安装应用**。
3. 从**新**桌面图标打开，不要从旧书签进。

**若清完 Chrome 数据后账本还在：**

- 你可能之前用 **Vivo 浏览器 / 其他浏览器** 记过账 → 到那个浏览器里重复第 2 步。
- 或桌面图标其实是 **书签快捷方式**（不是 PWA）→ 删图标后别从书签进，必须 Chrome 里「添加到主屏幕」。
- 或 **iPhone 和 Vivo 各有一份数据**（互不同步），清 Vivo 不会影响 iPhone。

**若图标仍是空白：**

- 确认用的是 Chrome 安装的 PWA，不是 Vivo 浏览器「收藏到桌面」。
- 卸载后等 GitHub 部署更新（manifest 图标路径已改为 `/Shanxinjilu/pwa-192.png` 等绝对路径），再重装。

---

## 数据会丢失吗？（本地存储说明）

账本在 **本机浏览器 IndexedDB** 里，**不会**上传到 GitHub。下列情况 **可能丢数据**：

| 情况 | 会丢数据？ |
|------|------------|
| 很多人同时用同一个网址 | 否（各自手机互不影响） |
| GitHub 宕机 / 你 push 新代码 | 否（只更新网页，不动账本） |
| 换手机、换浏览器 | **是**（新环境没有旧数据） |
| 清除 Chrome「网站数据」/ 卸载 PWA | **是** |
| 系统清理「浏览器缓存」含站点数据 | **可能** |
| 同一网址用无痕模式 | 是（关闭无痕即清空） |
| 手机恢复出厂 / 刷机 | **是** |

**建议：** 每周复制汇总到微信/备忘录作备份；若以后需要，可加「导出 JSON」功能做完整备份。

---

## 三、特殊：用户站（`用户名.github.io` 仓库）

若你的仓库名是 `zhangsan.github.io`，网站根路径是 `/` 而不是 `/shanxinjulu/`。

在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 新建：

- 名称：`VITE_BASE_PATH`
- 值：`/`

然后重新跑一次 Actions，或再 `git push` 一次。

未设置时，工作流默认使用 `/<仓库名>/` 作为路径。

---

## 四、仅本机 / 局域网（不经过 GitHub）

适合临时使用或完全不想上传代码。

### 在电脑上开发预览

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

### 构建后用局域网给手机访问

```bash 
npm run build
npx serve dist
```

终端会显示类似 `http://192.168.1.100:3000`。手机连**同一 Wi‑Fi**，Chrome 打开该地址 → 添加到主屏幕。

电脑休眠或断网后，手机无法访问。

### 把 `dist` 拷到手机

1. `npm run build`
2. 将 `dist` 文件夹拷到手机
3. 用支持本地 HTTP 的工具（如部分「本地服务器」类 App）在手机上托管 `dist`，再通过 `http://127.0.0.1:端口` 访问  

不推荐直接用 `file://` 打开 `index.html`，PWA 与路由可能异常。

---

## 五、其他托管（可选）

### Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. 连接 GitHub 仓库
3. 构建设置：**Framework preset** = None，**Build command** = `npm run build`，**Build output directory** = `dist`
4. **Environment variables**（项目站要子路径时）：`VITE_BASE_PATH` = `/你的项目名/`；根域名部署则设为 `/`
5. 部署完成后用手机 Chrome 打开分配的 `https://xxx.pages.dev` 地址

### Netlify

类似：连接 Git 仓库，build 命令 `npm run build`，发布目录 `dist`，按需设置环境变量 `VITE_BASE_PATH`。

---

## 六、本地手动构建（与线上一致）

项目通过环境变量 `VITE_BASE_PATH` 控制资源路径（对应 Vite 的 `base`）：

```bash
# 本地开发（默认根路径 /）
npm run dev

# 模拟 GitHub 项目站，仓库名为 shanxinjulu
set VITE_BASE_PATH=/shanxinjulu/
npm run build
npm run preview
```

PowerShell：

```powershell
$env:VITE_BASE_PATH="/shanxinjulu/"
npm run build
```

构建后可用 `npx serve dist` 在本地验证子路径是否正常（`serve` 需能处理 SPA；`npm run preview` 已按 `base` 配置）。

---

## 七、隐私与安全说明

- 部署到 GitHub Pages 的只是 **网页静态文件**（HTML/JS/CSS），**不包含**你的账本数据。
- 账本在每台设备的浏览器 IndexedDB 里；换手机、换浏览器、清除网站数据会丢失记录，请注意备份（若以后增加导出功能可用）。
- 仓库可设为 **Private**，Pages 仍可只给自己用；不要把 Pages 设成对外推广即可。
- 无需 API Key；不要把 `.env` 里的私密信息提交到 Git。

---

## 八、常见问题

### 打开 Pages 后显示 “There isn't a GitHub Pages site here” 或 404

1. **先核对完整 URL**（最常见原因）  
   - 项目站必须是：`https://用户名.github.io/仓库名/`  
   - **仓库名大小写必须与 GitHub 上一致**（例如 `Shanxinjilu` ≠ `shanxinjilu`）。  
   - 不要只打开 `https://用户名.github.io/`。

2. **用 GitHub 给的链接**  
   仓库 → **Settings → Pages** → 看是否已有 **Visit site**；或 **Actions** 里最近一次成功的 **Deploy to GitHub Pages** → 右侧环境链接。

3. **确认 Pages 已启用**  
   Settings → Pages → Source = **GitHub Actions**（不是 “Deploy from a branch”）。

4. **确认 Actions 已成功**  
   **Actions** 标签 → **Deploy to GitHub Pages** 为绿色勾；若失败，点进去看红色步骤的报错。

5. 首次部署完成后等待 **1～3 分钟** 再刷新；仍不行则清除缓存或用无痕模式。

### 添加到主屏幕后打不开 / 不是全屏

- 必须用 **Chrome** 通过 **https** 打开过一次再安装。
- 检查是否误用 `http://` 内网 IP 且电脑已关机（应改用 GitHub Pages 固定链接）。

### 换域名或换仓库名后打不开

- 仓库改名后需等 Actions 重新部署；`VITE_BASE_PATH` 会随仓库名自动变为 `/<新仓库名>/`。
- 手机上删除旧主屏幕快捷方式，用新链接重新「添加到主屏幕」。

### `git push` 失败

- 检查是否已登录 GitHub（HTTPS 需 Personal Access Token，或改用 SSH 地址）。
- 首次推送：`git push -u origin main`。

---

## 九、相关文件

| 文件 | 作用 |
|------|------|
| [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) | 自动构建并发布到 GitHub Pages |
| [`vite.config.ts`](vite.config.ts) | `base` 读取 `VITE_BASE_PATH` |
| [`src/App.tsx`](src/App.tsx) | 路由 `basename` 与 `base` 一致 |
| [`README.md`](README.md) | 功能说明与使用提示 |

---

## 十、最短流程（ checklist ）

1. [ ] `git push` 到 GitHub（可用私有仓库）
2. [ ] Settings → Pages → Source = **GitHub Actions**
3. [ ] Actions 里部署成功
4. [ ] 手机 Chrome 打开 `https://用户名.github.io/仓库名/`
5. [ ] **添加到主屏幕**
6. [ ] 试记一笔并复制，确认功能正常

完成以上步骤后，即可长期用固定链接记账，无需应用商店。
