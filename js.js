console.log('start js.js');
const { PDFDocument } = PDFLib
var imageContent,pagesss;
var countImages = -1;

//télécharger le nouveau fichier en itérant sur l'ensmeble des images tout en regardant les changements de leurs posisitions pour savoir s'il faut les ajouter au fichier final
async function save() {

    const pdfDoc = await PDFDocument.load(base64);
    console.log(pdfDoc.getPages());
    let w;
    for (const e of images) {
        let imageBytes, image, imageDims, xValue, yValue;

        if (e.yPos > 0) {
            const longueurPage = $('#canvas1').height();

            console.log(e);
            let nombrePage = Math.floor(e.yPos / longueurPage);
            console.log(e.yPos);
            pagesss = pagesss+ "" + e.reference + "->" + nombrePage;
            var page = pdfDoc.getPages()[nombrePage];
            h = page.getHeight();
            imageDims = {height: 0, width: 0};
            if (e.type === "image/jpeg" || e.type === "image/jpg") {
                imageBytes = _base64ToArrayBuffer(e.imageContent.substring(e.imageContent.search("base64,") + 7));
                image = await pdfDoc.embedJpg(imageBytes);

                console.log(imageDims.height);
                console.log(imageDims.width);
                imageDims.height = parseInt(document.getElementById('signature' + e.reference).style.height.substring(0, 3)) * (1 / 2)
                imageDims.width = parseInt(document.getElementById('signature' + e.reference).style.width.substring(0, 3)) * (1 / 2)

                const longueurPage = $('#canvas1').height();

                e.yPos = e.yPos - longueurPage * nombrePage;
                xValue = e.xPos * (395.5 / 595);
                yValue = h - imageDims.height * 462.5 / 350 - e.yPos * (397.5 / 595);
            }
            if (e.type === "image/png") {
                imageBytes = _base64ToArrayBuffer(e.imageContent.substring(e.imageContent.search("base64,") + 7));
                image = await pdfDoc.embedPng(imageBytes);
                /*imageDims = image.scale(0.5);*/
                imageDims.height = parseInt(document.getElementById('signature' + e.reference).style.height.substring(0, 3)) * (1 / 2)
                imageDims.width = parseInt(document.getElementById('signature' + e.reference).style.width.substring(0, 3)) * (1 / 2)

                const longueurPage = $('#canvas1').height();

                e.yPos = e.yPos - longueurPage * nombrePage;
                xValue = e.xPos * (395.5 / 595);
                yValue = h - imageDims.height * 462.5 / 350 - e.yPos * (397.5 / 595);
            }
            console.log(parseInt(document.getElementById('signature' + e.reference).style.height.substring(0, 3)) * (1 / 2));
            imageDims.height = parseInt(document.getElementById('signature' + e.reference).style.height.substring(0, 3)) * (1 / 2)
            imageDims.width = parseInt(document.getElementById('signature' + e.reference).style.width.substring(0, 3)) * (1 / 2)
            console.log(xValue);

            page.drawImage(image, {
                x: xValue,
                y: yValue,
                width: imageDims.width * 4 / 3,
                height: imageDims.height * 462.5 / 350
            });
        }
    }

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "pdf-lib_image_embedding.pdf", "application/pdf");
}
//récupérer les images persistées au stockage local du navigateur

