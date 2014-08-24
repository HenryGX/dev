var querystring = require("querystring"), fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var exec = require("child_process").exec;
var mime = require('mime');
var FILE_DIR = './tmp/';

//开始方法
function start(response, request) {
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
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

// 上传文件方法
function upload(response, request) {
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

function show(response, postData) {
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
function make_fiel(response, request) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]FUNCTION make_file was called.");

    exec("find /", function (error, stdout, stderr) {
        //返回内容stdout
        fs.writeFile(FILE_DIR + 'mysflgo_stdout' + (date.getYear() + seperator1 + month + seperator1 + strDate +
            " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds()) + '.txt', stdout);
        fs.writeFile(FILE_DIR + 'mysflgo_stderr' + (date.getYear() + seperator1 + month + seperator1 + strDate +
            " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds()) + '.txt', stderr);
        response.writeHead(200, {"Content-Type": "text/html"});
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<a href="' + '/download_img?filename=' + 'mysflgo_stdout' + (date.getYear() + seperator1 + month + seperator1 + strDate +
            " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds()) + '.txt'
            + '">download</a>' +
            '</body>' +
            '</html>';
        response.write(body);
        response.end();
    });
}

//下载服务器上的文件
var download_img = function (response, request) {
    var file_name = url.parse(request.url).pathname.split('/').pop();
    var arg = url.parse(request.url).query;
    var str = querystring.parse(arg);
    var filename = querystring.parse(arg).filename;
    _download(FILE_DIR, filename, response);
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
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.make_fiel = make_fiel;
exports.download_img = download_img;