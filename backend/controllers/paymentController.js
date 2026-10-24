const Order = require("../models/Order");
const mongoose = require("mongoose");


// ======================
// CREATE PAYMENT
// ======================

exports.createPayment = async (req, res) => {

    try {

        const {
            orderId,
            paymentMethod
        } = req.body;



        if (typeof orderId !== "string" || !mongoose.isValidObjectId(orderId) || !paymentMethod) {

            return res.status(400).json({

                message: "Valid order and payment method required"

            });

        }

        if (!["COD", "ONLINE"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        const order = await Order.findOne({ _id: orderId, user: req.user.id });



        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }





        if (paymentMethod === "ONLINE") {
            return res.status(501).json({
                message: "Online payment verification is not implemented"
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(409).json({
                message: "Order is already paid"
            });
        }

        order.paymentMethod = "COD";
        order.paymentStatus = "Pending";

        await order.save();




        res.json({

            message: "Cash on delivery selected",

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


        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        });



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