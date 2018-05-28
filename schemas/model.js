const Sequelize = require('sequelize');
var crypto = require('crypto');
var md5 = crypto.createHash("md5");
var newPas = md5.update('123qwe').digest("hex");
const sequelize = new Sequelize('networktv', 'root', 'liuze828', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00' //东八时区
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
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    isDelete:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
})

const Comments = sequelize.define('comments',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickName:Sequelize.STRING,
    content:Sequelize.STRING,
    isDelete:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
})


sequelize.sync().then(()=>{
    Users.findOrCreate({
    where:{
        name:'admin',isDelete:0,isAdmin:1
    },
    defaults:{
        nickName:"超级管理员",name: 'admin',password:newPas,isAdmin:1
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