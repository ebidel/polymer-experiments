#!/bin/bash
#
# Copyright 2015 Eric Bidelman <ericbidelman@chromium.org>

# html_out_file=index.v.html
# js_out_file=index.v.js

# vulcanize index.html \
#     --inline-script --inline-css --strip-comments | \
#     crisper -h $html_out_file -j $js_out_file

# html_out_file=appshell.v.html
# js_out_file=appshell.v.js

# vulcanize appshell.html \
#     --inline-script --inline-css --strip-comments | \
#     crisper -h $html_out_file -j $js_out_file

html_out_file=elements.v.html
js_out_file=elements.v.js

vulcanize elements.html \
    --inline-script --inline-css --strip-comments | \
    crisper -h $html_out_file -j $js_out_file
