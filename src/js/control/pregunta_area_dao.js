import DefaultDAO from "./default_dao.js";

class PreguntaAreaDAO extends DefaultDAO {
    constructor(idPregunta) {
        super();
        this.URL += `pregunta/${idPregunta}/area/`;
    }

    /**
     * Busca en un conjunto de registros de pregunta area, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva pregunta area.
     * @param {PreguntaArea} preguntaArea la pregunta area a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(preguntaArea) {
        return this._create(preguntaArea);
    }

    /**
     * Elimina una pregunta area por su id.
     * @param {string} id id de la pregunta area a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PreguntaAreaDAO;