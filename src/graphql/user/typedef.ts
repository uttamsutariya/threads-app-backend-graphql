export const typeDefs = `#graphql
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        salt: String!
    }
    type Query {
        getUserToken(email: String!, password: String!): String
    }
    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): String
    }
`;
