// example
// http://localhost:3000/?token=KAJSDKFLJASdfkljdsalkfjQRFANkl43n5CmjSDNFJFBFJSK7897348659hjk23ghj342k5g234uib5g43uv532gj

const express = require('express');
const app = express();
const path    = require("path");
const fs = require("fs");
const url = require('url');

function isDir( p ) {
   return fs.lstatSync(p).isDirectory()
}
function isFile( p ) {
   return fs.lstatSync(p).isFile()
}
function exists( p ){ return fs.existsSync( p ); }

//app.get('/', (req, res) => res.send('Hello World!'))

const local_music_mount = `/Volumes/music/`;
const token="KAJSDKFLJASdfkljdsalkfjQRFANkl43n5CmjSDNFJFBFJSK7897348659hjk23ghj342k5g234uib5g43uv532gj";

app.get('/:path?',function(req,res){
   let req_url = url.parse(req.url).pathname;
   let req_url_decode = decodeURI( req_url );
   let req_path = req.params.path;
   if (req_path === undefined) req_path = '';
   console.log( `Requesting: ${req_path}` );
   console.log( ` - URL: ${req_url}` );
   //let given_token = req.headers['Authorization'];
   let given_token = req.query.token;

   if (given_token != token) {
      return res.status(401).send(`401 access denied`);
   }

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
         let page = folder.map( file => {
            if (isDir(file.fullpath))
               return `<a href="${file.urlpath}?token=${req.query.token}">${file.filename}</a><BR>\n`
            else
               return `<a href="${file.urlpath}?token=${req.query.token}">${file.filename}</a><BR>\n`
         })
         if (req_url != "/") {
            let backurl = encodeURI( decodeURI( req_url ).replace(/[\/][^\/]+\/?$/, '/') );
            console.log( ` - Back Link: ${backurl}` );
            page.unshift( `<a href="${backurl}?token=${req.query.token}">..</a><BR>` )
         } else {
            page.unshift( `[Root]<BR>` )
         }
         res.send( page.join('')  );
      } else {
         return res.sendFile( fullpath );
      }
   } else
      return res.status(404).send(`404 not found - '${req.params.path}'`);
});



app.listen(3000, () => console.log('MusicServer listening on port 3000!'))
