const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  // extract username and password in req body
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).send("Invalid username or password!");
  }

  if(isValid(username)){
    users.push({"username":username, "password":password});
    return res.status(200).send( `User ${username} successfully registered. Now you can login`);
  }else{
    return res.status(404).send("Username already existed!")
  }
});

// Get the book list available in the shop
// sync：
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });
// async：
public_users.get('/',function (req, res) {
  // assume that we need to fetch the books from 'https://example.com/api/books'
  axios.get('https://example.com/api/books')
  .then(response=>{
    res.send(JSON.stringify(response.data, null, 4)); 
  }).catch(err=>{
    res.status(500).send('Error fetching books');
  });

});

// Get book details based on ISBN
// sync
// public_users.get('/isbn/:isbn',function (req, res) {
//   // extract the isbn param
//   const isbn = req.params.isbn;
//   const targetBook = books[isbn];
//   return res.send(JSON.stringify(targetBook, null, 4));

//  });
 // async
 public_users.get('/isbn/:isbn',function (req, res) {
  // assume that we need to fetch the books from 'https://example.com/api/books'
  axios.get('https://example.com/api/books')
  .then(response=>{
    let books = response.data;
    const isbn = req.params.isbn;
    const targetBook = books[isbn];
    return res.send(JSON.stringify(targetBook, null, 4));
  }).catch(err=>{
    res.status(500).send('Error fetching books');
  })
 });



  
// Get book details based on author
// sync
// public_users.get('/author/:author',function (req, res) {
//   // extract the author params and create a booklist for return
//   const author = req.params.author;
//   let booklist = [];
//   // iterate the books object and collect books with the matched author
//   for (let i in books){
//     if(books[i].author===author){
//       booklist.push(books[i]);
//     }
//   }
//   if(booklist.length>0){
//     return res.send(JSON.stringify(booklist, null, 4));
//   }else{
//     return res.status(403).json({message:"not such a author"});
//   }
// });
// async
// assume that we need to fetch the books from 'https://example.com/api/books'
public_users.get('/author/:author', async function (req, res) {
  try{
    const response = await axios.get('https://example.com/api/books');
    const books = response.data;
    // process the data
    const author = req.params.author;
    let booklist = [];
    // iterate the books object and collect books with the matched author
    for (let i in books){
      if(books[i].author===author){
        booklist.push(books[i]);
      }
    }
    if(booklist.length>0){
      return res.send(JSON.stringify(booklist, null, 4));
    }else{
      return res.status(403).json({message:"not such a author"});
    }
  }catch (error){
      res.status(500).send('Error fetching books');
  }
});


// Get all books based on title
// sync
// public_users.get('/title/:title',function (req, res) {
//   // extract the title params and create a booklist for return
//   const title = req.params.title;
//   let booklist = [];
//   // iteater books and collect books with the matched title
//   for (let i in books){
//     if(books[i].title===title){
//       booklist.push(books[i]);
//     }
//   }
//   if(booklist.length>0){
//     return res.send(JSON.stringify(booklist, null, 4));
//   }else{
//     return res.status(403).json({message: "not such a title"});
//   }
// });
// async
// assume that we need to fetch the books from 'https://example.com/api/books'
public_users.get('/title/:title', async function (req, res) {
  try{
    // fetch the books
    const response = await axios.get('https://example.com/api/books');
    const books = response.data;
    // process data
    // extract the title params and create a booklist for return
    const title = req.params.title;
    let booklist = [];
    // iteater books and collect books with the matched title
    for (let i in books){
      if(books[i].title===title){
        booklist.push(books[i]);
      }
    }
    if(booklist.length>0){
      return res.send(JSON.stringify(booklist, null, 4));
    }else{
      return res.status(403).json({message: "not such a title"});
    }
  }catch(error){
    res.status(500).send('Error fetching books');
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // extract the isbn from params
  const isbn = req.params.isbn;
  // get the target book base on isbn and get the review
  const review = books[isbn].review;
  res.send(review);
});


module.exports.general = public_users;
