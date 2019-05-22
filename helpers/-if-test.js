var QUnit = require("steal-qunit");
var stache = require("can-stache");
var define = require("can-define");
var DefineMap = require("can-define/map/map");
var SimpleMap = require("can-simple-map");
var DefineList = require("can-define/list/list");
var SimpleObservable = require("can-simple-observable");

var stacheTestHelpers = require("../test/helpers")(document);

QUnit.module("can-stache if helper");



QUnit.test("Stache with boolean property with {{#if}}", function() {
	var nailedIt = 'Nailed it';
	var Example = define.Constructor({
		name: {
			value: nailedIt
		}
	});

	var NestedMap = define.Constructor({
		isEnabled: {
			value: true
		},
		test: {
			Value: Example
		},
		examples: {
			type: {
				one: {
					Value: Example
				},
				two: {
					type: {
						deep: {
							Value: Example
						}
					},
					Value: Object
				}
			},
			Value: Object
		}
	});

	var nested = new NestedMap();
	var template = stache('{{#if isEnabled}}Enabled{{/if}}');
	var frag = stacheTestHelpers.removePlaceholderNodes( template(nested) );

	equal(frag.firstChild.nodeValue, 'Enabled');
});

QUnit.test("#each with #if directly nested (#750)", function(){
	var template = stache("<ul>{{#each list}} {{#if visible}}<li>{{name}}</li>{{/if}} {{/each}}</ul>");
	var data = new SimpleMap(
		{
			list: new DefineList([
				{
					name: 'first',
					visible: true
				},
				{
					name: 'second',
					visible: false
				},
				{
					name: 'third',
					visible: true
				}
			])
		});

	var frag = template(data);

	data.get('list').pop();

	equal(frag.firstChild.getElementsByTagName('li').length, 1, "only first should be visible");

});

QUnit.test("call expression with #if", function(){

	var truthy = new SimpleObservable(true);
	var template = stache("{{#if(truthy)}}true{{else}}false{{/if}}");
	var frag = template({truthy: truthy});

	equal( frag.firstChild.nodeValue, "true", "set to true");

	truthy.set(false);

	equal( frag.firstChild.nodeValue, "false", "set to false");
});

test("#if works with call expressions", function(){
	var template = stache("{{#if(foo)}}foo{{else}}bar{{/if}}");
	var map = new DefineMap({
		foo: true
	});
	var div = document.createElement("div");
	var frag = template(map);

	div.appendChild(frag);
	QUnit.equal(div.innerHTML, "foo");
	map.foo = false;
	QUnit.equal(div.innerHTML, "bar");
});


QUnit.test("Inverse {{if}} doesn't render truthy section when value is truthy", function(){
	var div = document.createElement("div");
	var view = stache("{{^if(isTrue())}}did not work{{/if}}");
	var frag = view({
		isTrue: function() { return true; }
	});
	div.appendChild(frag);
	equal(div.innerHTML, "", "No textnode rendered");
});

QUnit.test("#if should not re-render children", function(){
	var count = 0;
	var view = stache("{{#if(person.name)}} {{increment()}} {{/if}}");
	var map = new DefineMap({
		person: {name: "Matthew"}
	});
	map.set("increment", function(){
		count++;
	});
	view(map);

	map.person.name = "Kevin";
	map.person.name = "Justin";

	QUnit.equal(count, 1, "count should be called only once");
});

test("Handlebars helper: if/else", function () {
	var expected;
	var t = {
		template: "{{#if name}}{{name}}{{/if}}{{#if missing}} is missing!{{/if}}",
		expected: "Andy",
		data: {
			name: 'Andy',
			missing: undefined
		}
	};

	expected = t.expected.replace(/&quot;/g, '&#34;')
		.replace(/\r\n/g, '\n');
	deepEqual(stacheTestHelpers.getText(t.template,t.data), expected);

	t.data.missing = null;
	expected = t.expected.replace(/&quot;/g, '&#34;')
		.replace(/\r\n/g, '\n');
	deepEqual(stacheTestHelpers.getText(t.template,t.data), expected);
});
