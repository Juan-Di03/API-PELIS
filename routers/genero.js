const { Router } = require("express");
const Genero = require("../models/Genero");
const { validationResult, check } = require("express-validator");

const router = Router();

router.post(
  "/",
  [
    check("NombreGenero", "El nombre del género es obligatorio").not().isEmpty(),
    check("NombreGenero", "El género debe tener mínimo 2 caracteres").isLength({ min: 2 }),
    check("Estado", "El estado es obligatorio").not().isEmpty(),
    check("Estado", "El estado debe ser Activo o Inactivo").isIn(["Activo", "Inactivo"]),
    check("Descripcion", "La descripción del género es obligatoria").not().isEmpty(),
    check("Descripcion", "La descripción debe tener mínimo 2 caracteres").isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const genero = new Genero();
      genero.NombreGenero = req.body.NombreGenero;
      genero.Estado = req.body.Estado;
      genero.Descripcion = req.body.Descripcion;
      genero.FechaCreacion = new Date();
      genero.FechaActualizacion = new Date();

      await genero.save();
      res.status(201).json(genero);
    } catch (error) {
      res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const generos = await Genero.find();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

module.exports = router;