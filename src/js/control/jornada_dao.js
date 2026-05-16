import DefaultDAO from "./default_dao.js";

class JornadaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "jornada/";
    }

    /**
     * Busca en un conjunto de registros de jornada, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva jornada.
     * @param {Jornada} jornada la jornada a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(jornada) {
        return this._create(jornada);
    }

    /**
     * Busca una jornada por su id.
     * @param {string} id id de la jornada a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza una jornada por su id.
     * @param {string} id id de la jornada a actualizar
     * @param {Jornada} jornada la jornada con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, jornada) {
        return this._update(id, jornada);
    }

    /**
     * Elimina una jornada por su id.
     * @param {string} id id de la jornada a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default JornadaDAO;
