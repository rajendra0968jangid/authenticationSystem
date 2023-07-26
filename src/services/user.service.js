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

  alluser = async (params) => {
    const data = await userDao.findall(); //await db.User_table.findAll({where:params.email});
    return { data };
  };
  findone = async (params) => {
    const data = await db.Users.findOne({ where: { id: params.user_id } }) //({where:{id:params.id}})
    if (data == null || data == 0) {
      return { message: "user not found", status: status.Conflict }
    }
    else {
      return { data: data, status: status.Ok }
    }
  };
  findbyname = async (params) => {
    const data = await userDao.findbyname(params.phone_number); //({where:{id:params.id}})
    if (data == null || data == 0) {
      return { message: "user not found", status: status.Conflict }
    }
    else {
      return { data: data, status: status.Ok }
    }
  };
  findone_delete = async (params) => {
    var data = await db.Users.destroy(
      {
        where: {
          id: params.user_id,
        },
      }
    ); //destroy({where:{id:params.id}})
    if (data == null || data == 0) {
      return { message: "user not found", status: status.Conflict }
    }
    else {
      return { message: "user deleted successfully", status: status.Ok }
    }

  };
  user_update = async (params, query) => {
    try {
      const detail = await params;
      const user = await db.Users.findOne({ where: { id: query.user_id } }) 
      var pass = await bcrypt.hash(`${detail.password}`, 10);
      var data = await db.Users.update(
        {
          name: (detail.name == undefined)?user.name:detail.name,
          email: (detail.email == undefined)?user.email:detail.email,
          user_name: (detail.phone_number == undefined)?user.phone_number:detail.phone_number,
          otp_verify: (detail.otp_verify == undefined)?user.otp_verify:detail.otp_verify,
          password: (detail.password == undefined)?user.password:pass,
          //pincode: detail.pincode,
          // role_code: rol.role_code,
          status: (detail.status == undefined)?user.status:detail.status,
          //updated_at:Date.now()
        },
        {
          where: {
            id: query.user_id,
          },
        }
      );
      if (data == null || data == 0) {
        return { message: "user not found", status: status.Conflict }
      }
      else {
        return { message: "user updated successfully", status: status.Ok }
      }
    }
    catch (err) {
      return { message: "user id wrong", status: status.Ok }
    }
  };
  signup = async (params) => {
    //var one = 123;
    try {
      const detail = await params;
      const rol = await db.Roles.findOne({
        where: { role_code: detail.role_code },
      });
      const cust1 = await userDao.findbyname(detail.phone_number)
      const cust2 = await db.Users.findOne({ where: { email: detail.email } })
      if (detail.password) {
        var pass = await bcrypt.hash(`${detail.password}`, 10);
      }
      //console.log(detail);
      if (cust1 == null && cust2 == null) {
        const data = new db.Users({
          name: detail.name,
          email: detail.email,
          user_name: detail.phone_number,
          otp_verify: detail.otp_verify,
          password: pass,
          //pincode: detail.pincode,
          role_code: rol.role_code,
          status: detail.status,
        });
        await data.save();
        return { data: data, message: "successfully signup", status: status.Created };
      } else {
        return { message: "phone number and email is already exists", status: status.Conflict };
      }
    }
    catch {
      return { message: "role not found ", status: status.Conflict }
    }
    //}
  };

  check_phone_no = async (params) => {
    try {
      const data = await db.Users.findOne({ where: { user_name: params.user_name } })
      if (data.user_name == params.user_name) {
        return { message: "Phone Number Already Exist", status: status.Ok }
      }
    } catch {
      return { message: "Phone Number Not Registered", status: status.Conflict }
    }
  }

}

module.exports = users;
