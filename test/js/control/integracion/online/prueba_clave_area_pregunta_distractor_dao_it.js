import * as chai from "../../../lib/chai/index.js";
import PruebaClaveAreaPreguntaDistractorDAO from "../../../../../src/js/control/prueba_clave_area_pregunta_distractor_dao.js";
import PruebaClaveAreaPreguntaDAO from "../../../../../src/js/control/prueba_clave_area_pregunta_dao.js";
import PruebaClaveAreaDAO from "../../../../../src/js/control/prueba_clave_area_dao.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import PreguntaDAO from "../../../../../src/js/control/pregunta_dao.js";
import DistractorDAO from "../../../../../src/js/control/distractor_dao.js";
import PreguntaAreaDAO from "../../../../../src/js/control/pregunta_area_dao.js";
import DistractorAreaDAO from "../../../../../src/js/control/distractor_area_dao.js";
import PreguntaDistractorDAO from "../../../../../src/js/control/pregunta_distractor_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaClaveAreaPreguntaDistractor from "../../../../../src/js/entity/prueba_clave_area_pregunta_distractor.js";
import PruebaClaveAreaPregunta from "../../../../../src/js/entity/prueba_clave_area_pregunta.js";
import PruebaClaveArea from "../../../../../src/js/entity/prueba_clave_area.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Area from "../../../../../src/js/entity/area.js";
import Pregunta from "../../../../../src/js/entity/pregunta.js";
import Distractor from "../../../../../src/js/entity/distractor.js";
import PreguntaArea from "../../../../../src/js/entity/pregunta_area.js";
import DistractorArea from "../../../../../src/js/entity/distractor_area.js";
import PreguntaDistractor from "../../../../../src/js/entity/pregunta_distractor.js";


mocha.setup("bdd");

