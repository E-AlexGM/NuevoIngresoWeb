import * as chai from "../../../lib/chai/index.js";
import PreguntaDistractorDAO from "../../../../../src/js/control/pregunta_distractor_dao.js";
import PreguntaDistractor from "../../../../../src/js/entity/pregunta_distractor.js";

mocha.setup("bdd");

describe("PreguntaDistractorDAO - Offline Tests (Servidor Apagado)", function () {
  let cut;
  const idFicticio = "123e4567-e89b-12d3-a456-426614174000";

  before(function () {
    cut = new PreguntaDistractorDAO(idFicticio);
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const registro = new PreguntaDistractor();
      cut.create(registro)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: findRange()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut.findRange(0, 10)
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: delete()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut.delete(idFicticio)
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });
});

mocha.run();