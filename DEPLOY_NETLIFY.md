# Deploy na Netlify

> ⚠️ Este projeto foi feito no **Lovable** e usa **TanStack Start (SSR + Server Functions)**. O caminho mais simples é publicar pelo botão **Publish** do Lovable. Use Netlify só se realmente precisar.

## 1. Baixar o código

No editor Lovable, canto superior direito:
- **GitHub → Connect to GitHub** (recomendado), ou
- **GitHub → Export to ZIP**

## 2. Antes de subir na Netlify — você precisa "ejetar" o build de Cloudflare

Hoje o `vite.config.ts` usa `@lovable.dev/vite-tanstack-config`, que builda para Cloudflare Workers. Para Netlify Functions você precisa trocar pela config padrão do TanStack Start.

Edite **`vite.config.ts`** e substitua por:

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "netlify",
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],
});
```

E remova/ignore os arquivos `wrangler.jsonc` e `src/server.ts` (este último é wrapper específico do Cloudflare).

Instale o que faltar:
```bash
bun add -D vite @vitejs/plugin-react @tailwindcss/vite vite-tsconfig-paths
bun add @tanstack/react-start
```

## 3. Variáveis de ambiente

No painel da Netlify → **Site settings → Environment variables**, adicione:

| Variável | Onde achar |
|---|---|
| `VITE_SUPABASE_URL` | Lovable → Cloud → Settings |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | idem |
| `VITE_SUPABASE_PROJECT_ID` | idem |
| `SUPABASE_URL` | mesmo valor de VITE_SUPABASE_URL |
| `SUPABASE_PUBLISHABLE_KEY` | mesmo valor |
| `SUPABASE_SERVICE_ROLE_KEY` | Lovable Cloud → Settings → Service Role |
| `FYHUB_API_KEY` (ou nome do seu secret de Pix) | seu provedor |

## 4. Deploy

- **Build command:** `bun run build`
- **Publish directory:** `.output/public`
- **Functions directory:** `.output/server`

Tudo isso já está no `netlify.toml` que está na raiz do projeto.

## ⚠️ Limitações conhecidas

- O preview do **Lovable vai parar de funcionar** depois de ejetar o `vite.config.ts`.
- O suporte a TanStack Start na Netlify ainda é novo — pode haver instabilidades.
- Você passa a gerenciar Supabase, secrets e domínio por conta própria.

Se algo quebrar, basta reverter o `vite.config.ts` para a versão original do Lovable.
