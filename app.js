const express = require("express");
const cors = require("cors");
const { getConnection } = require("./config/database");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
getConnection();

// Rutas (aquí integras TODO)
app.use("/api/director", require("./routers/director"));
app.use("/api/genero", require("./routers/genero"));
app.use("/api/productora", require("./routers/productora"));
app.use("/api/media", require("./routers/media"));
app.use("/api/tipo", require("./routers/tipo"));

module.exports = app;