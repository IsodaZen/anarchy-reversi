# アナーキーオセロ

子供向けのルールに縛られない自由なリバーシゲーム。
2フェーズターン制（配置フェーズ: 通常リバーシルール → 裏返しフェーズ: 相手の石を自由に裏返し）が核心コンセプト。
現在はフロントエンド（React + TypeScript）のみ実装済み。バックエンド（リアルタイム対戦）は将来フェーズのため、本ドキュメントでは扱わない。

## ドキュメント

### 仕様・設計（cc-sdd: `.kiro/`）

要求仕様や設計ドキュメントは `.kiro/` 配下に配置する。

- `.kiro/steering/product.md` — プロダクト概要、コアコンセプト、ユースケース
- `.kiro/steering/tech.md` — 技術スタック、キーライブラリ、開発コマンド
- `.kiro/steering/structure.md` — ディレクトリ構成、命名規則、インポート順序
- `.kiro/steering/patterns.md` — 実装で確立されたアーキテクチャパターン、設計上の注意点
- `.kiro/specs/anarchy-reversi-core/requirements.md` — 機能要件
- `.kiro/specs/anarchy-reversi-core/design.md` — 詳細設計
- `.kiro/specs/anarchy-reversi-core/tasks.md` — 実装タスク

### 開発ルール（`.claude/rules/`）

- `.claude/rules/frontend.md` — TypeScript/React規約、アクセシビリティ、テストパターン
- `.claude/rules/git.md` — Gitコミットルール（Conventional Commits）

## 開発環境

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run test         # テスト実行
npm run build        # ビルド
npx tsc --noEmit --project tsconfig.app.json  # 型チェック
```

**デプロイ**: GitHub Pagesへ自動デプロイ（`.github/workflows/deploy.yml`）。mainブランチへのpushで実行される。

## 現状

- フロントエンド実装済み（ゲームボード、2フェーズターン制、スコア表示、リセット機能、ローカルプレイ）
- バックエンド（WebSocketによるリアルタイム対戦）は未実装・将来フェーズ
- 実装済みタスクの詳細は `.kiro/specs/anarchy-reversi-core/tasks.md` を参照
