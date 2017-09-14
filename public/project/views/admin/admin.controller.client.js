/**
 * Created by nishavaity on 10/13/16.
 */
(function() {
    angular
        .module("MakeYourReservationApp")
        .controller("AdminLoginController", AdminLoginController)
        .controller("AdminRegisterController", AdminRegisterController)
        .controller("AdminProfileController", AdminProfileController)
        function AdminLoginController($location, UserService) {
            var vm = this;
            vm.login = login;


            function login(username,password){
                if(!username){
                    vm.alert = "Username required";
                }
                else if(!password){
                    vm.alert = "Password required";
                }
                else if (!username && !password){
                    vm.alert = "Username and Password required";
                }
                else{
                    if (username == 'nisha' && password == 'nisha') {
                        $location.url("#/userAdmin/" + 2);
                    }
                    else {
                        vm.alert = "No such Admin";
                    }
                }

            }
        }
        function AdminRegisterController($rootScope,$location,UserService) {
            var vm = this;
            console.log("In project user controller");

            vm.createUser = createUser;
            function createUser(user) {

                user.role = 'ADMIN';

                // if(user == undefined)
                //     vm.alert = "Username and Password required. Re-enter password";
                // else {
                //     if (!user.username) {
                //         vm.alert = "Username required";
                //     }
                //     else if (!user.password) {
                //         vm.alert = "Password required";
                //     }
                //     else if (!user.veryPassword) {
                //         vm.alert = "Please re enter password required";
                //     }
                //     else if (user.veryPassword != user.password) {
                //         vm.alert = "Passwords do not match";
                //     }
                //     else if (!user.username && !user.password && !user.veryPassword) {
                //         vm.alert = "Username and Password required. Re-enter password";
                //     }
                //     else {

                        UserService
                            .register(user)
                            .then(
                                function (response) {
                                    console.log(response);
                                    var user = response.data;
                                    $rootScope.currentUser = user;
                                    $location.url("/userAdmin/" + user._id);
                                });

                    // }

                // }
            }
        }


        function AdminProfileController($routeParams, UserService,RestaurantService,$location) {
            var vm = this;
            //vm.userId = $routeParams["uid"];

            vm.cities = [{id:1,name:'Boston'},
                {id:2,name:'San Francisco'},
                {id:3,name:'Miami'},
                {id:4,name:'New York'},
                {id:5,name:'Washington'},
                {id:6,name:'Chicago'}];
            // vm.restaurant.city = 1;
            vm.addRestaurants = addRestaurants;
            vm.addRestaurantTable = addRestaurantTable;
            vm.getAllRestaurants = getAllRestaurants;
            vm.deleteRestaurant = deleteRestaurant;
            vm.findRestaurantsByCity = findRestaurantsByCity

            function addRestaurantTable(restaurant) {
                RestaurantService.addNewRestaurantTable(restaurant)
                    .success(function (data) {
                        console.log("Reached success added table")
                        // $location.url("userAdmin");
                        $location.url("/userAdmin/" + 2);
                    })
            }

            function deleteRestaurant(res_id) {
                RestaurantService.deleteRestaurant(res_id)
                    .success(function (data) {
                        $location.url("/userAdmin/" + 2);
                    })
            }

            function addRestaurants(restaurant) {
                RestaurantService.addNewRestaurant(restaurant)
                    .success(function (data) {
                        $location.url("/userAdmin/" + 2);
                        // $location.url("#/userAdmin");
                        // $location.url("#/"+ vm.userId);
                    })

            }

            function getAllRestaurants() {
                RestaurantService.getAllRestaurants()
                    .success(function (data) {
                        console.log(data);
                        vm.restaurants = data;
                    })
            }

            //console.log(vm.userId);
            function init() {
                // UserService
                //     //.findUserById(vm.userId)
                //     .findCurrentUser()
                //     .success(function(user){
                //         if(user != null){
                //             vm.user = user;
                //             //console.log(vm.user);
                //         }
                //     })
                //     .error(function(){
                //
                //     });
                $location.url("#/userAdmin/" + 2);
            }
            init();
            // vm.updateUser = updateUser;
            // vm.deleteUser = deleteUser;
            vm.logout = logout;

            function findRestaurantsByCity() {
                console.log(vm.restaurant.city);
                RestaurantService.findRestaurantsByCityId(vm.restaurant.city)
                    .success(function (restaurants) {
                        vm.restaurantsInCity = restaurants;
                    })
            }
            
            function logout() {
                UserService.logout()
                    .success(function () {
                        $location.url("/loginAdmin");
                    })
            }
        }
})();