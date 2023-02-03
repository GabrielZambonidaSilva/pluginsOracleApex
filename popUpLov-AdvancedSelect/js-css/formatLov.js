// ITEM LOV POP UP - Organizar Menu

const getNodeElem = (type) => {
    return document.createElement(type)
}

const setAttributesNode = (elem, attrs) => {
    for(var key in attrs) {
        elem.setAttribute(key, attrs[key]);
    }

    return elem
}

// Atribuir valor para POP LOV
function setValuePOPLOVItem(itemId, value, displayValue, suprimirAlteracao) {
    apex.item(itemId).setValue(value, displayValue, suprimirAlteracao ?? false);
}

//coleto o contexto
let iframe
let iframeLen
let innerDoc

const setContextElem = () => {
    try {
        iframe = document.getElementsByTagName('iframe');
        iframeLen = iframe.length - 1
        innerDoc = iframe[iframeLen].contentDocument || iframe[iframeLen].contentWindow.document;
    } catch (e) {
        null
    }
}

//item Lov
let itemLov
//Item lov se for multi columns
let itemLovIsMulti

/**
 * @param {Number} numeroPagina - Número da Página
 * @param {String} nomeLov - Nome da LOVPOPup
 * @param {Node} buttonElem - Botão já existente no componente

*/
const getButtonAction = (numeroPagina, nomeLov, buttonElem) => {
        
    // tipo de ação a realizar -  true = considerar marcados , false = não considerar
    let type = buttonElem ? buttonElem.attr('check') == 'true' : true
    let buttonExist = top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg button.button-action`)?.length > 0 
    
    // Parametros do Botão com base no tipo da acao a ser realizada
    let buttonStyle = {
        "type": "button",
        "check": !type,  
        "class": `t-Button button-action ${type ? 'u-success-border' : 'u-danger-border'}`,  
        "title": `${type ? 'Considerar Marcados' : 'Não Considerar Marcados'}`,
        "onclick": `getButtonAction(${numeroPagina}, '${nomeLov}', $(this))`,
        "style": "margin-left: var(--oj-toolbar-button-margin, .5rem)"
    }
   
    let spanStyle = {
        "class": `fa ${type ? 'fa-clipboard-check u-success-text' : 'fa-clipboard-ban u-danger-text'}`
    }

    //MENSAGEM QUANDO SELECIONADO OS NÃO MARCADOS
    let divMessageStyle = {
        "class": "messageCheck",
        "title": "Os itens marcados nesse modo, são desconsiderados da filtragem",
        "style": "padding: 1rem; display: flex; justify-content: center; margin: .5rem; position: sticky; background-color: #ff9e9e; font-weight: bold; border-radius: 2rem;"
    }
    let divMessage = setAttributesNode(getNodeElem('div'), divMessageStyle)
    
    let pMessage = getNodeElem('p')
    pMessage.innerText = 'Todos Exceto os Selecionados'

    divMessage.append(pMessage)

    !type 
        ? $(buttonElem).closest('.a-PopupLOV-dialog').find('.a-PopupLOV-searchBar').after(divMessage)
        : $(buttonElem).closest('.a-PopupLOV-dialog').find('div.messageCheck').remove()
        
    // FIM MENSAGEM

    //CRIAÇÃO DO BOTÃO
    const buttonNode = () => {            

        const button = setAttributesNode(getNodeElem('button'), buttonStyle)
        const span = setAttributesNode(getNodeElem('span'), spanStyle)

        button.appendChild(
            span
        )

        return button
    } 

    //CASO EXISTA O BOTÃO, REALIZO A AÇÃO DE ESTILIZAÇÃO
    if (buttonElem?.length > 0) {
        setAttributesNode(buttonElem[0], buttonStyle)
        setAttributesNode(buttonElem[0].firstChild, spanStyle)            
    } else if (buttonExist == false){
        top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg .a-PopupLOV-searchBar`).append(            
                buttonNode()              
            )
    } 

    // // Definimos o parametro NOT no inicio do Componente quando a condição assim atender
    let valueLov = $(
                        (
                            document.getElementById(nomeLov)?.closest('ul.apex-item-multi') ?? innerDoc?.getElementById(nomeLov).closest('ul.apex-item-multi')
                        )
                    ).find(`li[data-value]:not('[data-value="NOT"]')`)

    let returnValue = []
    let displayValue = []

    for (let i = 0; i < valueLov.length; i++) {
        const element = $(valueLov[i]);
        
        // if (element.attr("data-value") != 'NOT') {
            returnValue.push(element.attr("data-value"));
            displayValue.push(element.text());
        // } 
        
    }
        
    setValuesLOV(displayValue, returnValue, nomeLov, numeroPagina)

}

