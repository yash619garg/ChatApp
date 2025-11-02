import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    email: {
        type: 'string', required: [true, "please provide email"], unique: [true, "user with email already exist"], match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please enter a valid email address"
        ]
    },
    password: { type: 'string', required: [true, "please provide password"] },
    firstName: { type: 'string', required: false },
    lastName: { type: 'string', required: false },
    image: { type: 'string', required: false },
    profileSetup: { type: Boolean, default: false }
})

userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

const user = mongoose.model("User", userSchema);
export default user;