# Research & Design Decisions

---
**Purpose**: コア機能の技術設計に向けた調査結果と設計判断の記録。
---

## Summary
- **Feature**: anarchy-reversi-core
- **Discovery Scope**: New Feature（既存フロントエンド基盤の上に構築）
- **Key Findings**:
  - 既存フロントエンド基盤（Redux Toolkit store、GameRoomページレイアウト、型定義）が確立済み。新コンポーネントは既存構造に統合する形で設計する
  - 要件の二段階ターンシステム（配置→裏返し）は既存の`toggleCell`リデューサーとは異なるフローであり、`placePiece`/`flipPiece`の新アクションで置き換えが必要
  - 配置の合法手判定には標準リバーシの8方向挟み判定アルゴリズムが必要だが、計算量は8x8盤面で定数時間のため、メモ化で十分対応可能

## Research Log

### 既存コードベースの分析
- **Context**: 新コンポーネントの統合先と既存パターンの確認
- **Sources Consulted**: `frontend/src/` 全ファイルの解析
- **Findings**:
  - Redux Toolkit store（`gameSlice.ts`）が設定済み。`toggleCell`リデューサーは黒→白→null→黒のサイクルだが、要件の二段階ターンシステムとは動作が異なる
  - `GameState`型に`currentTurn`と`phase`フィールドが未定義。拡張が必要
  - `createInitialBoard()`は全マスnullで初期化しているが、要件1.3では中央4マスへの初期配置が必要
  - `GameRoom.tsx`にボードコンポーネントのTODOプレースホルダーが存在。サイドバーにスコア表示・リセットボタン・遊び方説明が配置済み
  - `components/`ディレクトリは未作成
  - TypeScript strict mode有効、`any`使用禁止
- **Implications**: 既存のstoreとページ構造を拡張する形で設計。`toggleCell`は新アクションに置き換え、`GameState`型を拡張

### リバーシの合法手判定アルゴリズム
- **Context**: 要件2.3「自分の石で相手の石を挟める空きセルのみを配置可能な位置として判定する」
- **Sources Consulted**: 標準リバーシ/オセロのゲームロジック仕様
- **Findings**:
  - 8方向（N, NE, E, SE, S, SW, W, NW）を走査して挟み判定を行う
  - 各方向: 隣接セルが相手色 → さらに進んで自分の色が見つかれば「挟める」
  - 計算量: 64セル × 8方向 × 最大7セル = O(1)（定数時間）
  - このアルゴリズムは配置位置の判定にのみ使用。裏返しは手動のため自動裏返しロジックは不要
- **Implications**: 純粋関数として`gameLogic`ユーティリティに実装。Redux storeのアクション内から呼び出す

### React 19 + Redux Toolkit のゲームUI設計パターン
- **Context**: コンポーネント設計と状態管理のベストプラクティス確認
- **Sources Consulted**: React 19ドキュメント、Redux Toolkit公式ガイド
- **Findings**:
  - React 19のServer Components/Actionsは本機能（クライアントサイドゲーム）に不適用
  - Redux ToolkitのcreateSliceパターンは既存コードで確立済み
  - 派生データ（合法手リスト等）は`useMemo`でメモ化が推奨
  - Presentational/Containerパターン: Board, Cell, PieceはPresentational、GameRoomがContainer
- **Implications**: 既存パターンを踏襲し、新しいsliceアクションを追加

### Tailwind CSS v4 によるゲームボードレイアウト
- **Context**: レスポンシブな8x8グリッドの実現方法
- **Sources Consulted**: Tailwind CSS v4ドキュメント
- **Findings**:
  - CSS Grid: `grid-cols-8`で8列グリッドが実現可能
  - 正方形セル: `aspect-square`ユーティリティで維持
  - レスポンシブ: `w-full max-w-[...]`でコンテナ幅制限
  - タッチターゲット: 最低44x44px確保（WCAG推奨）
  - 既存GameRoomで`aspect-square max-w-2xl`のコンテナが使用済み
- **Implications**: Tailwindユーティリティクラスのみでレスポンシブボードを実装可能。カスタムCSSは不要

### 二段階ターンシステムの設計検討
- **Context**: 要件2.5-2.9で定義される「配置→裏返し→手番終了」のフロー
- **Sources Consulted**: 要件定義書、ゲーム状態遷移の設計パターン
- **Findings**:
  - 配置フェーズ: 標準リバーシルールで合法手判定 → 石を1つ配置
  - 裏返しフェーズ: 相手の石を自由にクリックで裏返し（回数・対象制限なし）
  - 手番終了: 明示的なボタン操作で次の手番へ
  - 自動パス: 配置可能な位置がない場合は自動的に相手に手番を渡す
  - エッジケース: 両プレイヤーとも合法手がない場合のループ防止が必要
