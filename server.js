/* STEP 1 - load external resources*/
//for express
var express = require('express');
var bodyParser = require('body-parser');
var events = require('events');

//for the db
var mongoose = require('mongoose');
var config = require('./config');

//for api
var unirest = require('unirest');

/* STEP 2 - initialize the app*/
var app = express();

// serves static files and uses json bodyparser
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

/* STEP 3 - creating objects and constructors*/
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};


//api call between the server and Yummly api   
var getProducts = function(product_name) {
    
    //console.log("inside the getProducts function");
    
    var emitter = new events.EventEmitter();
    
    //https://www.npmjs.com/package/bestbuy
    var bby = require('bestbuy')('ccw7r1Dxrz9wNwgQuNWLOKqZ');
    bby.products('(search=' + product_name + ')', {pageSize: 10}, function(err, data) {
      if (err) {
          console.warn(err);
          emitter.emit('api call retuned error:', err);
      }
      else if (data.total === 0) {
          console.log('No products found');
          emitter.emit('No products found', err);
      }
      else {
          console.log('Found %d products. First match "%s" is $%d', data.total, data.products[0].name, data.products[0].salePrice);
          emitter.emit('end', data);
      }
    });
    
    return emitter;
};

/* STEP 4 - defining the local api end points*/

//api call between the view and the controller
app.get('/product/:product_name', function(request, response) {
    //console.log(request.params.product_name);
    if (request.params.product_name == "") {
        response.json("Specify a product name");
    }
    else {
        var productDetails = getProducts(request.params.product_name);

        //get the data from the first api call
        productDetails.on('end', function(item) {
            //console.log(item);
            response.json(item);
        });

        //error handling
        productDetails.on('error', function(code) {
            response.sendStatus(code);
        });
    }
});

app.post('/favorite-product', function(req, res) {
    Product.create({
        name: req.body.productName
    }, function(err, products) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(products);
    });
});
app.get('/favorite-products', function(req, res) {
    Product.find(function(err, products) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(products);
    });
});

app.delete('/delete-favorites', function (req, res) {
    Product.remove(req.params.id, function (err, items) {
        if (err)
            return res.status(404).json({
                message: 'Item not found.'
            });

        res.status(200).json(items);
    });
});

/* STEP 6 - start and run the server*/
exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT, process.env.IP);