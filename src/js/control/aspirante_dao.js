import DefaultDAO from "./default_dao.js";
import DefaultResponse from "../entity/default_response.js";
import DefaultError from "../entity/default_error.js";

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

    findByEmail(correo) {
        let salida = new Promise((resolve, reject) => {
            fetch(`${this.URL}buscar?correo=${correo}`, { method: "GET" })
                .then((r) => {
                    if (r.status === 200) {
                        r.json()
                        .then((j) => {
                            let resp = new DefaultResponse();
                            resp.datos = j;
                            resolve(resp);
                        })
                        .catch((e) => {
                            let error = new DefaultError();
                            error.mensaje = `Error al parsear los datos: ${e.message}`;
                            error.error = e;
                            reject(error);
                        });
                    } else {
                        let error = new DefaultError();
                        error.mensaje = `Error al obtener los datos: ${r.status}`;
                        error.error = r;
                        reject(error);
                    }
            })
            .catch((e) => {
                let error = new DefaultError();
                error.mensaje = `Error al acceder al repositorio`;
                error.error = e;
                reject(error);
            });
        });
        return salida;
    }

}

export default AspiranteDAO;