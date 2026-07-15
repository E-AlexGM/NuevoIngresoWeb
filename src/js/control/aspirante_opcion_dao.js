import DefaultDAO from "./default_dao.js";

class AspiranteOpcionDAO extends DefaultDAO {
    constructor(idAspirante) {
        super();
        this.URL += `aspirante/${idAspirante}/opcion/`;
    }

    /**
     * Busca en un conjunto de registros de aspirante opcion, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva aspirante opcion.
     * @param {AspiranteOpcion} aspiranteOpcion la aspirante opcion a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(aspiranteOpcion) {
        return this._create(aspiranteOpcion);
    }

    /**
     * Busca una aspirante opcion por su id.
     * @param {string} id id de la aspirante opcion a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza una aspirante opcion por su id.
     * @param {string} id id de la aspirante opcion a actualizar
     * @param {AspiranteOpcion} aspiranteOpcion la aspirante opcion con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, aspiranteOpcion) {
        return this._update(id, aspiranteOpcion);
    }

    /**
     * Elimina una aspirante opcion por su id.
     * @param {string} id id de la aspirante opcion a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default AspiranteOpcionDAO;