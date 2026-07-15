import DefaultDAO from "./default_dao.js";

class JornadaAulaDAO extends DefaultDAO {
    constructor(idJornada) {
        super();
        this.URL += `jornada/${idJornada}/aula/`;
    }

    /**
     * Busca en un conjunto de registros de jornada aula, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva jornada aula.
     * @param {JornadaAula} jornadaAula la jornada aula a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(jornadaAula) {
        return this._create(jornadaAula);
    }

    /**
     * Elimina una jornada aula por su id.
     * @param {string} id id de la jornada aula a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default JornadaAulaDAO;