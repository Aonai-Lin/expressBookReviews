const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // extract all the user with that name
  let userwithsamename = users.filter(user=>user.username===username);
  if(userwithsamename.length>0){
    return false;   // name already exist, so not valid
  }else{
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // filter users with the same name and password, if exist, it is authenticated
  let validusers = users.filter(user=>user.username===username && user.password===password);
  if(validusers.length>0){
    return true;  // if there is such a user in the users, it is authenticated
  }else{
    return false;
  }


}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // extract username and password in req
  const username = req.body.username;
  const password = req.body.password;
  // if either is empty, raise error
  if(!username || !password){
    res.status(404).send("Empty username or password, please check");
  }
  // to authenticate user, if true, generate a token for the req
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({date: password}, 'access', {expiresIn: 60*60});
    req.session.authorization = {accessToken, username};
    return res.status(200).send(`User ${username} login successfully!`);
  }else{
    return res.status(404).send("Not authenticated user, please register first!");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // get the username from session, the isbn from request param and the context from request query
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  const review  = req.query.review;
  // find the target book and update/add the review
  books[isbn]["reviews"][username] = review;
  // console.log(books);
  return res.status(200).send(`User ${username} 's review updated successfully!`);
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  // get thr username from session, the isbn from request param
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  // console.log("username: "+username+", isbn: "+isbn)

  // find the target book and delete the user's review
  const targetbook = books[isbn];
  delete targetbook["reviews"][username];
  return res.status(200).send("The target review was deleted");

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


/*
确认对象是否有某属性：
  1、'propertyName' in object
  2、object.hasOwnProperty('propertyName')
  3、if (object.propertyName !== undefined) {
      // 属性存在，但这种方式会无法区分属性不存在与属性值为 undefined 的情况。
    }

新增属性/修改属性都用“.”或者"[]"
删除属性：delete object.property或delete object["property"]
*/