import * as chai from "../lib/chai/index.js";
import sinon from "../lib/sinon/sinon-esm.js";
import PruebaDAO from "../../../src/js/control/prueba_dao.js";

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

    suite("findRange()", function () {
        test("Debe delegar la llamada a _findRange con los parámetros recibidos", function () {
            stubFetch = sinon.stub(cut, "_findRange").resolves();

            const firstParam = 0;
            const maxParam = 10;

            cut.findRange(firstParam, maxParam);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(firstParam, maxParam));
        });
    });

    suite("create()", function () {
        test("Debe delegar la llamada a _create con el objeto recibido", function () {
            stubFetch = sinon.stub(cut, "_create").resolves();

            const prueba = { nombre: "Examen" };

            cut.create(prueba);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(prueba));
        });
    });

    suite("findById()", function () {
        test("Debe delegar la llamada a _findById con el id recibido", function () {
            stubFetch = sinon.stub(cut, "_findById").resolves();

            const idParam = "123";

            cut.findById(idParam);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("update()", function () {
        test("Debe delegar la llamada a _update con los parámetros recibidos", function () {
            stubFetch = sinon.stub(cut, "_update").resolves();

            const idParam = "123";
            const prueba = { nombre: "Examen" };

            cut.update(idParam, prueba);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam, prueba));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete con el id recibido", function () {
            stubFetch = sinon.stub(cut, "_delete").resolves();

            const idParam = "123";

            cut.delete(idParam);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });
});

mocha.run();