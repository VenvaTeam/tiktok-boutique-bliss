#!/usr/bin/env bash
# Exporta o projeto pronto para Netlify (TanStack Start + Functions).
#
# Uso:
#   bash scripts/export-netlify.sh
#
# Saída:
#   ./dist-export/projeto-netlify.zip
#
# O script NÃO modifica os arquivos originais — ele copia tudo para uma pasta
# temporária, troca o vite.config.ts pelo preset Netlify, remove arquivos
# específicos do Cloudflare/Lovable e gera o ZIP.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/dist-export"
STAGE="$OUT_DIR/projeto-netlify"
ZIP_FILE="$OUT_DIR/projeto-netlify.zip"

echo "==> Limpando saída anterior..."
rm -rf "$OUT_DIR"
mkdir -p "$STAGE"

echo "==> Copiando arquivos do projeto..."
# Copia tudo exceto pastas pesadas/inúteis
rsync -a \
  --exclude "node_modules" \
  --exclude ".git" \
  --exclude "dist" \
  --exclude ".output" \
  --exclude ".vite" \
  --exclude "dist-export" \
  --exclude ".DS_Store" \
  "$ROOT/" "$STAGE/"

echo "==> Substituindo vite.config.ts pelo preset Netlify..."
cat > "$STAGE/vite.config.ts" <<'EOF'
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
EOF

echo "==> Removendo arquivos específicos do Cloudflare/Lovable..."
rm -f "$STAGE/wrangler.jsonc" "$STAGE/wrangler.toml"
# server.ts é o wrapper SSR do Cloudflare — o adapter Netlify não usa
rm -f "$STAGE/src/server.ts"

echo "==> Garantindo .gitignore com entradas necessárias..."
{
  echo ""
  echo "# Netlify / build"
  echo ".netlify"
  echo ".output"
  echo "dist"
} >> "$STAGE/.gitignore"

echo "==> Removendo .env (segredos) — configure no painel da Netlify..."
rm -f "$STAGE/.env" "$STAGE/.env.local"

echo "==> Gerando ZIP..."
cd "$OUT_DIR"
if command -v zip >/dev/null 2>&1; then
  zip -rq "$ZIP_FILE" "projeto-netlify"
else
  # fallback se 'zip' não estiver instalado
  python3 -c "import shutil; shutil.make_archive('projeto-netlify', 'zip', '.', 'projeto-netlify')"
fi

echo ""
echo "✅ Pronto!"
echo "   Arquivo: $ZIP_FILE"
echo ""
echo "Próximos passos:"
echo "  1. Faça upload do ZIP no Netlify (ou conecte via GitHub)"
echo "  2. No painel da Netlify, configure as variáveis de ambiente"
echo "     (veja DEPLOY_NETLIFY.md)"
echo "  3. Build command: bun run build"
echo "     Publish dir:   .output/public"
