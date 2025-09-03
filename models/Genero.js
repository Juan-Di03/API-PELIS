//I. Nombre
//II. Estado (Activo o Inactivo)
//III. Fecha creación
//IV. Fecha actualización
//V. Descripción
const { Schema, model } = require("mongoose");

const GeneroSchema = new Schema({
  NombreGenero: {
    type: String,
    required: [true, "El nombre del género es obligatorio"],
    unique: true,
    trim: true,
    minLength: [2, "El género debe tener mínimo 2 caracteres"],
    maxLength: [20, "El género no puede exceder los 20 caracteres"]
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
  FechaFin: {
    type: Date,
    default: Date.now
  },
  FechaActualizacion: {
    type: Date
  },
  Descripcion: {
    type: String,
    required: [true, "La descripción del género es obligatoria"],
    trim: true,
    minLength: [2, "La descripción debe tener mínimo 2 caracteres"],
    maxLength: [200, "La descripción no puede exceder los 200 caracteres"]
  }
});

// Middleware para actualizar la fecha
GeneroSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.FechaActualizacion = new Date();
  }
  next();
});

// Método estático para traer géneros activos
GeneroSchema.statics.getActivas = function () {
  return this.find({ Estado: "Activo" }).sort({ NombreGenero: 1 });
};

module.exports = model("Genero", GeneroSchema);