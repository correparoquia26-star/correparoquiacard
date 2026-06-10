const inputFoto = document.getElementById("input-foto");
const fotoUser = document.getElementById("foto-user");
const areaFoto = document.getElementById("area-foto");
const placeholder = document.getElementById("foto-placeholder");

const sliderZoom = document.getElementById("slider-zoom");
const btnReset = document.getElementById("btn-reset");
const btnDownload = document.getElementById("btn-download");

const nomeInput = document.getElementById("nome-corredor");
const textoNome = document.getElementById("texto-nome");

let scale = 1;
let posX = 0;
let posY = 0;

function atualizarFoto(){
    fotoUser.style.transform =
        `translate(-50%, -50%) translate(${posX}px, ${posY}px) scale(${scale})`;
}

nomeInput.addEventListener("input", () => {
    textoNome.textContent = nomeInput.value.toUpperCase();
});

inputFoto.addEventListener("change", function(){
    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){
        fotoUser.src = e.target.result;
        fotoUser.style.display = "block";
        placeholder.style.display = "none";

        scale = 1;
        posX = 0;
        posY = 0;
        sliderZoom.value = 100;

        atualizarFoto();
    };

    reader.readAsDataURL(file);
});

sliderZoom.addEventListener("input", () => {
    scale = Number(sliderZoom.value) / 100;
    atualizarFoto();
});

btnReset.addEventListener("click", () => {
    scale = 1;
    posX = 0;
    posY = 0;
    sliderZoom.value = 100;

    atualizarFoto();
});

let arrastando = false;
let inicioX = 0;
let inicioY = 0;

areaFoto.addEventListener("pointerdown", e => {
    arrastando = true;
    inicioX = e.clientX;
    inicioY = e.clientY;
    areaFoto.setPointerCapture(e.pointerId);
});

areaFoto.addEventListener("pointermove", e => {
    if(!arrastando) return;

    posX += e.clientX - inicioX;
    posY += e.clientY - inicioY;

    inicioX = e.clientX;
    inicioY = e.clientY;

    atualizarFoto();
});

areaFoto.addEventListener("pointerup", e => {
    arrastando = false;
    areaFoto.releasePointerCapture(e.pointerId);
});

btnDownload.addEventListener("click", async () => {
    btnDownload.textContent = "Gerando Card...";

    const card = document.getElementById("card-evento");

    const canvas = await html2canvas(card, {
    scale:3,
    useCORS:true,
    allowTaint:true,
    backgroundColor:"#020817",
    scrollX:0,
    scrollY:0
});

    canvas.toBlob(async blob => {
        const file = new File([blob], "card-oficial.png", {
            type:"image/png"
        });

        if(navigator.canShare && navigator.canShare({files:[file]})){
            await navigator.share({
                title:"Meu Card",
                files:[file]
            });
        }else{
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "card-oficial.png";
            link.click();
        }

        btnDownload.textContent = "Salvar Card";
    });
});