var keys = Object.keys(localStorage), i = keys.length;
var images = [];
var s=0;
var widths
let w;
while (i--) {
    let image = JSON.parse(localStorage.getItem(keys[i]));
    image.id = keys[i];
    /*images.push( JSON.parse(localStorage.getItem(keys[i]))) ;
    console.log(countImages++);
    img = document.createElement("img");
    let e = document.createElement("span");
    e.id="span"+countImages;
    img.id = 'signature'+countImages;
    console.log("**");
    const reference = countImages;
    console.log(image.imageContent);
    img.src = image.imageContent;
    $(function() {
        $(document.getElementById('signature'+reference)).resizable();
    });*/
    input = document.createElement("input");
    input.type = "submit";
    input.value = "delete";
    input.id = keys[i];
    const id = keys[i];
    const key = new String(+ new Date())
    input.onclick = () => {
        // // /*let element = document.getElementById('signature' + reference);*/
        let elements = document.getElementsByClassName(""+key);
        localStorage.removeItem(id);
        for (var i = 0; i < elements.length; i++) {
            console.log(elements[i].id);
            element = document.getElementById(elements[i].id);
            element.textContent = '';
            //elements[i].parentNode.removeChild(elements[i]);
        }element = document.getElementById(id);
        element.parentNode.removeChild(element);element.textContent="";
    };
    /*console.log(img.naturalHeight);
    *//*input.style.marginTop=new String(img.naturalHeight/2);*//**/
    input.style.marginLeft="0px";
    /*input.style.marginRight="100px";*/
    input.className="btn btn-danger";
    /*input.style.position="absolute";
    /*images[reference].reference=reference;
    $(e).draggable({
        start: function() {

        },
        drag: function(e) {
            console.log('start drag');
            console.log(reference);
            offset = $(this).offset();
            xPos = offset.left - leftSpace.left;
            yPos = offset.top - getPosition(document.getElementById("canvas1")).y
            /* leftSpace.top - 350*/   /*;
            images[reference].xPos = xPos;
            console.log(xPos);
            images[reference].yPos = yPos;
            console.log(yPos);
            images[reference].height=document.getElementById("signature"+reference).style.height;
            images[reference].width=document.getElementById("signature"+reference).style.width;
            console.log('end drag')
        },
        stop: function() {
        }
    });

    //e.appendChild(img);
    //document.getElementById("bibliotheque").appendChild(e);*/
    //document.getElementById("bibliotheque").appendChild(input);
    for (let j = 0; j < 9; j++) {
        images.push(JSON.parse(localStorage.getItem(keys[i])));
        let img2 = document.createElement("img");
        img2.src = image.imageContent;
        let idOfSpan  = new String(+ new Date());
        let e2 = document.createElement("span");e2.className=key;e2.id=new String(+ new Date());
        countImages = countImages + 1;
        img2.id = 'signature' + countImages;
        const reference2 = countImages;
        console.log(image.imageContent);
        img2.id = "signature" + countImages;
        console.log(w=img2.naturalWidth);//console.log(reference)
        // img.src = image.imageContent;
        $(e2).css({
            "position": "absolute",
            "left": s
        }).appendTo(document.getElementById("bibliotheque"));
        $(img2).css({
            /*"position" : "absolute",*/
            /*"left"     : $("#"+"signature"+reference).position().left,
            "top"      : $("#"+"signature"+reference).position().top*/
        }).appendTo(e2);
        $(function () {
            $(img2).resizable();
        });
        images[reference2].reference = reference2;
        $(e2).draggable({
            start: function () {

            },
            drag: function (e) {
                console.log('start drag');
                console.log(reference2);
                offset = $(this).offset();
                xPos = offset.left - leftSpace.left;
                yPos = offset.top - getPosition(document.getElementById("canvas1")).y
                /* leftSpace.top - 350*/;
                images[reference2].xPos = xPos;
                console.log(xPos);
                images[reference2].yPos = yPos;
                console.log(yPos);
                images[reference2].height = document.getElementById("signature" + reference2).style.height;
                images[reference2].width = document.getElementById("signature" + reference2).style.width;
                console.log('end drag')
            },
            stop: function () {
            }
        });
        input.style.marginTop=new String(img2.naturalHeight/2);
        w=document.getElementById("signature" + reference2);
        console.log(w);
    }
    w=w.width;
    console.log(w);
    s = s + w + 25;
    $(input).css({
        "position": "absolute",
        "left": s
    }).appendTo(document.getElementById("bibliotheque"));
    s = s + 95;

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
        reader.onload = function (e) {
            imageContent = e.target.result;localStorage.setItem(+ new Date(),JSON.stringify({type: (type = document.getElementById('file').files[0].type), imageContent: imageContent}));

            let image = {type: (type = document.getElementById('file').files[0].type), imageContent: imageContent};
            p=+ new Date();
            image.id = p
            ;
            /*images.push( JSON.parse(localStorage.getItem(keys[i]))) ;
            console.log(countImages++);
            img = document.createElement("img");
            let e = document.createElement("span");
            e.id="span"+countImages;
            img.id = 'signature'+countImages;
            console.log("**");
            const reference = countImages;
            console.log(image.imageContent);
            img.src = image.imageContent;
            $(function() {
                $(document.getElementById('signature'+reference)).resizable();
            });*/
            input = document.createElement("input");
            input.type = "submit";
            input.value = "delete";
            input.id = p;
            const id = p;
            const key = new String(+new Date())
            input.onclick = () => {
                // // /*let element = document.getElementById('signature' + reference);*/
                let elements = document.getElementsByClassName("" + key);
                localStorage.removeItem(id);
                for (var i = 0; i < elements.length; i++) {
                    console.log(elements[i].id);
                    element = document.getElementById(elements[i].id);
                    element.textContent = '';
                    //elements[i].parentNode.removeChild(elements[i]);
                }
                element = document.getElementById(id);
                element.parentNode.removeChild(element);
                element.textContent = "";
                location.reload();
            };
            /*console.log(img.naturalHeight);
            *//*input.style.marginTop=new String(img.naturalHeight/2);*//**/
            input.style.marginLeft = "0px";
            /*input.style.marginRight="100px";*/
            input.className = "btn btn-danger";
            /*input.style.position="absolute";
            /*images[reference].reference=reference;
            $(e).draggable({
                start: function() {

                },
                drag: function(e) {
                    console.log('start drag');
                    console.log(reference);
                    offset = $(this).offset();
                    xPos = offset.left - leftSpace.left;
                    yPos = offset.top - getPosition(document.getElementById("canvas1")).y
                    /* leftSpace.top - 350*/   /*;
            images[reference].xPos = xPos;
            console.log(xPos);
            images[reference].yPos = yPos;
            console.log(yPos);
            images[reference].height=document.getElementById("signature"+reference).style.height;
            images[reference].width=document.getElementById("signature"+reference).style.width;
            console.log('end drag')
        },
        stop: function() {
        }
    });

    //e.appendChild(img);
    //document.getElementById("bibliotheque").appendChild(e);*/
            //document.getElementById("bibliotheque").appendChild(input);
            for (let j = 0; j < 9; j++) {
                images.push(image);
                let img2 = document.createElement("img");
                img2.src = image.imageContent;
                let idOfSpan = new String(+new Date());
                let e2 = document.createElement("span");
                e2.className = key;
                e2.id = new String(+new Date());
                countImages = countImages + 1;
                img2.id = 'signature' + countImages;
                const reference2 = countImages;
                console.log(image.imageContent);
                img2.id = "signature" + countImages;
                console.log(w = img2.naturalWidth);//console.log(reference)
                // img.src = image.imageContent;
                $(e2).css({
                    "position": "absolute",
                    "left": s
                }).appendTo(document.getElementById("bibliotheque"));
                $(img2).css({
                    /*"position" : "absolute",*/
                    /*"left"     : $("#"+"signature"+reference).position().left,
                    "top"      : $("#"+"signature"+reference).position().top*/
                }).appendTo(e2);
                $(function () {
                    $(img2).resizable();
                });
                images[reference2].reference = reference2;
                $(e2).draggable({
                    start: function () {

                    },
                    drag: function (e) {
                        console.log('start drag');
                        console.log(reference2);
                        offset = $(this).offset();
                        xPos = offset.left - leftSpace.left;
                        yPos = offset.top - getPosition(document.getElementById("canvas1")).y
                        /* leftSpace.top - 350*/;
                        images[reference2].xPos = xPos;
                        console.log(xPos);
                        images[reference2].yPos = yPos;
                        console.log(yPos);
                        images[reference2].height = document.getElementById("signature" + reference2).style.height;
                        images[reference2].width = document.getElementById("signature" + reference2).style.width;
                        console.log('end drag')
                    },
                    stop: function () {
                    }
                });
                input.style.marginTop = new String(img2.naturalHeight / 2);
                w = document.getElementById("signature" + reference2);
            }
            console.log(w);
            w = w.width;
            console.log(w);
            s = s + w + 25;
            $(input).css({
                "position": "absolute",
                "left": s
            }).appendTo(document.getElementById("bibliotheque"));
            s = s + 95;



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
    //Check File is n²ot Empty
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