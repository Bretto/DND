(function () {
    "use strict";

    var appModule = angular.module('App', [])
        .run(function () {

        });

    appModule.controller('AppCtrl', function ($scope, $http, $timeout) {
        console.log('AppCtrl');

        $scope.droppables = [
            {name: '1'},
            {name: '2'},
            {name: '3'}
        ];
        $scope.items = [
            {name: 'A'},
            {name: 'B'},
            {name: 'C'}
        ];


        $scope.handleDrop = function (item, bin) {
            console.log('Item ' + item.name + ' has been dropped into ' + bin.name);
        }

    });


    appModule.directive('draggable', function () {
        return function (scope, element) {
            // this gives us the native JS object
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('data', angular.toJson(scope.item));
                    this.classList.add('drag');
                },
                false
            );

            el.addEventListener(
                'dragend',
                function (e) {

                    this.classList.remove('drag');
                    if (event.dataTransfer.dropEffect !== 'none') {
                        var s = angular.element(e.target).scope();
                        s.$apply(function () {
                            s.selfItems.splice(s.$index, 1);
                        });
                    }
                },
                false
            );
        }
    });

    appModule.directive('droppable', function ($parse) {
        return {

            link: function (scope, element, attr) {
                // again we need the native object
                var el = element[0];

                if (attr['droppable']) {
                    console.log('test');
                    scope.selfItems = [$parse(attr['droppable'])(scope)];
                } else {
                    scope.selfItems = [];
                }

                el.addEventListener(
                    'dragover',
                    function (e) {
                        e.dataTransfer.dropEffect = 'move';
                        // allows us to drop
                        if (e.preventDefault) e.preventDefault();
                        this.classList.add('over');
                    },
                    false
                );

                el.addEventListener(
                    'dragenter',
                    function (e) {
                        this.classList.add('over');
                    },
                    false
                );

                el.addEventListener(
                    'dragleave',
                    function (e) {
                        this.classList.remove('over');
                    },
                    false
                );

                el.addEventListener(
                    'drop',
                    function (e) {
                        // Stops some browsers from redirecting.
                        if (e.stopPropagation) e.stopPropagation();

                        this.classList.remove('over');
                        var data = JSON.parse(e.dataTransfer.getData('data'));

                        scope.$apply(function () {
                            scope.selfItems.push(data);
                        })
                    },
                    false
                );
            }
        }
    });


})();