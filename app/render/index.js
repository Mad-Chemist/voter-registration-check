var LS_VOTER = 'voter';
var $ = require('jquery');
var electron = require('electron');

$(document).ready(function() {
	function displayError(event, message) {
		message = message || "There was an error";
		console.error(message);
		$('form').removeClass('disabled')
			.show();

		$('form').find('.error')
			.text(message);
	}

	function prePopuplate() {
		if (localStorage[LS_VOTER].length > 0) {
			var dataObj = JSON.parse(localStorage[LS_VOTER]);
			Object.keys(dataObj).forEach(function(key) {
				if ($('#' + key)) {
					$('#' + key).val(dataObj[key]);
				}
			});
		}
	}

	function formValidation() {
		var passes = true;
		$('form').find('select, input').each(function() {
			$(this).css('border', '');
			if ($(this).val() === "" || $(this).is('#birthdate') && $(this).val().split('/').length !== 3) {
				passes = false
				$(this).css('border', '1px red solid');
			}
		});
		return passes;
	}

	function extractFormObject() {
		var data = {};
		
		$('form').find('select, input').each(function() {
			data[$(this).attr('id')] = $(this).val();
		});

		localStorage[LS_VOTER] = JSON.stringify(data);
		return data;
	}

	function displayVoterStatus(event, status) {
		var formData = extractFormObject();

		var $container = $('.container-fluid');
		var message = status ? "registered" : "not registered";
		var className = status ? "success" : "error";

		var template = `
			<div id="resolution" class="middled panel text-center panel-${className}">
				<div class="panel-heading">
					<h3 class="panel-title">${formData.party} registration status</h3>
				</div>
				<div class="panel-body">
					${formData.firstName} ${formData.lastName} is ${message} ${formData.party}.
				</div>
			</div>
		`;
		
		$container.find('form').hide();
		$container.find('#resolution').remove();
		$container.append(template);
	}

	$('form').on('submit', function(event) {
		event.preventDefault();
		if (formValidation() === true) {
			$(':focus').blur();
			$('form').addClass('disabled');
			electron.ipcRenderer.send('save-voter', extractFormObject());
		}
	});

	electron.ipcRenderer.on('display-error', displayError);
	electron.ipcRenderer.on('display-status', displayVoterStatus);
	prePopuplate();
});