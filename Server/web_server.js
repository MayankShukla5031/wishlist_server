var http = require("http");
var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE 'html'>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Wishlist web server</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("This is SK's first web service!");
  response.write("</body>");
  response.write("</html>");
  response.end();
});

server.listen(1000);
console.log("Server is listening");