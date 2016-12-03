var app = angular.module('mainApp', ['ngRoute']);
app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: "views/home.html"
                })
                .when('/login', {
                    templateUrl: "views/login.html"
                })
                .when('/dashboard', {
                    resolve: {
                        "check": function ($location, $rootScope) {
                            if (!$rootScope.loggedIn) {
                                $location.path('/login');
                            }
                        }
                    },
                    template: "The Dashboard"
                })
                .when('/people', {
                    templateUrl: "views/people.html"
                })

                .otherwise({
                    redirectTo: '/login'
                });
    }]);

app.service('random', function(){
    var num = Math.floor(Math.random()*10);
    this.generate = function(){
        return num;
    }
});

app.factory('ranFact', function(){
    var randomObject = {};
    randomObject.generate = function(){
        return Math.floor(Math.random()*10);
    }
    return randomObject;
});
app.controller('loginCtrl', function ($scope, $rootScope, $location) {
    $scope.submit = function () {
        if ($scope.username == 'admin' && $scope.password == '1') {
            $rootScope.loggedIn = true;
            $location.path('/dashboard');
        } else {
            alert('Wrong credentials');
        }
    };
});
app.controller('peopleCtrl', function ($scope, $http, $timeout) {
    $scope.counter = -1;
    $scope.$watch('globalSearch.$', function (newValue, oldValue) {
        $scope.counter++;
    });
    $http.get('http://127.0.0.1:8080/views/data.json')
            .success(function (response) {
                $scope.persons = response.records;
            });
});
app.controller('displayCtrl', function ($scope, $timeout, ranFact) {
       $scope.randNumber = function() {
            $scope.randomNumber = ranFact.generate();
    };

    $scope.bands = 0;
    var updateCounter = function () {
        if ($scope.bands != 10)
        {
            $scope.bands++;
            $timeout(updateCounter, 100);
        }
    };
    updateCounter();
});
