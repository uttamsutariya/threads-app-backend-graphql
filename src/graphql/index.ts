import { ApolloServer } from "@apollo/server";
import { User } from "./user";

export default async function createGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations}
            }
            ${User.typeDefs}    
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation: {
                ...User.resolvers.mutations,
            },
        },
    });

    await gqlServer.start();
    return gqlServer;
}
