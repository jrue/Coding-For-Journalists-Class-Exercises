	jQuery(document).ready(function($) {

	var Person = function(){

		this.gender      = "";
		this.fullName    = "";
		this.age         = 0;
		this.occupation  = "";
		this.bio         = ""; 

		var container = $('<div />').addClass('person');

		//this.image = 'http://media.journalism.berkeley.edu/projects/2013/20130813_noun_face/noun_project_17363.svg';
		//$('<img />').attr('src', this.image).appendTo(container);

		this.draw = function(){
			if(this.fullName != ""){
				$('<h2 />').css({'text-align':'center'}).text(this.fullName).appendTo(container);
			}

			if(this.gender == "female"){
				$('<img />')
					.attr('src', 'http://media.journalism.berkeley.edu/projects/2013/20130813_noun_face/happiness_female.svg')
					.attr('alt', 'female icon')
					.attr('width', '100')
					.attr('height', '100')
					.appendTo(container);
			} else {
				$('<img />')
					.attr('src', 'http://media.journalism.berkeley.edu/projects/2013/20130813_noun_face/noun_project_17363.svg')
					.attr('alt', 'male icon')
					.attr('width', '100')
					.attr('height', '100')
					.appendTo(container);
			}
			var textinfo = $('<div />').addClass('description');

			if(this.age > 0){
				textinfo.append($('<p />').html("<strong>Age:</strong> " + this.age));
			}
			if(this.occupation != ""){
				textinfo.append($('<p />').html("<strong>Occupation:</strong> " + this.occupation));
			}
			if(this.bio != ""){
				textinfo.append($('<p />').html(this.bio));
			}
			container.append(textinfo);
			container.appendTo('#people');
		}
		
	}
});