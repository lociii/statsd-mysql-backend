statsd-mysql-backend
====================

MySQL backend for the [Etsy StatsD] [1]  
  
Save statsd counters to a mysql key/value table.  
Overwrite existing datasets with new counter values.

Vocabulary
-----------
ID means the namespace for a metric e.g. the id of a user  
Key means the name of the metric e.g. how many messages has a user sent yet

Required config values
-----------------------
* mysql.host
* mysql.user
* mysql.password
* mysql.database
* mysql.table
* mysql.pattern
** Regular expression to match the counters that should be stored to mysql
* mysql.pos_key  
 Match position for the key (usually 1 or 2)
* mysql.pos_id  
 Match position for the id (usually 1 or 2)

Example statsd config
---------------
{  
port: 8125  
, mgmt_port: 8126  
, backends: ["backends/statsd-mysql-backend/lib/index.js"]  
, mysql: {  
 host: "mysqlhost"  
 , user: "user"  
 , password: "password"  
 , database: "statsd"  
 , table: "statistics"  
 , pattern: /user\.([\w-]+)\.([\d]+)/  
 , pos_key: 1  
 , pos_id: 2  
}  
}

[1]: https://github.com/etsy/statsd        "Etsy StatsD"
