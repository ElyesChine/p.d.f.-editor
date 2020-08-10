console.log('start js.js');
const { PDFDocument } = PDFLib
var imageContent;
var originalHeight, newHeight;
var countImages = -1;
//télécharger le nouveau fichier en itérant sur l'ensmeble des images tout en regardant les changements de leurs posisitions pour savoir s'il faut les ajouter au fichier final
async function save() {
    // const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
    // const pngUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'

    // const jpgImageBytes = arrayBuffer;
    // const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(base64);
    for (const e of images) {
        let imageBytes, image, imageDims,xValue,yValue;
        console.log("e.yPos"+e.yPos);
        if (e.yPos > 0 ) {
        const longueurPage = $('#canvas1').height();
        
        console.log(e);
        let nombrePage = Math.floor(e.yPos/longueurPage);
        console.log(e.yPos);
        var page = pdfDoc.getPages()[nombrePage];
        h = page.getHeight();

        if (e.type === "image/jpeg"|| e.type === "image/jpg"){
            imageBytes = _base64ToArrayBuffer(e.imageContent.substring(e.imageContent.search("base64,")+7));
            image = await pdfDoc.embedJpg(imageBytes);
            // const pngImage = await pdfDoc.embedPng(pngImageBytes);

            imageDims = image.scale(0.5);
            // const pngDims = pngImage.scale(0.5)

            const longueurPage = $('#canvas1').height();

            e.yPos = e.yPos - longueurPage * nombrePage;
            xValue = e.xPos * (395.5/595) ;
            yValue = h - imageDims.height*462.5/350 - e.yPos * (397.5/595) /*841.89 - 450/4 - yPos * (840/1261.7499694824219)*/  /* h - yPos * (yPos/h) - jpgDims.height */;
            /*let id = "signature0"
            originalHeight = document.getElementById(id).style.height;
            newHeight = imageDims.height;*/
        }
        if( e.type === "image/png"){
            imageBytes = _base64ToArrayBuffer(e.imageContent.substring(e.imageContent.search("base64,")+7));            image = await pdfDoc.embedPng(imageBytes);

            imageDims = image.scale(0.5);
            // const pngDims = pngImage.scale(0.5)

            const longueurPage = $('#canvas1').height();

            e.yPos = e.yPos - longueurPage * nombrePage;
            xValue = e.xPos * (395.5/595) ;
            yValue = h - imageDims.height*462.5/350 - e.yPos * (397.5/595) /*841.89 - 450/4 - yPos * (840/1261.7499694824219)*/  /* h - yPos * (yPos/h) - jpgDims.height */;
        }

        page.drawImage(image,{
            x: xValue,
            y: yValue,
            width: imageDims.width*4/3,
            height: imageDims.height*462.5/350
        });}
    }

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "pdf-lib_image_embedding.pdf", "application/pdf");
}
//récupérer les images persistées au stockage local du navigateur
var keys = Object.keys(localStorage), i = keys.length;
var images = [];

while ( i-- ) {
    let image = JSON.parse(localStorage.getItem(keys[i]));
    image.id = keys[i];
    images.push( JSON.parse(localStorage.getItem(keys[i]))) ;
    console.log(countImages++);
    img = document.createElement("img");
    img.id = 'signature'+countImages;
    console.log("**");
    const reference = countImages;
    console.log(image.imageContent);
    img.src = image.imageContent;
    input = document.createElement("input");
    input.type = "submit";
    input.value ="delete";
    input.id = keys[i];
    const id=keys[i];
    input.onclick =() =>{
        let element = document.getElementById('signature'+reference);
        element.parentNode.removeChild(element);
        element = document.getElementById(id);
        element.parentNode.removeChild(element);
        localStorage.removeItem(id);
    };
    input.style.marginRight="15px";
    input.className="btn btn-danger";
    $(img).draggable({
        start: function() {

        },
        drag: function(e) {
            console.log('start drag');
            console.log(reference);
            offset = $(this).offset();
            xPos = offset.left - leftSpace.left;
            yPos = offset.top - getPosition(document.getElementById("canvas1")).y
            /* leftSpace.top - 350*/   ;
            images[reference].xPos = xPos;
            console.log(xPos);
            images[reference].yPos = yPos;
            console.log(yPos);
            console.log('end drag')
        },
        stop: function() {
        }
    });

    document.getElementById("bibliotheque").appendChild(img);
    document.getElementById("bibliotheque").appendChild(input);
}

