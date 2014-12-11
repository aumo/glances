# -*- coding: utf-8 -*-
#
# This file is part of Glances.
#
# Copyright (C) 2014 Nicolargo <nicolas@nicolargo.com>
#
# Glances is free software; you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Glances is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

"""Web interface class. Client side rendering."""

import os
import sys

# Import Glances libs
from glances.core.glances_globals import logger
from glances.outputs.glances_bottle import GlancesBottle

# Import mandatory Bottle lib
try:
    from bottle import template, static_file, response
except ImportError:
    logger.critical('Bottle module not found. Glances cannot start in web server mode.')
    print(_("Install it using pip: # pip install bottle"))
    sys.exit(2)


class GlancesBottleAngular(GlancesBottle):
    """
    This class manages a Bottle Web server that serves
    an AngularJS template as its index.
    """

    def _route(self):
        self._app.route('/<filename:re:.*\.html>', method="GET", callback=self._html)
        self._app.route('/api/2/messages', method="GET", callback=self._api_messages)

        super(GlancesBottleAngular, self)._route()

    def _index(self, refresh_time=None):
        """Bottle callback for index.html (/) file."""
        response.content_type = 'text/html'

        # Manage parameter
        if refresh_time is None:
            refresh_time = self.args.time

        return template('index_angular', refresh_time=refresh_time)

    def _html(self, filename):
        """Bottle callback for *.html files."""
        response.content_type = 'text/html'
        # Return the static file
        return static_file(filename, root=os.path.join(self.STATIC_PATH, 'html'))

    def _api_messages(self):
        """
        Glances API RESTFul implementation
        Return the JSON messages for all plugins needed by the web interface.
        HTTP/200 if OK
        HTTP/404 if others error
        """
        response.content_type = 'application/json'

        # Update the stat
        self.stats.update()

        plugins = [
            'system',
            'uptime',
            'cpu',
            'load',
            'mem',
            'memswap',
            'network',
            'diskio',
            'fs',
            'sensors',
            'alert',
            'processcount',
            'monitor',
            'processlist',
        ]
        return {
            plugin: self.stats.get_plugin(plugin).get_stats_display(args=self.args)
            for plugin in plugins
        }
