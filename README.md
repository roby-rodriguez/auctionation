AuctioNation is a real-time simple auction app written in Node.js.

##### The following frameworks/tools have been used to develop this app:

* MongoDB
* Express.js
* Angular.js
* Node.js
* Socket.io (websockets)
* Bootstrap
* jQuery
* lessCSS
* Gulp

##### The application satisfies the following functional requirements:
***

1. When the player user first reaches the website, a form is displayed, containing a single input field (the user name), and an “Enter” button.

2. If this is a new user, it shall be immediately created and logged in. A new player starts with a balance of 1000 coins, and at the inventory: 30 breads, 18 carrots and 1 diamond.

3. If this is an existing user, it shall be logged in. If this same user is considered to be currently logged in at another browser or tab, it must be immediately logged out from that other instance.

4. We do not need password authentication now. (At this stage, we are not worried about securing a user account; the focus is in the real-time auction system.)

5. Once logged in, the user shall see at least three widgets: “Player Stats”, “Inventory” and “Current Auction” (check sample sketch image below).

6. The “Player Stats” widget must show the logged in user name and the current amount of coins, as well as a “Leave” (logout) link or button.

7. The “Inventory” widget must show a list of the user’s items. For each item, display the item image (an icon or thumbnail), the item name (can be a legend or a tooltip on hover of the image), the item quantity (integer amount), and a link or button to start an auction for that item.

8. When an item’s start auction button is clicked, a dialog form appears. There are two inputs: quantity and minimum bid value. And two buttons: “Start Auction” and “Cancel”. The quantity can’t be greater than the available item quantity.

9. When the “Start Auction” button is clicked, if there is currently another auction in progress, either an error message should be returned (fine for a 1st version of the app) or the auction should be queued to start after the completion of current auction (preferable). In all cases, the user shall be notified about success or failure of the operation.

10. The “Current Auction” widget must show a message saying “No auction at the moment.” if there is no auction currently in progress. Otherwise, it must show the seller name, the item name and image, as well as the quantity being sold.
It must also show the “Time left” (in seconds) to end the auction. All auctions start with a duration of 90 seconds. When a bid is made and there are less than 10 seconds remaining, the time left shall raise up again to 10 seconds (ie, it will pass a minimum of 10 seconds after the last bid until an auction is closed).
It must also show the “Minimum bid:”, with the value specified the seller. After the first bid is placed, this should change to “Winning bid:”, with the value specified by the bidder.
Finally, an input for placing “Your bid:” value, and a button to “Place bid”. The bid value must always be higher than the current winning bid, or at least equal to the minimum bid. A notification about the success or failure of the operation must be provided after a bid submission.

11. When an auction reaches its end (no time left), the results (winning bid and the name of the user who placed it) are shown for a while (10 seconds), before a new auction is allowed to begin.
Also, both the seller and the buyer balances of coins, and their inventories, are properly updated according to the result of the auction.

