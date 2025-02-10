
# To-do List App

One more To-do list project.

The backend is a REST API based on the Hapi framework and some modules, SQLite and JWT authentication.

The frontend is a single page application built with React.



## Documentation

The REST API endpoints documentation is generated using [Hapi Swagger](https://github.com/hapi-swagger/hapi-swagger).

When running locally it is available at: `https://localhost:3001/docs`




## Run Locally

Clone the project

```bash
  git clone https://github.com/danielcmnunes/to-do-list
```

Go to the backend directory:

```bash
  cd to-do-list/backend
```

Install dependencies:

```bash
  npm install
```

Start the server:

```bash
  npm run start
```

Go to the frontend directory:

```bash
  cd ..
  cd frontend
```

Install dependencies:

```bash
  npm install
```

Start the react development server:

```bash
  npm run start
```

## Running Tests

There are currently four test sets:

auth: new user registration and authentication tests

details: tests involving the user's details

todos: tests involving creating new tasks and task list retrieval, filtering and sorting

To run the backend tests, run the following command

```bash
  npm run test-<test-set-name>
```

