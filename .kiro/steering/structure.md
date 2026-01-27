# Project Structure

## Organization Philosophy

**Feature-light + Layer分離**:
- ページ数が少ないため、厳密なfeature分割は行わない
- 関心の分離を意識した層構造（pages, store, types）

## Directory Patterns

### Pages (`frontend/src/pages/`)
**Purpose**: ルートに対応するページコンポーネント
**Example**: `Home.tsx`, `GameRoom.tsx`

### Store (`frontend/src/store/`)
**Purpose**: Redux Toolkitによるグローバル状態管理
**Example**: `gameSlice.ts`, `hooks.ts`, `index.ts`

### Types (`frontend/src/types/`)
**Purpose**: 共有型定義
**Example**: `game.ts`, `websocket.ts`

### Components (`frontend/src/components/`) ※計画
**Purpose**: 再利用可能なUIコンポーネント
**Pattern**: 機能名/`ComponentName.tsx` + `ComponentName.module.css`

### Hooks (`frontend/src/hooks/`) ※計画
**Purpose**: カスタムフック
**Pattern**: `use{Feature}.ts`

## Naming Conventions

- **Files (Components)**: PascalCase (`GameRoom.tsx`)
- **Files (Utilities)**: camelCase (`gameSlice.ts`)
- **Components**: PascalCase (`GameRoom`)
- **Functions/Hooks**: camelCase (`useAppDispatch`)
- **Types/Interfaces**: PascalCase (`GameState`, `Board`)
- **Constants**: UPPER_SNAKE_CASE

## Import Organization

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 2. Internal modules (store, hooks)
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setRoom } from '../store/gameSlice';

// 3. Types
import type { GameState } from '../types/game';
```

**Path Aliases**: 現在未設定（相対パス使用）

## Code Organization Principles

- **1ファイル1エクスポート**: ページ・コンポーネントは1つのdefault export
- **Sliceパターン**: Redux Toolkitの`createSlice`でアクション+リデューサーを集約
- **Typed Hooks**: `useAppSelector`/`useAppDispatch`で型安全なRedux操作
- **コロケーション**: 関連ファイルは同じディレクトリに配置

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
