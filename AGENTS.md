# AGENTS.md — DataNotes AI 開發規範

> 版本：1.0｜主要語言：繁體中文｜架構：JSON 資料驅動｜部署：GitHub Pages

## 1. Project Overview — 專案目的
DataNotes 是 SQL、Python、統計學與資料分析的學習知識庫。專案最重要的目標是**一次建立網站架構，未來只靠新增 JSON 筆記就能持續擴充**。AI 應優先保護既有內容、沿用既有元件，並讓新內容符合統一格式。

## 2. Technology Stack — 技術規範
- 使用 HTML5、CSS3、原生 JavaScript（ES2020+）與 JSON，不使用後端、資料庫、框架、建置工具、外部 CDN 或 API 金鑰。
- 網站由 `index.html` 進入，`js/app.js` 使用 `fetch('./data/notes.json')` 取得筆記。
- 網頁必須可直接部署到 GitHub Pages 子路徑；CSS、JS、JSON 路徑一律採相對路徑。
- 本機使用 `python -m http.server 8000` 預覽，避免 `file://` 無法 fetch JSON。

## 3. Design System — 設計系統
- 現代深色科技風格：深藍背景、紫藍色點綴、清楚的文字對比、卡片式筆記列表。
- 所有共用配色與間距集中在 `css/style.css` 的 CSS 變數，不為新筆記建立獨立 CSS。
- 桌面使用側邊導覽與主要內容；手機採垂直排列，不可有不必要的水平捲動。
- 互動元素應可使用鍵盤操作、具有可見焦點；搜尋與動態結果應具適當的可存取性標示。

## 4. Page Structure — 頁面結構
- **首頁**：品牌介紹、筆記總數、分類數、搜尋、排序及筆記卡片。
- **分類檢視**：依 SQL、Python、統計學、資料分析篩選同一組筆記卡片。
- **筆記詳情**：標題、分類、難度、更新日期、摘要、內容段落、範例程式碼與複製按鈕。
- 不為每篇筆記建立 HTML。採 Hash Routing：`#/` 首頁、`#/category/SQL` 分類、`#/note/sql-select` 筆記。新筆記 ID 自動對應網址。
- 無效筆記網址應顯示友善訊息，不得讓程式中斷。

## 5. Content Schema — 筆記資料契約
`data/notes.json` 必須是 **JSON 陣列**，每個物件具有下列欄位（名稱與型態不可任意改動）：

| 欄位 | 型態 | 規則 |
|---|---|---|
| `id` | string | 唯一英文小寫 kebab-case，如 `sql-group-by`；建立後不得任意更改 |
| `title` | string | 非空繁體中文標題 |
| `category` | string | `SQL`、`Python`、`統計學`、`資料分析` 四選一 |
| `level` | string | `入門`、`中階`、`進階` 三選一 |
| `summary` | string | 非空的一至兩句摘要 |
| `content` | string[] | 非空段落陣列，依序說明學習目標、核心概念、使用方式與重點 |
| `example` | object | 必須包含 `language`（字串）與 `code`（字串）；數學主題可使用 `text` |
| `tags` | string[] | 非空標籤陣列 |
| `updatedAt` | string | `YYYY-MM-DD` 格式的有效日期 |

**可直接複製的單篇筆記物件範例**（加入現有陣列，不要覆蓋其他筆記）：

```json
{
  "id": "sql-group-by",
  "title": "SQL GROUP BY 分組統計",
  "category": "SQL",
  "level": "入門",
  "summary": "使用 GROUP BY 將資料分組並計算彙總結果。",
  "content": [
    "學習目標：理解如何依欄位分組。",
    "核心概念：GROUP BY 將相同欄位值的資料歸為同一組。",
    "實務應用：可搭配 COUNT、SUM、AVG 等聚合函式。",
    "重點整理：SELECT 中的非聚合欄位通常必須出現在 GROUP BY 中。"
  ],
  "example": {
    "language": "sql",
    "code": "SELECT department, COUNT(*) AS total\nFROM employees\nGROUP BY department;"
  },
  "tags": ["分組", "聚合函式", "SQL"],
  "updatedAt": "2026-11-15"
}
```

