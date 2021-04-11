var express = require('express');
var router = express.Router();
const Joi = require("joi");
const reserva = require("../controller/reserva");
const ObjectId = require("mongodb").ObjectID;


const Reserva= require("../controller/reserva");


/* GET users listing. */
router.get('/', function(req, res, next) {
    Reserva.findAll().then((result) => {
        res.send(result);
    });
});

router.get('/:id', function(req, res, next) {
    Reserva.findOne(req.params.id).then((result) => {
        if (result === null)
            return res.status(404).send("Reserva no encontrada");
        res.send(result);
        
    });
});


router.post('/', function(req, res, next) {

    const { error } = validateReserva(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    const { fechaInicio, fechaFin, qr, calificacion, precio, idServicio} = req.body;
    const idServ = ObjectId(idServicio);
    var fechaI= new Date(fechaInicio);
    var fechaF= new Date(fechaFin)
    var n = fechaI.getTimezoneOffset();
    console.log(n)

    validateFecha(idServicio, fechaI, fechaF, res, ()=>{
        Reserva.insertOne({fechaI, fechaF, qr, calificacion, precio, idServ}).then((result) => {
            res.send(result.ops[0]);
        });
    })
});

router.put("/:id", function (req, res, next) {
    Reserva.replaceOne(req.params.id, req.body).then((result) => {
        if (result.modifiedCount === 0)
            return res.status(404).send("Reserva no encontrada.");
        res.send(result.ops[0]);
    });
});
  
router.delete("/:id", function (req, res, next) {
    Reserva.deleteOne(req.params.id).then((result) => {
        if (result.deletedCount === 0)
            return res.status(404).send("Reserva no encontrada.");
        res.status(204).send();
    });
});

const validateReserva = (reserva) => {
    const schema = Joi.object({
      fechaInicio: Joi.date().iso(),
      fechaFin: Joi.date().iso().greater(reserva.fechaInicio),
      qr: Joi.string(),
      calificacion: Joi.number().integer().min(0).max(5),
      precio: Joi.number().integer().min(1000),
      idServicio: Joi.string()
    });
  
    return schema.validate(reserva);
};

const validateFecha = (idService, fechaI, fechaF, res,action) =>{
    Reserva.findByService(idService).then((result) => {
        if (result.length === 0)
            return action()
        for(let i = 0; i<result.length; i++){
            const fechaIComp = result[i].fechaI;
            const fechaFComp = result[i].fechaF;
            
            if(fechaI >= fechaIComp && fechaI <= fechaFComp){
                return res.status(400).send("Fecha ya ocupada");
            }
            if(fechaF >= fechaIComp && fechaF <= fechaFComp){
                return res.status(400).send("Fecha ya ocupada");
            }
        }  
        action()
    });
}

module.exports = router;
