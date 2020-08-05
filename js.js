console.log('start js.js');
const { PDFDocument } = PDFLib
var imageContent;

async function save() {
    // const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
    // const pngUrl = 'https://pdf-lib.js.org/assets/minions_banana_alpha.png'

    const jpgImageBytes = arrayBuffer;
    // const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())
    console.log(base64);
    const pdfDoc = await PDFDocument.load(base64);

    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    // const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const jpgDims = jpgImage.scale(0.5);
    // const pngDims = pngImage.scale(0.5)

    const page = pdfDoc.getPages()[0];

    let w = page.getWidth();
    h = page.getHeight();
    let xValue = xPos * (395.5/595) ;
    let yValue = h - jpgDims.height - yPos * (397.5/595) /*841.89 - 450/4 - yPos * (840/1261.7499694824219)*/  /* h - yPos * (yPos/h) - jpgDims.height */;
    console.log('xValue');
    console.log(xValue)
    console.log('h');
    console.log(h);
    page.drawImage(jpgImage, {
        // the point the most to the left and the most to the right is the point with the coordenates (0,0)
        x: xValue,
        y: yValue ,
        width: jpgDims.width,
        height: jpgDims.height,
    });
    /* page.drawImage(pngImage, {
        x: page.getWidth() / 2 - pngDims.width / 2 + 75,
        y: page.getHeight() / 2 - pngDims.height + 250,
        width: pngDims.width,
        height: pngDims.height,
    })
     */

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "pdf-lib_image_embedding_example.pdf", "application/pdf");
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
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
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
var pageHeight;
var height; // hauteur de l'image
var countImages = 0;
var img;
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;

    return { x: xPosition, y: yPosition };
}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        img = document.createElement("img");
        reader.onload = function (e) {
            imageContent = e.target.result;
            countImages++;
            // doubt
            img.id = 'signature'+countImages;
            img.src = imageContent;
            document.getElementById("bibliotheque").appendChild(img);
            // 23  caractères comme 'entete' du fichier encodé
            arrayBuffer = _base64ToArrayBuffer(this.result.substring(23));
        };
        reader.readAsDataURL(input.files[0]);

        $(img).draggable({
            start: function() {

            },
            drag: function(e) {
                console.log('start drag');
                offset = $(this).offset();
                xPos = offset.left - leftSpace.left;
                yPos = offset.top - getPosition(document.getElementById("canvas1")).y
                /* leftSpace.top - 350*/   ;
                console.log(xPos);
                console.log(yPos);
                console.log('end drag')
            },
            stop: function() {

            }
        });
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
                    /*
                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);
                    renderTask.promise.then(function () {
                        console.log('Page rendered');
                    });
                    */
                // });
            }, function (reason) {
                // PDF loading error
                console.error(reason);
            });
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
    }
};