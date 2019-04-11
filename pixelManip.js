
// let img = new Image();
// img.src = 'Saturn.jpg';
// let c = document.getElementById('canvas');
// let ctx = canvas.getContext('2d');
// // img.crossOrigin = "Anonymous";


// img.addEventListener('load', function() {
//     //drawImage statements go here
//     c.width = img.width;
//     c.height = img.height;
//     ctx.drawImage(img, 0, 0, 1200, 675);
// }, false);
// let demo = document.getElementById("demo");
const sub = document.getElementById("brightnessSubmit");
const form = document.getElementById("brightnessVal");
// let test = document.getElementById("stepsTest");
// let btn = document.getElementById("btn");
let c = document.getElementById("canvas");
let ctx = c.getContext('2d');
let img = new Image();
let brightest = 0;
let darkest = 255;
img.onload = setup; img.crossOrigin = "";
img.src = './Saturn.jpg';

function setup() {
   
     c.width = this.naturalWidth; c.height = this.naturalHeight;
		  ctx.drawImage(this, 0, 0);;
}
function reset(img) {
    c.width = img.naturalWidth; c.height = img.naturalHeight;
		  ctx.drawImage(img, 0, 0);; 
}


form.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
	e.preventDefault();
	reset(img);
    let  brightnessVal = document.getElementById("brightnessVal").value;
    brightnessSteps(brightnessVal);
	// Enter pressed
      return false;
    }
  }

// sub.onclick = function() {
//     let  brightnessVal = document.getElementById("brightnessVal").value;
//     reset(img);
//     brightnessSteps(brightnessVal);
    
// };

sub.addEventListener("click", function(event) {
    event.preventDefault();
    reset(img);
    let  brightnessVal = document.getElementById("brightnessVal").value;
    brightnessSteps(brightnessVal);
    
});

// btn.onclick = function() {
//     let idataSrc = ctx.getImageData(0,0, c.width, c.height),
// 	idataTrg = ctx.createImageData(c.width, c.height),
// 	dataSrc = idataSrc.data,
// 	dataTrg = idataTrg.data,
// 	len = dataSrc.length, i = 0, luma;
    
//     //convert by iteratiing over each pixel each representing RGBA
//     for (;i < len; i += 4) {
// 	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
// 	if(luma > brightest) {
// 	    brightest = luma;
// 	}
// 	if(luma < darkest) {
// 	    darkest = luma;
// 	}
// 	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
// 	dataTrg[i+3] = dataSrc[i+3];
//     }

    
//     ctx.putImageData(idataTrg, 0, 0);
//     // demo.src = c.toDataURL();

//     //restore backupdata
//     // ctx.putImageData(idataSrc, 0, 0);
    
// };

function brightnessSteps (number) {
    let idataSrc = ctx.getImageData(0,0, c.width, c.height),
	idataTrg = ctx.createImageData(c.width, c.height),
	dataSrc = idataSrc.data,
	dataTrg = idataTrg.data,
	len = dataSrc.length,luma;
    
    
    
    //convert by iteratiing over each pixel each representing RGBA
    for (let i = 0;i < len; i += 4) {
	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
	if(luma > brightest) {
	    brightest = luma;
	}
	if(luma < darkest) {
	    darkest = luma;
	}
	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
	dataTrg[i+3] = dataSrc[i+3];
    }
    let range = brightest - darkest;
    let step = range / number;
    
    for (let i = 0; i < len; i += 4) {
	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
	for(let k = step; k <= brightest; k += step) {
	    if(luma < k) {
		dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = k;
		break;
	    }
	}
    }
    ctx.putImageData(idataTrg, 0, 0);
    // demo.src = c.toDataURL();

    //restore backupdata
     // ctx.putImageData(idataSrc, 0, 0);
};

// test.onclick = function() {
//     brightnessSteps(10);
// };

let color = document.getElementById('color');

function pick(event) {
    let x = event.layerX;
    let y = event.layerY;
    let pixel = ctx.getImageData(x, y, 1, 1);
    let data = pixel.data;
    // console.log(data);
    let rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;
    color.style.background = rgba;
    color.textContent = `${rgba}
brightest: ${brightest}
darkest: ${darkest}`;
}

canvas.addEventListener('mousemove', pick);



