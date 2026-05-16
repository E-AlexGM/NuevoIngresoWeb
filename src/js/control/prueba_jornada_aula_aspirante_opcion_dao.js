import DefaultDAO from "./default_dao.js";

class PruebaJornadaAulaAspiranteOpcionDAO extends DefaultDAO {
    constructor(idPrueba, idJornada, idAula, idAspiranteOpcion) {
        super();
        this.URL += `prueba/${idPrueba}/jornada/${idJornada}/aula/${idAula}/aspirante_opcion/${idAspiranteOpcion}/`;
    }

    /**
     * Busca en un conjunto de registros de prueba jornada aula aspirante opcion, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo prueba jornada aula aspirante opcion.
     * @param {PruebaJornadaAulaAspiranteOpcion} pruebaJornadaAulaAspiranteOpcion el prueba jornada aula aspirante opcion a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaJornadaAulaAspiranteOpcion) {
        return this._create(pruebaJornadaAulaAspiranteOpcion);
    }

    /**
     * Busca un prueba jornada aula aspirante opcion por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un prueba jornada aula aspirante opcion por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion a actualizar
     * @param {PruebaJornadaAulaAspiranteOpcion} pruebaJornadaAulaAspiranteOpcion el prueba jornada aula aspirante opcion con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, pruebaJornadaAulaAspiranteOpcion) {
        return this._update(id, pruebaJornadaAulaAspiranteOpcion);
    }

    /**
     * Elimina un prueba jornada aula aspirante opcion por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaJornadaAulaAspiranteOpcionDAO;