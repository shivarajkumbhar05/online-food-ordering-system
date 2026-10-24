const Food = require("../models/Food");


// ======================
// GET ALL MENU ITEMS
// ======================

exports.getMenu = async (req, res) => {

    try {

        const foods = await Food.find();


        res.json({

            message: "Menu fetched successfully",

            foods

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ======================
// GET SINGLE FOOD ITEM
// ======================

exports.getFoodById = async (req, res) => {

    try {


        const food = await Food.findById(
            req.params.id
        );


        if (!food) {

            return res.status(404).json({

                message: "Food not found"

            });

        }



        res.json(food);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });

    }

};





// ======================
// SEARCH FOOD
// ======================

exports.searchFood = async (req, res) => {

    try {


        const keyword = req.query.search;


        const foods = await Food.find({

            name: {
                $regex: keyword,
                $options: "i"
            }

        });



        res.json(foods);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });

    }

};





// ======================
// FILTER BY CATEGORY
// ======================

exports.getFoodByCategory = async (req,res)=>{


    try{


        const foods = await Food.find({

            category:req.params.category

        });



        res.json(foods);



    }catch(error){


        res.status(500).json({

            message:error.message

        });

    }

};