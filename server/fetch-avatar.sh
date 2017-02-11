#!/bin/bash

# Fetch the image to a temporary file.
TEMPNAME=./temp/$$-$RANDOM
wget -q -T 5 -O $TEMPNAME $1

# Remove all meta-data.
exiv2 rm $TEMPNAME

# Rename the image based on its content.
IDENTITY=`identify -quiet -format %#.%m $TEMPNAME`
HASHNAME=`sed 's/\.jpeg/\.jpg/' <<<${IDENTITY,,}`
mv $TEMPNAME ./public/images/avatars/$HASHNAME

# Return the image path.
echo /images/avatars/$HASHNAME

