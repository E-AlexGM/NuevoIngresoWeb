import * as chai from "../lib/chai/index.js";
import PruebaClaveAreaDAO from "../../../src/js/control/prueba_clave_area_dao.js";
import PruebaClaveDAO from "../../../src/js/control/prueba_clave_dao.js";
import PruebaDAO from "../../../src/js/control/prueba_dao.js";
import TipoPruebaDAO from "../../../src/js/control/tipo_prueba_dao.js";
import AreaDAO from "../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../src/js/entity/default_response.js";
import PruebaClaveArea from "../../../src/js/entity/prueba_clave_area.js";
import PruebaClave from "../../../src/js/entity/prueba_clave.js";
import Prueba from "../../../src/js/entity/prueba.js";
import TipoPrueba from "../../../src/js/entity/tipo_prueba.js";
import Area from "../../../src/js/entity/area.js";
import { requiereServidor, requiereServidorApagado } from "./it_config.js";

mocha.setup("bdd");

describe("PruebaClaveAreaDAO Integration Tests", function () {
  describe("Pruebas con servidor en línea", function () {
    requiereServidor();
    let cut;
    let tipoPruebaDAO;
    let pruebaDAO;
    let pruebaClaveDAO;
    let areaDAO;

    let idTipoPruebaCreado;
    let idPruebaCreado;
    let idPruebaClaveCreado;
    let idAreaCreado;
    let idPruebaClaveAreaCreado;

    let pruebaClaveAreaBase;
    let pruebaClaveAreaActualizada;

    before(function (done) {
      tipoPruebaDAO = new TipoPruebaDAO();
      pruebaDAO = new PruebaDAO();
      areaDAO = new AreaDAO();

      const tipoPruebaPadre = new TipoPrueba();
      tipoPruebaPadre.valor = "INGRESO_UNIVERSITARIO_PRIMERA_RONDA";
      tipoPruebaPadre.activo = true;

      const pruebaPadre = new Prueba();
      pruebaPadre.nombre = "NUEVO_INGRESO_2026";
      pruebaPadre.indicaciones = "Indicaciones";
      pruebaPadre.puntajeMaximo = 100.0;
      pruebaPadre.notaAprobacion = 50.0;
      pruebaPadre.duracion = 120;
      pruebaPadre.fechaCreacion = "2026-05-06T04:00:00-06:00";
      pruebaPadre.idTipoPrueba = tipoPruebaPadre;

      const areaPadre = new Area();
      areaPadre.nombre = "Area Padre Integración";

      tipoPruebaDAO
        .create(tipoPruebaPadre)
        .then((responseTipo) => {
          idTipoPruebaCreado = responseTipo.datos.id;
          tipoPruebaPadre.idTipoPrueba = idTipoPruebaCreado;
          pruebaPadre.idTipoPrueba = tipoPruebaPadre;
          return pruebaDAO.create(pruebaPadre);
        })
        .then((responsePrueba) => {
          idPruebaCreado = responsePrueba.datos.id;
          pruebaPadre.idPrueba = idPruebaCreado;
          pruebaClaveDAO = new PruebaClaveDAO(idPruebaCreado);
          return areaDAO.create(areaPadre);
        })
        .then((responseArea) => {
          idAreaCreado = responseArea.datos.id;
          areaPadre.idArea = idAreaCreado;
          return pruebaClaveDAO.create(
            Object.assign(new PruebaClave(), {
              nombreClave: "Clave Padre Integración",
              idPrueba: pruebaPadre,
            }),
          );
        })
        .then((responsePruebaClave) => {
          idPruebaClaveCreado = responsePruebaClave.datos.id;
          const pruebaClavePadre = new PruebaClave();
          pruebaClavePadre.idPruebaClave = idPruebaClaveCreado;
          pruebaClavePadre.nombreClave = "Clave Padre Integración";
          pruebaClavePadre.idPrueba = pruebaPadre;

          cut = new PruebaClaveAreaDAO(idPruebaClaveCreado);

          pruebaClaveAreaBase = new PruebaClaveArea();
          pruebaClaveAreaBase.idPruebaClave = pruebaClavePadre;
          pruebaClaveAreaBase.idArea = areaPadre;
          pruebaClaveAreaBase.cantidad = 10;
          pruebaClaveAreaBase.porcentaje = 50;

          pruebaClaveAreaActualizada = new PruebaClaveArea();
          pruebaClaveAreaActualizada.idPruebaClave = pruebaClavePadre;
          pruebaClaveAreaActualizada.idArea = areaPadre;
          pruebaClaveAreaActualizada.cantidad = 20;
          pruebaClaveAreaActualizada.porcentaje = 80;

          done();
        })
        .catch(done);
    });

    after(function (done) {
      let promesasLimpieza = [];

      if (idPruebaClaveAreaCreado) {
        promesasLimpieza.push(
          cut
            .delete(idPruebaClaveAreaCreado)
            .catch(() => console.warn("PruebaClaveArea ya estaba eliminado")),
        );
      }

      Promise.all(promesasLimpieza)
        .then(() => {
          let promesasPadres = [];
          if (idPruebaClaveCreado) {
            promesasPadres.push(
              pruebaClaveDAO.delete(idPruebaClaveCreado).catch(() => true),
            );
          }
          if (idAreaCreado) {
            promesasPadres.push(areaDAO.delete(idAreaCreado).catch(() => true));
          }
          if (idPruebaCreado) {
            promesasPadres.push(
              pruebaDAO.delete(idPruebaCreado).catch(() => true),
            );
          }
          if (idTipoPruebaCreado) {
            promesasPadres.push(
              tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true),
            );
          }
          return Promise.all(promesasPadres);
        })
        .then(() => done())
        .catch(done);
    });

    it("Debe crear una instancia de PruebaClaveAreaDAO", function () {
      chai.expect(cut).to.be.an.instanceOf(PruebaClaveAreaDAO);
    });

    // ==========================================
    // Método Create
    // ==========================================
    describe("Method: create()", function () {
      it("Debe retornar un DefaultResponse con los datos del prueba_clave_area creado", function (done) {
        cut
          .create(pruebaClaveAreaBase)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("id");
            chai.expect(response.datos).to.have.property("location");
            chai.expect(response.datos.id).to.exist;

            idPruebaClaveAreaCreado = response.datos.id;
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si el Área no existe y lanzar un (404)", function (done) {
        const areaInexistente = new Area();
        areaInexistente.idArea = "123e4567-e89b-12d3-a456-426614174000";

        const pruebaClaveAreaInvalida = new PruebaClaveArea();
        pruebaClaveAreaInvalida.idPruebaClave =
          pruebaClaveAreaBase.idPruebaClave;
        pruebaClaveAreaInvalida.idArea = areaInexistente;
        pruebaClaveAreaInvalida.cantidad = 10;
        pruebaClaveAreaInvalida.porcentaje = 50;

        cut
          .create(pruebaClaveAreaInvalida)
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
        const pruebaClaveAreaSinArea = new PruebaClaveArea();
        pruebaClaveAreaSinArea.idPruebaClave =
          pruebaClaveAreaBase.idPruebaClave;
        pruebaClaveAreaSinArea.cantidad = 10;
        pruebaClaveAreaSinArea.porcentaje = 50;

        cut
          .create(pruebaClaveAreaSinArea)
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
      it("Debe retornar un DefaultResponse con un array de prueba_clave_areas y total_datos", function (done) {
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
    // Método FindById
    // ==========================================
    describe("Method: findById()", function () {
      it("Debe retornar un DefaultResponse con el prueba_clave_area encontrado", function (done) {
        cut
          .findById(idPruebaClaveAreaCreado)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("idPruebaClave");
            chai.expect(response.datos).to.have.property("idArea");
            chai.expect(response.datos).to.have.property("cantidad");
            chai.expect(response.datos).to.have.property("porcentaje");
            chai.expect(response.datos.cantidad).to.equal(10);
            chai.expect(response.datos.porcentaje).to.equal(50);
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar si no se encuentra el prueba_clave_area", function (done) {
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
            chai
              .expect(error.mensaje)
              .to.include("Error al obtener los datos: 500");
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
          .findById(idPruebaClaveAreaCreado)
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
      it("Debe actualizar el prueba_clave_area creado exitosamente", function (done) {
        cut
          .update(idPruebaClaveAreaCreado, pruebaClaveAreaActualizada)
          .then((response) => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an("object");
            chai.expect(response.datos).to.have.property("idArea");
            chai.expect(response.datos).to.have.property("cantidad");
            chai.expect(response.datos.cantidad).to.equal(20);
            done();
          })
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar al intentar actualizar un prueba_clave_area que no existe", function (done) {
        const idInexistente = "123e4567-e89b-12d3-a456-426614174999";
        const areaInexistente = new Area();
        areaInexistente.idArea = idInexistente;

        const pruebaClaveAreaInexistente = new PruebaClaveArea();
        pruebaClaveAreaInexistente.idPruebaClave =
          pruebaClaveAreaBase.idPruebaClave;
        pruebaClaveAreaInexistente.idArea = areaInexistente;
        pruebaClaveAreaInexistente.cantidad = 20;
        pruebaClaveAreaInexistente.porcentaje = 80;

        cut
          .update(idInexistente, pruebaClaveAreaInexistente)
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
          .catch((e) => done(new Error(e.mensaje || e)));
      });

      it("Debe rechazar error al parsear los datos", function (done) {
        const originalJson = Response.prototype.json;
        Response.prototype.json = function () {
          return Promise.reject(new Error("Simulado: JSON corrupto"));
        };

        cut
          .update(idPruebaClaveAreaCreado, pruebaClaveAreaActualizada)
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
      it("Debe eliminar el prueba_clave_area creado exitosamente", function (done) {
        cut
          .delete(idPruebaClaveAreaCreado)
          .then(() => {
            const idEliminado = idPruebaClaveAreaCreado;
            idPruebaClaveAreaCreado = null;

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

      it("Debe rechazar al intentar eliminar un prueba_clave_area que no existe", function (done) {
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

  // ==========================================
  // Pruebas Offline
  // ==========================================
  describe("Pruebas con servidor apagado", function () {
    requiereServidorApagado();
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
});

mocha.run();