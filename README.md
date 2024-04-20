# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

# Philosophy

1. Try HTMX
2. Use custom-components for heavy islands
    - Solidjs + Solid Element
    - Communication islands <-> htmx ?
        https://github.com/Sinthor/seawasp
3. DB
    - Surreal ?
    - Bun built-in SQLite ?