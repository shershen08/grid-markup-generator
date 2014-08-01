
function fromTranslator(){
		
		
		}
		
		function makeLayOutDropable(el){
			//console.log('makeLayOutDropable - ', el);
			$(el).droppable({
							accept: ".hItem",
                            greedy: true,
                            tolerance: "pointer",
                            hoverClass: "drophover",
							drop: function(event, ui){
                              //  console.log('makeLayOutDropable / drop - ', this);
								workWithDrops.call(this, arguments, 'inside');
							    }
							});
		}
		
		/*
		*	Вызов возможности принимать объекты
		**/
		function workWithDrops(){

			  var ui = arguments[0][1];
				var event = arguments[0][0];

				var elementId = 'ed' + new Date().getTime().toString().substr(9);
				
        //event.type !='drop'? ui = arguments[0][1] : ui = arguments[0][1].draggable;
        // 05.07 - было
          var elementData = ui.draggable.data('info');
          var elementText = ui.draggable.text();
       
			//	var elementData	= $(ui).data('info');
			//	var elementText = $(ui).text();

 //console.log(ui, elementData);

				elementData['id'] = elementId;

				//if (($(ui.draggable).parent().attr('id') != 'maincontainer') && !$(ui.draggable).parent().hasClass('containable')) {
				
				var toPut;
        //console.log(arguments);
				if ($(ui.draggable).parent().hasClass('sourceContainers')) {
				// && !$(ui.draggable).parent().hasClass('containable')
				//клонируем только если это новый блок а не сортировка
                    // console.log('clone');
					     toPut = $(ui.draggable).clone().appendTo(this);

				} else {
                 //    console.log($(ui).parent());

                toPut = $(ui.draggable);

                var myChilds = $(ui.draggable).children();
                $(toPut).append(myChilds);
				}
				
				//ориентируемся на id чтобы клонировать доп. вещи или нет
				
					$(toPut).text('');
				
				if ($(toPut).attr('id') == undefined) {
					$(toPut).attr('id', elementId);

				}

				
				//$(toPut).find('.remBlock').remove();
				$(toPut).data('info', elementData);

				
				
				if (elementData['_type'] == 'typeLay') {
					//тип LAYOUT - может принимать новые
					if(elementData['width']) { $(toPut).width(elementData['width']) };
					if (elementData['height']) { $(toPut).height(elementData['height'])};
					$(toPut).addClass('containable');


                    makeLayOutDropable(toPut);
					
					if ($(toPut).parent().height() < 200 ) {
						$(toPut).height(($(toPut).parent().height() - 20));
					} else {
						$(toPut).height(200);
					}

          //добавление дочерним блокам display:inline;
          var whoIsMyParent = $(toPut).parent().data('info');
          if (whoIsMyParent == undefined || whoIsMyParent['_type'] == 'typeLay'){
              $(toPut).css('display', 'inline-block');
          }

          //ПОКАЗ НАСТОЯЩЕЙ ШИРИНЫ БЛОКОВ
          //берем соотношение и 
          correctElemCSSWidth.call($(toPut), elementData);
          
          

				} else if (elementData['_type'] == 'typeFrm') {
					// кирпич поля
					$(toPut).addClass('thisIsBrick');
                       $(toPut).addClass('bg'+elementData['_tag']);
                        //дополнительно для типов input-полей
                        if (elementData['_tag']=='input'){
                           $(toPut).addClass('bg'+elementData['type']);
                        }
				} else if (elementData['_type'] == 'typeText' || elementData['_type'] == 'typeComp') {
					// блок текста
					$(toPut).addClass('thisIsText');
                    $(toPut).addClass('bg'+elementData['_tag']);
				}
				

				// деактивация таба с превью если там пусто
				if ($(this).find('div').length) {
					$('#tabs').tabs("option","disabled",[]);
				} else {
					$('#tabs').tabs("option","disabled", [1]);
				}
										
				//writeStats('Выбрано позиций', $('#maincontainer').find('div').length);

                DragAndDropEnable();
                resizeContainers.call($('#maincontainer div'), 0);


          
           //   var parentId = $(toPut).parent().attr('id') == 'maincontainer' ? parentId : null;
              var conf = elementData;
              var parent = $(toPut).parent().attr('id') != 'maincontainer' ? $(toPut).parent().attr('id') : null;
             // console.log(_W.getAction());
              if(_W.getAction() == 'add') {
                var el = new Block(conf);
                _W.AddElement(el, parent);
              } else {
                _W.RearrangeElement(_W.ElementById($(toPut).attr('id')), parent);
              }
        

			}


