require('dotenv').config();
const pathInfo = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(pathInfo.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('64844db4ca750bbb8f0c276c')
//     .then(user => {
//       req.user = new User(user.name, user.email , user.cart , user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect(`mongodb+srv://Anirudh:${process.env.PASSWORD}@shop.i3qgdnl.mongodb.net/shop?retryWrites=true&w=majority`)
.then(result =>{
    app.listen(3000);
    console.log("connected")
  })
.catch(err =>{
  console.log(err);
})

