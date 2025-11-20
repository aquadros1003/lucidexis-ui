# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Environment variables

This project uses Vite — environment variables exposed to the browser must begin with `VITE_`.

- `VITE_API_BASE_URL` — base URL of your API (no trailing slash). Default: `http://localhost`.

Create a `.env` or `.env.local` file with the following example content (already provided in `.env.example`):

```
VITE_API_BASE_URL=http://localhost
```

In code you can use `import.meta.env.VITE_API_BASE_URL`. This project provides a helper in `src/config.ts`:

```
import { API_V1 } from './config';
// API_V1 => 'http://localhost/api/v1' by default
```

### Predefined headers

All API requests go through a central helper: `src/api/client.ts` which exposes `fetchWithHeaders` and `getAuthToken`.

- `fetchWithHeaders(path, init)` automatically adds:
  - `Accept: application/json`
  - `Content-Type: application/json` (when body is present and not FormData)
  - `Authorization: Bearer <token>` (reads token from `localStorage`)

This helper is used across the API modules (`src/api/*.ts`) so any TanStack Query (`@tanstack/react-query`) that calls them will automatically use these predefined headers.

If you need to override headers for a single call, provide them in the `init.headers` option of `fetchWithHeaders`.
