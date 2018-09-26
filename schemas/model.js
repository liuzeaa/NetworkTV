const Sequelize = require('sequelize');
var crypto = require('crypto');
var md5 = crypto.createHash("md5");
var newPas = md5.update('123qwe').digest("hex");
const sequelize = new Sequelize('networktv', 'root', 'liuze@828', {
  host: '192.168.1.29',
  dialect: 'mysql',
  dialectOptions: {
    charset:'utf8'
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00', //东八时区
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
const Users = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickName:Sequelize.STRING,
    name:Sequelize.STRING,
    password:Sequelize.STRING,
    isAdmin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    isDelete:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})

const Comments = sequelize.define('comments',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickName:Sequelize.STRING,
    content:Sequelize.TEXT,
    isDelete:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})


sequelize.sync().then(()=>{
    Users.findOrCreate({
    where:{
        name:'admin',isDelete:false,isAdmin:true
    },
    defaults:{
        nickName:"超级管理员",name: 'admin',password:newPas,isAdmin:true
    }
}).then(res=>{
    console.log("Res:" + res);
}).catch(err=>{
    console.log("Error:" + err);
})
})
module.exports={
    Users,
    Comments,
    connect:sequelize
}