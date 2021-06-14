# Hardocs Application Framework, a basis

# Status

Ready for visual improvement of proven cloud operations demonstration,
documentation to be brought up to current at that time.

# Definite Nota Bene

Be sure to use only yarn in here. Yarn install, yarn upgrade, etc.

No npm, or you'll find it won't build, no matter how clean the results may seem. 

Thank Electron, seems pretty clear.

At least you don't have to worry about npm 7 changes that would come with other-than-LTS Node...

# Current release

Operates with @hardocs-project/habitat-client@alpha, which is very different indeed to the discovery code from last year on the @latest version.

We'll go to current as @latest once sure everyone's caught up. And then continue the improvements on that.

# Earlier documentation (to be updated)

--- begin earlier documentation ---

This is a draft of an earlier present which has move on, but it should be useful to understand a basis.

There's a section at the end about why the calls are all Promises, in notes mentioning how useful that actually is in getting our smooth and responsive UX good experience.

## Beginning a-gnu

The Habitat API is sectioned between exposing calls for using the database, and calls to efficiently use local services: the filesystem access and expected Windows etc. widgets we get through Electron.

You can find each of these in the Framework page examples, used in their proper way.

For now at least, please refer to the Habitat source to discover calling parameters and types of values.

Some of the abilities employ lower-level routines that are not exposed, to make everything as straightforward as possible, keeping our application code clean.

As the Promises section will explain, for each call you'll be provided a result from the Promise, or separately an error String if one occurs. These are both callbacks, so they will be where you code to set data in the Vue component itself, or to be reflected in the Vuex store, so that the screen will update as the data arrives.

You must never provide or look for a return value directly from the calls themselves - it wouldn't be there, or reliably, because results only arrive in event time.

## Database Operations

### `createOrOpenDatabase`

In CouchDB and its local version PouchDb, there isn't a distinction between creating and opening a database, so this is just one call. It not only accesses the database, it checks status to be sure all is well, as opening doesn't do this itself.

The result from this Promise will give you the db handle, which you'll set in the Vue data content.

An error would arrive as a String, to be put in an appropriate spot in data also, for reflection on screen.

Once you have the db handle, you can use it in the following very straightforward calls, to load or store the entire Design Project as an object complete: carrying is metadata, docs, and imgs areas just as you'd expect.

### `loadFromDatabase`

This loads a Design Project from the database, given a proper Hardocs-format identifier pair for it. This will be an `owner` and a `project` name.

Your project data object will come as the result, for local data and/or pushing into the Vuex store, as we develop how we want that.

An error would arrive as usual, as a String to be presented in the UX area for that.

### `storeToDatabase`

This call stores a full project data object into the database, once again via an `owner` and `project` naming pair which becomes the key. Of course you'll also pass the project object as `data`.

The successful result will be a small standard object from the database  containing `{ ok: 'true' }`

You don't need to check that, because an error would instead show up as a String, in that branch of the Promise.

### Notes

And that's it, very simple and powerful, for our fundamental use of the database. Later, as the cloud end becomes available, there will be equally simple calls to deal with replication.

What about data dependability?  Here is where CoucnDb shines. It will never lose data, is the statement made not only in the design, but by those who use it.

Even when there may be the natural issues that can occur at times with multiple locations and users, it makes an automatic 'best' choice, and then keeps all the updates available for later conflict resolution. We'll develop a call or two for this, down the road, but it's not important for now.

## Local Service Calls

Local services are the ones for each platform that Electron aids us to run on.

The ones we most directly need are reading and writing to the filesystem, but also for some cases dialogs that are expected to choose folders or files. These calls give you all of those.

For one or two of them, there may be some small issues that need to be dealt with for different operating system file path separators. Easily fixed, and will be soon, or sooner if you tell me you run into a problem, but I also want to see what influences this may have on app page code itself, so we can work all out smoothly. At present, all is working well on Windows.

## Dialog calls

