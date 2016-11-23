(function() {
    'use strict';

    angular
        .module('truckCompanyApp')
        .controller('DriverRoutelistController', DriverRoutelistController);

    DriverRoutelistController.$inject = ['$stateParams', 'Waybill','Checkpoint','RouteList','$http','$location'];

    function DriverRoutelistController ($stateParams, Waybill,Checkpoint,RouteList,$http,$location) {
        var vm = this;
        vm.routeList = {};
        vm.checkpoints = [];
        vm.checkpointNames = [];
        vm.waybills = Waybill.query(function () {
            angular.forEach(vm.waybills, function(value) {
                    RouteList.get({id: value.routeList.id}, function (result) {
                        vm.routeList = result;
                        console.log(vm.routeList);
                    });
                    vm.checkpoints = Checkpoint.query({id: value.routeList.id},function(){
                        var i = 0;
                        angular.forEach(vm.checkpoints, function(value){
                            console.log(value);
                            console.log("!!!!!" + " " + value.name);
                            vm.checkpointNames[i] = {location: value.name, stopover: true};
                            i++;
                            // {location: 'ozarichi', stopover: true}
                        });
                    });
            });
        });
        vm.markDate = markDate;
        vm.travelMode = 'DRIVING';
        console.log(vm.waybills);




        function markDate(id) {
            for (var i=0; vm.checkpoints.length;i++) {
                if (vm.checkpoints[i].id == id) {
                    if(i==0 || vm.checkpoints[i-1].checkDate) {
                        var index = i;
                        $http({
                            method: 'GET',
                            url: '/api/checkpoint_mark_date/' + id,
                        }).then(function successCallback(response) {
                            console.log("date changed");
                            var today = new Date();
                            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            var dateTime = date+' '+time;
                            for (var j in vm.checkpoints) {
                                if (vm.checkpoints[j].id == id) {
                                    vm.checkpoints[j].checkDate = dateTime;
                                }
                            }
                            checkLastCheckpoint(index);

                        });
                    }else {
                        window.alert("Mark previous checkpoint");
                    }

                }
            }



            function checkLastCheckpoint(index) {
                if((index+1)===vm.checkpoints.length){
                    for (var j in vm.waybills) {
                    $http({
                        method: 'GET',
                        url: '/api/waybills/change_status/' + vm.waybills[j].id
                    })
                    }
                    $location.path('/driver/complete'); // path not hash


                }

            }



        }
    }
})();