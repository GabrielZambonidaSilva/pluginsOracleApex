
params = {
    "funcaoLimpaFiltro": () => {
        //Array do itens para voltar os valores default
        const arrItem = [
            'P246_EMPRESA', 
            'P246_TIPO_PERIODO', 
            'P246_DATA_INICIO', 
            'P246_DATA_FIM', 
            'P246_CONTAS_PAGAR', 
            'P246_TITULO', 
            'P246_DOCUMENTO', 
            'P246_PEDIDO_COMPRA', 
            'P246_CONTA', 
            'P246_CENTRO_CUSTO', 
            'P246_CATEGORIA', 
            'P246_FORNECEDOR', 
            'P246_ORIGEM', 
            'P246_CONFERIDO', 
            'P246_DE', 
            'P246_ATE', 
            'P246_EFETUADO_EM'
        ] 
        
        arrItem.forEach((e) => {

            switch (apex.item(e).item_type) {                
                //Valor Default Data Item
                case "OJ-INPUT-DATE": {
                    apex.item(e).reinit(apex.item(e)._initialValue)
                    break
                }
                case "SELECT": {
                    apex.item(e).setValue(apex.item(e).nullValue)
                    break
                }
                case "POPUP_KEY_LOV": {
                    apex.item(e).refresh()
                    break
                }
                case "NUMBER": {
                    apex.item(e).setValue(apex.item(e)._min)
                    break
                }

            }
        
        })
    }
}

//Função que vai executar o que o usuário passar
const funcaoLimpaFiltro = (params) => {
    try {
        typeof(params?.funcaoLimpaFiltro) == 'function' ? params.funcaoLimpaFiltro() : null
    } catch (error) {
        console.warn('Erro ao executar função limpa Filtros')
        console.warn(error)
        console.log(params)
    }
}



//Setar atributos para o elemento

const setAttributesNode = (elem, attrs) => {
    for(var key in attrs) {
        elem.setAttribute(key, attrs[key]);
    }

    return elem
}


//Seleciono os elementos envolvidos
let buttonClearFilter = document.createElement('button')
let spanButtonClearFilter = document.createElement('span')

let buttonFilter = $('[name="limparSelecaoContaPagar"]')
let buttonContainer = $(buttonFilter).parent()

//Atribuo o layout para o botão de apagar
setAttributesNode(
    buttonClearFilter, 
    {
        "title": "Limpar Filtros",
        "type": "button",
        "class": Array.from($(buttonFilter)[0].classList).map((e) => {return e.toUpperCase().indexOf('BUTTON') > -1 ? e : null}).toString().toString().replaceAll(',',' '),
        "style": "width: 12%; border-top-left-radius: 0px !important; border-bottom-left-radius: 0px !important; border-left: 5px solid rgba(255, 255, 255, 0) !important; height: min-content; "
    }
)

//Atribuo o layout para o span do icone
setAttributesNode(
    spanButtonClearFilter,
    {
        "class": "fa fa-eraser"
    }
)

// Atribuo o evento
buttonClearFilter.addEventListener('click', (event) => {funcaoLimpaFiltro(params)})

buttonClearFilter.appendChild(spanButtonClearFilter)

//Organizo o container para conseguir alinhar os elementos
$(buttonContainer).css({'display':'flex', "width":"100%"})

//Estilizo o botão de filtros
$(buttonFilter).css({"border-top-right-radius": "0px", "border-bottom-right-radius": "0px"})

//Adiciono o botão de limpar filtros na tela
$(buttonContainer).append(buttonClearFilter)