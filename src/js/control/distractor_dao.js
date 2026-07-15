import DefaultDAO from "./default_dao.js";

class DistractorDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "distractor/";
    }

    /**
     * Busca en un conjunto de registros de distractor, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo distractor.
     * @param {Distractor} distractor el distractor a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(distractor) {
        return this._create(distractor);
    }

    /**
     * Busca un distractor por su id.
     * @param {string} id id del distractor a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un distractor por su id.
     * @param {string} id id del distractor a actualizar
     * @param {Distractor} distractor el distractor con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, distractor) {
        return this._update(id, distractor);
    }

    /**
     * Elimina un distractor por su id.
     * @param {string} id id del distractor a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default DistractorDAO;