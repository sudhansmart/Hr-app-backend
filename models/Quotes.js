const mongoose = require('mongoose');


const quotesSchema = new mongoose.Schema({
    quote: {
        type: String
    },
    author: {
        type: String
    },
}
)

const Quotes= mongoose.model("Quotes", quotesSchema);

module.exports = Quotes;