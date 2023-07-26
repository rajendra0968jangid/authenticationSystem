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
  logout =async(params)=>{
    await db.Refresh_token.destroy( {
      where: {
        user_id: params.user_id
      }
    });
    return {message:'You can logout successfully',status:status.Ok}
  }
    login_customer = async (params)=>{

    
    const data =  await db.Users.findOne({where:{user_name:params.phone_number,status:"active"}});
   
    if(data == null){
      return {message:'phone number is not register',status:status.Conflict};
    }
    else{
      const token = await jwt.sign({ id: `${params.phone_number}` }, process.env.Secret,{ expiresIn: '1y' });
        function addOneYear(date) {
          date.setFullYear(date.getFullYear() + 1);
          return date;
        }
      // April 20, 2022
      const date = new Date();
      const newDate = addOneYear(date);
      const refresh = new  db.Refresh_token({user_id:data.id,token:token,types:data.role_code,expires:newDate});
      await refresh.save();

      const login_history = new db.Login_history({user_id:data.id,login_status:'success',state:params.state,city:params.city,country:params.country,ip:params.ip});
      await login_history.save();
      const obj = data;
      const role = await db.Roles.findOne({where:{role_code:data.role_code}});
      const datas = { 'id': obj.id,'name':obj.name,'email':obj.email,'user_name':obj.user_name,'role_code':obj.role_code,'status':obj.status,'createdAt':obj.createdAt,'updatedAt':obj.updatedAt,'destroyTime':obj.destroyTime }
      //console.log(datas);
      return {data:{data:datas,role_id:role},token:token,status:status.Ok};
    }
  }
  // logout =async(params)=>{
  //   await db.Refresh_token.update({ deleted_at:Date.now()}, {
  //     where: {
  //       id: params.id
  //     }
  //   });
  //   return {message:'logout successfully',status:status.Ok}
  // }
    login = async (params)=>{

try{    
    const data =  await db.Users.findOne({where:{email:params.email,status:"active"}});
    //
    await db.Refresh_token.destroy({
      where: {
        user_id: data.id,
      }
    });
    //
    const pass = bcrypt.compareSync(params.password,data.password)
    if(data == null){
      return {message:'email is not register',status:status.Conflict};
    }
    else if(data.email == params.email && pass == true){
      const token = await jwt.sign({ id: `${params.email}` }, process.env.Secret,{ expiresIn: '1y' });
        function addOneYear(date) {
          date.setFullYear(date.getFullYear() + 1);
          return date;
        }
      // April 20, 2022
      const date = new Date();
      const newDate = addOneYear(date);
      const refresh = new  db.Refresh_token({user_id:data.id,token:token,types:data.role_code,expires:newDate});
      await refresh.save();

      const login_history = new db.Login_history({user_id:data.id,login_status:'success',state:params.state,city:params.city,country:params.country,ip:params.ip});
      await login_history.save();

      const role = await db.Roles.findOne({where:{role_code:data.role_code}});
      //const datas = data.map()
      //const datas = await data.dataValues
      const obj = data;
      const datas = { 'id': obj.id,'name':obj.name,'email':obj.email,'user_name':obj.user_name,'role_code':obj.role_code,'status':obj.status,'createdAt':obj.createdAt,'updatedAt':obj.updatedAt,'destroyTime':obj.destroyTime };//obj['id','name'];

      //console.log(datas)
      //return {data:{data:data,role_id:role},token:token,status:status.Ok};
      return {data:data,role:role,token:token,status:status.Ok};
    }
    else{
      return {message:'Email and password is wrong',status:status.Conflict};
    }
  }
  catch(err){
    return{message:'Email and password is wrong',status:status.Conflict};
  }
}
  
  
}

module.exports = users;
