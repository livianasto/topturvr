# Como colocar o Toptur Operations no ar

Guia passo a passo. Você faz as partes que envolvem criar conta e digitar
senha; o projeto já está preparado para o resto.

**Custo:** os planos gratuitos da Vercel e da Neon atendem bem o uso de
duas pessoas. Não é preciso cartão de crédito para começar.

---

## Parte 1 — Criar o banco de dados (Neon)

1. Acesse **neon.com** e crie uma conta (dá para entrar com a conta do
   GitHub).
2. Crie um projeto. Sugestões:
   - Nome: `toptur-operations`
   - Região: **AWS South America (São Paulo)** — mais perto, mais rápido.
3. Terminado, a Neon mostra a tela **Connection string**. Você vai precisar
   de **duas** versões dela:
   - **Pooled connection** (o endereço tem `-pooler` no meio) → guarde como
     `DATABASE_URL`
   - **Direct connection** (sem `-pooler`) → guarde como
     `DIRECT_DATABASE_URL`

   Se aparecer só uma, procure a opção "Connection pooling" ou
   "Direct connection" para alternar entre as duas.

> Por que duas? A aplicação usa a agrupada (aguenta muitos acessos
> simultâneos) e as migrações usam a direta (precisam de conexão estável).

---

## Parte 2 — Gerar a chave de segurança

A aplicação precisa de uma chave secreta para proteger as sessões de login.

No terminal, rode:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Guarde o resultado como `NEXTAUTH_SECRET`. **Não reutilize** a chave de
desenvolvimento que está no `.env` local.

---

## Parte 3 — Publicar (Vercel)

1. Acesse **vercel.com** e entre com a conta do GitHub.
2. **Add New → Project** e escolha o repositório `livianasto/topturvr`.
3. Em **Branch**, selecione a branch que quer publicar (hoje o código está
   em `codex/product-foundation`; depois de mesclar, será `main`).
4. Antes de clicar em Deploy, abra **Environment Variables** e cadastre:

   | Nome | Valor |
   |---|---|
   | `DATABASE_URL` | a conexão **pooled** da Neon |
   | `DIRECT_DATABASE_URL` | a conexão **direct** da Neon |
   | `NEXTAUTH_SECRET` | a chave gerada na Parte 2 |
   | `NEXTAUTH_URL` | deixe em branco por enquanto (Parte 4) |
   | `TOPTUR_COPY_EMAIL` | `contato@topturvr.com.br` |
   | `SEED_LIVIA_EMAIL` | e-mail de login da Lívia |
   | `SEED_LIVIA_PASSWORD` | senha forte para a Lívia |
   | `SEED_ROGERIO_EMAIL` | e-mail de login do Rogério |
   | `SEED_ROGERIO_PASSWORD` | senha forte para o Rogério |

5. Clique em **Deploy**. As tabelas do banco são criadas automaticamente
   durante a publicação.

---

## Parte 4 — Ajustar o endereço e criar os usuários

1. Terminada a publicação, a Vercel mostra o endereço do site (algo como
   `https://topturvr.vercel.app`). Copie.
2. Volte em **Settings → Environment Variables** e preencha `NEXTAUTH_URL`
   com esse endereço (sem barra no final).
3. Em **Deployments**, clique nos três pontinhos do último deploy e escolha
   **Redeploy** — para o novo endereço valer.
4. **Criar os usuários.** As tabelas existem, mas os papéis e as contas de
   acesso ainda não. No seu computador, com o arquivo `.env.producao`
   contendo as mesmas variáveis da tabela acima, rode:

   ```bash
   npx dotenv -e .env.producao -- npm run db:seed
   ```

   Ou, mais simples: troque temporariamente as variáveis do seu `.env`
   local pelas de produção, rode `npm run db:seed`, e depois volte as
   antigas.

   Isso cria os dois papéis, as permissões e as contas da Lívia e do
   Rogério com as senhas que você definiu.

---

## Parte 5 — Conferir

1. Abra o endereço do site e faça login.
2. Acesse `/api/health` — deve responder `{"status":"ok","db":"up"}`.
3. Cadastre um cliente de teste e confira se aparece na lista.

---

## Depois

- **Domínio próprio:** em Settings → Domains dá para usar algo como
  `sistema.topturvr.com.br`. Se fizer isso, atualize o `NEXTAUTH_URL`
  para o novo endereço e publique de novo.
- **Cada envio ao GitHub publica automaticamente** a branch configurada.
- **Backup:** a Neon guarda histórico no plano gratuito, mas vale conferir
  as opções de backup antes de depender do sistema para valer.

---

## Se algo der errado

- **Erro de banco durante a publicação:** confira se `DIRECT_DATABASE_URL`
  é mesmo a conexão *direta* (sem `-pooler`).
- **Login não funciona / erro de sessão:** o `NEXTAUTH_URL` provavelmente
  não bate exatamente com o endereço do site (atenção a `https://` e à
  barra final).
- **"Nenhum usuário":** o seed da Parte 4 não rodou.
