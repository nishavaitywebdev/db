/**
 * Created by nishavaity on 11/1/16.
 */
(function () {
    angular
        .module("wamDirectives",[])
        .directive("wamSortable",wamSortable)
    
    
    function wamSortable() {
        //console.log("Hi from wam sortable");
        //var vm = this;
        //var pageId = vm.pageId;
        function linker(scope,element,attributes) {
            var start = -1;
            var stop = -1;
            element.sortable({
                start: function (event, ui) {
                    start = $(ui.item).index();
                },
                stop: function (event, ui) {
                    stop = $(ui.item).index();
                    scope.wamSortableController.sort(start,stop);
                }
            });
        }
        
        return{
            scope : {},
            restrict : 'C',
            link : linker,
            controller : wamSortableController,
            controllerAs : 'wamSortableController'
        }
    }

    function wamSortableController($routeParams,WidgetService) {
        var vm  =this;
        vm.sort = sort;
        
        function sort(start, stop) {
            WidgetService.sort($routeParams.pid,start,stop);
        }
    }
})();