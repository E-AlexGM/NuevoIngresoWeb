import * as chai from "../../../lib/chai/index.js";
import AspiranteDAO from "../../../../../src/js/control/aspirante_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import Aspirante from "../../../../../src/js/entity/aspirante.js";

mocha.setup("bdd");

describe("AspiranteDAO Integration Tests - Offline", function () {
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
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
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
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
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
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
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
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
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
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });
});

mocha.run();
