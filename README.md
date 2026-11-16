# DataNotes｜資料科學學習知識庫

一個以 **AGENTS.md 驅動開發規則** 的繁體中文資料科學筆記網站。透過單一 JSON 資料來源，持續擴充 SQL、Python、統計學及資料分析內容，不必每次新增筆記都重新寫 HTML。

## 功能
- 深色響應式首頁與側邊欄分類
- 筆記全文、標題與標籤搜尋
- 依分類篩選、依日期／標題／分類排序
- 筆記詳情與程式碼範例複製
- JSON 資料驗證與載入失敗提示
- 免建置、免後端，支援 GitHub Pages

## 檔案結構
```text
DataNotes/
├── AGENTS.md
├── README.md
├── index.html
├── css/style.css
├── js/app.js
└── data/notes.json
```

## 本機執行
必須使用 HTTP server（`fetch` 讀取 JSON，直接雙擊 HTML 可能遭瀏覽器安全限制）：

```bash
cd DataNotes
python -m http.server 8000
```

開啟 `http://localhost:8000`。

## GitHub Pages 部署
1. 在 GitHub 建立公開 Repository（例如 `DataNotes`）。
2. 將本專案**根目錄內的檔案與資料夾**上傳至 Repository 根目錄（確保 `index.html` 位於根目錄）。
3. 開啟 **Settings → Pages → Build and deployment**。
4. Source 選 **Deploy from a branch**；Branch 選 `main`、資料夾選 `/(root)`，按 Save。
5. 等待部署完成，開啟 `https://你的帳號.github.io/DataNotes/`。
6. 若 Repository 名稱不同，請依實際名稱調整網址；如果是 `你的帳號.github.io` 儲存庫，則網站網址通常沒有 `/DataNotes/` 路徑。

## 筆記網址
- 首頁：`#/`
- SQL 分類：`#/category/SQL`
- 指定筆記：`#/note/sql-select`

## 新增一篇筆記
先閱讀 `AGENTS.md`。在 `data/notes.json` 陣列新增一個物件，依照下列格式填寫：

```json
{
  "id": "python-list",
  "title": "Python List 基礎",
  "category": "Python",
  "level": "入門",
  "summary": "認識串列與索引。",
  "content": ["List 是可變的有序容器。", "索引從 0 開始。"],
  "example": { "language": "python", "code": "items = [1, 2, 3]\nprint(items[0])" },
  "tags": ["Python 基礎", "List"],
  "updatedAt": "2026-11-15"
}
```

儲存後重新整理網站，筆記將自動出現；不需修改 `index.html`。`id` 必須唯一；`category` 與 `level` 必須使用 `AGENTS.md` 列出的值。

## 驗證 AI 是否能遵守規則
提供給 AI 的指令範例：

> 請先閱讀 AGENTS.md，再為 DataNotes 新增一篇「Python List 基礎」筆記。僅在 data/notes.json 新增符合規範的物件，不修改其他不相關檔案。完成後檢查 JSON、搜尋、分類與筆記詳情是否正常。

## 驗收清單
- [ ] 首頁載入，顯示初始筆記
- [ ] 搜尋 `JOIN` 找到 SQL JOIN 筆記
- [ ] 點選 `Python` 僅顯示 Python 分類
- [ ] 切換排序後筆記順序更新
- [ ] 點選「閱讀筆記」可顯示內容與範例
- [ ] 新增 JSON 筆記後重新整理即可顯示
- [ ] 手機版能正常操作
- [ ] GitHub Pages 公開網址可開啟

## 專案說明
這個作業的重點是**規則可重複使用**：AI 先閱讀 AGENTS.md，理解資料契約、風格、命名與驗收方式，之後只需新增 JSON 筆記就能持續擴充內容，避免重複製作網頁。
