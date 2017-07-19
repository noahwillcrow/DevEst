$(function() {
	var taxRate = 0.7;
	var robuxToUsdRate = 0.0035;
	var decimalPlaces = 2;

	function formatNumber(number)
	{
	    number = number.toFixed(2) + '';
	    x = number.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    return x1 + x2;
	}

	var $itemContainer = $("#item-container");
	var $gameDetails = $("#game-detail-page");

	var isGame = false;

	var assetID = 0;

	if ($itemContainer.length > 0) {
		assetID = $itemContainer.data("item-id");
	}
	if ($gameDetails.length > 0) {
		assetID = $gameDetails.data("place-id");
		isGame = true;
	}

	if (assetID == 0) {
		return;
	}

	$.ajax({
		url: "https://api.roblox.com/Marketplace/ProductInfo",
		data: { assetId: assetID },
		dataType: "json"
	}).done(function(data) {
		if (data.PriceInRobux == 0 || data.PriceInRobux == null) {
			return;
		}

		var usdMade = taxRate * robuxToUsdRate * data.PriceInRobux * data.Sales;
		var usdString = "$" + formatNumber(usdMade);

		if (isGame) {
			var $gameTitleContainer = $(".game-title-container");
			$gameTitleContainer.append("<span class=text-label>Earnings: " + usdString + "</span>");
		}
		else {
			var $priceContainerText = $(".price-container-text");
			$priceContainerText.append("<div class='field-label text-label'>Earnings</div>");
			$priceContainerText.append("<span>" + usdString + "</span>");
		}
	});
});
