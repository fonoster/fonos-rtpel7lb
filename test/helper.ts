// TODO: Use import
const Bluebird = require('bluebird')

export default function fromCallback(fn: any) {
    return new Bluebird(function(resolve: any, reject: any) {
        try {
        return fn(function(err: any, data: any, res: any) {
            if (err) {
            err.res = res
            return reject(err)
            }
            return resolve([data, res])
        });
        } catch (err) {
        return reject(err)
        }
    })
}