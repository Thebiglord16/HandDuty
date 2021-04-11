const client = require("../lib/utils/mongo");
const ObjectId = require("mongodb").ObjectID;

function Reserva(){
    const reserva = {};

    const connection = client.conn()
    .then((result) => result.db('Handuty').collection('Reservas'));

    reserva.findAll = () => {
        return connection.then((c) => c.find({}).toArray());
    };

    reserva.findOne = (id) => {
        return connection.then((c) => c.findOne({ _id: ObjectId(id) }));
    }

    reserva.findByService = (idService) => {
        return connection.then((c) => c.find({idServ: ObjectId(idService)}).toArray());
    }

    reserva.insertOne = (data) => {
        return connection.then((c) => c.insertOne(data));
    };

    reserva.replaceOne = (id, data) => {
        return connection.then((c) => c.replaceOne({ _id: ObjectId(id) }, data));
    };
    
    reserva.deleteOne = (id) => {
        return connection.then((c) => c.deleteOne({ _id: ObjectId(id) }));
    };

    return reserva;
}

module.exports = Reserva();