var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
//TODO: Review https://mongoosejs.com/docs/validation.html

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB, { useNewUrlParser: true } );
mongoose.set('useCreateIndex', true);

const Genre = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller", "Western"];

// Movie schema
var MovieSchema = new Schema({
    title: String,
    yearReleased: Date,
    target: {
        genre: {type: String, enum: Genre}
    },
    actors: [String]
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);