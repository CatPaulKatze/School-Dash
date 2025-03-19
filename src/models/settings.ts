import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    settings: {
        ntfy: {
            type: Boolean,
            required: true,
        },
        lesson: {
            type: Boolean,
            required: true,
        },
        hwreminder: {
            type: Boolean,
            required: true,
        },
        examreminder: {
            type: Boolean,
            required: true,
        }
    }
})

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);