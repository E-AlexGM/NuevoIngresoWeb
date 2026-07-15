import * as chai from "../../../lib/chai/index.js";
import AreaDAO from "../../../../../src/js/control/area_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import Area from "../../../../../src/js/entity/area.js";

mocha.setup("bdd");

describe("AreaDAO Integration Tests - Online", function () {
  let cut;
  let idCreado;

  // Este before se ejecuta antes de cualquier prueba de esta clase
  before(function () {
    cut = new AreaDAO();
  });

  it("Debe crear una instancia de AreaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(AreaDAO);
  });

  //Método Create
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos de la área creada", function (done) {
      const area = new Area();
      area.nombre = "Area de Prueba";
      cut
        .create(area)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;
          chai.expect(response.datos.location).to.exist;
          idCreado = response.datos.id;
          chai.expect(idCreado).to.exist;
          done();
        })
        .catch(done);
    });

    it("Debe rechazar leyendo el header Process-Error cuando falla la creación (500)", function (done) {
      const areaInvalida = new Area();
      areaInvalida.nombre = null; // Nombre vacío para provocar error
      cut
        .create(areaInvalida)
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
        .catch(done);
    });

    it("Debe rechazar cuando se envía entidad con id (422)", function (done) {
      const areaConId = new Area();
      areaConId.idArea = "123e4567-e89b-12d3-a456-426614174000";
      areaConId.nombre = "Area de Prueba";
      cut
        .create(areaConId)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al crear los datos: 422");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de áreas y total_datos", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response).to.have.property("total_datos");
          chai.expect(response.total_datos).to.be.a("string");
          chai.expect(response.datos).to.have.length.above(1);
          done();
        })
        .catch(done);
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
            .to.include("Error al obtener los datos: 422");
          done();
        })
        .catch(done);
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

  describe("Method: findById()", function () {
    it("Debe retornar un DefaultResponse con la área encontrada", function (done) {
      cut
        .findById(idCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          var Area = response.datos;
          chai.expect(Area).to.have.property("idArea");
          chai.expect(Area).to.have.property("nombre");
          chai.expect(Area.idArea).to.exist;
          chai.expect(Area.nombre).to.exist;
          chai.expect(Area.idArea).to.equal(idCreado);
          chai.expect(Area.nombre).to.equal("Area de Prueba");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar si no se encuentra la área", function (done) {
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
        .catch(done);
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
        .catch(done);
    });

    it("Debe rechazar error al parsear los datos", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto"));
      };

      cut
        .findById(idCreado)
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
            done(); // Test exitoso
          } catch (assertError) {
            done(assertError); // Si la aserción de Chai falla, se le pasa a Mocha
          }
        });
    });
  });

  describe("Method: update()", function () {
    it("Debe actualizar la área creada y retornar un DefaultResponse con los datos actualizados", function (done) {
      const areaActualizada = new Area();
      areaActualizada.nombre = "Area Actualizada";
      cut
        .update(idCreado, areaActualizada)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("idArea");
          chai.expect(response.datos).to.have.property("nombre");
          chai.expect(response.datos.idArea).to.equal(idCreado);
          chai.expect(response.datos.nombre).to.equal("Area Actualizada");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar al intentar actualizar una área que no existe", function (done) {
      const areaInexistente = new Area();
      areaInexistente.nombre = "Area Inexistente";
      cut
        .update("123e4567-e89b-12d3-a456-426614174999", areaInexistente)
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
        .catch(done);
    });

    it("Debe rechazar al intentar actualizar con datos inválidos", function (done) {
      const areaInvalida = new Area();
      areaInvalida.nombre = null; // Nombre vacío para provocar error
      cut
        .update(idCreado, areaInvalida)
        .then(() => {
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al modificar los datos: 500");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar error al parsear los datos al actualizar", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto"));
      };

      const areaActualizada = { nombre: "Area Actualizada" };
      cut
        .update(idCreado, areaActualizada)
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

  describe("Method: delete()", function () {
    it("Debe eliminar la área creada y rechazar al intentar encontrarla", function (done) {
      cut
        .delete(idCreado)
        .then(() => {
          cut
            .findById(idCreado)
            .then(() => {
              done(new Error("La área debería haber sido eliminada"));
            })
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include("Error al obtener los datos: 404");
              done();
            })
            .catch(done);
        })
        .catch(done);
    });

    it("Debe rechazar al intentar eliminar una área que no existe", function (done) {
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
        .catch(done);
    });
  });
});

mocha.run();
