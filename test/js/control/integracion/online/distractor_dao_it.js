import * as chai from "../../../lib/chai/index.js";
import DistractorDAO from "../../../../../src/js/control/distractor_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import Distractor from "../../../../../src/js/entity/distractor.js";

mocha.setup("bdd");

describe("DistractorDAO Integration Tests - Online", function () {
  let cut;
  let idCreado;
  let distractorBase;

  // Este before se ejecuta antes de cualquier prueba de esta clase
  before(function () {
    cut = new DistractorDAO();

    distractorBase = new Distractor();
    distractorBase.valor = "Distractor de Prueba";
    distractorBase.activo = true;
    distractorBase.imagenUrl = "http://ejemplo.com/imagen.png";
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

  it("Debe crear una instancia de DistractorDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(DistractorDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos del distractor creado", function (done) {
      cut
        .create(distractorBase)
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
      const distractorInvalido = new Distractor();
      distractorInvalido.valor = null; // Valor vacío para provocar error
      cut
        .create(distractorInvalido)
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
      const distractorConId = new Distractor();
      distractorConId.idDistractor = "123e4567-e89b-12d3-a456-426614174000";
      distractorConId.valor = "Distractor de Prueba";
      cut
        .create(distractorConId)
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
    it("Debe retornar un DefaultResponse con un array de distractores y total_datos", function (done) {
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
    it("Debe retornar un DefaultResponse con el distractor encontrado", function (done) {
      cut
        .findById(idCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          const distractorObtenido = response.datos;
          chai.expect(distractorObtenido).to.have.property("idDistractor");
          chai.expect(distractorObtenido).to.have.property("valor");
          chai.expect(distractorObtenido.idDistractor).to.exist;
          chai.expect(distractorObtenido.valor).to.exist;
          chai.expect(distractorObtenido.idDistractor).to.equal(idCreado);
          chai.expect(distractorObtenido.valor).to.equal(distractorBase.valor);
          done();
        })
        .catch(done);
    });

    it("Debe rechazar si no se encuentra el distractor", function (done) {
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
    it("Debe actualizar el distractor creado y retornar un DefaultResponse con los datos actualizados", function (done) {
      const distractorActualizado = new Distractor();
      distractorActualizado.valor = "Distractor Actualizado";
      distractorActualizado.activo = false;
      distractorActualizado.imagenUrl = "http://ejemplo.com/nueva_imagen.png";

      cut
        .update(idCreado, distractorActualizado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("idDistractor");
          chai.expect(response.datos).to.have.property("valor");
          chai.expect(response.datos.idDistractor).to.equal(idCreado);
          chai.expect(response.datos.valor).to.equal("Distractor Actualizado");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar al intentar actualizar un distractor que no existe", function (done) {
      const distractorInexistente = new Distractor();
      distractorInexistente.valor = "Distractor Inexistente";

      cut
        .update("123e4567-e89b-12d3-a456-426614174999", distractorInexistente)
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
      const distractorInvalido = new Distractor();
      distractorInvalido.valor = null; // Valor vacío para provocar error

      cut
        .update(idCreado, distractorInvalido)
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

      const distractorActualizado = new Distractor();
      distractorActualizado.valor = "Distractor Actualizado";
      distractorActualizado.activo = false;
      distractorActualizado.imagenUrl = "http://ejemplo.com/nueva_imagen.png";

      cut
        .update(idCreado, distractorActualizado)
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
    it("Debe eliminar el distractor creado y rechazar al intentar encontrarlo", function (done) {
      cut
        .delete(idCreado)
        .then(() => {
          // Anulamos la variable global para que el hook 'after' no intente borrarla de nuevo y explote
          const idParaBuscar = idCreado;
          idCreado = null;

          cut
            .findById(idParaBuscar)
            .then(() => {
              done(new Error("El distractor debería haber sido eliminado"));
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

    it("Debe rechazar al intentar eliminar un distractor que no existe", function (done) {
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

mocha.run();
