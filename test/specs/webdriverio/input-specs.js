describe('Input get', function() {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/get.html")
	})

	it("should get value", function*() {
		var content = yield glance.get("input-1")
		content.should.equal('value 1');
	});

	it("should get text", function*() {
		var content = yield glance.get("label-1")
		content.should.equal('label 1');
	});

	it("should get selected text by default", function*() {
		var content = yield glance.get("select-1")
		content.should.equal('text2');
	});

	it("should get selected value", function*() {
		var content = yield glance.get("select-1>value")
		content.should.equal('value2');
	});

	it("should get select option text by default", function*() {
		var content = yield glance.get("select-1>text1")
		content.should.equal('text1');
	});

	it("should get select option value", function*() {
		var content = yield glance.get("select-1>text1>value")
		content.should.equal('value1');
	});

	it("should get using a custom label", function*() {
		glance.addCustomGet(function(selector){
			return glance.get(selector + ">special-widget>span")
		}, "complex-control-1");

		var content = yield glance.get("special-container>complex-control-1")
		content.should.equal('special value 1');
	});
});

describe('Input set', function() {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/set.html")
	})

	it("should get value", function*() {
		yield glance.set("input-1", "value 1")
		var content = yield glance.get("input-1")
		content.should.equal('value 1');
	});

	it("should get text", function*() {
		yield glance.set("label-1", "label 1").catch(function(err) {
			err.message.should.equal("label-1 text not changable");
		})
	});

	it("should get selected text by default", function*() {
		yield glance.set("select-1", "text2");
		var content = yield glance.get("select-1")
		content.should.equal('text2');
	});

	it("should get selected value", function*() {
		yield glance.set("select-1>value", "value3")
		var content = yield glance.get("select-1>value")
		content.should.equal('value3');
	});

	it("should set using a custom label", function*() {
		glance.addCustomSet(function(selector){
			return glance.set(selector + ">special-widget>input", "special value 1")
		}, "complex-control-1");

		yield glance.set("special-container>complex-control-1", "special value 1")
		var content = yield glance.get("special-container>special-widget>input");
		content.should.equal('special value 1');
	});
});
