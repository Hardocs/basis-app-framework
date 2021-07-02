# Hardocs Application Framework, 01 July 2021

## Status

Ready for development of 2021 applications with usage-proving and usage-based improvement of the Beta Habitat Cloud -- and the applications which use it.

## Usage

All is normal, except that you need to be very careful to always be actually using the Beta version of the habitat-client package.

In general, do the following:

1. Do your Git installs and upgrades, with Yarn, as normal for this and any app project.

2. Each time after you do so, be sure to run the following: `yarn upgrade @hardocs-project/habitat-client@beta`

This two-step procedure is necessary because Yarn will lock you to the Beta the first time you set it, and then ***not*** updated that package even when it's been updated on the npm repository. 

So, remember to do it always, yourself, as long as we're working from the Beta, thanks.

## Definite Nota Bene

Be sure to use only Yarn in here. `yarn install`, `yarn upgrade`, etc.

No npm, or you'll find the project won't build, no matter how clean the results may seem. 

Thank Electron, seems pretty clear.

At least you don't have to worry about npm 7 changes that would come with other-than-LTS Node....

## Current release

Operates with @hardocs-project/habitat-client@beta, which is very different indeed to the discovery code from last year on the @latest version.

We'll go to current as @latest once sure everyone's caught up, and otherwise the project is ready for it. At that point improvements will occur there.

## Further documentation

The earlier set is so far out of date that this must begin anew. We have very nice abilities now, and it's easy and in a consistent pattern to use them, as this App Framework demonstrates.

Brief notes folloe for now.

### Promises promise the way

Everything you do that involves a User Experience should use Promises, and use them properly. This is so that time-consuming actions can be set running, and the UX immediately become responsive again. 

This means no `async/await` either, if you think about it. And thinking is what will get you forward in all cases where Promises are used to their advantages.

### No App-local Database

It's said several times elsewhere, but it's a very clear picture: any database on a browser-based client would be a huge reliability, security, and recoverability risk. This also applies in most regards to any other form of client software. 

Hardocs needs to be fully reliable, recoverable, and secure, particlarly with regard to forgery attempts. So don't do this. 

The use in this App Framework is the exception that will go away just as soon as other project work can be adopted, and with it, all the database abilities of the Habitat Client will be removed.

### Habitat Client patterns: Helpers

This App Framework should show you how easy it is, and some quite good practices.  

The helper routines are part of this picture, and you can just upgrade their code with actions suitable to your app, when you copy over and include their code. This will keep your interaction with the cloud themselves as quite clean code.

### Habitat Client patterns: Simple Promise Chains

You'll see there is a quite consistent flow of operation, beginning with the two main application calls, `habitatCloud.oadProject`, and `habitatCloud.updateProject`, in their similarly named methods.

In pseudo-code,it looks like this:
```
assureRemoteLogin
  .then
    prepare calling data block
    initiate your user interface 
    initiate the progressIndicator
    doRequest your habitatCall and data block
  .then
    receive result
    close the progressIndicator
    update your user interface
  .catch
    showCmdError instead, if there was one
```

And that's it. Data blocks allow a clear statement of what you want, and the doRequested call to gain results.  The progress indicator blocks interference until results are in, and gives a good feeling for the person making the request. 

### The Hardocs User Experience, and our Data

A note here on that progress. We want to keep the Hardocs experience very appealing, as a significant aspect of its design.

That means highly limiting data sizes we communicate to the ***summary*** level Hardocs has always been designed to provide. Beyond the absolutely necessary control of images which should be present (now...!), we can improve our handling for best visual appearance, and a paper will come out with details and explaining the limits again.

To help this become real, a nice tool will be provided to allow you to simulate low-bandwidth internet uploads, as are very common even in the best provided areas of the world. Experience with how this feels will be our guide.

### Your Habitat Data, coming and going

You'll notice there are three sections in the Habitat Project Object that you are concerned, or partially concerned with. It goes together in this way:
```
Habitat Project Object
 internal
 details
 hdFrame
   searchable and Finder data
 hdObject
   your Hardocs Object, complete
```

In handling, as the example code methods show, you should store and update only the three main sections. The meanings are:

- internal: this can be _id, _rev, etc., or other things for convenience on the underlying systems we use and may use.
- details: this furnishes essential keys beginning with locale and project, and will contain other things in future according to app features. At present at least, you should be able to simply ignore it, even if the App Framework is storing it locally. Later there will be information which could be important for _use_ in your app, such as for namings, but you shouldn't have to store it, is the intention.
- hdFrame: this one you should store, and you will be providing the information in it for update to the Habitat Cloud. Its contents will be like the top section we used in CombatCovid: its own metadata with keywords and short description, a very small Finder image, and an (html this time...no Markdown!) short overview page. We don't have to have this right away, but you can prepare for its coming with a Frame folder in the on-disk Desktop App files. If you wonder, we are keeping the frame very size-limited and separated this way for the same reason as in CombatCovid, to enable search, Finder-type apps, and rapid response in any of what constitutes them.
- hdObject: this is what you well know already, the Hardocs Object, with all its metadata and lingua franca docs. This must be compact, and there's some discussion below of how we really must be and can be conscious in providing this.

## Functionality and the code

The App Framework has been used intensively for many months to discover what we can do, and how best to do it, in the full layers of the Habitat, besides what you see now in results of that. 

As this kind of a development backplane, convenience has been much more important than structuring which would only come later, and visual appearance above the pleasantly serviceable has been bypassed with a smile as well.

It would have been nice in retrospect to partition out components for the various areas of the Projects Admin section where you find the example code, and this will happen as this App Framework gravitates into becoming the Hardocs Adminstration console anticipated. 

This is future business, and so to make it easy for you to work with the portion of code which is providing your examples at this time, there are comment separators: one at the beginning of the Vue methods, and another at the conclusion of the few of those routines which are actually of interest to you in developing the desktop application. The rest...just don't concern with it, please.

You'll also have to realize that there is a database in use, which has been underlined that we simply won't have, and so those calls are ones you replace by your own Project Data storage arrangement. 

This temporary use in the App Framework demonstrator will go away as soon as an alternative is ready, preferably back-ported from your desktop app itself. So don't get involved with or confused by the database presence, thank you.

## Conclusion

Enough to say, for a pre-contract first development release of the cloud abilities that benefit Hardocs. I hope you may find that they give a smile, with their simplicity and transparency of use, with all the hard parts taken care of beyond the API walls. 

This sense of ease and the security always present which makes a comfort to use them, have been the intent guiding all efforts so that you have these results today.
