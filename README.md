# cactack

個人用、でも会計・管理会計の要素を入れてちょっと本格的に管理できるようにする

https://cactack-26e4c.web.app/#/top

![demo](https://github.com/AtsukiImamura/cactack/blob/image/image/demo.png)

# 開発

## Getting Started

```
git clone git@github.com:AtsukiImamura/cactack.git
cd cactack
npm i
```

## ビルド

```
# ビルド
npm run build
// npm run build:test #web用developモードビルド
// npm run build:dev #localでのテスト実施用

#ウォッチ
npm run watch
// npm run watch:test
// npm run watch:dev
```

## テスト

テストフレームワーク `jest` でテストを行っています

```
npm run build:dev
npm run test
```

## パッケージ構成

```
/__test__: テストスクリプト置き場
/src
   -/config
   -/env
   -/model: 各レポジトリに格納されるモデルです。実装クラスはビジネスロジック中で用います。
      -/common: 共通に使うモデルです
      -/interface: モデルのインターフェースを定義します。各モデルに対してレポジトリ格納用、ビジネスロジック用の2種類があります。
   -/repository
      -/interface: レポジトリのインターフェースです。ローカルテスト用のスラブクラス、本番用のDBとつながるクラスに分けて実装されます。
      -/stab: ローカルテスト用クラスです。jsonファイルに直接書き込む形でDBを模しています。
      -/transformer: ビジネスロジック用クラスとDB用クラスの変換を行います
      -/util: ユーティリティです
   -/service: サービスクラスです。リポジトリを適宜使いながらビジネスロジックを実装します。レポジトリの振る舞いは環境によって変わらないことが前提です。
   -/util
   -/view: アプリケーションの画面部分を構築します。

```
