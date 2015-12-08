# #!/bin/bash
# #
# # Copyright 2015 Eric Bidelman <ericbidelman@chromium.org>


# Vulcanize main demos ---------------------------------------------------------

html_out_file=elements/elements.v.html
js_out_file=elements/elements.v.js

vulcanize elements/elements.html \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

# Polymer is="body-bind" demo --------------------------------------------------

html_out_file=elements/elements-no-polymer.v.html
js_out_file=elements/elements-no-polymer.v.js

vulcanize elements/elements.html \
    --strip-exclude "bower_components/polymer/" \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
babel $js_out_file -o $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

html_out_file=elements/bootstrap.v.html
js_out_file=elements/bootstrap.v.js

vulcanize elements/bootstrap.html \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
babel $js_out_file -o $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

# Polymer is="body-bind" demo - vulcanized script at top using crisper ---------

html_out_file=crisper-top.v.html
js_out_file=crisper-top.v.js

vulcanize elements/elements-all.html \
    --inline-script --inline-css --strip-comments | \
   crisper -h $html_out_file -j $js_out_file

babel $js_out_file -o $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

# Polymer is="body-bind" demo - vulcanized script at bottom using crisper ------

html_out_file=crisper-bottom.v.html
js_out_file=crisper-bottom.js

vulcanize elements/elements-all.html \
    --inline-script --inline-css --strip-comments | \
   crisper --script-in-head=false -h $html_out_file -j $js_out_file

babel $js_out_file -o $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

# Polymer is="body-bind" demo - vulcanized index (all inlined) -----------------

html_out_file=inline.v.html
js_out_file=inline.v.js

vulcanize inline.html \
    --inline-script --inline-css --strip-comments | \
   crisper --only-split -h $html_out_file -j $js_out_file

babel $js_out_file -o $js_out_file
uglifyjs $js_out_file -c -o $js_out_file

content="<script>$(cat $js_out_file)</script>"

# sed needs \n escaped: http://unix.stackexchange.com/a/60322
content_escaped=$(printf '%s\n' "$content" | sed 's,[\/&],\\&,g;s/$/\\/')
content_escaped=${content_escaped%?}

# Inline inline.v.js.
sed -i .bak "s/<\/body>/$content_escaped/" "$html_out_file"

rm *.bak $js_out_file
