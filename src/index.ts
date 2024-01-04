import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function main() {
    const app = express();
    const PORT = Number(process.env.PORT || 3000);

    app.use(express.json());

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello : String
                hey(name: String!): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "world",
                hey: (_, { name }: { name: String }) => `Hello ${name}`,
            },
        },
    });

    await gqlServer.start();

    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main();
