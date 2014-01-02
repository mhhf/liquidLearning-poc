// TODO: #feedback: Implement conversation between User and Andmin
// 	User: 
// 	 can submit a feedback from a page out of the frontend
//   can view the submited feedbacks as a conversation between him and the admin (/conversations)
//   can talk via a conversation with the admin in the conversation subpanel
//
//  Admin:
//   can view submitetd feedbacks grouped by the users
//   can view new feedbacks, -> go to conversation
//   can replay to a submited feedback
//   can view a conversation between user and admin
//   email is sent when a user submit a feedback or replay's on a message



Session.set('replayFeedback',null);

Template.feedback.feedback = function(){
	return Feedback.find({},{sort: {date:-1}});	
}

Template.feedback.getDate = function(){
  return timeSince(this.date);
	// return buildFullDate(this.date,true);
}

Template.feedback.replay = function(){
	return Session.get('replayFeedback') == this._id;
}

Template.feedback.comments = function(){
  return comments(this.comments && this.comments.length);
}

Template.feedback.getIcon = function(){
  // poll, discussion, task
  // icon-check, icon-bar-chart
  return 'icon-comments';
}


Template.feedback.events = {
	"click .replayBtn": function(e,t){
		e.preventDefault();
		Session.set('replayFeedback',this._id);
	},
	"click button[name=submit]" : function(){
		Session.set('replayFeedback',null);
	},
  "click .star": function(){
    Meteor.call('updateFeedbackStar', this._id );
  }
}

comments = function( num ){
  if( !num || num == 0 )
    return "no comments";
  if( num == 1 )
    return "1 comment";
  return num+" comments";
}


// [TODO] - export to helper
timeSince = function(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
