import "dotenv/config";

import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import https from "node:https";
import { mountTranslator } from "./neosTranslatorBridge";
import { absolutePath } from "./pathUtils";
import { createWebSocketServer } from "./submodules/neos-translator-server/src/index";

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
    "/neos/translator_info": "pages/neos/translator.html",
};

app.use("/", (req, res, next) => {
    if (Object.hasOwn(staticPaths, req.path)) {
        res.sendFile(absolutePath(staticPaths[req.path]));
        return;
    }

    console.log("No static path for", req.path, "found.");

    next();
});

mountTranslator(app);

const wss = createWebSocketServer({ server: server });

server.listen(3000, () => {
    console.log("Server started.");
});
