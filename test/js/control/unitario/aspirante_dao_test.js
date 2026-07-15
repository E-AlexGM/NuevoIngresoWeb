import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import AspiranteDAO from "../../../../src/js/control/aspirante_dao.js";
import Aspirante from "../../../../src/js/entity/aspirante.js";
import DefaultResponse from "../../../../src/js/entity/default_response.js";
import DefaultError from "../../../../src/js/entity/default_error.js";

mocha.setup("tdd");

suite("AspiranteDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new AspiranteDAO();
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });

    suite("Constructor", function () {
        test("Debe invocar a super() y concatenar 'aspirante/' a la URL base heredada", function () {
            chai.assert.isDefined(cut.URL);
            chai.assert.equal(cut.URL, "http://localhost:9080/admision-api/v1/aspirante/");
        });
    });

    suite("findRange()", function () {
        test("Debe delegar la llamada a _findRange y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_findRange");
            stubFetch = sinon.stub(cut, "_findRange").returns(mockPromise);

            const firstParam = 0;
            const maxParam = 10;

            const resultado = cut.findRange(firstParam, maxParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(firstParam, maxParam));
        });
    });

    suite("create()", function () {
        test("Debe delegar la llamada a _create y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_create");
            stubFetch = sinon.stub(cut, "_create").returns(mockPromise);

            const aspirante = new Aspirante();
            aspirante.nombres = "Ana";
            aspirante.apellidos = "Paz";

            const resultado = cut.create(aspirante);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(aspirante));
        });
    });

    suite("findById()", function () {
        test("Debe delegar la llamada a _findById y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_findById");
            stubFetch = sinon.stub(cut, "_findById").returns(mockPromise);

            const idParam = "123";

            const resultado = cut.findById(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("update()", function () {
        test("Debe delegar la llamada a _update y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_update");
            stubFetch = sinon.stub(cut, "_update").returns(mockPromise);

            const idParam = "123";
            const aspirante = new Aspirante();
            aspirante.nombres = "Ana";
            aspirante.apellidos = "Paz";

            const resultado = cut.update(idParam, aspirante);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam, aspirante));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_delete");
            stubFetch = sinon.stub(cut, "_delete").returns(mockPromise);

            const idParam = "123";

            const resultado = cut.delete(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("findByEmail()", function () {
        test("Debe retornar un DefaultResponse con el aspirante encontrado", function (done) {
            const mockAspirante = { idAspirante: "123", correo: "ana.paz@example.com" };
            const mockResponse = {
                status: 200,
                json() {
                    return Promise.resolve(mockAspirante);
                },
            };
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            const correoParam = "ana.paz@example.com";

            cut
                .findByEmail(correoParam)
                .then((response) => {
                    chai.assert.instanceOf(response, DefaultResponse);
                    chai.assert.deepEqual(response.datos, mockAspirante);
                    chai.assert.isTrue(
                        stubFetch.calledWithMatch(
                            sinon.match(/buscar\?correo=ana\.paz@example\.com$/),
                            { method: "GET" },
                        ),
                    );
                    done();
                })
                .catch(done);
        });

        test("Debe rechazar con DefaultError cuando el estatus no es 200", function (done) {
            const mockResponse = { status: 404 };
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            cut
                .findByEmail("no.existe@example.com")
                .then(() => done(new Error("Se esperaba rechazo")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.include(error.mensaje, "Error al obtener los datos: 404");
                    done();
                });
        });

        test("Debe rechazar cuando falla el parseo JSON", function (done) {
            const mockResponse = {
                status: 200,
                json() {
                    return Promise.reject(new Error("Simulado: JSON corrupto"));
                },
            };
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            cut
                .findByEmail("ana.paz@example.com")
                .then(() => done(new Error("Se esperaba rechazo")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.include(
                        error.mensaje,
                        "Error al parsear los datos: Simulado: JSON corrupto",
                    );
                    done();
                });
        });

        test("Debe rechazar cuando el fetch falla", function (done) {
            const networkError = new Error("Network Error");
            stubFetch = sinon.stub(window, "fetch").rejects(networkError);

            cut
                .findByEmail("ana.paz@example.com")
                .then(() => done(new Error("Se esperaba rechazo")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, "Error al acceder al repositorio");
                    chai.assert.equal(error.error, networkError);
                    done();
                });
        });
    });
});

mocha.run();