import "dotenv/config";

import express from "express";
import path from "node:path";
import { mountTranslator } from "./neosTranslatorBridge";
import { absolutePath } from "./pathUtils";
import { createWebSocketServer } from "./submodules/neos-translator-server/src/index";
import http from "node:http";

const app = express();
const server = http.createServer(app);

app.use(express.static(absolutePath("static")));

const staticPaths: Readonly<Record<string, string>> = {
    "/": "pages/index.html",
    "/kart/": "pages/kart.html",
    "/neos/": "pages/neos.html",
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

const wss = createWebSocketServer({ server });

server.listen(3000, () => {
    console.log("Server started.");
});
