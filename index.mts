import "dotenv/config";

import express from "express";
import helmet from "helmet";
import http from "node:http";
import { absolutePath } from "./pathUtils.mjs";

import { createTranslatorRouter } from "./submodules/client/src/index.mjs";
import { createWebSocketServer } from "./submodules/server/src/index.mjs";

const SERVER_PORT = 3000;

const app = express();
const server = http.createServer({}, app);

app.use(helmet());
// TODO: SETUP CORS PROPPERLY!!!
app.use("/neos/translator", function (req, res, next) {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' fonts.googleapis.com 'unsafe-inline'; font-src 'self' fonts.googleapis.com fonts.gstatic.com; connect-src *" /// DON@T EVEN DO THIS (probably)
    );
    next();
});

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
});

const wss = createWebSocketServer({ server });

server.listen(SERVER_PORT, () => {
    console.log(`Server started on port ${SERVER_PORT}.`);
});
