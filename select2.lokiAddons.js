/**
	Formatter of Select2 JS Plugin, this function will make a normal select become a select2 field that will receive information from server dynamically
	@param String selectElements -Jquery Selector that will be applied the select2 field
**/
var debugMode = false;
function buildSelect2(selectElements = ".select2-select", anonymousFunctionToBeExecuted = null){
	if(debugMode){
		var consoleGroupID = Math.random().toString(16).slice(2);
		console.group("Select2 Formatter "+consoleGroupID);
	}
	$(selectElements).each(function() {
		var thisObject = this;
		if($(thisObject).hasClass("select2-hidden-accessible") == false){
			if($(thisObject).data("disappear-search-bar") != "" && $(thisObject).data("disappear-search-bar") != null && $(thisObject).data("disappear-search-bar") == true){
				var dropdownExtraClasses = "no-search";
			}else{
				var dropdownExtraClasses = null;
			}
			if($(thisObject).data("dropdown-auto-width") != "" && $(thisObject).data("dropdown-auto-width") != null && $(thisObject).data("dropdown-auto-width") == true){
				var dropdownAutoWidth = $(thisObject).data("dropdown-auto-width");
			}else{
				var dropdownAutoWidth = false;
			}
			if($(thisObject).attr("multiple") == "multiple"){
				var multiple = true;
			}else{
				var multiple = false;
			}
			if($(thisObject).data("execute-event-after-interaction") != ""){
				executeEventAfterInteraction = $(thisObject).data("execute-event-after-interaction");
			}else{
				executeEventAfterInteraction = true;
			}
			if($(thisObject).data("disable-search-bar-after-deselection") == true){
				var disableSearchBarAfterDeselection = true;
			}else{
				var disableSearchBarAfterDeselection = false;
			}

			if($(thisObject).data("create-absolute-div") != "" && $(thisObject).data("create-absolute-div") != undefined){
				$(thisObject).on("select2:open", function(){
					$(".colaSelect2[data-copied-from='"+$(thisObject).data("create-absolute-div")+"']").remove();
					var showUpOnScreen = false;
					while(!showUpOnScreen){
						$(".select2-container--open").each(function(){
							if($(this).css("position") == 'absolute'){
								var temp = parseFloat($(this).css("left").replace("px", ""));
								if(temp != undefined && temp > 0 && temp != "NaN"){
									showUpOnScreen = true;
								}
							}
						});
					}
					var top = "0px";
					var left = "0px";
					var width = 0;
					var height = 0;
					$(".select2-container--open").each(function(){
						if($(this).css("position") == 'absolute'){
							top = $(this).css("top").replace("px", "");
							left = $(this).css("left").replace("px", "");
							width = $(this).find(".select2-dropdown--below, .select2-dropdown--above").width();
							height = $(this).find(".select2-dropdown--below, .select2-dropdown--above").height();
						}
					});
					top = parseFloat(top) * 0.95;
					left = parseFloat(left) + parseFloat(width) + 5;
					var html =
					"<fieldset data-copied-from='"+$(thisObject).data("create-absolute-div")+"' class='position-absolute bg-white colaSelect2 border border-warning rounded' style='top:"+top+"px; left:"+left+"px'>"+
						"<legend class='bg-warning text-dark'>Minha Cola</legend>"+
						"<div style='width:"+width+"px; height: "+height+"px'>"+
							$($(thisObject).data("create-absolute-div")).html()+
						"</div>"+
					"</fieldset>";
					$("body").append(html);
				});
				$(thisObject).on("select2:close", function(){
					$(".colaSelect2[data-copied-from='"+$(thisObject).data("create-absolute-div")+"']").remove();
				});
			}
			
			var placeholder = "";
			if($(thisObject).data("placeholder") != "" && $(thisObject).data("placeholder") != undefined){
				placeholder = $(thisObject).data("placeholder");
			}else{
				if($(thisObject).find("option[value='']").length > 0){
					placeholder = $(thisObject).find("option[value='']").html();
				}else{
					if((thisObject).find("option[disabled]").length > 0){
						placeholder = $(thisObject).find("option[disabled]").html();
					}else{
						placeholder = "Select an Item";
					}
				}
			}
			
			/**
				If there is not an data-target named "data-ajax-link", then the object will be a normal select2 field
			**/
			if($(thisObject).data("ajax-link") == undefined){
				var dataPreInformed = null;
				if($(thisObject).data("pre-informed") != ""){
					dataPreInformed = $(thisObject).data("pre-informed");
				}
				$(thisObject).select2({
					theme: "bootstrap",
					language: "pt-BR",
					multiple: multiple,
					executeEventAfterInteraction: executeEventAfterInteraction,
					placeholder: placeholder,
					dropdownCssClass : dropdownExtraClasses,
					data: dataPreInformed,
					selectOnClose: false,
					dropdownAutoWidth : dropdownAutoWidth,
					disableSearchBarAfterDeselection: disableSearchBarAfterDeselection,
					escapeMarkup: function(markup) {
						return markup;
					},
					language: {
						searching: function() {
							return "Searching";
						}
					},
					templateResult: function(data) {
						if (data.loading){
							return "Loading...";
						}
						if(data.html != null && data.html != ""){
							return data.html;
						}else{
							return data.text;
						}
					},
					templateSelection: function(data) {
						if(data.extraData != null){
							$.each(data.extraData, function(index, value) {
								$(thisObject).data(index, value);
							});
						}
						if(data.html != null && data.html != ""){
							return data.html;
						}else{
							return data.text;
						}
					},
					allowClear: ($(thisObject).data("allow-clear") != undefined ? $(thisObject).data("allow-clear") : true)
				}).on("select2:open", function() {
					if($(thisObject).data("force-position") != undefined){
						var objetoSpanSelect2 = $($(thisObject).data("select2").$dropdown[0]).find(".select2-dropdown");
						switch($(thisObject).data("force-position")){
							case "above":
								if($(objetoSpanSelect2).hasClass(".select2-dropdown--above") != true){
									$(objetoSpanSelect2).removeClass("select2-dropdown--below");
									$(objetoSpanSelect2).addClass("select2-dropdown--above");
								}
							break;
							case "below":
								if($(objetoSpanSelect2).hasClass(".select2-dropdown--below") != true){
									$(objetoSpanSelect2).removeClass("select2-dropdown--above");
									$(objetoSpanSelect2).addClass("select2-dropdown--below");
								}
							break;
						}
					}
				});
				if($(thisObject).data("classes") != "" && $(thisObject).data("classes") != null){
					$(thisObject).nextAll('.select2').addClass($(thisObject).data("classes"));
					$(thisObject).nextAll('.select2-container--bootstrap').find('.select2-selection--single').addClass($(thisObject).data("classes"));
				}
				if($(thisObject).data("small") != "" && $(thisObject).data("small") != null && $(thisObject).data("small") == true){
					$(thisObject).nextAll('.select2-container--bootstrap').find('.select2-selection--single').addClass("py-0 px-1");
				}
				
				if($(thisObject).data("value") != "" && $(thisObject).data("value") != null){
					$(thisObject).val($(thisObject).data("value"));
					$(thisObject).trigger('change');
				}
			/**
				If there is a data-ajax-link select and it has not been transform to select2, then it will become a select2 object
			**/
			}else if(!$(thisObject).hasClass("select2-hidden-accessible")){
				$(thisObject).select2({
					cache: false,
					dropdownCssClass : dropdownExtraClasses,
					theme: "bootstrap",
					multiple: multiple,
					language: "pt-BR",
					executeEventAfterInteraction: executeEventAfterInteraction,
					placeholder: placeholder,
					selectOnClose: false,
					dropdownAutoWidth : dropdownAutoWidth,
					disableSearchBarAfterDeselection: disableSearchBarAfterDeselection,
					escapeMarkup: function(markup) {
						return markup;
					},
					language: {
						searching: function() {
							return "Procurando";
						}
					},
					templateResult: function(data) {
						if (data.loading){
							return "Carregando...";
						}
						if(data.html != null && data.html != ""){
							return data.html;
						}else{
							return data.text;
						}
					},
					templateSelection: function(data) {
						if(data.extraData != null){
							$.each(data.extraData, function(index, value) {
								$(thisObject).data(index, value);
							});
						}
						if(debugMode){
							console.groupEnd();
						}
						if(data.html != null && data.html != ""){
							return data.html;
						}else{
							return data.text;
						}
					},
					allowClear: ($(thisObject).data("allow-clear") != undefined ? $(thisObject).data("allow-clear") : true),
					ajax: {
						delay: 250,
						type: 'POST',
						url: function(obj){
							return $(thisObject).data("ajax-link");
						},
						data: function (params) {
							/**
								Add an additional parameter to AJAX
							**/
							var query = {
								search: params.term,
								page: params.page || 1
							}
							query[$(thisObject).data("name-parameter")] = true;
							if($(thisObject).data("extra-params") != null){
								try{
									$.each($(thisObject).data("extra-params"), function(key, val) {
										query[key] = val;
									});
								}catch(Error){
									console.error("Error while setting extra params", jsonError);
								}
							}
							// Query parameters will be ?search=[term]&page=[page]
							if(debugMode){
								console.groupEnd();
							}
							return query;
						},
						processResults: function (data, params) {
							if(debugMode){
								console.groupEnd();
							}
							return JSON.parse(data);
						}
					}
				}).on('select2:selecting', function(event){
					if($(thisObject).attr("multiple") != "multiple"){
						//remove the ajax requisition cache
						if(debugMode){
							console.debug('select2:selecting valor atual: ' + $(event.target).val());
						}
						$(thisObject).find('option').remove();
					}
					if(debugMode){
						console.groupEnd();
					}
				}).on("select2:open", function() {
					if($(thisObject).data("force-position") != undefined){
						var objetoSpanSelect2 = $($(thisObject).data("select2").$dropdown[0]).find(".select2-dropdown");
						switch($(thisObject).data("force-position")){
							case "above":
								if($(objetoSpanSelect2).hasClass(".select2-dropdown--above") != true){
									$(objetoSpanSelect2).removeClass("select2-dropdown--below");
									$(objetoSpanSelect2).addClass("select2-dropdown--above");
								}
							break;
							case "below":
								if($(objetoSpanSelect2).hasClass(".select2-dropdown--below") != true){
									$(objetoSpanSelect2).removeClass("select2-dropdown--above");
									$(objetoSpanSelect2).addClass("select2-dropdown--below");
								}
							break;
						}
					}
				});
				if($(thisObject).data("classes") != "" && $(thisObject).data("classes") != null){
					$(thisObject).nextAll('.select2').addClass($(thisObject).data("classes"));
					$(thisObject).nextAll('.select2-container--bootstrap').find('.select2-selection--single').addClass($(thisObject).data("classes"));
				}
				if($(thisObject).data("small") != "" && $(thisObject).data("small") != null && $(thisObject).data("small") == true){
					$(thisObject).nextAll('.select2-container--bootstrap').find('.select2-selection--single').addClass("py-0 px-1");
				}
				if($(thisObject).data("value") != "" && $(thisObject).data("value") != null){
					$(thisObject).data("force-wait", true);
					var query = {};
					query[$(thisObject).data("name-parameter")] = true;
					query["nomeDoInput"] = $(this).attr("name");

					if($(thisObject).data("extra-params") != null){
						try{
							$.each($(thisObject).data("extra-params"), function(key, val) {
								query[key] = val;
							});
						}catch(Error){
							console.error("Error while setting extra params", jsonError);
						}
					}

					query["specificData"] = $(thisObject).data("value");
					$(thisObject).find('option').remove();
					$.ajax({
						type: "POST",
						url: $(thisObject).data("ajax-link"),
						data: query,
						success: function(resposta) {
							if (resposta != null) {
								try{
									resposta = JSON.parse(resposta);
								}catch(jsonError){
									throw new Error("Erro na resposta do servidor 1: "+jsonError.message+"<br>Resposta:"+resposta);
								}
								if(resposta.id == undefined && Array.isArray(resposta) == true){
									var arrayDeDados = [];
									$.each(resposta, function(index, valorDaResposta){
										if(valorDaResposta.extraData != null){
											$.each(valorDaResposta.extraData, function(index, value) {
												$(thisObject).data(index, value);
											});
										}

										if(valorDaResposta.html != null){
											var display = valorDaResposta.html;
										}else{
											var display = valorDaResposta.text;
										}
										var newOption = new Option(display, valorDaResposta.id, false, false);
										$(thisObject).append(newOption).trigger('change');
										$(thisObject).append(newOption).trigger('change');
										arrayDeDados[index] = valorDaResposta.id;
									});
									$(thisObject).val(arrayDeDados).trigger('change');
									$(thisObject).trigger("change");
								}else{
									if(resposta.extraData != null){
										$.each(resposta.extraData, function(index, value) {
											$(thisObject).data(index, value);
										});
									}

									if(resposta.html != null){
										var display = resposta.html;
									}else{
										var display = resposta.text;
									}
									var newOption = new Option(display, resposta.id, false, false);
									$(thisObject).append(newOption).trigger('change');
									$(thisObject).val(resposta.id);
									$(thisObject).append(newOption).trigger('change');
								}
							} else {
								throw new Error("Fail to compute the server response");
							}
							$(thisObject).data("force-wait", false);
							if(debugMode){
								console.groupEnd();
							}
						},
						error: function (request, status, error) {
							console.error("Fail to get server request", request, status, error);
						}
					});
				}
			}
		}
	});
	if(anonymousFunctionToBeExecuted != null){
		anonymousFunctionToBeExecuted();
	}
	if(debugMode){
		console.groupEnd();
	}
}

