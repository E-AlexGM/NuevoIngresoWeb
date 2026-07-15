import DefaultDAO from "./default_dao.js";

class PruebaClaveAreaPreguntaDistractorDAO extends DefaultDAO {
    constructor(idPruebaClave, idArea, idPregunta) {
        super();
        this.URL += `prueba_clave/${idPruebaClave}/area/${idArea}/pregunta/${idPregunta}/distractor/`;
    }

    /**
     * Busca en un conjunto de registros de prueba clave area pregunta distractor, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo prueba clave area pregunta distractor.
     * @param {PruebaClaveAreaPreguntaDistractor} pruebaClaveAreaPreguntaDistractor el prueba clave area pregunta distractor a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaClaveAreaPreguntaDistractor) {
        return this._create(pruebaClaveAreaPreguntaDistractor);
    }

    /**
     * Elimina un prueba clave area pregunta distractor por su id.
     * @param {string} id id del prueba clave area pregunta distractor a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaClaveAreaPreguntaDistractorDAO;