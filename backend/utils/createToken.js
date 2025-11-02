import jwt from "jsonwebtoken"
// import cookies from "cookie-parser"

export const createToken = async (userID, res) => {
    const token = jwt.sign({ userID }, process.env.SECRET_KEY, { expiresIn: "30d" });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        Domain: "http://localhost:5173"
    });
    return token;

}