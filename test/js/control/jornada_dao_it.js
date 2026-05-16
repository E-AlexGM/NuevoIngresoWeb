import * as chai from '../lib/chai/index.js';
import JornadaDAO from '../../../src/js/control/jornada_dao.js';
import DefaultResponse from '../../../src/js/entity/default_response.js';
mocha.setup('bdd');

describe('JornadaDAO Integration Test', function() {
    var cut;

    it('should create a Instance of JornadaDAO', function() {
        cut = new JornadaDAO();
        chai.expect(cut).to.be.an.instanceOf(JornadaDAO);
    });
    it('findRange should return DefaultResponse with data and total_datos', function(done) {
        cut.findRange(0, 10).then(response => {
            chai.expect(response).to.be.an.instanceOf(DefaultResponse);
            chai.expect(response.datos).to.be.an('array');
            chai.expect(response.datos).to.have.lengthOf(1);
            chai.expect(response.total_datos).to.equal('1');
            done();
        }).catch(e => {
            done(e);
        });
    });

});

mocha.run();