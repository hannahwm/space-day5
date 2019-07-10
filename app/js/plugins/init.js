var $ = jQuery;

var pTags = $(document).find("p");
  for (var i=0; i<pTags.length; i++) {
	var elm = pTags[i];

	if ($(elm).html().replace(/\s|&nbsp;/g, '').length == 0) {
	  $(elm).remove();
	}
}