/*
* Корректировка ширины на поле конструкторе
* вспомогательная при появлении и редактирвоании элементов
**/
    function correctElemCSSWidth(elData){
      var correlation = '7 14 23 30 40 47 57 64 74 82 90 98'.split(' ');
      if (elData['class'].join().indexOf('col')>-1){
              $(this).width(correlation[(_.last(elData['class'].join().split('col_'))-1)] +'%');
          }
    }

    /*
    * Подсветка элементов
    **/  
    function highLightBloks(){

         //подсветка блоков внутри первой вкладки
       $('#maincontainer .hItem').bind('hover', function(event){
            event.stopPropagation();
            $('#maincontainer .hItem').removeClass('highlightedItem');
            $(this).toggleClass('highlightedItem');

            var curId = $(this).attr('id');

           //одновременная подсветка в дереве
           $('.myElems li').removeClass('highlightedItem');
           $('.myElems li').filter(function(item){
                if ($(this).data('elem') == curId){
                    return $(this);
                }
           }).toggleClass('highlightedItem');

           ShowIntroSpection(curId);

        });
    }  

    /*
    * Показ данных о блоке в панели "Свойства"
    **/    
    function ShowIntroSpection(id){

      $('#data-container').empty();
      if (id != null) {
              $('#data-container').html(Block.prototype.introspectToDOM.call(_W.ElementById(id)));
      }
    
    }
		/*
		*	Первоначальная отрисовка конструктора
		**/
		function DragAndDropEnable(){
			$('.sourceContainers div').draggable({
										grid 		: [10,10],
										appendTo	: "body",
										helper		: "clone",
                    start: function(event, ui) {
                          _W.setAction('add');
                      }
										});
			$('#maincontainer').droppable({
									accept: ".hItem",
									drop: function(event, ui){
										workWithDrops.call(this, arguments);
									}

								});
								
			$('#maincontainer').sortable({
							items: ".hItem",
							placeholder: "ui-state-default placeToPutColor",
              start: function(event, ui) {
                              _W.setAction('sort');
                              $('#temporaryContainer').html($(ui.item).children());
							},
							stop: function(event, ui) {   
                          $(ui.item).html($('#temporaryContainer').children());
							}
						});

      highLightBloks();

      //быстрое добавление в корень, конец списка
      //по двойному клику
     // $('.sourceContainers div').bind('dblclick', function(){
     //     var elementData = $(this).data('info');
     //     var el = new Block(elementData);
     //     _W.AddElement(el, null);
          //TODO !!!
          // как-то реализовать добавление по дабл клику
         // workWithDrops.call(null, {0 : {type:'dblclick'}, 1 : $(this)});
          //$(this).appendTo('#maincontainer');
    //  });

		}

    /*
    * Модификация высот контейнеров
    * внутри конструктора схемы
    **/
    function resizeContainers(chCount){

       $.each(this, function(u,i){
           

           if ($(i).hasClass('thisIsBrick') || $(i).hasClass('thisIsText')) {
               //инпуты и текст
               $(i).height(30);
               chCount++;
           } else {
               //контейнер
               if ($(i).children().length) {
                 var myKids = resizeContainers.call($(i).children(), 0);
                 $(i).height(myKids*30 + 30);
                 chCount += myKids;
               } else {
                $(i).height(30);
               // console.log('set 30 for - >', $(i).attr('id'), chCount);
                chCount++;
                
               }

           }

       });

       return chCount;
    };

		//function deleteButton(){
		//	$(this).prepend('<span class="ui-icon ui-icon-circle-close remBlock"/>');
		//};
		
		/*
		*	Удаление элемента из конструктора по клику на крестик
		**/
		var moveParentBack = function(){
			$(this).remove();
		};
		
		function writeStats(what, number){
			$('#statscontainer').html(what + ': ' + number);
			//DragAndDropEnable();
            //resiseContainres();
		}

     /*
    * Подсветка и обработка функций блоков списка
     **/
    function listHoverer(){
        $('.myElems li').bind('hover', function(event){
            event.stopPropagation();
            $('.myElems li').removeClass('highlightedItem');
            $(this).toggleClass('highlightedItem');

        });

        $('.myElems li').bind('click', function(event){
            event.stopPropagation();
            var idToSearch = $(this).data('elem');
            mainAreaToggle(0);
            editParent.call($('#' + idToSearch));
        });
    }

    /*
    *
     **/
    function fullTreeList(){
        $('.myElems').empty();
        callHTMLRender.call(this, arguments);
        var curElems = $('#htmlId').contents().find('body').children();
        if (curElems.length > 0) {

            buildTreeList(curElems, 1 );
            listHoverer();
        }
    }

    /*
    *
    * Рисование иерархического списка блоков в редакторе
    * @param level
    * @param noteType 
    * @param nodeId id данного элемента
    * @param isParent boolean конечный или родитель списка
    * @param pID id родательского пункта
    *
     **/
    function pushTree(level, nodeType, nodeId, isParent, pID){
       var placeToPut;
        if (level == 1) {
           placeToPut = $('.myElems');
        } else{
          placeToPut = $('.myElems').find('ul.l' + (level-1));
        }

        pID = pID || '_top';

        //если есть неопределенность куда ставить
        //проводим дополнительную фильтрацию
        var targetedParent;
        if($(placeToPut).length > 1){
           targetedParent = $(placeToPut).filter(function(u){
           if($(this).attr('rel') == pID){
                  return $(this);
              }
          });
        } else {
          targetedParent = placeToPut;
        }

        // рисуем только пункт
        // или заготвку для следующего уровня
        if(isParent) { // LI

            $('<li class="l' + level + '" data-elem="' + nodeId + '"/>')
                      .appendTo(targetedParent)
                      .html(nodeType.toLowerCase() + ' <small>#' +  nodeId + '</small>');

        } else{       // LI + UL

            $('<li class="l' + level + '" data-elem="' + nodeId + '"/>')
                      .appendTo(targetedParent)
                      .html(nodeType.toLowerCase() + ' <small>#' +  nodeId + '</small>')
                      .append('<ul class="l' + level + '" rel="' + nodeId + '"/>');
        }
    }
    /*
    *
    * Постройка дерева элементов в редакторе
    * @param obj элемент
    * @param itr уровень вложенности
    * @param pID id родительского элемента
    *
    * @return вызывает pushTree или себя рекурсивно
     **/
    function buildTreeList(obj, itr, pId){
       var itr = itr || 1;
        if (itr < 8){       //до 8 уровня
            for (var i in obj ){

                // _top - id родительского элемента 
                // для пунктов списка верхнегоу уровня

                if (obj.hasOwnProperty(i) && typeof(obj[i]) != 'number') {
                   if ($(obj[i]).children().length != 0){

                        if(obj[i].nodeName != undefined){
                           //отправляем рисовать родителя ветки
                           pushTree(itr, obj[i].nodeName, $(obj[i]).attr('id'), false, pId || '_top');
                        }
                       if(obj[i].nodeName == undefined){
                           return;
                       } else {
                            buildTreeList($(obj[i]).children(), (itr+1), $(obj[i]).attr('id'));
                       }

                    } else {
                        if(obj[i].nodeName != undefined){
                           //отправляем рисовать пункт ветки
                           pushTree(itr, obj[i].nodeName, $(obj[i]).attr('id'), true, pId || '_top');
                        }
                    }
                }
            }
        }
    };

		/*
		*	Заполнение хранилища исходных элементов
		*	распределение в соответствии с значением свойства _type : 'typeFrm' , 'typeLay', 'typeText', 'typeComp'
		*
		**/
		function getHome(){
      //здесь получаем массив с сервера  !!!!!!!!!!!
			var $r = tmpRepsonse;

			var finSrt = '';

            $(".typeLay, .typeFrm, .typeText, .typeComp").empty();

			for (i=0, l=$r.length; i<l; i++)	{

				var classes = '';
				$.each($r[i]['class'], function(m, n){
							classes += n + ' ';
						});
			
				var textToWrite = $r[i]['_tag'] ;
				//+ ' / ' + $r[i]['_label'] + ' (' + $r[i]['name'] + ')';
				var elType = $r[i]['_type'];
				
				
				//try {
				
				//	}
				//TODO!!!!!!!!!!!!!!
				//catch (elType != 'typeFrm' && elType != 'typeLay') {
				//		alert('Элемент имеет неправильный тип - ' + elType);
				//	}

				$('<div class="hItem" />').appendTo('.sourceContainers.' + elType).data('info', $r[i]).html(textToWrite + ':' + classes);
				
				
			}
			writeStats('Добавлено позиций', i);
            DragAndDropEnable();
            
		};
		
		/*var getAlien = function(){
			$('.sourceContainers').load(HOME + 'combinator/show_alien', function(){
				writeStats('Загружено позиций', $('.sourceContainers').find('div').length);
			});
		};
		*/
		function hlHtmlBlocks()
        {
				$(this).find('span:first').toggleClass('ui-icon-arrowthickstop-1-w ui-icon-circlesmall-close');
				$('#htmlId').contents().find('div').toggleClass('tech_hl');
				
		}

		var $loadBlock = '<div id="lb"></div>';


    /*
    * Cбор данных из формы диалога #dialogEdit -> form
    * и обновление свойств элемента
    * Получает в this - данные формы
    *           и параметром - объект на котором менять -> data('info')
    **/
    function updateObjectProps(elem){

        var elData = $('#'+elem).data('info');
        var formData = $(this);

        for ( item in formData) {
          
            // для остальных свойств  
              if (formData.hasOwnProperty(item) 
               && formData[item]['name'] != undefined
               && formData[item]['value'] != ''
               && formData[item]['name'] != 'id') {
                  var paramName = formData[item]['name'];
                  //elData[paramName] = formData[item]['value'];
                  _W.ElementById(elem).setParamValue(formData[item]['name'], formData[item]['value']);

              }

          }

          correctElemCSSWidth.call($('#'+elem), elData);
    };

    /*
    *
    *
    *
    **/
 function propertiesOutput(item, fulldata){

    var HTMLout = '', disableThis = '' , elemName = '';
    for ( item in fulldata) {


        // подписываем поля формы
        if (labelCorrelation[item] == undefined ){
          inputLabel = item;
        } else {
          inputLabel = labelCorrelation[item];
        }

        if (inputLabel != undefined && item != undefined) {
                if( item == 'class') {
                    HTMLout += ClassesParser(fulldata[item]);
                } else if (item == '_text') {
                    HTMLout += _templateWraper(InnerTextParser(fulldata[item]));
                } else {   

                      //виды которые не даем редактировать и не передаем
                      // _tag, _type, id
                      var closedObj = {_tag:1,_type:1,id:1};

                      if ((closedObj)[item]) { 
                             
                           HTMLout += _templateWraper('<label>' + inputLabel + '</label>' +
                                     '<span class="paramShow">' + fulldata[item] +'</span>');
                      } else{
                           elemName = ' name="' + item + '"';
                           HTMLout += _templateWraper('<label>' + inputLabel + '</label>' +
                                      '<input ' + disableThis + elemName + '  type="text" value="' + fulldata[item] + '">');
                      }

                }
        }

        
    }
    HTMLout += '<input name="class" type="hidden"/>';
    return HTMLout;
 }

