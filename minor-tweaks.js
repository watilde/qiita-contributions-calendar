var dom = $('.userPage_organization');
var li = $('<li>');
var hr = $('<hr>');
hr.css('margin-top', '10px');
hr.css('margin-bottom', '10px');
li.append(dom);
$('.userPage_userAttributes').append(hr);
$('.userPage_userAttributes').append(li);

var dom = $('.userPage_contributionUnit');
dom.text('ストックされた数 ');
$('.userPage_contributionCount').before(dom);
$('.userPage_organization .userPage_userFollowings_heading').text('所属している組織');
$('.userPage_userAttributes_element_body .label-success').text('スタッフ')
