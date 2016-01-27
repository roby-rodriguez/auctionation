/**
 * Commons & util
 */
function createAlert(id) {
    var id = id ? '#' + id : "#alertMessage";
    $(id).show();
    $(id).delay(2000).fadeOut("slow", function () { $(this).hide(); });
}

function prettyPrint(auction) {
    if (auction) {
        return 'U_' + auction.userName + ' Q_' + auction.quantity + ' MV_' + auction.minValue
            + ' WV_' + auction.winningBid + ' WU_' + auction.winningBidder;
    } else
        return 'none';
}