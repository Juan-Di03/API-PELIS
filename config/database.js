const mongoose = require("mongoose");

const getConnection = async () => {

    try {

        const url = "mongodb+srv://juandi_db_user:DataJuanDi03@juandi.qkum77l.mongodb.net/?retryWrites=true&w=majority&appName=JuanDi"

        await mongoose.connect (url);

        console.log("ESTAMOS CONECTADOS CON MONGO ATLAS :D")

    } catch (error)    {
        console.log(error);

    }
}
module.exports = {
    getConnection,
}