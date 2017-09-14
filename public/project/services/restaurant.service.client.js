/**
 * Created by nishavaity on 12/6/16.
 */
(function () {
	angular
		.module("MakeYourReservationApp")
		.factory("RestaurantService", RestaurantService)
	function RestaurantService($http) {
		var api = {

			findRestaurantsByCityId: findRestaurantsByCityId,
			findRestaurantById: findRestaurantById,
			addNewRestaurantTable: addNewRestaurantTable,
			addNewRestaurant: addNewRestaurant,
			getAllRestaurants: getAllRestaurants,
			deleteRestaurant: deleteRestaurant,
            makeReservation: makeReservation

		};
		return api;

        function findRestaurantById(resId) {
             var url = "/api/restaurant/"+resId;
             return $http.get(url);
		}
        function findRestaurantsByCityId(cityId) {
            var url = "/api/allRestaurants/"+cityId;
            return $http.get(url);
        }
        function getAllRestaurants() {
            var url = "/api/allRestaurants/";
            return $http.get(url);
        }
        function deleteRestaurant(res_id) {
            var url = "/api/deleteRestaurant/"+res_id;
            return $http.delete(url);
        }

        function addNewRestaurantTable(restaurant) {
            var url = "/api/restaurantTableNew/";
            return $http.post(url,restaurant);
        }
        function addNewRestaurant(restaurant) {
            var url = "/api/restaurantNew/";
            return $http.post(url,restaurant);
        }

        function makeReservation(reservation) {
            var url = "/api/makeReservation/";
            return $http.post(url,reservation);
        }
	}
})();