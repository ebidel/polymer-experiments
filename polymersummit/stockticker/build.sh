#!/bin/bash
#
# Copyright 2015 Eric Bidelman <ericbidelman@chromium.org>

# Example
# ./build.sh stock-ticker-es6.html

element="stock-ticker-es6"

html_out_file=$element.v.html
js_out_file=$element.v.js

BABEL=node_modules/babel/bin/babel.js

node_modules/vulcanize/bin/vulcanize $element.html \
    --inline-script --inline-css --strip-comments | \
    node_modules/crisper/bin/crisper -h $html_out_file -j $js_out_file

$BABEL --compact false $js_out_file -o $js_out_file

# html_out_file=index.v.html
# js_out_file=index.v.js
#
# BABEL=node_modules/babel/bin/babel.js
#
# vulcanize index.html \
#     --inline-script --inline-css --strip-comments | \
#     crisper -h $html_out_file -j $js_out_file
#
# $BABEL --compact false $js_out_file -o $js_out_file
# # $BABEL --compact false --blacklist strict $js_out_file -o $js_out_file
