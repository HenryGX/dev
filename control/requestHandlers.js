var querystring = require("querystring"), fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var exec = require("child_process").exec;
var mime = require('mime');
var FILE_DIR = './tmp/';


//开始方法
function start(response, request, event) {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]FUNCTION START was called.");
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="Upload file" />' +
        '<br> <a href="/make_fiel">makefile</a> ' +
        '<br> <a href="/event">event</a> ' +
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

// 上传文件方法
function upload(response, request, event) {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]FUNCTION UPLOAD was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, FILE_DIR + "test.png");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, postData, event) {
    console.log("Request handler 'show' was called.");
    fs.readFile(FILE_DIR + "test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

//生成物理文件 保存到服务器硬盘
function make_fiel(response, request, event) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]FUNCTION make_file was called.");

    var filename_stdout = 'mysflgo_stdout' + (date.getYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds()) + '.txt';

    var filename_stderr = 'mysflgo_stderr' + (date.getYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds()) + '.txt';

    exec("ls -l -t ./tmp/", function (error, stdout, stderr) {

        //返回内容stdout
        fs.writeFile(FILE_DIR + filename_stdout, stdout);
        fs.writeFile(FILE_DIR + filename_stderr, stderr);

    });

    var dirList = fs.readdirSync(FILE_DIR);
    response.writeHead(200, {"Content-Type": "text/html"});
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>';
    //文件夹遍历 生成文件列表
    dirList.forEach(function (item) {
        if (!fs.statSync(FILE_DIR + item).isDirectory()) {
            if (fs.statSync(FILE_DIR + item).isFile()) {
                body += '<a href="' + '/download_img?filename=' + item + '">•　' + item + '</a><br /><br />';
            }
        }
    });
    body += '</body>' + '</html>';
    response.write(body);
    response.end();
}

//下载服务器上的文件
var download_img = function (response, request, event) {
    var file_name = url.parse(request.url).pathname.split('/').pop();
    var arg = url.parse(request.url).query;
    var str = querystring.parse(arg);
    var filename = querystring.parse(arg).filename;
    //判断文件是否存在
    fs.exists(FILE_DIR + filename, function (exists) {
        if (exists) {
            _download(FILE_DIR, filename, response);
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("Files is not exist!");
            response.end();
        }
    });
};

//下载服务器上的文件
var event = function (response, request, event) {
    _cou(event);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("ok!");
    response.end();
};

//公共下载方法
function _download(dir, filename, response) {
    var file = dir + filename;
    var mimetype = mime.lookup(file);
    response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    response.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.on('data', function (chunk) {
        response.write(chunk);
    });
    filestream.on('end', function () {
        response.end();
    });
}


//事件调用方法
function _cou(event) {
    var time_couse = 100;
    var i = 0;
    event.on('call_event', function () {
        console.log('本次请求共花了' + i + '秒');
    });

    for (i; i < time_couse; i++) {
        event.emit('call_event'); //emit 时间发射器，也就是事件驱动方法
    }
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.make_fiel = make_fiel;
exports.download_img = download_img;
exports.event = event;