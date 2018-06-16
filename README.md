# musicserver
Simple nodejs / express music browser

## Install NodeJS
Please [install NodeJS](https://www.google.com/search?source=hp&ei=xyckW_uXKsPEjwTq0rmICQ&q=install+nodejs&oq=install+nodejs&gs_l=psy-ab.3..0j0i131k1j0l8.875.2417.0.2504.14.9.0.0.0.0.368.837.0j3j0j1.4.0....0...1.1.64.psy-ab..10.4.836....0.jDCQmP_OFK4).   I recommend installing NVM first, and then using THAT to install (and manage your version of) NodeJS.

On Mac:
```
$ brew install nvm
$ nvm install 10.0.0
$ nvm use 10.0.0
```

Then install the `node_modules`:
```
$ npm install
```

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
- add a browser based HTML5 music player instead of launching mp3 in browser
- support "play all in directory"

