import express = require("express");
import cors = require("cors");
import companies from "./companies";
import tiers from "./tiers";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

app.get("/", (req, res) => res.send("Hello! You've found the root endpoint!"));
companies(app);
tiers(app);

export default app;