/* --------------------------------------- БЛОК СПЕЦИФИЧНЫХ СВОЙСТВ  --------------------------------------------- */
function _templateWraper(html){
  return '<div class="diaFormLine">' + html + '</div>';
}
/*
* Показ внутреннего текста элемента
**/
function InnerTextParser(itemData){
  return '<label>Текст элемента</label>' +
         '<input name="_text" type="text" value="' + itemData + '">';
}
/*
* Показ классов элемента
**/
function ClassesParser(itemData){
  var _html = '', html = '';
  var posObj = {left:1,center:1,right:1};

  //класс ширины
  if (itemData.join().indexOf('col')>-1){
        var startval = itemData.join().split('col_')[1];
       _html += '<label for="amount">Ширина блока:</label>';
       _html += '<input type="text" id="amount" style="border:0; color:#f6931f; font-weight:bold; width:70px" />';
       _html += '<input id="realamount" type="hidden" >';
       _html += '<div id="slider" data-initial="'+startval+'"></div>';
        html = _templateWraper(_html);
          }
  // класс выравнивания
  if ((posObj)[itemData[0]]){ //сравнение по свойствам объекта
    _html = '<label for="alignment">Выравнивание:</label>';
    $.each(posObj, function(i,u){
        _html += '<input type="radio" value="' + i + '" ' + (i==itemData[0] ? 'checked' : '') + ' id="alignment" name="alignment_remove">';
        _html += '<span class="text-align-label ' + i + '"></span>';
    });
    html += _templateWraper(_html);
  }

  //не класс выравнивания и не ширина
  if (!(posObj)[itemData[0]] && (itemData.join().indexOf('col')==-1)){ 
    _html = '<label for="alignment">Класс элемента:</label>';
    _html += '<input type="text" value="' + itemData.join() + '" name="class">';
    html += _templateWraper(_html);
  }

    return html;
}
/*
* Вспомогательный слайдер
*/
function SliderInitialise(){
  var initial = $( "#slider" ).data('initial');
  $( "#slider" ).slider({value: initial--*100, min: 100, max: 1200, range: "min", step: 100,
      slide: function( event, ui ) {
        $("#amount").val(parseInt(ui.value/12) + ' %');
        $("#realamount").val('col_' + parseInt(ui.value/100));
      }
    });
    $("#amount").val( parseInt($('#slider').slider('value')/12)  + ' %');
    $("#realamount").val('col_' + ++initial);
}

