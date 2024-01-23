const jwt = require("jsonwebtoken");
const express = require("express");

const app = express();
const cors = require("cors");
const {
  getEventos,
  deleteEvento,
  verificarCredenciales,
  modificarevento,
} = require("./consultas");

app.listen(3000, console.log("SERVER ON"));
app.use(cors());
app.use(express.json());

app.get("/eventos", async (req, res) => {
  try {
    const eventos = await getEventos();
    res.json(eventos);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.delete("/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, "az_AZ");
    const { email } = jwt.decode(token);
    await deleteEvento(id);
    res.send(`El usuario ${email} ha eliminado el evento de id ${id}`);
    console.log(token);
    console.log(id);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.put("/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, lugar } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, "az_AZ");
    const { email } = jwt.decode(token);

    await modificarevento(id, titulo, descripcion, fecha, lugar, token);

    res.status(200).send("Evento modificado correctamente" );
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});
