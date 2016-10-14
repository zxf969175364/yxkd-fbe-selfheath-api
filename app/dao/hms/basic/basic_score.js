/**
 * Created by zjp on 16/8/20.
 */

'use strict'
export default {

    create: async function(data){
        return D.model('basic_score').create(data).toPromise();
    },

    find: async function(query){
        return D.model('basic_score').find(query).toPromise();
    },

    findOne: async function(query){
        return D.model('basic_score').findOne(query).toPromise();
    }

}