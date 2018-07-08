

var textContents

var searchPhrases = {
	contentType: 'Content-Type: ',
	transferEncoding: 'Content-Transfer-Encoding: ',
	multiPart: 'multipart/alternative',
	boundary: 'boundary='
}

window.onload = function () { 
	//Check the support for the File API support 
 	if (window.File && window.FileReader && window.FileList && window.Blob) {
    	var fileSelected = document.getElementById('txtfiletoread');
    	fileSelected.addEventListener('change', function (e) { 
	        //Set the extension for the file 
	        var fileExtension = /text.*/; 
	        //Get the file object 
	        var fileTobeRead = fileSelected.files[0];
	        //Check of the extension match 
	        if (fileTobeRead.type.match(fileExtension)) { 
	            //Initialize the FileReader object to read the 2file 
	            var reader = new FileReader(); 
	            reader.onload = function (e) { 
	                textContents = reader.result
	                console.log(textContents)
	                test()
	            } 
	            reader.readAsText(fileTobeRead); 
	        } 
	        else { 
	            alert("Please select text file"); 
	        }
	    }, false);
	} else { 
     alert("Files are not supported"); 
 	} 
}

var test = function() {
	var substring = getContentType(textContents).sub
	if (substring == searchPhrases.multiPart) {
		var leftover = textContents.substring(substring.endIndex)
		testMulti(leftover)
	} else {
		testSingle(textContents)
	}
}

var getContentType = function(s) {
	var index1 = s.indexOf(searchPhrases.contentType)
	var index2 = s.indexOf(';', index1)
	var substring  = s.substring(index1 + searchPhrases.contentType.length,index2)
	console.log('content type is: ' + substring)
	return {
		sub: substring,
		endIndex: index2
	}
}

var testSingle = function(s) {
	var index1 = s.indexOf(searchPhrases.transferEncoding)
	var index2 = s.indexOf('\n',index1)
	var substring = s.substring(index1 + searchPhrases.transferEncoding.length,index2)
	console.log('content transfer encoding is: ' + substring)

}

var testMulti = function(s) {

	var index1 = s.indexOf(searchPhrases.boundary)
	var index2 = s.indexOf('\n', index1)
	var boundary = s.substring(index1 + searchPhrases.boundary.length + 1, index2 - 1) //+1 and -1 to trim quotation marks 
	console.log('boundary identifier is: ' + boundary)
	var leftover = s.substring(index2)
	var hasNext = true
	var counter = 0
	while (hasNext) {
		console.log(leftover)
		var index3 = leftover.indexOf(boundary)
		if (index3 == -1 || counter > 3) {
			hasNext = false
			continue
		}
		var index4 = leftover.indexOf('\n\n', index3)
		leftover = leftover.substring(index4 + 4)
		getContentType(leftover)
		testSingle(leftover)
		counter++
	}

}


















