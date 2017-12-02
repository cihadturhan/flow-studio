var config = require('config');

console.log('This script is running with [' + process.env['NODE_ENV'] + '] environment');
var isLocal = process.env['NODE_ENV'] === 'local-env';

if (config.has('autoflow-api-address')
    && config.has("serve-directory")
    && config.has("http-port")
    || (isLocal
        && config.has("https-port")
        && config.has("https-key-file")
        && config.has("https-cert-file"))
    ) {

    var fs = require('fs');
    var net = require('net');
    var http = require('http');
    var https = require('https');
    var morgan = require("morgan");
    var express = require('express');
    var bodyParser = require('body-parser');
    var finalHandler = require('finalhandler');
    var serveStatic = require('serve-static');

    var serve = serveStatic(config.get("serve-directory"));

    httpPort = config.get("http-port");

    var request = require('request').defaults({
        strictSSL: false,
        rejectUnauthorized: false
    });

    var app = express();

    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    });

    var baseApiAddress = config.get('autoflow-api-address');
    //var accountEndpoint = baseApiAddress + '/Account/Info/All'; // TODO : move to config
    var accountEndpoint = baseApiAddress + '/account/info'; // TODO : move to config

    // TODO : make config parameter?

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    // TODO : need to log request info
    app.route('/gateway').post(urlencodedParser, onSuccessSetCookie);

    //////////////////////

    function onSuccessSetCookie (req, res) {
        if (!req.body) {
            res.json('Not Authorized');
            res.status(400).end();
        }
        if (req.body.authToken) {
            request({
                method: 'get',
                url: accountEndpoint,
                headers: {
                    'Auth-Token': req.body.authToken
                }
            }, onSuccessAuth);

            ///////////////////

            function onSuccessAuth(error, response, body) {
                var enumFactory = require("simple-enum");
                var gateways = enumFactory(
                    [
                        "engage"
                    ]);

                if (!error && response.statusCode === 200 && gateways.all.indexOf(req.body.inboundGateway)) {
                    var userInfo = {
                        token: req.body.authToken,
                        accountName: JSON.parse(body).Name
                    };
                    res.cookie('_rmmbr', new Buffer(JSON.stringify(userInfo)).toString('base64'), {
                        path: '/',
                        secure: true
                    });
                    res.cookie('NG_TRANSLATE_LANG_KEY', '"en"', {
                        path: '/',
                        secure: true
                    });
                    var gatewayParams = JSON.stringify(req.body);
                    res.cookie('gatewayParams', gatewayParams, {
                        path: '/',
                        secure: true
                    });
                    res.redirect('https://' + req.hostname + ':9094/#!/gateway');
                }
                // TODO : change redirect
                res.status(401).end();
            }
        }
    }

    app.use(express.static(config.get("serve-directory")), morgan("tiny"), bodyParser.urlencoded({
        extended: true
    }));

    http.createServer(app, httpConnection).listen(httpPort);

    if (isLocal) {
        httpsPort = config.get("https-port");
        try {
            httpsOptions = {
                key: fs.readFileSync(config.get("https-key-file")),
                cert: fs.readFileSync(config.get("https-cert-file"))
            };
        } catch (err) {
            console.log("Files that will use for SSL couldn't read");
            process.exit(-1);
        }
        https.createServer(httpsOptions, app, httpsConnection).listen(httpsPort);
    }


    ////////////////////

    function httpConnection(req, res) {
        var host = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice(0, req.headers.host.indexOf(":")) : req.headers.host;
        res.writeHead(301, {"Location": "https://" + host + ":" + httpsPort + req.url});
        res.end(0);
    }

    function httpsConnection(req, res) {
        serve(req, res, finalHandler(req, res));
    }

    if (isLocal) {
        console.log('The Server Running for HTTP on [' + httpPort + '] and for HTTPS on [' + httpsPort + ']');
    } else {
        console.log('The Server Running for HTTP on [' + httpPort + ']');
    }

} else {
    console.log("There is missing configuration");
    process.exit(-1);
}

