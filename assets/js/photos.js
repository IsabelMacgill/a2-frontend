function callPhotosUpload(photo, key, labels) {
  // params, body, additionalParams
  response = sdk.uploadPut(
    {
      "Accept": "*/*",
      "image-key": key,
      "Content-Type": "application/jpeg",
      "x-amz-meta-customLabels": labels,
      "x-api-key": "4bxhpgAnrR9GPmvr1KVgM3u3CekpTp4X1n46SXGm",
    },
    photo,
    {}
  );
  //console.log(response)
}

function callSearch(search_term) {
  sdk.searchGet({ q: search_term }, {}, {}).then(
    (response) => {
      console.log(response);
      console.log(response["data"]["results"]);
      showSearchResults(response["data"]["results"], search_term);
    },
    (failure) => {
      console.error(failure); //expected output: Oopsy...
    }
  );
  //console.log(response);
  //console.log(response['PromiseResult']);
  //showSearchResults(response, search_term)
}

function speechTooText() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.continuous = false;
  recognition.maxAlternatives = 0;

  recognition.addEventListener("result", (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById("search-input").value = transcript;
    callSearch($("#search-input").val());
    recognition.stop();
  });

  recognition.start();

  console.log("Speech recognition service started");
}

function showSearchResults(response, search_term) {
  $("#search-results").remove();
  let results_title = new $(
    "<div class='row text-center'> <div class='inner-header' id='search-results'>Results for: " +
      search_term +
      "</div></div>"
  );
  $("#search-section").append(results_title);
  if (response.length == 0) {
    console.log("no results entered");
    let no_results = new $(
      "<div class='row' id='no-results'> Sorry, there are no results. Try a different query.</div>"
    );
    $("#search-results").append(no_results);
  }
  let res_row = new $("<div class='row' id='images-res'></div>");
  $("#search-results").append(res_row);
  response.forEach(function (curVal) {
    console.log(curVal["url"]);
    let item = new $(
      "<div class='col-sm image'> <img class='img-result' width='300' height='300'src=" +
        curVal["url"] +
        "></div>"
    );
    $("#images-res").append(item);
  });
}

function create_blob(file, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

// function create_binary(file, callback){
//     var r = new FileReader();
//     r.onload = function(){ callback(r.result); };
//     r.readAsBinaryString(file);
// }

function transform_blob(blob_string) {
  blob_string = blob_string.substring(
    blob_string.indexOf(",") + 1,
    blob_string.length
  );
  console.log(blob_string);
  blob_string = blob_string.replace("\\n", "");
  callPhotosUpload(String(blob_string), key, labels);
}

// function transform_blob_2(blob_string){
//     //blob_string = blob_string.substring(blob_string.indexOf(',')+1, blob_string.length);
//     console.log(blob_string);
//    // blob_string = blob_string.replace("\\n", "")
//    callPhotosUpload(blob_string, key, labels);
// }

$(document).ready(function () {
  $("#search-input").keypress(function (event) {
    console.log("#search entered press");
    if (event.which == 13) {
      console.log("enter");
      console.log($("#search-input").val());
      callSearch($("#search-input").val());
    }
  });
  $("#upload").click(function (event) {
    console.log("#upload clickced");
    photo_unparse = $("#inputGroupFile02").val();
    photo_file = $("#inputGroupFile02").prop("files")[0];
    //console.log(photo_file);
    key = photo_unparse.substring(
      photo_unparse.lastIndexOf("\\") + 1,
      photo_unparse.length
    );
    //console.log(key);

    labels = $("#customLabelsInput").val();
    create_blob(photo_file, function (blob_string) {
      transform_blob(blob_string);
    });

    //create_binary(photo_file, function(blob_string) { transform_blob_2(blob_string) });
  });
  $("#talk").click(function (event) {
    speechTooText();
  });
});
