/**
 * Created by nishavaity on 10/13/16.
 */

(function () {
    angular
        .module ("MakeYourReservationApp")
        .factory("UserService", UserService)
    function UserService($http){

        var api = {
            createUser   : createUser,
            findUserById : findUserById,
            findCurrentUser: findCurrentUser,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser,
            getAllUsers: getAllUsers,
            login:login,
            logout:logout,
            register:register,
            checkLogin: checkLogin,
            checkAdmin: checkAdmin,
            addFollower:addFollower,
            findReservationDetails: findReservationDetails,
            deleteReservation: deleteReservation

    };
        return api;

        function getAllUsers() {
            var url = '/api/getAllUsers/';
            return $http.get(url);
        }


        function addFollower(followerId, followeeId) {
            var url = '/api/follower/';
            var follow = {
                followerId:followerId,
                followeeId:followeeId
            }
            return $http.put(url,follow);
        }
        function findReservationDetails(userId) {
            var url = "/api/allReservations/"+userId;
            return $http.get(url);
        }

        function findCurrentUser(userId) {
            var url = '/api/user/'+userId;
            return $http.get(url);
        }

        function register(user) {
            var url = '/api/register';
            return $http.post(url,user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function checkLogin() {
            return $http.post("/api/checkLogin");
        }

        function checkAdmin() {
            return $http.post("/api/checkAdmin");
        }

        function login(username,password) {

            var user ={
                username:username,
                password:password
            }
            // console.log(user);

            //console.log("IN client service login"+user);
            return $http.post('/api/login', user);
        }

        function createUser(user) {
            //user.push(user);
            //console.log(user);
            var url = '/api/user';
            return $http.post(url,user);
            //console.log(user);
        }

        function findUserById(userId) {

            var url = '/api/user/' +  userId;
            return $http.get(url);
            // var user;
            // for( var u in user){
            //     if(user[u]._id === userId){
            //         user = user[u];
            //         console.log(user)
            //         break;
            //     }
            // }
            // return user;

        }
        function findUserByUsername(username) {

            var url = '/api/user?username='+username;
            return $http.get(url);
            // user.forEach(function(user){
            //     if(user.username == username){
            //         return user;
            //     }
            // });
        }
        function findUserByCredentials(username, password) {

            var url = '/api/user?username='+username+'&password='+password;
            //console.log(url);
            return $http.get(url);
            // var user;
            // for( var u in user){
            //     if(user[u].username === username && user[u].password === password){
            //         user = user[u];
            //         break;
            //     }
            // }
            // return user;
        }
        function updateUser(userId,user) {
            var url = "/api/user/" + userId;
            return $http.put(url,user);
            // for( var u in user){
            //     if(user[u]._id === userId){
            //         user[u] = userUpdated;
            //         break;
            //     }
            // }
        }
        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
            // for( var u in user){
            //     if(user[u]._id === userId.toString()){
            //         user.splice(u, 1);
            //         console.log(user)
            //         break;
            //     }
            // }

        }
        function deleteReservation(rId) {
            var url = "/api/reservation/" + rId;
            return $http.delete(url);
            // for( var u in user){
            //     if(user[u]._id === userId.toString()){
            //         user.splice(u, 1);
            //         console.log(user)
            //         break;
            //     }
            // }

        }
}
})();