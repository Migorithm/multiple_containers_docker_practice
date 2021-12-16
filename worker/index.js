/* All the configuration or kind of keys that we're going to need for 
connecting over terrorists are going to be stored inside of 
a separate file. So the first thing I'm going to do inside of here is 
require in a file that we're going to call keys. */
const keys = require('./keys');
const redis = require('redis');
const redisClient =redis.createClient({
    host: keys.redisHost,
    port: keys.redis.Port,
    retry_strategy: ()=> 1000 
    /*this is going to tell that if it ever loses connection
    to our redis server, it should attempt to automatically 
    reconnect to the server once every one thousand millisecond. */

})

const sub = redisClient.duplicate();

function fib(index){
    if (index<2) return 1;
    return fib(index -1 ) + fib(index - 2);
}

/* we're going to watch Redis and get a message any time 
that a new value shows up. so anytime we get new message,
we'll run callback function
*/
sub.on('message',(channel,message) => {
    redisClient.hset('values',message,fib(parseInt(message)));

})

/*To any insert events, so any time someone inserts a new value into retests, 
we're going to get that value and attempt to calculate the Fibonacci value 
for it and then toss that value back into the Redis instance.*/
sub.subscribe('insert')