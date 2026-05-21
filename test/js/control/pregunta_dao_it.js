import * as chai from "../lib/chai/index.js";
import PreguntaDAO from "../../../src/js/control/pregunta_dao.js";
import DefaultResponse from "../../../src/js/entity/default_response.js";
import Pregunta from "../../../src/js/entity/pregunta.js";
import { requiereServidor, requiereServidorApagado } from "./it_config.js";

mocha.setup("bdd");

describe("PreguntaDAO Integration Tests", function () {
  describe("Pruebas con servidor en línea", function () {
    requiereServidor();
    let cut;
    let idCreado;
    let preguntaBase;

    // Este before se ejecuta antes de cualquier prueba de esta clase
    before(function () {
      cut = new PreguntaDAO();

      preguntaBase = new Pregunta();
      preguntaBase.valor = "Pregunta de Prueba";
      preguntaBase.activo = true;
    });

    // Limpieza final
    after(function (done) {
      if (idCreado) {
        cut
          .delete(idCreado)
          .then(() => {
            done();
          })
          .catch(done);
      } else {
        done();
      }
    });

    it("Debe crear una instancia de PreguntaDAO", function () {
      chai.expect(cut).to.be.an.instanceOf(PreguntaDAO);
    });

    // ==========================================
    // Método Create
    // ==========================================
    describe("Method: create()", function () {
      it("Debe retornar un DefaultResponse con los datos de la pregunta creada", function (done) {
        cut
          .create(preguntaBase)
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
        const preguntaInvalida = new Pregunta();
        preguntaInvalida.valor = null; // Valor vacío para provocar error
        cut
          .create(preguntaInvalida)
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
        const preguntaConId = new Pregunta();
        preguntaConId.idPregunta = "123e4567-e89b-12d3-a456-426614174000";
        preguntaConId.valor = "Pregunta de Prueba";
        cut
          .create(preguntaConId)
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
      it("Debe retornar un DefaultResponse con un array de preguntas y total_datos", function (done) {
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
      it("Debe retornar un DefaultResponse con la pregunta encontrada", function (done) {
        cut
          .findById(idCreado)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            const preguntaObtenida = response.datos;
            chai.expect(preguntaObtenida).to.have.property("idPregunta");
            chai.expect(preguntaObtenida).to.have.property("valor");
            chai.expect(preguntaObtenida.idPregunta).to.exist;
            chai.expect(preguntaObtenida.valor).to.exist;
            chai.expect(preguntaObtenida.idPregunta).to.equal(idCreado);
            chai.expect(preguntaObtenida.valor).to.equal(preguntaBase.valor);
            done();
          })
          .catch(done);
      });

      it("Debe rechazar si no se encuentra la pregunta", function (done) {
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
              done();
            } catch (assertError) {
              done(assertError);
            }
          });
      });
    });

    // ==========================================
    // Método Update
    // ==========================================
    describe("Method: update()", function () {
      it("Debe actualizar la pregunta creada y retornar un DefaultResponse con los datos actualizados", function (done) {
        const preguntaActualizada = new Pregunta();
        preguntaActualizada.valor = "Pregunta Actualizada";
        preguntaActualizada.activo = false;

        cut
          .update(idCreado, preguntaActualizada)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("idPregunta");
            chai.expect(response.datos).to.have.property("valor");
            chai.expect(response.datos.idPregunta).to.equal(idCreado);
            chai.expect(response.datos.valor).to.equal("Pregunta Actualizada");
            done();
          })
          .catch(done);
      });

      it("Debe rechazar al intentar actualizar una pregunta que no existe", function (done) {
        const preguntaInexistente = new Pregunta();
        preguntaInexistente.valor = "Pregunta Inexistente";

        cut
          .update("123e4567-e89b-12d3-a456-426614174999", preguntaInexistente)
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
        const preguntaInvalida = new Pregunta();
        preguntaInvalida.valor = null; // Valor vacío para provocar error

        cut
          .update(idCreado, preguntaInvalida)
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

        const preguntaActualizada = new Pregunta();
        preguntaActualizada.valor = "Pregunta Actualizada";
        preguntaActualizada.activo = false;

        cut
          .update(idCreado, preguntaActualizada)
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
      it("Debe eliminar la pregunta creada y rechazar al intentar encontrarla", function (done) {
        cut
          .delete(idCreado)
          .then(() => {
            // Anulamos la variable global para que el hook 'after' no intente borrarla de nuevo
            const idParaBuscar = idCreado;
            idCreado = null;

            cut
              .findById(idParaBuscar)
              .then(() => {
                done(new Error("La pregunta debería haber sido eliminada"));
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

      it("Debe rechazar al intentar eliminar una pregunta que no existe", function (done) {
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
      cut = new PreguntaDAO();
    });

    describe("Method: create()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const preguntaInvalida = new Pregunta();
        preguntaInvalida.valor = null; // Valor vacío para provocar error
        cut
          .create(preguntaInvalida)
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
        const preguntaActualizada = new Pregunta();
        preguntaActualizada.valor = "Pregunta Actualizada";
        cut
          .update("123e4567-e89b-12d3-a456-426614174000", preguntaActualizada)
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