var h ;
function getPageTopLeft() {
    let offset = $('#canvas1').offset();
    return {
        left: offset.left,
        top: offset.top
    };
}
var leftSpace = {left: 0, top: 0};
//afficher la page numéro "pageNumber"
function render( pageNumber){
    pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');
        var scale = 1.5;
        var viewport = page.getViewport({scale: scale});
        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas"+pageNumber);
        canvas.style.direction = "ltr";
        canvas.style.border = "1px solid black";
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //Draw it on the canvas
        var renderTask = page.render({canvasContext: context, viewport: viewport});

        //Add it to the web page
        // document.body.appendChild(canvas);
        document.getElementById("myDiagramDiv").appendChild(canvas);

        renderTask.promise.then(function () {
            if ((pageNumber+1)<= numberOfPages ){
                pdf.getPage(pageNumber + 1).then(function (newpage) {
                    console.log('Page loaded');
                    render(pageNumber+1);
                });
            }
            if ( pageNumber == 1 ) // premier canvas (page du p.d.f. chargée)
                leftSpace = getPageTopLeft();
        });
    });
}
function _base64ToArrayBuffer(base64input) {
    var binary_string = window.atob(new String(base64input).replace(/\s/g, ''));
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
var arrayBuffer ;
var xPos;
var yPos;

var img;
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
    return { x: xPosition, y: yPosition };
}
var type , imageBase64;
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        img = document.createElement("img");
        reader.onload = function (e) {
            imageContent = e.target.result;
            console.log(imageContent);
            countImages++;
            const reference = countImages;
            img.id = 'signature'+countImages;
            img.src = imageContent;
            document.getElementById("bibliotheque").appendChild(img);
            type = document.getElementById('file').files[0].type;
            imageBase64 = this.result;
            base64String = this.result.substring(this.result.search("base64,")+7);
            arrayBuffer = _base64ToArrayBuffer(this.result.substring(this.result.search("base64,")+7));
            //imageContent = data:(type);base64,(encoded image)
            let image = {type: type, imageContent: imageContent };
            images.push(image);
            key = new String(+ new Date())
            localStorage.setItem(key,JSON.stringify(image));
            console.log("hhh");
            input = document.createElement("input");
            input.type = "submit";
            input.value ="delete";
            input.id = key;
            const id=key;
            input.onclick =() =>{
                let element = document.getElementById('signature'+reference);
                element.parentNode.removeChild(element);
                element = document.getElementById(id);
                element.parentNode.removeChild(element);
                localStorage.removeItem(id);
            };
            input.style.marginRight="15px";
            input.className="btn btn-danger";
            document.getElementById("bibliotheque").appendChild(input);
            $(img).draggable({
                start: function() {

                },
                drag: function(e) {
                    console.log('start drag');
                    console.log(reference);
                    offset = $(this).offset();
                    xPos = offset.left - leftSpace.left;
                    yPos = offset.top - getPosition(document.getElementById("canvas1")).y
                    /* leftSpace.top - 350*/   ;
                    images[reference].xPos = xPos;
                    console.log(xPos);
                    images[reference].yPos = yPos;
                    console.log(yPos);
                    console.log('end drag')
                },
                stop: function() {
                }
            });
        };
        reader.readAsDataURL(input.files[0]);

        console.log('done upload');
    }
}
var offset;
function getBuffer(fileData) {
    return function(resolve) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(fileData);
        reader.onload = function() {
            var arrayBuffer = reader.result
            var bytes = new Uint8Array(arrayBuffer);
            resolve(bytes);
        }
    }
}

var numberOfPages = 0;
var pdf ;
var base64;
document.getElementById('fileInput').onchange = function () {
    let selectedFile = document.getElementById("fileInput").files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
        // Select the very first file from list
        var fileToLoad = selectedFile[0];
        // FileReader function for read the file.
        var fileReader = new FileReader();
        // Onload of file read the file content
        fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            // Print data in console
            console.log(base64);
            let loadingTask = pdfjsLib.getDocument({data: atob(base64.substring(28))});
            loadingTask.promise.then(function(p) {
                console.log('PDF loaded');
                pdf = p;
                // Fetch the first page
                var pageNumber = 1;

                console.log(pdf.numPages);
                numberOfPages = pdf.numPages;
                render(1);
                    /**/
            }, function (reason) {
                // PDF loading error
                console.error(reason);
            });
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
    }
};