- **Implications**: `GameState`に`phase`フィールドを追加。`endTurn`アクションで自動パス判定を実装（2回連続パスの場合はループせず状態を維持）

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Component + Redux（採用） | Presentationalコンポーネント + Redux Toolkit state管理 | 既存パターンと一致、予測可能な状態遷移、DevTools対応 | ローカルMVPにはやや過剰 | tech.mdのRedux Toolkit採用方針と一致 |
| Component + useReducer | ローカルuseReducerでGameRoom内完結 | 軽量、外部依存なし | WebSocket同期時にグローバル状態への移行が必要 | CLAUDE.mdにuseReducerの記載もあるが、既にRedux導入済み |
| Zustand | 軽量状態管理ライブラリ | シンプルなAPI | 既に@reduxjs/toolkitが依存に含まれている | 不採用：既存依存と矛盾 |

## Design Decisions

### Decision: 二段階ターンシステムの状態遷移設計
- **Context**: 要件2.5-2.9で定義される配置フェーズと裏返しフェーズの管理
- **Alternatives Considered**:
  1. Redux stateに`phase`フィールドを追加し、gameSliceで状態遷移を管理
  2. コンポーネントローカルのuseReducerで管理
- **Selected Approach**: Redux stateに`phase`フィールドを追加
- **Rationale**: 将来のWebSocket同期時にグローバル状態として扱う必要がある。既存のRedux構成を活用
- **Trade-offs**: ローカルMVPではReduxの利点が限定的だが、オンライン対戦への拡張がスムーズ
- **Follow-up**: WebSocket統合時にstate同期の詳細設計を確認

### Decision: 合法手の計算方式
- **Context**: 配置可能な位置を計算し表示する（要件2.3, 2.4）
- **Alternatives Considered**:
  1. Redux stateに`validMoves`を保持し、盤面変更時に再計算
  2. コンポーネント内で`useMemo`を使ってメモ化計算
- **Selected Approach**: `gameLogic`ユーティリティの純粋関数として実装し、コンポーネントで`useMemo`を使ってメモ化
- **Rationale**: 8x8盤面の計算コストは極めて低い（定数時間）。stateに保持する必要がなく、派生データとして計算する方がシンプル
- **Trade-offs**: 再レンダリング時に再計算されるが、計算量が微小なため問題なし
- **Follow-up**: パフォーマンス問題が発生した場合にのみRedux stateへの移行を検討

### Decision: 既存toggleCellの扱い
- **Context**: 既存の`toggleCell`リデューサーは黒→白→null→黒のサイクルで、新要件の二段階システムとは異なる
- **Alternatives Considered**:
  1. `toggleCell`を残して新アクションを追加
  2. `toggleCell`を削除して新アクションで置き換え
- **Selected Approach**: `toggleCell`を削除し、`placePiece`と`flipPiece`の2つの新アクションで置き換え
- **Rationale**: `toggleCell`の動作は要件のどのフローにも一致しない。残すと混乱の原因になる
- **Trade-offs**: 既存コードの変更が必要だが、現在`toggleCell`を使用している箇所はない（GameRoomにTODOプレースホルダーのみ）
- **Follow-up**: なし

### Decision: 自動パスのループ防止
- **Context**: 要件2.10「合法手がない場合は自動パス」で、両プレイヤーとも合法手がない場合の無限ループを防止する必要がある
- **Alternatives Considered**:
  1. `endTurn`内で再帰的にパスを繰り返す
  2. `endTurn`内で1回のみパス判定し、両方合法手なしの場合は現状維持
- **Selected Approach**: `endTurn`内で次の手番の合法手を確認。なければ元の手番に戻すが、元の手番にも合法手がない場合は手番を切り替えたまま維持（実質ゲーム終了状態）
- **Rationale**: 要件にゲーム終了判定は含まれていないため、シンプルにループ防止のみ実装。ユーザーはリセットで対応
- **Trade-offs**: ゲーム終了の明示的な通知がないが、要件範囲外
- **Follow-up**: 将来的にゲーム終了判定を追加する場合、`phase`に`'finished'`状態を追加可能

## Risks & Mitigations
- **既存GameRoomページとの統合**: 既存のTODOプレースホルダーと遊び方説明の内容が新フローと整合しない → ミティゲーション: 既存レイアウト構造を維持しつつ、コンテンツを新仕様に合わせて更新
- **合法手がない場合の連続パス**: 両プレイヤーとも合法手がない場合にUIが不明瞭になる可能性 → ミティゲーション: endTurnで1回のみパス判定するループガードを実装
- **モバイルでのタッチ操作性**: 8x8グリッドのセルが小さくなりすぎる可能性 → ミティゲーション: 最小タッチターゲット44x44pxを確保し、ボード全体の最大幅を制限
- **既存の型定義との整合性**: `GameState`型の拡張が既存コードに影響する可能性 → ミティゲーション: 既存フィールドを保持しつつ新フィールドを追加。破壊的変更なし

## References
- [React 19 Documentation](https://react.dev/) — コンポーネント設計パターン
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/) — createSlice、Immerによる不変更新
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/) — グリッドレイアウト、レスポンシブ設計
- [Reversi/Othello Rules](https://en.wikipedia.org/wiki/Reversi) — 合法手判定ロジック
