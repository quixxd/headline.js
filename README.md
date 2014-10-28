headline.js HTML Presentation Engine
===========

headline.js is a HTML and Javascript-based presentation engine for offline and online presentations. headline.js uses pixi.js for graphics.

You can only present headlines. You have one line for slide. It is you what makes your presentations interesting, not your slides.

headline.js supports:

* slides
* one headline per slide
* slide transitions

headline.js does not support:

* animations
* images
* lists
* tables
* backgrounds
* punctuation
* slide text

So: animate your body, and not your slides.

# Demo

Use arrow keys, Page keys or spacebar to navigate through slides. Demo page:

http://quixxd.github.io/headline.js/

# Usage

headline.js is invoked with: 

```
headline(document, [
    'headline js', 'presentation', 'engine', 'for web', 'simple', 'clean', 'enjoy',
		'one liners', 'that is it', 'q and a'],
		false);
```

First parameter is `document`, second is a list of your headlines. Third parameter controls the style of style morphings: `true` for full morph, `false` for fly-out morph.

Quick start: Download the zip file, and edit the `index.html` file, specifying your slide headlines inline.

