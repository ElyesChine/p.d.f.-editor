function render( pageNumber){
    pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');
        var scale = 1.5;
        var viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement("canvas");
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
        });
    });
}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#signature')
                .attr('src', e.target.result)
                .width(150)
                .height(200);
        };
        reader.readAsDataURL(input.files[0]);
        var img = document.getElementById("signature");
        $(img).draggable();
        console.log('done');
    }
}
var numberOfPages = 0;
var pdf ;
document.getElementById('fileInput').onchange = function () {
    let selectedFile = document.getElementById("fileInput").files;
    //Check File is not Empty
    var base64;
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