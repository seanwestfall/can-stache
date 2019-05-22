var stache = require("can-stache");

var removePlaceholderNodes = function(node){
	var children = Array.from(node.childNodes);
	for(var i = 0; i < children.length; i++) {
		if(children[i].nodeType === Node.COMMENT_NODE) {
			node.removeChild(children[i])
		} else if(children[i].nodeType === Node.ELEMENT_NODE) {
			createHelpers.removePlaceholderNodes(children[i]);
		}
	}
	return node;
};

var createHelpers = function(doc) {
	doc = doc || document;
	return {
		cleanHTMLTextForIE: function(html){  // jshint ignore:line
			return html.replace(/ stache_0\.\d+="[^"]+"/g,"").replace(/<(\/?[-A-Za-z0-9_]+)/g, function(whole, tagName){
				return "<"+tagName.toLowerCase();
			}).replace(/\r?\n/g,"");
		},
		getText: function(template, data, options){
			var div = document.createElement("div");
			div.appendChild( stache(template)(data, options) );
			return this.cleanHTMLTextForIE( div.innerHTML );
		},
		innerHTML: function(node){
			return "innerHTML" in node ?
				node.innerHTML :
				undefined;
		},
		removePlaceholderNodes: removePlaceholderNodes
	};
};

createHelpers.removePlaceholderNodes = removePlaceholderNodes;

module.exports = createHelpers;
