#!/bin/bash



PROG=`basename $0`



# Restart led_monitor_ui every 7 days (0 means infinite)
# in order to avoid the risk of memory leak
KB_EYE_DURATION=${KB_EYE_DURATION:-604800}
KILL_TIMEOUT=${KILL_TIMEOUT:-15}                                # 15 seconds
PAUSE_ON_ERROR=${PAUSE_ON_ERROR:-15}                            # 15 seconds



MUTEX=/tmp/$PROG
RETVAL=0




# Define the loop condition
keep_looping()
{
    # return 0 to continue the loop; return 1 otherwise
    [ -e "$HOME/stop" ] && { echo "Quitting by stop file." >&2; return 1; }
    return 0
}



exec 9>"$MUTEX"
flock --exclusive --nonblock 9 || exit  # Somebody has stolen the lock!


# Okay, we have the lock


while keep_looping
do
    START_TIME="$(date '+%Y-%m-%d_%H:%M:%S%z')"
    echo "Start $PROG $START_TIME"

    time timeout --preserve-status --foreground -k $KILL_TIMEOUT -s INT \
        $KB_EYE_DURATION \
        nginx -g 'daemon off;'

    RETVAL=$?

    STOP_TIME="$(date '+%Y-%m-%d_%H:%M:%S%z')"
    echo "Stop $PROG $STOP_TIME ($RETVAL)"

    [ $RETVAL -eq 0 ] || {
        echo ""
        echo "Pausing for error recovery ($PAUSE_ON_ERROR sec) ..."
        sleep $PAUSE_ON_ERROR
        echo ""
        echo ""
    }
done




# Release the lock
exec 9>&-

exit $RETVAL

# End.

