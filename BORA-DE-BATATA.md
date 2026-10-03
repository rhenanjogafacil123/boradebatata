# Bora de Batata

Aplicação do cardápio e da operação interna da Bora de Batata.

## Cardápio atual

- sete sabores de batata recheada em 300g e 500g;
- pastel montável com até sete ingredientes por R$ 18,99;
- pastel completo por R$ 24,99;
- refrigerante lata por R$ 6,80;
- Guaracamp por R$ 2,50.

Contato do pedido: (21) 99054-3204. A operação informada é somente delivery, a partir das 19h.

O checkout envia o total parcial dos produtos e deixa o frete explicitamente a combinar enquanto endereço de saída e tabela de entrega não estiverem definidos no sistema.

## Painéis

- `/painel/admin`: desktop, visão administrativa.
- `/painel/pedidos`: desktop, central da atendente.
- `/painel/motoboy`: mobile, entregas do motoboy.

Os dados desses painéis são demonstrativos nesta etapa. Antes de uso operacional real, a próxima fase precisa ligar autenticação, permissões por função e persistência no banco.

## Publicação

O projeto está conectado à Vercel e a branch `main` dispara o deploy de produção.

## Verificação

- `node scripts/verify-bora.cjs`
- `node node_modules/typescript/bin/tsc --noEmit`
- `bun run build`
- `bun audit --audit-level=high`
- `node scripts/security-check.mjs`

## Imagens atuais

- `public/bora-hero.png`
- `public/bora-logo.svg`
- `public/bora-drink.svg`
- `public/favicon.ico`


## Banco e autenticação

A migração \`20261003202000_dashboard_core.sql\` prepara as tabelas operacionais do painel,
perfis por função (\`admin\`, \`attendant\`, \`courier\`) e políticas RLS.

O login está disponível em \`/painel/login\`, mas a proteção permanece desligada por padrão.
Só defina \`VITE_PANEL_AUTH_ENABLED=true\` depois de:

1. aplicar a migração no projeto Supabase;
2. criar o primeiro usuário no Supabase Auth;
3. alterar o perfil desse usuário para \`role = 'admin'\`;
4. configurar as variáveis Supabase no ambiente de produção.

Enquanto a flag estiver \`false\`, os painéis continuam no modo demonstrativo atual.
