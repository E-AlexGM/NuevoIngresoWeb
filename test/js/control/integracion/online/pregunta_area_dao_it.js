import * as chai from "../../../lib/chai/index.js";
import PreguntaAreaDAO from "../../../../../src/js/control/pregunta_area_dao.js";
import PreguntaDAO from "../../../../../src/js/control/pregunta_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PreguntaArea from "../../../../../src/js/entity/pregunta_area.js";
import Pregunta from "../../../../../src/js/entity/pregunta.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("PreguntaAreaDAO Integration Tests - Online", function () {
  let cut;
  let preguntaDAO;
  let areaDAO;

  let idPreguntaCreado;
  let idAreaCreado;
  let idPreguntaAreaCreado;

  let preguntaAreaBase;

  before(function (done) {
    preguntaDAO = new PreguntaDAO();
    areaDAO = new AreaDAO();

    const preguntaPadre = new Pregunta();
    preguntaPadre.valor = "Pregunta Padre Integración";
    preguntaPadre.activo = true;

    const areaPadre = new Area();
    areaPadre.nombre = "Area Padre Integración";

    preguntaDAO
      .create(preguntaPadre)
      .then((responseP) => {
        idPreguntaCreado = responseP.datos.id;
        return areaDAO.create(areaPadre);
      })
      .then((responseA) => {
        idAreaCreado = responseA.datos.id;
        areaPadre.idArea = idAreaCreado;

        cut = new PreguntaAreaDAO(idPreguntaCreado);

        preguntaAreaBase = new PreguntaArea();
        preguntaAreaBase.idArea = areaPadre;

        done();
      })
      .catch(done);
  });

  after(function (done) {
    let promesasLimpieza = [];

    if (idPreguntaAreaCreado) {
      promesasLimpieza.push(
        cut
          .delete(idPreguntaAreaCreado)
          .catch(() => console.warn("PreguntaArea ya estaba eliminado")),
      );
    }

    Promise.all(promesasLimpieza)
      .then(() => {
        let promesasPadres = [];
        if (idAreaCreado) {
          promesasPadres.push(areaDAO.delete(idAreaCreado).catch(() => true));
        }
        if (idPreguntaCreado) {
          promesasPadres.push(
            preguntaDAO.delete(idPreguntaCreado).catch(() => true),
          );
        }
        return Promise.all(promesasPadres);
      })
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PreguntaAreaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PreguntaAreaDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos del pregunta_area creado", function (done) {
      cut
        .create(preguntaAreaBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;

          idPreguntaAreaCreado = response.datos.id;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si el Área no existe y lanzar un (404)", function (done) {
      const areaInexistente = new Area();
      areaInexistente.idArea = "123e4567-e89b-12d3-a456-426614174000";

      const preguntaAreaInvalida = new PreguntaArea();
      preguntaAreaInvalida.idArea = areaInexistente;

      cut
        .create(preguntaAreaInvalida)
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

    it("Debe rechazar cuando falta el idArea (400)", function (done) {
      const preguntaAreaSinArea = new PreguntaArea();

      cut
        .create(preguntaAreaSinArea)
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
    it("Debe retornar un DefaultResponse con un array de pregunta_areas y total_datos", function (done) {
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
          chai
            .expect(error.mensaje)
            .to.include("Error al obtener los datos: 400");
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
    it("Debe eliminar el pregunta_area creado exitosamente", function (done) {
      cut
        .delete(idPreguntaAreaCreado)
        .then(() => {
          const idEliminado = idPreguntaAreaCreado;
          idPreguntaAreaCreado = null;

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

    it("Debe rechazar al intentar eliminar un pregunta_area que no existe", function (done) {
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
