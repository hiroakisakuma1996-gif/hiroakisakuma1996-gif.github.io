# Hiroaki Sakuma — Personal Site

佐久間弘明（Hiroaki Sakuma）の自己紹介ウェブサイト。AIガバナンスと「リスク」をめぐる研究・実務・政策提言の活動をまとめています。

ビルド不要の静的サイト（HTML / CSS / Vanilla JS）です。

## 更新方法

コンテンツはすべて [`data.js`](data.js) の1ファイルに集約されています。
このファイルを編集してコミット・プッシュするだけで、サイトに反映されます。

- `name_ja` / `name_en` / `tagline` … 基本情報
- `book` … トップに表示する注目の出版物
- `roles` … 現在の活動・肩書き
- `career_ja` / `career_en` … 経歴詳細（トグル表示）
- `publications` … Publications / Interviews（日付順に自動整列、最新分はトップのNewsにも自動掲載）
- `speaking` … 登壇・講演（同上）
- `links` … 外部リンク（Researchmap, note, Spotify など）

## ローカルプレビュー

```bash
python3 -m http.server 8000
# http://localhost:8000 を開く
```

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | ページ骨格 |
| `styles.css` | デザイン（黒基調・サンセリフ） |
| `app.js` | データからの描画・タブ制御・News自動生成 |
| `data.js` | 全コンテンツ（編集する唯一のファイル） |
