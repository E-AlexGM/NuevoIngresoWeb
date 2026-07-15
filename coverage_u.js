import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const filtroUsuario = process.argv[2] || '';
const filtros = filtroUsuario.split(',').map(f => f.trim()).filter(Boolean);

const DIRECTORIO_BASE_PRUEBAS = './test/js';
const CARPETA_CODIGO_FUENTE = './src/js'; 
const CARPETA_COBERTURA_TMP = './coverage/tmp';
const ARCHIVO_INYECTOR_TMP = './.temp_inyector.js'; 

const codigoInyector = `
import fs from 'fs';
import vm from 'vm';

global.window = global;
global.location = { 
    href: 'http://localhost/', 
    search: '', 
    pathname: '/',
    hostname: 'localhost',
    host: 'localhost',
    protocol: 'http:',
    origin: 'http://localhost'
};

if (typeof global.navigator === 'undefined') {
    global.navigator = { userAgent: 'node.js' };
}

global.document = {
    getElementById: () => null,
    createElement: () => ({}),
    location: global.location
};

if (typeof global.Response === 'undefined') {
    global.Response = class Response {
        constructor(body, init) {
            this.body = body;
            this.status = init?.status || 200;
            this.headers = init?.headers || {};
        }
        json() { return Promise.resolve(JSON.parse(this.body)); }
    };
}

const mochaCodigo = fs.readFileSync('./test/js/lib/mocha/mocha.js', 'utf8');
vm.runInThisContext(mochaCodigo);

const originalSetup = global.mocha.setup.bind(global.mocha);
const originalRun = global.mocha.run.bind(global.mocha);

global.mocha.setup = function(opts) {
    if (typeof opts === 'string') {
        originalSetup({ ui: opts, reporter: 'spec' });
    } else {
        originalSetup(opts);
    }
};

global.mocha.run = function() {
};

// Configuracion por defecto inicial 
originalSetup({ ui: 'tdd', reporter: 'spec' });

process.on('beforeExit', () => {
    if (!global.__pruebasEjecutadas) {
        global.__pruebasEjecutadas = true;
        originalRun(failures => {
            process.exitCode = failures ? 1 : 0;
        });
    }
});
`;
fs.writeFileSync(ARCHIVO_INYECTOR_TMP, codigoInyector);

if (fs.existsSync(CARPETA_COBERTURA_TMP)) {
    fs.rmSync(CARPETA_COBERTURA_TMP, { recursive: true, force: true });
}

const todosLosArchivosDePrueba = [];

function buscarPruebas(directorio) {
    if (!fs.existsSync(directorio)) return;
    
    const elementos = fs.readdirSync(directorio);
    for (const elemento of elementos) {
        const rutaCompleta = path.join(directorio, elemento);
        if (fs.statSync(rutaCompleta).isDirectory()) {
            buscarPruebas(rutaCompleta); 
        } else if (rutaCompleta.endsWith('_test.js')) { 
            todosLosArchivosDePrueba.push(rutaCompleta);
        }
    }
}

buscarPruebas(DIRECTORIO_BASE_PRUEBAS);

const archivosAFiltrar = todosLosArchivosDePrueba.filter(archivo => {
    if (filtros.length === 0) return true; // Si no hay filtro, pasan todos
    const rutaNormalizada = archivo.replace(/\\/g, '/');
    
    return filtros.some(filtro => {
        if (filtro.endsWith('.js')) {
            return rutaNormalizada.endsWith('/' + filtro) || rutaNormalizada === filtro;
        }
        return rutaNormalizada.includes(filtro);
    });
});

if (archivosAFiltrar.length === 0) {
    console.log(`No se encontraron pruebas unitarias que coincidan con el filtro: "${filtroUsuario}"`);
    if (fs.existsSync(ARCHIVO_INYECTOR_TMP)) fs.unlinkSync(ARCHIVO_INYECTOR_TMP);
    process.exit(0);
}

console.log(`Filtro aplicado: "${filtroUsuario || 'Ninguno (Ejecutando todas las pruebas unitarias)'}"`);
console.log(`Se encontraron ${archivosAFiltrar.length} archivos de prueba unitaria. Empezando ejecucion...\n`);

for (const archivo of archivosAFiltrar) {
    console.log(`Corriendo: ${archivo}`);
    try {
        execSync(`node --import ${ARCHIVO_INYECTOR_TMP} "${archivo}"`, {
            stdio: 'inherit',
            env: { ...process.env, NODE_V8_COVERAGE: CARPETA_COBERTURA_TMP }
        });
    } catch (error) {
        console.error(`\nError: Fallo la prueba unitaria en el archivo ${archivo}`);
        console.error('Abortando el script. No se generara reporte de cobertura final.\n');
        if (fs.existsSync(ARCHIVO_INYECTOR_TMP)) fs.unlinkSync(ARCHIVO_INYECTOR_TMP);
        process.exit(1);
    }
}

console.log('\nGenerando reporte de cobertura final...');
try {
    const comandoReporte = `npx c8 report --clean false --temp-directory ${CARPETA_COBERTURA_TMP} --reporter=html --reporter=text --reporter=lcov --all --src ${CARPETA_CODIGO_FUENTE} --include "src/js/control/**" --include "src/js/entity/**" --exclude ".temp_inyector.js"`;
    execSync(comandoReporte, { stdio: 'inherit' });
    console.log('\nProceso completado. Revisa el archivo ./coverage/index.html');
} catch (error) {
    console.error('Error al generar el reporte de cobertura.', error.message);
}

if (fs.existsSync(ARCHIVO_INYECTOR_TMP)) {
    fs.unlinkSync(ARCHIVO_INYECTOR_TMP);
}