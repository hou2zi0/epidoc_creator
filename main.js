class EED {
    constructor(id) {
      this.id = id;
      this.setup();
      this.eventListeners();
    }
      

    setup(){
        const container = document.getElementById(this.id);
        if (container == null){
            console.log('Error: ID not found.');
        } else {
            const fileDesc = this.div({"id": "fileDesc", "classes": "blr"});
            fileDesc.innerHTML += CONST.titleStmt;
            fileDesc.innerHTML += CONST.publicationStmt;

            const sourceDesc = this.div({"id": "sourceDesc", "classes": "blg"});
            sourceDesc.innerHTML += CONST.msIdentifier;
            sourceDesc.innerHTML += CONST.supportDesc;
            sourceDesc.innerHTML += CONST.layoutDEsc;
            sourceDesc.innerHTML += CONST.handDesc;
            sourceDesc.innerHTML += CONST.scriptDesc;
            sourceDesc.innerHTML += CONST.decoDesc;
            sourceDesc.innerHTML += CONST.history;

            fileDesc.innerHTML += sourceDesc.outerHTML;
            container.appendChild(fileDesc);

            container.innerHTML += CONST.facsimile;
            container.innerHTML += `<div class="flexbox" id="text_section">
                                        <div id="transcription">
                                            <div id="transcription_editor">
                                                <p>Hello World!</p>
                                                <p>Some initial <strong>bold</strong> text</p>
                                                <p><br></p>
                                            </div>
                                        </div>
                                        <div id="counter"></div>
                                        <div id="img">
                                            <div id="leaflet">
                                        </div></div>
                                    </div>`;
            
            const text_body = this.div({"id": "text_body", "classes": "blr"});
            text_body.innerHTML += CONST.apparatus;
            text_body.innerHTML += CONST.translation;
            text_body.innerHTML += CONST.commentary;
            text_body.innerHTML += CONST.bibliography;
            container.innerHTML += text_body.outerHTML;

            let image;

            Array.from(document.getElementsByClassName('graphic_button')).forEach((element) => {
                element.addEventListener('click', (e) => {
                    
                    const url = e.target.previousElementSibling.value.trim();

                    if (url.match(/^http[s]{0,1}:\/\//i)){
                        //document.getElementById('img').innerHTML = `<img class="facsimile" src="${url}">`;

                        if(image){
                            console.log(`Removed image ${image._url}`);
                            image.removeFrom(mymap);
                        }

                        var bounds = [
                            [0, 0],
                            [100,100]
                          ];

                        image = L.imageOverlay(url, bounds, {
                            crossOrigin: false
                          });

                        image.addTo(mymap);
                        image.setBounds(bounds);
                        mymap.fitBounds(bounds);

                        image.addEventListener("load", (e) => {
                            console.log(`The images natural bounds are:\n\tHeight:\t${image._image.naturalHeight} pixel\n\tWidth:\t${image._image.naturalWidth} pixel`);
                            bounds = [
                              [0, 0],
                              [image._image.naturalHeight, image._image.naturalWidth]
                            ];
                            image.setBounds(bounds);
                            mymap.fitBounds(bounds);
                        });
                        
                    }        
                } )
            });

            var mymap = L.map('leaflet', {
                crs: L.CRS.Simple,
                minZoom: -5,
              });

              //

                let Inline = Quill.import('blots/inline');
                let Block = Quill.import('blots/block');
                let BlockEmbed = Quill.import('blots/block/embed');

                //
                // Provide markup functionality for buttons
                //
                class RS_Person extends Inline {
                    static create(value) {
                    let node = super.create();
                    node.setAttribute("data-annotation", 'person');
                    return node;
                    }
                    static formats(node) {
                    node = {
                        annotation: node.getAttribute("data-annotation"),
                    };
                    return node;
                    }
                }
                // Registering
                RS_Person.blotName = "rs-person";
                RS_Person.tagName = "span";
                RS_Person.className = 'rs-person';
                Quill.register(RS_Person);

                class RS_Place extends Inline {
                    static create(value) {
                    let node = super.create();
                    node.setAttribute("data-annotation", 'place');
                    return node;
                    }
                    static formats(node) {
                    node = {
                        annotation: node.getAttribute("data-annotation"),
                    };
                    return node;
                    }
                }
                // Registering
                RS_Place.blotName = "rs-place";
                RS_Place.tagName = "span";
                RS_Place.className = 'rs-place';
                Quill.register(RS_Place);
                
                // BR
                class BR extends Inline {
                    static create(value) {
                    let node = super.create();
                    node.setAttribute("data-annotation", 'br');
                    return node;
                    }
                    static formats(node) {
                    node = {
                        annotation: node.getAttribute("data-annotation"),
                    };
                    return node;
                    }
                }
                // Registering
                BR.blotName = "br";
                BR.tagName = "span";
                BR.className = 'break';
                Quill.register(BR);
                
                var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['rs-person', 'rs-place', 'br']];
    

                var quill = new Quill('#transcription_editor', {
                    modules: {
                        toolbar: toolbarOptions 
                    },
                    theme: 'snow'
                });

                var rs_person_button = document.querySelector('button.ql-rs-person');
                rs_person_button.addEventListener('click', function() {
                    const item = 'person';
                    console.log(quill.getFormat().SPAN);
                    if (quill.getFormat().SPAN === undefined) {
                        console.log("undef");
                        console.log(quill.getSelection());
                        
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index + length]);
                      } else if (quill.getFormat().SPAN.annotation === item) {
                        let { index, length } = quill.getSelection();
                        quill.removeFormat(index, length);
                      } else {
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index + length]);
                      }
                });

                var rs_place_button = document.querySelector('button.ql-rs-place');
                rs_place_button.addEventListener('click', function() {
                    const item = 'place';
                    console.log(quill.getFormat().SPAN);
                    if (quill.getFormat().SPAN === undefined) {
                        console.log("undef");
                        console.log(quill.getSelection());
                        
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index + length]);
                      } else if (quill.getFormat().SPAN.annotation === item) {
                        let { index, length } = quill.getSelection();
                        quill.removeFormat(index, length);
                      } else {
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index + length]);
                      }
                });

                var br_button = document.querySelector('button.ql-br');
                br_button.addEventListener('click', function() {
                    const item = 'br';
                    console.log(quill.getFormat().SPAN);
                    if (quill.getFormat().SPAN === undefined) {
                        console.log("undef");
                        console.log(quill.getSelection());
                        
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index]);
                      } else if (quill.getFormat().SPAN.annotation === item) {
                        let { index, length } = quill.getSelection();
                        quill.removeFormat(index, length);
                      } else {
                        let { index, length } = quill.getSelection();
                        quill.format("SPAN", [item, index, index]);
                      }
                });

              
        }
    }

    eventListeners(){

        Array.from(document.querySelectorAll('input')).forEach((item) => {
            item.addEventListener('focus', function(e){
                Array.from(document.getElementsByClassName('autosuggest')).forEach((element) => {
                    element.innerHTML = ''; 
                });
            });

            item.addEventListener('keyup', function(e){
                if(e.key == 'Escape'){
                    if(e.target.nextElementSibling){
                        e.target.nextElementSibling.innerHTML = ''; 
                    }
                }
            });
        });



        Array.from(document.getElementsByClassName('decoNote')).forEach((item) => {
            item.addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = DATA.iconclass.filter((item) => {
                    return item.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;">${item}</p>`
                }).join('\n');

                //console.log(sublist);
                
                if(!this.nextElementSibling) {
                    const iconclass_suggestions = document.createElement('DIV');
                    iconclass_suggestions.className = "iconclass autosuggest";
                    iconclass_suggestions.innerHTML = sublist;
                    this.parentElement.appendChild(iconclass_suggestions);
                } else {
                    this.nextElementSibling.innerHTML = sublist;
                }

                const sublist_items = Array.from(this.nextElementSibling.querySelectorAll('p'));
                sublist_items.forEach((item) => {
                    item.addEventListener('click', (e) => {
                        this.value = item.textContent;
                        this.nextElementSibling.innerHTML = '';
                    })
                });

            });
        })
    }


    div(config){
        const div = document.createElement('DIV');
        if (config.id){
            div.id = config.id;
        }
        if (config.classes){
            div.className = config.classes;
        }
        return div 
    }
  }


  var eed = new EED('epidoc'); 

