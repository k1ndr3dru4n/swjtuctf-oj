# 深入研究：CTFOJDemo 首页为何能正常显示

## 结论摘要

CTFOJDemo 的 `http://localhost:5173/` 能正常显示，是因为 **Tailwind v4 的 JIT 会按源码里出现的类名自动生成对应 CSS**，不需要在 `@theme` 里自定义 `grid-cols-20` 或 `max-w-384`。  
swjtuctf-oj 布局异常，是因为在 swjtuctf-oj 里这些类要么没被正确扫描到，要么被错误的自定义 theme 覆盖/干扰。

---

## 1. CTFOJDemo 的配置（无自定义 grid/container）

- **无** `tailwind.config.js`，仅用 `@tailwindcss/vite`。
- **style.css**：只有圆角、颜色等，**没有** `--grid-cols-20`、`--container-384`、`--grid-template-columns-*`。
- **HomeView.vue**：直接使用 `grid-cols-20`、`max-w-384`（与 swjtuctf-oj 的 class 一致）。

也就是说：CTFOJDemo 完全依赖 Tailwind 默认 + 源码里出现的类名来生成样式。

---

## 2. 构建产物里实际生成了什么（CTFOJDemo build）

对 **CTFOJDemo** 执行 `pnpm run build` 后，在 `dist/assets/index-Zudwdq-X.css` 中可以看到：

### 2.1 `grid-cols-20`

```css
.grid-cols-20{grid-template-columns:repeat(20,minmax(0,1fr))}
```

- 说明：Tailwind v4 在扫描源码时发现类名 `grid-cols-20`，就按**数字 20** 生成了 `grid-template-columns: repeat(20, minmax(0, 1fr))`。
- 不需要在 `@theme` 里写 `--grid-cols-*` 或 `--grid-template-columns-*`，属于**按类名自动生成**的规则。

### 2.2 `max-w-384`

```css
.max-w-384{max-width:calc(var(--spacing) * 384)}
```

- 说明：`max-w-384` 被当作 **spacing 比例** 生成，即 `calc(var(--spacing) * 384)`。
- 默认 `--spacing: 0.25rem`，所以实际是 **384 × 0.25rem = 96rem**（约 1536px），不是 384px。
- 同样没有在 CTFOJDemo 的 style.css 里写 `--container-384`，完全由 Tailwind 默认规则生成。

### 2.3 `col-span-*` 等

- `col-span-9`、`col-span-6`、`col-span-5`、`col-span-15` 等也都在同一 CSS 里正常生成，与默认 theme 一致。

---

## 3. 为何 CTFOJDemo 能正常显示

1. **Vite 构建时**，`@tailwindcss/vite` 会扫描入口与依赖（包括 Vue 组件）中的 class。
2. 扫描到 `grid-cols-20` 后，Tailwind 按**数字 20** 生成 `repeat(20, minmax(0, 1fr))`，无需 theme 配置。
3. 扫描到 `max-w-384` 后，按 **spacing 比例** 生成 `calc(var(--spacing) * 384)`。
4. 因此 CTFOJDemo 的首页网格和最大宽度都能生效，布局正常。

---

## 4. swjtuctf-oj 为何会异常（与 CTFOJDemo 的差异）

可能原因包括：

1. **扫描范围/内容不一致**  
   - 若 swjtuctf-oj 的 content 或 Vite 入口不同，可能没有扫描到使用 `grid-cols-20` / `max-w-384` 的组件，导致这两个类根本没被生成。
2. **自定义 @theme 干扰**  
   - 在 swjtuctf-oj 的 style.css 里曾写过 `--grid-cols-20`。Tailwind v4 里 grid 的命名空间是 `--grid-template-columns-*`，不是 `--grid-cols-*`，错误命名可能影响或覆盖默认行为，导致最终没有正确的 `grid-cols-20` 规则。
3. **Tailwind / Vite 版本或插件顺序**  
   - 若版本或插件顺序与 CTFOJDemo 不同，也可能导致同一类名在不同项目里一个被生成、一个没有。

---

