const {Router} = require("express");
const Director = require("../models/Director");
const {validationResult, check} = require("express-validator");

const router = Router();


router.post(
  "/",
  [
    check("Nombres", "Los nombres son obligatorios").not().isEmpty(),
    check("Nombres", "El nombre debe tener al menos 2 caracteres").isLength({ min: 2 }),
    check("Estado", "El estado es obligatorio").not().isEmpty(),
    check("Estado", "El estado debe ser Activo o Inactivo").isIn(["Activo", "Inactivo"]),
  ],
  async (req, res) => {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const director = new Director();
      director.Nombres = req.body.Nombres;
      director.Estado = req.body.Estado;
      director.FechaCreacion = new Date(),
      director.FechaActualizacion =new Date();

      await director.save();
      res.status(201).json(director);
    } catch (error) {
      res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
    }
  }
);

router.get("/", async(req, res) => {
    try{
        const directores = await Director.find();
        res.json(directores);
    } catch (error) {
        res.status(500).json({msg: "(500) ERROR DEL SERVIDOR :("})
    }

})

module.exports = router;