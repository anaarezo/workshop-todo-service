const express = require('express');
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

// Type Definition = Schema - entrada, saída, definição dos tipos

// [Todo!]! validação interna é de um por um e a externa valida o todo
const typeDefs = gql `
    type Query {
        todo(id: ID!): Todo
        todos(status: TodoStatus) : [Todo!]!
    }

    type Mutation {
        addTodo(todo: AddTodoInput!): Todo!
        setTodo(todo: setTodoInput!): Todo
        delTodo(id: ID!): Todo

        activateTodos(ids: [ID!]!): [Todo!]!
        completeTodos(ids: [ID!]!): [Todo!]!
    }

    input AddTodoInput {
        status: TodoStatus = ACTIVE
        description: String!
    }

    input SetTodoInput {
        id: ID!
        status: TodoStatus
        description: String
    }

    type Todo {
        id: ID!
        status: TodoStatus!
        description: String!

    }

    enum TodoStatus {
        ACTIVE
        COMPLETED
    }
`;

// Isso é o mock
let todos = [{
        id: '27e8f183-8d75-4c47-b610-cc14a5a8c95b',
        status: todoStatus.ACTIVE,
        description: 'Dar comida para o Fubá',
    },
    {
        id: '47780a0f-e179-45d6-877f-cf998b44a080',
        status: todoStatus.ACTIVE,
        description: 'Levar o Fubá para passear',
    },
    {
        id: '0c6484f6-1ffb-498a-88ab-ea8865bf872b',
        status: todoStatus.COMPLETED,
        description: 'Fazer o almoço',
    },
    {
        id: '76175377-07f4-4ad9-ae8e-4dab6ff432d1',
        status: todoStatus.COMPLETED,
        description: 'Tomar banho',
    },
];

const resolvers = {
    Query: {
        //todo: (_, { id }, ) => id  // _ underscore está omitindo objeto
        todo: (_, { id }) => todos.find(todo => todo.id === id ),
        todos: (_, { status }) => {
            status ?  todos.filter(todo => todo.status === status) : todos,
        },
    },
};

//Omitir informações da propriedade ex.: rest -- Default
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const app = express();
server.applyMiddleware({
    app
});

app.listen({
    port: 4000
}, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});