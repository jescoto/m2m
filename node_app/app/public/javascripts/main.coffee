do ->
	$=(val) ->
		document.querySelector val

	
	$('.input-file-button').addEventListener('click', (e)->
		$('#upload').click()
	)

	$('.simulate-file-input').addEventListener('focus', (e)->
		$('#upload').click()
	)

	$('#upload').addEventListener('change', (e)->
		$('.simulate-file-input').value = e.target.value
	)

	if $ '.msg'
		setTimeout ()->
			$('.msg').style.opacity = 0
			$('.msg').style.top = "-100px"
		, 2000
