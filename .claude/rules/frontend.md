# フロントエンド開発ルール

## TypeScript
- `verbatimModuleSyntax` が有効：型のみのインポートは `import type { ... }` を使用
- `createSlice`と同ファイルの型は `import { createSlice, type PayloadAction }` のように混合インポート
- マジックナンバー（ボードサイズ等）は名前付き定数として `export const BOARD_SIZE = 8` のように定義

## React コンポーネント
- コンポーネントは名前付きエクスポート（`export function Board`）、ページのみdefault export
- 計算コストのある派生値は `useMemo` でメモ化（例: `getValidMoves` の結果）
- ブラウザAPI（`navigator.clipboard`, `crypto.randomUUID`）は try/catch でエラーハンドリング

## アクセシビリティ
- インタラクティブ要素に `role="button"`, `tabIndex={0}`, `aria-label` を設定
- キーボード操作: Enter/Spaceキーでクリック相当の操作を可能にする
- 非インタラクティブ要素は `tabIndex={-1}`, `role` なし
- タッチターゲットは最低 44x44px（`min-w-[44px] min-h-[44px]`）
- フォーカス可視化: `focus:outline-2 focus:outline-yellow-400`

## テスト
- テストファイルはソースと同一ディレクトリに配置（`Component.test.tsx`）
- コンポーネントテストは全てのrequiredプロパティを渡す（型エラー防止）
- アクセシビリティテスト: ARIA属性、キーボード操作、role属性を必ずテスト
- ゲームロジックのテスト: 盤面状態を手動構築する際は合法手の有無を事前に検証
