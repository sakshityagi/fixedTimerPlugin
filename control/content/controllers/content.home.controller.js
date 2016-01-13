'use strict';

(function (angular, buildfire) {
    angular
        .module('fixedTimerPluginContent')
        .controller('ContentHomeCtrl', ['$scope','STATUS_CODE','TAG_NAMES','DataStore','$timeout',
            function ($scope, STATUS_CODE, TAG_NAMES, DataStore, $timeout) {
                console.log('inside content home controller ----------------->');
                var ContentHome = this;
                var tmrDelay = null;

                /*Content home data seclaration with default value */

                ContentHome.data = {
                    "content" : {
  	                                 "title" : "",
                                     "defaultSortType":""
                                 },
                     "design" : {
                                    "bgImage" : ""
                                 }
                    };

                ContentHome.masterData = {};

                 ContentHome.sortTypeData = [
                    "Manually", "Item Name A-Z", "Item Name Z-A", "Newest First", "Oldest First"
                ];

                /*Update the Master data object*/
                ContentHome.updateMasterItem = function(data){
                    ContentHome.masterData = angular.copy(data);;
                };

                ContentHome.updateMasterItem(ContentHome.data);

                ContentHome.isUnchanged = function(data) {
                    return angular.equals(data, ContentHome.masterData);
                };

                                    /*Saved the sorting preference start */
                ContentHome.saveDefaultSortPreference = function(sortType){
                    ContentHome.data.content.defaultSortType = sortType;
                };
                                    /*Saved the sorting preference start end */

                                            /*INIT CALL START*/
            /*Init method call, it will bring all the pre saved data*/
                ContentHome.init = function () {
                    ContentHome.success = function (result) {
                        console.info('init success result:', result);
                        if (result) {
                            ContentHome.data = result.data;
                        }
                    };
                    ContentHome.error = function (err) {
                        if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                            console.error('Error while getting data', err);
                        }
                        else if (err && err.code === STATUS_CODE.NOT_FOUND) {
                            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.TIMER_INFO);
                        }
                    };
                    DataStore.get(TAG_NAMES.TIMER_INFO).then(ContentHome.success, ContentHome.error);
                };
                ContentHome.init();
                                        /*INIT CALL END*/

                                        /*SAVED DATA CALL START*/
                ContentHome.saveData = function (newObj, tag) {
                    if (typeof newObj === 'undefined') {
                        return;
                    }
                    ContentHome.success = function (result) {
                        console.info('Saved data result: ', result);
                        ContentHome.updateMasterItem(newObj);
                    };
                    ContentHome.error = function (err) {
                        console.error('Error while saving data : ', err);
                    };
                    DataStore.save(newObj, tag).then(ContentHome.success, ContentHome.error);
                };

                ContentHome.saveDataWithDelay = function (newObj) {
                    if (newObj) {
                        if (ContentHome.isUnchanged(newObj)) {
                            return;
                        }
                        if (tmrDelay) {
                            clearTimeout(tmrDelay);
                        }
                        tmrDelay = setTimeout(function () {
                            ContentHome.saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.TIMER_INFO);
                        }, 500);
                    }
                };
                $scope.$watch(function () {
                    return ContentHome.data;
                }, ContentHome.saveDataWithDelay, true);

                                            /*SAVED DATA CALL END*/
            }]);
})(window.angular, window.buildfire);