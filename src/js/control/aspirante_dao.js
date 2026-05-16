import DefaultDAO from "./default_dao.js";

class AspiranteDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "aspirante/";
    }

    /**
     * Busca en un conjunto de registros de aspirante, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo aspirante.
     * @param {Aspirante} aspirante el aspirante a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(aspirante) {
        return this._create(aspirante);
    }

    /**
     * Busca un aspirante por su id.
     * @param {string} id id del aspirante a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un aspirante por su id.
     * @param {string} id id del aspirante a actualizar
     * @param {Aspirante} aspirante el aspirante con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, aspirante) {
        return this._update(id, aspirante);
    }

    /**
     * Elimina un aspirante por su id.
     * @param {string} id id del aspirante a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default AspiranteDAO;