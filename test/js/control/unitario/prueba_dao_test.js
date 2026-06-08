import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import PruebaDAO from "../../../../src/js/control/prueba_dao.js";
import Prueba from "../../../../src/js/entity/prueba.js";
import DefaultResponse from "../../../../src/js/entity/default_response.js";
import DefaultError from "../../../../src/js/entity/default_error.js";

mocha.setup("tdd");

suite("PruebaDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new PruebaDAO();
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });


    suite("list()", function () {
        test("Debe retornar DefaultResponse con un array de pruebas (200 OK)", function (done) {
            const mockDatos = [{ idPrueba: "1", nombre: "Examen Admisión" }];
            const mockResponse = new Response(JSON.stringify(mockDatos), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
            
            // Hacemos stub al fetch global de la ventana del navegador
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            const activoParam = true;

            cut.list(activoParam)
                .then((response) => {
                    chai.assert.instanceOf(response, DefaultResponse);
                    chai.assert.deepEqual(response.datos, mockDatos);
                    
                    // Verificamos que construyó la URL correctamente usando el parámetro 'activo'
                    chai.assert.isTrue(stubFetch.calledOnce);
                    chai.assert.isTrue(
                        stubFetch.calledWithMatch(sinon.match(/\?activo=true$/), {
                            method: "GET"
                        })
                    );
                    done();
                })
                .catch(done);
        });

        test("Debe rechazar con DefaultError cuando el estatus no es 200 (ej. 404)", function (done) {
            const mockResponse = new Response(null, { status: 404 });
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            cut.list(false)
                .then(() => done(new Error("Se esperaba un rechazo del método")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, "Error al obtener los datos: 404");
                    done();
                });
        });

        test("Debe rechazar con DefaultError cuando falla el parseo del JSON", function (done) {
            const mockResponse = {
                status: 200,
                json() {
                    return Promise.reject(new Error("JSON inválido"));
                }
            };
            stubFetch = sinon.stub(window, "fetch").resolves(mockResponse);

            cut.list(true)
                .then(() => done(new Error("Se esperaba un rechazo por JSON corrupto")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.include(error.mensaje, "Error al parsear los datos: JSON inválido");
                    done();
                });
        });

        test("Debe rechazar con DefaultError cuando fetch falla por un Error de Red", function (done) {
            const networkError = new Error("Failed to fetch");
            stubFetch = sinon.stub(window, "fetch").rejects(networkError);

            cut.list(true)
                .then(() => done(new Error("Se esperaba un rechazo por error de red")))
                .catch((error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, "Error al acceder al repositorio");
                    chai.assert.equal(error.error, networkError);
                    done();
                });
        });
    });
    

    suite("findRange()", function () {
        test("Debe delegar la llamada a _findRange con los parámetros recibidos", function () {
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
        test("Debe delegar la llamada a _create con el objeto recibido", function () {
            const mockPromise = Promise.resolve("datos_create");
            stubFetch = sinon.stub(cut, "_create").returns(mockPromise);

            const prueba = new Prueba();
            prueba.nombre = "Examen";

            const resultado = cut.create(prueba);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(prueba));
        });
    });

    suite("findById()", function () {
        test("Debe delegar la llamada a _findById con el id recibido", function () {
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
        test("Debe delegar la llamada a _update con los parámetros recibidos", function () {
            const mockPromise = Promise.resolve("datos_update");
            stubFetch = sinon.stub(cut, "_update").returns(mockPromise);

            const idParam = "123";
            const prueba = new Prueba();
            prueba.nombre = "Examen";

            const resultado = cut.update(idParam, prueba);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam, prueba));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete con el id recibido", function () {
            const mockPromise = Promise.resolve("datos_delete");
            stubFetch = sinon.stub(cut, "_delete").returns(mockPromise);

            const idParam = "123";

            const resultado = cut.delete(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("Constructor", function () {
        test("Debe invocar a super() y ajustar la URL base", function () {
            chai.assert.isDefined(cut.URL);
            chai.assert.isTrue(cut.URL.startsWith(cut.BASE_URL));
        });
    });
});

mocha.run();