# croco techblog

croco の技術ブログ。各リポジトリのコードやアイデアを記事化して公開する場所。

GitHub Pages でホストし、独自ドメインをつけて公開する想定。

## 構成

```
techblog/
├── .github/workflows/
│   └── deploy.yml          # push で自動ビルド & GitHub Pages デプロイ
├── src/
│   ├── content/
│   │   └── blog/           # 記事 Markdown をここに置く
│   ├── layouts/
│   │   └── BlogPost.astro  # 記事レイアウト（author, tags 表示含む）
│   └── pages/
│       ├── blog/           # /blog/* ルート
│       └── blog/tags/      # /blog/tags/* ルート
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 記事の追加方法

`src/content/blog/` の下に新しい Markdown ファイルを作る。ファイル名は URL スラッグになるので、英字小文字＋ハイフン推奨（例: `my-first-post.md`）。

### フロントマター

ファイルの先頭に `---` で囲んだ YAML ブロックでメタデータを書く。

```markdown
---
title: "記事タイトル"
description: "記事の概要（メタタグや検索結果に使われる）"
pubDate: "2026-09-02"
author: pod
tags:
  - database
  - architecture
publish: true
---

ここから本文...
```

| フィールド | 必須 | デフォルト | 説明 |
|------------|------|------------|------|
| `title` | ✅ | - | 記事タイトル |
| `description` | ✅ | - | 概要 |
| `pubDate` | ✅ | - | 公開日（`YYYY-MM-DD` 形式） |
| `author` | 任意 | `pod` | 執筆者名 |
| `tags` | 任意 | `[]` | タグ一覧 |
| `publish` | 任意 | `true` | `false` にするとビルド対象から除外（下書き） |

`publish: false` にしておくと、記事ファイルを置いてもブログ一覧や記事ページに表示されない。準備できたら `publish: true` に変えるだけで公開できる。

### タグ

タグを付けると自動で `/blog/tags/<タグ名>/` ページが生成される。同じタグが付いた記事が一覧できる。

## 開発

```sh
npm install
npm run dev     # ローカル dev サーバー (localhost:4321)
npm run build   # 本番ビルド (dist/ に出力)
npm run preview # ビルド結果をローカルでプレビュー
```

## デプロイ

`main` ブランチに push すると `.github/workflows/deploy.yml` が動き、ビルド済みの静的ファイルを `gh-pages` ブランチにデプロイする。GitHub Pages の設定で `gh-pages` ブランチをソースにすればサイト공개される。

独自ドメインを付ける場合は GitHub リポジトリの Settings → Pages → Custom domain でドメインを設定し、DNS に CNAME/ALIAS を張る。

## このブログの使い方（croco 流）

1. GitHub 上の別リポジトリのコードやアイデアについて話す（口述 or テキスト）
2. AI がその内容を記事 Markdown にまとめる
3. 記事を `src/content/blog/` に配置、フロントマターを整える
4. `main` に push → 自動でビルド & デプロイ → 公開

リポジトリ 1 つ 1 つを記事にしていってる。