/*
FIM ZMB - 02/02/2023
*/

/**
 * 
 * @param {Array} displayValues - Valores de Display desejados para LOV
 * @param {Array} returnValues - Valores de Retorno desejados para a LOV 
 * @param {String} nomeLov - Nome do Item Lov
 * @param {Number} numeroPagina - Número da Página
 */
const setValuesLOV = (displayValues, returnValues, nomeLov, numeroPagina) => {
    
    let type = top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg button.button-action`).attr('check') == 'true' 

    let returnLov = !type ? [...returnValues] :  ['NOT', ...returnValues] 
    let displayLov =  !type ? [...displayValues] :  ['NOT', ...displayValues] 
    
    console.log(!type)
    console.log(returnLov)
    setContextElem()
    // Seto os valores
    window.setValuePOPLOVItem(innerDoc?.getElementById(nomeLov) ?? document.getElementById(nomeLov), Array.from(returnLov), Array.from(displayLov));

    //Aplico Evento no X
    eventRemove(numeroPagina, nomeLov)
    //Removo o ITEM da Visualização
    $(itemLov).closest('ul.apex-item-multi').find('.apex-item-multi-item[data-value="NOT"]').css('display', 'none')
    //Atrelo o Label 
    let elemLabel = $((document.getElementById(nomeLov)?.closest('div.t-Form-fieldContainer') ?? innerDoc?.getElementById(nomeLov).closest('div.t-Form-fieldContainer'))).find('div.t-Form-labelContainer label.t-Form-label')
    let labelAtual = elemLabel.text()
    let labelNaoSelecionados = ' - Todos Exceto os Selecionados'
  
    if (!type) {
        elemLabel.text(labelAtual.replace(labelNaoSelecionados, ''))
    } else {
        elemLabel.text(labelAtual.replace(labelNaoSelecionados, '') + labelNaoSelecionados)
    }

}
    
/**
 * @param {Number} numeroPagina - Número da Página
 * @param {String} nomeLov - Nome do Item LOV
 */
let eventRemove = (numeroPagina, nomeLov) => {
    // Map nos elementos que estão adicionados no input(Selecionados) e adicionamos um event no click do remove do elemento
    $.map(
        window.$(`#${nomeLov}`)
            .closest("ul.apex-item-multi")
            .find(`li[data-value]:not('[data-value="NOT"]') .icon-multi-remove`),
        function(e) {
            //Adiconamos o event listener no elemento
            $(e).on('click', function(){
                // armazena todos os li's que já possuem a classe de estilização
                let liCheck = top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + '_dlg ul li.liCheck')
                //armazenamos as checks que deverão ser marcadas
                let arrCheck = new Set()
                // elemento acionador
                let pThis = this
                
                //map para alimentar os valores que ainda devem permanecer selecionados
                $.map(window.$(`#${nomeLov}`)
                        .closest("ul.apex-item-multi")
                        .find(`li[data-value]:not('[data-value="NOT"]')`),
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
                
                //Verifico se devo remover o NOT
                removeNotItem(nomeLov, $(e).closest('li[data-value]'))
            })
        }
    )
     
}

