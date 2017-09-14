/**
 * Created by nishavaity on 12/6/16.
 */
(function() {
    var app = angular
        .module("MakeYourReservationApp")
        .controller("RestaurantListController", RestaurantListController)
        .controller("RestaurantDetailsController", RestaurantDetailsController)
        .controller("CityListController", CityListController);

    //console.log("Hello outside hotel list controller");

    //$routeParams, HotelService

    function CityListController($routeParams,UserService, RestaurantService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        function init() {
            vm.userId = $routeParams.uid;
            var promise = UserService.findUserById(vm.userId);
            promise
                .success(function (user) {
                    vm.user = user;
                    console.log(vm.user);
                })

        }init()
    }

    function RestaurantDetailsController($location, $routeParams, RestaurantService, UserService) {
        var vm = this;
        vm.resId = $routeParams.rid;
        vm.userId = $routeParams.uid;
        vm.cityId = $routeParams.cid;

        function init() {
            var promise = RestaurantService.findRestaurantById(vm.resId);
            promise
                .success(function (restaurantDetails) {
                    vm.restaurantDetails = restaurantDetails[0];
                    var restaurantTables = new Array(restaurantDetails.length);
                    for(var i=0; i<restaurantDetails.length;i++){
                        restaurantTables[i] = {id:restaurantDetails[i].rtid
                            , seats:restaurantDetails[i].seats};
                    }
                    vm.restaurantTables = restaurantTables;
                    console.log(vm.restaurantTables);
                })
                .error(function (err) {
                    console.log(err);
                });
            var promise1 = UserService.findUserById(vm.userId);
            promise1
                .success(function (user) {
                    vm.user = user;
                })

        }
        init()

        vm.addReservation =addReservation;

        function addReservation(){
            vm.reservation.userId = vm.userId;
            vm.reservation.cityId = vm.cityId;
            vm.reservation.resId = vm.resId;
            vm.reservation.tokenAmt = vm.restaurantDetails.tokenAmt;
            console.log(vm.reservation);
            var promise = RestaurantService.makeReservation(vm.reservation);
            promise
                .success(function (data) {
                    console.log(data);
                    if(data != '0'){
                        console.log(data);
                        console.log("Reservation successful");
                        $location.url("user/" + vm.userId);
                    } else {
                        vm.alert = "Not enough balance";
                    }
                })
            .error(function () {
                vm.alert = "Error";
            });
        }

    }

    function RestaurantListController($routeParams,UserService, RestaurantService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        function init() {
            vm.cityId = $routeParams.cid;
            vm.userId = $routeParams.uid;

            var promise = RestaurantService.findRestaurantsByCityId(vm.cityId);
            promise
                .success(function (restaurants) {
                    vm.restaurants_list = restaurants;
                    console.log(vm.restaurants_list);
                })
                .error(function () {

                });
        }

        init();
    }

})();