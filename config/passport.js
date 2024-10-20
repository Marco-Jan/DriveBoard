const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require("../db/querys")
const {verifyPassword} = require("../lib/passportUtils")

const verifyCallback = async (username, password, done) => {
    try {
        const user = await db.getUserCredentials(username);
        console.log(user);
        if(!user) {
            return done(null, false, {message: "Incorrect username"});
        }

        const match = await verifyPassword(password, user.password);
        if(!match) {
            return done(null, false, {message: "Incorrect password"});
        }

        return done(null, user);

    } catch (err) {
        done(err)
    }
}

const strategy = new LocalStrategy(verifyCallback)

passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log("Serializing user with ID:", user.id);
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        console.log("Deserializing user with ID:", id);
        const user = await db.getUserById(id);
        if (!user) {
            console.log("No user found with this ID.");
            return done(null, false);
        }
        console.log("User found:", user);
        done(null, user);
    } catch (err) {
        console.error("Error deserializing user:", err);
        done(err);
    }
});
