import * as chai from "../lib/chai/index.js";
import JornadaDAO from "../../../src/js/control/jornada_dao.js";
import DefaultResponse from "../../../src/js/entity/default_response.js";
import Jornada from "../../../src/js/entity/jornada.js";
import { requiereServidor, requiereServidorApagado } from "./it_config.js";

mocha.setup("bdd");

describe("JornadaDAO Integration Tests", function () {
  describe("Pruebas con servidor en línea", function () {
    requiereServidor();
    let cut;
    let idCreado;
    let jornadaBase;

    // Este before se ejecuta antes de cualquier prueba de esta clase
    before(function () {
      cut = new JornadaDAO();

      jornadaBase = new Jornada();
      jornadaBase.nombre = "Jornada de Prueba";
      jornadaBase.fechaInicio = "2026-05-10T02:00:00-06:00";
      jornadaBase.fechaFin = "2026-05-10T06:00:00-06:00";
    });

    // Limpieza final
    after(function (done) {
      if (idCreado) {
        cut
          .delete(idCreado)
          .then(() => {
            console.log("Limpieza de integración completada.");
            done();
          })
          .catch(done);
      } else {
        done();
      }
    });

    it("Debe crear una instancia de JornadaDAO", function () {
      chai.expect(cut).to.be.an.instanceOf(JornadaDAO);
    });

    // ==========================================
    // Método Create
    // ==========================================
    describe("Method: create()", function () {
      it("Debe retornar un DefaultResponse con los datos de la jornada creada", function (done) {
        cut
          .create(jornadaBase)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("id");
            chai.expect(response.datos).to.have.property("location");
            chai.expect(response.datos.id).to.exist;
            chai.expect(response.datos.location).to.exist;
            idCreado = response.datos.id;
            chai.expect(idCreado).to.exist;
            done();
          })
          .catch(done);
      });

      it("Debe rechazar leyendo el header Process-Error cuando falla la creación (500)", function (done) {
        const jornadaInvalida = new Jornada();
        jornadaInvalida.nombre = null; // Nombre vacío para provocar error
        cut
          .create(jornadaInvalida)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al crear los datos: 500");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar cuando se envía entidad con id (400)", function (done) {
        const jornadaConId = new Jornada();
        jornadaConId.idJornada = "123e4567-e89b-12d3-a456-426614174000";
        jornadaConId.nombre = "Jornada de Prueba";
        cut
          .create(jornadaConId)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al crear los datos: 400");
            done();
          })
          .catch(done);
      });
    });

    // ==========================================
    // Método FindRange
    // ==========================================
    describe("Method: findRange()", function () {
      it("Debe retornar un DefaultResponse con un array de jornadas y total_datos", function (done) {
        cut
          .findRange(0, 10)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("array");
            chai.expect(response).to.have.property("total_datos");
            chai.expect(response.total_datos).to.be.a("string");
            chai.expect(response.datos).to.have.length.above(0);
            done();
          })
          .catch(done);
      });

      it("Debe rechazar si se mandan parámetros inválidos", function (done) {
        cut
          .findRange(-1, -5)
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al obtener los datos: 400");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar error al parsear los datos al consultar un rango", function (done) {
        const originalJson = Response.prototype.json;
        Response.prototype.json = function () {
          return Promise.reject(new Error("Simulado: JSON corrupto"));
        };

        cut
          .findRange(0, 10)
          .then(() => {
            Response.prototype.json = originalJson;
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            Response.prototype.json = originalJson;

            try {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include(
                  "Error al parsear los datos: Simulado: JSON corrupto",
                );
              done();
            } catch (assertError) {
              done(assertError);
            }
          });
      });
    });

    // ==========================================
    // Método FindById
    // ==========================================
    describe("Method: findById()", function () {
      it("Debe retornar un DefaultResponse con la jornada encontrada", function (done) {
        cut
          .findById(idCreado)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            const jornadaObtenida = response.datos;
            chai.expect(jornadaObtenida).to.have.property("idJornada");
            chai.expect(jornadaObtenida).to.have.property("nombre");
            chai.expect(jornadaObtenida.idJornada).to.exist;
            chai.expect(jornadaObtenida.nombre).to.exist;
            chai.expect(jornadaObtenida.idJornada).to.equal(idCreado);
            chai.expect(jornadaObtenida.nombre).to.equal(jornadaBase.nombre);
            done();
          })
          .catch(done);
      });

      it("Debe rechazar si no se encuentra la jornada", function (done) {
        cut
          .findById("123e4567-e89b-12d3-a456-426614174999")
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al obtener los datos: 404");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar si se manda un id inválido", function (done) {
        cut
          .findById("id-invalido")
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al obtener los datos: 500");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar error al parsear los datos", function (done) {
        const originalJson = Response.prototype.json;
        Response.prototype.json = function () {
          return Promise.reject(new Error("Simulado: JSON corrupto"));
        };

        cut
          .findById(idCreado)
          .then(() => {
            Response.prototype.json = originalJson;
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            Response.prototype.json = originalJson;

            try {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include(
                  "Error al parsear los datos: Simulado: JSON corrupto",
                );
              done(); // Test exitoso
            } catch (assertError) {
              done(assertError); // Si la aserción de Chai falla, se le pasa a Mocha
            }
          });
      });
    });

    // ==========================================
    // Método Update
    // ==========================================
    describe("Method: update()", function () {
      it("Debe actualizar la jornada creada y retornar un DefaultResponse con los datos actualizados", function (done) {
        const jornadaActualizada = new Jornada();
        jornadaActualizada.nombre = "Jornada Actualizada";
        jornadaActualizada.fechaInicio = "2026-05-10T02:00:00-06:00";
        jornadaActualizada.fechaFin = "2026-05-10T06:00:00-06:00";

        cut
          .update(idCreado, jornadaActualizada)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("idJornada");
            chai.expect(response.datos).to.have.property("nombre");
            chai.expect(response.datos.idJornada).to.equal(idCreado);
            chai.expect(response.datos.nombre).to.equal("Jornada Actualizada");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar al intentar actualizar una jornada que no existe", function (done) {
        const jornadaInexistente = new Jornada();
        jornadaInexistente.nombre = "Jornada Inexistente";

        cut
          .update("123e4567-e89b-12d3-a456-426614174999", jornadaInexistente)
          .then(() => {
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al modificar los datos: 404");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar al intentar actualizar con datos inválidos", function (done) {
        const jornadaInvalida = new Jornada();
        jornadaInvalida.nombre = null; // Nombre vacío para provocar error

        cut
          .update(idCreado, jornadaInvalida)
          .then(() => {
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al modificar los datos: 500");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar error al parsear los datos al actualizar", function (done) {
        const originalJson = Response.prototype.json;
        Response.prototype.json = function () {
          return Promise.reject(new Error("Simulado: JSON corrupto"));
        };

        const jornadaActualizada = new Jornada();
        jornadaActualizada.nombre = "Jornada Actualizada";
        jornadaActualizada.fechaInicio = "2026-05-10T02:00:00-06:00";
        jornadaActualizada.fechaFin = "2026-05-10T06:00:00-06:00";
        cut
          .update(idCreado, jornadaActualizada)
          .then(() => {
            Response.prototype.json = originalJson;
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            Response.prototype.json = originalJson;

            try {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include(
                  "Error al parsear los datos: Simulado: JSON corrupto",
                );
              done();
            } catch (assertError) {
              done(assertError);
            }
          });
      });
    });

    // ==========================================
    // Método Delete
    // ==========================================
    describe("Method: delete()", function () {
      it("Debe eliminar la jornada creada y rechazar al intentar encontrarla", function (done) {
        cut
          .delete(idCreado)
          .then(() => {
            // Anulamos la variable global para que el hook 'after' no intente borrarla de nuevo y explote
            const idParaBuscar = idCreado;
            idCreado = null;

            cut
              .findById(idParaBuscar)
              .then(() => {
                done(new Error("La jornada debería haber sido eliminada"));
              })
              .catch((error) => {
                chai.expect(error).to.have.property("mensaje");
                chai
                  .expect(error.mensaje)
                  .to.include("Error al obtener los datos: 404");
                done();
              })
              .catch(done);
          })
          .catch(done);
      });

      it("Debe rechazar al intentar eliminar una jornada que no existe", function (done) {
        cut
          .delete("123e4567-e89b-12d3-a456-426614174999")
          .then(() => {
            done(new Error("La eliminación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al eliminar los datos: 404");
            done();
          })
          .catch(done);
      });
    });
  });

  describe("Pruebas con servidor apagado", function () {
    requiereServidorApagado();
    let cut;

    before(function () {
      cut = new JornadaDAO();
    });

    describe("Method: create()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const jornadaInvalida = new Jornada();
        jornadaInvalida.nombre = null; // Nombre vacío para provocar error
        cut
          .create(jornadaInvalida)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al acceder al repositorio");
            done();
          })
          .catch(done);
      });
    });

    describe("Method: findRange()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .findRange(0, 10)
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al acceder al repositorio");
            done();
          })
          .catch(done);
      });
    });

    describe("Method: findById()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .findById("123e4567-e89b-12d3-a456-426614174000")
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al acceder al repositorio");
            done();
          })
          .catch(done);
      });
    });

    describe("Method: update()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const jornadaActualizada = new Jornada();
        jornadaActualizada.nombre = "Jornada Actualizada";
        cut
          .update("123e4567-e89b-12d3-a456-426614174000", jornadaActualizada)
          .then(() => {
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al acceder al repositorio");
            done();
          })
          .catch(done);
      });
    });

    describe("Method: delete()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .delete("123e4567-e89b-12d3-a456-426614174000")
          .then(() => done(new Error("La eliminación debería haber fallado")))
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include("Error al acceder al repositorio");
            done();
          })
          .catch(done);
      });
    });
  });
});

mocha.run();
