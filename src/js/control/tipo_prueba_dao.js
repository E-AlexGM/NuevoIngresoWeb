import DefaultDAO from "./default_dao.js";

class TipoPruebaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "tipo_prueba/";
    }

    /**
     * Busca en un conjunto de registros de tipo prueba, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo tipo prueba.
     * @param {TipoPrueba} tipoPrueba el tipo prueba a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(tipoPrueba) {
        return this._create(tipoPrueba);
    }

    /**
     * Busca un tipo prueba por su id.
     * @param {string} id id del tipo prueba a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un tipo prueba por su id.
     * @param {string} id id del tipo prueba a actualizar
     * @param {TipoPrueba} tipoPrueba el tipo prueba con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, tipoPrueba) {
        return this._update(id, tipoPrueba);
    }

    /**
     * Elimina un tipo prueba por su id.
     * @param {string} id id del tipo prueba a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default TipoPruebaDAO;