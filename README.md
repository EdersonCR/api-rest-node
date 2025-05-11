# API Transações

Um API REST básica com Node.js para registro de transações finaceiras.

## 💻 Tecnologias

* [Node.js](https://nodejs.org/pt) (v18+)
* [Fastify](https://fastify.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [ESlint](https://eslint.org/)
* [SQLite](https://www.sqlite.org/)
* [Knex](https://knexjs.org/sqlite)
* [Zod](https://zod.dev/)
* [Vitest](https://vitest.dev/)
* [tsup](https://tsup.egoist.dev/)


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
   node run dev
   ```

## 📄 Endpoints

O servidor ficará disponível em `http://localhost:3333`.

| Método | Rota        | Descrição                                               | Cookie `sessionId` | Body (JSON)                                                                 | Status       |
|--------|-------------|----------------------------------------------------------|--------------------|-----------------------------------------------------------------------------|--------------|
| **POST**   | `transactions/`         | Cria uma nova transação para a sessão                   | Não | `{ "title": "string", "amount": number, "type": "credit" \| "debit" }` | **201** Created.  |
| **GET**    | `/transactions`         | Lista todas as transações da sessão                     | Sim             | —                                                                           | **200** OK;<br>**401** Unautorized.        |
| **GET**    | `/transactions/:id`      | Busca uma transação específica por ID                   | Sim             | —                                                                           | **200** OK;<br>**401** Unautorized.        |
| **GET**    | `/transactions/summary`  | Retorna o total das transações da sessão                | Sim            | —                                                                           | **200** OK;<br>**401** Unautorized.      |

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE.md) para mais detalhes.

## ✒️ Autor
Feito por **Éderson C. Rodrigues** 🏳️‍🌈

&ensp;&ensp;&ensp;[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/edersoncr) 
&ensp;&ensp;&ensp;[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EdersonCR)