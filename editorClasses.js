/*
*
*
* Описание объектов блоков
**/
var Block = function(config){
  this['_type'] = config['_type'];
  this['_tag']  = config['_tag'];
  this['class'] = config['class'];
  this['id']    = config['id'];
  this['name']  = config['name'];
  this['_text']  = config['_text'];
  this['type']  = config['type'];
  this['_style']  = config['_style'];
  this['Children']  = {};

  return this;
}

Block.prototype = {
      getType : function(){
         return this['_type'];
    },
      getTag : function(){
         return this['_tag'];
    },
      getClass : function(){
        return this['_class'];
    },
      getId : function(){
         return this['id'];
    },
      getName : function(){
        return this['name'];
    },
    getParamValue : function(param, value){
        return this[param];
        ///TODO !!! добавить эксепшоны!!!
    },
      getChildren : function(){
        return this['Children'];
    },
    clearParamValue : function(param, value){
        if (this.hasOwnProperty(param)) {
            //в экземпляре
            this[param] = undefined;

            //в data-info DOM-объекта
            var startVal = $(this.getDOMelement()).data('info');
            console.log('before -> ', startVal[param], value);
            startVal[param] = undefined;
            console.log('AFTER -> ', startVal[param]); 
            $(this.getDOMelement()).data('info', startVal)
        } else {
            throw "У элемента нет такого параметра "+param+"<< editorClasses.js:setParamValue";
        }
         
      },
      setParamValue : function(param, value){
        if (this.hasOwnProperty(param)) {
            
              if (_.isString(this[param])) {    //*****************// тип - строка

                  //в экземпляре
                  this[param] = value;

                  //в data-info DOM-объекта
                  var startVal = $(this.getDOMelement()).data('info');
                  console.log('before -> ', startVal[param], value);
                  startVal[param] = value;
                  console.log('AFTER -> ', startVal[param]); 
                  $(this.getDOMelement()).data('info', startVal)

              } else if (_.isArray(this[param])) {//**************//тип - массив

                  //в экземпляре
                  this[param] = value.split(", ");

                  //в data-info DOM-объекта
                  var startVal = $(this.getDOMelement()).data('info');
                  startVal[param] = value.split(", ");
                  $(this.getDOMelement()).data('info', startVal)

             } else {                            //*****************//тип - объект


             }

            
        } else {
            throw "У элемента нет такого параметра "+param+"<< editorClasses.js:setParamValue";
        }
         
      },
      isAttrEditable : function(param){
        if(param == 'id' || param == '_type' || param == '_tag'){
          return false;
        } else {
          return true;
        }
    },
      getDOMelement : function(){
        return $('#' + this.getId());
    },
      AddChild : function(el){
        this['Children'][el.getId()] = el;
    },
    RemoveChild : function(el){
      if (this['Children'] != undefined){
        //el.getId()
        delete this['Children'][el.getId()];
      } else {
         throw "У элемента нет такого потомка << editorClasses.js:RemoveChild ";
      }
        
    },
      introspect : function(){
      var total = {};
        for(var i in this) {
        if (this.hasOwnProperty(i)) {
            total[i] = this[i];
            }
         }
      return total;
     },
     introspectToDOM : function(){
      var total = '';
       if (this.toString().indexOf('global') == -1) {
          for(var i in this) {
          if (this.hasOwnProperty(i) && this[i] != undefined && this[i].toString().indexOf('object') == -1) {
              total += '<span class="prop">' + [i] + '</span><span class="val" data-prop="' + [i] + '">'+ this[i] + '</span><br>';
              }
           }
        return total;
       } else {
        throw "Нет элемента с таким id << editorClasses.js:introspectToDOM ";
       }
   }
}

/*
*
*
* Описание рабочего пространства конструктора
**/

var Workflow = function(){
  //линейный список
  this['elements'] = Array(); 
  //дерево со вложенностью
  this['elemtree'] = {};
  //key:value хранилище
  this['elemobj'] = {};

  //последнее действие
  this.action = 'add';
  //текущий редактируемый элемент
  this.elemId = '';
  

  return this;
}


Workflow.prototype = {
      setAction : function(act){
          this.action = act;
      },
      getAction : function(){
          return this.action;
      },
      getElementsCount : function(){
         return this['elements'].length;
      },
      getLastElement : function(){
         return this['elements'][this['elements'].length-1];
       },
      ElementByIndex : function(index){
         return this['elements'][index];
       },
      ElementById : function(id){
        if(this.elemobj[id] !== undefined){
           return this['elemobj'][id];
        } else {
           throw "На поле нет элемента с таким id << editorClasses.js:ElementById ";
           return null;
        }
     
         
       },
      RearrangeElement : function(el, parent){
        console.log(el, parent);
        if (parent != null){
          this.removeElementFromTree(el);
        }
        
        this.AddElementToTree(el, parent);
      },
      removeElementFromTree : function(el){ 
          var res = false;
          for (i in this.elements) {
            if(this.elements[i].Children[el.getId()] != undefined){
             delete this.elements[i].Children[el.getId()];  //
             res = true;
            }
          }
          if(!res){
            throw "Не найден такой дочерний элемент << editorClasses.js:removeElementFromTree ";
          }
      },
      AddElement : function(el, parent){
        this['elements'].push(el);
        this['elemobj'][el.getId()] = el;

        this.AddElementToTree(el, parent);

        //перерисовка дерева #sourceTree
          fullTreeList();
        
       },
      AddElementToTree : function(el, parent){
          

          if (!parent){
            this['elemtree'][el.getId()] = el;
          } else {
            Block.prototype.AddChild.call(this.ElementById(parent), el);
          }
       },
      RemoveElementByIndex : function(index){
         this['elements'].splice(index, 1);
       },
      RemoveAllElements : function(){
          this['elements'] = Array(); 
          this['elemtree'] = {};
          this['elemobj'] = {};
    }
};


/*
*
*
* Описание панели с деревом сбоку
**/

var Tree = function(){
}


/*
* хранение всех методов дописывания атрибутов
*  
*/
var Attrs = function(){


}

Attrs.prototype = {
  writeId : function(id){
      return ' id="' + id + '"';
  },
  writeName : function(name){
      return ' name="' + name + '"';
  },
  writeWidth : function(width){
      return ' width="' + width + '"';
  },
  writeText : function(text){
      return text;
  }
};
