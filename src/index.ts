import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphqlServer from "./graphql";
import cors from "cors";
import UserService from "./services/user";

async function main() {
    const app = express();
    const PORT = Number(process.env.PORT || 3000);

    const gqlServer = await createGraphqlServer();

    app.use(
        "/graphql",
        cors(),
        express.json(),
        expressMiddleware(gqlServer, {
            context: async ({ req }) => {
                const token = req.headers.authorization || "";
                try {
                    const user = UserService.decodeToken(token);
                    return user;
                } catch (error) {
                    return {};
                }
            },
        })
    );

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main();
