import DefaultDAO from "./default_dao.js";
// Comentario de prueba pipeline
class AreaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "area/";
    }
    
    /**
     * Busca en un conjunto de registros de area, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo area.
     * @param {Area} area el area a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(area) {
        return this._create(area);
    }

    /**
     * Busca un area por su id.
     * @param {string} id id del area a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError  
     */

    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un area por su id.
     * @param {string} id id del area a actualizar
     * @param {Area} area el area con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, area) {
        return this._update(id, area);
    }

    /**
     * Elimina un area por su id.
     * @param {string} id id del area a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default AreaDAO;