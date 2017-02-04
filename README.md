![license](https://img.shields.io/badge/license-MIT-blue.svg)

DreamSlider, a jQuery treat
=============

Description
----------------
DreamSlider is a jQuery image slider plugin with great visual effects.

Demo
----------------
jQuery DreamSlider [Demo](https://dreamweiver.github.io/dreamSlider/)

Main Features
----------------
+    Single image/Gallery mode to create an image slideshow with thumbnails
+    Small file size,easy to implement.
+    Quick load time due to progressive loading of images, which are beyond viewport using lazyloading technique
+    No additional thumb images required.
+    Hover effects for thumbnails : Zoom-in(default),bounce,standout.
+    Browser support: Chrome v47.0 +,Firefox v42.0 +,IE11+ & many more to come.

How to use dreamSlider?
--------------------

### The code ###
add the following css style sheet to the &lt;head&gt; of your document.
```html
<link type="text/css" rel="stylesheet" href="../dist/css/dreamSlider.min.css" />
```

### HTML Structure ###
Add the following js scripts references to the body tag after the images are loaded for optimum performance benefit.
```html
<div class="container">
    <div class="im_wrapper">
        <div ><img data-src="img/1.jpg" alt="" /></div>
        <div ><img data-src="img/2.jpg" alt="" /></div>
        <div ><img data-src="img/3.jpg" alt="" /></div>
        <div ><img data-src="img/4.jpg" alt="" /></div>
        <div ><img data-src="img/5.jpg" alt="" /></div>
        <div ><img data-src="img/6.jpg" alt="" /></div>
        ...
    </div>
</div>

<!-- The JavaScript libraries section-->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script type="text/javascript" src="../dist/js/dreamslider.min.js"></script>
...
```

### Instantiating the awesomeness! ###
```html
 <script type="text/javascript">
    $(function(){
        $('#container').dreamSlider({
            rowCount:6 //no of thumbs in a row [limit 5 or 6] 
            //,easeEffect: 'bounce'
            //,easeEffect: 'standOut'
        });
    });
</script>
```

### Found a Bug ? ###
If you think you might have found a bug or if you have a feature suggestion, please use github [issue tracker](https://github.com/dreamweiver/dreamSlider/issues/new). Also try to add a [jsfiddle](http://jsfiddle.net) or [codepen](http://codepen.io) or [plunker](http://http://plnkr.co) that demonstrates your problem.

If you need any help with implementing dreamSlider in your project or if have you any personal support requests, then please use [stackoverflow](https://stackoverflow.com/) to post a question & tag me to your question using my SO id @dreamweiver or you can even mail me directly to my personal maibox dreamweiver.manoj@gmail.com, instead of raising a issue on dreamSlider github page.

If you like dreamSlider then star this repository or if you any feedbacks about this project then do drop me a mail.
[@dreamweiver](mailto:dreamweiver.manoj@gmail.com)

### Contributions ###
Special thanks to [Mary Lou](http://tympanus.net/codrops/author/crnacura/), whose base idea was an inspiration to build "dreamslider.js".

#### MIT © [dreamweiver](http://stackoverflow.com/users/1677272/dreamweiver)

