const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');

const User = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    cart : {
        items: [
            {
                productId : { type : Schema.Types.ObjectId , required : true},
                quantity : { type : Number , required : true}
            }
        ]
    }
});

User.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
              return cp.productId.toString() === product._id.toString();
            });
            let newQuantity = 1;
            const updatedCartItems = [...this.cart.items];
        
            if(cartProductIndex >=0){
              newQuantity = this.cart.items[cartProductIndex].quantity + 1;
              updatedCartItems[cartProductIndex].quantity = newQuantity;
            }
            else{
              updatedCartItems.push({productId : product._id , quantity : newQuantity})
            }
            const updatedCart = {
                items : updatedCartItems
            }
            this.cart = updatedCart;

            return this.save();
}

User.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item =>{
        return item.productId.toString() !== productId.toString()
    });

    this.cart.items = updatedCartItems;
    return this.save();
}


module.exports = mongoose.model('User',User);

// class User {
//   constructor(name, email ,cart , id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; // {items : []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   addToCart(product){
//     const cartProductIndex = this.cart.items.findIndex(cp =>{
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if(cartProductIndex >=0){
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     }
//     else{
//       updatedCartItems.push({productId : new ObjectId(product._id) , quantity : newQuantity})
//     }
     
//     const updatedCart = {items:updatedCartItems};
//     const db = getDb();
//     db.collection('users').updateOne({_id : new ObjectId(this._id)} , {$set : {cart : updatedCart}});

//   }

//   getCart(){
//     const db = getDb();
//     const productIds = this.cart.items.map(i =>{
//       return i.productId;
//     })
//     return db.collection('products').find({_id: {$in : productIds}})
//     .toArray()
//     .then(products =>{
//       return products.map(p =>{
//         return {...p , quantity : this.cart.items.find(i =>{
//           return i.productId.toString() === p._id.toString();
//         }).quantity
//       }
//       })
//     });
//   }

// deleteItem(productId){
//   const db = getDb();
//   const updatedCartItems = this.cart.items.filter(item =>{
//     return item.productId.toString() !== productId.toString();
//   })
//   return db
//   .collection('users')
//   .updateOne(
//     {_id : new ObjectId(this._id)},
//     {$set : {cart : {items : updatedCartItems}}}
//   );
// }

// addOrder(){
//   const db = getDb();
//   return this.getCart()
//   .then(products =>{
//     console.log(products)
//     const order ={
//       items : products,
//       user :{
//         _id : new ObjectId(this._id),
//         name : this.name,
//       }
//     };
//     return db
//     .collection('orders')
//     .insertOne(order);
//   })
//   .then(result => {
//     this.cart = { items : []}
//     return db.collection('users')
//     .updateOne(
//       { _id : new ObjectId(this._id)},
//       { $set : { cart: { items : [] }}}
//     );
//   });
// }

// getOrders(){
//   const db = getDb();
//   return db
//   .collection('orders')
//   .find({'user._id': new ObjectId(this._id)})
//   .toArray();
// }


//   static findById(userId) {
//     console.log(userId)
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }


// module.exports = User;
