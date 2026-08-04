# ZI-ZHEN DING · 個人作品集網站

Illustrator / Graphic Designer / Animator 的個人形象網站。純靜態網頁(HTML + CSS + JavaScript),不需要任何後端伺服器或資料庫,可以直接部署到 GitHub Pages 或 Netlify。

## 📁 專案結構

```
.
├── index.html          # 網站主頁面(所有內容都在這一頁)
├── style.css           # 所有樣式(顏色、間距、字體、排版)
├── script.js           # 互動功能(選單、輪播圓點、表單驗證)
├── images/              # 所有圖片與 SVG 素材
├── netlify.toml         # Netlify 部署設定
├── .nojekyll             # 告知 GitHub Pages 不要用 Jekyll 處理
└── README.md            # 這份說明文件
```

沒有任何建置(build)步驟、沒有 npm 套件需要安裝 —— 打開 `index.html` 就能直接在瀏覽器看到完整網站。

## 🖥️ 本機預覽

不需要安裝任何工具,兩種方式都可以:

**方式一(最簡單)**:直接用瀏覽器打開 `index.html` 檔案即可。

**方式二(如果你的電腦有安裝 Python)**:
```bash
cd 這個資料夾
python3 -m http.server 8080
```
然後瀏覽器打開 `http://localhost:8080`

## 🚀 部署方式

### 方法一:GitHub Pages(推薦,永久免費)

1. 到 [github.com](https://github.com) 建立一個新的 repository(公開或私人都可以,免費帳號公開才能用 GitHub Pages)
2. 把這整個資料夾的檔案上傳(可以直接在網頁上拖曳上傳,或用 Git 指令)
3. 進入 repository 的 **Settings → Pages**
4. Source 選擇 `main` branch,資料夾選 `/ (root)`,按 Save
5. 等 1-2 分鐘,GitHub 會給你一個網址,格式像:
   `https://你的帳號.github.io/repository名稱/`

### 方法二:Netlify(部署更快、介面更直覺)

1. 到 [netlify.com](https://netlify.com) 註冊帳號
2. 登入後,直接把整個資料夾**拖曳**到網頁上的上傳區(Netlify 首頁有一個「Drag and drop your site output folder here」的區域)
3. 幾秒鐘後就會拿到一個網址,格式像:
   `https://隨機名稱.netlify.app`
4. 之後想換成自訂網域,可以在 Netlify 後台的 **Domain settings** 設定

兩種方式用的是**同一份檔案**,不需要為了不同平台修改任何東西。

## 🔧 之後要串接的功能(目前是預留位置)

程式碼裡已經用 `<!-- TODO -->` 註解標記好位置,搜尋 `TODO` 就能找到:

1. **聯絡表單寄信**(Formspree):打開 `index.html`,找到 `<form class="contact-form" action="#"` 這一行,把 `action="#"` 換成你的 Formspree 網址,例如:
   ```html
   <form class="contact-form" action="https://formspree.io/f/abcd1234" method="POST">
   ```

2. **社群圖示連結**:同樣在 `index.html` 搜尋 `TODO`,把對應的 `href="#"` 換成:
   - Email:`mailto:你的信箱`
   - Instagram / Facebook / YouTube:換成對應的個人頁面網址

這兩件事都只需要改一行文字,不需要動到樣式或版面。

## 📖 後續維護

日常內容修改(換照片、改文字、加作品)的完整步驟,請看 [`MAINTENANCE.md`](./MAINTENANCE.md)。
