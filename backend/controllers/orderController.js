const Order = require("../models/Order");
const Cart = require("../models/Cart");


// ======================
// CREATE ORDER
// ======================

exports.createOrder = async (req, res) => {

    try {


        const {
            address,
            paymentMethod
        } = req.body;



        if (!address || !paymentMethod) {

            return res.status(400).json({

                message: "Address and payment method required"

            });

        }




        const cart = await Cart.findOne({

            user: req.user.id

        }).populate("items.food");





        if (!cart || cart.items.length === 0) {

            return res.status(400).json({

                message: "Cart is empty"

            });

        }





        let totalAmount = 0;


        const items = cart.items.map(item => {


            totalAmount +=
            item.food.price * item.quantity;



            return {

                food: item.food._id,

                name: item.food.name,

                quantity: item.quantity,

                price: item.food.price

            };


        });







        const order = await Order.create({

            user: req.user.id,

            items,

            totalAmount,

            address,

            paymentMethod,

            status:"Pending"

        });






        // clear cart after order

        await Cart.findOneAndDelete({

            user:req.user.id

        });





        res.status(201).json({

            message:"Order placed successfully",

            order

        });





    } catch(error) {


        res.status(500).json({

            message:error.message

        });

    }

};








// ======================
// GET MY ORDERS
// ======================


exports.getMyOrders = async(req,res)=>{


    try{


        const orders = await Order.find({

            user:req.user.id

        })
        .populate("items.food")
        .sort({
            createdAt:-1
        });




        res.json(orders);



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};








// ======================
// GET ALL ORDERS (ADMIN)
// ======================


exports.getAllOrders = async(req,res)=>{


    try{


        const orders = await Order.find()

        .populate("user","name email")

        .populate("items.food")

        .sort({
            createdAt:-1
        });




        res.json(orders);



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};







// ======================
// UPDATE ORDER STATUS
// ======================


exports.updateOrderStatus = async(req,res)=>{


    try{


        const {
            status
        } = req.body;



        const order =
        await Order.findById(
            req.params.id
        );




        if(!order){


            return res.status(404).json({

                message:"Order not found"

            });

        }





        order.status = status;


        await order.save();





        res.json({

            message:"Order status updated",

            order

        });





    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};








// ======================
// CANCEL ORDER
// ======================


exports.cancelOrder = async(req,res)=>{


    try{


        const order =
        await Order.findById(
            req.params.id
        );



        if(!order){

            return res.status(404).json({

                message:"Order not found"

            });

        }




        order.status = "Cancelled";


        await order.save();




        res.json({

            message:"Order cancelled",

            order

        });





    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};