# croco techblog

croco の技術ブログ。社内のリポジトリを1つずつ棚卸しして、そこで実際にやったことを記事にする場所。

- 公開先: <https://techblog.cro-co.co.jp>
- ホスティング: GitHub Pages（GitHub Actions から直接デプロイ）
- フレームワーク: Astro 7（完全静的生成、SSR なし）

記事を書きたいだけなら「[記事を書く](#記事を書く)」だけ読めば足ります。

---

## 記事を書く

### 1. ファイルを作る

`src/content/blog/` の下に Markdown ファイルを1つ置きます。**ファイル名がそのまま URL になります。**

```
src/content/blog/pages-custom-domain.md   →  https://techblog.cro-co.co.jp/pages-custom-domain/
```

英小文字とハイフンで付けてください（日本語ファイル名は URL エンコードされて読めなくなります）。一度公開したファイル名を変えると URL が変わって外部リンクが切れるので、公開後の改名は避けます。

`.mdx` にすると本文の中で Astro コンポーネントを読み込めます。ふつうの記事は `.md` で十分です。

### 2. フロントマターを書く

ファイルの先頭に `---` で囲んだ YAML を置きます。

```markdown
---
title: 'GitHub Pages の Custom domain が毎回外れる'
description: 'デプロイのたびに Custom domain の設定が飛ぶ。public/CNAME を配信物に同梱して解決した話。'
pubDate: '2026-09-03'
author: pod
tags:
  - ci
  - ops
heroImage: '../../assets/blog-placeholder-2.jpg'
publish: true
---

ここから本文。
```

| フィールド | 必須 | 既定値 | 説明 |
|---|---|---|---|
| `title` | ✅ | — | 記事タイトル。一覧のタイル、`<title>`、OGP に使われる |
| `description` | ✅ | — | 概要。検索結果・OGP・RSS に出るので、内容が分かる1〜2文にする |
| `pubDate` | ✅ | — | 公開日。`YYYY-MM-DD` 推奨。**一覧の並び順はこれの降順** |
| `updatedDate` | | — | 入れると記事ページの日付の隣に「最終更新」が出る |
| `author` | | `pod` | 執筆者。`/author/<author>/` が自動で生えます |
| `tags` | | `[]` | タグ。`/tags/<tag>/` が自動で生え、ナビのタグ一覧にも出ます |
| `heroImage` | | — | アイキャッチ。**md ファイルからの相対パス** |
| `publish` | | `true` | `false` にすると下書き扱い。どのページにも RSS にも出ません |

必須項目が抜けていたり型が違うとビルドが落ちます（スキーマは [src/content.config.ts](src/content.config.ts)）。CI で気づくのではなく、手元の `npm run build` で先に潰してください。

**下書きにするとき**は `publish: false` にします。ファイルを置いたまま非公開にできるので、書きかけを main に入れても問題ありません。書き上がったら `true` に変えて push するだけです。

**タグ**はいまのところ自由に増やせます。ナビゲーションバーのタグ一覧は「記事数の多い順 → 名前順」で全部並ぶので、1記事にしか使わないタグを乱発すると鬱陶しくなります。既存のタグを先に見てから付けてください。

**著者**は既定が `pod` です。自分の記事には自分の名前を入れてください。入れた分だけ `/author/<name>/` が生えます。

### 3. アイキャッチ画像

`src/assets/` に置いて、md からの相対パス（`../../assets/foo.jpg`）で指すと、ビルド時に WebP へ変換・リサイズされます。`public/` に置くとこの最適化が効かないので `src/assets/` を使ってください。

- 一覧のタイルは **16:9** で切り抜かれます
- 記事ページのヒーローは **40:17**（横長）で切り抜かれます
- 元画像は **横 1600px 以上**を推奨。表示枠は最大 1200px なので、それ未満だと拡大されてぼやけます

省略しても構いません。その場合タイルにはスラッグを書いた枠が出ます。既存の `blog-placeholder-*.jpg` を暫定で使っても構いません。

### 4. 本文を書く

ふつうの Markdown です。見出しは `##` から始めてください（`#` は記事タイトルが使っています）。

**日本語の改行に注意**: 段落の途中で改行すると、HTML では改行が半角スペースとして描画されます。

```markdown
原因は一つではなかった。
順に出てきたので、順に書く。
```

これは「原因は一つではなかった。 順に出てきたので、順に書く。」と、句点のあとに余分な空白が入って表示されます。1段落は1行で書くか、段落を分けてください。（Markdown 処理系側で吸収するのが本来の解ですが、Astro 7 の既定処理系ではプラグイン追加に別パッケージが要るため、いまは書き手側の約束にしています。）

### 5. 手元で見る

```bash
npm install
```

```bash
npm run dev
```

`http://localhost:4321/` が開きます（`.claude/launch.json` からは 4400 で起動します）。ファイルを保存すると自動で反映されます。

出す前に必ず本番ビルドを通してください。CI と同じことをします。

```bash
npm run build
```

### 6. PR を出す

```bash
git switch -c post/pages-custom-domain
git add src/content/blog/pages-custom-domain.md src/assets/...
git commit -m "post: GitHub Pages の Custom domain が毎回外れる"
git push -u origin post/pages-custom-domain
```

PR を出すと Actions がビルド検証だけ走ります（デプロイはしません）。緑になったら main へマージ。マージすると自動でビルドされて数分で公開されます。

main へ直接 push しても公開はされますが、ビルドが落ちるとサイトが更新されないまま気づきにくいので、PR を経由することをおすすめします。

---

## サイトの構成

### ページと URL

| URL | 中身 | 実装 |
|---|---|---|
| `/` | リード文 + 最新 12 件（3列 × 4行）。13 件目以降は「その他の記事」から一覧へ | [src/pages/index.astro](src/pages/index.astro) |
| `/<slug>/` | 記事本文 | [src/pages/\[slug\].astro](<src/pages/[slug].astro>) |
| `/articles/` | 記事一覧の1ページ目 | [src/pages/articles/index.astro](src/pages/articles/index.astro) |
| `/articles/page/<n>/` | 記事一覧の n ページ目 | [src/pages/articles/page/\[page\].astro](<src/pages/articles/page/[page].astro>) |
| `/tags/<tag>/` | タグ別一覧 | [src/pages/tags/\[tag\]/index.astro](<src/pages/tags/[tag]/index.astro>) |
| `/tags/<tag>/page/<n>/` | タグ別一覧の n ページ目 | [src/pages/tags/\[tag\]/page/\[page\].astro](<src/pages/tags/[tag]/page/[page].astro>) |
| `/author/<author>/` | 著者別一覧 | [src/pages/author/\[author\]/index.astro](<src/pages/author/[author]/index.astro>) |
| `/author/<author>/page/<n>/` | 著者別一覧の n ページ目 | [src/pages/author/\[author\]/page/\[page\].astro](<src/pages/author/[author]/page/[page].astro>) |
| `/about/` | 固定ページ | [src/pages/about.astro](src/pages/about.astro) |
| `/rss.xml` | RSS | [src/pages/rss.xml.js](src/pages/rss.xml.js) |
| `/sitemap-index.xml` | サイトマップ（`@astrojs/sitemap` が自動生成） | — |

一覧系は **1ページ 3列 × 最大5行 = 15件**。超えたら `page/<n>` が生えます。件数は [src/consts.ts](src/consts.ts) の `PER_PAGE` と、トップの `TOP_COUNT` で変えられます。

`page/1` は URL として存在しますが、`<link rel="canonical">` は親（`/articles/` など）を指しています。1ページ目が2つの URL で重複しないようにするためです。

カテゴリは設けていません。分類はタグだけです。

### ディレクトリ

```
src/
├── content/blog/          記事の Markdown / MDX。ここが唯一の記事の置き場
├── content.config.ts      フロントマターのスキーマ（zod）
├── consts.ts              サイト名・説明・1ページあたりの件数
├── utils/posts.ts         記事の取得・並べ替え・タグ／著者の集計・ページ切り出し
├── layouts/
│   ├── Base.astro         html/head/body + ヘッダー + フッター。全ページの土台
│   └── BlogPost.astro     記事ページの体裁（ヒーロー、メタ、本文、記事送り）
├── components/            ヘッダー、フッター、タイル、ページャなど
├── styles/global.css      配色トークンと文字サイズ。見た目の基準はここ
└── assets/                アイキャッチとフォント（ビルド時に最適化される）

design/                    デザイン案（Claude Design のアートボード）
public/                    そのまま配信されるファイル（CNAME, favicon）
.github/workflows/         CI
```

**記事データの経路は [src/utils/posts.ts](src/utils/posts.ts) に集約しています。** `getPosts()` が「`publish: true` だけを `pubDate` の降順で返す」役目を持っていて、一覧・タグ・著者・RSS はすべてこれを通ります。ページを増やすときも `getCollection` を直接呼ばず `getPosts()` を使ってください。経路ごとに絞り込みを書くと、下書きが RSS にだけ漏れるといった事故が起きます（実際に #1 で起きました）。

### 見た目を変える

配色は [src/styles/global.css](src/styles/global.css) の CSS 変数に集約しています。`:root` がライト、`@media (prefers-color-scheme: dark)` がダークで、**ダーク側は変数の値だけを差し替えています**。閲覧者の OS 設定に従うので、サイト側にテーマ切り替えボタンはありません。色を変えるときは個別の要素ではなくこの変数を触ってください。

文字サイズと行間は再設計前のスケールをそのまま引き継いでいます（本文 20px / 行間 1.7、`h1` 3.052em、`h2` 2.441em …）。

フォントは Astro の Fonts API で読み込んでいます（[astro.config.mjs](astro.config.mjs)）。本文と見出しが Atkinson Hyperlegible（リポジトリ同梱）、日付・タグ・ナビ・ページャなどのメタ情報だけ JetBrains Mono（Google Fonts）です。

---

## ビルドとデプロイ

```bash
npm run dev       # 開発サーバ
npm run build     # 本番ビルド（dist/ に出力）
npm run preview   # ビルド結果をローカルで確認
```

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 1本で回しています。

- **main への push** → ビルド → `dist/` を GitHub Pages へアップロード → 公開
- **main 向けの PR** → ビルド検証のみ（デプロイはしない）
- 手動実行（`workflow_dispatch`）でも再デプロイできます

`gh-pages` ブランチは使いません。リポジトリの **Settings → Pages → Source が「GitHub Actions」** である必要があります。ここが「Deploy from a branch」に戻っていると、ビルドが緑でもサイトは一切更新されません。

独自ドメインは [public/CNAME](public/CNAME) に置いてあり、ビルドのたびに `dist/CNAME` として配信物へ入ります。Settings 側の Custom domain 設定はデプロイのたびに外れることがあるため、この形にしています。ドメインを変えるときはこのファイルを直し、DNS 側にも CNAME / ALIAS を張ってください。

依存は [Dependabot](.github/dependabot.yml) が weekly で追います。`astro` と `@astrojs/*` は peer 依存が連動しているので1つの PR にまとめています。更新 PR でもビルド検証が走るので、壊れる更新はマージ前に落ちます。

---

## 困ったとき

**ビルドは緑なのにサイトが変わらない**
Settings → Pages の Source が「GitHub Actions」か確認してください。

**記事を追加したのに一覧に出ない**
`publish: false` になっていないか確認してください。ファイルが `src/content/blog/` の直下（またはその配下）に `.md` / `.mdx` として置かれていないと、そもそも読み込まれません。なお未来日の `pubDate` は弾いていないので、日付を先にすると一覧の先頭に出ます。予約投稿はできません。

**アイキャッチがぼやける**
元画像の横幅が足りていません。1600px 以上を用意してください。

**日本語の文中に半角スペースが入る**
段落の途中で改行しています。1段落は1行で書いてください。

**ローカルの 4321 が埋まっている**
別のプロジェクトの dev サーバが動いています。`npm run dev -- --port 4400` のようにポートを指定してください。

---

## 参考

- Astro ドキュメント: <https://docs.astro.build>
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)（記事データの扱い）
- [Routing](https://docs.astro.build/en/guides/routing/)（URL とページの対応）