/**
	Function for setting data at the select2 field
	@param DOMObject(Select) thisObject -Select2 object or selector that will receive the custom value
	@param String specificData -Data to be setted that will be search in the AJAX request and set to the select2 object
**/
function setDataForSelect2(thisObject, specificData){
	if(debugMode){
		var consoleGroupID = Math.random().toString(16).slice(2);
		console.group("Setting data for select2 "+consoleGroupID);
	}
	var query = {};
	query[$(thisObject).data("name-parameter")] = true;
	query["nomeDoInput"] = $(thisObject).attr("name");

	if($(thisObject).data("extra-params") != null){
		try{
			$.each($(thisObject).data("extra-params"), function(key, val) {
				query[key] = val;
			});
		}catch(Error){
			console.error("Error while trying to obtain extra params", jsonError);
		}
	}

	query["specificData"] = specificData;
	$.ajax({
		type: "POST",
		url: $(thisObject).data("ajax-link"),
		data: query,
		success: function(resposta) {
			if(debugMode){
				console.group("Setting data for select2 - AJAX CALL "+consoleGroupID);
			}
			try{
				if (resposta != null) {
					try{
						resposta = JSON.parse(resposta);
					}catch(jsonError){
						throw new Error("Fail to compute the JSON server response "+jsonError.message+"<br>Resposta:"+resposta);
					}
					if(resposta.extraData != null){
						$.each(resposta.extraData, function(index, value) {
							$(thisObject).data(index, value);
						});
					}

					if(resposta.html != null){
						var display = resposta.html;
					}else{
						var display = resposta.text;
					}

					var newOption = new Option(display, resposta.id, false, false);
					$(thisObject).append(newOption).trigger('change');
					$(thisObject).val(resposta.id);
					$(thisObject).append(newOption).trigger('change');
				} else {
					throw new Error("Fail to get server request");
				}
			}catch(Error){
				console.error(Error.message);
			}
			if(debugMode){
				console.groupEnd();
			}
		},
		error: function (request, status, error) {
			console.error("Fail to get server request", request, status, error);
		}
	});
	if(debugMode){
		console.groupEnd();
	}
}

