# Architecture Patterns

実装を通じて確立されたアーキテクチャパターンと設計上の注意点。

## Redux 状態設計: アニメーション状態 vs ロジック状態の分離

同じデータに対してアニメーション表示とロジック判定の両方が必要な場合、別フィールドに分離する。

```
flippingCells: Position[]  → アニメーション表示用（完了コールバックでクリア）
flippedCells: Position[]   → ロジック判定用（ターン終了までクリアされない）
```

**背景**: `flippingCells` をアニメーションとアンフリップ判定の両方に使用した結果、アニメーション完了後に `clearFlipping` でクリアされ、アンフリップ対象を特定できなくなった。

**原則**: アニメーションコールバックでクリアされる状態を、ビジネスロジックの判定に使ってはならない。

## コンポーネント間の prop 伝搬チェーン

新しいクリック対象やインタラクションを追加する場合、gameSlice のロジック変更だけでは不十分。UIの操作可否は以下のチェーンで決定される:

```
GameRoom (クリックハンドラ)
  → Board (isFlippable 計算)
    → Cell (isClickable = isValidMove || isFlippable)
```

- `Cell` の `isClickable` が `false` の場合、`onClick` が発火しない
- `Board` の `isFlippable` 計算ロジックが新しいクリック対象を含まないと、クリックイベントが親に到達しない
- **チェックリスト**: 新しいセル操作を追加する際は (1) gameSlice のリデューサー、(2) Board の判定ロジック、(3) GameRoom のクリックハンドラ の3箇所を確認すること

---
_Document patterns learned from implementation, not theoretical best practices_
