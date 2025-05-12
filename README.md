# API Dieta

Uma API RESTful simples feita com Node.js + Fastify que permite aos usuários registrarem suas refeições, acompanhar sua dieta e acessar métricas pessoais.

## 💻 Tecnologias

&ensp;&ensp;[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
&ensp;&ensp;[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
&ensp;&ensp;[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
&ensp;&ensp;[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
&ensp;&ensp;[![Knex.js](https://img.shields.io/badge/Knex.js-D97706?style=for-the-badge)](https://knexjs.org/)
&ensp;&ensp;[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
&ensp;&ensp;[![Zod](https://img.shields.io/badge/Zod-8A2BE2?style=for-the-badge)](https://zod.dev/)
&ensp;&ensp;[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
&ensp;&ensp;[![tsup](https://img.shields.io/badge/tsup-3178C6?style=for-the-badge)](https://tsup.egoist.dev/)


## ⚙️ Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/EdersonCR/api-rest-node.git
   cd api-rest-node
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

4. Execute o servidor:

   ```bash
   npm run dev
   ```

## 🧪 Rodar testes

   ```bash
   npm run test
   ```

## 🗃️ Rodar migrations (se necessário)

   ```bash
   npm run knex migrate:latest
   ```




## 📬 Endpoints

O servidor ficará disponível em `http://localhost:3333`.

### Usuários 🧑‍💻

| Método | Rota    | Descrição     | Body                                      | Cookie | Status                                      |
|--------|---------|----------------|-------------------------------------------|--------|---------------------------------------------|
| **POST**   | /users  | Criar usuário  | `{ name: string, email: string }`         | Não    | **201** Usuário criado;<br>**400** Usuário já existe. |

### Refeições 🥗

| Método | Rota            | Descrição             | Body                                                                 | Cookie          | Status                                                           |
|--------|-----------------|------------------------|----------------------------------------------------------------------|------------------|------------------------------------------------------------------|
| **POST**   | /meals          | Criar refeição         | `{ name: string, description: string, on_diet: boolean, date: date }`| Sim (sessionId) | **201** Refeição criada;<br>**401** Não autorizado.                        |
| **GET**    | /meals          | Listar refeições       | —                                                                    | Sim (sessionId) | **200** OK;<br>**401** Não autorizado.                                     |
| **GET**    | /meals/:id      | Buscar refeição        | —                                                                    | Sim (sessionId) | **200** OK;<br>**401** Não autorizado;<br>**404** Refeição não encontrada.      |
| **GET**    | /meals/metrics  | Buscar métricas        | —                                                                    | Sim (sessionId) | **200** OK;<br>**401** Não autorizado.                                     |
| **POST**   | /meals/:id      | Editar refeição        | `{ name: string, description: string, on_diet: boolean, date: date }`| Sim (sessionId) | **204** Refeição editada;<br>**401** Não autorizado<br>**404** Refeição não encontrada. |
| **DELETE** | /meals/:id      | Excluir refeição       | —                                                                    | Sim (sessionId) | **204** Refeição excluída;<br>**401** Não autorizado;<br>**404** Refeição não encontrada. |


## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE.md) para mais detalhes.

## ✒️ Autor
Feito por **Éderson C. Rodrigues** 🏳️‍🌈

&ensp;&ensp;[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/edersoncr) 
&ensp;&ensp;[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EdersonCR)