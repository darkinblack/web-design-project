var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');

var monk = require('monk');
var db = monk('localhost:27017/restaurant');

var multer  = require('multer')
var upload = multer({ dest: 'public/images/' })

// user signup, login, logout
router.get('/', function (req, res) {
  var collection = db.get('dishes');
  collection.find({ isDeleted: false }, function(err, dishes){
    if (err) throw err;
    res.render('index', { dishes: dishes, user: req.user });
  });
});

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', { account : account });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/existeduser', function(req, res) {
  var collection = db.get('accounts');
  collection.findOne({ username: req.query.username }, function(err, account){
    if (err) throw err;
    res.send(account == null);
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// list/filter dishes yzc
router.get('/dishes', function(req, res) {
  var collection = db.get('dishes');
  collection.find({ name: {$regex: '.*' + req.query.name + '.*', $options: '$i'}, category: {$regex: '.*' + req.query.category + '.*', $options: '$i'}, isDeleted: false }, function(err, dishes){
    if (err) throw err;
    res.render('index', { dishes: dishes, user: req.user });
  });
});

// admin routes yzc
// new dish (path)
router.get('/dishes/new', function(req, res) {
  if(!req.user || req.user.username != 'admin') {
    res.redirect('/');
  }
  res.render('new');
});

// insert route
router.post('/dishes', upload.single('image'), function(req, res) {
  if(!req.user || req.user.username != 'admin') {
    res.redirect('/');
  }
  var collection = db.get('dishes');
  collection.insert({
    name: req.body.name,
    category: req.body.category,
    image: req.file.filename,
    price: req.body.price,
    inventory: req.body.inventory,
    isDeleted: false
  }, function(err, dish){
    if (err) throw err;

    res.redirect('/');
  });
});

// dish detail page
router.get('/dishes/:id', function(req, res) {
  var collection = db.get('dishes');
  collection.findOne({ _id: req.params.id}, function(err, dish){
    if (err) throw err;
    if (dish.isDeleted == true) {
      res.redirect('/');
    }
    res.render('show', { dish: dish, user: req.user });
  });
});

// edit page
router.get('/dishes/:id/edit', function(req, res) {
  if(!req.user || req.user.username != 'admin') {
    res.redirect('/dishes/' + req.params.id);
  }
  var collection = db.get('dishes');
  collection.findOne({ _id: req.params.id}, function(err, dish){
    if (err) throw err;
    if (dish.isDeleted == true) {
      res.redirect('/dishes/');
    }
    res.render('edit', { dish: dish });
  });
});

// update route
router.put('/dishes/:id', upload.single('image'), function(req, res){
  if(!req.user || req.user.username != 'admin') {
    res.redirect('/');
  }
  var collection = db.get('dishes');
  collection.findOneAndUpdate({ _id: req.params.id },
    { $set:
      {
        name: req.body.name,
        category: req.body.category,
        image: req.file.filename,
        price: req.body.price,
        inventory: req.body.inventory
      }
    }).then((updatedDoc) => {});
  res.redirect('/');
});

// delete route
router.delete('/dishes/:id', function(req, res){
  if(!req.user || req.user.username != 'admin') {
    res.redirect('/');
  }
  var collection = db.get('dishes');
  collection.findOneAndUpdate({ _id: req.params.id },
    { $set:
      {
        isDeleted: true
      }
    }).then((updatedDoc) => {});
  res.redirect('/');
});

// DYQ user route
router.get('/cart', function(req, res) {
  var collection = db.get('accounts');
  var collection2 = db.get("dishes");
  var cart = [];
  var dishesInCart = [];
  var totalprice = 0;
  collection.findOne({ "username": req.user.username }, function(account){
    if(account.cart == null) cart = account.cart;
  });
  res.render('cart', {dishes: dishesInCart, user: req.user, totalprice: totalprice});
});

//DYQ
router.get('/history', function(req, res){
  var collection = db.get('accounts');
  var orders = [];
  collection.find({}, function(err, accounts){
    if (err) throw err;
    accounts.forEach(function(account){ 
      if(req.user && req.user.username == account.username){
        orders = account.orders;
      }  
    });
  });
  res.render('history', {orders: orders, user: req.user});
});
//


router.get('/checkout', function(req, res){
  var collection = db.get('accounts');
  var collection2 = db.get("dishes");
  var cart = [];
  var orders = [];
  collection.find({}, function(err, accounts){
    if (err) throw err;
    accounts.forEach(function(account){ 
      if(req.user && req.user.username == account.username){
        cart = account.cart;
      }  
    });
  });
  collection2.find({}, function(err, dishes){
    if (err) throw err;
    dishes.forEach(function(dish){ 
      if(cart.includes(dish.dishNo)){
        db.get('accounts').update(
            { "username": req.user.username },
            { "$push": 
                {"orders": 
                    {
                        "orderItems": {
                          "dishNo": dish.dishNo,
                          "quantity": cart.quantity,
                          "expectedShipDate": Date.now,
                          "actualShipDate": Date.now
                        }
                    }
                }
            }
        );
      } 
    });
  });
  var collection = db.get('dishes');
  collection.find({}, function(err, dishes){
    if (err) throw err;
    res.render('index', { dishes: dishes, user: req.user });
  });
});

router.post('/cart', function(req, res){
  if(!req.user) redirect('/');
  var dishNo = req.body.dishNo;
  var quantity = Number(req.body.quantity);
  var oldQuantity = 0;
  var inventory = 0;
  var username = req.user.username;



  db.get('dishes').findOne({ "_id": dishNo }, function(err, dish){
    if (err) throw err;
    
    //get inventory
    inventory = Number(dish.inventory);
    db.get('accounts').findOne({ "username": username }, function(err, account){
      if(err) throw err;
      
      account.cart.forEach(function(item){
        //get oldQuantity
        if(item.dishNo == dishNo) oldQuantity += Number(item.quantity);
      });
      if(quantity + oldQuantity > inventory) res.redirect('/');
      //insert new dish in cart
      db.get('accounts').update({ "username": username }, {
        "$push":{
          "cart":{
            "dishNo": dishNo,
            "quantity": quantity
          }
        }
      });
      
      //update inventory
      inventory -= quantity;
      db.get('dishes').update({ "_id": dishNo }, {
        "$set":{ "inventory": inventory }
      });
      res.redirect('/');
    });
  });

  
});
  

module.exports = router;
