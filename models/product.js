const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sanitize = require('sanitize-html');  // Ensure you have sanitize-html or a similar library installed


const ProductSchema = new Schema({
    title: String,
    image: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Sanitize the input to remove unwanted HTML tags and attributes
                const sanitized = sanitize(v, {
                    allowedTags: [],  // No HTML tags allowed
                    allowedAttributes: {}  // No HTML attributes allowed
                });
                return sanitized === v;  // Return true if the input remains the same after sanitization
            },
            message: props => `${props.value} is not valid or safe!`
        }
    },
    price: Number,
    description: String,
    location: String,

    seller:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Product', ProductSchema);