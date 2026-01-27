# バックエンド設計

## 概要

Go + Ginフレームワークによるリアルタイムゲームサーバー。
WebSocketとREST APIを提供。

## ディレクトリ構造

```
backend/
├── main.go              # エントリーポイント
├── config/
│   └── config.go        # 設定管理
├── handlers/
│   ├── websocket.go     # WebSocketハンドラー
│   └── room.go          # ルームAPI
├── models/
│   ├── game.go          # ゲーム状態モデル
│   ├── room.go          # ルームモデル
│   └── player.go        # プレイヤーモデル
├── services/
│   ├── redis.go         # Redis操作
│   ├── game.go          # ゲームロジック
│   └── room.go          # ルーム管理
├── go.mod
└── go.sum
```

## 関連ドキュメント

- [API設計](./api.md)
- [WebSocket設計](./websocket.md)
- [データモデル設計](./models.md)

## 設計方針

### 並行処理

- goroutineによる各WebSocket接続の独立処理
- channelによるメッセージパッシング
- sync.RWMutexによる共有リソースの保護

### エラーハンドリング

- すべてのエラーを明示的にハンドリング
- クライアントへのエラーメッセージ送信
- サーバーログへのエラー記録

### テスト

- `_test.go` ファイルでユニットテスト
- テーブル駆動テストを推奨
- モックを使用したRedis操作のテスト