- JSON 不允許註解、尾端多餘逗號、重複 ID 或非法欄位值。
- 所有知識內容應正確，程式碼應可理解且符合語法；不確定時應標明待確認，不可捏造結果。
- 使用繁體中文；英文專有名詞可保留。避免大段複製受著作權保護的資料。

## 6. File Organization — 檔案結構與命名
```text
DataNotes/
├── AGENTS.md          # AI 開發規範
├── README.md          # 專案介紹、啟動與部署
├── index.html         # 唯一 HTML 入口
├── css/style.css      # 共用設計、響應式樣式
├── js/app.js          # JSON 載入、驗證、搜尋、排序、路由與渲染
└── data/notes.json    # 唯一筆記資料來源
```
- 檔名、筆記 ID 使用英文小寫與連字號；JS 函式及變數使用 camelCase；CSS 類別使用 kebab-case。
- 圖片等資源未來可放 `assets/images/`，但不得為每篇筆記建立獨立 HTML。

## 7. AI Development Rules — AI 修改規則
1. 修改前先閱讀本檔、`README.md` 及相關程式碼。
2. 新增一般筆記時**只修改 `data/notes.json`**；不得重新建立首頁或重寫樣式。
3. 修改既有筆記時保留 ID，只改指定內容與 `updatedAt`。
4. 新功能優先沿用既有結構，避免重複函式、重複 CSS 或不必要依賴。
5. 不得刪除無關筆記、變更既有資料契約或破壞搜尋、分類、排序與閱讀功能。
6. JSON 文字應透過 `textContent` 等安全方式渲染，勿把未信任內容直接塞入 `innerHTML`；不得執行筆記程式碼。
7. 需求與規範衝突時，先向使用者說明並確認；資料結構變更須同步更新所有資料與文件。
8. 完成後回報修改檔案、實際測試結果及未驗證項目，不得虛稱已測試。

## 8. Content Workflow — 新增與修改流程
1. 確認主題、分類、難度；資訊不足才詢問。
2. 閱讀既有 JSON，檢查是否有相同主題及重複 ID。
3. 按第 5 章產生新物件；包含學習目標、核心概念、實作範例與重點整理。
4. 將物件加入 JSON 陣列，不覆蓋既有資料。
5. 驗證 JSON 語法、欄位型態、合法分類、日期與唯一 ID。
6. 在本機 HTTP 網站確認筆記卡片、搜尋、分類及詳情頁。
7. 回報筆記標題、ID、修改檔案與測試結果。

新增**分類**時，須同步更新 `js/app.js` 的分類設定、`index.html` 導覽與本檔合法分類清單；新增**功能**時，先評估最小修改範圍，並回歸測試既有功能。

## 9. Quality Assurance — 驗收標準
- [ ] `data/notes.json` 能解析且所有 ID 唯一。
- [ ] 首頁可顯示筆記及統計數字。
- [ ] 搜尋、分類與排序可正確搭配使用。
- [ ] 點擊筆記可顯示段落與程式碼；複製功能正常。
- [ ] 直接開啟 `#/note/<id>` 可閱讀筆記，無效 ID 有提示。
- [ ] 手機與桌面版無明顯排版錯誤，鍵盤可操作。
- [ ] GitHub Pages 上 CSS、JS、JSON 均可載入，無 404。
- [ ] AI 僅新增一個 JSON 物件即可讓新筆記出現，無須改 HTML。

## 10. Future Extensions — 擴充方向
未來可加入 R、機器學習、資料視覺化分類，或新增收藏、練習題、作品展示。所有擴充必須優先保持**資料與畫面分離、最小修改、一致風格、可驗證、可部署**。若引入新資料欄位，先規劃相容性及舊資料遷移，再更新驗證邏輯、README 與本文件。

---

### AI 最終執行原則
**先讀規範 → 檢查既有架構 → 最小修改 → 驗證 → 回報。**

DataNotes 的成功標準不是只完成一次網站，而是未來任何 AI 都能遵守同一套規則，持續安全且一致地新增學習內容。
