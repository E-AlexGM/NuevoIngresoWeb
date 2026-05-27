import DefaultDAO from "./default_dao.js";

class CarreraDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "carrera/";
    }
    
    findRange(first, max) {
        return this._findRange(first, max);
    }
}

export default CarreraDAO;