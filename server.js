const fs = require("fs");
const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
//obtener listado de canciones
app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"));
  res.json(canciones);
});
//agregar nueva cancion
app.post("/canciones", (req, res) => {
  const data = fs.readFileSync("canciones.json", "utf-8");
  const canciones = JSON.parse(data);
  const nuevaCancion = { id: Date.now(), ...req.body };
  canciones.push(nuevaCancion);
  fs.writeFileSync("canciones.json", JSON.stringify(canciones, null, 2));
  res.json({ message: "Canción agregada exitosamente", data: nuevaCancion });
});
//eliminar cancion
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("canciones.json", "utf-8");
  let canciones = JSON.parse(data);
  canciones = canciones.filter((cancion) => cancion.id != parseInt(id));
  fs.writeFileSync("canciones.json", JSON.stringify(canciones, null, 2));
  res.json({ message: "Cancion eliminada exitosamente" });
});
//actualizar cancion
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const nuevaData = req.body; // datos enviados en el body
  // Leer archivo
  const data = fs.readFileSync("canciones.json", "utf-8");
  let canciones = JSON.parse(data);
  // Buscar índice de la canción
  const index = canciones.findIndex(cancion => cancion.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: "Canción no encontrada" });
  }
  // Actualizar canción
  canciones[index] = { ...canciones[index], ...nuevaData };
  // Guardar cambios
  fs.writeFileSync("canciones.json", JSON.stringify(canciones, null, 2));
  res.json({ message: "Canción actualizada exitosamente", cancion: canciones[index] });
});
