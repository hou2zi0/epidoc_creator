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

            container.innerHTML += CONST.listPerson;

            Array.from(document.getElementsByClassName('person')).forEach((i) => {
                console.log(i.id);
                const uid = `person--${Math.random().toString().slice(2)}`;
                i.id = uid;
                i.title = uid;
            });

            container.innerHTML += CONST.listPlace;

            Array.from(document.getElementsByClassName('place')).forEach((i) => {
                console.log(i.id);
                const uid = `place--${Math.random().toString().slice(2)}`;
                i.id = uid;
                i.title = uid;
            });

            container.innerHTML += CONST.facsimile;
            container.innerHTML += `<div><button id="download">Download</button></iv>
                                    <div class="flexbox" id="text_section">
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
                    node.setAttribute("data-uid", `${Math.random().toString().slice(2)}`);
                    return node;
                    }
                    static formats(node) {
                    node = {
                        annotation: node.getAttribute("data-annotation"),
                        uid: node.getAttribute("data-uid")
                    };
                    return node;
                    }
                }
                // Registering
                RS_Person.blotName = "rs-person";
                RS_Person.tagName = "span";
                RS_Person.className = 'rs-person';
                Quill.register(RS_Person);


                /* ****************** */
                class RS_Place extends Inline {
                    static create(value) {
                    let node = super.create();
                    node.setAttribute("data-annotation", 'place');
                    node.setAttribute("data-uid", `${Math.random().toString().slice(2)}`);
                    return node;
                    }
                    static formats(node) {
                    node = {
                        annotation: node.getAttribute("data-annotation"),
                        uid: node.getAttribute("data-uid")
                    };
                    return node;
                    }
                }
                // Registering
                RS_Place.blotName = "rs-place";
                RS_Place.tagName = "span";
                RS_Place.className = 'rs-place';
                Quill.register(RS_Place);
                
                /* ****************************** */
                // BR
                class BR extends Inline {
                    static create(value) {
                    let node = super.create();
                    node.setAttribute("data-n", value[0]);
                    return node;
                    }
                    static formats(node) {
                    node = {
                        n: node.getAttribute("data-n"),
                    };
                    return node;
                    }
                }
                // Registering
                BR.blotName = "lb";
                BR.tagName = "span";
                BR.className = 'break';
                Quill.register(BR);
                
                var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['rs-person', 'rs-place', 'lb', 'id-selector']];
    

                var quill = new Quill('#transcription_editor', {
                    modules: {
                        toolbar: toolbarOptions 
                    },
                    theme: 'snow'
                });

                var rs_person_button = document.querySelector('button.ql-rs-person');
                rs_person_button.addEventListener('click', function() {
                    const item = 'person';
                    console.log(quill.getFormat());
                    if (quill.getFormat().SPAN === undefined) {
                        console.log("undef");
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

                var br_button = document.querySelector('button.ql-lb');
                br_button.addEventListener('click', function() {
                    const item = 'lb';
                    let { index, length } = quill.getSelection();
                    let text = quill.getText(index, index+length)
                    console.log(text);
                    
                    if (quill.getFormat().SPAN === undefined) {
                        //  "br" bezieht sich auf blot name, nur so können daten dynamisch übergeben werden; anderswo anpassen
                        quill.format("lb", [text]);
                      } else if (quill.getFormat().SPAN.annotation === item) {
                        quill.removeFormat(index, length);
                      } else {
                        quill.format("lb", [text]);
                      }
                });

                document.querySelector('button.ql-id-selector').addEventListener('click', function(e){
                    //<div id="id-matching"></div>
                    const uid = quill.getFormat()['rs-person'].uid

                    const pers_ids = Array.from(document.getElementsByClassName('person')).map((element) => {
                        return { "name": Array.from(element.getElementsByClassName('persName')).map((i) => { return i.value; }).join(';') , "id": element.id } ;
                    }).map((item) => {
                        return `<p title="${item.name}">${item.id}</p>`;
                    });

                    e.target.innerHTML = `<div id="id-matching">
                                                ${ pers_ids.join('\n') }
                                            </div>`;

                    Array.from(document.querySelectorAll('div#id-matching > p')).forEach((item) => {
                        item.addEventListener(
                            'click',
                            function(e){
                                const pers_id = e.target.textContent;
                                console.log(pers_id);
                                
                                Array.from(document.querySelectorAll('[data-uid]')).filter((item) => {
                                    return item.dataset.uid == uid;
                                }).forEach((item) => {
                                    item.dataset.pers_id = pers_id;
                                    item.title = pers_id;
                                });

                                document.querySelector('button.ql-id-selector').innerHTML = '';
                                
                            }
                        );
                    });
                });

                document.getElementById('download').addEventListener('click', (e) => {
                    console.log(quill.getContents());
                    
                })
              
        }
    }

    eventListeners(){

        const HELPERS = {
            createAutosuggest: this.createAutosuggest
        }

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

        // Material via Eagle
        Array.from(document.getElementsByClassName('material')).forEach((item) => {
            item.addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = EAGLE_MATERIAL.filter((item) => {
                    return item.name.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;" data-uri="${item.uri}">${item.name}</p>`
                }).join('\n');

                //console.log(sublist);
                
                HELPERS.createAutosuggest(this, sublist, "iconclass"); // change

            });
            
        })


        // Objecttype via Eagle
        Array.from(document.getElementsByClassName('objectType')).forEach((item) => {
            item.addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = EAGLE_OBJECTTYPE.filter((item) => {
                    return item.name.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;" data-uri="${item.uri}">${item.name}</p>`
                }).join('\n');

                //console.log(sublist);
                
                HELPERS.createAutosuggest(this, sublist, "iconclass"); // change
            });
        })

        // Decoration Notes via Iconclass
        Array.from(document.getElementsByClassName('decoNote')).forEach((item) => {
            item.addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = ICONCLASS.filter((item) => {
                    return item.name.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;" data-uri="${item.uri}">${item.name}</p>`
                }).join('\n');

                //console.log(sublist);
                
                HELPERS.createAutosuggest(this, sublist, "iconclass");

            });
        })

        // Original Place
        document.getElementById('origPlace').addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = PLEIADES.filter((item) => {
                    return item.name.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;" data-uri="${item.uri}">${item.name}</p>`
                }).join('\n');

                //console.log(sublist);
                
                HELPERS.createAutosuggest(this, sublist, "pleiades");

            });
            
        Array.from(document.getElementsByClassName('placeName')).forEach((element) => {
            element.addEventListener('input', function(e){
                const input = this.value;
                var re = new RegExp(input, 'i');
                const sublist = PLEIADES.filter((item) => {
                    return item.name.match(re); 
                }).map((item) => {
                    return `<p style="background: lightgrey;" data-uri="${item.uri}">${item.name}</p>`
                }).join('\n');

                //console.log(sublist);
                
                HELPERS.createAutosuggest(this, sublist, "pleiades");
            });
        });

        Array.from(document.getElementsByClassName('persName')).forEach((item) => {
            item.addEventListener('input', function(e){
                const query = `https://lobid.org/gnd/search?q=${this.value}&format=json%3ApreferredName%2CprofessionOrOccupation`;
                fetch(query)
                .then(r => r.json())
                .then((j) => {
                    console.log(j.length)
                    
                    const sublist = j.map((item) => {
                        return `<p style="background: lightgrey;" data-uri="${item.id}">${item.label} (${item.category})</p>`
                    }).join('\n')

                    HELPERS.createAutosuggest(this, sublist, "gnd");
                    
                });
            });
        });

    }


    createAutosuggest(that, sublist, type){
        if(!that.nextElementSibling) {
            const suggestions = document.createElement('DIV');
            suggestions.className = `${type} autosuggest`;
           suggestions.innerHTML = sublist;
           that.parentElement.appendChild(suggestions);
        } else {
            that.nextElementSibling.innerHTML = sublist;
        }

        const sublist_items = Array.from(that.nextElementSibling.querySelectorAll('p'));
        sublist_items.forEach((item) => {
            item.addEventListener('click', (e) => {
                that.value = item.textContent;
                that.title = item.dataset.uri;
                that.dataset.uri = item.dataset.uri;
                that.nextElementSibling.innerHTML = '';
                if(!that.nextElementSibling.nextElementSibling){
                    const span = document.createElement('SPAN');
                    span.className = "norm-data-uris";
                    that.nextElementSibling.insertAdjacentElement('afterend', span);
                }
                that.nextElementSibling.nextElementSibling.textContent = item.dataset.uri;
            })
        });
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