## 5. 为什么 Tailwind 没扫到使用这些类的文件？

Tailwind v4 的扫描规则（[Content configuration](https://tailwindcss.com/docs/content-configuration)）：

- **默认**：以「当前工作目录」（cwd）为起点，扫描项目里除 `node_modules`、`.gitignore`、锁文件、CSS、二进制以外的文件。
- **与 Vite 结合**：`@tailwindcss/vite` 在 Vite 构建/开发时运行，扫描范围可能受以下影响：

### 可能原因

1. **扫描起点（cwd）不对**  
   若在**仓库根目录**（例如 `D:\Github\swjtuctf-oj`）执行 `pnpm dev` 或 `pnpm run build`，而 Vite 配置在 `frontend/` 下，Tailwind 的默认 cwd 可能是仓库根。仓库根下没有 `.vue` 文件（都在 `frontend/src/`），所以**不会扫到** `HomeView.vue` 等组件，`grid-cols-20`、`col-span-*` 等类就不会被生成。

2. **只扫了「首屏依赖」**  
   部分实现下，插件可能只对 Vite 已解析的模块做扫描。`HomeView.vue` 是通过路由**懒加载**的（`() => import('@/views/user/home/HomeView.vue')`），若在生成 CSS 时还没解析到该 chunk，就可能漏扫，导致这些类没进最终 CSS。

3. **多包/多根工作区**  
   若 Cursor 同时打开 CTFOJDemo 与 swjtuctf-oj，或从 monorepo 根跑脚本，Tailwind 的「项目」边界可能不是 `frontend/`，从而漏扫 `frontend/src`。

### 解决办法

在 **style.css** 里显式指定扫描目录（路径相对该 CSS 文件）：

```css
@import 'tailwindcss';

@source "./src";

@theme {
  /* ... */
}
```

这样无论 cwd 或懒加载顺序如何，都会扫描 `frontend/src` 下所有文件（含 `HomeView.vue`），`grid-cols-20`、`col-span-*`、`max-w-384` 等类会被正常生成。建议同时保证在 **frontend 目录下**执行 `pnpm dev` / `pnpm run build`（例如 `cd frontend && pnpm dev`）。

---

## 5. 建议做法（与 CTFOJDemo 行为对齐）

1. **不依赖 theme 的 grid 列数**  
   - 在 HomeView 里用**内联样式**写死 20 列（与当前 swjtuctf-oj 已做的一致）：  
     `style="grid-template-columns: repeat(20, minmax(0, 1fr))"`  
   - 这样不依赖 Tailwind 是否生成 `grid-cols-20`，和 CTFOJDemo 的视觉效果一致。

2. **theme 里不要写错误的 grid 命名空间**  
   - 若保留 theme，应使用 Tailwind v4 文档中的 **`--grid-template-columns-20`**，而不是 `--grid-cols-20`；  
   - 或者不再为 grid 写自定义 theme，让 Tailwind 像 CTFOJDemo 一样按类名自动生成。

3. **max-w-384 的语义**  
   - 在 CTFOJDemo 里，`max-w-384` 实际是 **96rem**（spacing 倍数），不是 384px。  
   - 若设计期望是 384px（24rem），应在 swjtuctf-oj 用 `max-w-[24rem]` 或在 theme 里定义 `--container-384: 24rem` 并在布局里使用对应类名。

---

## 6. 总结表

| 项目 | grid-cols-20 来源 | max-w-384 来源 |
|------|-------------------|----------------|
| CTFOJDemo | 扫描到类名后自动生成 `repeat(20, minmax(0,1fr))` | 自动生成 `calc(var(--spacing)*384)` = 96rem |
| swjtuctf-oj（期望） | 建议用内联样式或正确 theme，避免错误 theme 覆盖 | 若需 24rem 可自定义 theme 或 `max-w-[24rem]` |

CTFOJDemo 能正常显示的根本原因：**Tailwind v4 会为源码中出现的 `grid-cols-20` 和 `max-w-384` 自动生成对应 CSS，无需在 style.css 的 @theme 里额外配置。**
