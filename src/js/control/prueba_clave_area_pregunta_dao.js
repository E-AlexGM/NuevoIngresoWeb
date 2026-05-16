import DefaultDAO from "./default_dao.js";

class PruebaClaveAreaPreguntaDAO extends DefaultDAO {
    constructor(idPruebaClave, idArea, idPregunta) {
        super();
        this.URL += `prueba_clave/${idPruebaClave}/area/${idArea}/pregunta/${idPregunta}/`;
    }

    /**
     * Busca en un conjunto de registros de prueba clave area pregunta, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo prueba clave area pregunta.
     * @param {PruebaClaveAreaPregunta} pruebaClaveAreaPregunta el prueba clave area pregunta a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaClaveAreaPregunta) {
        return this._create(pruebaClaveAreaPregunta);
    }

    /**
     * Busca un prueba clave area pregunta por su id.
     * @param {string} id id del prueba clave area pregunta a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un prueba clave area pregunta por su id.
     * @param {string} id id del prueba clave area pregunta a actualizar
     * @param {PruebaClaveAreaPregunta} pruebaClaveAreaPregunta el prueba clave area pregunta con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, pruebaClaveAreaPregunta) {
        return this._update(id, pruebaClaveAreaPregunta);
    }

    /**
     * Elimina un prueba clave area pregunta por su id.
     * @param {string} id id del prueba clave area pregunta a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaClaveAreaPreguntaDAO;