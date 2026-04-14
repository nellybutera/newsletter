# Semantic HTML & ARIA Attributes

## Part 1: Semantic HTML Elements

Semantic elements describe the **meaning** of the content, not just how it looks. They tell browsers, screen readers, and search engines *what* the content is.

---

### `<main>`
**Purpose:** Marks the primary content of the page. There should only be one per page.
**Why it matters:** Screen readers use it to skip navigation and jump straight to content.
**Alternative:** `<div id="main">` or `<div class="main">` — works visually, but carries no meaning.

---

### `<form>`
**Purpose:** Groups interactive controls that collect user input. Signals "this is a form submission mechanism."
**Why it matters:** Screen readers announce it as a form landmark. Enables native submit behavior (Enter key, etc.).
**Alternative:** A plain `<div>` with a click handler — loses keyboard accessibility and semantic grouping.

---

### `<label>`
**Purpose:** Associates a text description with an input field.
**Why it matters:** Clicking the label focuses the input. Screen readers read the label aloud when the input is focused — without it, a blind user hears only "text field" with no context.
**Alternative:** A `<span>` or `<p>` next to the input — visually similar, but breaks the association entirely.

---

### `<input>`
**Purpose:** A native interactive control for user data entry (text, checkboxes, radio buttons, etc.).
**Why it matters:** Built-in keyboard focus, accessibility roles, and validation come for free.
**Alternative:** A styled `<div>` with a click listener — requires manually implementing focus, ARIA roles, keyboard events, and validation.

---

### `<button>`
**Purpose:** A clickable control that triggers an action.
**Why it matters:** Natively focusable, activatable with Enter/Space, announced as "button" by screen readers.
**Alternative:** `<div onclick="...">` or `<span onclick="...">` — requires adding `tabindex="0"`, `role="button"`, and keydown handlers to approximate the same behavior.

---

### `<ul>` / `<li>`
**Purpose:** An **unordered list** (`<ul>`) containing **list items** (`<li>`). Used for groups of related items with no particular sequence.
**Why it matters:** Screen readers announce "list of N items" so users know how many items to expect. `<ol>` is the ordered (numbered) variant.
**Alternative:** A series of `<div>` or `<span>` elements — looks the same, but loses the list structure and count announcement.

---

### `<picture>` / `<source media="...">`
**Purpose:** Serves **different image files** based on conditions like screen width or pixel density. The browser picks the best match.

```html
<picture>
  <source media="(min-width: 800px)" srcset="hero-large.webp">
  <source media="(min-width: 400px)" srcset="hero-medium.webp">
  <img src="hero-small.webp" alt="Hero image">
</picture>
```

**Why it matters:** Avoids sending a 2MB desktop image to a phone. Each `<source>` is a candidate; the `<img>` is the fallback.
**Alternative:** CSS `background-image` with media queries — works for decorative images only, but `<img>` with `alt` text is required for meaningful/content images (accessibility). You could also use a single `<img srcset="...">`, but that only handles resolution switching, not serving entirely different image crops (art direction).

---

### Summary Table

| Element | Role | Non-semantic alternative |
|---|---|---|
| `<main>` | Page landmark | `<div>` |
| `<form>` | Input group | `<div>` |
| `<label>` | Input description | `<span>` |
| `<input>` | Data entry control | Styled `<div>` + JS |
| `<button>` | Action trigger | `<div>` + JS |
| `<ul>`/`<li>` | List of items | Multiple `<div>`s |
| `<picture>`/`<source>` | Responsive image | CSS background or single `<img>` |

> **Core rule:** If a non-semantic alternative *can* replicate the behavior, it always requires extra JavaScript and ARIA attributes to do so — and it's easy to get wrong.

---

## Part 2: ARIA Attributes

**ARIA** stands for **Accessible Rich Internet Applications**. It's a set of HTML attributes defined by the W3C that add semantic meaning to elements when native HTML semantics are missing or insufficient.

> **The core rule of ARIA:** No ARIA is better than bad ARIA. Native semantic HTML should always be your first choice. ARIA is a patch, not a replacement.

---

