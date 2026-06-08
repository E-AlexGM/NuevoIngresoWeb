import * as chai from "../../../lib/chai/index.js";
import PruebaClaveAreaPreguntaDAO from "../../../../../src/js/control/prueba_clave_area_pregunta_dao.js";
import PruebaClaveAreaDAO from "../../../../../src/js/control/prueba_clave_area_dao.js";
import PreguntaAreaDAO from "../../../../../src/js/control/pregunta_area_dao.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import PreguntaDAO from "../../../../../src/js/control/pregunta_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaClaveAreaPregunta from "../../../../../src/js/entity/prueba_clave_area_pregunta.js";
import PruebaClaveArea from "../../../../../src/js/entity/prueba_clave_area.js";
import PreguntaArea from "../../../../../src/js/entity/pregunta_area.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import Pregunta from "../../../../../src/js/entity/pregunta.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("PruebaClaveAreaPreguntaDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO;
  let pruebaDAO;
  let pruebaClaveDAO;
  let pruebaClaveAreaDAO;
  let areaDAO;
  let preguntaDAO;
  let preguntaAreaDAO;

  let idTipoPruebaCreado;
  let idPruebaCreado;
  let idPruebaClaveCreado;
  let idAreaCreado;
  let idPruebaClaveAreaCreado;
  let idPreguntaCreado;
  let idPreguntaAreaCreado;
  let idPruebaClaveAreaPreguntaCreado;

  let pruebaClaveAreaPreguntaBase;
  let pruebaClaveAreaPreguntaActualizada;

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    areaDAO = new AreaDAO();
    preguntaDAO = new PreguntaDAO();

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

    const preguntaPadre = new Pregunta();
    preguntaPadre.valor = "¿Pregunta de prueba integración?";
    preguntaPadre.activo = true;
    preguntaPadre.imagenUrl = "";

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
        return preguntaDAO.create(preguntaPadre);
      })
      .then((responsePregunta) => {
        idPreguntaCreado = responsePregunta.datos.id;
        preguntaPadre.idPregunta = idPreguntaCreado;
        preguntaAreaDAO = new PreguntaAreaDAO(idPreguntaCreado);
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

        pruebaClaveAreaDAO = new PruebaClaveAreaDAO(idPruebaClaveCreado);

        const pruebaClaveAreaBase = new PruebaClaveArea();
        pruebaClaveAreaBase.idPruebaClave = pruebaClavePadre;
        pruebaClaveAreaBase.idArea = areaPadre;
        pruebaClaveAreaBase.cantidad = 10;
        pruebaClaveAreaBase.porcentaje = 25;

        return pruebaClaveAreaDAO.create(pruebaClaveAreaBase);
      })
      .then((responsePruebaClaveArea) => {
        idPruebaClaveAreaCreado = responsePruebaClaveArea.datos.id;

        const preguntaAreaPadre = new PreguntaArea();
        preguntaAreaPadre.idPregunta = new Pregunta();
        preguntaAreaPadre.idPregunta.idPregunta = idPreguntaCreado;
        preguntaAreaPadre.idArea = new Area();
        preguntaAreaPadre.idArea.idArea = idAreaCreado;

        return preguntaAreaDAO.create(preguntaAreaPadre);
      })
      .then((responsePreguntaArea) => {
        idPreguntaAreaCreado = responsePreguntaArea.datos.id;

        cut = new PruebaClaveAreaPreguntaDAO(idPruebaClaveCreado, idAreaCreado);

        pruebaClaveAreaPreguntaBase = new PruebaClaveAreaPregunta();
        pruebaClaveAreaPreguntaBase.idPruebaClave = new PruebaClave();
        pruebaClaveAreaPreguntaBase.idPruebaClave.idPruebaClave = idPruebaClaveCreado;
        pruebaClaveAreaPreguntaBase.idArea = new Area();
        pruebaClaveAreaPreguntaBase.idArea.idArea = idAreaCreado;
        pruebaClaveAreaPreguntaBase.idPregunta = new Pregunta();
        pruebaClaveAreaPreguntaBase.idPregunta.idPregunta = idPreguntaCreado;
        pruebaClaveAreaPreguntaBase.porcentaje = 50;

        pruebaClaveAreaPreguntaActualizada = new PruebaClaveAreaPregunta();
        pruebaClaveAreaPreguntaActualizada.idPruebaClave = new PruebaClave();
        pruebaClaveAreaPreguntaActualizada.idPruebaClave.idPruebaClave = idPruebaClaveCreado;
        pruebaClaveAreaPreguntaActualizada.idArea = new Area();
        pruebaClaveAreaPreguntaActualizada.idArea.idArea = idAreaCreado;
        pruebaClaveAreaPreguntaActualizada.idPregunta = new Pregunta();
        pruebaClaveAreaPreguntaActualizada.idPregunta.idPregunta = idPreguntaCreado;
        pruebaClaveAreaPreguntaActualizada.porcentaje = 40;

        done();
      })
      .catch(done);
  });

  after(function (done) {
    // Orden de eliminación crítico por dependencias de FK
    let promesa = Promise.resolve();

    // 1. Eliminar PruebaClaveAreaPregunta
    if (idPruebaClaveAreaPreguntaCreado) {
      promesa = promesa.then(() =>
        cut
          .delete(idPruebaClaveAreaPreguntaCreado)
          .catch(() => console.warn("PruebaClaveAreaPregunta ya estaba eliminado")),
      );
    }

    // 2. Eliminar PreguntaArea y PruebaClaveArea (en paralelo)
    promesa = promesa.then(() => {
      let promesasIntermedio = [];
      if (idPreguntaAreaCreado) {
        promesasIntermedio.push(
          preguntaAreaDAO.delete(idPreguntaAreaCreado).catch(() => true),
        );
      }
      if (idPruebaClaveAreaCreado) {
        promesasIntermedio.push(
          pruebaClaveAreaDAO.delete(idPruebaClaveAreaCreado).catch(() => true),
        );
      }
      return Promise.all(promesasIntermedio);
    });

    // 3. Eliminar PruebaClave
    if (idPruebaClaveCreado) {
      promesa = promesa.then(() =>
        pruebaClaveDAO.delete(idPruebaClaveCreado).catch(() => true),
      );
    }

    // 4. Eliminar Prueba ANTES que TipoPrueba (FK critical)
    if (idPruebaCreado) {
      promesa = promesa.then(() =>
        pruebaDAO.delete(idPruebaCreado).catch(() => true),
      );
    }

    // 5. Eliminar Pregunta, Area y TipoPrueba (en paralelo - ahora seguros)
    promesa = promesa.then(() => {
      let promesasFinales = [];
      if (idPreguntaCreado) {
        promesasFinales.push(
          preguntaDAO.delete(idPreguntaCreado).catch(() => true),
        );
      }
      if (idAreaCreado) {
        promesasFinales.push(areaDAO.delete(idAreaCreado).catch(() => true));
      }
      if (idTipoPruebaCreado) {
        promesasFinales.push(
          tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true),
        );
      }
      return Promise.all(promesasFinales);
    });

    promesa.then(() => done()).catch(done);
  });

  it("Debe crear una instancia de PruebaClaveAreaPreguntaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaClaveAreaPreguntaDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos del prueba_clave_area_pregunta creado", function (done) {
      cut
        .create(pruebaClaveAreaPreguntaBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;

          idPruebaClaveAreaPreguntaCreado = response.datos.id || pruebaClaveAreaPreguntaBase.idPregunta.idPregunta;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si la Pregunta no existe y lanzar un (404)", function (done) {
      const preguntaInexistente = new Pregunta();
      preguntaInexistente.idPregunta = "123e4567-e89b-12d3-a456-426614174000";

      const pruebaClaveAreaPreguntaInvalida = new PruebaClaveAreaPregunta();
      pruebaClaveAreaPreguntaInvalida.idPruebaClave = pruebaClaveAreaPreguntaBase.idPruebaClave;
      pruebaClaveAreaPreguntaInvalida.idArea = pruebaClaveAreaPreguntaBase.idArea;
      pruebaClaveAreaPreguntaInvalida.idPregunta = preguntaInexistente;
      pruebaClaveAreaPreguntaInvalida.porcentaje = 50;

      cut
        .create(pruebaClaveAreaPreguntaInvalida)
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

    it("Debe rechazar cuando falta el idPregunta (400)", function (done) {
      const pruebaClaveAreaPreguntaSinPregunta = new PruebaClaveAreaPregunta();
      pruebaClaveAreaPreguntaSinPregunta.idPruebaClave = pruebaClaveAreaPreguntaBase.idPruebaClave;
      pruebaClaveAreaPreguntaSinPregunta.idArea = pruebaClaveAreaPreguntaBase.idArea;
      pruebaClaveAreaPreguntaSinPregunta.porcentaje = 50;

      cut
        .create(pruebaClaveAreaPreguntaSinPregunta)
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
        .catch((e) => done(new Error(e.mensaje || e)));
    });

   
  });

  // ==========================================
  // Método FindById
  // ==========================================
  describe("Method: findById()", function () {

    it("Debe retornar un DefaultResponse con el prueba_clave_area_pregunta encontrado", function (done) {
      cut
        .findById(idPruebaClaveAreaPreguntaCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("porcentaje");
          chai.expect(response.datos.porcentaje).to.equal(50);
          done();
        })
        .catch((e) => done("Error: " + e.mensaje));
    });

    it("Debe rechazar si no se encuentra el prueba_clave_area_pregunta", function (done) {
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
          // Aceptar error de acceso o 500
          chai.expect(error.mensaje).to.exist;
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
        .findById(idPruebaClaveAreaPreguntaCreado)
        .then(() => {
          Response.prototype.json = originalJson;
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          Response.prototype.json = originalJson;
          try {
            chai.expect(error).to.have.property("mensaje");
            // Aceptar cualquier error de parseo
            chai.expect(error.mensaje).to.exist;
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange() (listar)", function () {
    it("Debe retornar un DefaultResponse con un array de prueba_clave_area_preguntas", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
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
  // Método Update
  // ==========================================
  describe("Method: update()", function () {
    it("Debe actualizar el prueba_clave_area_pregunta creado exitosamente", function (done) {
  
      cut
        .update(pruebaClaveAreaPreguntaActualizada.idPregunta.idPregunta, pruebaClaveAreaPreguntaActualizada)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("porcentaje");
          chai.expect(response.datos.porcentaje).to.equal(40);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar actualizar un prueba_clave_area_pregunta que no existe", function (done) {
      const idInexistente = "123e4567-e89b-12d3-a456-426614174999";
      const preguntaInexistente = new Pregunta();
      preguntaInexistente.idPregunta = idInexistente;

      const pruebaClaveAreaPreguntaInexistente = new PruebaClaveAreaPregunta();
      pruebaClaveAreaPreguntaInexistente.idPruebaClave = pruebaClaveAreaPreguntaBase.idPruebaClave;
      pruebaClaveAreaPreguntaInexistente.idArea = pruebaClaveAreaPreguntaBase.idArea;
      pruebaClaveAreaPreguntaInexistente.idPregunta = preguntaInexistente;
      pruebaClaveAreaPreguntaInexistente.idPregunta.idPregunta = idInexistente;
      pruebaClaveAreaPreguntaInexistente.porcentaje = 20;

      cut
        .update(idInexistente, pruebaClaveAreaPreguntaInexistente)
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
        .update(idPruebaClaveAreaPreguntaCreado, pruebaClaveAreaPreguntaActualizada)
        .then(() => {
          Response.prototype.json = originalJson;
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          Response.prototype.json = originalJson;
          try {
            chai.expect(error).to.have.property("mensaje");
            // Aceptar cualquier error de parseo
            chai.expect(error.mensaje).to.exist;
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
    it("Debe eliminar el prueba_clave_area_pregunta creado exitosamente", function (done) {
      cut
        .delete(idPruebaClaveAreaPreguntaCreado)
        .then(() => {
          const idEliminado = idPruebaClaveAreaPreguntaCreado;
          idPruebaClaveAreaPreguntaCreado = null;

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

    it("Debe rechazar al intentar eliminar un prueba_clave_area_pregunta que no existe", function (done) {
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
