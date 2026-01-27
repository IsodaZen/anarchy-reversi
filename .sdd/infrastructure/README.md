# インフラストラクチャ設計

## 概要

Railway上でのコンテナベースデプロイ。
月額$5以内の予算制約に合わせた構成。

## 構成図

```
                    ┌─────────────────────────────┐
                    │          Railway            │
                    │                             │
  Internet ────────>│  ┌─────────────────────┐   │
                    │  │   Go Backend        │   │
                    │  │   (Dockerfile)      │   │
                    │  │   - API Server      │   │
                    │  │   - WebSocket       │   │
                    │  └──────────┬──────────┘   │
                    │             │              │
                    │  ┌──────────▼──────────┐   │
                    │  │   Redis             │   │
                    │  │   (Railway Plugin)  │   │
                    │  └─────────────────────┘   │
                    │                             │
                    └─────────────────────────────┘

  Static Files ─────> Vercel / Netlify / Railway
  (Frontend)          (静的ホスティング)
```

## 関連ドキュメント

- [デプロイ設計](./deployment.md)
- [データベース（Redis）設計](./database.md)

## 予算管理

### 月額コスト内訳（目安）

| サービス | コスト |
|---------|--------|
| Railway Backend | $2-3 |
| Railway Redis | $1-2 |
| Frontend (Vercel) | $0 |
| **合計** | **$3-5** |

### コスト最適化

- 非アクティブ時の自動スリープ（Railway）
- Redis TTLによる自動データ削除
- 小さなコンテナイメージ（Alpine Linux）