/* --------------------------------------- БЛОК СПЕЦИФИЧНЫХ СВОЙСТВ  --------------------------------------------- */

/*
*
* Инициализация
* диалога
*/

function dialogInitiate(){
        $('#dialogEdit').dialog({
                          width:550, height:650, resizable: false, closeOnEscape: false, autoOpen: false,
                          open : function(){
                              $(this).dialog( "option", "title", $(this).attr('title') );
                          },
                          close : function(){
                              callbackDialog; //перерисовка дерева #sourceTree
                              fullTreeList();
                          },
                          buttons: {
                               'Удалить'  : function() {
                                                      moveParentBack.call($('#'+_W.elemId));
                                                      $(this).dialog("close");
                                },
                              'Сохранить' : function() {
                                                      var Form = $(this).find('form');
                                                      var classes;

                                                      //************** // сбор данных о классах
                                                      //рукописный класс 
                                                      if ($(Form).find('input[name=class]').val() != ''){
                                                        classes = $(Form).find('input[name=class]').val() + ', ';
                                                      } else {
                                                        classes = '';
                                                      }
                                                      // класс выравнивания  
                                                      if ($(Form).find('input#alignment').length) {
                                                          classes += $(Form).find('input[name=alignment_remove]:checked').val();
                                                          $(Form).find('input#alignment').prop('name','');
                                                      }
                                                      //класс ширины
                                                      if ($(Form).find('input#realamount').length) {
                                                          classes += ', ' + $(Form).find('input#realamount').val();
                                                      }
                                                      $(Form).find('input[name=class]').val(classes);
                                                      //************** // сбор данных о классах

                                                      updateObjectProps.call($(Form).serializeArray(), _W.elemId);

                                                      $(this).dialog("close");
                                },
                              'Отмена'    : function() {
                                                      $(this).dialog("close");
                                                      
                                }
                              }
                          });

}

		/*
		*	Вызов диалога для редактирования
		*	части свойств элемента который лежит в конструкторе
		**/
		function editParent(){

      var elem =  $(this);
			var tmpHtml = propertiesOutput(elem, $(this).data('info'));
      //dialogTitleCorrelation[elem.data('info')['_type']] + ' ' + elem.attr('id')
      $('#dialogEdit').find('form')
                      .html(tmpHtml);

      SliderInitialise();
      //
      _W.elemId = elem.attr('id');
      $('#dialogEdit').attr('title', 'Редактирование ' + elem.attr('id')).dialog('open', '1111');
								
		};

    function callbackDialog(){
       $(this).find('form').empty();
       
    }

		/*
		*	Очистка конструктора
		*	Блокировка вкладки с запросом к серверу, т.к. конструктор пустой
		**/
		function emptyEditor(){
			$('#maincontainer').html('');
			mainAreaToggle(0);
			$('#tabs').tabs("option","disabled", [2]);
      $('.myElems').empty();

      _W.RemoveAllElements();

      ShowIntroSpection(null);

		}
		/*
    * редактирование атрибутов
    * в окне свойств
    **/
    function makeEditable(){
      var el = $(this);
      var prevText = $(el).text();
      $(el).html('');
      $('<input type="text" size="20"/>').insertAfter($(el))
              .val($(el).text())
              .focus()
              .on('keypress', function(e){
                if (e.which == 13) {
                  $(this).prev().show().html($(this).val());
                  $(this).remove();
                }
              }).on('blur', function(){
                  $(this).prev().show().html($(this).val());
                  $(this).remove();
              });
    }


		/*
		*	Диалоговое окно,
		*	добавление нового элемента
		**/
		function addAlien(){
      console.log(1111);
			$('#dialogAdd').show();
				$('#dialogAdd').dialog({
					width:600,
					height:350,
					buttons: {
								'Сохранить': function() {
								
									var data = $(this).parent().find('#addAlien').serialize();
								/*	
									$.ajax({
									  type: 'POST',
									  url: 'save',
									  data: data,
									  success: function(){
									  
									  }
									});*/
										$(this).dialog("close");
								},
								'Отмена': function() {
										$(this).dialog("close");
							}
					}
				});
		};
		
		/*
		*	Сбор данных из конструктора и отправка на сервер
		**/
		function callServerRender(){
				var ui = arguments[0][1];
				var event = arguments[0][0];
				
					if(ui.index == 1) {		
						var $totalDivs = $('#maincontainer').find('div');
						for (i=0, l = $totalDivs.length; i<l; i++){
							var data = $($totalDivs[i]).data('info');
							
							////////////////////
							console.log($($totalDivs[i]).text(), data);
						}
						
						$('#renderedpart').html($loadBlock);
					}
		}
		
		

    function initHTMLpart(){
            var kickStartTEXT = '<link rel="stylesheet" type="text/css" href="style.css" media="all" /> ' + 
                                '<link rel="stylesheet" type="text/css" href="css/kickstart.css" media="all" /> ';
            $('<iframe id="htmlId"/>').appendTo('#htmlpart')
                                      .width('100%')
                                      .height('88%')
                                      .contents();
            $('#htmlId').contents().find('head').append(kickStartTEXT);
    }

    function clearCopyedElems(newBody){
       // $(newBody).find('span').remove();
        $(newBody).find('div').removeClass('hItem ui-draggable containable ui-droppable');
        $(newBody).find('div').removeAttr('style');   
    }

    // разбор и рисование блоков 
    function elementTransformer(){
          var yID = $(i).attr('id');
          var myDATA = $('#' + yID).data('info');
    }

		/*
		*	Сбор данных из конструктора и отправка на сервер
		**/
		function callHTMLRender(){
        //копирование и подготвка элементов из вкладки "Конструктор схемы"
        var newBody = $('#htmlId').contents().find('body');
        $(newBody).html($('#maincontainer').html());
        clearCopyedElems(newBody);

      	var ui = arguments[0][1];
				var event = arguments[0][0];

				$.each($(newBody).find('div'),  function(u,i){
					var yID = $(i).attr('id');
           console.log(yID, u);
					var myDATA = $('#' + yID).data('info');
					var d; // элемент с тегом

					if (myDATA['_type'] == 'typeFrm') {
						d = $('<' + myDATA['_tag'] + '/>').insertAfter($(i))
                                              .text(_W.ElementById(yID).getParamValue('_text'))
                                              .attr('id', yID)
                                              .attr('name', myDATA['name'])
                                              .prop('type', myDATA['type']);
						$(i).remove();

					} else if (myDATA['_type'] == 'typeLay') {
            d = i;
					} else if (myDATA['_type'] == 'typeText') {
            d = $('<' + myDATA['_tag'] + '/>').insertAfter($(i))
                                              .text(_W.ElementById(yID).getParamValue('_text'))
                                              .attr('id', yID);
						$(i).remove();
					}

          //назначаем классы из конфига   
          $.each((myDATA['class']).toString().split(','), function(m, n){
              $(d).addClass(n);
            });

				});
		}
		
    function saveHtml(){

      
    }

		function initEditor (){
		     
         //вкладки центральной части
         $('#tabs').tabs({ 
            selected: 0,
            disabled :[2],
            select: function(event, ui) { 
                if (ui.index == '1' ){
                  callHTMLRender.call(this, arguments);
                                    $('.sourceContainers div').draggable('disable');
                } else if (ui.index == '2' ){
                  callServerRender.call(this, arguments);
                } else if (ui.index == '0' ){
                                   $('.sourceContainers div').draggable('enable');
                }
                
            }
          });

        //вкладки боковой панели    
        $('#sourceTabs').tabs({ selected: 0});

        //переключение на первую вкладку 
        $('#sourceTabs').hover(function(){  mainAreaToggle(0);});

        //контекстное меню "Файл"
        $('.FileButton').button({icons: {primary: "ui-icon-carat-1-e"}}).menu({ 
          content: $('.FileButton').next().html(), 
          showSpeed: 400 
        });

        //функции кнопок
        //////////// тут пробема с дорисовкой вторго экземпляра к DOM
        $('.uploadBlocks').on('click', getHome);
        $('.createBlocks').on('click', addAlien);
        $('.saveHtmlEdit').on('click', saveHtml);

        $('.infoToConsole').click(function(){
            console.log($('#' + $('.prop:contains(id)').next().text()).data('info'));
        }); 

        $('button.emptyEditor').click(emptyEditor); 
        $('button.showHelpInfo').click(function(){
                                 $('.editorInformation').toggle();
                              });

       // $('button.undoButt').click();

        $('button.highLightBlocks').live('click', hlHtmlBlocks);
        $('button.buildTree, #float-right-icon').click(fullTreeList);

        
        
       // $('button.uploadBlocks').button({icons: {primary: "ui-icon-folder-collapsed"}});
       // $('button.createBlocks').button({icons: {primary: "ui-icon-circle-plus"}});
        //$('button.saveHtmlEdit').button({icons: {primary: "ui-icon-disk"}});

        //внешний вид кнопок
        $('button.emptyEditor').button({icons: {primary: "ui-icon-trash"}});
        $('button.buildTree').button({icons: {primary: "ui-icon-refresh"}});
        $('button.highLightBlocks').button({icons: {primary: "ui-icon-squaresmall-plus"}});
        $('button.fullScrToggle').button({icons: {primary: "ui-icon-arrowthickstop-1-w"}});
        $('button.undoButt').button({icons: {primary: "ui-icon-arrowreturnthick-1-w"}});
        $('button.showHelpInfo').button({icons: {primary: "ui-icon-info"}});
        $('.File').button();

        $('<ul class="myElems" />').appendTo($('#sourceTree'));

        //переключение режима
        $('button.fullScrToggle').live('click', fullScrToggle);
        $(document).bind("keyup", function(e){ kbNavigation.call($('button.fullScrToggle'), e); });


        initHTMLpart();

        dialogInitiate();
        //редактирование полей свойств
       // $('.val').filter(function(index){
         // $(this).data('prop')
         // Block.prototype.introspectToDOM.call(_W.ElementById('ed4605'))
             // if(true) {
         //       return $(this);
             // }
           // }).live('click', makeEditable);

        _W = new Workflow();
		}

    /*
    * базовые функции по клавиатуре
    **/
     function kbNavigation(event){
        // проверяем что нет редактирования поля
        if ($('input:focus, textarea:focus, #dialogEdit:visible').length==0) {
            if(event.which == 70){                  // F : показ-скрытие боковой панели
              fullScrToggle.call($(this)[0]);
            }
            if(event.which == 67){                  // C : вкладка конструктора
              mainAreaToggle(0);
            }
            if(event.which == 80){                  // P : вкладка превью
              mainAreaToggle(1);
            }
            if(event.which == 82){                  // R : вкладка сервера
               mainAreaToggle(2);
            }
            if(event.which == 69){                  // E : очистка проекта
               emptyEditor();
            }
        }

     } 


		/*
		* Скрытие и показ боковой панели
    * для определения используем класс кнопки
		**/
		function fullScrToggle(){
			var buttonState = $(this).find('span:first');
            if ($(buttonState).hasClass('ui-icon-arrowthickstop-1-w')) {
                 $('.sourcecontainer').hide();
                 $('.maincontainer').addClass('full');
            } else {
                $('.sourcecontainer').show();
                 $('.maincontainer').removeClass('full');
            }
           $(buttonState).toggleClass('ui-icon-arrowthickstop-1-e ui-icon-arrowthickstop-1-w');
		}
		/*
    * Переключение вкладок редактора
    **/
    function mainAreaToggle(num){
      if(num < 2 && num >= 0){
        $('#tabs').tabs({ selected: num});
      }
       
    }
    