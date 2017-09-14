/**
 * Created by nishavaity on 10/13/16.
 */
(function() {
    angular
        .module("MakeYourReservationApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("ReservationController", ReservationController)
        function LoginController($location, UserService) {
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
                    var promise = UserService.login(username, password);

                    //var promise = UserService.findUserByCredentials(username,password);
                    promise
                        .success(function (user) {
                            //console.log("Inside success of login")

                            if (user === '0') {
                                vm.alert = "No such user";
                            }
                            else {
                                var userId = user[0].id;
                                $location.url("user/" + userId);
                            }
                        })
                        .error(function () {

                        });
                }

            }
        }

        function RegisterController($scope,$rootScope,$location,UserService) {
        var vm = this;

        vm.createUser = createUser;
        function createUser(user) {
            console.log($scope.register);
            if(!$scope.register.$invalid && user.password == user.veryPassword){
                UserService
                    .register(user)
                    .then(
                        function (response) {
                            var user = response.data;
                            if(!user.errno){
                                $rootScope.currentUser = user;
                                $location.url("/user/" + user.insertId);
                            } else{
                                vm.alert = "Duplicate email or username";
                            }
                        });
            }
            else{
                vm.veryPasswordAlert = "Passwords do not match";
            }
            }
        }

        function ProfileController($routeParams, UserService,$location) {
            var vm = this;
            vm.userId = $routeParams["uid"];
            function init() {
                UserService
                    .findCurrentUser(vm.userId)
                    .success(function(userRow){
                        if(userRow != null){
                            console.log(userRow);
                            vm.user = userRow[0];
                            vm.user.firstName = vm.user.name.split(" ")[0];
                            vm.user.lastName = vm.user.name.split(" ")[1];
                        }
                    })
                    .error(function(){

                    });
            }
            init();
            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;
            vm.logout = logout;

            
            function logout() {
                UserService.logout()
                    .success(function () {
                        $location.url("/login");
                    })
            }
            function updateUser(userId,user){
                UserService.updateUser(userId,user)
                    .success(function(userRow){
                        if(userRow != '0'){
                            console.log(userRow);
                            vm.user = userRow;
                            vm.user.firstName = vm.user.name.split(" ")[0];
                            vm.user.lastName = vm.user.name.split(" ")[1];
                        }
                    })
                    .error(function(){

                    });

            }

            function deleteUser(userId){

                UserService.deleteUser(userId)
                    .success(function(response){
                        if(response == 'OK'){
                            $location.url("/login");
                        }
                    })
                    .error(function(){

                    });


            }
        }

        function ReservationController($routeParams, UserService,$location) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init() {
            UserService
                .findReservationDetails(vm.userId)
                .success(function(reservationDetails){
                    if(reservationDetails != null){
                        console.log(reservationDetails);
                        for(var i=0; i<reservationDetails.length;i++){
                            var dateTime = new Date(Number(reservationDetails[i].dateTime));
                            reservationDetails[i].dateTime = dateTime.toDateString();
                        }
                        vm.reservations = reservationDetails;
                    }
                })
                .error(function(){

                });
        }
        init();
        vm.deleteReservation = deleteReservation;

        function deleteReservation(rid){
            console.log("In delete reservation");
            UserService.deleteReservation(rid)
                .success(function(response){
                    if(response == 'OK'){
                        console.log(response);
                        $location.url("#/user/"+ vm.userId+"/manageBookings");
                    }
                })
                .error(function(){

                });
        }
    }
})();