/**
 * 
 * @param {String} nomeLov - Nome do Item da LOV
 * @param {Node} elemAtual - Elemento atual clicado, usado para desconsiderar da filtragem dos existentes
 */

const removeNotItem = (nomeLov, elemAtual) => {
    let lov = $('#' + nomeLov)
    let othersItens = lov.closest("ul.apex-item-multi").find(`li[data-value]:not('[data-value="NOT"]')`).not(elemAtual).length > 0

    othersItens
        ? null
        : window.setValuePOPLOVItem(nomeLov, Array.from([]), Array.from([]))
}


    

function organizaMenuLov(nomeLov, numeroPagina, classMenuSelect, window) {
    //Capturo todos os objetos do list
    let linha = top.document.querySelectorAll(
        "#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul li:not([menu-id])"
    );
    
    setContextElem()
    try {
        // iframe = document.getElementsByTagName('iframe');
        // iframeLen = iframe.length - 1
        // innerDoc = iframe[iframeLen].contentDocument || iframe[iframeLen].contentWindow.document;

        itemLov = innerDoc.getElementById(nomeLov)
        itemLovIsMulti = $(itemLov).closest('li.apex-item-multi-item').length > 0 ? true : false
    } catch (error) {
        itemLov = $(`#${nomeLov}`)
        itemLovIsMulti = $(itemLov).closest('li.apex-item-multi-item').length > 0 ? true : false
    }

    /*
        ZMB - 02/02/2023
    */

            //Item Lov se conter classe para negação de selecao
            let itemLovAction = $(itemLov).hasClass('checkAction')

            itemLovIsMulti 
                ? itemLovAction 
                    ? getButtonAction(numeroPagina, nomeLov)
                    : null
                : null

    /*
        FIM ZMB 02/02/2023
    */


    let aplicaCheck = () => {
        if (itemLovIsMulti) {
            
            function eventCheckBoxLov(pThis) {
                let returnValue = new Set();
                let displayValue = [];
        
                let validaChecked = top.$(pThis).is(':checked');
                let checkId = top.$(pThis).data('id')
                let checkDisplay = top.$(pThis).next()[0].innerText
        
                // pega os valores que já estao na lov
                let valueLov = window
                    .$(`#${nomeLov}`)
                    .closest("ul.apex-item-multi")
                    .find(`li[data-value]:not('[data-value="NOT"]')`)
                    .not(`[data-value="${checkId}"]`);
            
                // passa eles para os arrays
                for (let i = 0; i < valueLov.length; i++) {
                    const element = $(valueLov[i]);
                    
                    // if (element.attr("data-value") != 'NOT') {

                        returnValue.add(element.attr("data-value"));
                        displayValue.push(element.text());                
                    // }
                    
                }
                
                if (validaChecked) {
                    returnValue.add(checkId)
                    displayValue.push(checkDisplay)
                }
                
                // window.setValuePOPLOVItem(nomeLov, Array.from(returnValue), Array.from(displayValue))
                setValuesLOV(displayValue, returnValue, nomeLov, numeroPagina)

                // Evento no x dos elementos selecionados no input
                eventRemove(numeroPagina, nomeLov)
            
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
                    "margin-left: 2rem;";

                let cssStyleDiv =
                    "display: flex; align-items: center;";

                let cssStyleSubMenu =
                    {"border-width": "0.01px", "border-style": "solid", "display": "flex", "padding": "8px 12px", "justify-content": "start", "text-indent": "0px", "margin-left": "3px", "align-items": "center"};
                
                //Clono o item atual
                let item = top.$(li[e]).clone();
                item.addClass('liCheck')
                item.css(cssStyleSubMenu);        

                //crio o componente de checkbox
                let checkboxChild = top.document.createElement('input');
                checkboxChild.setAttribute("type", "checkbox");
                checkboxChild.setAttribute("class", "form-check-input lovCheck");
                checkboxChild.setAttribute("style", cssStyleCheckBox);
                checkboxChild.setAttribute("data-id", item.data('id'))
                checkboxChild.setAttribute("menu-id", item.attr('menu-id'))
                //adiciono o evento no onclick
                checkboxChild.addEventListener('click', function(e){
                    eventCheckBoxLov(this, nomeLov)
                    //Verifico se devo remover o NOT
                    removeNotItem(nomeLov, $(itemLov).find(`li[data-value="${item.data('id')}"]`))
                });

                //adiciono o evento para quando clicar na li adicionar true na prop checkbox
                item[0].addEventListener('click', function(){
                    top.$(this).prev().click()
                })

                //crio o elemento div que envolve os demais elementos input e li
                let div = top.document.createElement('div');    
                div.append(checkboxChild);
                div.append(item[0]);

                div.setAttribute('style', cssStyleDiv)
                div.setAttribute('menu-id', item.attr('menu-id'))
                
                $(li[e]).after(div);
                $(li[e]).remove();

                // Evento no x dos elementos selecionados no input
                eventRemove(numeroPagina, nomeLov)

                //marcamos as checks que já existem no item
                $.map(
                    window
                        .$(`#${nomeLov}`)
                        .closest("ul.apex-item-multi")
                        .find(`li[data-value]:not('[data-value="NOT"]')`),
                    function(e){
                        top.$('#PopupLov_' + numeroPagina + '_' + nomeLov + `_dlg ul li.liCheck[data-id="${$(e).data('value')}"]`).prev().prop('checked', true)
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
                            //Verifico se devo remover o NOT
                            removeNotItem(nomeLov, (e))

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
        top.$("#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul span").css(
            "cursor",
            "pointer"
        );
        // Evento de OnCLick nos menus pais
        top.$("#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul span").on(
            "click",
            function () {
                let returnValue = [];
                let displayValue = [];

                // pega os valores que já estao na lov
                let valueLov = window
                    .$(`#${nomeLov}`)
                    .closest("ul.apex-item-multi")
                    .find(`li[data-value]:not('[data-value="NOT"]')`);

                    
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
                        top.$(childElements[e]).prev().prop('checked', true)
                    }
                    //Zmb - 08/12/2022 FIM
                });

                // window.setValuePOPLOVItem(nomeLov, Array.from(returnValue), Array.from(displayValue))
                setValuesLOV(displayValue, returnValue, nomeLov, numeroPagina)

                 //Zmb - 08/12/2022
                 if (itemLovIsMulti) {
                    // Evento no x dos elementos selecionados no input
                    eventRemove(numeroPagina, nomeLov)
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

    function existeMenuPai(menu_atual){
        let menuAux = Array.from(top.$("#PopupLov_" + numeroPagina + "_" + nomeLov + "_dlg ul span[menu-id]")).filter((e) => {
            return top.$(e).text().toUpperCase() == menu_atual.toUpperCase();
        })

        return menuAux;
    }

    try {
        //Contador apenas para dizer a sequencia dos menus
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
                // Coleto a Descrição do Menu Filho
                menu_filho = t
                    .substr(t.indexOf("</groupRow>"))
                    .replaceAll("</groupRow>", "");
                
                // Caso for a primeira Vez
                if (menu_atual.length <= 0) {
                    //alimento o contador
                    cont += 1;
                    //Alimento com o menu coletado acima, preciso disso para verificar diferenças entre o ultimo menu inserido e o próximo
                    menu_atual = menu;

                    //valido se já existe algum menu pai existente em tela, caso exista eu recupero o html dele em Array
                    let menuPaiExistente = existeMenuPai(menu_atual);
                    
                    //Valido se o array retornado para a variável menuPaiExistente é maior que 0, caso seja existe um menu pai, nesse caso não faz nada
                    if (!menuPaiExistente.length > 0){
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
                    } else {
                        //caso exista o menu pai em tela então eu apenas recupero o menu-id dele para passar para seus novos filhos, e no próximo será somada a variável cont para o próximo pai
                        cont = parseInt($(menuPaiExistente).attr('menu-id'))
                    }
                } else if (menu_atual != menu) {
                    //alimento o contador
                    cont += 1;
                    //Alimento com o menu coletado acima, preciso disso para verificar diferenças entre o ultimo menu inserido e o próximo
                    menu_atual = menu;

                    //valido se já existe algum menu pai existente em tela, caso exista eu recupero o html dele em Array
                    let menuPaiExistente = existeMenuPai(menu_atual);

                    //Valido se o array retornado para a variável menuPaiExistente é maior que 0, caso seja existe um menu pai, nesse caso não faz nada
                    if (!menuPaiExistente.length > 0){
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
                        e.before($(novoTitulo)[0])
                    } else {
                        //caso exista o menu pai em tela então eu apenas recupero o menu-id dele para passar para seus novos filhos, e no próximo será somada a variável cont para o próximo pai
                        cont = parseInt($(menuPaiExistente).attr('menu-id'))
                    }
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
            // //Do um stop na UL para não aplicar o evento nas LI's de fechar a lov e setar os valores dos itens na lov
            top.$('ul.a-IconList.ulCheck li').click((e) => e.stopImmediatePropagation());
            $(itemLov).closest('ul.apex-item-multi').find('.apex-item-multi-item[data-value="NOT"]').css('display', 'none')
        }
        
    } catch (error) {
        console.warn(error);
    }
}

// roda no inicio da página procurando .organizeMenuLov e crriando o observer
$(function () {
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
                let aplicaOrganuzaMenuLovs = new MutationObserver(function (
                    mutations
                ) {
                    //Zmb - 12/12/2022 preciso esperar ser resolvida para eliminar uma classe que é inserida em tempo real pelo APEX
                    let organizaMenuPromise = new Promise (async function(resolve, reject) {
                        await organizaMenuLov(id, pageId, classMenuSelect, window); 
                        resolve(true)                       
                    })

                    organizaMenuPromise.then(
                        (resolve) => {
                            try {
                                let itemLov = $(`#${id}`)
                                let itemLovIsMulti = itemLov.closest('li.apex-item-multi-item').length > 0 ? true : false
                                
                                if (itemLovIsMulti){
                                    top.$("#PopupLov_" + pageId + "_" + id + "_dlg ul").children('.a-IconList-item').removeClass('a-IconList-item')
                                }
                            } catch (e) {
                                console.warn(e)
                            }
                        }
                    )
                    //Fim Zmb - 12/12/2022 
                });

                try {
                    aplicaOrganuzaMenuLovs.observe(elementToObserve, {
                        childList: true,
                    });
                } catch (error) {
                    continue;
                }
            }
        }
    }

    //cria um observador no DOM provurando as $('.organizeMenuLov')

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
});

/*
        Instruções de Uso:
            1- Somente em página no modelo normal;
            2- Como usar:
                O Item deve ser do Tipo Lov e pode ser tanto modal quanto inline;
                2.1: Adicionar a Classe em Avançado -> Classes Css -> organizaMenuLov

                2.2: A SQL Deve ser Neste Padrão....

                    SELECT '<groupRow>' || NOME DO MENU PAI || '</groupRow>' || AQUI O MENU FILHO  AS NOME_QUE_QUISER,
                            PESSOA_ID
                    FROM TABELA
                    ORDER BY NOME_MENU

                    -- Atenção aqui
                    -- Muita Atenção -----
                    -->> Muita atenção aqui #$%¨&*$%¨&*&%¨&*()
                    Deve haver o Order by pelo nome do menu ou id, para que todos fiquem agrupados
                    ORDER BY NOME_DO_MENU ou se usar ID orderna por este ID

    */

// FIM ITEM LOV POUP