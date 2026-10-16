# Woody 個人品牌網站改版

## 新產品影片首屏更新

- 使用使用者指定影片 https://youtu.be/tAQPNF-egLg 作為首屏滿版背景。
- 靜音、自動播放、playsinline、單片循環；loop=1 與 playlist=tAQPNF-egLg 同時設定，另於結束事件補上重播。
- 16:9 影片以 cover 方式填滿容器，手機直式畫面會裁切左右兩側；深色漸層與白色文字維持閱讀清晰度。
- 加入暫停／恢復按鈕及觀看完整影片連結；離開首屏或切換頁籤時暫停，回到畫面後依使用者播放意願恢復。
- 尊重減少動態效果設定：先顯示封面，使用者可手動播放；自動播放遭限制或影片載入失敗時保留本機封面。
- 人物照片移至「關於 Woody」，原照片設定仍可使用。
- 新增 assets/video-hero.css、assets/video-hero.js、assets/product-video-poster.jpg。舊版 HTML、CSS、JS 備份於 backups 的 before-video-hero 檔案。
- Chrome 桌面與 390px 手機預覽已確認靜音播放，播放／暫停切換正常；手機無水平溢出，首屏按鈕高度 54px。
- 播放仍受 YouTube 可用性、網路、嵌入權限與瀏覽器自動播放政策影響；以 HTTP/HTTPS 預覽與部署。

播放器參數依據：[YouTube 官方文件](https://developers.google.com/youtube/player_parameters)。

## 設計與使用體驗

- 將深色發光卡片改為暖白、森林綠與低彩度淺綠，統一按鈕、卡片圓角、留白及閱讀層級。
- 中英文共用 Noto Sans TC 字型，使用 400、500、600、700 四種字重；內文以 16px 為基礎，標題依裝置寬度調整。
- 重排為：首頁 → 核心服務與企業培訓 → 實務作品 → 關於 Woody → 雙軌職務 → 專業背景 → 聯絡與表單 → 預約。
- 保留三項核心方案、全部 11 張照片、公司網站、四個社群、Google Form 與 Google 行事曆連結。
- 作品先顯示 6 張，其餘 5 張可展開；照片保留完整畫面，支援放大與 Esc 關閉。
- 預約按鈕不再於滑鼠移入時切換成英文狀態文字。
- 照片更換功能移至頁尾「個人化照片設定」，沿用原本瀏覽器儲存鍵，補上圖片類型、大小與網址檢查，避免失敗照片反覆重試。
- 加入跳至主要內容、清楚的鍵盤焦點、原生 dialog、選單展開狀態、減少動態效果設定與圖片替代文字。
- 沒有 JavaScript 時仍可讀取主要內容、展開作品、使用照片原始連結與手機導覽。

## SEO 與效能

- 描述性 title、meta description、繁體中文語言標記與 author。
- 單一 H1、明確 H2/H3、main/nav/header/footer 語意結構。
- Open Graph 與 Twitter 分享文字；Person JSON-LD 僅採用原頁已提供的身分與社群資訊，無虛構評價與評分。
- 自有 favicon、robots.txt；備份、課堂範例與驗證產物路徑排除爬取。
- 移除 Tailwind CDN 執行期程式；使用 assets/site.css 與延後執行的 assets/site.js。
- Google Fonts 使用 display=swap，縮減為單一字族與必要字重。
- 11 張 WebP 縮圖沿用既有最佳化資產，搭配 lazy loading、圖片尺寸與固定顯示比例；首屏人物照優先載入。
- 以上屬本機可驗證的基礎改善，不代表 Google 已收錄、排名提升或 Core Web Vitals 已通過。

## 上線仍需補齊

1. 確認此個人網站的正式 HTTPS 網址，再設定 canonical、og:url；公司官網不等於此網站網址。
2. 提供正式分享預覽圖及可公開存取的絕對網址，補入 og:image／twitter:image。
3. 依實際網址建立 sitemap.xml，並在 robots.txt 宣告 Sitemap。
4. 部署時只發布網站所需檔案，勿將 backups、Hike、artifacts 與本說明一併發布。robots.txt 的 Disallow 不等於存取保護或 noindex。
5. 網站公開後，以 Search Console 驗證所有權、送出 sitemap，再以 PageSpeed Insights／實際使用資料檢查效能。
6. 正式人物照目前仍使用原 Google Drive 來源；外部來源可能影響載入。建議日後將確認過的原始人物照存為本機 WebP 資產。

## 檔案

- index.html：正式頁面
- assets/site.css：統一設計系統與響應式版面
- assets/site.js：導覽、作品燈箱、照片設定
- assets/portfolio/：作品縮圖；作品集/：原始照片
- backups/index-before-ui-redesign.html：改版前原始備份

## 已完成驗證

- Chrome 實機預覽：320、390、768、1024px 與一般桌面寬度未出現水平溢出；768px 改用單欄服務卡片。
- 手機導覽可展開，點選連結後會關閉，aria-expanded 隨狀態更新。
- 作品燈箱可開啟原圖，Esc 可關閉；展開作品後共顯示 11 張。
- 首批 6 張作品圖均已於瀏覽器載入，容器採一致 4:3 比例；人物照於手機依比例縮放。
- 檢查單一 H1、唯一 ID、頁內錨點、本機圖片、圖片替代文字、JSON-LD 格式及改版前所有外部連結目的地。
- JavaScript 語法檢查通過；瀏覽器未記錄 JavaScript error。
- 預覽存於 artifacts/ui-desktop.jpg、ui-mobile.jpg、ui-portfolio.jpg 與 ui-full-page.jpg。

參考：[Google Search Central：開發人員 SEO 指南](https://developers.google.com/search/docs/fundamentals/get-started-developers)、[搜尋標題](https://developers.google.com/search/docs/appearance/title-link)。
