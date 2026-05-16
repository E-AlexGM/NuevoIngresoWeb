import DefaultDAO from "./default_dao.js";
import JornadaDAO from "./jornada_dao.js";
import AreaDAO from "./area_dao.js";
import Area from "../entity/area.js";

class ProcesarLentoDAO extends DefaultDAO {
    constructor(){
        super();
        this.BASE_URL += 'procesarlento/'
    }

    procesarLento(){
        let promesa = fetch(this.BASE_URL, {method: 'GET'})
        promesa.then(respuesta => {
            if(respuesta.status === 200){
                respuesta.json().then(datos => {
                    console.log(datos)
                })
            }
        }).catch(error => {
            console.error(error);
        });
        console.log("Aquí hacer return");
    }
    async procesarSincrono(){
        this.procesarLento();
    }
}
let areaDAO = new AreaDAO();
areaDAO.findRange(0, 50).then(areas => {
    console.log(areas);
}).catch(error => {
    console.error(error);
});

let area = new Area();
area.nombre = "Área de Prueba";
area.descripcion = "Actualizado desde el frontend";

areaDAO.findById("dd5eadb4-402c-4d32-85f3-373a5fe8a21f").then(area => {
    console.log(area);
}).catch(error => {
    console.error(error);
});

let nuevoArea = new Area();
nuevoArea.nombre = "Área de Prueba";
nuevoArea.descripcion = "Creado desde el frontend";

areaDAO.create(nuevoArea).then(area => {
    console.log(area);
}).catch(error => {
    console.error(error);
});

export default ProcesarLentoDAO;