var exec = require("child_process").exec;



function start(response){
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("["+(date.getYear() + seperator1 + month + seperator1 + strDate)+"]FUNCTION START was called.");

    exec("find /",
        { timeout:10000, maxBuffer:20000*1024},
        function(error, stdout, stderr){
            response.writeHead(200,{"Content-Type":"text/plain"});
            response.write(stdout);
            response.end();
        });
}

function upload(response){
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("["+(date.getYear() + seperator1 + month + seperator1 + strDate)+"]FUNCTION UPLOAD was called.");
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("Hello Upload");
    response.end();
    response.end();
}

exports.start=start;
exports.upload=upload;