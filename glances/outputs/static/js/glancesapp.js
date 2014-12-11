'use strict';

/**
 *
 * This file is part of Glances.
 *
 * Copyright (C) 2014 Nicolargo <nicolas@nicolargo.com>
 *
 * Glances is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Glance>s is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


angular.module('glances', []).config(function($interpolateProvider, $sceProvider) {
    // Have Angular play along nice with Bottle's template language.
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    // Allow HTML binding without verification.
    $sceProvider.enabled(false);
})

.factory('glancesService', function($http, $interval, $rootScope, glancesConfig) {
    var service = {
        messagesData: {}
    };

    var fetchData = function() {
        $http.get('/api/2/messages').success(function(data) {
            service.messagesData = data;
            $rootScope.$broadcast('dataFetched', data);
        });
    };

    fetchData();
    $interval(fetchData, glancesConfig.refreshTime);

    return service;
})

.directive('glcPlugin', function(glancesService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'plugin.html',
        scope: {
            name: '@name'
        },
        link: function(scope, element, attrs) {
            var styles = {
                'DEFAULT': '',
                'UNDERLINE': 'underline',
                'BOLD': 'bold',
                'SORT': 'sort',
                'OK': 'ok',
                'FILTER': 'filter',
                'TITLE': 'title',
                'CAREFUL': 'careful',
                'WARNING': 'warning',
                'CRITICAL': 'critical',
                'OK_LOG': 'ok_log',
                'CAREFUL_LOG': 'careful_log',
                'WARNING_LOG': 'warning_log',
                'CRITICAL_LOG': 'critical_log',
                'NICE': 'nice',
                'STATUS': 'status',
                'PROCESS': ''
            };

            scope.$on('dataFetched', function($event, data) {
                var rows = [];
                var row = [];
                data[scope.name].msgdict.forEach(function(cell) {
                    if (cell.msg.indexOf('\n') == 0) {
                        rows.push(row);
                        row = [];
                        return;
                    }
                    cell.decorationClass = styles[cell.decoration];

                    if (scope.name === 'processlist' && cell.splittable) {
                        if (cell.msg.indexOf(' ') == 0) {
                            return;
                        }
                        cell.msg = ' ' + cell.msg.split(' ')[0].slice(0, 20);
                    }
                    cell.msg = cell.msg.replace(/ /g, '&nbsp;');

                    row.push(cell);
                });
                rows.push(row);

                scope.rows = rows;
            });
        }
    };
});

