import * as chai from "../../../lib/chai/index.js";
import PreguntaAreaDAO from "../../../../../src/js/control/pregunta_area_dao.js";
import PreguntaDAO from "../../../../../src/js/control/pregunta_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PreguntaArea from "../../../../../src/js/entity/pregunta_area.js";
import Pregunta from "../../../../../src/js/entity/pregunta.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("PreguntaAreaDAO Integration Tests - Offline", function () {
  let cut;

  before(function () {
    cut = new PreguntaAreaDAO("123e4567-e89b-12d3-a456-426614174000");
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const preguntaArea = new PreguntaArea();
      cut
        .create(preguntaArea)
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
        .catch((e) => done(new Error(e.mensaje || e)));
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
        .catch((e) => done(new Error(e.mensaje || e)));
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
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });
});

mocha.run();
