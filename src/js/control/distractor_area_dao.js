import DefaultDAO from "./default_dao.js";

class DistractorAreaDAO extends DefaultDAO {
    constructor(idDistractor) {
        super();
        this.URL += `distractor/${idDistractor}/area/`;
    }

    /**
     * Busca en un conjunto de registros de distractor area, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo distractor area.
     * @param {DistractorArea} distractorArea el distractor area a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(distractorArea) {
        return this._create(distractorArea);
    }

    /**
     * Elimina un distractor area por su id.
     * @param {string} id id del distractor area a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default DistractorAreaDAO;