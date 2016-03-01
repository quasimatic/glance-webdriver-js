describe('Input get', function() {
	before(function*() {
		glance = new Glance(browser);
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
		var content = yield glance.get("select-1:value")
		content.should.equal('value2');
	});

	it("should get select option text by default", function*() {
		var content = yield glance.get("select-1>text1")
		content.should.equal('text1');
	});

	it("should get select option value", function*() {
		var content = yield glance.get("select-1>text1:value")
		content.should.equal('value1');
	});

	it("should get using a custom label", function*() {
		glance.addGetter("complex-control-1", function(selector) {
			return this.get(selector + ">special-widget>span")
		});

		var content = yield glance.get("wrapper-1>special-container:complex-control-1")
		content.should.equal('special value 1');
	});
});

describe('Input set', function() {
	before(function*() {
		glance = new Glance(browser);
		yield glance.url("file:///" + __dirname + "/examples/set.html")
	})

	it("should set value", function*() {
		yield glance.set("input-1", "value 1")
		var content = yield glance.get("input-1")
		content.should.equal('value 1');
	});

	it.skip("should not set text", function*() {
		yield glance.set("label-1", "label 1").catch(function(err) {
			err.message.should.equal("label-1 text not changable");
		})
	});

	it("should set selected text by default", function*() {
		yield glance.set("select-1", "text2");
		var content = yield glance.get("select-1")
		content.should.equal('text2');
	});

	it("should set selected value", function*() {
		yield glance.set("select-1:value", "value3")
		var content = yield glance.get("select-1:value")
		content.should.equal('value3');
	});

	it("should set using a custom label", function*() {
		glance.addSetter("complex-control-1", function(selector, value) {
			return this.set(selector + ">wrapper-1>special-widget>input", "special value 1")
		});

		yield glance.set("special-container:complex-control-1", "special value 1");
		var content = yield glance.get("special-container>special-widget>input");
		content.should.equal('special value 1');
	});


	it("should set a non element custom label", function*() {
		glance.addSetter("non-element", function(selector, value) {
			return this.set("wrapper-1>special-widget-2>input", value)
		});

		yield glance.set("non-element", "special value 2");
		var content = yield glance.get("special-container>special-widget-2>input");
		content.should.equal('special value 2');
	});

	it("should reject if it can't set a readonly element", function(done) {
		this.timeout(30000)

		glance.set("readonly-element", "value 1").catch(function(err) {
			try {
				err.message.should.equal("No setter found for: readonly-element")
				done();
			}
			catch (err) {
				done(err)
			}
		});
	});


	it("should reject if it can't find a setter", function(done) {
		this.timeout(30000)

		glance.set("non-existing", "value 1").catch(function(err) {
			try {
				err.message.should.equal("Can't set because Element not found: non-existing")
				done();
			}
			catch (err) {
				done(err)
			}
		});
	});

	it("should reject if it finds duplicates", function(done) {
		this.timeout(30000)
		glance.set("duplicate-element", "value 1").catch(function(err) {
			try {
				err.message.should.equal("Can't set because Found 2 duplicates for: duplicate-element")
				done();
			}
			catch (err) {
				done(err)
			}
		});
	});
});