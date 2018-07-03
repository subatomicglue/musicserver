// example
// http://localhost:3000/?token=KAJSDKFLJASdfkljdsalkfjQRFANkl43n5CmjSDNFJFBFJSK7897348659hjk23ghj342k5g234uib5g43uv532gj

const express = require('express');
const app = express();
const path    = require("path");
const fs = require("fs");
const url = require('url');
const config = require("./config.json");

function isDir( p ) {
   return fs.lstatSync(p).isDirectory()
}
function isFile( p ) {
   return fs.lstatSync(p).isFile()
}
function exists( p ){ return fs.existsSync( p ); }

function auth(req,res,next) {
   let given_token = req.query.token;
   if (given_token != token) {
      return res.status(401).send(`401 access denied`);
   }
   next();
}

//app.get('/', (req, res) => res.send('Hello World!'))

const local_music_mount = config.local_music_mount;
const token = config.token;
const port = config.port;
const root = '/start/';
const excludeFolders=[
  '.AppleDouble', '.AppleDB', '.AppleDesktop', 'Network Trash Folder', 'Temporary Items'
];
const VERBOSE = false;

app.get(`${root}:path?`, auth, function(req,res){
   try {
      let origin = url.parse(req.url).origin;
      let req_url = url.parse(req.url).pathname;
      let req_url_decode = decodeURI( req_url );
      let req_path = req.params.path;
      if (req_path === undefined) req_path = '';
      VERBOSE && console.log( `Requesting: ${req_path}` );
      VERBOSE && console.log( ` - URL: ${req_url}` );
      let given_token = req.query.token;
      let given_token_uri = encodeURIComponent(given_token);

      let fullpath = path.join(local_music_mount, req_path);
      if (exists( fullpath )) {
         if (isDir(fullpath)) {
            let folder = [];
            fs.readdirSync(fullpath).forEach(file => {
               folder.push( {
                  filename: file,
                  fullpath: path.join(fullpath, file),
                  urlpath: req_url + encodeURIComponent( "/" + file )
               } );
            })
            // the listing
            let listing = folder.map( file => {
               VERBOSE && console.log( excludeFolders.indexOf( file.filename ), file.filename, excludeFolders )
               if (isDir(file.fullpath) && excludeFolders.indexOf( file.filename ) > -1) {}
               else if (isDir(file.fullpath))
                  return {dir:true, url:file.urlpath, filename: file.filename };
               else {
                  if (decodeURI( file.urlpath ).match( /\.(mp3|wav|aac|ogg|mp4|webm)$/i ))
                     return {music:true, url:file.urlpath, filename: file.filename };
                  else if (decodeURI( file.urlpath ).match( /\.(jpg|bmp|png)$/i ))
                     return {image:true, url:file.urlpath, filename: file.filename };
                  //else
                  //   return {text:true, filename:file.filename};
               }
            }).filter( file => file !== undefined );
            // add a back .. to top of listing
            if (req_path != "/" && req_path != "") {
               let backurl = encodeURIComponent( req_path.replace(/[\/][^\/]+\/?$/, '') );
               VERBOSE && console.log( ` - Back Link: ${backurl}` );
               listing.unshift( {dir:true, url: `${root}${backurl}`, filename: '..'}  );
            } else {
               listing.unshift( {text:true, filename:`[Root]`} );
            }
            return res.send( renderListing( listing, given_token_uri )  );
         } else {
            return res.sendFile( fullpath );
         }
      } else
         return res.status(404).send(`404 not found - '${req.params.path}'`);
   } catch (err) {
      console.error( err );
      return res.status(418).send(`418 you are a teapot - '${req.params.path}'`);
   }
});


app.get(`/*`, auth,function(req,res){
   let f = process.cwd() + `/site/` + req.params[0];
   if (exists( f ) && !isDir(f)) {
      console.log( `Sending ${f}` );
      return res.sendFile( f );
   } else {
      console.log( `404 not found - '${f}'` );
      return res.status(404).send(`404 not found - '${req.params[0]}'`);
   }
})


console.log( `Welcome` );
console.log( `Serving: ${local_music_mount}` );
console.log( `Token:   ${token}` );
console.log( `URL:     http://localhost:${config.port}/start/?token=${token}` );
console.log( `Port:    ${config.port}` );

app.listen(3000, () => console.log('MusicServer listening on port 3000!'))



function renderListing( listing, token ) {
   //console.log(listing);
  let script = `
   <html>
   <head>
      <!-- https://getbootstrap.com/docs/4.0/getting-started/introduction/ -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
      <style>
         .musicfile {
            cursor: pointer;
            color: red;
         }
      </style>
      <script>
         // https://www.html5rocks.com/en/tutorials/webaudio/intro/
         var context;
         window.addEventListener('load', init, false);
         function init() {
            try {
               // Fix up for prefixing
               window.AudioContext = window.AudioContext||window.webkitAudioContext;
               context = new AudioContext();
            }
            catch(e) {
               alert('Web Audio API is not supported in this browser');
            }
         }
         function loadSound(url, done) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = function() {
               context.decodeAudioData(request.response, function(buffer) {
                  done( buffer );
               }, (err) => done( undefined, err ) );
            }
            request.send();
         }
         function playSound(buffer) {
            var source = context.createBufferSource(); // creates a sound source
            source.buffer = buffer;                    // tell the source which sound to play
            source.connect(context.destination);       // connect the source to the context's destination (the speakers)
            source.start(0);                           // play the source now
                                                         // note: on older systems, may have to use deprecated noteOn(time);
            return source;
         }
         let currentSource = undefined;
         function play( file, token ) {
            if (currentSource) {
               currentSource.stop();
               delete currentSource.buffer;
               delete currentSource;
               currentSource = undefined;
            }
            loadSound( file + "?token=" + token, (buffer,err) => {
               if (buffer)
                  currentSource = playSound( buffer );
               else
                  console.log( err, decodeURI( file ) );
            });
         }
      </script>
      </head>
      <body>
      <div class="list-group">
         ${listing.map( l => {
            return l.dir ? `<a href="${l.url}?token=${token}" class="list-group-item list-group-item-action">${l.filename}</a>` :
               l.music ? `<div onclick="play( '${l.url}', '${token}' )" class="list-group-item list-group-item-action btn text-danger">${l.filename}</div>` :
               l.image ? `<a href="${l.url}?token=${token}" class="list-group-item list-group-item-action">${l.filename}</a>` :
               l.text ? `<div class="list-group-item list-group-item-action">${l.filename}</div>` : ``;
         }).join('')}
         </div>
      </body>
      </html>
      `;
   return script;
}

