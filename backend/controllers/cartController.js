const Cart = require("../models/Cart");
const Food = require("../models/Food");


// ADD TO CART
exports.addToCart = async (req, res) => {

    try {

        const { foodId, quantity } = req.body;


        if (!foodId || !quantity) {

            return res.status(400).json({
                message: "Food and quantity required"
            });

        }


        const food = await Food.findById(foodId);


        if (!food) {

            return res.status(404).json({
                message: "Food not found"
            });

        }



        let cart = await Cart.findOne({
            user: req.user.id
        });



        if (!cart) {

            cart = new Cart({

                user: req.user.id,

                items: []

            });

        }



        const item = cart.items.find(
            i => i.food.toString() === foodId
        );



        if (item) {

            item.quantity += Number(quantity);

        } else {


            cart.items.push({

                food: foodId,

                quantity: Number(quantity),

                price: food.price

            });

        }



        await cart.save();



        res.json({

            message: "Added to cart",

            cart

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });

    }

};






// GET CART

exports.getCart = async (req,res)=>{


    try{


        const cart = await Cart.findOne({

            user:req.user.id

        })
        .populate("items.food");



        res.json(cart || {items:[]});



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};







// REMOVE ITEM

exports.removeFromCart = async(req,res)=>{


    try{


        const cart = await Cart.findOne({

            user:req.user.id

        });



        cart.items = cart.items.filter(

            item =>
            item.food.toString()
            !== req.params.foodId

        );



        await cart.save();



        res.json({

            message:"Item removed",

            cart

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};







// CLEAR CART

exports.clearCart = async(req,res)=>{


    try{


        await Cart.findOneAndDelete({

            user:req.user.id

        });



        res.json({

            message:"Cart cleared"

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};