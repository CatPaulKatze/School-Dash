import mongoose from "mongoose";

const examsSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    day: {
        type: Number,
        required: true,
        default: Math.floor(Date.now() / 1000),
    },
    description: {
        type: String,
        required: true,
        default: ""
    }
})

export default mongoose.models.Exams || mongoose.model("Exams", examsSchema);