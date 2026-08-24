# Como colocar o Toptur Operations no ar (Railway)

Guia passo a passo. Você faz as partes que envolvem criar conta e digitar
senha; o projeto já está preparado para o resto.

**Por que Railway:** aplicação e banco no mesmo lugar, uma conta e uma
fatura só, sem restrição de uso comercial e sem hibernação do banco
(nada de espera na primeira tela do dia).

**Custo estimado:** cerca de US$ 5 a 20 por mês para o porte de vocês
(uso de 2 pessoas). O Railway cobra por consumo, não por assento.

> O código não fica preso ao Railway: é Next.js e PostgreSQL padrão. Se
> um dia quiser mudar, o arquivo `vercel.json` deixa o caminho para a
> Vercel também pronto.

---

## Parte 1 — Criar o projeto e o banco

1. Acesse **railway.com** e crie uma conta (dá para entrar com o GitHub).
2. **New Project → Deploy from GitHub repo** e escolha `livianasto/topturvr`.
   - Autorize o Railway a acessar o repositório, se ele pedir.
   - Em **Branch**, selecione a branch a publicar (hoje o código está em
     `codex/product-foundation`; depois de mesclar, será `main`).
3. A primeira tentativa de publicação vai falhar — normal, o banco ainda
   não existe. Continue.
4. Dentro do projeto, clique em **+ New → Database → PostgreSQL**.
   O banco é criado automaticamente.

---

## Parte 2 — Gerar a chave de segurança

A aplicação precisa de uma chave secreta para proteger as sessões de login.
No terminal do seu computador, rode:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Guarde o resultado. **Não reutilize** a chave de desenvolvimento que está
no `.env` local.

---

## Parte 3 — Configurar as variáveis

Clique no serviço da **aplicação** (não no banco) → aba **Variables**.

**Primeiro, as duas conexões do banco.** Use **Add Reference Variable**
(não digite o endereço à mão — a referência se atualiza sozinha se a senha
do banco mudar):

| Nome | Como preencher |
|---|---|
| `DATABASE_URL` | Add Reference Variable → serviço Postgres → `DATABASE_URL` |
| `DIRECT_DATABASE_URL` | mesma coisa, aponta para o mesmo `DATABASE_URL` |

> As duas são iguais no Railway. A separação só importa em bancos
> serverless; aqui existe para o projeto continuar portátil.

**Depois, as demais** (digitadas normalmente):

| Nome | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `NEXTAUTH_SECRET` | a chave gerada na Parte 2 |
| `NEXTAUTH_URL` | deixe em branco por enquanto (Parte 4) |
| `TOPTUR_COPY_EMAIL` | `contato@topturvr.com.br` |
| `SEED_LIVIA_EMAIL` | e-mail de login da Lívia |
| `SEED_LIVIA_PASSWORD` | senha forte para a Lívia |
| `SEED_ROGERIO_EMAIL` | e-mail de login do Rogério |
| `SEED_ROGERIO_PASSWORD` | senha forte para o Rogério |

---

## Parte 4 — Gerar o endereço do site

1. No serviço da aplicação: **Settings → Networking → Generate Domain**.
2. O Railway cria um endereço tipo `topturvr-production.up.railway.app`.
   Copie.
3. Volte em **Variables** e preencha `NEXTAUTH_URL` com esse endereço
   completo, incluindo `https://` e **sem barra no final**.
4. O Railway republica sozinho a cada mudança de variável. Aguarde
   terminar.

As tabelas do banco são criadas automaticamente antes de cada publicação
(está configurado no `railway.json`).

---

## Parte 5 — Criar os usuários

As tabelas já existem, mas os papéis e as contas de acesso ainda não.

No serviço da aplicação, vá em **Settings → Deploy** e procure a opção de
executar um comando avulso (ou use o botão de terminal/shell do serviço).
Rode:

```bash
npm run db:seed
```

Isso cria os dois papéis, as permissões e as contas da Lívia e do Rogério
com as senhas que você definiu na Parte 3.

**Alternativa pelo seu computador**, se preferir — instale a ferramenta do
Railway e rode apontando para o ambiente de produção:

```bash
npm i -g @railway/cli
railway login
railway link
railway run npm run db:seed
```

---

## Parte 6 — Conferir

1. Abra o endereço do site e faça login com um dos usuários criados.
2. Acesse `/api/health` — deve responder `{"status":"ok","db":"up"}`.
3. Cadastre um cliente de teste e veja se aparece na lista.

---

## Backup — importante

O sistema guarda valores de venda, margem e CPF de passageiros. **Antes de
usar para valer, configure o backup.**

No serviço do Postgres no Railway, procure a aba/opção **Backups** e ative
os backups automáticos com uma frequência diária.

Confira também, uma vez, se o backup *restaura* de verdade — backup que
nunca foi testado não é backup.

---

## Depois

- **Domínio próprio:** em Settings → Networking → Custom Domain dá para
  usar algo como `sistema.topturvr.com.br`. Ao fazer isso, atualize o
  `NEXTAUTH_URL` para o novo endereço.
- **Cada envio ao GitHub publica automaticamente** a branch configurada.
- **Se uma migração falhar**, o Railway não troca a versão no ar — a
  anterior continua funcionando.

---

## Se algo der errado

- **Build falha em algo de Prisma:** confirme que `DATABASE_URL` e
  `DIRECT_DATABASE_URL` estão as duas cadastradas como Reference Variable.
- **Login não funciona / erro de sessão:** o `NEXTAUTH_URL` provavelmente
  não bate exatamente com o endereço do site (atenção ao `https://` e à
  barra final).
- **"Nenhum usuário" ao tentar entrar:** o seed da Parte 5 não rodou.
- **Aplicação sobe mas dá erro de banco:** veja em **Deployments → Logs**
  qual foi a falha da etapa de migração.
