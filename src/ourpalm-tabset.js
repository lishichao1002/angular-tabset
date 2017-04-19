(function (angular) {

    angular
        .module('ourpalm.tabset', [])

        .service('OurpalmTabset', function () {
            return function (opts) {
                let options = {}, controller = null;
                $.extend(true, options, opts);

                this.addTab = function (tab) {
                    controller.addTab(tab);
                };

                this.insertTab = function (tab, position) {
                    controller.insertTab(tab, position);
                };

                this.closeTab = function (tabId) {
                    controller.closeTabByTabId(tabId);
                };

                this.disabledTab = function (tabId) {
                    controller.disabledTabByTabId(tabId);
                };

                this.enabledTab = function (tabId) {
                    controller.enabledTabByTabId(tabId);
                };

                this.selectTab = function (tabId) {
                    controller.selectTabByTabId(tabId);
                };

                this.exists = function (tabId) {
                    return !!controller.getTabByTabId(tabId);
                };

                this.getTab = function (tabId) {
                    return controller.getTabByTabId(tabId);
                };

                this.getTabs = function () {
                    return controller.tabs;
                };

                this.getOptions = function () {
                    return options;
                };

                this.bindController = function (ctrl) {
                    controller = ctrl;
                }
            }
        })

        .directive('ourpalmTabset', function () {
            return {
                restrict: 'E',
                scope: {
                    tabset: '=',
                    vertical: '=',
                    onAdd: '&',
                    onClose: '&',
                    onSelect: '&',
                    onUnselect: '&'
                },
                transclude: true,
                template: `
                    <div ng-show="ourpalmTabsetController.tabs.length > 0" class="tabbable nav-tabs-custom" ng-class="{'tabs-left': vertical=='left', 'tabs-right': vertical=='right', 'tabs-below': vertical=='bottom', 'tabs-top': vertical=='top' || !vertical}">
                        <ul class="nav nav-tabs" ng-if="vertical != 'bottom'">
                            <li ng-repeat="tab in ourpalmTabsetController.tabs" ng-class="{'active': tab.selected, 'disabled': tab.disabled}">
                                <a ng-click="ourpalmTabsetController.selectTab(tab);" ourpalm-compile-tab="tab.header"></a>
                                <button ng-if="tab.closable" ng-disabled="tab.disabled" class="close" ng-click="ourpalmTabsetController.closeTab(tab);"></button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <ng-transclude ng-show="false"></ng-transclude>
                            <ourpalm-dynamic-tab ng-repeat="tab in ourpalmTabsetController.tabs">
                                <div class="tab-pane" ng-if="!tab.closed">
                                    <div ng-if="!tab.lazy" ng-show="tab.selected" ourpalm-compile-tab="tab.body"></div>
                                </div>
                            </ourpalm-dynamic-tab>
                        </div>
                        <ul class="nav nav-tabs" ng-if="vertical == 'bottom'">
                            <li ng-repeat="tab in ourpalmTabsetController.tabs" ng-class="{'active': tab.selected, 'disabled': tab.disabled}">
                                <a ng-click="ourpalmTabsetController.selectTab(tab);">{{tab.header}}</a>
                                <button ng-if="tab.closable" ng-disabled="tab.disabled" class="close" ng-click="ourpalmTabsetController.closeTab(tab);"></button>
                            </li>
                        </ul>
                    </div>
                `,
                controllerAs: 'ourpalmTabsetController',
                controller: function ($scope, $parse) {
                    let vm = this;
                    let currentSelected = null;
                    let tabsetOps = $scope.tabset ? $scope.tabset.getOptions() : {};
                    vm.tabs = [];

                    vm.getTabByTabId = function (tabId) {
                        for (let i = 0; i < vm.tabs.length; i++) {
                            let tab = vm.tabs[i];
                            if (tab.tabId == tabId) {
                                return tab;
                            }
                        }
                    };

                    vm.insertTab = function (tab, position) {
                        if (tab.selected) {
                            vm.selectTab(tab);
                        }
                        if (!tab.tabId) {
                            tab.tabId = vm.tabs.length;
                        }

                        position = position < 0 ? 0 : position;
                        position = position > vm.tabs.length ? vm.tabs.length : position;

                        vm.tabs.splice(position, 0, tab);

                        if ($scope.onAdd) {
                            $parse($scope.onAdd)({
                                tab: tab
                            });
                        }
                        if (tabsetOps.onAdd) {
                            tabsetOps.onAdd(tab);
                        }
                    };

                    vm.addTab = function (tab) {
                        vm.insertTab(tab, vm.tabs.length);
                    };

                    vm.selectTab = function (tab) {
                        if (currentSelected == tab || tab.disabled) {
                            return;
                        } else if (currentSelected) {
                            //触发失选事件
                            if ($scope.onUnselect) {
                                $parse($scope.onUnselect)({
                                    tab: currentSelected
                                });
                            }
                            if (tabsetOps.onUnselect) {
                                tabsetOps.onUnselect(currentSelected);
                            }
                        }
                        //标记当前选择的
                        currentSelected = tab;
                        //设置当前选中
                        angular.forEach(vm.tabs, function (tab) {
                            tab.selected = false;
                        });
                        tab.selected = true;
                        //立即加载
                        tab.lazy = false;
                        //触发选中事件
                        if ($scope.onSelect) {
                            $parse($scope.onSelect)({
                                tab: tab
                            });
                        }
                        if (tabsetOps.onSelect) {
                            tabsetOps.onSelect(tab);
                        }
                    };

                    vm.closeTab = function (tab) {
                        for (let i = 0; i < vm.tabs.length; i++) {
                            let _tab = vm.tabs[i];
                            if (_tab == tab) {
                                tab.closed = true;
                                vm.tabs.splice(i, 1);
                            }
                        }
                        if (vm.tabs.length > 0) {
                            vm.selectTab(vm.tabs[0]);
                        }
                    };

                    vm.selectTabByTabId = function (tabId) {
                        let tab = vm.getTabByTabId(tabId);
                        tab && vm.selectTab(tab);
                    };

                    vm.disabledTabByTabId = function (tabId) {
                        let tab = vm.getTabByTabId(tabId);
                        tab && (tab.disabled = true);
                    };

                    vm.enabledTabByTabId = function (tabId) {
                        let tab = vm.getTabByTabId(tabId);
                        tab && (tab.disabled = false);
                    };

                    vm.closeTabByTabId = function (tabId) {
                        let tab = vm.getTabByTabId(tabId);
                        tab && vm.closeTab(tab);
                    };

                    $scope.$watch(function () {
                        return $scope.tabset;
                    }, function () {
                        let tabset = $scope.tabset;
                        if (tabset) {
                            tabset.bindController(vm);
                        }
                    })
                }
            }
        })

        .directive('ourpalmTab', function () {
            return {
                restrict: 'E',
                scope: {
                    header: '@',
                    tabId: '@',
                    disabled: '=',
                    lazy: '=',
                    closable: '=',
                    selected: '='
                },
                require: '^ourpalmTabset',
                transclude: true,
                template: `
                    <ng-transclude ng-if="false"></ng-transclude>
                `,
                compile: function ($element, $attrs, $transclude) {
                    return function ($scope, $element, $attrs, ourplmTabsetContrller) {
                        $transclude($scope, function (clone) {
                            let $warp = $(`<div></div>`);
                            $warp.append(clone);
                            let body = $warp.html();
                            let tab = {
                                header: $scope.header,
                                body: body,
                                tabId: $scope.tabId,
                                closable: $scope.closable,
                                disabled: !!$scope.disabled,
                                lazy: !!$scope.lazy,
                                selected: !!$scope.selected,
                                closed: false
                            };
                            ourplmTabsetContrller.addTab(tab);
                        });
                    }
                }
            }
        })

        .directive('ourpalmCompileTab', ['$compile', '$filter', function ($compile, $filter) {
            return function (scope, element, attrs) {
                scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.ourpalmCompileTab);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            };
        }])
})(angular);