const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://HandDutty:HandDutty@cluster0.gd4mv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

function MongoUtils() {
    const mu = {};
    mu.conn = () => {
            const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      });
        return client.connect();
    };
    return mu;
}
module.exports = MongoUtils();