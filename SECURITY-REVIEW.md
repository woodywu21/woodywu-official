# 外部服務使用紀錄

## YouTube 首屏背景影片

- 使用者指定影片：https://youtu.be/tAQPNF-egLg
- 嵌入來源：https://www.youtube-nocookie.com/embed/tAQPNF-egLg
- 播放器控制：YouTube 官方 https://www.youtube.com/iframe_api
- 參照官方文件：https://developers.google.com/youtube/player_parameters 與 https://developers.google.com/youtube/iframe_api_reference
- 僅使用官方 iframe API；無 npm 套件安裝、GitHub 程式碼匯入、憑證或網站表單資料傳送。
- 靜音自動播放，單片循環搭配同一 video ID 的 playlist；HTTP 預覽／上線時傳入本網站 origin。
- 暫停、畫面離開與頁籤隱藏均透過官方 API 控制；載入失敗保留本機封面與完整影片連結。
- API 為官方託管服務，非可固定版本的本機套件；未執行不適用的 npm SCA 檢查，不將來源核對描述成完整安全稽核。
