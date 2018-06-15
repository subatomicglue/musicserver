# musicserver
Simple nodejs / express music browser

## Run the service
```
$ npm start
> musicserve@1.0.0 start /Users/kevin/src/musicserver
> nodemon serve app.js

[nodemon] 1.17.5
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node serve app.js`
Example app listening on port 3000!
```

## Open in browser
```
$ open http://localhost:3000/?token=KAJSDKFLJASdfkljdsalkfjQRFANkl43n5CmjSDNFJFBFJSK7897348659hjk23ghj342k5g234uib5g43uv532gj
```

## customize local music folder
Change the `local_music_mount` variable to the location of your giant folder-o-music...

## Customize security
Security is super primitive, consiting of a single accesstoken.  Change the token or the world will know how to get in.  This is a public github afterall...

## TODO
Lots!
- move customizations (token and music mount) to a config file or .env file
- add a browser based HTML5 music player instead of launching mp3 in browser
- support "play all in directory"

