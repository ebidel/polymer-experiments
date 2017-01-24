describe('stock-ticker-raw-test', function() {
	
	let stockticker;
	let to_check;
	let id_name = 'my-stock-tickers';

	beforeAll(function() {
		stockticker = document.createElement('stock-ticker-raw');
		stockticker.setAttribute('symbols', '[".DJI", "NDX"]');
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
		expect(to_check.getAttribute('symbols')).toEqual("[\".DJI\", \"NDX\"]");
	});

	it('should validate class names', function() {
		let child = Object.getPrototypeOf(to_check.constructor);
		let parent = Object.getPrototypeOf(child);

		expect(child.name).toEqual("StockTickerRaw");
		expect(parent.name).toEqual("HTMLElement");
	});

	it('should has existing functions as seen in code', function() {
		expect(typeof(to_check.createdCallback) === 'function').toBeTruthy();
		expect('symbols' in to_check).toBeTruthy();
		expect(typeof(to_check.updateQuotes) === 'function').toBeTruthy();
	});
});