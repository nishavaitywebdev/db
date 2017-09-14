/**
 * Created by nishavaity on 12/6/16.
 */
module.exports = function () {

    var api = {
        createHotel:createHotel,
        findHotelById: findHotelById,
        findHotelByIbiboHotelId : findHotelByIbiboHotelId,
        //deleteUserReview : deleteUserReview,
        setModel: setModel //,
        //findWebsitesForUser: findWebsitesForUser
    };
    return api;


    function setModel(_model) {
        model = _model;
    }


    function findHotelById(hotelId) {

        return HotelModel.findById(hotelId)
            .then(function (hotel) {
                return hotel;
            })
    }

    function createHotel(hotel) {
        //console.log("In project");
        return HotelModel.create(hotel);
    }

    function findHotelByIbiboHotelId(ibiboHotelId) {
        //console.log("In hotel find");
        return HotelModel.findOne({
            hotelId: ibiboHotelId
        });
    }

};