describe("PruebaClaveAreaPreguntaDistractorDAO Integration Tests - Online", function () {
  
  let cut;
  let tipoPruebaDAO, pruebaDAO, areaDAO, pruebaClaveDAO, preguntaDAO, distractorDAO;
  let pruebaClaveAreaDAO, pruebaClaveAreaPreguntaDAO;
  let preguntaAreaDAO, distractorAreaDAO, preguntaDistractorDAO;

  let idTipoPruebaCreado, idPruebaCreado, idAreaCreado, idPruebaClaveCreado, idPreguntaCreado, idDistractorCreado;
  let idPcaCreado, idPcapCreado, idMapeoCreado;
  let idPreguntaAreaCreado, idDistractorAreaCreado, idPreguntaDistractorCreado;

  let registroBase;

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    areaDAO = new AreaDAO();
    preguntaDAO = new PreguntaDAO();
    distractorDAO = new DistractorDAO();

    const ts = Date.now();
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_DIST_" + ts;
    tipoPrueba.activo = true;

    tipoPruebaDAO.create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPruebaCreado = resTipo.datos.id;
        
        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_DIST_" + ts;
        prueba.indicaciones = "Indicaciones";
        prueba.puntajeMaximo = 100.0;
        prueba.notaAprobacion = 60.0;
        prueba.duracion = 90;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00";
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPruebaCreado };
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Crear Area";
        idPruebaCreado = resPrueba.datos.id;
        pruebaClaveDAO = new PruebaClaveDAO(idPruebaCreado);
        
        const area = new Area();
        area.nombre = "Area Map Dist " + ts;
        area.activo = true;
        return areaDAO.create(area);
      })
      .then((resArea) => {
        pasoActual = "Crear PruebaClave";
        idAreaCreado = resArea.datos.id;
        
        const clave = new PruebaClave();
        clave.nombreClave = "Clave " + ts;
        clave.idPrueba = { idPrueba: idPruebaCreado };
        return pruebaClaveDAO.create(clave);
      })
      .then((resClave) => {
        pasoActual = "Crear Pregunta";
        idPruebaClaveCreado = resClave.datos.id;
        
        const pregunta = new Pregunta();
        pregunta.enunciado = "¿Cuál es un distractor válido? " + ts;
        pregunta.activo = true;
        return preguntaDAO.create(pregunta);
      })
      .then((resPregunta) => {
        pasoActual = "Crear Distractor";
        idPreguntaCreado = resPregunta.datos.id;
        
        const distractor = new Distractor();
        distractor.texto = "Opción incorrecta simulada " + ts;
        distractor.activo = true;
        return distractorDAO.create(distractor);
      })
      .then((resDistractor) => {
        pasoActual = "Crear Mapeo PreguntaArea";
        idDistractorCreado = resDistractor.datos.id;

        preguntaAreaDAO = new PreguntaAreaDAO(idPreguntaCreado);
        const pa = new PreguntaArea();
        pa.idArea = { idArea: idAreaCreado };
        return preguntaAreaDAO.create(pa);
      })
      .then((resPA) => {
        pasoActual = "Crear Mapeo DistractorArea";
        idPreguntaAreaCreado = resPA?.datos?.id;

        distractorAreaDAO = new DistractorAreaDAO(idDistractorCreado);
        const da = new DistractorArea();
        da.idArea = { idArea: idAreaCreado };
        return distractorAreaDAO.create(da);
      })
      .then((resDA) => {
        pasoActual = "Crear Mapeo PreguntaDistractor";
        idDistractorAreaCreado = resDA?.datos?.id;

        preguntaDistractorDAO = new PreguntaDistractorDAO(idPreguntaCreado);
        const pd = new PreguntaDistractor();
        pd.idDistractor = { idDistractor: idDistractorCreado };
        pd.correcto = false;
        return preguntaDistractorDAO.create(pd);
      })
      .then((resPD) => {
        pasoActual = "Crear Mapeo PruebaClaveArea";
        idPreguntaDistractorCreado = resPD?.datos?.id;

        pruebaClaveAreaDAO = new PruebaClaveAreaDAO(idPruebaClaveCreado);
        const pca = new PruebaClaveArea();
        pca.idPruebaClave = { idPruebaClave: idPruebaClaveCreado };
        pca.idArea = { idArea: idAreaCreado };
        
        return pruebaClaveAreaDAO.create(pca);
      })
      .then((resPCA) => {
        pasoActual = "Crear Mapeo PruebaClaveAreaPregunta";
        idPcaCreado = resPCA?.datos?.id || null;

        pruebaClaveAreaPreguntaDAO = new PruebaClaveAreaPreguntaDAO(idPruebaClaveCreado, idAreaCreado);
        const pcap = new PruebaClaveAreaPregunta();
        pcap.idPruebaClave = { idPruebaClave: idPruebaClaveCreado };
        pcap.idArea = { idArea: idAreaCreado };
        pcap.idPregunta = { idPregunta: idPreguntaCreado };
        pcap.porcentaje = 5.0; 
        
        return pruebaClaveAreaPreguntaDAO.create(pcap);
      })
      .then((resPCAP) => {
        idPcapCreado = resPCAP?.datos?.id || null;

        cut = new PruebaClaveAreaPreguntaDistractorDAO(idPruebaClaveCreado, idAreaCreado, idPreguntaCreado);
        registroBase = new PruebaClaveAreaPreguntaDistractor();
        registroBase.idPruebaClave = { idPruebaClave: idPruebaClaveCreado };
        registroBase.idArea = { idArea: idAreaCreado };
        registroBase.idPregunta = { idPregunta: idPreguntaCreado };
        registroBase.idDistractor = { idDistractor: idDistractorCreado };

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    let pLimpieza = idMapeoCreado ? cut.delete(idMapeoCreado).catch(() => true) : Promise.resolve();

    pLimpieza
      .then(() => idPcapCreado ? pruebaClaveAreaPreguntaDAO.delete(idPcapCreado).catch(() => true) : Promise.resolve())
      .then(() => idPcaCreado ? pruebaClaveAreaDAO.delete(idPcaCreado).catch(() => true) : Promise.resolve())
      .then(() => idPreguntaDistractorCreado ? preguntaDistractorDAO.delete(idPreguntaDistractorCreado).catch(() => true) : Promise.resolve())
      .then(() => idDistractorAreaCreado ? distractorAreaDAO.delete(idDistractorAreaCreado).catch(() => true) : Promise.resolve())
      .then(() => idPreguntaAreaCreado ? preguntaAreaDAO.delete(idPreguntaAreaCreado).catch(() => true) : Promise.resolve())
      .then(() => idDistractorCreado ? distractorDAO.delete(idDistractorCreado).catch(() => true) : Promise.resolve())
      .then(() => idPreguntaCreado ? preguntaDAO.delete(idPreguntaCreado).catch(() => true) : Promise.resolve())
      .then(() => idPruebaClaveCreado ? pruebaClaveDAO.delete(idPruebaClaveCreado).catch(() => true) : Promise.resolve())
      .then(() => idAreaCreado ? areaDAO.delete(idAreaCreado).catch(() => true) : Promise.resolve())
      .then(() => idPruebaCreado ? pruebaDAO.delete(idPruebaCreado).catch(() => true) : Promise.resolve())
      .then(() => idTipoPruebaCreado ? tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true) : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PruebaClaveAreaPreguntaDistractorDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaClaveAreaPreguntaDistractorDAO);
  });
  describe("Method: create()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe retornar un DefaultResponse con los datos del distractor asociado (201)", function (done) {
      cut.create(registroBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos.id).to.exist;

          idMapeoCreado = response.datos.id; // Lo guardamos para poder limpiarlo en el after
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando falta información obligatoria en el payload (400)", function (done) {
      const mapeoInvalido = new PruebaClaveAreaPreguntaDistractor(); 

      cut.create(mapeoInvalido)
        .then(() => done(new Error("La creación debió fallar")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al crear los datos: 400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando el padre (Pregunta) no existe en esa ruta (404)", function (done) {
      const cutFalso = new PruebaClaveAreaPreguntaDistractorDAO(idPruebaClaveCreado, idAreaCreado, idFalso);
      const registro = new PruebaClaveAreaPreguntaDistractor();
      registro.idDistractor = { idDistractor: idDistractorCreado };

      cutFalso.create(registro)
        .then(() => done(new Error("La creación debió fallar por padre no encontrado")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al crear los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando el ID del distractor enviado en el payload no existe (404)", function (done) {
      const registro = new PruebaClaveAreaPreguntaDistractor();
      registro.idDistractor = { idDistractor: idFalso };

      cut.create(registro)
        .then(() => done(new Error("La creación debió fallar por distractor no encontrado")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al crear los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con la lista de distractores del contexto (200)", function (done) {
      cut.findRange(0, 50)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response).to.have.property("total_datos");
          // Debería existir al menos 1 por la creación exitosa anterior
          chai.expect(response.datos.length).to.be.above(0); 
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si se mandan parámetros de paginación inválidos (400)", function (done) {
      cut.findRange(-1, 0)
        .then(() => done(new Error("La consulta debió fallar")))
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

      cut.findRange(0, 50)
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

  describe("Method: delete()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe desasociar/eliminar el distractor del contexto exitosamente (204) y fallar al buscar de nuevo", function (done) {
      cut.delete(idMapeoCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          
          const idEliminado = idMapeoCreado;
          idMapeoCreado = null; // Limpiamos para que el hook 'after' no intente borrarlo de nuevo

          // Intentamos borrar de nuevo el mismo elemento (o buscarlo), debería dar 404
          return cut.delete(idEliminado);
        })
        .then(() => done(new Error("La segunda eliminación debió retornar 404")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar eliminar un distractor no asociado (404)", function (done) {
      cut.delete(idFalso)
        .then(() => done(new Error("La eliminación debió fallar")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });
});

mocha.run();