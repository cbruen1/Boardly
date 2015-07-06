var homeIndexModule = angular.module("homeIndex", ['ngRoute']);

homeIndexModule.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "topicsController",
            templateUrl: "templates/topicsView.html"
        })
        .when("/newmessage", {
            controller: "newTopicController",
            templateUrl: "templates/newTopicView.html"
        })
        .when("/message/:id", {
            controller: "singleTopicController",
            templateUrl: "templates/singleTopicView.html"
        });

    $routeProvider.otherwise({ redirectTo: "/" });
}]);

homeIndexModule.factory("dataService", ["$http", "$q", function ($http, $q) {
    var _topics = [];
    var _isInit = false;

    var _isReady = function () {
        return _isInit;
    }

    var _getTopics = function () {
        var deferred = $q.defer();

        $http.get("api/v1/topics?includeReplies=true")
            .then(function (result) {
                // Success
                angular.copy(result.data, _topics);
                _isInit = true;
                deferred.resolve();
            },
            function () {
                // Error
                deferred.reject();
            });

        return deferred.promise;
    };

    var _addTopic = function (newTopic) {
        var deferred = $q.defer();

        $http.post("/api/v1/topics", newTopic)
            .then(function (result) {
                // Success
                var newlyCreatedTopic = result.data;
                _topics.splice(0, 0, newlyCreatedTopic);
                deferred.resolve(newlyCreatedTopic);
            },
            function () {
                // Error
                deferred.reject();
            });

        return deferred.promise;
    };

    function _findTopic(id) {
        var found = null;

        $.each(_topics, function (i, item) {
            if (item.id === parseInt(id)) {
                found = item;

                return false;   // Break out of the loop
            }
        });

        return found;
    };

    var _getTopicById = function (id) {
        var deferred = $q.defer();

        if (_isReady()) {
            var topic = _findTopic(id);

            if (topic) {
                deferred.resolve(topic);
            } else {
                deferred.reject();
            }
        } else {
            _getTopics()
                .then(function () {
                    // success
                    var topic = _findTopic(id);

                    if (topic) {
                        deferred.resolve(topic);
                    } else {
                        deferred.reject();
                    }
                },
                function () {
                    // error
                    deferred.reject();
                });
        };

        return deferred.promise;
    };

    var _saveReply = function (topic, newReply) {
        var deferred = $q.defer();

        $http.post("api/v1/topics/" + topic.id + "/replies", newReply)
            .then(function (result) {
                // Success
                if (topic.replies == null) {
                    topic.replies = [];
                }
                topic.replies.push(result.data);
                deferred.resolve(result.data);
            },
            function () {
                // Error
                deferred.reject();
            });

        return deferred.promise;
    }

    return {
        topics: _topics,
        getTopics: _getTopics,
        addTopic: _addTopic,
        isReady: _isReady,
        getTopicById: _getTopicById,
        saveReply: _saveReply
    };
}]);
 
homeIndexModule.controller('topicsController', ["$scope", "$http", "dataService", function ($scope, $http, dataService) {
    $scope.data = dataService;
    $scope.isBusy = false;

    if (dataService.isReady() == false) {
        $scope.isBusy = true;

        dataService.getTopics()
            .then(function () {
                // Success
            },
            function () {
                // Error
                alert("Could not load topics");
            })
            .then(function () {
                $scope.isBusy = false;
            });
    };
}]);

homeIndexModule.controller('newTopicController', ["$scope", "$http", "$window", "dataService", function ($scope, $http, $window, dataService) {
    $scope.newTopic = {};

    $scope.save = function () {
        dataService.addTopic($scope.newTopic)
        .then(function () {
            // success
            $window.location = "#/";
        },
        function () {
            // error
            alert("Could not save new topic");
        });
    };
}]);

homeIndexModule.controller('singleTopicController', ["$scope", "dataService", "$window", "$routeParams", function ($scope, dataService, $window, $routeParams) {
    $scope.topic = null;
    $scope.newReply = {};

    dataService.getTopicById($routeParams.id)
        .then(function (topic) {
            // success
            $scope.topic = topic;
        },
        function () {
            // error
            $window.location = "#/";
        });

    $scope.addReply = function () {
        dataService.saveReply($scope.topic, $scope.newReply)
            .then(function () {
                // Success
                $scope.newReply.body = "";
            },
            function () {
                // Error
                alert("Could not add reply");
            });
    }
}]);