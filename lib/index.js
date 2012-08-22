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

	if (!config.mysql_host || !config.mysql_user || !config.mysql_password || !config.mysql_database) {
		console.log('mysql_host, mysql_user, mysql_password or mysql_database missing in statsd config');
		return false;
	}

	if (!config.mysql_table || !config.mysql_pattern || !config.mysql_pos_key || !config.mysql_pos_id) {
		console.log('mysql_table, mysql_pattern, mysql_pos_key or mysql_pos_id missing in statsd config');
		return false;
	}

	settings.host = config.mysql_host;
	settings.user = config.mysql_user;
	settings.password = config.mysql_password;
	settings.database = config.mysql_database;

	options.pattern = config.mysql_pattern;
	options.match_type = config.mysql_pos_key;
	options.match_id = config.mysql_pos_id;
	options.table = config.mysql_table;

	return true;
};
