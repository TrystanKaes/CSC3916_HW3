var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
//TODO: Review https://mongoosejs.com/docs/validation.html

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB, { useNewUrlParser: true } );
mongoose.set('useCreateIndex', true);

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, unique: true },
    yearReleased: {type: Date, required: true},
    genre: {
        type: String,
        required: true,
        enum: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller", "Western"]
    },
    actors: {type: [String], required: true, validate: [arrayLimit, '{PATH} array must be of size 3']}
});

function arrayLimit(val) {
    return val.length == 3;
}

// MovieSchema.pre('save', function(next) {
//     var movie = this;
//
//     if (!movie.isModified('title')) return next();
//
//     next();
// });

// return the model
module.exports = mongoose.model('Movie', MovieSchema);