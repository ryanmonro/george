#!/bin/bash
find . -exec ffmpeg -i {} -c:a aac -b:a 128k ../m4a/{}.m4a \;
