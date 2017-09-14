/**
 * Created by nishavaity on 11/14/16.
 */
module.exports = function () {
    console.log("Reached model server");

    // var userModel = require("./user/user.model.server")();
    var restaurantModel = require("./restaurant/restaurant.model.server")();
    var model = {
        // userModel:userModel,
        restaurantModel:restaurantModel
    };
    restaurantModel.setModel(model);
    // userModel.setModel(model);
    return model;

};