import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prisma } from "./lib/db";
import createGraphqlServer from "./graphql";

async function main() {
    const app = express();
    const PORT = Number(process.env.PORT || 3000);

    app.use(express.json());

    app.use("/graphql", expressMiddleware(await createGraphqlServer()));

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main();
