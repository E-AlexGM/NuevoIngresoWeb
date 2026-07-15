import DefaultDAO from "./default_dao.js";

class PreguntaDistractorDAO extends DefaultDAO {
    constructor(idPregunta) {
        super();
        this.URL += `pregunta/${idPregunta}/distractor/`;
    }

    /**
     * Busca en un conjunto de registros de pregunta distractor, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo pregunta distractor.
     * @param {PreguntaDistractor} preguntaDistractor el registro a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(preguntaDistractor) {
        return this._create(preguntaDistractor);
    }

    /**
     * Elimina un pregunta distractor por su id.
     * @param {string} id id del registro a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PreguntaDistractorDAO;