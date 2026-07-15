import DefaultDAO from "./default_dao.js";

class PruebaJornadaAulaAspiranteOpcionExamenDAO extends DefaultDAO {
    constructor(idPrueba, idJornada, idAula, idAspiranteOpcion) {
        super();
        this.URL += `prueba/${idPrueba}/jornada/${idJornada}/aula/${idAula}/aspirante_opcion/${idAspiranteOpcion}/examen/`;
    }

    /**
     * Busca en un conjunto de registros de prueba jornada aula aspirante opcion examen, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea un nuevo prueba jornada aula aspirante opcion examen.
     * @param {PruebaJornadaAulaAspiranteOpcionExamen} pruebaJornadaAulaAspiranteOpcionExamen el prueba jornada aula aspirante opcion examen a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(pruebaJornadaAulaAspiranteOpcionExamen) {
        return this._create(pruebaJornadaAulaAspiranteOpcionExamen);
    }

    /**
     * Busca un prueba jornada aula aspirante opcion examen por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion examen a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza un prueba jornada aula aspirante opcion examen por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion examen a actualizar
     * @param {PruebaJornadaAulaAspiranteOpcionExamen} pruebaJornadaAulaAspiranteOpcionExamen el prueba jornada aula aspirante opcion examen con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, pruebaJornadaAulaAspiranteOpcionExamen) {
        return this._update(id, pruebaJornadaAulaAspiranteOpcionExamen);
    }

    /**
     * Elimina un prueba jornada aula aspirante opcion examen por su id.
     * @param {string} id id del prueba jornada aula aspirante opcion examen a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }
}

export default PruebaJornadaAulaAspiranteOpcionExamenDAO;