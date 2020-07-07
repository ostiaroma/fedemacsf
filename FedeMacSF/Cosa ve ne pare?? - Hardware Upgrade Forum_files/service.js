	/*font-face support (Diego Perini)*/

	var isFontFaceSupported = (function(){  
	var 
	sheet, doc = document,
	head = doc.head || doc.getElementsByTagName('head')[0] || docElement,
	style = doc.createElement("style"),
	impl = doc.implementation || { hasFeature: function() { return false; } };
	 
	style.type = 'text/css';
	head.insertBefore(style, head.firstChild);
	sheet = style.sheet || style.styleSheet;
	 
	var supportAtRule = impl.hasFeature('CSS2', '') ?
			function(rule) {
				if (!(sheet && rule)) return false;
				var result = false;
				try {
					sheet.insertRule(rule, 0);
					result = !(/unknown/i).test(sheet.cssRules[0].cssText);
					sheet.deleteRule(sheet.cssRules.length - 1);
				} catch(e) { }
				return result;
			} :
			function(rule) {
				if (!(sheet && rule)) return false;
				sheet.cssText = rule;
	 
				return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) &&
				  sheet.cssText
						.replace(/\r+|\n+/g, '')
						.indexOf(rule.split(' ')[0]) === 0;
			};
	 
	return supportAtRule('@font-face { font-family: "font"; src: "font.ttf"; }');
	})();


	
	
	/*######################################################
							MENU
	######################################################*/
	
	
	var riferimento;
	var mytimer;
	var mytimer2;
	var max_zindex = 0;


	$.fn.slideFadeToggle  = function(speed, easing, callback) {
			return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
	}; 
	
	$.fn.showFadeToggle  = function(speed, easing, callback) {
			return this.animate({opacity: 'toggle', height : 'toggle', width : 'toggle'}, speed, easing, callback);
	}; 					

	$.fn.leftFadeToggle  = function(speed, easing, callback) {
			return this.animate({opacity: 'toggle', left : 'toggle'}, speed, easing, callback);
	}; 

	$(function() { //ready() 
	
		if(!isFontFaceSupported){ //fix menu: se non c'è il supporto a @font-face modifico le proprietà CSS per renderlo usabile
			$("#menu li, #menu-selector .centro").css({"font-size":"14px","font-family":"Arial, Helvetica, sans-serif","font-weight":"bold","letter-spacing":"-1px"})
		}

		
		$(".linkmenu[rel]").parent().css("background-image","url(/css/img/menu-separator-freccia.png)");
		
		
		$(".linkmenu").mouseenter(function(){
			
			
			if($(this).attr("rel") != undefined ){
				
				riferimento = this;
				
				clearTimeout(mytimer);
				
				mytimer = setTimeout(function(){show_menu(riferimento)},100);
				
			}else{ //menu senza sottomenu
			
				clearTimeout(mytimer);
				
				hide_menu(this);
				
			}
		}).mouseleave(function(){
			clearTimeout(mytimer); 
		});		
		
		
		
		
		$("#submenu-container").mouseenter(function(){
			//
		}).mouseleave(function(){
			
				clearTimeout(mytimer);
				
				hide_menu(this);
			
		});		
		
		
		
		function show_menu(oggetto){
			
			//trovo l'oggetto con il più alto z-index (una volta sola) e mi assicuro che il menu ci vada sopra :(
			
			if (max_zindex == 0){				
				
				$('*').each(function(index) {
					//alert(index + ': ' + $(this).text());
					//console.log($(this).attr("id"),$(this).attr("class"),$(this).css("z-index"));
					
					current_zindex = parseInt($(this).css("z-index"));
					
					if ( current_zindex > max_zindex && current_zindex < 1000000000)
						max_zindex = current_zindex;
					
				});				
				
				if( max_zindex >= parseInt($("#menu-selector").css("z-index")) ){
				
					$("#menu-selector").css("z-index",max_zindex+2);
					$(".submenu").css("z-index",max_zindex+1);
				
				}		
				
			}

			
		
			var menu_type = 1;
			
			if($("#main").css("position") == "relative"){
				var offset = $(oggetto).position();	// .offset() se non ci fosse un "contenitore" con position:relative
				var wrapper_offset = $("#inner-wrapper").position(); // .offset() se non ci fosse un "contenitore" con position:relative
				//console.log("skin rilevata");
			}else{
				var offset = $(oggetto).offset();
				var wrapper_offset = $("#inner-wrapper").offset();
				//console.log("no skin");
			}
			
			if( $("#main").css("position") == "relative" && $('#main').css("margin-left") == "0px" ){ //test fix .position() in firefox, opera,ecc (leggono diversamente da webkit il margin auto)
				//console.log("FIX");
				wrapper_offset.left = 0;
			}
			
			/*
			var offset = $(oggetto).position();	// .offset() se non ci fosse un "contenitore" con position:relative
			var wrapper_offset = $("#inner-wrapper").position(); // .offset() se non ci fosse un "contenitore" con position:relative
			*/
			
			var submenu_attivo = $(oggetto).attr("rel");
			var is_qn = $(oggetto).parents().hasClass("qn");

			if(is_qn){ //fix per sottomenu QN
				$("#menu-selector").addClass("qn");	
			}else{
				$("#menu-selector").removeClass("qn");	
			}
			

			$(".submenu").hide();
										
			$("#menu-selector .centro").html($(oggetto).parent().html());
		
			$("#menu-selector").css("visibility","hidden"); //trick per far calcolare la larghezza del selettore verde, altrimenti senza averlo prima "disegnato" non si riesce
			$("#menu-selector").show();
			
			$("#menu-selector").width($("#menu-selector .centro").width()+41);
			
			$("#menu-selector").css("top", offset.top -7 ).css("left", offset.left + $(oggetto).parent().width() / 2 - $("#menu-selector").width() / 2  );
			
			$("#menu-selector").css("visibility","visible");
			
			//cerco di capire quale deve essere il limite destro dell'area in cui stampare il menu: l'area di #inner-wrapper (bianca) o se la finestra è più stretta, il viewport del browser
			
			margine_schermo = $(window).width();
			margine_DX = (parseInt(wrapper_offset.left) + parseInt($("#inner-wrapper").width()));
			
			quale_margine = (margine_schermo >= margine_DX ) ? (margine_DX + $(window).scrollLeft()) : (margine_schermo+$(window).scrollLeft());
			
			//console.log($("#inner-wrapper").position(), $("#inner-wrapper").offset(), wrapper_offset,  wrapper_offset.left );
			
			//console.log("ma schermo: "+margine_schermo + " ma dx: "+ margine_DX + " wrap_off_left:" + parseInt(wrapper_offset.left) + " inn_wrap_width:" + parseInt($("#inner-wrapper").width()));
			
			//console.log($("#inner-wrapper").position(), $("#inner-wrapper").offset() );
			
			var larghezza_submenu = $("#"+ submenu_attivo).width();
			
			final_offset = ( ((offset.left - 10) + larghezza_submenu) >= quale_margine ) ? (quale_margine - larghezza_submenu) : (offset.left - 10) ;
			
			if( final_offset < parseInt(wrapper_offset.left+$(window).scrollLeft()) ){ 
				final_offset = wrapper_offset.left + $(window).scrollLeft();
			}
			
			$("#"+ submenu_attivo).css("top",offset.top + 38).css("left",final_offset);						
			
			if(is_qn) $("#"+ submenu_attivo).css("top",offset.top + 32);	//fix per sottomenu QN
			
			//tipo di animazione
			switch(menu_type)
			{
				
				case 0: //apertura istantanea
					$("#"+ submenu_attivo).show(); 
					break;
				case 1: //fade
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).fadeIn("fast") },100); 
				  break;
				case 2: //slide down
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).slideDown("fast") },100); 
				  break;
				case 3: //slide down + fade
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).show("fast") },100);
				  break;
				case 4: //show top left
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).slideFadeToggle("fast"); },100);
				  break;
				case 5: //show top left + fade
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).showFadeToggle("fast"); },100);
				  break;
				case 6: //show left + fade
				  mytimer2 = setTimeout(function(){ $("#"+ submenu_attivo).stop(1,1).leftFadeToggle("fast"); },100);
				  break;

			}
			
			
						
			

		}
		
		function hide_menu(oggetto){
			
			clearTimeout(mytimer2);
			
			$("#menu-selector").hide();
			$(".submenu").hide();
			
		}
	
	});
	
	
	
	/*######################################################
							SCROLL COLONNA DX
	######################################################*/	
		
		
	function posiziona_colonna_dx(){
		
		
		
		//console.log($("#wrapper").offset().top + " " + $("body").offset().top + " " + $("body").css("margin-top"))
		//console.log(document.compatMode + " " + (typeof document.compatMode == 'string') +" "+ (document.compatMode.indexOf('CSS') >= 0) + " "+document.doctype)
		
		if((typeof document.compatMode == 'string') && (document.compatMode.indexOf('CSS') >= 0)) //controllo se la pagina è in quirksmode o no (può succedere se c'è qualcosa stampato prima della pagina, errori, debug, ecc...) . jQuery non supporta correttamente i vari offset in quirksmode e la posizione della colonna DX non sarà corretta -> disabilito lo scroll
			document_doctype_ok = true;
		else
			document_doctype_ok = false;
		
		
		if($("#col-dx.interne").length && !$("#col-dx.noscroll").length && document_doctype_ok && !client_is_mobile){ //c'è la colonna DX, lo scroll non è disabilitato via classe CSS, non è in quirksmode e non è "mobile"
	
			var col_dx_offset = $("#col-dx.interne #col-dx-inner").offset(); //posizione  #col-dx-inner
			var main_offset = $("#main").offset(); //posizione #main
			var top300x250_segnaposto_offset = $("#top300x250-segnaposto").offset(); //posizione contenitore banner 300x250 superiore nella colonna di dx
			
			
			//console.log(top300x250_segnaposto_offset.left + " "+ $("#col-dx.interne #col-dx-inner").offset().left);
			
			//console.log($(document).width() + " " + $(window).width() + " " + $(document).scrollLeft()+ " " + $(window).scrollLeft() );
			
			
			colonna_sx_lunga = ( $("#col-sx").height() > $("#col-dx").height() ); //Col-SX è più lunda di Col-DX
			
			scroll_orizzontale = ( $(window).width() > $("#inner-wrapper").width() ) ? false : true; //la dimensione della finestra (uso document in questo caso, ma potevo usare window) è maggiore della larghezza del DIV principale? (no scrollbar)

			
			//console.log(scroll_orizzontale + " "+ $(document).width() + "["+ document.body.scrollWidth+"] " + $("#inner-wrapper").width() + " " + ($(document).width() > $("#inner-wrapper").width()) );
			
			
			if( !colonna_sx_lunga || scroll_orizzontale && 0){ //se la colonna di sinitra è più corta o c'è la scrollbar orizzontale (finestra più stretta della pagina) non abilito la colonna mobile, e la riposiziono staticamente nel DOM
				$("#col-dx.interne #col-dx-inner").css("position","static").css("bottom","auto");
				//console.log("non ci sono le condizioni, -> static");
				return;
			}
			
			//console.log($(window).height() + " " + $("#col-dx.interne #col-dx-inner").height() + " " + top300x250_segnaposto_offset.top);
			//console.log("H+Scroll: " + ($(window).height() + $(window).scrollTop()) + "(" + (col_dx_offset.top + $("#col-dx.interne #col-dx-inner").height() ) +") col_dx_offset.top: " + col_dx_offset.top + " #col-dx-inner.height: " + $("#col-dx.interne #col-dx-inner").height() + " DocH: " + $(document).height()  );
			
			//console.log(  col_dx_offset.top +" >= "+ top300x250_segnaposto_offset.top + " + " + $("#top300x250-segnaposto").height() + " ( " + (top300x250_segnaposto_offset.top + $("#top300x250-segnaposto").height() ) + ")" );
			//console.log(  col_dx_offset.top);
			
			if( ( $(window).height() + $(window).scrollTop() ) > ( col_dx_offset.top + $("#col-dx.interne #col-dx-inner").height() ) && ( col_dx_offset.top  >= (top300x250_segnaposto_offset.top + $("#top300x250-segnaposto").height()) ) ){
				
				differenza = $(document).height() - ($(window).height() + $(window).scrollTop()); //quantità di pixel mancanti allo scroll completo
				footer_space = $(document).height() - (main_offset.top + $("#main").height()); //altezza spazio tra fine del #main e il fondo pagina
				
				//console.log(differenza + " " + footer_space);
				
				if(differenza < footer_space){ //se sono nell'area di scroll "sotto" la fine del #main, la colonna deve posizionarsi prima del bottom:0, lo calcolo tenendo conto delle variabili che ho impostato prima
					
					limite_bottom = footer_space - differenza;
					
					//console.log("*"+limite_bottom);
					
					$("#col-dx.interne #col-dx-inner").css("position","fixed").css("bottom",limite_bottom+"px");
					
					
					
					
				}else{ //non sono sul fondo pagina, tutto normale
					//console.log("*0");
					$("#col-dx.interne #col-dx-inner").css("position","fixed").css("bottom","0");	
				}
				
				
				//pagina più larga del previsto, devo impostare anche la proprietà LEFT (visto che è fixed)
				
				
				//console.log("segnaposto left(1) -> "+ top300x250_segnaposto_offset.left + " col dx left ->"+ $("#col-dx.interne #col-dx-inner").offset().left);
				
				if($(window).scrollLeft() > 0){
					//console.log("segnaposo left(2) -> "+top300x250_segnaposto_offset.left);
					
					posizione_left = (top300x250_segnaposto_offset.left - $(window).scrollLeft());
					
					//console.log( "posizione_left calcolata: "+posizione_left);
					
					$("#col-dx.interne #col-dx-inner").css("position","fixed").css("left",posizione_left +"px");
					
					//console.log("posizione finale = "+$("#col-dx.interne #col-dx-inner").css("left"))
					
					//console.log("fix (1) left");
					
				} else {
			
					//console.log($(document).width() + " " + $(window).width() + " " + document.body.scrollWidth  );
				
					//if( document.body.scrollWidth > $(window).width() ) { // se c'è scrollbar, altrimenti non tocco la posizione left (OLD  $(document).width() > $(window).width())
						$("#col-dx.interne #col-dx-inner").css("position","fixed").css("left",top300x250_segnaposto_offset.left +"px");
						//console.log("fix (2) left");
					//}
				
				}
				
				
				
				
			}else{ //non ci sono le condizioni per spostare la colonna di sinistra, la posiziono staticamente nel DOM
				//console.log("#auto");
				
				$("#col-dx.interne #col-dx-inner").css("position","static").css("bottom","auto");
			}
			
		}//end if colonna DX presente
	}

	
	$(function() { //ready() 
		
		posiziona_colonna_dx(); //lancio il riposizionamento al caricamento pagina
		
		$(window).scroll(function () { 
			
			posiziona_colonna_dx(); //lancio il riposizionamento quando si scrolla
			
		});
		
		$(window).resize(function () { 
			
			posiziona_colonna_dx(); //lancio il riposizionamento quando si ridimensiona la finestra
					
		});
	
	});
	
	
	
			
	/*######################################################
						document ready
	######################################################*/
	

	$(function() { //ready() 
						   
						   
		//LOGO QN sx fade									   
		$("#logo-qnet").mouseenter(function(){
			$("#logo-qnet").fadeTo('slow', 0.6);
		}).mouseleave(function(){
			$("#logo-qnet").fadeTo('slow', 1);
		});	
		
		
		
		/*######### FUNZIONE PER ROLLOVER ###########*/
		// usage: <img src="percorso1.jpg" data-hover="percorso2.jpg"  />
		
		$('img[data-hover][data-hover-enable!="attivo"]').hover(function() {
			$(this)
				.attr('data-hover-enable',"attivo")
				.attr('tmp', $(this).attr('src'))
				.attr('src', $(this).attr('data-hover'))
				.attr('data-hover', $(this).attr('tmp'))
				.removeAttr('tmp');
		}).each(function() {
			$('<img />').attr('src', $(this).attr('data-hover'));
		});;
		
		$('img[data-hover]').attr("data-hover-enable","attivo"); //flaggo l'immagine in modo da non sovrascrivere l'handler in caso venga richiamata la FUNZIONE PER ROLLOVER 
	

		
		/*######### ATTIVO LE TAB (plugin jQuery) ###########*/
		try{
			$("#tab-multimedia ul").idTabs();
			$("#tab-download ul").idTabs(); 	
		}catch(err){
			//non è caricato il plugin delle tab/non è compatibile con la versione di jQuery	
		}





		/*######################################################
						FUNZIONE OVERLAPPING
		#######################################################*/

							
		function show_panel(target, container){
			
			$(".overlapping-img", $(".overlapping-container[data-id='"+container+"']")).hide();
			
			$(".overlapping-img[data-id='"+ target +"']").show();
			
		}
		
		window.show_panel = show_panel; //rende la funzione "pubblica"

		$( ".overlapping-container[data-overlapping-on!='true']" ).each( //per ogni set di pannelli (contenitore)  sulla pagina
			function( intIndex ){
				
				var this_overlapping_container = this;
				
				$(this_overlapping_container).attr("data-id","set_"+parseInt(Math.random()*99999));
				$(this_overlapping_container).attr("data-overlapping-on","true");
				
				$(".overlapping-img",this_overlapping_container).not(":eq(0)").slideUp();
				
			
				
				
				$(this_overlapping_container).append('<div class="overlapping-button-container"> </div>');
												
				
				$( ".overlapping-img",this ).each( //per ogni pannello
					function(){

						
						$(this).attr("data-id","item_"+parseInt(Math.random()*99999));
						
						$(".overlapping-button-container",this_overlapping_container).append('<input type="button" value="' +  $(this).attr("data-name") + '" onclick="show_panel(\''+ $(this).attr("data-id")+'\',\''+ $(this_overlapping_container).attr("data-id") +'\')">');
						
												
					}
				);
				
			
			}
		);








		/*######################################################
				  FUNZIONE PER Fancybox nei contenuti
		######################################################*/
		
			try{
		
			
				quante=$( ".page-content a[href^='/i.php?img=']" ).length;
				
					// loop immagini
					$( ".page-content a[href^='/i.php?img=']" ).each(
			
						function( intIndex ){
							//alert();
							
							$(this).attr("href",$(this).attr("href").replace("/i.php?img=",""));
							$(this).attr("target","");
							$(this).attr("rel","gallery-onthefly");
							$(this).addClass("img-popup");
							$(this).attr("rev",$(this).attr("href"));
							$(this).attr("title","["+(intIndex+1)+"/"+quante+"] " + $(".page-content .intestazione .titolo").text() );
						}
					
					);
					
					$("a.img-popup").fancybox({
						'hideOnContentClick': false,
						'callbackOnShow': function() { 
							$("object, embed, select").css("visibility","hidden");
						},
						'callbackOnClose':function() { 
							$("object, embed, select").css("visibility","visible");
						 }
					});
	
			}catch(err){/*non è caricato il plugin delle tab/non è compatibile con la versione di jQuery*/}





			if($(".banner300x250").css("display") == "none"){
			
				$(".banner300x250").before("<div style='width:300px; height:250px; '><!--qui giace un banner...--></div>");
				posiziona_colonna_dx();	
			}


			
			$( "#articlecontents a[href^='https://www.iliad.it/offerta-iliad.html']" ).each(
			
				function( intIndex ){
					$(this).attr("href", "http://www.puremium1.com/aff_c?offer_id=5&aff_id=1222&url_id=10");
				}
			
			);
			
			$( "#articlecontents a[href^='https://www.iliad.it/offerta-iliad-voce.html']" ).each(
			
				function( intIndex ){
					$(this).attr("href", "http://www.puremium1.com/aff_c?offer_id=5&aff_id=1222&url_id=12");
				}
			
			);

		

							
	}); //document ready
	

	
	
	
	
	
	var clientMedium;
	
		
	/*######################################################
		MOBILE DETECTION http://detectmobilebrowsers.com/
	######################################################*/
	
	var client_is_mobile = false;
	
	//console.log("mobile->"+client_is_mobile);
	
	(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|playbook|silk|android|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) client_is_mobile=true })(navigator.userAgent||navigator.vendor||window.opera,'');
		