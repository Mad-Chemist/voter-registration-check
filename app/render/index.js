var $ = require('jquery');
var electron = require('electron');
var LS_VOTER = "voter";

$(document).ready(function() {
	var form = {
		$el:$('form'),
		init: function() {
			var that = this;
			this.$el.on('submit', function(event) {
				event.preventDefault();
				if (that.validate() === true) {
					that.$el.find('.panel-body')
						.addClass('disabled')
						.find(':focus')
						.blur();

					electron.ipcRenderer.send('save-voter', that.extract());
				}
			});

			this.prePopuplate();
		},
		prePopuplate: function() {
			if (localStorage[LS_VOTER].length > 0) {
				var dataObj = JSON.parse(localStorage[LS_VOTER]);
				Object.keys(dataObj).forEach(function(key) {
					if ($('#' + key)) {
						$('#' + key).val(dataObj[key]);
					}
				});
			}
		},
		validate: function() {
			var passes = true;
			this.$el.find('select, input').each(function() {
				$(this).css('border', '');
				if ($(this).val() === "" || $(this).is('#birthdate') && $(this).val().split('/').length !== 3) {
					passes = false
					$(this).css('border', '1px red solid');
				}
			});
			return passes;
		},
		extract: function() {
			var data = {};
			
			this.$el.find('select, input').each(function() {
				data[$(this).attr('id')] = $(this).val();
			});

			localStorage[LS_VOTER] = JSON.stringify(data);
			return data;
		},

		displayError: function(event, message) {
			message = message || "There was an error";
			console.error(message);
			$('form').find('.panel-body')
				.removeClass('disabled')
				.show();

			$('form').find('.error')
				.text(message);

			return message;
		}
	};

	$('#close-BTN').click(function(event) {
		electron.ipcRenderer.send('close-window', 'foo');
	})

	function displayVoterStatus(event, status) {
		var formData = form.extract();

		var $container = $('.container-fluid');
		var message = status ? "registered" : "not registered";
		var className = status ? "success" : "error";

		var template = `
			<div id="resolution" class="text-center bg-${className}">
					<p>${formData.firstName} ${formData.lastName} is ${message} ${formData.party}.</p>
			</div>
		`;
		
		form.$el.find('.panel-body').hide();
		form.$el.find('#resolution').remove();
		form.$el.append(template);
	}

	electron.ipcRenderer.on('display-error', form.displayError);
	electron.ipcRenderer.on('display-status', displayVoterStatus);
	
	form.init();
});