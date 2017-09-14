/**
 * Created by nishavaity on 10/24/16.
 */

module.exports = function(app){
    var model = require("./models/model.server.js")();

    require("./services/user.service.server.js")(app,model);
    require("./services/restaurant.service.server.js")(app, model);

};