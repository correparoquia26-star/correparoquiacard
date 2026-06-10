const inputFoto = document.getElementById("input-foto");
const userFoto = document.getElementById("user-foto");
const userFotoBg = document.getElementById("user-foto-bg");
const wrapperFoto = document.getElementById("wrapper-foto");
const fotoPlaceholder = document.getElementById("foto-placeholder");

const sliderZoom = document.getElementById("slider-zoom");

const btnReset = document.getElementById("btn-reset");
const btnDownload = document.getElementById("btn-download");

const nomeInput = document.getElementById("nome-corredor");
const textoNome = document.getElementById("texto-nome");

let scale = 1;
let translateX = 0;
let translateY = 0;

function aplicarTransformacoes(){
    userFoto.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    userFotoBg.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale * 1.25})`;
}

nomeInput.addEventListener("input", () => {
    textoNome.textContent = nomeInput.value.toUpperCase();
});

inputFoto.addEventListener("change", e => {
    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(event){
        userFoto.src = event.target.result;
        userFotoBg.src = event.target.result;

        userFoto.style.display = "block";
        userFotoBg.style.display = "block";
        fotoPlaceholder.style.display = "none";

        scale = 1;
        translateX = 0;
        translateY = 0;
        sliderZoom.value = 100;

        aplicarTransformacoes();
    };

    reader.readAsDataURL(file);
});

sliderZoom.addEventListener("input", e => {
    scale = Number(e.target.value) / 100;
    aplicarTransformacoes();
});

btnReset.addEventListener("click", () => {
    scale = 1;
    translateX = 0;
    translateY = 0;

    sliderZoom.value = 100;

    aplicarTransformacoes();
});

let dragging = false;
let startX = 0;
let startY = 0;

wrapperFoto.addEventListener("pointerdown", e => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;

    wrapperFoto.setPointerCapture(e.pointerId);
});

wrapperFoto.addEventListener("pointermove", e => {
    if(!dragging) return;

    translateX += e.clientX - startX;
    translateY += e.clientY - startY;

    startX = e.clientX;
    startY = e.clientY;

    aplicarTransformacoes();
});

wrapperFoto.addEventListener("pointerup", e => {
    dragging = false;
    wrapperFoto.releasePointerCapture(e.pointerId);
});

btnDownload.addEventListener("click", async () => {
    btnDownload.innerText = "Gerando Card...";

    const canvas = await html2canvas(
        document.getElementById("card-evento"),
        {
            scale:4,
            useCORS:true,
            backgroundColor:null
        }
    );

    canvas.toBlob(async blob => {
        const file = new File(
            [blob],
            "card-oficial.png",
            { type:"image/png" }
        );

        if(navigator.canShare && navigator.canShare({ files:[file] })){
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

        btnDownload.innerText = "Salvar Card";
    });
});
