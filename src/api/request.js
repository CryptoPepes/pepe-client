import http from "http";

const request = (options) =>
    new Promise ((resolve, reject) => {
        http.get(options, function(res) {
            let body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body);
            });
        }).on('error', function(err) {
            console.log("Get request error: " + err.message);
            reject(err);
        });
    });

export default request;


