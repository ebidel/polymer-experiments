describe('stock-ticker-test', function() {
	
	var stockticker;
	var to_check;
	var id_name = 'my-stock-ticker';

	beforeAll(function() {
		stockticker = document.createElement('stock-ticker');
		stockticker.setAttribute('symbols', '["GOOG", "GOOGL"]');
		stockticker.setAttribute('id', id_name);
		document.body.appendChild(stockticker);

		// get element now and use it throughout test case
		to_check = document.getElementById(id_name);
	});

	afterAll(function() {
		let to_remove = document.getElementById(id_name);
		document.body.removeChild(to_remove);
	});

	it('should have such element in DOM', function() {
		expect(to_check).not.toBe(null);
	});

	it('should has proper value as set on \'symbols\' attribute', function() {
		expect(to_check.getAttribute('symbols')).toEqual("[\"GOOG\", \"GOOGL\"]");
	});

	it('should has existing functions as seen in code', function() {
		expect(typeof(to_check._computePoints) === 'function').toBeTruthy();
		expect(typeof(to_check._computeColor) === 'function').toBeTruthy();
		expect(typeof(to_check._computeArrow) === 'function').toBeTruthy();
		expect(typeof(to_check._computeHref) === 'function').toBeTruthy();
		expect(typeof(to_check._computePercent) === 'function').toBeTruthy();
		expect(typeof(to_check._updateQuotes) === 'function').toBeTruthy();
		expect(typeof(to_check.beforeRegister) === 'function').toBeTruthy();
	});

	it('should validate result from _computeColor()', function() {
		expect(to_check._computeColor(19)).toEqual("color:#4CAF50");
		expect(to_check._computeColor(-19)).toEqual("color:#F44336");
	});

	it('should validate result from _computeArrow()', function() {
		expect(to_check._computeArrow(10)).toEqual("▲");
		expect(to_check._computeArrow(-10)).toEqual("▼");
	});

	it('shoud validate result from _computeHref()', function() {
		expect(to_check._computeHref(to_check.getAttribute('id'))).toEqual("https://www.google.com/finance?q=" + id_name);
	});

	it('should validate result from _computePoints()', function() {
		expect(to_check._computePoints(-100.23)).toEqual(100.23);
		expect(to_check._computePoints(100.23)).toEqual(100.23);
	});

	it('should validate result from _computePercent()', function() {
		expect(to_check._computePercent("0.07")).toEqual(".07");
	});
});