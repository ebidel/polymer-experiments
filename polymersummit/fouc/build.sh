#!/bin/bash
#
# Copyright 2015 Eric Bidelman <ericbidelman@chromium.org>


# Vulcanize main demos ---------------------------------------------------------

html_out_file=elements/elements.v.html
js_out_file=elements/elements.v.js

vulcanize elements/elements.html \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
uglifyjs $js_out_file -c -o $js_out_file


# Polymer is="dom=bing" demo ---------------------------------------------------

html_out_file=elements/elements-no-polymer.v.html
js_out_file=elements/elements-no-polymer.v.js

vulcanize elements/elements.html \
    --strip-exclude "bower_components/polymer/" \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
babel $js_out_file -o $js_out_file
# uglifyjs $js_out_file -c -o $js_out_file

html_out_file=elements/bootstrap.v.html
js_out_file=elements/bootstrap.v.js

vulcanize elements/bootstrap.html \
    --inline-script --inline-css --strip-comments | \
    crisper --script-in-head -h $html_out_file -j $js_out_file
babel $js_out_file -o $js_out_file
# uglifyjs $js_out_file -c -o $js_out_file
