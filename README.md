# basis-app-framework

n.b. This Readme is already out of date, and will get a rewrite next week as I complete this initial framework basis with individual data operations and activities, so all is clear.

You can still build and run it, and it will be parallel or better to the latest installer.

We do have a number of nice things added, and as of today, many operations are smoothed.

(fixes for these in now, if I had to back out one or two for a while. Even in developing electron:serve mode, however, no surprises now, matters just work. You can close the developer tools pane, when you don't want them.)
~~(many teething issues with starting window, extra 'slim' menubar etc.)~~

## Now, what is good?

 Primary above else, the internal Habitat data system. This is what we will use, and it abstracts, isolates all details of where the database is, what version, etc., and many other things, as the Habitat in CombatCovid does.  It will deal with all matters of targeting, permitting, and security.
 
 You are just responsible to ask it to make your indexes as required for queries, and then form the simple objects which are the queries. Per PouchDB documents, using Mango.
 
 You would use as model the habitat-act.then.then.then.catch Promise sequence, as in the DataView page. Always promises, always properly used. It's what makes reactive UX like Vue actually work as we like and expect. 
 
 You will of course not use all the pieces, all of the time, nor ever really in the quick-demo way you'll see I used them. Actually, quick-development, and not the first stage, but to force this out, I've left this stage in.
 
 I will soon show how to properly use them, not today. And with you over the course of the project, work out how to form the proper structure, indexes, queries and operational sequences that we actually turn out to need. 
 
 To bring our work to the good thing for others that we imagine...
 
 ## where is the database?
 
 It is running entirely within the browser of the Electron app, at present. This is the smallest possible scale of the Pouch/CouchdB family, and it works very well, proving a point.
 
 I have already other scales of the database running, quite successfully, which is more proof of the architectural concept. 
 
 And in due course, you will have them. It will all be transparent to the application code including UX, through the Habitat interface.
 
## What is bad, because not ready at all?

Many things about the present UX/screens. They are primitive -- where I put any work besides the mini/micro Habitat, and just find ways for things to run, was in getting some formatting basis we can use for Json when it is raw, as we'll need that. Chinese written commonly without spaces that wraps, for example.

The rest, how it activates anything, even the activation themselves, makes little proper sense - it was just how I could most rapidly first turn things on. It is also well in its details worked out, on the road to much better...
 
By now, we have some sensible, straightforward activities in the app, what you'd expect, and which will give a good model to do all your design and app-building upon.
  
## What is crucial but simply unfinished, which you really do need to be patient and give me some time for?
  
- A primary thing is the nature of the database keys, and their relation to proper indexes.
  
  This is crucial to **everything** about queries, and how the database operations will be used.  
  
What I have implemented so far is example for none of this. It is exceptionally important not to rush off on this matter, rather to wait for the real, please. 

It is part of the ground for everything -- how the database and its operations really are to be structured and used.

- to answer one more question I've now had a close look at, yes, you'll be able to query, where needed, at arbitrary depths in a JSON tree. This kind of thing is where my effort often goes.
  
- what else? A number of matters about sequencing and positions of proper use for the Habitat protocol elements, vs. details of operation that the database needs.

- what else?  A lot...so please treat this as it presently is, a demonstration that 'it is all going to work', and an opportunity to first see what the code underlying Json operations is going to look like, as you write it in your application blocks -- easily, based on examples here.

- It should provide a strong basis for Divine to see what if anything needs to be added to have a Linux flavor operate. I think this will be very, very little if any, as Electron really should take care of it -- this is what it's for. But let's see what happens when he brings it up.... 

## What else essential is accomplished here, that you don't notice at first?

There are indeed a number of hard stops in getting the combination of packages to run.

- number One:  DO NOT raise the semver to take Electron 9. It has several real problem which stop us, and which a little attention to their issues shows they are well aware of and trying to fix. Not so far. Stay as we are with Elecron 8.

- then. Tailwind was its usual picnic to get running in another environment, but now with the setup here, it does.

- how many more? There are several more. I don't remmember all at the moment, but this framework gives you the fixes, done.

## Summary position

Overall, I will be much happier to be allowed to do my job, and present architeture's worked-out basis, in the present case by closing issues above. 

I think we will then have a sound basis for what we embark on to do, and a great deal of flexibility in moving forwards with it. 

Please allow that to happen, by not settling on any patterns before we do. 

Thank you.

## Project setup

Clone this repo. 

Then:

```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve (to develop including hot-reload in the Electron app)
```

You may ***not*** use npm run serve, or build, or others like that which you are used to. Because there are OS-native parts in Electron's use, and these cannot run in a browser themselves. 

### Compiles and minifies for production
```
npm run electron:build (this is our delivery as you saw)

```

I don't see a need for any of the postinstall scripts at this point.

# Afterword

Well, a lot of words. A little more time to *show*, and possibly wouldn't take so many. But you get some idea again of what is really involved, in thinking and working our basis out -- architecture which will really operate, for our needs. 
