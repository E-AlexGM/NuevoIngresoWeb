import * as chai from "../../../lib/chai/index.js";
import PruebaClaveAreaDAO from "../../../../../src/js/control/prueba_clave_area_dao.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaClaveArea from "../../../../../src/js/entity/prueba_clave_area.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("PruebaClaveAreaDAO Integration Tests", function () {
  let cut;

  before(function () {
    cut = new PruebaClaveAreaDAO("123e4567-e89b-12d3-a456-426614174000");
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const pruebaClaveArea = new PruebaClaveArea();
      cut
        .create(pruebaClaveArea)
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
      const pruebaClaveArea = new PruebaClaveArea();
      cut
        .update("123e4567-e89b-12d3-a456-426614174000", pruebaClaveArea)
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
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
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
});

mocha.run();
