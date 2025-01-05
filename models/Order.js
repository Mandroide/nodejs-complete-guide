const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        items: [
            {
                product: {
                    type: Object,
                    required: true,
                },
                quantity: {
                    type: Number,
                }
            }
        ],
        user: {
            email: {
                type: String,
                required: true,
            },
            userId: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('Order', schema);