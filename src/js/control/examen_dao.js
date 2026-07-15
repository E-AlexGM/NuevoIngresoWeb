import DefaultDAO from "./default_dao.js";
import DefaultResponse from "../entity/default_response.js";
import DefaultError from "../entity/default_error.js";


class ExamenDAO extends DefaultDAO {

    constructor() {
        super();
        this.URL += "examen/";
    }

  findByCorreo(correo) {
    let salida = new Promise((resolve, reject) => {
      fetch(`${this.URL}?correo=${correo}`, { method: "GET" })
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
export default ExamenDAO;