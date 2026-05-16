import DefaultDAO from "./default_dao.js";

class PreguntaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "pregunta/";
    }

    /**
     * Busca en un conjunto de registros de pregunta, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva pregunta.
     * @param {Pregunta} pregunta la pregunta a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pregunta) {
        return this._create(pregunta);
    }

    /**
     * Busca una pregunta por su id.
     * @param {string} id id de la pregunta a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza una pregunta por su id.
     * @param {string} id id de la pregunta a actualizar
     * @param {Pregunta} pregunta la pregunta con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, pregunta) {
        return this._update(id, pregunta);
    }

    /**
     * Elimina una pregunta por su id.
     * @param {string} id id de la pregunta a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PreguntaDAO;