const { Router } = require("express");
const Media = require("../models/Media");
const Genero = require("../models/Genero");
const { validationResult, check } = require("express-validator");

const router = Router();

// Crear nueva película
router.post(
  "/",
  [
    check("Serial", "El serial es obligatorio y debe ser un número positivo")
      .isInt({ min: 1 }),
    check("Titulo", "El título es obligatorio y debe tener mínimo 2 caracteres")
      .isLength({ min: 2 }),
    check("Sinopsis", "La sinopsis es obligatoria y máximo 1000 caracteres")
      .isLength({ min: 1, max: 1000 }),
    check("Url", "La URL de la película es obligatoria y debe ser válida")
      .isURL(),
    check("Imagen", "La imagen debe ser una URL válida").optional().isURL(),
    check("AñoEstreno", "El año de estreno es obligatorio")
      .isInt({ min: 1888, max: new Date().getFullYear() + 1 }),
    check("Genero", "El género principal es obligatorio").not().isEmpty(),
    check("Estado", "El estado debe ser Activo o Inactivo")
      .optional()
      .isIn(["Activo", "Inactivo"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      // Validar que el género exista y esté activo
      const genero = await Genero.findById(req.body.Genero);
      if (!genero || genero.Estado !== "Activo") {
        return res.status(400).json({
          msg: "El género seleccionado no existe o no está activo",
        });
      }

      const media = new Media(req.body);
      media.FechaCreacion = new Date();
      media.FechaActualizacion = new Date();

      await media.save();
      res.status(201).json(media);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
    }
  }
);

// Listar todas las películas
router.get("/", async (req, res) => {
  try {
    const medias = await Media.find().populate("Genero", "NombreGenero Estado");
    res.json(medias);
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

// Obtener película por ID
router.get("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate(
      "Genero",
      "NombreGenero Estado"
    );
    if (!media) {
      return res.status(404).json({ msg: "Película no encontrada" });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

// Actualizar película
router.put("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ msg: "Película no encontrada" });
    }

    Object.assign(media, req.body);
    media.FechaActualizacion = new Date();

    await media.save();
    res.json(media);
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

// Eliminar película
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ msg: "Película no encontrada" });
    }
    res.json({ msg: "Película eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "(500) ERROR DEL SERVIDOR :(" });
  }
});

module.exports = router;
