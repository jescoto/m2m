/**
 * @author Jaykon Willian de Oliveira
 * @dependency IScroll.js
 */

var WxSelect = (function(){
	
	this.el;
	this.WxSelectEl;
	this.WxContainer;
	this.WxPicker;
	this.WxList;
	this.WxSearchField;
	this.IScroller;
	this.initShowing;
	this.selectedItem;
	this.handlerClickDocument;
	this.optionsObjs;
	WxSelect.hide;
	WxSelect.pickerDisplaying;
	
	
	var timeoutToRefreshScroll;
	
	function WxSelect(el){
		el = document.querySelector(el);
		var me = this;
		
		this.initShowing = false;
		
		if(WxSelect.hide == undefined){
			this.hide = !this.initShowing;
		}
		
		this.optionsObjs = {};
		
		this.el = el;
		this.hideSelect();
		this.createSelectField();
		this.createConatiner();
		this.changeOption();
		this.createSearchField();
		
		var Obj = document.body.appendChild(this.WxPicker);
		
		this.IScroller = new IScroll(this.WxContainer, {
			scrollbars: true,
			tap: true,
			click: true
		});
		this.IScroller.scrolling = false;
		this.IScroller.on('scrollStart', function(e){me.IScroller.scrolling = true});
		this.IScroller.on('scrollEnd', function(e){setTimeout(function(){me.IScroller.scrolling = false}, 200)});
		
			
		return this;
	};
	
	WxSelect.prototype.hideSelect = function(){
		this.el.style.display = "none";
	};
	
	WxSelect.prototype.showPicker = function(){

		if(arguments.length){
			arguments[0].stopPropagation();
		}

		this.WxPicker.setAttribute("data-hidden", false);
		this.WxPicker.style.display = "block";
		this.WxPicker.style.zIndex = "999999";
		WxSelect.hide = false;
		WxSelect.pickerDisplaying = this;
		
		this.IScroller.refresh();
		
		var me = this;
		this.handlerClickDocument = this.onClickDocument.bind(this);
		
		setTimeout(function(){document.body.addEventListener('click', me.handlerClickDocument, false)}, 1000);
		return this;
	};
	
	WxSelect.prototype.hidePicker = function(){
		this.WxPicker.setAttribute("data-hidden", true);
		this.WxPicker.style.display = "none";
		this.WxPicker.style.zIndex = "0";
		WxSelect.hide = true;
		WxSelect.pickerDisplaying = undefined;
		
		var me = this;
		document.body.removeEventListener('click', me.handlerClickDocument, false);
		return this;
	};
	
	WxSelect.prototype.onClickDocument = function(e){
		
		//e.stopPropagation();
		//console.dir(e.target)
		if(e.target.className != "wx-select-item" && e.target.nodeName != "A" && e.target.nodeName != "SPAN" && e.target != this.WxContainer && e.target != this.WxList && e.target != this.WxSearchField && !this.IScroller.scrolling){
			this.hidePicker();
		}
		
		//return false;
	};
	
	WxSelect.prototype.changeOption = function(){
		this.el.addEventListener('DOMNodeInserted', this.insertOption.bind(this));
		this.el.addEventListener('DOMNodeRemoved', this.removeOption.bind(this));
		this.el.addEventListener('DOMAttrModified', this.changeAttr.bind(this));
		var me = this;
		
		try{
			var observer = new WebKitMutationObserver(function (mutations) {
				mutations.forEach(me.changeAttr.bind(me));
			});
			observer.observe(this.el, { attributes: true, subtree: false });
		}catch(ee){}
		
	};
	
	WxSelect.prototype.optionToItemList = function(opt){
		var itemDiv = document.createElement('div');
		var itemSpan = document.createElement('span');
		var link = document.createElement('a');
		
		itemDiv.setAttribute('class', 'wx-select-item');
		itemDiv.setAttribute('data-value', opt.value);
		itemDiv.setAttribute('data-text', opt.text.toLowerCase());
		link.innerText = opt.text;
		itemSpan.appendChild(link);
		itemDiv.appendChild(itemSpan);
		
		
		this.optionsObjs[opt.value] = opt.text;
		
		return itemDiv;
	};
	
	WxSelect.prototype.changeAttr = function(e){
		
		if(e.attributeName == "disabled"){
			if(e.target.disabled){
				this.WxSelectEl.setAttribute("disabled", "");
			}else{
				this.WxSelectEl.removeAttribute("disabled");
			}
		}
		
		return true;
	};
	
	WxSelect.prototype.insertOption = function(e){
		clearTimeout(timeoutToRefreshScroll);
		
		var item = this.optionToItemList(e.target);
		item.querySelector('a').addEventListener('click', this.onItemSelect.bind(this), false);
		this.WxList.appendChild(item);
		
		if(item == this.WxList.firstChild){
			item.setAttribute('selected', '');
			this.selectedItem = item;
			this.WxSelectEl.innerText = this.selectedItem.getAttribute("data-text");
		}
		
		
		timeoutToRefreshScroll = setTimeout(this.refreshIScroller.bind(this), 100);
	};
	
	WxSelect.prototype.removeOption = function(e){
		clearTimeout(timeoutToRefreshScroll);
		
		var opt = e.target;
		var item = this.WxList.querySelector('[data-value="'+opt.value+'"]');
		item.querySelector('a').removeEventListener('click', this.onItemSelect.bind(this), false);
		this.WxList.removeChild(item);
		
		
		delete this.optionsObjs[opt.value];
		
		timeoutToRefreshScroll = setTimeout(this.refreshIScroller.bind(this), 100);
	};
	
	WxSelect.prototype.onItemSelect = function(e){
		
		//e.stopPropagation();
		//console.log(e.target);
		if(this.IScroller.scrolling){
			return false;
		}
		
		e = e.target;
		if(e.nodeName === "A"){
			e = e.parentNode.parentNode;
		}
		
		
		try{
			this.WxList.querySelector('[selected]').removeAttribute('selected');
		}catch(ee){}
		
		e.setAttribute('selected', "");
		this.selectedItem = e;
		this.el.value = e.getAttribute("data-value");
		
		setTimeout(this.hidePicker.bind(this), 500);
		
		if("createEvent" in document) {
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change", false, true);
		    this.el.dispatchEvent(evt);
		}else{
		    this.el.fireEvent("onchange");
		}
		
		
		//return false;
	};
	
	WxSelect.prototype.refreshIScroller = function(){
		this.IScroller.refresh();
	};
	
	WxSelect.prototype.createConatiner = function(){
		var container = this.WxContainer = document.createElement('div'),
			list = this.WxList = document.createElement('div'),
			picker = this.WxPicker = document.createElement('div');
		
		picker.setAttribute('class', 'wx-select-container');	
		picker.setAttribute('data-hidden', (!this.initShowing).toString());
		container.setAttribute('class', 'wx-select-container-inside');
		
		container.appendChild(list);
		picker.appendChild(container);
		
		if(this.initShowing){
			this.showPicker();
		}else{
			this.hidePicker();
		}
	};
	
	WxSelect.prototype.createSelectField = function(){
		var me = this;
		var sel = this.WxSelectEl = document.createElement('div');
		
		sel.setAttribute('class', 'form-control');
		sel.addEventListener('click', this.showPicker.bind(this), false);
		
		this.el.addEventListener('change', function(e){
			//console.log('ta aki'); 
			sel.innerText = me.selectedItem.getAttribute("data-text");
		});
		
		this.el.parentNode.appendChild(sel);
	};
	
	WxSelect.prototype.createSearchField = function(){
		var me = this,
			srcContainer = document.createElement('div'),
			src = this.WxSearchField = document.createElement('input');
		
		srcContainer.setAttribute('class', 'wx-top-search');
		src.setAttribute('type', 'search');
		src.setAttribute('class', 'wx-search-field');
		src.setAttribute('placeholder', 'Busca...')
		srcContainer.appendChild(src);
		this.WxPicker.insertBefore(srcContainer, this.WxContainer);
		
		
		this.WxSearchField.addEventListener('input', this.searchItems.bind(this));
		
		return src;
	};
	
	WxSelect.prototype.searchItems = function(e){
		var text = e.target.value.toLowerCase(),
			nodesToHide = this.WxList.querySelectorAll('.wx-select-item:not([data-text*="'+text+'"])'),
			nodesToShow = this.WxList.querySelectorAll('.wx-select-item[data-text*="'+text+'"]'),
			allOptions = this.WxList.querySelectorAll('.wx-select-item');
			
		if(text.length > 0){
			[].forEach.call(nodesToHide, function(el){
				el.style.display = "none";
			});
			
			[].forEach.call(nodesToShow, function(el){
				el.style.display = "block";
			});
		}else{
			[].forEach.call(allOptions, function(el){
				el.style.display = "block";
			});
		}
		
		this.IScroller.refresh();
	};
	
	return WxSelect;
	
})();