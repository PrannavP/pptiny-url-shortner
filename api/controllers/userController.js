const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateJWTToken = require("../utils/generateJWTTokenHelper");

// Register user
exports.registerUser = async (req, res) => {
    try{
        const { username, email, password, createdFrom, allowUnlimited } = req.body;

        // check existing user by username & email
        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });
        if(userExists){
            return res.status(400).json({ message: "User already exists." });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
            createdFrom,
            allowUnlimited
        });

        res.status(201).json({ message: "User created successfully." });
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

// login
exports.loginUser = async (req, res) => {
    try{
        const { username, password } = req.body;

        // find user
        const user = await User.findOne({ username });
        if(!user){
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: "Invalid credentials." });
        }

        res.json({
            _id: user._id,
            token: generateJWTToken(user._id)
        });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};