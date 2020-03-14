var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
//TODO: Review https://mongoosejs.com/docs/validation.html

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB, { useNewUrlParser: true } );
mongoose.set('useCreateIndex', true);

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: { unique: true }},
    yearReleased: {type: Date, required: true},
    genre: {
        type: String,
        enum: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller", "Western"]
        required: true
    },
    actors: {type: [String], required: true}
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);