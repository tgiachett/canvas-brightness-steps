const sub = document.getElementById("brightnessSubmit");
const form = document.getElementById("brightnessVal");
const c = document.getElementById("canvas");
const ctx = c.getContext('2d');
let img = new Image();
let brightest = 0;
let darkest = 255;
img.onload = init; img.crossOrigin = "";
img.src = './Saturn.jpg';

function init() {
    setup(this);
}

function setup(img) {
   
     c.width = img.naturalWidth; c.height = img.naturalHeight;
		  ctx.drawImage(img, 0, 0);;
}

//handle submit keypress
form.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
	e.preventDefault();
	setup(img);
    let  brightnessVal = document.getElementById("brightnessVal").value;
	brightnessSteps(brightnessVal, getRange);
      return false;
    };
};
//handle clicks
sub.addEventListener("click", function(event) {
    event.preventDefault();
    setup(img);
    let  brightnessVal = document.getElementById("brightnessVal").value;
    brightnessSteps(brightnessVal, getRange);
    
});

function brightnessSteps (number, getRangeCallback) {
    // set up initial image source and target container
    let idataSrc = ctx.getImageData(0,0, c.width, c.height),
	idataTrg = ctx.createImageData(c.width, c.height);
    // make a greyscale matrix of all image color values
    let greyScale = getLuma(idataSrc, idataTrg, getRangeCallback);
    // get the step value from the number
    let step = getStep(brightest, darkest, number);
    //create steps from the greyscale
    let stepified = stepify(greyScale, greyScale, step);
  // write the stepified image matrix into the canvas
    ctx.putImageData(stepified, 0, 0);
 
};
//adapted from https://stackoverflow.com/questions/37159358/save-canvas-in-grayscale
//gets sets greyscale according to BT.601
function getLuma(src, trg, getRangeCallback) {
    let dataSrc = src.data,
	dataTrg = trg.data,
	len = dataSrc.length,luma;
    for (let i = 0;i < len; i += 4) {
	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;

	// helper function for getting brightest and darkest luma (and only if called)
	typeof getRangeCallback === 'function' && getRangeCallback(luma);

	//sets all color channels to luma value
	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
	//preserve alpha channel
	dataTrg[i+3] = dataSrc[i+3];
    }
    return trg;
}

function getStep (high, low, number) {
    let range = high - low;
    let step = range / number;
    return step;
}

function stepify (src, trg, step) {
    //only works when src is greyscale
    let dataSrc = src.data;
    let dataTrg = trg.data;
    let len = dataSrc.length;
    for (let i = 0; i < len; i += 4) {
	let luma = dataSrc[i];
	for(let k = step; k <= brightest; k += step) {
	    if(luma < k) {
		dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = k;
		break;
	    }
	}
    }
    return trg;
}

function getRange(luma) {
    	if(luma > brightest) {
	    brightest = luma;
	}
	if(luma < darkest) {
	    darkest = luma;
	}
}


//color diagnostics helper function
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



