import * as chai from "../../../lib/chai/index.js";
import DistractorDAO from "../../../../../src/js/control/distractor_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import Distractor from "../../../../../src/js/entity/distractor.js";

mocha.setup("bdd");

describe("DistractorDAO Integration Tests - Offline", function () {
  let cut;

  before(function () {
    cut = new DistractorDAO();
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
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
      const distractorActualizado = new Distractor();
      distractorActualizado.valor = "Distractor Actualizado";
      cut
        .update("123e4567-e89b-12d3-a456-426614174000", distractorActualizado)
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

mocha.run();
