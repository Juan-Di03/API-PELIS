//I. Nombre de la productora
//II. Estado (Activo o Inactivo)
//III. Fecha de creación
//IV. Fecha de actualización
//V. Slogan
//VI. Descripción

const { Schema, model } = require("mongoose");

const productoraSchema = new Schema({
  NombreProductora: {
    type: String,
    required: [true, "El nombre de la productora es obligatorio"],
    unique: true,
    trim: true,
    minLength: [2, "El nombre debe tener mínimo 2 caracteres"],
    maxLength: [50, "El nombre no puede exceder los 50 caracteres"]
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
  },
  Slogan: {
    type: String,
    required: [true, "El slogan es obligatorio"],
    trim: true,
    minLength: [2, "El slogan debe tener mínimo 2 caracteres"],
    maxLength: [100, "El slogan no puede exceder los 100 caracteres"]
  },
  Descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    trim: true,
    minLength: [2, "La descripción debe tener mínimo 2 caracteres"],
    maxLength: [200, "La descripción no puede exceder los 200 caracteres"]
  }
});

// Middleware: actualiza FechaActualizacion en cada modificación
productoraSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.FechaActualizacion = new Date();
  }
  next();
});

// Método estático para traer directores activos
productoraSchema.statics.getActivas = function () {
  return this.find({ Estado: "Activo" }).sort({ NombreProductora: 1 });
};

module.exports = model("Productora", productoraSchema);