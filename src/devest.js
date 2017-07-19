$(function() {
	var taxRate = 0.7;
	var robuxToUsdRate = 0.0035;
	var decimalPlaces = 2;

	function formatNumber(number)
	{
		number = number.toFixed(2) + '';
		var x = number.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
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
		var usdMade = 0;

		if (data.PriceInRobux == null || data.PriceInRobux == 0) {
			if (!isGame) return;
		} else {
			usdMade = taxRate * robuxToUsdRate * data.PriceInRobux * data.Sales;
		}

		var gamePasses = isGame ? $('.gear-passes-asset') : [];

		if (gamePasses.length > 0) {
			var completed = 0;
			var total = gamePasses.length;

			for (var i = 0; i < gamePasses.length; i++) {
				var passMatch = gamePasses[i].href.match(/library\/(\d+)/);
				if (!passMatch) {
					--total;
					continue;
				}

				var passId = passMatch[1];

				$.ajax({
					url: 'https://api.roblox.com/Marketplace/ProductInfo',
					data: { assetId: passId },
					dataType: 'json',
				}).done((data2) => {
					if (data2.PriceInRobux != null && data2.PriceInRobux > 0) usdMade += taxRate * robuxToUsdRate * data2.PriceInRobux * data2.Sales;
					if (++completed == total) {
						var usdString = `$${formatNumber(usdMade)}`;
						var $gameTitleContainer = $('.game-title-container');
						$gameTitleContainer.append(`<span class=text-label>Earnings: ${usdString}</span>`);
					}
				});
			}
		} else {
			var usdString = `$${formatNumber(usdMade)}`;

			if (isGame) {
				var $gameTitleContainer = $('.game-title-container');
				$gameTitleContainer.append(`<span class=text-label>Earnings: ${usdString}</span>`);
			} else {
				var $priceContainerText = $('.price-container-text');
				$priceContainerText.append("<div class='field-label text-label'>Earnings</div>");
				$priceContainerText.append(`<span>${usdString}</span>`);
			}
		}
	});
});
