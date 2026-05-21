import DefaultResponse from "../entity/default_response.js";
import DefaultError from "../entity/default_error.js";

class DefaultDAO {
  constructor() {
    this.BASE_URL = "http://localhost:9080/admision-api/v1/";
    this.URL = this.BASE_URL;
  }

  _findRange(first, max) {
    let salida = new Promise((resolve, reject) => {
      fetch(`${this.URL}?first=${first}&max=${max}`, { method: "GET" })
        .then((r) => {
          if (r.status === 200) {
            r.json()
              .then((j) => {
                let resp = new DefaultResponse();
                resp.datos = j;
                resp.total_datos = r.headers.get("Total-Records");
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

  _findById(id) {
    let salida = new Promise((resolve, reject) => {
      fetch(`${this.URL}${id}`, { method: "GET" })
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

  _create(objeto) {
  let salida = new Promise((resolve, reject) => {
    fetch(`${this.URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objeto),
    })
      .then((r) => {
        if (r.status === 201) {
          let resp = new DefaultResponse();
          resp.datos = {
            location: r.headers.get("Location"),
            id: r.headers.get("Location") ? r.headers.get("Location").split("/").pop() : null
          };
          resolve(resp);
        } else {
          let error = new DefaultError();
          error.mensaje = `Error al crear los datos: ${r.status}`;
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

  _update(id, entidad) {
      let salida = new Promise((resolve, reject) => {
        fetch(`${this.URL}${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entidad),
        })
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
              error.mensaje = `Error al modificar los datos: ${r.status}`;
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

  _delete(id) {
    let salida = new Promise((resolve, reject) => {
      fetch(`${this.URL}${id}`, {
        method: "DELETE",
      })
        .then((r) => {
          if (r.status === 204) {
            let resp = new DefaultResponse();
            resp.datos = null; 
            resolve(resp);
          } else {
            let error = new DefaultError();
            error.mensaje = `Error al eliminar los datos: ${r.status}`;
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


  findById(id) {
    throw new Error("Metodo no implementado");
  }

  findRange(first, max) {
    throw new Error("Metodo no implementado");
  }

  create(entidad) {
    throw new Error("Metodo no implementado");
  }

  update(id, entidad) {
    throw new Error("Metodo no implementado");
  }
  
  delete(id) {
    throw new Error("Metodo no implementado");
  }

}

export default DefaultDAO;
