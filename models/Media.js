//I. Serial: único
//II. Titulo
//III. Sinopsis
//IV. URL de la película: único
//V. Imagen o foto de portada
//VI. Fecha de creación
//VII. Fecha de actualización
//VIII. Año de estreno
//IX. Género principal: Para agregar la película el sistema permite seleccionar solo géneros activos definidos en el Módulo de Género

const { Schema, model } = require("mongoose");

const MediaSchema = new Schema(
  {
    Serial: {
      type: Number,
      required: [true, "El serial es obligatorio"],
      unique: true,
      min: [1, "El serial debe ser un número positivo"],
      max: [999999, "El serial no puede superar 999999"]
    },
    Titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minLength: [2, "El título debe tener mínimo 2 caracteres"],
      maxLength: [100, "El título no puede exceder los 100 caracteres"]
    },
    Sinopsis: {
      type: String,
      required: [true, "La sinopsis es obligatoria"],
      trim: true,
      maxLength: [1000, "La sinopsis no puede superar los 1000 caracteres"]
    },
    Url: {
      type: String,
      required: [true, "La URL de la película es obligatoria"],
      unique: true,
      match: [/^https?:\/\/.+/, "Debe ser una URL válida"]
    },
    Imagen: {
      type: String,
      match: [/^https?:\/\/.+/, "Debe ser una URL válida para la imagen"]
    },
    AñoEstreno: {
      type: Number,
      required: [true, "El año de estreno es obligatorio"],
      min: [1888, "El cine comenzó en 1888 😅"],
      max: [new Date().getFullYear() + 1, "El año no puede ser mayor al actual"]
    },
    Genero: {
      type: Schema.Types.ObjectId,
      ref: "Genero",
      required: [true, "El género principal es obligatorio"]
    },
    Estado: {
      type: String,
      required: true,
      enum: {
        values: ["Activo", "Inactivo"],
        message: "El estado debe ser Activo o Inactivo"
      },
      default: "Activo"
    },
    FechaCreacion: {
      type: Date,
      default: Date.now
    },
    FechaActualizacion: {
      type: Date
    }
  },
);

// Middleware: actualiza la fecha al modificar
MediaSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.FechaActualizacion = new Date();
  }
  next();
});

// Método estático: obtener películas activas
MediaSchema.statics.getActivas = function () {
  return this.find({ Estado: "Activo" }).sort({ Titulo: 1 });
};

module.exports = model("Media", MediaSchema);
