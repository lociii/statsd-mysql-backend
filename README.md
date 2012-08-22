statsd-mysql-backend
====================

Save statsd counters to a mysql key/value table.  
Overwrite existing datasets with new counter values.

Vocabulary
-----------
ID means the namespace for a metric e.g. the id of a user  
Key means the name of the metric e.g. how many messages has a user sent yet

Required config values
-----------------------
* mysql_host
* mysql_user
* mysql_password
* mysql_database
* mysql_table
* mysql_pattern
** Regular expression to match the counters that should be stored to mysql
* mysql_pos_key
** 1/2 Match position for the key 
* mysql_pos_id
** 1/2 Match position for the id

Example statsd config
---------------
{  
port: 8135  
, mgmt_port: 8136  
, backends: ["backends/statsd-mysql-backend/lib/index.js"]  
, mysql_host: "mysqlhost"  
, mysql_user: "user"  
, mysql_password: "password"  
, mysql_database: "statsd"  
, mysql_pattern: /user\.([\w-]+)\.([\d]+)/  
, mysql_pos_key: 1  
, mysql_pos_id: 2  
}