### Why ARIA Exists

Screen readers and assistive technologies build a mental model of the page called the **accessibility tree** — a stripped-down version of the DOM that only contains meaningful information. When you use `<div>` and `<span>` for everything, the accessibility tree becomes meaningless noise.

ARIA lets you annotate those elements so assistive tech understands what they are and what state they're in.

---

### The 3 Categories of ARIA Attributes

---

#### 1. Roles — `role="..."`
Defines **what an element is**.

```html
<div role="button">Click me</div>
<div role="navigation">...</div>
<div role="dialog">...</div>
<div role="alert">...</div>
```

| Role | What it signals |
|---|---|
| `role="button"` | Acts as a clickable button |
| `role="navigation"` | A nav landmark (same as `<nav>`) |
| `role="dialog"` | A modal/dialog window |
| `role="alert"` | Urgent message, announced immediately |
| `role="tab"` / `role="tabpanel"` | Tab interface components |
| `role="list"` / `role="listitem"` | List structure (same as `<ul>`/`<li>`) |

**When to use:** Only when you can't use the native element. `<button>` beats `<div role="button">` every time.

---

#### 2. Properties — `aria-*` (stable facts about an element)
Describes **characteristics** of an element that don't change based on interaction.

```html
<input aria-required="true" />
<button aria-label="Close menu" />
<div aria-labelledby="modal-title" />
<input aria-describedby="password-hint" />
```

| Attribute | Purpose |
|---|---|
| `aria-label="..."` | Gives an element a name when there's no visible text label |
| `aria-labelledby="id"` | Points to another element whose text is the label |
| `aria-describedby="id"` | Points to an element that provides extra description |
| `aria-required="true"` | Marks a field as required |
| `aria-hidden="true"` | Hides element from screen readers (e.g. decorative icons) |

**Example — icon button without visible text:**
```html
<!-- Without aria-label, screen reader just says "button" -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>
```

---

#### 3. States — `aria-*` (dynamic, change with interaction)
Describes the **current condition** of an element. These should be updated with JavaScript as state changes.

```html
<button aria-expanded="false">Menu</button>
<input aria-invalid="true" />
<li role="tab" aria-selected="true">Tab 1</li>
<div aria-checked="true" role="checkbox">...</div>
<div aria-busy="true">Loading...</div>
<div aria-disabled="true">...</div>
```

| Attribute | Purpose |
|---|---|
| `aria-expanded="true/false"` | Is a dropdown/accordion open or closed? |
| `aria-selected="true/false"` | Is a tab/option currently selected? |
| `aria-checked="true/false"` | Is a custom checkbox/toggle on or off? |
| `aria-invalid="true"` | Is a form field in an error state? |
| `aria-disabled="true"` | Is the element non-interactive? |
| `aria-busy="true"` | Is content still loading? |
| `aria-live="polite/assertive"` | Should updates be announced automatically? |

---

### `aria-live` — Announcing Dynamic Changes

When content changes on the page (search results updating, a toast notification appearing), screen readers won't announce it unless you tell them to.

```html
<div aria-live="polite">
  Results updated: 24 items found
</div>
```

| Value | Behavior |
|---|---|
| `polite` | Waits until the user is idle, then announces |
| `assertive` | Interrupts immediately — use sparingly (errors only) |

---

### Quick Mental Model

```
Native HTML element          →  Always preferred
  <button>, <nav>, <input>

ARIA role                    →  When you must use a <div>
  role="button"

ARIA property                →  Static extra info
  aria-label, aria-required

ARIA state                   →  Dynamic info, updated by JS
  aria-expanded, aria-invalid
```

---

### The 5 Rules of ARIA (W3C)

1. Use native HTML elements before reaching for ARIA
2. Don't change native semantics unless you have to
3. All interactive ARIA controls must be keyboard accessible
4. Don't hide focusable elements with `aria-hidden="true"`
5. All interactive elements must have an accessible name (`aria-label` or visible text)

---

> In short — ARIA fills the gap between what HTML natively communicates and what assistive technologies need to know, particularly for dynamic, JavaScript-driven interfaces.
