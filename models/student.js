var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Basically a factor that play a part in the HASH
// or encrypt function
const SALT_FACTOR = 10;

// The schema of the account info
var studentSchema = new mongoose.Schema({
    studentID:{type:String, required:true, unique:true},
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
        default:"student",
    },
    createAt:{type:String, default:Date.now}
});

// Encrypt the password, or HASH the password
studentSchema.pre("save", function(done) {
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

studentSchema.methods.checkPassword = function(guess, done) {
    // If a password is provided, then check
    if (this.password != null) {
        bcrypt.compare(guess, this.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}

studentSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});

var Student = mongoose.model("User", studentSchema);

module.exports = Student;