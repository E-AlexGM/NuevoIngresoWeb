import DefaultDAO from "./default_dao.js";

class PruebaJornadaDAO extends DefaultDAO {
    constructor(idPrueba) {
        super();
        this.URL += `prueba/${idPrueba}/jornada/`;
    }

    // Todo falta implementar en el BE
    /**
     * Busca en un conjunto de registros de prueba jornada, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     
    findRange(first, max) {
        return this._findRange(first, max);
    }*/ 

    /**
     * Crea una nueva prueba jornada.
     * @param {PruebaJornada} pruebaJornada la prueba jornada a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaJornada) {
        return this._create(pruebaJornada);
    }

    /**
     * Elimina una prueba jornada por su id.
     * @param {string} id id de la prueba jornada a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaJornadaDAO;