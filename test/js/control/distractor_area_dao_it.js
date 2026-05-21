import * as chai from "../lib/chai/index.js";
import DistractorAreaDAO from "../../../src/js/control/distractor_area_dao.js";
import DistractorDAO from "../../../src/js/control/distractor_dao.js";
import AreaDAO from "../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../src/js/entity/default_response.js";
import DistractorArea from "../../../src/js/entity/distractor_area.js";
import Distractor from "../../../src/js/entity/distractor.js";
import Area from "../../../src/js/entity/area.js";
import { requiereServidor, requiereServidorApagado } from "./it_config.js";

mocha.setup("bdd");

describe("DistractorAreaDAO Integration Tests", function () {
  describe("Pruebas con servidor en línea", function () {
    requiereServidor();
    let cut;
    let distractorDAO;
    let areaDAO;
    
    let idDistractorCreado;
    let idAreaCreado;
    let idDistractorAreaCreado;
    
    let distractorAreaBase;

    before(function (done) {
      distractorDAO = new DistractorDAO();
      areaDAO = new AreaDAO();

      const distractorPadre = new Distractor();
      distractorPadre.valor = "Distractor Padre Integración";
      distractorPadre.activo = true;

      const areaPadre = new Area();
      areaPadre.nombre = "Area Padre Integración";

      distractorDAO.create(distractorPadre)
        .then((responseD) => {
          idDistractorCreado = responseD.datos.id;
          return areaDAO.create(areaPadre);
        })
        .then((responseA) => {
          idAreaCreado = responseA.datos.id;

          areaPadre.idArea = idAreaCreado;
          cut = new DistractorAreaDAO(idDistractorCreado);

          distractorAreaBase = new DistractorArea();
          distractorAreaBase.idArea = areaPadre;
          done();
        })
        .catch(done);
    });

    after(function (done) {
      let promesasLimpieza = [];

      if (idDistractorAreaCreado) {
        promesasLimpieza.push(
          cut.delete(idDistractorAreaCreado).catch(() => console.warn("DistractorArea ya estaba eliminado"))
        );
      }

      Promise.all(promesasLimpieza)
        .then(() => {
          let promesasPadres = [];
          if (idAreaCreado) {
            promesasPadres.push(areaDAO.delete(idAreaCreado).catch(() => true));
          }
          if (idDistractorCreado) {
            promesasPadres.push(distractorDAO.delete(idDistractorCreado).catch(() => true));
          }
          return Promise.all(promesasPadres);
        })
        .then(() => done())
        .catch(done);
    });

    it("Debe crear una instancia de DistractorAreaDAO", function () {
      chai.expect(cut).to.be.an.instanceOf(DistractorAreaDAO);
    });

    // ==========================================
    // Método Create
    // ==========================================
    describe("Method: create()", function () {
      it("Debe retornar un DefaultResponse con los datos del distractor_area creado", function (done) {
        cut
          .create(distractorAreaBase)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("id");
            chai.expect(response.datos).to.have.property("location");
            chai.expect(response.datos.id).to.exist;
            idDistractorAreaCreado = response.datos.id; 
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si el Área no existe y lanzar un (404)", function (done) {
        const distractorAreaInvalido = new DistractorArea();
        distractorAreaInvalido.idArea = { idArea: "123e4567-e89b-12d3-a456-426614174000" };
        
        cut
          .create(distractorAreaInvalido)
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
        const distractorAreaSinArea = new DistractorArea();
        
        cut
          .create(distractorAreaSinArea)
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
      it("Debe retornar un DefaultResponse con un array de distractor_areas y total_datos", function (done) {
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
    // Método Delete
    // ==========================================
    describe("Method: delete()", function () {
      it("Debe eliminar el distractor_area creado exitosamente", function (done) {
        cut
          .delete(idDistractorAreaCreado)
          .then(() => {
            const idEliminado = idDistractorAreaCreado;
            idDistractorAreaCreado = null;

            cut
              .delete(idEliminado)
              .then(() => {
                 done(new Error("El recurso debería haber sido eliminado previamente"));
              })
              .catch((error) => {
                 chai.expect(error).to.have.property("mensaje");
                 chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
                 done();
              });
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar al intentar eliminar un distractor_area que no existe", function (done) {
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
      cut = new DistractorAreaDAO("123e4567-e89b-12d3-a456-426614174000");
    });

    describe("Method: create()", function () {
      it("Debe rechazar por servidor apagado", function (done) {
        const distractorArea = new DistractorArea();
        cut
          .create(distractorArea)
          .then(() => {
            done(new Error("La creación debería haber fallado"));
          })
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
          .then(() => {
            done(new Error("La consulta debería haber fallado"));
          })
          .catch((error) => {
            chai.expect(error).to.have.property("mensaje");
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
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });
    });
  });
});

mocha.run();