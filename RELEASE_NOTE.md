# Release Note - 9.1 Cloud Bootstrap

- Investment Workspace 品牌化。
- Web Client for GitHub Pages。
- Chrome Extension package。
- Supabase Opening Positions 已建立。
- 8 檔資產 Bootstrap 完成。


## Patch 9.1.2

- 修正 Chrome Extension CSP inline script 錯誤。
- 移除 inline onclick 與 inline script。
- 新增 `packages/ui/app.js` 作為統一啟動檔。


## Patch 9.1.2
- 字體與卡片密度調整，更接近 iPhone 磚感。
- 盈利紅色、虧損綠色規則確認。
- 補回 AI戰情官、諸葛先生、天機、即時情報、資產中心、研究中心、系統中心頁籤。
- 資產卡右上角加入今日現價區塊。


## Patch 9.1.3
- KPI 第一格改回總成本。
- 今日股價改為右上角小型資訊，不搶版面。
- 盈利紅色、虧損綠色，並加入淡色色塊。
- 字體再小兩階，提升手機與插件密度。
- 新增 PRODUCT_CONSTITUTION.md，固定產品初心與設計規則。


## Release 9.2 Auth Foundation
- 新增 Google 登入 UI 基礎。
- 新增 Supabase Auth UUID → Workspace 對應設計。
- 新增 `packages/api/auth.js`。
- 新增 `docs/AUTH_ARCHITECTURE.md`。
- 資料庫已部署 `link_workspace_identity()` 與 `my_workspace_view`。
