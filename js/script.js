//ocultando elementos que estaran en el popup
$(document).ready(function(){
    $("#miDiv").hide();
});

//funcion para buscar al presionar enter
$("#nomPokemon").keypress(function(e){
    if(e.which==13){
        $("#btnBuscar").click();
    }
});

//Inicializando variable global para el id del pokemon
let idGlobal = 0;

//Debounce para evitar multiples peticiones en la funcion de buscar
$("#btnBuscar").click($.debounce(250, async function(e){
    //se inicializa la variable global en 0
    idGlobal = 0;
    //se obtiene el estado de la funcion obtenerDatos
    let funciona = await obtenerDatos();
    //si la funcion obtenerDatos retorna true, se ejecuta la funcion obtenerDescripcion
    if(funciona){
    await obtenerDescripcion();
    const instanciaPokemon = $("#miDiv").mobiscroll().popup(
        {
            closeOnEsc: true,
            onClose: function(){
                    $("#nomPokemon").val("");
            }
        }
    ).mobiscroll('getInst');
    instanciaPokemon.open();

    }
    //si la funcion obtenerDatos retorna false, se limpian los campos y se muestra un mensaje de error
    else{
        limpiar();
        mobiscroll.alert({
            title: 'Error',
            message: 'Pokemon no encontrado',
            onClose: function(){
                $("#nomPokemon").focus();
            },
            display: 'center',
        });
    }})
);

//funcion para obtener los datos del pokemon
async function obtenerDatos(){
    const nombre = $("#nomPokemon").val();
    try {
    const response = await $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${nombre}`,
        method: 'GET'
    });
    console.log(response);
    $("#nomInfor").html(`<font size='8'><b>${response.name}</font></b>`);
    $("#pokeImg").attr("src", response.sprites.front_default);
    
    let tipo = response.types[0].type.name;
    if(response.types.length === 2){
        tipo = tipo+" - "+response.types[1].type.name;
    }
    $("#tipoInf").html(`Tipo: ${tipo}`);
    $("#alturaInf").html(`Altura: ${response.height}`);
    $("#pesoInf").html(`Peso: ${response.weight}kg`);
    idGlobal = response.id;
    return true;
    } catch (error) {
    console.error('Error fetching data:', error);
    return false;
    }
}

//funcion para obtener la descripcion del pokemon
async function obtenerDescripcion(){
    try {
    const speciesResponse = await $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon-species/'+idGlobal,
        method: 'GET'
    });
    console.log(speciesResponse);
    const flavorTextEntries = speciesResponse.flavor_text_entries;
    for (let entry of flavorTextEntries) {
        if (entry.language.name === "es") {
        $("#descriPoke").html('Descripcion: '+entry.flavor_text);
        break;
        }
    }
    } catch (error) {
    console.error('Error fetching description:', error);
    }
}

//funcion para limpiar los campos
function limpiar() {
    $("#nomPokemon").val("");
    $("#nomInfor").html("");
    $("#pokeImg").attr("src", "");
    $("#tipoInf").html("");
    $("#alturaInf").html("");
    $("#pesoInf").html("");
    $("#descriPoke").html("");
    
}
