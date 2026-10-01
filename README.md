# Bora de Batata

Site e painéis internos da Bora de Batata.

## Estrutura

- `/` — cardápio mobile-first, personalização de produtos, carrinho e fechamento do pedido pelo WhatsApp.
- `/painel` — entrada da área interna.
- `/painel/admin` — dashboard desktop da administração.
- `/painel/pedidos` — central desktop da atendente.
- `/painel/motoboy` — painel mobile do motoboy.

Os painéis ainda usam dados demonstrativos enquanto autenticação, permissões e persistência no banco não são conectadas. As rotas internas estão marcadas como `noindex`.

## Desenvolvimento

O projeto usa Bun + TanStack Start + React + Tailwind.

```sh
bun install --frozen-lockfile
bun run build
```

Verificações principais:

```sh
node scripts/verify-bora.cjs
node node_modules/typescript/bin/tsc --noEmit
bun audit --audit-level=high
```

## Deploy

A branch `main` publica na Vercel. O endereço de produção usado nas verificações é:

`https://boradebatata.vercel.app`

## Segurança

- Nunca commitar chaves ou arquivos `.env` reais.
- O CI verifica segredos rastreados, build, TypeScript, regras do cardápio e dependências com vulnerabilidades altas/críticas.
