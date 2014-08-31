var http = require("http");
var url = require("url");

var events = require('events'); //引入事件模塊
var EventEmitter = events.EventEmitter;
var event = new EventEmitter();

//处理模块定义  并导出
exports.start = function (route, handle) {
    //服务器创建过程的回掉函数，也是程序的入口
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        if (pathname != "/favicon.ico") {
            var date = new Date();
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]REQUEST " + pathname);
        }
        //调用路由模块，执行路由模块中的方法
        route(pathname, handle, response, request,event);





    }

    //创建服务器
    http.createServer(onRequest).listen(8000);
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]The server has started!");
};
