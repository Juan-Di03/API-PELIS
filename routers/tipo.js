const { Router } = require("express");
const Tipo = require("../models/Tipo");
const { validationResult, check } = require("express-validator");

const router = Router();

// Crear un nuevo Tipo
router.post(
  "/",
  [
    check("Nombre", "El nombre es obligatorio").not().isEmpty(),
    check("Nombre", "El nombre debe tener al menos 2 caracteres").isLength({ min: 2 }),
    check("Descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("Descripcion", "La descripción debe tener mínimo 2 caracteres").isLength({ min: 2 }),
    check("Estado", "El estado es obligatorio").not().isEmpty(),
    check("Estado", "El estado debe ser Activo o Inactivo").isIn(["Activo", "Inactivo"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const tipo = new Tipo();
      tipo.Nombre = req.body.Nombre;
      tipo.Descripcion = req.body.Descripcion;
      tipo.Estado = req.body.Estado;
      tipo.FechaCreacion = new Date();
      tipo.FechaActualizacion = new Date();

      await tipo.save();
      res.status(201).json(tipo);
    } catch (error) {
      res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
    }
  }
);

// Listar todos los Tipos
router.get("/", async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

module.exports = router;
