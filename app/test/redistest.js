/**
 * Created by zjp on 16/10/9.
 */
import redis from '../utils/redis';

redis.set('key', 'value').then(function (msg) {
    console.log(msg);
});

redis.get('key').then(function (msg) {
    console.log(msg);
});