//I. Nombres
//II. Estado (Activo o Inactivo)
//III. Fecha de creación
//IV. Fecha de actualización

const { Schema, model } = require("mongoose");

const DirectorSchema = new Schema({
  Nombres: {
    type: String,
    required: [true, "Los nombres de los directores son obligatorios"],
    unique: true,
    trim: true,
    minLength: [2, "Los nombres deben tener mínimo 2 caracteres"],
    maxLength: [50, "Los nombres no pueden exceder los 50 caracteres"]
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
});

// Middleware: actualiza FechaActualizacion en cada modificación
DirectorSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.FechaActualizacion = new Date();
  }
  next();
});

// Método estático para traer directores activos
DirectorSchema.statics.getActivas = function () {
  return this.find({ Estado: "Activo" }).sort({ Nombres: 1 });
};

module.exports = model("Director", DirectorSchema);