These are what you use when you need to manually select a file or folder, and bring information in for use.

Once again we use Promises, so that there's a separate code area for you to handle results or errors...when in event time the Promise actually comes back.

There are several needs we'll have, thus several calls -- each for its purpose.

\[n.b.I And in writing this first documentation for the services area, I may have spotted a further need or so, noted, and if so, these will appear in an update, along with other needs if you discover some and tell me...\]

### `selectContentFromFolder`

This will put up a dialog allowing you to select a file, and then return its contents. It's used for a single file, and there are other calls to use if  you want several.

Note that you must set the `fileExts` for the file type you want, with the dot, as `".md"`, and `typeName` to name that in the dialog. I've just noticed that the code needs a small change to allow multiple type possibilities - this will come on next update.

The result fork will provide the content of the selected file.

The error fork will give you a string indicating a Cancel by the user, or if there are any issues like permissions which prevented loading the file.

### `chooseFolderForUse`

Now, what if you want to simply selectt a folder, later for a use  such as loading multiple files of a type which exist there?

In this case, you'll want to have a Dialog to select a folder, and this call can give you that.

There's memory in Electron for 'last folder used', so let's see if that's sufficient.

The result fork will provide you the folder path selected, and the error fork would give you a Cancel notification or other error message.

### `loadFilePathsFromSelectedFolder`

This call will let you choose a folder, and then will load the paths all the files of selected type(s) from that folder.

The result fork will provide you the array of filePaths, such as might be used for a list in the UX, which will need the the paths to be useful, while stripping just the names for the list labels.

As ever, the error fork would give you a String describing a problem.

### 'putContentToSelectedFolder`

This is the way you get the expected 'save' dialog, able to select a folder and propose an editiable filename and type, along with a descriptive Label.

The result fork will provide you an object with the path and the operating system success return value.

The error fork would give you a String for a Cancel, or describing the issue.

## Direct Filesystem calls

These calls let you get content from, and put content to files, whose names you might have already in the app, but more likely initially gained from the dialog calls.

### 'loadContentFromFilePath`

Wherever you have a filePath, you can upload its content with this call.

The result fork will provide a FileContent object, containing the `path` as may be convenient to keep together, along with the `data`.

On the error branch, as expected, you would get a string explaining the problem.

### 'putContentToFilePath`

As you'd expect, this is also a straightforward call, to be used when you have the filePath for the file to be written.

The result fork will receive an object with the path and success return vallue from the filesystem.

An error fork will receive a String with reason.

### 'loadFilePathsFromFolder`

This call lets you get paths for files of named types, when you know the folder path to start with, as from one of the dialog calls.

The return fork will provide you with the array of filePaths.

The error fork would give you a string describing the problem.

### Beyond...

More description will follow here, but the shellProcess call is used in a very specific case at the moment, to enable all of the essential `pandoc` document translations.

### 'shellProcess`

...


## why everything's a promise
- every Habitat call is a Promise
- so you always have a .then ({}).catch({}) pattern to use it -- just as all my code does.
- But what is that doing? And why?
- the .then area is where you code for the result, as aways when it comes back, firing that data into the gui presentation  -- it won't be available until the promise returns.
- the .catch area is where you handle the alternative:  that there was an error. Just the same, you'd put that into your gui from the code within.
- if you ever try to code action 'after' the Promise call, it will happen immediately. Thus anything you think you might use from the Promise call will almostnever be there -- except maybe to fool you if the Promise return is very instant, but then on another day the information won't be there.
- how you properly respond to anything in Promise call is always by reactivity. If the .catch or .err change something in the Vue data items, then anything that depends on them (like a field in the template) will automatically respond to the new value.
- reactivity is entirely dependable, and in concept, very tied indeed what Promises offer....
- you've got lots of examples of this Promise-set-reactive-data pattern, in the pages of the app.
- Once you get into it, I think you'll really enjoy the way this works.  It's a fresh kind of building blocks, and really suits the things we do.
