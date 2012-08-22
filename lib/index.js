var EasyMySQL = require('easy-mysql'),
	options = {
	},
	settings = {
		pool_size: 5
	},
	onFlush = function(time_stamp, metrics) {
		time_stamp = parseInt(time_stamp);

		var easy_mysql = EasyMySQL.connect_with_easy_pool(settings),
			execute = function(queries) {
				var sql = queries.join('; ');
				try {
					easy_mysql.execute(sql, [], function (err, results) {
						if (err) {
							console.log("query failed: " + err);
						}
					});
				}
				catch (e) {
					console.log("query failed " + e);
				}
			};

		var queries = [];
		for (var metric in metrics['counters']) {
			var value = parseInt(metrics['counters'][metric], 10);
			if (0 === value) {
				continue;
			}

			var result = options.pattern.exec(metric);
			if (null !== result) {
				var id = parseInt(result[options.match_id], 10),
					type = result[options.match_type];
				queries.push('INSERT INTO ' + options.table + ' VALUES (' + id + ', "' + type + '", ' + time_stamp + ', ' + value + ') ON DUPLICATE KEY UPDATE value = value + ' + value);
			}

			if (queries.length >= 100) {
				execute(queries);
				queries = [];
			}
		}

		if (queries.length > 0) {
			execute(queries);
		}
	},
	onStatus = function(error, backend_name, stat_name, stat_value) {
		// ignore status events
	};

exports.init = function(startup_time, config, events) {
	events.on('flush', onFlush);
	events.on('status', onStatus);

	if (!config.mysql.host || !config.mysql.user || !config.mysql.password || !config.mysql.database) {
		console.log('mysql.host, mysql.user, mysql.password or mysql.database missing in statsd config');
		return false;
	}

	if (!config.mysql.table || !config.mysql.pattern || !config.mysql.pos_key || !config.mysql.pos_id) {
		console.log('mysql.table, mysql.pattern, mysql.pos_key or mysql.pos_id missing in statsd config');
		return false;
	}

	settings.host = config.mysql.host;
	settings.user = config.mysql.user;
	settings.password = config.mysql.password;
	settings.database = config.mysql.database;

	options.pattern = config.mysql.pattern;
	options.match_type = config.mysql.pos_key;
	options.match_id = config.mysql.pos_id;
	options.table = config.mysql.table;

	return true;
};
