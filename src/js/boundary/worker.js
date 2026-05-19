let cuenta = 0;
function contar(){
    cuenta++;
    postMessage(cuenta);
    setTimeout("contar()", 500);
}

contar();
onmessage = function(e){
    cuenta = e.data;
}