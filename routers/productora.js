//I. Nombre de la productora
//II. Estado (Activo o Inactivo)
//III. Fecha de creación
//IV. Fecha de actualización
//V. Slogan
//VI. Descripción

const { Router } = require("express");
const Productora = require("../models/Productora"); // ✅ modelo correcto
const { validationResult, check } = require("express-validator");

const router = Router();

router.post(
  "/",
  [
    check("NombreProductora", "El nombre de la productora es obligatorio").not().isEmpty(),
    check("NombreProductora", "El nombre debe tener mínimo 2 caracteres").isLength({ min: 2 }),
    check("Estado", "El estado es obligatorio").not().isEmpty(),
    check("Estado", "El estado debe ser Activo o Inactivo").isIn(["Activo", "Inactivo"]),
    check("Slogan", "El slogan es obligatorio").not().isEmpty(),
    check("Slogan", "El slogan debe tener mínimo 2 caracteres").isLength({ min: 2 }),
    check("Descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("Descripcion", "La descripción debe tener mínimo 2 caracteres").isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const productora = new Productora();
      productora.NombreProductora = req.body.NombreProductora;
      productora.Estado = req.body.Estado;
      productora.Slogan = req.body.Slogan;
      productora.Descripcion = req.body.Descripcion;
      productora.FechaCreacion = new Date();
      productora.FechaActualizacion = new Date();

      await productora.save();
      res.status(201).json(productora);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const productoras = await Productora.find();
    res.json(productoras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

module.exports = router;
