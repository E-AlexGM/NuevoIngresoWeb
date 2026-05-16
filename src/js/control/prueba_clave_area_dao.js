import DefaultDAO from "./default_dao.js";

class PruebaClaveAreaDAO extends DefaultDAO {
    constructor(idPruebaClave, idArea) {
        super();
        this.URL += `prueba_clave/${idPruebaClave}/area/${idArea}/`;
    }

    /**
     * Busca en un conjunto de registros de prueba clave area, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo prueba clave area.
     * @param {PruebaClaveArea} pruebaClaveArea el prueba clave area a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaClaveArea) {
        return this._create(pruebaClaveArea);
    }

    /**
     * Busca un prueba clave area por su id.
     * @param {string} id id del prueba clave area a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un prueba clave area por su id.
     * @param {string} id id del prueba clave area a actualizar
     * @param {PruebaClaveArea} pruebaClaveArea el prueba clave area con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, pruebaClaveArea) {
        return this._update(id, pruebaClaveArea);
    }

    /**
     * Elimina un prueba clave area por su id.
     * @param {string} id id del prueba clave area a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaClaveAreaDAO;