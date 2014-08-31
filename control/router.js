function route(pathname, handle, response, request,event) {
    if (pathname != "/favicon.ico") {
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        //从传递的对象中获得请求处理函数
        if (typeof handle[pathname] === "function") {
            console.log("[" + (date.getYear() + seperator1 + month + seperator1 + strDate) + "]ROUTER " + pathname);
            return handle[pathname](response, request,event);
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    }
}

exports.route = route;