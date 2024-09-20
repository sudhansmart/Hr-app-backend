const Recruiters = require('../models/Recruiters');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function CheckUser(userId) {
    try {
        const user = await Recruiters.findOne({ userId: userId });
        if (user) {
            return user;
        }
        return false;
    } catch (error) {
        return "Server Busy";
    }
}

async function AddRecruiter(name, userId, password, role) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Recruiters({ 
                name,
                userId,
                password: hashedPassword,
                role 
            });
        await user.save();
        return true;
    } catch (error) {
        console.log("error at AddRecruiter : ",error)   
        return false;
    }
}

module.exports = { CheckUser, AddRecruiter};
