# Research & Design Decisions

---
**Purpose**: タイトルページ設計の調査記録・アーキテクチャ判断ログ

---

## Summary
- **Feature**: `title-page`
- **Discovery Scope**: Extension（既存 Home.tsx の改修）
- **Key Findings**:
  - 既存 `Home.tsx` はルーム作成・ルーム参加の2UIを持つ。ルーム参加UI（`<form>`, `<input>`, 参加ボタン）と区切り線を削除し、「ゲームを始める」ボタン1つに集約する
  - ルーティングは `/room/local` への `useNavigate` で完結。新しいルートを `App.tsx` に追加する必要がある（`/room/local` → `GameRoom`）
  - アクセシビリティ要件（`role="button"`, `tabIndex={0}`, `aria-label`, 44px タッチターゲット, フォーカスインジケーター）は既存 `frontend.md` ルールに準拠済み

## Research Log

### 既存 Home.tsx の構造分析
- **Context**: 削除・変更範囲を確定するため
- **Findings**:
  - 保持要素: タイトル `h1`、キャッチコピー `p`、グラデーション背景、ダークモード対応、フッター
  - 削除要素: `useState(roomId)`, `handleCreateRoom`, `handleJoinRoom`, ルーム作成ブロック、区切り線、ルーム参加フォーム
  - 追加要素: 「ゲームを始める」ボタン（`/room/local` へ遷移）、アナーキーモード説明ブロック
- **Implications**: `useState` 不要になり、コンポーネントはほぼ純粋なプレゼンテーション層になる

### ルーティング対応
- **Context**: `/room/local` は既存ルート `/room/:roomId` で `:roomId = "local"` として到達可能か確認
- **Findings**:
  - `App.tsx` の `<Route path="/room/:roomId" element={<GameRoom />} />` で `roomId === "local"` として到達できる
  - `GameRoom.tsx` は `roomId` が存在する場合 `dispatch(setRoom({ roomId, playerId }))` を実行する。`"local"` は有効な文字列のため既存ロジックへの副作用は最小限
  - 新規ルートの追加は不要
- **Implications**: ナビゲーション実装は `navigate('/room/local')` のみで完結

### アクセシビリティパターン確認
- **Context**: frontend.md ルールとの整合性確認
- **Findings**:
  - `<button>` 要素は `role="button"` が暗黙的に付与されるが、`tabIndex={0}` と `aria-label` は明示的に設定する
  - `min-w-[44px] min-h-[44px]` で44px タッチターゲット保証
  - `focus:outline-2 focus:outline-yellow-400` でフォーカスインジケーター

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Home.tsx 直接改修 | 既存ページを置き換え | シンプル、ファイル増加なし | 変更箇所が明確 | 採用 |
| 新規ページ作成 | `TitlePage.tsx` 新規追加 | 既存コードに影響なし | 旧 Home.tsx が残り混乱の元 | 不採用 |

## Design Decisions

### Decision: 既存 Home.tsx を直接改修
- **Context**: タイトルページはルートパス `/` に対応する唯一のランディングページ
- **Selected Approach**: `Home.tsx` を直接改修してルーム参加UIを削除し、「ゲームを始める」ボタンを追加
- **Rationale**: ファイル数を増やさず、既存ルーティング設定を維持できる。ページ数が少ない本プロジェクトの構造方針に合致
- **Trade-offs**: 旧コードとの diff が大きくなるが、テストカバレッジで補完可能

### Decision: `/room/local` ルートを再利用
- **Context**: ローカルプレイ専用ルートを追加するか、既存 `/room/:roomId` を使うか
- **Selected Approach**: 既存 `/room/:roomId` を `roomId="local"` で再利用
- **Rationale**: App.tsx のルーティング変更不要。GameRoom は roomId の内容に依存しないローカルプレイモードで動作する
- **Trade-offs**: 将来的にローカル専用ロジックが増えた場合は分離が必要になる可能性あり

## Risks & Mitigations
- `roomId="local"` が GameRoom の WebSocket 接続ロジック（将来実装）と衝突する可能性 — WebSocket 実装時に `roomId === "local"` を特別扱いする条件分岐で対応可能
- `useState` 削除による既存テストの破損 — Home.test.tsx が存在する場合は合わせて更新が必要

## References
- `frontend/src/pages/Home.tsx` — 改修対象の既存実装
- `frontend/src/App.tsx` — ルーティング設定
- `.claude/rules/frontend.md` — アクセシビリティ・コンポーネントルール
