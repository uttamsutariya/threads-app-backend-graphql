import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prisma } from "./lib/db";

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
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "world",
                hey: (_, { name }: { name: String }) => `Hello ${name}`,
            },
            Mutation: {
                createUser: async (
                    _,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;
                    }
                ) => {
                    await prisma.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            password,
                            salt: "random_salt",
                        },
                    });
                    return true;
                },
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
