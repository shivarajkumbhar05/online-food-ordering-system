const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================
// USER REGISTER
// ======================

const register = async (req,res)=>{

    try{


        const {
            name,
            email,
            password
        } = req.body;



        if(!name || !email || !password){

            return res.status(400).json({

                message:"All fields are required"

            });

        }




        const existUser = await User.findOne({
            email
        });



        if(existUser){

            return res.status(400).json({

                message:"User already exists"

            });

        }




        const hashedPassword =
        await bcrypt.hash(password,10);




        const user = await User.create({

            name,

            email,

            password:hashedPassword,

            role:"user"

        });





        res.status(201).json({

            message:"Registration Successful",

            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }

        });





    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};







// ======================
// USER LOGIN
// ======================


const login = async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;




        if(!email || !password){


            return res.status(400).json({

                message:"All fields are required"

            });

        }





        const user = await User.findOne({
            email
        });




        if(!user){


            return res.status(404).json({

                message:"User not found"

            });


        }







        const match =
        await bcrypt.compare(
            password,
            user.password
        );





        if(!match){


            return res.status(401).json({

                message:"Invalid password"

            });


        }






        const token = jwt.sign(

            {

                id:user._id,

                role:user.role

            },


            process.env.JWT_SECRET,


            {
                expiresIn:"1d"
            }

        );







        res.json({

            message:"Login successful",


            token,


            user:{

                id:user._id,

                name:user.name,

                email:user.email,

                role:user.role

            }


        });





    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }



};







// ======================
// GET PROFILE
// ======================


const getProfile = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user.id
        )
        .select("-password");



        res.json(user);



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};

const logoutUser = async (req, res) => {
    try{
        localStorage.removeItem("token");
    }
    catch(error){

    }
}






module.exports = {

    register,

    login,

    getProfile

};