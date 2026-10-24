const Order = require("../models/Order");


// ======================
// CREATE PAYMENT
// ======================

exports.createPayment = async (req, res) => {

    try {

        const {
            orderId,
            paymentMethod
        } = req.body;



        if (!orderId || !paymentMethod) {

            return res.status(400).json({

                message: "Order and payment method required"

            });

        }




        const order = await Order.findById(orderId);



        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }





        order.paymentMethod = paymentMethod;


        if (paymentMethod === "COD") {

            order.paymentStatus = "Pending";

        } else {

            // online payment demo
            order.paymentStatus = "Paid";

        }



        await order.save();




        res.json({

            message: "Payment successful",

            order

        });





    } catch (error) {


        res.status(500).json({

            message: error.message

        });

    }

};








// ======================
// GET PAYMENT STATUS
// ======================

exports.getPaymentStatus = async (req, res) => {


    try {


        const order = await Order.findById(
            req.params.id
        );



        if (!order) {

            return res.status(404).json({

                message:"Order not found"

            });

        }



        res.json({

            orderId: order._id,

            paymentMethod:
            order.paymentMethod,


            paymentStatus:
            order.paymentStatus

        });



    } catch(error) {


        res.status(500).json({

            message:error.message

        });

    }

};








// ======================
// REFUND PAYMENT
// ======================

exports.refundPayment = async (req,res)=>{


    try{


        const order = await Order.findById(
            req.params.id
        );



        if(!order){

            return res.status(404).json({

                message:"Order not found"

            });

        }



        order.paymentStatus = "Refunded";


        await order.save();




        res.json({

            message:"Refund completed",

            order

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};