import DefaultDAO from "./default_dao.js";

class PruebaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "prueba/";
    }

    /**
     * Busca en un conjunto de registros de prueba, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva prueba.
     * @param {Prueba} prueba la prueba a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(prueba) {
        return this._create(prueba);
    }

    /**
     * Busca una prueba por su id.
     * @param {string} id id de la prueba a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza una prueba por su id.
     * @param {string} id id de la prueba a actualizar
     * @param {Prueba} prueba la prueba con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, prueba) {
        return this._update(id, prueba);
    }

    /**
     * Elimina una prueba por su id.
     * @param {string} id id de la prueba a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaDAO;