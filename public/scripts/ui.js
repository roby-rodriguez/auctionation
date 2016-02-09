/**
 * Commons & util
 * todo create namespace
 */
function createAlert(id) {
    var componentId = id ? '#' + id : "#alertMessage";
    $(componentId).show();
    //$(componentId).delay(5000).fadeOut("slow", function () { $(this).hide(); });
}

function closeAlert(closeBtn) {
    $(closeBtn).parent().hide();
}

function prettyPrint(auction) {
    if (auction) {
        return 'U_' + auction.userName + ' Q_' + auction.quantity + ' MV_' + auction.minValue +
            ' WV_' + auction.winningBid + ' WU_' + auction.winningBidder;
    } else {
        return 'none';
    }
}

function showTimeRunningLow(timeLeft) {
    var value = timeLeft ? Math.round(255 - timeLeft * 10) : 0;
    $('#timeRemaining').css('color', 'rgb(' + value + ',0,0)');
}