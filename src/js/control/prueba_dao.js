import DefaultResponse from "../entity/default_response.js";
import DefaultError from "../entity/default_error.js";

import DefaultDAO from "./default_dao.js";

class PruebaDAO extends DefaultDAO {
    constructor() {
        super();
        this.URL += "prueba/";
    }

    /**
     * Busca en un conjunto de registros de prueba, especificando el primer registro a obtener y la cantidad maxima de registros a obtener.
     * @param {number} first primer registro a obtener
     * @param {number} max cantidad maxima de registros a obtener
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findRange(first, max) {
        return this._findRange(first, max);
    }

    /**
     * Crea una nueva prueba.
     * @param {Prueba} prueba la prueba a crear
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    create(prueba) {
        return this._create(prueba);
    }

    /**
     * Busca una prueba por su id.
     * @param {string} id id de la prueba a buscar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    findById(id) {
        return this._findById(id);
    }

    /**
     * Actualiza una prueba por su id.
     * @param {string} id id de la prueba a actualizar
     * @param {Prueba} prueba la prueba con los datos actualizados
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    update(id, prueba) {
        return this._update(id, prueba);
    }

    /**
     * Elimina una prueba por su id.
     * @param {string} id id de la prueba a eliminar
     * @returns {Promise<DefaultResponse, DefaultError>} una promesa que se resuelve con un DefaultResponse o se rechaza con un DefaultError
     */
    delete(id) {
        return this._delete(id);
    }

    list(activo){
        let salida = new Promise((resolve, reject) => {
        fetch(`${this.URL}?activo=${activo}`, { method: "GET" })
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

export default PruebaDAO;