/**
	Automatically activate select2 for selects that has "select2-select" class or any name setted on the buildSelect2 parameter
**/
$(document).ready(function(){
	buildSelect2();
});

/**
	Save the filter from select2 that has been closed and it has not been choosen a item
**/
$(document).on('select2:closing', '.select2-hidden-accessible', function() {
	if($(this).data("dont-execute-search-cache") != true){
		if(debugMode){
			var consoleGroupID = Math.random().toString(16).slice(2);
			console.group("Execution of select2 event that to filter from select2 that has been closed and it has not been choosen a item "+consoleGroupID);
		}
		var  v = $('.select2-search__field').val();
		$(this).data('select2LastTerm', v);
		if(debugMode){
			console.groupEnd();
		}
	}
});

/**
	If there is an item choosen by select2, then it will clear the cache data left inside the object
**/
$(document).on("select2:select", '.select2-hidden-accessible', function() {
	if($(this).data("dont-execute-search-cache") != true){
		if(debugMode){
			var consoleGroupID = Math.random().toString(16).slice(2);
			console.group("Execution of event if there is an item choosen by select2, then it will clear the cache data left inside the object "+consoleGroupID);
		}
		if($(this).data("activate-searchfield-always") == null || $(this).data("activate-searchfield-always") == "" || $(this).data("activate-searchfield-always") != true){
			$(this).data('select2LastTerm', null);
		}
		if(debugMode){
			console.groupEnd();
		}
	}
});

/**
	If there is an cached data inside select2 then we will brought to the client again
**/
$(document).on('select2:open', '.select2-hidden-accessible', function() {
	if($(this).data("dont-execute-search-cache") != true){
		if(debugMode){
			var consoleGroupID = Math.random().toString(16).slice(2);
			console.group("Execution of If there is an cached data inside select2 then we will brought to the client again "+consoleGroupID);
		}
		var lastTerm = $(this).data('select2LastTerm');
		if (lastTerm && lastTerm.length) {
			let s = $('.select2-search__field');
			s.focus();
			s.val(lastTerm);
			setTimeout(function(){
				s.trigger('input');
			}, 100);
		}
		if(debugMode){
			console.groupEnd();
		}
	}
});