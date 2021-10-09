var mongose = require('mongoose');
var Schema = mongose.Schema;

const useSchema = new Schema({
    title: {
        type: String
    },
    snippet: {
        type: String
    },
    gia_goc: {
        type: String
    },
    gia_moi:{
        type: String
    },
    image: {
        type: String
    },
},{timestaps: true})


const Gift = mongose.model('gift',useSchema);

module.exports = Gift;