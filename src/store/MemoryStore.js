class MemoryStore {

    constructor(){
        this.offers = new Map();
    }

    set(id, value){
        this.offers.set(id, value);
    }

    get(id){

        if (this.offers.has(id)) {
            return this.offers.get(id);
        }

        return null;
    }

    del(id) {
        if (this.offers.has(id)) {
            this.messages.delete(id);
            return true;
        }

        return false;
    }
}


module.exports = MemoryStore ;
