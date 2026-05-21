import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import JornadaAulaDAO from "../../../../src/js/control/jornada_aula_dao.js";

mocha.setup("tdd");

suite("JornadaAulaDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new JornadaAulaDAO("jornada-123");
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
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

            const jornadaAula = { idAula: "A1" };

            const resultado = cut.create(jornadaAula);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(jornadaAula));
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