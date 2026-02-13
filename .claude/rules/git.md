# Gitコミットルール

## フォーマット

`<type>(<scope>): <description>`

- **単一行**: コミットメッセージは1行で完結させる
- **日本語**: 説明は日本語で明確に記述
- **自動生成フッター禁止**: Claude Codeの自動生成フッター（Co-Authored-By等）を追加しない

## Type

| type | 用途 |
|------|------|
| feat | 新機能の追加 |
| fix | バグ修正 |
| docs | ドキュメントのみの変更 |
| style | コードの意味に影響しない変更（空白、フォーマット等） |
| refactor | リファクタリング |
| test | テストの追加・修正 |
| chore | ビルドプロセスや補助ツールの変更 |

## Scope（省略可能）

- `frontend` — フロントエンド関連
- `backend` — バックエンド関連
- `infra` — インフラ・デプロイ関連
- `docs` — ドキュメント

## 例

```
feat(frontend): ゲームボードコンポーネントを実装
fix(frontend): スコア計算の不具合を修正
docs: CLAUDE.mdを更新
refactor(frontend): gameSliceの構造を改善
chore(infra): GitHub Actionsデプロイ設定を追加
```

## コミット実行

- 関連する変更は1つのコミットにまとめる
- ステージングとコミットを1つのメッセージで実行
