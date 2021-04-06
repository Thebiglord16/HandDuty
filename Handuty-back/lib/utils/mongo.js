const MongoClient = require('mongodb').MongoClient;
const uri = '';

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