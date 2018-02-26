addComment = function(id, msg) {
	var $newComment = $('<div class="comment-item flash"></div>');
	var $p = $('<p></p>');
	$newComment.html('<b>' + id + '</b>님의 말씀 :<br>');
	$p.html(msg);
	$('#fullPage');
	
	
	$p.appendTo($newComment);
	
	$('.comment').prepend($newComment);
	
	$('.flash').animate({backgroundColor: 'white'}, 2000, function() {
		$('.flash').removeClass('flash');	
	});
	
};