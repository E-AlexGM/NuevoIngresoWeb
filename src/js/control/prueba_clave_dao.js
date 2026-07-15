import DefaultDAO from "./default_dao.js";

class PruebaClaveDAO extends DefaultDAO {
    constructor(idPrueba) {
        super();
        this.URL += `prueba/${idPrueba}/clave/`;
    }

    /**
     * Busca en un conjunto de registros de prueba clave, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva prueba clave.
     * @param {PruebaClave} pruebaClave la prueba clave a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaClave) {
        return this._create(pruebaClave);
    }

    /**
     * Busca una prueba clave por su id.
     * @param {string} id id de la prueba clave a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Elimina una prueba clave por su id.
     * @param {string} id id de la prueba clave a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaClaveDAO;