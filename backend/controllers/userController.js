const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ======================
// GET USER PROFILE
// ======================

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        )
        .select("-password");


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        res.json(user);



    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};






// ======================
// UPDATE PROFILE
// ======================

exports.updateProfile = async (req, res) => {

    try {


        const {
            name,
            email,
            phone,
            address
        } = req.body;



        const user = await User.findById(
            req.user.id
        );



        if (!user) {

            return res.status(404).json({

                message:"User not found"

            });

        }




        user.name =
        name || user.name;


        user.email =
        email || user.email;


        user.phone =
        phone || user.phone;


        user.address =
        address || user.address;



        await user.save();




        res.json({

            message:"Profile updated",

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address
            }

        });




    } catch(error) {


        res.status(500).json({

            message:error.message

        });

    }

};









// ======================
// CHANGE PASSWORD
// ======================

exports.changePassword = async(req,res)=>{


    try{


        const {
            oldPassword,
            newPassword
        } = req.body;




        const user =
        await User.findById(
            req.user.id
        );



        const match =
        await bcrypt.compare(
            oldPassword,
            user.password
        );



        if(!match){

            return res.status(400).json({

                message:"Old password incorrect"

            });

        }




        user.password =
        await bcrypt.hash(
            newPassword,
            10
        );




        await user.save();




        res.json({

            message:"Password changed successfully"

        });




    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};









// ======================
// DELETE ACCOUNT
// ======================

exports.deleteAccount = async(req,res)=>{


    try{


        await User.findByIdAndDelete(
            req.user.id
        );


        res.json({

            message:"Account deleted"

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};







// ======================
// GET ALL USERS (ADMIN)
// ======================

exports.getAllUsers = async(req,res)=>{


    try{


        const users =
        await User.find()
        .select("-password");



        res.json(users);



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};