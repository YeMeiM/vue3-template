const docEl = document.documentElement;
const dpr = window.devicePixelRatio || 1;

function setRemUnit(){
  docEl.style.fontSize = `${docEl.clientWidth / 10}px`;
}

setRemUnit();

window.addEventListener("resize", setRemUnit);

window.addEventListener("pageshow", function (e){
  e.persisted && setRemUnit();
})

if(dpr >= 2){
  const testElement = document.createElement("div");
  testElement.style.border = ".5px solid transparent";
  document.body.appendChild(testElement);
  if(testElement.offsetHeight === 1){
    docEl.classList.add("hairlines")
  }
  document.body.removeChild(testElement)
}

