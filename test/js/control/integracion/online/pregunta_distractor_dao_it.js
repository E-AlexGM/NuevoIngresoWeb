import * as chai from "../../../lib/chai/index.js";
import PreguntaDistractorDAO from "../../../../../src/js/control/pregunta_distractor_dao.js";
import PreguntaDAO from "../../../../../src/js/control/pregunta_dao.js";
import PreguntaAreaDAO from "../../../../../src/js/control/pregunta_area_dao.js";
import DistractorDAO from "../../../../../src/js/control/distractor_dao.js";
import DistractorAreaDAO from "../../../../../src/js/control/distractor_area_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PreguntaDistractor from "../../../../../src/js/entity/pregunta_distractor.js";
import PreguntaArea from "../../../../../src/js/entity/pregunta_area.js";
import Pregunta from "../../../../../src/js/entity/pregunta.js";
import Distractor from "../../../../../src/js/entity/distractor.js";
import DistractorArea from "../../../../../src/js/entity/distractor_area.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("PreguntaDistractorDAO Integration Tests - Online", function () {
  let cut;
  let preguntaDAO;
  let preguntaAreaDAO;
  let distractorDAO;
  let distractorAreaDAO;
  let areaDAO;

  let idPreguntaCreado;
  let idDistractorCreado;
  let idAreaCreado;
  let idPreguntaAreaCreado;
  let idDistractorAreaCreado;
  let idPreguntaDistractorCreado;

  let preguntaDistractorBase;

  before(function (done) {
    preguntaDAO = new PreguntaDAO();
    distractorDAO = new DistractorDAO();
    areaDAO = new AreaDAO();

    // Crear Área (dependencia común)
    const areaPadre = new Area();
    areaPadre.nombre = "Area Padre para Pregunta Distractor";

    // Crear entidades base
    const preguntaPadre = new Pregunta();
    preguntaPadre.enunciado = "¿Cual es la capital de Francia?";
    preguntaPadre.activo = true;

    const distractorPadre = new Distractor();
    distractorPadre.valor = "Distractor para Pregunta";
    distractorPadre.activo = true;

    // Crear primero el Área
    areaDAO
      .create(areaPadre)
      .then((responseA) => {
        idAreaCreado = responseA.datos.id;
        areaPadre.idArea = idAreaCreado;

        // Crear Pregunta
        return preguntaDAO.create(preguntaPadre);
      })
      .then((responseP) => {
        idPreguntaCreado = responseP.datos.id;

        // Vincular Pregunta con Area
        preguntaAreaDAO = new PreguntaAreaDAO(idPreguntaCreado);
        const preguntaArea = new PreguntaArea();
        preguntaArea.idArea = { idArea: idAreaCreado };

        return preguntaAreaDAO.create(preguntaArea);
      })
      .then((responsePa) => {
        idPreguntaAreaCreado = responsePa.datos.id;

        // Crear Distractor
        return distractorDAO.create(distractorPadre);
      })
      .then((responseD) => {
        idDistractorCreado = responseD.datos.id;

        // Vincular Distractor con Area
        distractorAreaDAO = new DistractorAreaDAO(idDistractorCreado);
        const distractorArea = new DistractorArea();
        distractorArea.idArea = { idArea: idAreaCreado };

        return distractorAreaDAO.create(distractorArea);
      })
      .then((responseDa) => {
        idDistractorAreaCreado = responseDa.datos.id;

        // Instanciar DAO con el idPregunta
        cut = new PreguntaDistractorDAO(idPreguntaCreado);

        // Crear base entity
        preguntaDistractorBase = new PreguntaDistractor();
        preguntaDistractorBase.idPregunta = { idPregunta: idPreguntaCreado };
        preguntaDistractorBase.idDistractor = { idDistractor: idDistractorCreado };
        preguntaDistractorBase.correcto = false;

        done();
      })
      .catch(done);
  });

  after(function (done) {
    let promesasLimpieza = [];

    if (idPreguntaDistractorCreado) {
      promesasLimpieza.push(
        cut
          .delete(idPreguntaDistractorCreado)
          .catch(() => console.warn("PreguntaDistractor ya estaba eliminado")),
      );
    }

    Promise.all(promesasLimpieza)
      .then(() => {
        let promesasPadres = [];
        if (idPreguntaCreado) {
          promesasPadres.push(
            preguntaDAO.delete(idPreguntaCreado).catch(() => true),
          );
        }
        if (idDistractorCreado) {
          promesasPadres.push(
            distractorDAO.delete(idDistractorCreado).catch(() => true),
          );
        }
        if (idAreaCreado) {
          promesasPadres.push(areaDAO.delete(idAreaCreado).catch(() => true));
        }
        return Promise.all(promesasPadres);
      })
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PreguntaDistractorDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PreguntaDistractorDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos del pregunta_distractor creado", function (done) {
      cut
        .create(preguntaDistractorBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;
          idPreguntaDistractorCreado = response.datos.id;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si el Distractor no existe y lanzar un (404)", function (done) {
      const preguntaDistractorInvalido = new PreguntaDistractor();
      preguntaDistractorInvalido.idPregunta = {
        idPregunta: idPreguntaCreado,
      };
      preguntaDistractorInvalido.idDistractor = {
        idDistractor: "123e4567-e89b-12d3-a456-426614174000",
      };
      preguntaDistractorInvalido.correcto = false;

      cut
        .create(preguntaDistractorInvalido)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando falta el idDistractor (400)", function (done) {
      const preguntaDistractorSinDistractor = new PreguntaDistractor();
      preguntaDistractorSinDistractor.idPregunta = {
        idPregunta: idPreguntaCreado,
      };

      cut
        .create(preguntaDistractorSinDistractor)
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
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de pregunta_distractores ", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response.datos).to.have.length.above(0);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si se mandan parámetros inválidos, un idPregunta inexistente", function (done) {
      let pdDao = new PreguntaDistractorDAO("123e4567-e89b-12d3-a456-426614174000");
      
      pdDao
        .findRange(-1, -5)
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
    it("Debe eliminar el pregunta_distractor creado exitosamente", function (done) {
      cut
        .delete(idPreguntaDistractorCreado)
        .then(() => {
          const idEliminado = idPreguntaDistractorCreado;
          idPreguntaDistractorCreado = null;

          cut
            .delete(idEliminado)
            .then(() => {
              done(
                new Error(
                  "El recurso debería haber sido eliminado previamente",
                ),
              );
            })
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include("Error al eliminar los datos: 404");
              done();
            });
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar eliminar un pregunta_distractor que no existe", function (done) {
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
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });
});

mocha.run();
