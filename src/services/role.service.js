const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op, where } = require("sequelize");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");
const userda = require("../dao/userdao");
const status = require('../../_middleware/error-handler');
//
// const createToken = async(req,res,one)=>{
//     const token =
//     console.log(one);
//     return token;
// }
//
const userDao = new userda();
class users {
  
  role = async (params) => {
    const data = new db.Roles({
      role_name: params.role_name,
      role_code: params.role_code,
    });
    await data.save();
    return{message:"role created"};
  };

  // data =  await db.Users.findOne({where:{email:params.email,status:"active"}});

  getRoleByRoleCode = async(params)=>{
    const data =  await db.Roles.findOne({where:{role_code:params.role_code}})
    return data
  }
   token_verify= async(params)=>{
    const data =  await db.Refresh_token.findOne({where:{token:params,destroyTime:null}})
    if(data){
      return  {result:true};
    }
    else{
      return {result:false};
    }
    //return data;
  }
   
}

module.exports = users;
