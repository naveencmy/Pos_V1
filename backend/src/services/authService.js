const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRepo = require('../repositories/userRepository')
const env = require('../config/env')

exports.login = async(username,password)=>{
  const user = await userRepo.findByUsername(username)
  if(!user) throw new Error("Invalid credentials")
  const valid = await bcrypt.compare(password,user.password_hash)
  if(!valid) throw new Error("Invalid credentials")
  const token = jwt.sign(
    {id:user.id,role:user.role},
    env.JWT_SECRET,
    {expiresIn:"12h"}
  )
  return {token,id:user.id,username:user.username,role:user.role}

}