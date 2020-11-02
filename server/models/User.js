const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role: { // 관리자, 참가자 구분
        type: Number,
        default: 0
    },
    image:{
        type : String,
        default: ""
    },
    token: {    // 유효성
        type: String
    },
    tokenExp: { // 토큰 유효기간
        type: Number
    }
})

// 저장하기 전에 한다.
userSchema.pre('save', function (next){
    var user = this;
    //비밀번호를 바꿀때만 암호화 해준다.
    if(user.isModified('password')){
        // 비밀번호를 암호화 한다.
        
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            
            // myPlaintextPassword: 순수 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                // store hash in your password DB.
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword 1234567 (기존 비밀번호를 암호화해서 비교)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebToken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err,user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}