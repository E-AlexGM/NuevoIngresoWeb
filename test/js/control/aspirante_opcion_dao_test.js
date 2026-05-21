import * as chai from "../lib/chai/index.js";
import sinon from "../lib/sinon/sinon-esm.js";
import AspiranteOpcionDAO from "../../../src/js/control/aspirante_opcion_dao.js";

mocha.setup("tdd");

suite("AspiranteOpcionDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new AspiranteOpcionDAO("aspirante-123");
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });

    suite("Constructor", function () {
        test("Debe invocar a super() y concatenar la ruta de aspirante y opción", function () {
            chai.assert.isDefined(cut.URL);
            chai.assert.equal(cut.URL, "http://localhost:9080/admision-api/v1/aspirante/aspirante-123/opcion/");
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

            const aspiranteOpcion = { idOpcion: 1 };

            const resultado = cut.create(aspiranteOpcion);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(aspiranteOpcion));
        });
    });

    suite("findById()", function () {
        test("Debe delegar la llamada a _findById y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_findById");
            stubFetch = sinon.stub(cut, "_findById").returns(mockPromise);

            const idParam = "99";

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

            const idParam = "99";
            const aspiranteOpcion = { idOpcion: 2 };

            const resultado = cut.update(idParam, aspiranteOpcion);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam, aspiranteOpcion));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete y retornar su promesa", function () {
            const mockPromise = Promise.resolve("datos_delete");
            stubFetch = sinon.stub(cut, "_delete").returns(mockPromise);

            const idParam = "99";

            const resultado = cut.delete(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });
});

mocha.run();