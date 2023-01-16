var DBname='SCHOOL-DB';
var relationName='STUDENT-TABLE';
var BaseUrl='http://api.login2explore.com:5577';
var jpdbiml='/api/iml';
var jpdbirl='/api/irl';
var connToken='90932409|-31949269630301435|90955675';
var record_num;

$("#roll").focus();

function getStudentIDASJsonObj(){
    var roll=$('#roll').val();
    var jsonStr={
        stroll:roll
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    var item=JSON.parse(jsonObj.data).record;
    $('#name').val(item.stname);
    $('#classs').val(item.stclass);
    $('#birth').val(item.stbirth);
    $('#address').val(item.staddress);
    $('#Enrollment').val(item.stenrollment);
}

function getStudent(){
    var strollJsonObj=getStudentIDASJsonObj();
    var getRequest=createGET_BY_KEYRequest(connToken,DBname,relationName,strollJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommand(getRequest,BaseUrl,jpdbirl);
    console.log(resJsonObj.status);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status===400) {
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $("#name").focus();
    }
    else if (resJsonObj.status===200) {
        $('#roll').prop('disabled',true);
        fillData(resJsonObj);
        var rec=JSON.parse(resJsonObj.data).rec_no;
        record_num=String(rec);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $("#name").focus();
    }
}

function resetForm(){
    $("#roll").val("");
    $("#name").val("");
    $("#classs").val("");
    $("#birth").val("");
    $("#address").val("");
    $("#Enrollment").val("");
    $('#roll').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $("#roll").focus();
}

function validateData(){
    var roll,name,classs,birth,address,Enrollment;
    roll=$('#roll').val();
    name=$('#name').val();
    classs=$('#classs').val();
    birth=$('#birth').val();
    address=$('#address').val();
    Enrollment=$('#Enrollment').val();

    if (roll === "") {
        alert("Warning ! Roll number is required!");
        $("#roll").focus();
        return "";
    }
    if (name === "") {
        alert("Warning ! Full name is required!");
        $("#name").focus();
        return "";
    }
    if (classs === "") {
        alert("Warning ! Class is required!");
        $("#classs").focus();
        return "";
    }
    if (birth === "") {
        alert("Warning ! birth date is required!");
        $("#birth").focus();
        return "";
    }
    if (address === "") {
        alert("Warning ! address is required!");
        $("#address").focus();
        return "";
    }
    if (Enrollment === "") {
        alert("Warning ! Enrollment date is required!");
        $("#Enrollment").focus();
        return "";
    }

    var jsonStrObj = {
        stroll: roll,
        stname: name,
        stclass: classs,
        stbirth: birth,
        staddress: address,
        stenrollment: Enrollment
    };
    return JSON.stringify(jsonStrObj);
}

function saveData(){
    var jsonStrObj=validateData();
    if (jsonStrObj==='') {
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj, DBname, relationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommand(putRequest,BaseUrl,jpdbiml);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#roll").focus();
}

function changeData(){
    $('#change').prop('disabled',true);
    jsonChg=validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,DBname,relationName, record_num);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommand(updateRequest,BaseUrl,jpdbiml);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#roll").focus();
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return putRequest;
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr) {
    var createTime=false;
    var updateTime=false;
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}