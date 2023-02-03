import express, { Express } from "express";
import { absolutePath } from "./pathUtils";

export function mountTranslator(app: Express) {
    app.get("/neos/translator/", (req, res) => {
        res.sendFile(
            absolutePath("submodules/neos-translator-client/index.html")
        );
    });

    app.get("/neos/translator/index.js", (req, res) => {
        res.sendFile(
            absolutePath("submodules/neos-translator-client/index.js")
        );
    });

    app.get("/neos/translator/styles.css", (req, res) => {
        res.sendFile(
            absolutePath("submodules/neos-translator-client/styles.css")
        );
    });

    app.use(
        "/neos/translator/res/",
        express.static(absolutePath("submodules/neos-translator-client/res"))
    );
}
