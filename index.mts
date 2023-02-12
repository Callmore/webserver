import "dotenv/config";

import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import https from "node:https";
import { addPath } from "./db.mjs";
import { absolutePath } from "./pathUtils.mjs";

import { createTranslatorRouter } from "./submodules/client/src/index.mjs";
import { createWebSocketServer } from "./submodules/server/src/index.mjs";

const SERVER_PORT = 3000;

const app = express();
const server = https.createServer(
    {
        key: fs.readFileSync(process.env.SSL_KEY!),
        cert: fs.readFileSync(process.env.SSL_CERT!),
    },
    app
);

app.use(helmet());
app.use(express.static(absolutePath("static")));

const staticPaths: Readonly<Record<string, string>> = {
    "/": "pages/index.html",
    "/kart": "pages/kart.html",
    "/neos": "pages/neos.html",
};

app.use("/", (req, res, next) => {
    if (Object.hasOwn(staticPaths, req.path)) {
        res.sendFile(absolutePath(staticPaths[req.path]));
        return;
    }

    next();
});

app.use("/neos/", createTranslatorRouter("./submodules/client"));

app.use((req, res) => {
    res.status(404).send("Page not found.");
    addPath(req.headers["user-agent"] ?? "", req.url);
});

const wss = createWebSocketServer({ server });

server.listen(SERVER_PORT, () => {
    console.log(`Server started on port ${SERVER_PORT}.`);
});
