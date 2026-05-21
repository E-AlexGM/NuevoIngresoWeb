/**
 * Este archivo se ejecuta antes de cualquier test. Aquí podemos configurar cosas globales, como por ejemplo:
 * - Verificar si el servidor de pruebas está en línea o no, y crear funciones para saltar tests según el estado del servidor.
 * - Configurar cualquier otra cosa que necesitemos para nuestros tests.
 */

const SERVER_URL = "http://localhost:9080/admision-api/v1/";

async function comprobarConexion() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200); // 1.2 segundos máximo
    try {
        await fetch(SERVER_URL, {
            method: "GET",
            mode: "no-cors",
            signal: controller.signal,
            cache: "no-store",
            credentials: "omit",
        });
        return true; // Encendido
    } catch (e) {
        return false; // Apagado
    } finally {
        clearTimeout(timeout);
    }
}

export function requiereServidor() {
    before(async function() {
        const online = await comprobarConexion();
        if (!online) {
            this.skip(); // Salta la suite actual automáticamente
        }
    });
}

export function requiereServidorApagado() {
    before(async function() {
        const online = await comprobarConexion();
        if (online) {
            this.skip(); // Salta la suite actual automáticamente
        }
    });
}