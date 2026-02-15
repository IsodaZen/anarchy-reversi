# Research & Design Decisions

---
**Purpose**: ゲーム結果表示機能のディスカバリーフェーズで収集した調査結果・設計判断の記録。
---

## Summary
- **Feature**: `game-result-display`
- **Discovery Scope**: Extension（既存システムへの機能拡張）
- **Key Findings**:
  - `endTurn`リデューサーにゲーム終了時の分岐が既に存在するが、状態フラグが未設定
  - `canvas-confetti`（v1.9.4）はゼロ依存・軽量で、`disableForReducedMotion`オプションによるアクセシビリティ対応も備える
  - 既存の「遊び方」モーダルパターンを結果画面に再利用可能

## Research Log

### ゲーム終了検出の現状分析
- **Context**: 両プレイヤーに合法手がない場合、ゲームが無言で停止する問題
- **Sources Consulted**: `frontend/src/store/gameSlice.ts:67-82`、`frontend/src/utils/gameLogic.ts`
- **Findings**:
  - `endTurn`リデューサー内で`hasValidMoves`を両プレイヤーに対して呼び出している
  - 両者ともfalseの場合、コメント `// 両者とも合法手がない場合はそのまま停止` で処理がない
  - `GameState`に`isGameOver`や`winner`フィールドが存在しない
  - `calculateScore`は既にスコアを返しており、勝者判定のロジック基盤は整っている
- **Implications**: `endTurn`内で終了判定を追加し、`GameState`に新フィールドを追加するのが最小変更

### Redux状態設計: 終了フラグのアプローチ
- **Context**: ゲーム終了状態をどう管理するか
- **Sources Consulted**: `.kiro/steering/patterns.md`（アニメーション状態 vs ロジック状態の分離パターン）
- **Findings**:
  - 方法A: Redux stateに`isGameOver: boolean` + `winner: PlayerColor | 'draw' | null`を追加 → endTurn内で設定
  - 方法B: `useMemo`で毎回`hasValidMoves`を計算して派生 → `phase === 'placement'`時にのみ計算必要
  - 方法Aは状態の一貫性が高く、操作ガードも容易
  - 方法Bはendのタイミングが曖昧になる可能性がある（配置フェーズ中に合法手がなくても裏返しフェーズでは操作可能なため）
- **Implications**: 方法Aを採用。`endTurn`リデューサー内で確定的に`isGameOver`と`winner`を設定する

### クラッカー🎉アニメーションライブラリ調査
- **Context**: 勝者を称えるクラッカーパーティクルアニメーションの実装方法
- **Sources Consulted**: npm検索、GitHub、Bundlephobia
- **Findings**:
  - `canvas-confetti` v1.9.4: ゼロ依存、ISCライセンス、92.4kB（unpacked）、高パフォーマンス
  - `react-canvas-confetti`: canvas-confettiのReactラッパー。Conductor APIでプリセットアニメーションの開始/停止制御が可能
  - `react-confetti`: 別ライブラリ、`react-use`依存
  - `canvas-confetti`にはアクセシビリティ用の`disableForReducedMotion`オプションがある
  - TypeScript型定義は`@types/canvas-confetti`で提供
- **Implications**: `canvas-confetti`を直接使用（Reactラッパー不要、シンプルなAPI呼び出しのみ）

### 既存モーダルパターンの分析
- **Context**: 結果画面のUI実装パターン
- **Sources Consulted**: `frontend/src/pages/GameRoom.tsx`の「遊び方」ダイアログ
- **Findings**:
  - 背景: `fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4`
  - パネル: `bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full`
  - ARIA: `role="dialog" aria-modal="true" aria-label="..."`
  - 背景クリックで閉じる、`e.stopPropagation()`で内部クリック伝搬防止
  - Escapeキーでの閉じ操作は`useEffect`で実装
- **Implications**: 同じパターンを結果画面に適用。コンポーネントとして抽出し再利用性を高める

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Redux state拡張 | `isGameOver`と`winner`をgameSliceに追加 | 状態の一貫性、操作ガードが容易 | stateサイズ微増 | 採用 |
| 派生状態（useMemo） | コンポーネント内でhasValidMovesを毎回計算 | state変更不要 | 計算コスト、フェーズ遷移時の曖昧さ | 不採用 |
| canvas-confetti直接使用 | Reactラッパーなしでcanvas-confetti APIを呼び出し | 軽量、シンプル | React外のDOM操作 | 採用 |
| react-canvas-confetti使用 | Reactラッパーコンポーネント | React統合が容易 | 追加依存、プリセットの制約 | 不採用 |

## Design Decisions

### Decision: Redux stateにゲーム終了フラグを追加
- **Context**: ゲーム終了の検出と操作ロックが必要
- **Alternatives Considered**:
  1. Redux stateに`isGameOver` + `winner`を追加
  2. `useMemo`で派生計算
- **Selected Approach**: Redux stateに追加し、`endTurn`リデューサー内で設定
- **Rationale**: 状態の一貫性、操作ガード（`placePiece`/`flipPiece`の早期リターン）が確実
- **Trade-offs**: stateフィールド追加、`resetGame`での初期化も必要
- **Follow-up**: `GameState`型定義の更新、全reducer内でのガード追加

### Decision: canvas-confettiを直接使用
- **Context**: クラッカーアニメーション要件（2.5）
- **Alternatives Considered**:
  1. `canvas-confetti` — ゼロ依存、直接API呼び出し
  2. `react-canvas-confetti` — React統合ラッパー
  3. CSS/SVGアニメーション自作
- **Selected Approach**: `canvas-confetti`を直接使用し、`useEffect`内で発火
- **Rationale**: ゼロ依存で軽量、API呼び出し1回で完結、`disableForReducedMotion`でアクセシビリティ対応
- **Trade-offs**: React外のCanvas DOM操作だが、一回きりのエフェクトなので問題なし
- **Follow-up**: `@types/canvas-confetti`の型定義も一緒にインストール

### Decision: GameResultDialogコンポーネントの新規作成
- **Context**: 結果画面のUI表示（要件2, 3, 5）
- **Alternatives Considered**:
  1. 新規コンポーネント`GameResultDialog`として分離
  2. GameRoom.tsx内にインライン実装
- **Selected Approach**: `components/GameResultDialog/GameResultDialog.tsx`として分離
- **Rationale**: テスト容易性、再利用性、関心の分離
- **Trade-offs**: ファイル増加
- **Follow-up**: 既存モーダルパターンを踏襲したARIA対応

## Risks & Mitigations
- `canvas-confetti`のCanvas生成がSSR環境で問題を起こす可能性 — 現在CSPAのみなので影響なし
- `prefers-reduced-motion`未対応のブラウザでアニメーションが表示される — `disableForReducedMotion`で対応、非対応ブラウザは許容
- 結果モーダルとconfettiアニメーションのz-indexの衝突 — confettiのcanvasはz-indexを明示的に指定

## References
- [canvas-confetti GitHub](https://github.com/catdad/canvas-confetti) — パフォーマント、ゼロ依存のconfettiライブラリ
- [react-canvas-confetti](https://github.com/ulitcos/react-canvas-confetti) — React向けラッパー（今回は不採用）
- [@types/canvas-confetti](https://www.npmjs.com/package/@types/canvas-confetti) — TypeScript型定義
