import * as chai from "../../../lib/chai/index.js";
import PruebaJornadaAulaAspiranteOpcionExamenDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import JornadaDAO from "../../../../../src/js/control/jornada_dao.js";
import AspiranteDAO from "../../../../../src/js/control/aspirante_dao.js";
import AspiranteOpcionDAO from "../../../../../src/js/control/aspirante_opcion_dao.js";
import PruebaJornadaDAO from "../../../../../src/js/control/prueba_jornada_dao.js";
import JornadaAulaDAO from "../../../../../src/js/control/jornada_aula_dao.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";

import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaJornadaAulaAspiranteOpcionExamen from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion_examen.js";
import PruebaJornadaAulaAspiranteOpcion from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import Jornada from "../../../../../src/js/entity/jornada.js";
import Aspirante from "../../../../../src/js/entity/aspirante.js";
import AspiranteOpcion from "../../../../../src/js/entity/aspirante_opcion.js";
import PruebaJornada from "../../../../../src/js/entity/prueba_jornada.js";
import JornadaAula from "../../../../../src/js/entity/jornada_aula.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";

mocha.setup("bdd");

describe("PruebaJornadaAulaAspiranteOpcionExamenDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO, pruebaDAO, jornadaDAO, aspiranteDAO, aspiranteOpcionDAO;
  let pruebaJornadaDAO, jornadaAulaDAO, pruebaClaveDAO, pjaaoDAO;

  let idTipoPrueba, idPrueba, idJornada, idAspirante, idAspiranteOpcion;
  let idPruebaClave, idMapeoPjaao;
  let idAulaBase;
  let examenCreado = false; // Bandera para la limpieza final

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    jornadaDAO = new JornadaDAO();
    aspiranteDAO = new AspiranteDAO();

    const ts = Date.now();
    idAulaBase = "AULA-EX-" + ts.toString().slice(-4);
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_EXAM_" + ts.toString().slice(-6);
    tipoPrueba.activo = true;

    tipoPruebaDAO
      .create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPrueba = resTipo.datos.id;

        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_EXAM_" + ts.toString().slice(-6);
        prueba.indicaciones = "Indicaciones Examen Aspirante";
        prueba.puntajeMaximo = 100.0;
        prueba.notaAprobacion = 60.0;
        prueba.duracion = 120;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00";
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPrueba };
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Crear Jornada";
        idPrueba = resPrueba.datos.id;

        const jornada = new Jornada();
        jornada.nombre = "JORNADA_EXAM_" + ts.toString().slice(-6);
        jornada.fechaInicio = "2026-06-01T08:00:00-06:00";
        jornada.fechaFin = "2026-06-01T12:00:00-06:00";
        return jornadaDAO.create(jornada);
      })
      .then((resJornada) => {
        pasoActual = "Crear Aspirante";
        idJornada = resJornada.datos.id;

        const aspirante = new Aspirante();
        aspirante.nombres = "Aspirante Examen";
        aspirante.apellidos = "Sistema";
        aspirante.fechaNacimiento = "2000-01-01";
        aspirante.documentoIdentidad = "DOC-" + ts.toString().slice(-6);
        aspirante.correo = `exam-${ts}@mail.com`;
        aspirante.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteDAO.create(aspirante);
      })
      .then((resAspirante) => {
        pasoActual = "Crear AspiranteOpcion";
        idAspirante = resAspirante.datos.id;

        aspiranteOpcionDAO = new AspiranteOpcionDAO(idAspirante);
        const opcion = new AspiranteOpcion();
        opcion.idOpcion = "OPC-" + ts.toString().slice(-4);
        opcion.prioridad = 1;
        opcion.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteOpcionDAO.create(opcion);
      })
      .then((resOpcion) => {
        pasoActual = "Crear Relación PruebaJornada";
        idAspiranteOpcion = resOpcion.datos.id;

        pruebaJornadaDAO = new PruebaJornadaDAO(idPrueba);
        const pj = new PruebaJornada();
        pj.idJornada = { idJornada: idJornada };
        return pruebaJornadaDAO.create(pj);
      })
      .then(() => {
        pasoActual = "Crear Relación JornadaAula";
        jornadaAulaDAO = new JornadaAulaDAO(idJornada);
        const ja = new JornadaAula();
        ja.idAula = idAulaBase;
        return jornadaAulaDAO.create(ja);
      })
      .then(() => {
        pasoActual = "Crear PruebaClave";
        pruebaClaveDAO = new PruebaClaveDAO(idPrueba);
        const clave = new PruebaClave();
        clave.nombreClave = "Clave Examen " + ts.toString().slice(-4);
        clave.idPrueba = { idPrueba: idPrueba };
        return pruebaClaveDAO.create(clave);
      })
      .then((resClave) => {
        pasoActual = "Crear Relación PruebaJornadaAulaAspiranteOpcion (Padre)";
        idPruebaClave = resClave.datos.id;

        pjaaoDAO = new PruebaJornadaAulaAspiranteOpcionDAO(idPrueba, idJornada, idAulaBase);
        const pjaao = new PruebaJornadaAulaAspiranteOpcion();
        const objOpcion = new AspiranteOpcion();
        objOpcion.idAspiranteOpcion = idAspiranteOpcion;
        pjaao.idAspiranteOpcion = objOpcion;
        pjaao.activo = true;
        
        return pjaaoDAO.create(pjaao);
      })
      .then((resPjaao) => {
        pasoActual = "Configurar el DAO a probar (cut)";
        idMapeoPjaao = idAspiranteOpcion; 

        // Inicializamos el DAO del Examen con todos los IDs del contexto
        cut = new PruebaJornadaAulaAspiranteOpcionExamenDAO(
          idPrueba,
          idJornada,
          idAulaBase,
          idAspiranteOpcion
        );
        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    // La eliminación en cascada de abajo hacia arriba.
    // Usamos el string vacío "" para eliminar el examen porque la URL en Java opera directo sobre el path base del AspiranteOpcion
    let pLimpieza = (examenCreado && cut) ? cut.delete("").catch(() => true) : Promise.resolve();

    pLimpieza
      .then(() => (idMapeoPjaao && pjaaoDAO) ? pjaaoDAO.delete(idMapeoPjaao).catch(() => true) : Promise.resolve())
      .then(() => (idPruebaClave && pruebaClaveDAO) ? pruebaClaveDAO.delete(idPruebaClave).catch(() => true) : Promise.resolve())
      .then(() => (idAulaBase && jornadaAulaDAO) ? jornadaAulaDAO.delete(idAulaBase).catch(() => true) : Promise.resolve())
      .then(() => (idJornada && pruebaJornadaDAO) ? pruebaJornadaDAO.delete(idJornada).catch(() => true) : Promise.resolve())
      .then(() => (idAspiranteOpcion && aspiranteOpcionDAO) ? aspiranteOpcionDAO.delete(idAspiranteOpcion).catch(() => true) : Promise.resolve())
      .then(() => (idAspirante && aspiranteDAO) ? aspiranteDAO.delete(idAspirante).catch(() => true) : Promise.resolve())
      .then(() => (idJornada && jornadaDAO) ? jornadaDAO.delete(idJornada).catch(() => true) : Promise.resolve())
      .then(() => (idPrueba && pruebaDAO) ? pruebaDAO.delete(idPrueba).catch(() => true) : Promise.resolve())
      .then(() => (idTipoPrueba && tipoPruebaDAO) ? tipoPruebaDAO.delete(idTipoPrueba).catch(() => true) : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PruebaJornadaAulaAspiranteOpcionExamenDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaJornadaAulaAspiranteOpcionExamenDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe registrar el examen exitosamente (201) para el AspiranteOpcion", function (done) {
      const examen = new PruebaJornadaAulaAspiranteOpcionExamen();
      examen.resultado = 85.5;
      examen.idPruebaClave = { idPruebaClave: idPruebaClave };
      // Java Resource se encarga de rellenar los IDs del padre basándose en la URL.

      cut.create(examen)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          examenCreado = true;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con conflicto (409) si se intenta crear un examen cuando el aspirante ya tiene uno", function (done) {
      const examenExtra = new PruebaJornadaAulaAspiranteOpcionExamen();
      examenExtra.resultado = 90.0;
      examenExtra.idPruebaClave = { idPruebaClave: idPruebaClave };

      cut.create(examenExtra)
        .then(() => done(new Error("La creación debió fallar porque ya existe un examen")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("409");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar (400) si falta el resultado o la clave de la prueba", function (done) {
      const examenInvalido = new PruebaJornadaAulaAspiranteOpcionExamen();
      // Falta .resultado y .idPruebaClave

      cut.create(examenInvalido)
        .then(() => done(new Error("La creación debió fallar por validación de datos")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método FindById
  // ==========================================
  describe("Method: findById()", function () {
    it("Debe obtener el examen creado pasando un string vacío al DAO", function (done) {
      // Como el GET en Java no tiene un @PathParam para un ID hijo, operamos sobre la raíz del recurso.
      cut.findById("")
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("resultado");
          chai.expect(response.datos.resultado).to.equal(85.5);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método Update
  // ==========================================
  describe("Method: update()", function () {
    it("Debe actualizar el resultado del examen exitosamente (200)", function (done) {
      const examenActualizado = new PruebaJornadaAulaAspiranteOpcionExamen();
      examenActualizado.resultado = 99.9;
      examenActualizado.idPruebaClave = { idPruebaClave: idPruebaClave };

      // Pasamos "" por la misma razón del backend: la ruta @PUT no recibe ID adicional
      cut.update("", examenActualizado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos.resultado).to.equal(99.9);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar la actualización (400) si se mandan datos incompletos", function (done) {
      const examenInvalido = new PruebaJornadaAulaAspiranteOpcionExamen();
      
      cut.update("", examenInvalido)
        .then(() => done(new Error("La actualización debió fallar")))
        .catch((error) => {
          chai.expect(error.mensaje).to.include("400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método Delete
  // ==========================================
  describe("Method: delete()", function () {
    it("Debe eliminar el examen exitosamente (204) y devolver 404 al intentar buscarlo nuevamente", function (done) {
      // Eliminamos el recurso (el backend lo mapea a @DELETE sin Path param)
      cut.delete("")
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          examenCreado = false; // Ya lo eliminamos, no necesitamos limpiarlo en el after()
          
          return cut.findById("");
        })
        .then(() => done(new Error("El recurso no debería existir tras su eliminación")))
        .catch((error) => {
          chai.expect(error.mensaje).to.include("404");
          done();
        });
    });
  });
});

mocha.run();