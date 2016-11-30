/**
 * Created by Dmitry on 17.11.2016.
 */
(function () {
    'use strict';

    angular
        .module('truckCompanyApp')
        .controller('ManagerWaybillDetailsController', ManagerWaybillDetailsController);

    ManagerWaybillDetailsController.$inject = ['Principal', 'entity', '$uibModalInstance', '$scope', 'Waybill'];

    function ManagerWaybillDetailsController(Principal, entity, $uibModalInstance, $scope, Waybill) {
        var vm = this;

        vm.clear = clear;
        vm.waybill = entity;
        vm.changeWaybillState = changeWaybillState;
        getAccount();

        console.log(vm.waybill);
        function getAccount() {
            Principal.identity().then(function (account) {
                vm.account = account;
                vm.fullName = account.firstName + ' ' + account.lastName;
            });
        }

        function changeWaybillState(id) {
            vm.waybill.manager = vm.account;
            vm.waybill.routeList = null;
            vm.waybill.writeOffAct = null;
            if (id == 1) {
                vm.waybill.state = 'CHECKED';
            } else {
                vm.waybill.state = 'DELIVERED';
            }
            Waybill.update(vm.waybill);
            console.log(vm.waybill);
        }

        function clear() {
            $uibModalInstance.close();
        }
    }
})();
