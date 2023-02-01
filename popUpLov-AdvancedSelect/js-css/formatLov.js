
// Atribuir valor para POP LOV
function setValuePOPLOV(itemId, value, displayValue, suprimirAlteracao) {
    apex.item(itemId).setValue(value, displayValue, suprimirAlteracao ?? false);
}

// ITEM LOV POP UP - Organizar Menu

function organizeMenuLov(nomeLov, numeroPagina, classMenuSelect, window) {
    //Capturo todos os objetos do list
    let linha = document.querySelectorAll(
        "#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul li:not([menu-id])"
    );
    
    var iframe
    let iframeLen
    var innerDoc
    let itemLov
    let itemLovIsMulti

    try {
        iframe = document.getElementsByTagName('iframe');
        iframeLen = iframe.length - 1
        innerDoc = iframe[iframeLen].contentDocument || iframe[iframeLen].contentWindow.document;

        itemLov = innerDoc.getElementById(nomeLov)
        itemLovIsMulti = $(itemLov).closest('li.apex-item-multi-item') ? true : false
    } catch (error) {
        itemLov = $(`#${nomeLov}`)
        itemLovIsMulti = $(itemLov).closest('li.apex-item-multi-item') ? true : false
        
    }
    


    const eventRemove = () => {
        // Map nos elementos que estão adicionados no input(Selecionados) e adicionamos um event no click do remove do elemento
        $.map(
            window.$(`#${nomeLov}`)
                .closest("ul.apex-item-multi")
                .find("li[data-value] .icon-multi-remove"),
            function(e) {
                //Adiconamos o event listener no elemento
                $(e).on('click', function(){
                    // armazena todos os li's que já possuem a classe de estilização
                    let liCheck = $('#PopupLov_' + numeroPagina + '_' + nomeLov + '_dlg ul li.liCheck')
                    //armazenamos as checks que deverão ser marcadas
                    let arrCheck = new Set()
                    // elemento acionador
                    let pThis = this
                    
                    //map para alimentar os valores que ainda devem permanecer selecionados
                    $.map(window.$(`#${nomeLov}`)
                            .closest("ul.apex-item-multi")
                            .find("li[data-value]"),
                        function(e) {  

                            // Se o elemento acionador for diferente do elemento que já existe na lista, ai sim adiciono para ele permanecer marcado  
                            $(pThis).closest('li').data('value') != $(e).data('value')
                                ? arrCheck.add($(e).data('value'))
                                : null
                        }
                    )


                    // defino a prop checked 
                    liCheck.map((e) => {
                        $(liCheck[e]).prev().prop('checked', arrCheck.has($(liCheck[e]).data('id')))
                        
                    })
                })
            }
        )
         
    }

    const aplicaCheck = () => {
        if (itemLovIsMulti) {
            function eventCheckBoxLov(pThis) {
                let returnValue = new Set();
                let displayValue = [];
        
                let validaChecked = $(pThis).is(':checked');
                let checkId = $(pThis).data('id')
                let checkDisplay = $(pThis).next()[0].innerText
        
                // pega os valores que já estao na lov
                let valueLov = $(itemLov)
                    .closest("ul.apex-item-multi")
                    .find("li[data-value]")
                    .not(`[data-value="${checkId}"]`) ?? $(document.getElementById(nomeLov).closest('ul.apex-item-multi')).find('li[data-value]');
                
               
            
                // passa eles para os arrays
                for (let i = 0; i < valueLov.length; i++) {
                    const element = $(valueLov[i]);
        
                    returnValue.add(element.attr("data-value"));
                    displayValue.push(element.text());                
                    
                }
                
                if (validaChecked) {
                    returnValue.add(checkId)
                    displayValue.push(checkDisplay)
                }
                
                // Seto os valores
                window.setValuePOPLOV(nomeLov, Array.from(returnValue), Array.from(displayValue));
        
                // Evento no x dos elementos selecionados no input
                eventRemove()
            
                // Ajusto o Cabeçalho
                window.$("#" + nomeLov + "_CONTAINER").addClass("is-active");
            };
            // Resgato todos os elementos que não contém a classe liCheck, pois só preciso deles para organizar o layout 
            let li = top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + '_dlg ul li').not('.liCheck')
            
            //Adiciono uma classe na Ul do componente para tirar o evento somente desse componente
            li.closest('ul').addClass('ulCheck');

            // Neste map, realizo a criação da linha do componente com check
            li.map((e) => {
                let cssStyleCheckBox = 
                    "margin-left: 1.5rem;";

                let cssStyleDiv =
                    "display: flex; align-items: center;";

                let cssStyleSubMenu =
                    {"border-width": "0.01px", "border-style": "solid", "display": "flex", "padding": "8px 12px", "justify-content": "start", "text-indent": "0px", "margin-left": "3px", "align-items": "center"};
                
                //Clono o item atual
                let item = $(li[e]).clone();
                item.addClass('liCheck')
                item.css(cssStyleSubMenu);        

                //crio o componente de checkbox
                let checkboxChild = document.createElement('input');
                checkboxChild.setAttribute("type", "checkbox");
                checkboxChild.setAttribute("class", "form-check-input lovCheck");
                checkboxChild.setAttribute("style", cssStyleCheckBox);
                checkboxChild.setAttribute("data-id", item.data('id'))
                checkboxChild.setAttribute("menu-id", item.attr('menu-id'))
                //adiciono o evento no onclick
                checkboxChild.addEventListener('click', function(e){
                    eventCheckBoxLov(this, nomeLov)
                });

                //adiciono o evento para quando clicar na li adicionar true na prop checkbox
                item[0].addEventListener('click', function(e){
                    
                    $(this).prev().click()
                    e.stopPropagation()
                })

                //crio o elemento div que envolve os demais elementos input e li
                let div = document.createElement('div');    
                div.append(checkboxChild);
                div.append(item[0]);

                div.setAttribute('style', cssStyleDiv)
                div.setAttribute('menu-id', item.attr('menu-id'))
                
                $(li[e]).after(div);
                $(li[e]).remove();

                //marcamos as checks que já existem no item
                $.map(
                    window
                        .$(`#${nomeLov}`)
                        .closest("ul.apex-item-multi")
                        .find("li[data-value]"),
                    function(e){
                        $('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg ul li.liCheck[data-id="${$(e).data('value')}"]`).prev().prop('checked', true)
                    }
                )
            })
        }
    }
    //Zmb - 08/12/2022 FIM

    /*
        ZMB - 19/01/2023
    */
    try {
        $(itemLov).closest('.apex-item-multi')[0]
            .addEventListener(
                'keydown',
                (e) => {
                    //Verifico se foi pressionado o backspace e atualizo as checkbox
                    if (e.keyCode == 8){
                        
                        top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg ul li.liCheck[data-id]`).prev().prop('checked', false)
    
                        $.map(
                            window
                                .$(`#${nomeLov}`)
                                .closest("ul.apex-item-multi")
                                .find("li[data-value]"),
                            function(e){
                                top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg ul li.liCheck[data-id="${$(e).data('value')}"]`).prev().prop('checked', true)
                            }
                        )                    
                    }
                }
            )
        
    } catch (error) {
        null;
    }

    /*
        ZMB - 19/01/2023 FIM
    */


    //adiciono a função no menu
    if (classMenuSelect) {
        //Css Nos Menus
        $("#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul span").css(
            "cursor",
            "pointer"
        );
        // Evento de OnCLick nos menus pais
        
        $("#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul span").on(
            "click",
            function () {
                let returnValue = [];
                let displayValue = [];

                // pega os valores que já estao na lov
                let valueLov = window
                    .$(`#${nomeLov}`)
                    .closest("ul.apex-item-multi")
                    .find("li[data-value]");

                    
                // passa eles para os arrays
                for (let i = 0; i < valueLov.length; i++) {
                    const element = $(valueLov[i]);
                    returnValue.push(element.attr("data-value"));
                    displayValue.push(element.text());
                }
                // Capturo todos os filhos
                let childElements = $(this)
                    .parent()
                    .find('li[menu-id="' + $(this).attr("menu-id") + '"]');



                // Alimento o Array com os Valores do menu atual clicado
                childElements.map((e) => {
                    // verifica se o valor já esta no array
                    let id = String($(childElements[e]).data("id"));
                    if (!returnValue.includes(id)) {
                        returnValue.push(id);
                        displayValue.push($(childElements[e]).text());
                    }

                    //Zmb - 08/12/2022 
                    if (itemLovIsMulti) {
                        $(childElements[e]).prev().prop('checked', true)
                    }
                    //Zmb - 08/12/2022 FIM
                });

                // Seto os valores
                window.setValuePOPLOV(nomeLov, returnValue, displayValue);

                 //Zmb - 08/12/2022
                 if (itemLovIsMulti) {
                    // Evento no x dos elementos selecionados no input
                    eventRemove()
                }
                //Zmb - 08/12/2022 FIM

                // Ajusto o Cabeçalho
                window.$("#" + nomeLov + "_CONTAINER").addClass("is-active");
            }
        );
        
    }
    //variavel Menu, Irá sempre ser alimentada pelo Menu Coletado da linha
    let menu = "";
    //Variavel que será alimentada caso for a primeira vez do loop, ou for != da variavel menu
    let menu_atual = "";
    //De Fato, a String do Submenu  || Menu -> SubMenu
    let menu_filho = "";
    // Css da Linha do Menu
    let cssStyleMenu =
        "font-weight: bold; border-width: 0.01px; border-style: solid; display: flex; padding: 8px 12px; ";
    //Css Da Linha do SubMenu
    let cssStyleSubMenu =
        "text-indent: 3rem; border-width: 2px; border-style: solid; border-color: lightgrey;";

    try {
        //COntador apenas para dizer a sequencia dos menus
        let cont = 0;
        linha.forEach(function (e) {
            //Pego a Linha com Menu e Sub Menu Junto
            let t = e.innerText;
            // Faço o IF, para ver se preciso executar a lógica ou o que esta renderizado ainda não foi tratado
            if (t.indexOf("<groupRow>") >= 0) {
                //Coleto Somente a Descrição do Menu
                menu = t
                    .substr(
                        t.indexOf("<groupRow>"),
                        t.indexOf("</groupRow>")
                    )
                    .replaceAll("<groupRow>", "");
                // COleto a Descrição do Menu Filho
                menu_filho = t
                    .substr(t.indexOf("</groupRow>"))
                    .replaceAll("</groupRow>", "");

                // Caso for a primeira Vez
                if (menu_atual.length <= 0) {
                    //alimento o contador
                    cont += 1;
                    //Alimento com o menu coletado acima, preciso disso para verificar diferenças entre o ultimo menu inserido e o próximo
                    menu_atual = menu;
                    // Crio o Element Span
                    let novoTitulo = document.createElement("span");

                    //Texto do Elemento
                    $.parseHTML(menu_atual).map((e) => {
                        //Inclui o Elemento
                        novoTitulo.appendChild(e);
                    })

                    //Atributo Css
                    novoTitulo.setAttribute("style", cssStyleMenu);
                    //atributo de contador
                    novoTitulo.setAttribute("menu-id", cont);
                    // Insiro ANTES da linha
                    e.before($(novoTitulo)[0]);
                } else if (menu_atual != menu) {
                    //alimento o contador
                    cont += 1;
                    //Alimento com o menu coletado acima, preciso disso para verificar diferenças entre o ultimo menu inserido e o próximo
                    menu_atual = menu;
                    // Crio o Element Span
                    let novoTitulo = document.createElement("span");
                    
                    //Texto do Elemento
                    $.parseHTML(menu_atual).map((e) => {
                        // //Inclui o Elemento
                        novoTitulo.appendChild(e);
                    })

                    //Atributo Css
                    novoTitulo.setAttribute("style", cssStyleMenu);
                    //atributo de contador
                    novoTitulo.setAttribute("menu-id", cont);
                    // Insiro ANTES da linha
                    e.before($(novoTitulo)[0]);
                }

                // REFATORO A LINHA COM O TEXTO CORRETO DO SUBMENU
                e.innerText = "";
                $.parseHTML(menu_filho).map((element) => {
                    // //Inclui o Elemento
                    e.appendChild(element);
                })

                // APLICO O RECUO
                e.setAttribute("style", cssStyleSubMenu);
                e.setAttribute("menu-id", cont);
            }
        });

        //Zmb - 08/12/2022 
        if (itemLovIsMulti) {
            aplicaCheck()
        }
        //Zmb - 08/12/2022 FIM
    } catch (error) {
        console.warn(error);
    }
}

// roda no inicio da página procurando .organizeMenuLov e crriando o observer
function formatLov(){
    function observeLOVS(mutations) {
        let lovs = $(".organizeMenuLov");
        // para cada lov fica procurando se foi gerado o seu dialog
        for (let i = 0; i < lovs.length; i++) {
            const element = lovs[i];
            //Verifico seexiste a classe para selecionar pelo menu
            const classMenuSelect = $(element).hasClass("menuSelectChild");

            let id = element.id;
            let pageId = id.substr(1, id.indexOf("_") - 1);

            let dialog = "#PopupLov_" + pageId + "_" + id + "_dlg ul";

            let elementToObserve = top.document.querySelector(dialog);
            // se encontra o dialog do lov aplica o observador nele pra organizar a cada mudança
            if (elementToObserve) {
                let aplicaOrganizeMenuLovs = new MutationObserver(function (
                    mutations
                ) {
                    top.organizeMenuLov(id, pageId, classMenuSelect, window);
                });

                try {
                    aplicaOrganizeMenuLovs.observe(elementToObserve, {
                        childList: true,
                    });
                } catch (error) {
                    continue;
                }
            }
        }
    }

    //cria um observador no DOM provurando as $('.organizaMenuLov')

    let DOMobserver = new MutationObserver(function (mutations) {
        observeLOVS(mutations);
    });

    try {
        DOMobserver.observe(document, {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true,
        });
    } catch (error) {
        console.log(error);
    }

    // aplica as mudanças do displayValue
    let lovs = $(".organizeMenuLov");
    for (let i = 0; i < lovs.length; i++) {
        const element = lovs[i];

        let id = element.id;
        $(`#${id}`)
            .change(function (event) {
                //para os multi value
                if (
                    $(this).parent().is("li") &&
                    $(this).parent().hasClass("apex-item-multi-item")
                ) {
                    //cria o observer para cuidar a lista dos multivalues
                    let lista = $(this).closest("ul");

                    let observer = new MutationObserver(function (mutations) {
                        for (let i = 0; i < lista.children().length; i++) {
                            const element = $(lista.children()[i]);
                            // verifica se é o spam e tem menu pai
                            if (
                                element.children().is("span") &&
                                element
                                    .children()
                                    .text()
                                    .includes("</groupRow>")
                            ) {
                                let botao = element.children().find("button");
                                element
                                    .children()
                                    .text(
                                        element
                                            .children()
                                            .text()
                                            .split("</groupRow>")[1]
                                    );
                                element.children().append(botao);
                            }
                        }
                    });
                    try {
                        observer.observe(lista[0], {
                            childList: true,
                            subtree: true,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                // para os normais
                else {
                    // pega o displayValue
                    let displayValue = event.target.value.includes(
                        "</groupRow>"
                    )
                        ? event.target.value.split("</groupRow>")[1]
                        : event.target.value;

                    // seta o valor no LOV
                    $(`#${id}`).val(displayValue);
                }
            })
            .change(); // esse ".change()" é para rodar no ready também;
    }
}

$(
    formatLov()
)