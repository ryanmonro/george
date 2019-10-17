#!/bin/bash

verbose=${1:-}  # any $1 will make it very verbose. Otherwise silent

boldon=$(tput bold)
redon=$(tput setaf 1)
reset=$(tput sgr0)


# George is a 10 second loop.

# For timing reasons, each loop start at +1 seconds
# so we need to prepare for the time at offset of +9 seconds.
# This exists outside the loop because why waste cpu?
OFFSET="now +9 seconds" 

# make mpv quieter
MPVOPTS="--quiet"

# audio path relative to script
audpath=audio/m4a


# verbose output looks like:
#
# 2019-10-16T16:09:50+10:00 ...Initialising George...
# 0.915 4:10:00.008 - - 56.684 57.992942424! ! 00.083312699! 00.601496591 3.37
# 0.391 4:10:10.013 - - 07.336 07.992173996! ! 09.976946035! 10.296614795 2.85
# 0.700 4:10:20.006 - - 16.750 17.992814237! ! 19.991874100! 20.315241038 2.87
# 0.676 4:10:30.006 - - 26.676 27.992333856! ! 29.980969973! 30.319758182 2.50
#
# columns:
# sleep|target time| end intro| first beep |2nd| third beep |  end loop  |load
#
# ...if the initial sleep is long (missing a cycle), it'll be red.
# ...target time is full time. All other times are seconds.decimal
#
[ -n "$verbose" ] && echo "$(date -Iseconds) ...Initialising George..."

prevsec=$(date -d 'now -10 seconds' +%S)    # so the sanity test starts sane
while true ; do

    # setup the sleep so that this loop starts at second +1
    # (this is self correcting for variance and starttime)
    # note: sometimes the loop will overlap (perhaps by system activity,
    # perhaps by script timing bugs here) and the sleep will be 9.x seconds,
    # thus skipping a loop.
    nowsec=$(date +%S)
    nownano=$(date +%_N)

    sleepsec=$(((10-${nowsec:1:1})%10))
    sleepnano=$((1000000000-$nownano))
    if [ -n "$verbose" ] ; then
        # merely bold probably means we ended previous loop early
        [ "$sleepsec" -gt 0 ] && echo -n $boldon
        # red probably means we ended late and are skipping a loop :(
        [ "$sleepsec" -gt 1 ] && echo -n "$redon"
        echo -n "$sleepsec.${sleepnano:0:3}$reset "
    fi
    sleep $sleepsec.$sleepnano
    # time should now be exactly 1 second into the loop

    # The time that George will be talking
    hourtmp=$(date -d "$OFFSET" +%_I)
    HOUR=${hourtmp#* }      # remove possible leading space
    MIN=$(date -d "$OFFSET" +%M)
    SEC=$(date -d "$OFFSET" +%S)
    NANO=$(date -d "$OFFSET" +%N)

    [ -n "$verbose" ] && echo -n "$HOUR:$MIN:$SEC.${NANO:0:3} "    # output the intended time
    case $SEC in
        00)
            sleep 1     # crude adjust because "precisely" is a shorter audio
            SECFILES="$audpath/precisely.aif.m4a"
            ;;
        *)
            SECFILES="$audpath/and.aif.m4a $audpath/$SEC.aif.m4a $audpath/seconds.aif.m4a"
            ;;
    esac

    case $MIN in
        00) # on the hour
            sleep 1     # crude adjust because the oclock is shorter
            MINFILES="$audpath/oclock.aif.m4a"
            ;;
        0*) # 1-9 minutes we only need this
            sleep 0.8     # crude adjust because the units are shorter
            MINFILES="$audpath/${MIN:1:1}.aif.m4a"
            ;;
        1*) # 10-19 only need this
            MINFILES="$audpath/${MIN}.aif.m4a"
            ;;
        ?0) # the 20,30,40,50 minutes only need this
            sleep 0.8     # crude adjust because 10s of minutes are shorter
            MINFILES="$audpath/${MIN:0:1}0.aif.m4a"
            ;;
        *)  # this handles all other minutes
            MINFILES="$audpath/${MIN:0:1}0.aif.m4a $audpath/${MIN:1:1}.aif.m4a"
            ;;
    esac

    # speak to me George. Speak to me!
    [ -n "$verbose" ] && echo -n "- "
    mpv $MPVOPTS $audpath/thirdstroke.aif.m4a $audpath/$HOUR.aif.m4a $MINFILES $SECFILES >/dev/null 2>&1
    [ -n "$verbose" ] && echo -n "- "

    # now a similar loop to before, to set our first stroke to 8th second
    nowsec=$(date +%S)
    nownanotmp=$(date +"%N %-N")   # called once for performance.
    nownano=${nownanotmp% *}      # %N - for treating as a fraction in echo
    nownanoclean=${nownanotmp#* } # %-N - for treating as a number in sleep calc

    [ -n "$verbose" ] && echo -n "$nowsec.${nownano:0:3} "   # should be high x6 or low x7 second

    # if all crude adjusts are right, and mpv play speed was fine, we are in the 7th second and need to sleep for less than a second. 
    # if we're already into the x8 minute this returns negative, so let's just be silent :)
    sleep $(((7-${nowsec:1:1})%10)).$((990000000-${nownanoclean})) >/dev/null 2>&1 # tweak the nanosecond to help avoid a race condition

    # time should now be exactly at 8 seconds into the loop

    # First stroke: date and ! and sleep
    [ -n "$verbose" ] && echo -n "$(date +%S.%N)"   # ideally an x8.0 time
    mpv $MPVOPTS $audpath/stroke.aif.m4a > /dev/null 2>&1
    [ -n "$verbose" ] && echo -n "! "
    sleep 0.68  # 0.68 works out about right for me! ;)

    # Second stroke: ! and sleep
    mpv $MPVOPTS $audpath/stroke.aif.m4a > /dev/null 2>&1
    [ -n "$verbose" ] && echo -n "! "
    sleep 0.68
    
    # Third stroke: date and ! and date
    [ -n "$verbose" ] && echo -n "$(date +%S.%N)"   # ideally a x0.0 time
    mpv $MPVOPTS $audpath/stroke.aif.m4a > /dev/null 2>&1
    [ -n "$verbose" ] && echo -n "! "
    [ -n "$verbose" ] && echo -n "$(date +%S.%N) "
    [ -n "$verbose" ] && cut -d ' ' -f 1 < /proc/loadavg

    prevsec=$nowsec     # for loop accuracy checking
done
