import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    deadline: {
        type: Number,
        required: true,
        default: Math.floor(Date.now() / 1000),
    },
    description: {
        type: String,
        required: true,
    }
})

export default mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);