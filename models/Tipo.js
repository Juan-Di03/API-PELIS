//I. Nombre
//II. Fecha de creación
//III. Fecha de actualización
//IV. Descripción

const { Schema, model } = require("mongoose");

const tipoSchema = new Schema({
  Nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
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
  Descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    trim: true,
    minLength: [2, "La descripción debe tener mínimo 2 caracteres"],
    maxLength: [200, "La descripción no puede exceder los 200 caracteres"]
  }
});

// Middleware: actualiza FechaActualizacion en cada modificación
tipoSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.FechaActualizacion = new Date();
  }
  next();
});

tipoSchema.pre("findOneAndUpdate", function (next) {
  this.set({ FechaActualizacion: new Date() });
  next();
});

// Método estático para traer tipos activos
tipoSchema.statics.getActivas = function () {
  return this.find({ Estado: "Activo" }).sort({ Nombre: 1 });
};

module.exports = model("Tipo", tipoSchema);