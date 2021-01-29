import bencode from 'bencode'

export const BencodeUtils = {

    decodeMessage: function(msg: string) {
        const m = msg.toString()
        const idx = m.indexOf(' ')

        if (-1 !== idx) {
            const id = m.substring(0, idx)
            try {
                const data:any = {}
                //const data = bencode.decode(m.substring(parseInt(idx + 1)), 'utf8')
                return { id, data }
            } catch (err) {
                //console.error(err)
            }
        }
    },

    encodeMessage: function(id: string, data: any) {
        return Buffer.from([id, bencode.encode(data)].join(' '))
    }

}
