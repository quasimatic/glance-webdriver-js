import {createGlance} from "../test-helper"
let glance;

describe('Nth', function () {
	before(function() {
		glance = createGlance();
		return glance.url("file:///" + __dirname + "/examples/nth.html")
	});

	after(function(){
		glance.end();
	});

	it("should get the nth item", function() {
		return glance.get("box1>Item A#2:html").should.eventually.match(/<div.*class="item-2".*>Item A<\/div>/);
	});

	it("should get the nth container for an item", function() {
		return glance.get("box2>inner-box#2>Item A:html").should.eventually.match(/<div.*class="item-2".*>Item A<\/div>/);
	});
});