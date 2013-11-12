Template.editor.rendered = function(){
	// TODO #editor: allow to insert sync informations.
	
	editor = CodeMirror(this.find('#editor'),{
		value: "### asd\n* dasd\n* ist\n* test",
		mode:  "markdown",
		lineNumbers: true,
		extraKeys: {"Ctrl-J": "autocomplete"}
	});
	

};


Template.editor.events({
	"click button[name=play]" : function(){

		// Preprocess the text:
		// make an array of sentences
		// TODO write a jison compiler which extracts the presentation
		// and the text
		var s = editor.getValue().replace(/\r\n|\n\r|\r|\n/g, '').split('.');
		s = _.filter(s, function(str){
			return !!str && str != "";
		});
		s = _.map(s, function(str){
			return str+'.';
		});
		
		console.log(s);
		Session.set('text',s)
		Router.go('player');
	},
	"change select" : function(e,t){
		
		var val;
		switch(e.target.value) {
			case "0": // none
				val = '';
				break;
			case "1": // lsd
				val = 'LSD is the best known and most researched psychedelic.\nIt is the standard against which all other psychedelics are compared.\nIt is active at extremely low doses and is most commonly available on blotter or in liquid form.';
				break;
			default:
				val = '';
		}

		editor.setValue(val);
	}
});
