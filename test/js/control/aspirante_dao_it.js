import * as chai from "../lib/chai/index.js";
import AspiranteDAO from "../../../src/js/control/aspirante_dao.js";
import DefaultResponse from "../../../src/js/entity/default_response.js";
import Aspirante from "../../../src/js/entity/aspirante.js";
import { requiereServidor, requiereServidorApagado } from "./it_config.js";

mocha.setup("bdd");

describe("AspiranteDAO Integration Tests", function () {
  describe("Pruebas con servidor en línea", function () {
    requiereServidor();
    let cut;
    let idCreado;
    let aspiranteBase;

    // Este before se ejecuta antes de cualquier prueba de esta clase
    before(function () {
      cut = new AspiranteDAO();

      aspiranteBase = new Aspirante();
      aspiranteBase.nombres = "Juan Carlos";
      aspiranteBase.apellidos = "Pérez Gómez";
      aspiranteBase.fechaNacimiento = "2000-01-01";
      aspiranteBase.documentoIdentidad = "01234567-8";
      aspiranteBase.correo = "juan.perez@example.com";
      aspiranteBase.fechaCreacion = "2026-05-06T04:00:00-06:00";
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

    it("Debe crear una instancia de AspiranteDAO", function () {
      chai.expect(cut).to.be.an.instanceOf(AspiranteDAO);
    });

    // ==========================================
    // Método Create
    // ==========================================
    describe("Method: create()", function () {
      it("Debe retornar un DefaultResponse con los datos del aspirante creado", function (done) {
        cut
          .create(aspiranteBase)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("id");
            chai.expect(response.datos).to.have.property("location");
            chai.expect(response.datos.id).to.exist;
            idCreado = response.datos.id;
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar leyendo el header Process-Error cuando falla la creación (500)", function (done) {
        const aspiranteInvalido = new Aspirante();
        aspiranteInvalido.nombres = null; 
        
        cut
          .create(aspiranteInvalido)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al crear los datos");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe echazar cuando se envía entidad con id (400)", function (done) {
        const aspiranteConId = new Aspirante();
        aspiranteConId.idAspirante = "123e4567-e89b-12d3-a456-426614174000";
        aspiranteConId.nombres = "Nombre con ID";
        
        cut
          .create(aspiranteConId)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al crear los datos: 400");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });

    // ==========================================
    // Método FindRange
    // ==========================================
    describe("Method: findRange()", function () {
      it("Debe retornar un DefaultResponse con un array de aspirantes y total_datos", function (done) {
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
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si se mandan parámetros inválidos", function (done) {
        cut
          .findRange(-1, -5)
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al obtener los datos: 400");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
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
              chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto");
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
      it("Debe retornar un DefaultResponse con el aspirante encontrado", function (done) {
        cut
          .findById(idCreado)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            const aspiranteObtenido = response.datos;
            chai.expect(aspiranteObtenido).to.have.property("idAspirante");
            chai.expect(aspiranteObtenido).to.have.property("nombres");
            chai.expect(aspiranteObtenido).to.have.property("correo");
            chai.expect(aspiranteObtenido.idAspirante).to.equal(idCreado);
            chai.expect(aspiranteObtenido.nombres).to.equal(aspiranteBase.nombres);
            chai.expect(aspiranteObtenido.correo).to.equal(aspiranteBase.correo);
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si no se encuentra el aspirante", function (done) {
        cut
          .findById("123e4567-e89b-12d3-a456-426614174999")
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al obtener los datos: 404");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si se manda un id inválido", function (done) {
        cut
          .findById("id-invalido")
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al obtener los datos");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
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
              chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto");
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
      it("Debe actualizar el aspirante creado y retornar un DefaultResponse con los datos actualizados", function (done) {
        const aspiranteActualizado = new Aspirante();
        aspiranteActualizado.nombres = "Juan Carlos Editado";
        aspiranteActualizado.apellidos = "Pérez Gómez";
        aspiranteActualizado.fechaNacimiento = "2000-01-01";
        aspiranteActualizado.documentoIdentidad = "01234567-8";
        aspiranteActualizado.correo = "juan.editado@example.com";
        aspiranteActualizado.fechaCreacion = "2026-05-06T04:00:00-06:00";

        cut
          .update(idCreado, aspiranteActualizado)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("idAspirante");
            chai.expect(response.datos).to.have.property("nombres");
            chai.expect(response.datos.idAspirante).to.equal(idCreado);
            chai.expect(response.datos.nombres).to.equal("Juan Carlos Editado");
            chai.expect(response.datos.correo).to.equal("juan.editado@example.com");
            done();
          })
          .catch((e) => done(new Error(`El servidor rechazó la conexión o devolvió error: ${e.mensaje || e}`)));
      });

      it("Debe rechazar al intentar actualizar un aspirante que no existe", function (done) {
        const aspiranteInexistente = new Aspirante();
        aspiranteInexistente.nombres = "No Existo";
        aspiranteInexistente.apellidos = "Fantasma";

        cut
          .update("123e4567-e89b-12d3-a456-426614174999", aspiranteInexistente)
          .then(() => {
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al modificar los datos: 404");
            done();
          })
          .catch((e) => done(new Error(e.message || e.mensaje)));
      });

      it("Debe rechazar al intentar actualizar con datos inválidos", function (done) {
        const aspiranteInvalido = new Aspirante();
        aspiranteInvalido.nombres = null; 

        cut
          .update(idCreado, aspiranteInvalido)
          .then(() => {
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al modificar los datos");
            done();
          })
          .catch((e) => done(new Error(e.message || e.mensaje)));
      });

      it("Debe rechazar error al parsear los datos al actualizar", function (done) {
        const originalJson = Response.prototype.json;
        Response.prototype.json = function () {
          return Promise.reject(new Error("Simulado: JSON corrupto"));
        };

        const aspiranteActualizado = new Aspirante();
        aspiranteActualizado.nombres = "Juan Carlos Editado";
        aspiranteActualizado.apellidos = "Pérez Gómez";
        aspiranteActualizado.fechaNacimiento = "2000-01-01";
        aspiranteActualizado.documentoIdentidad = "01234567-8";
        aspiranteActualizado.correo = "juan.editado@example.com";
        aspiranteActualizado.fechaCreacion = "2026-05-06T04:00:00-06:00";

        cut
          .update(idCreado, aspiranteActualizado)
          .then(() => {
            Response.prototype.json = originalJson;
            done(new Error("La actualización debería haber fallado"));
          })
          .catch((error) => {
            Response.prototype.json = originalJson;
            try {
              chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto");
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
      it("Debe eliminar el aspirante creado y rechazar al intentar encontrarlo", function (done) {
        cut
          .delete(idCreado)
          .then(() => {
            const idParaBuscar = idCreado;
            idCreado = null; // Evitar que el hook 'after' intente borrarlo otra vez

            cut
              .findById(idParaBuscar)
              .then(() => {
                done(new Error("El aspirante debería haber sido eliminado"));
              })
              .catch((error) => {
                chai.expect(error).to.have.property("mensaje");
                chai.expect(error.mensaje).to.include("Error al obtener los datos: 404");
                done();
              })
              .catch((e) => done(new Error(e.mensaje || e)));
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar al intentar eliminar un aspirante que no existe", function (done) {
        cut
          .delete("123e4567-e89b-12d3-a456-426614174999")
          .then(() => {
            done(new Error("La eliminación debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });
  });

  // ==========================================
  // Pruebas Offline
  // ==========================================
  describe("Pruebas con servidor apagado", function () {
    requiereServidorApagado();
    let cut;

    before(function () {
      cut = new AspiranteDAO();
    });

    describe("Method: create()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const aspirante = new Aspirante();
        cut
          .create(aspirante)
          .then(() => done(new Error("La creación debería haber fallado")))
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });

    describe("Method: findRange()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .findRange(0, 10)
          .then(() => done(new Error("La consulta debería haber fallado")))
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });

    describe("Method: findById()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .findById("123e4567-e89b-12d3-a456-426614174000")
          .then(() => done(new Error("La consulta debería haber fallado")))
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });

    describe("Method: update()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const aspirante = new Aspirante();
        cut
          .update("123e4567-e89b-12d3-a456-426614174000", aspirante)
          .then(() => done(new Error("La actualización debería haber fallado")))
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });

    describe("Method: delete()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        cut
          .delete("123e4567-e89b-12d3-a456-426614174000")
          .then(() => done(new Error("La eliminación debería haber fallado")))
          .catch((error) => {
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });
  });
});

mocha.run();