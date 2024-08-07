const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para parsear el body de las requests
app.use(bodyParser.json());

// Ruta para recibir datos via POST y guardarlos en un archivo JSON
app.post('/data', (req, res) => {
  const data = req.body;
  
  fs.readFile('data.json', 'utf8', (err, fileData) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error leyendo el archivo' });
    }

    const jsonData = fileData ? JSON.parse(fileData) : [];
    jsonData.push(data);

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error guardando los datos' });
      }

      res.status(201).json({ message: 'Datos guardados exitosamente' });
    });
  });
});

// Ruta para exponer los datos guardados en el archivo JSON
app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, fileData) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error leyendo el archivo' });
    }

    const jsonData = fileData ? JSON.parse(fileData) : [];
    res.status(200).json(jsonData);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
