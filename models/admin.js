var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Basically a factor that play a part in the HASH
// or encrypt function
const SALT_FACTOR = 10;

// The schema of the account info
var adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    adminID:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    fullname:{
         firstname:{
             type:String, required:true
         },
         lastname:{
             type:String, required:true
         }
     },
     birthday: {
         type:String,
         required: true
     },
     gender: {
         type: String,
         enum: ["male", "female"],
         required:true
     },
     phoneNumber:{
         type:String,
         required:true
     },
     accountType:{
         type:String,
         default:"admin",
     },
    createAt:{type:String, default:Date.now}
});

// Encrypt the password, or HASH the password
adminSchema.pre("save", function(done) {
    var user = this;

    if (!user.isModified("password")) {
        return done(); 
        // If there is not any change in the password field, 
        // while bother encrypt it again?
    }

    bcrypt.genSalt(SALT_FACTOR, function(err,salt){
        if (err) {return done(err);}
        bcrypt.hash(user.password, salt, function(err, hasedPassword) {
            if (err) {return done(err);}

            user.password = hasedPassword;

            done();
        });
    });
});

adminSchema.methods.checkPassword = function(guess, done) {
    // If a password is provided, then check
    if (this.password != null) {
        bcrypt.compare(guess, this.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}

adminSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});

var Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;