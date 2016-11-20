/**
 * Created by Vladimir on 30.10.2016.
 */
(function() {
    'use strict';

    angular
        .module('truckCompanyApp')
        .controller('AdmincompanyUserCreateController', AdmincompanyUserCreateController);

    AdmincompanyUserCreateController.$inject = ['$stateParams', '$state','Company', 'Upload','$http'];

    function AdmincompanyUserCreateController ($stateParams, $state, Company, Upload, $http) {
        var vm = this;
        vm.create = create;

        vm.dateOptions = {
            maxDate: new Date(),
        };
        vm.format = 'yyyy/MM/dd';
        vm.altInputFormats = ['M!/d!/yyyy'];



        vm.user = {};
        vm.user.authorities = [];
        vm.user.authorities[0] = 'ROLE_DISPATCHER';
        console.log(vm.user)
        vm.error = false;
        vm.messageError = '';

        function create(){
            $http({
                method: 'POST',
                url: '/api/company/employee',
                data: vm.user
            }).then(function successCallback(response) {
                vm.error = false;
                $state.go('admincompany.users');
            }, function errorCallback(response) {
                vm.error = true;
                switch(response.headers('X-truckCompanyApp-error')){
                    case 'error.userexists': {
                        vm.messageError = 'Login already in use';
                        break;
                    }
                    case 'error.emailexists':{
                        vm.messageError = 'Email already in use.';
                        break;
                    }
                    default: {
                        vm.messageError = 'You don\'t fill all fields.';
                    }
                }

            });
        }



        vm.openDatePopup = function(){
            vm.isOpenDatePopup = true;
        }


    }
})();
