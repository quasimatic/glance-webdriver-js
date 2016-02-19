describe.only("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal({
                containers: [
                    {
                        label: "label",
                        position: null,
                        "transform": null
                    }
                ]
            }
        );
    });

    it("should get index", function() {
        parser.parse("label#10").should.deep.equal({
            containers: [

                {
                    label: "label",
                    position: 10,
                    "transform": null
                }
            ]
        });
    });

    it("should escape index character", function() {
        parser.parse("label\\#10").should.deep.equal({
            containers: [
                {
                    "label": "label#10",
                    "position": null,
                    "transform": null
                }
            ]
        });
    });

    it("should escape the escape character", function() {
        parser.parse("label\\\\test").should.deep.equal({
            containers: [
                {
                    "label": "label\\test",
                    "position": null,
                    "transform": null
                }
            ]
        });
    });

    it("should support containers", function() {
        parser.parse("container>label").should.deep.equal({
            containers: [
                {
                    "label": "container",
                    "position": null,
                    "transform": null
                },
                {
                    "label": "label",
                    "position": null,
                    "transform": null
                }
            ]
        });
    })

    it("should support transforms", function() {
        parser.parse("label:text").should.deep.equal({
            containers: [
                {
                    "label": "label",
                    "position": null,
                    "transform": "text"
                }
            ]
        });
    })
});