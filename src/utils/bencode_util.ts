// WARNING: If import is used bencode has a strange behavior disables magic
// converstion.
const bencode = require('bencode')

export const BencodeUtils = {

    decodeMessage: (msg: string) => {
        const m = msg.toString()
        const idx = m.indexOf(' ')

        if (-1 !== idx) {
            const id = m.substring(0, idx)
            try {
                const data = bencode.decode(Buffer.from(m.substring(idx + 1)), 'utf-8')
                return { id, data }
            } catch (err) {
                console.error(err)
            }
        }
    },

    encodeMessage: (id: string, data: any) => {
        return Buffer.from([id, bencode.encode(data)].join(' '))
    }

}

