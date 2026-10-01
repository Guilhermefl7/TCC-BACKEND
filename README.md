# R.TUAL Hair Care — Login e Cadastro

Projeto pronto com:

- Node.js + Express
- MySQL / Aiven
- Cadastro de usuário
- Login de usuário
- Senha criptografada com bcrypt
- Token JWT
- Tela simples de login e cadastro para testar
- Compatível com Vercel

## 1. Instalar

Abra a pasta no VS Code e rode:

```bash
npm install
```

## 2. Criar o arquivo .env

Copie `.env.example` e renomeie para `.env`.

Preencha com os dados reais do banco Aiven:

```env
PORT=3000
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_SSL=true
JWT_SECRET=coloque_uma_chave_grande_aqui
```

Não publique o `.env` no GitHub.

## 3. Criar a tabela no banco

Execute o arquivo:

`sql/schema.sql`

No MySQL do Aiven.

## 4. Rodar no computador

```bash
npm run dev
```

Abra:

`http://localhost:3000`

## Rotas

### Cadastro

POST `/api/auth/register`

JSON:

```json
{
  "nome": "Guilherme",
  "email": "gui@email.com",
  "senha": "123456"
}
```

Também aceita:

POST `/api/auth/cadastro`

POST `/cadastro`

### Login

POST `/api/auth/login`

JSON:

```json
{
  "email": "gui@email.com",
  "senha": "123456"
}
```

Também aceita:

POST `/login`

### Teste do servidor

GET `/api/health`

## Vercel

O projeto já inclui `vercel.json` e `api/index.js`.

Na Vercel, adicione todas as variáveis do `.env` em:

Project Settings > Environment Variables

Depois faça um novo deploy.

## Importante

A senha do usuário nunca é salva em texto puro. Ela é transformada em hash com bcrypt.

Para um projeto escolar, `DB_SSL=true` com `rejectUnauthorized: false` facilita a conexão com Aiven. Em produção real, o ideal é usar o certificado CA do provedor.
