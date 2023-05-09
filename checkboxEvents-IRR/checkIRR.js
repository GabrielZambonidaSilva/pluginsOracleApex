let elemCheckArr = [
    {
        "queryCheckAll": ".selectAllA",
        "collectionName": "checkbox",
        "buttonClear": "#button",
        "clearCollectionOnPageLoad": false,
        "callback": () => {console.log('Função de Callback de exemplo')},
        "checkColumn": {
            "queryCheck": ".selectChild",
            "attrValue": "data-id"
        }
    },
    {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "callback": () => {console.log('Função de Callback de exemplo')},
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    }
]

let staticRegion = '#staticRegion' + ' '

/*
    Funções que acionam o AJAX callback
*/
let elemObj = {
    id: null,
    checked: false,
    collectionName: null
}

/**
 * 
 * @param {Array} elemCheckArr - Recebe o Objeto modelo [
    {
        "queryCheckAll": ".selectAllA",
        "collectionName": "checkbox",
        "buttonClear": "#button",
        "clearCollectionOnPageLoad": false,
        "checkColumn": {
            "queryCheck": ".selectChild",
            "attrValue": "data-id"
        }
    },
    {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    }
] - Para que acione o callback de gerenciamento das collections (Criação / Deleteção)
 */

function createCollection(elemCheckArr){
    let arrayCollection = []

    elemCheckArr.forEach((e) => {   
        arrayCollection.push({collectionName: e.collectionName, clearCollectionOnPageLoad: e.clearCollectionOnPageLoad})
    })

    apex.server.process(
        'CHANGE_COLLECTION',
        {
            x01: 'CREATE',
            f01: JSON.stringify(arrayCollection)
        }
    ).done((e) => {
        console.log(e)
    }).fail((e) => {
        console.warn(e)
    })
}



/**
 * 
 * @param {Array} elemCheck -  Array com o(s) Elementos para ser Alterados - Neste Array deve conter o modelo elemObj
 */
function changeCollection(elemCheck){
    let elemArray = Array.from(elemCheck)
    //Desabilito para evitar os cliques
    elemArray.forEach((e) => {
        eventCheckBox(
            {
                staticRegion: staticRegion, 
                queryCheckAll: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].queryCheckAll, 
                queryCheck: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].checkColumn.queryCheck, 
                disable: true
            }
        )
    })
    

    apex.server.process(
        'CHANGE_COLLECTION',
        {
            x01: 'CHANGE',
            f01: JSON.stringify(elemArray)
        }
    ).done((e) => {
        console.log(e)
    }).fail((e) => {
        console.warn(e)
    }).always((e) => {
        //Habilito para evitar os cliques
        elemArray.forEach((e) => {
            eventCheckBox(
                {
                    staticRegion: staticRegion, 
                    queryCheckAll: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].queryCheckAll, 
                    queryCheck: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].checkColumn.queryCheck, 
                    disable: false
                }
            )

            //Função de Callback acionada a cada interação com checkbox individual ou checkbox "todos"
            try {
                elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].callback()
            } catch (error) {
                console.warn(error)
            }
        })
    })
}


/**
 * @param {Array[]} elemCheckArr - Recebe um array de elementos no formato - 
[
    {
        "queryCheckAll": ".selectAllA",
        "collectionName": "checkbox",
        "buttonClear": "#button",
        "clearCollectionOnPageLoad": false,
        "checkColumn": {
            "queryCheck": ".selectChild",
            "attrValue": "data-id"
        }
    },
    {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    }
]
 */
function listCollection(elemCheckArr){

    let elemArray = Array.from(elemCheckArr)
    let listArray = []

    elemArray.forEach((e) => {
        console.log(e)
        listArray.push(
            {
                collectionName: e.collectionName, 
                ids: Array.from($(staticRegion + e.checkColumn.queryCheck)).map(
                    (elem) => {
                        return $(elem).attr(e.checkColumn.attrValue)
                    } 
                )
            }
        )
    })
    
    apex.server.process(
        'CHANGE_COLLECTION',
        {
            x01: 'LIST',
            f01: JSON.stringify(listArray)
        }
    ).done((e) => {
        //verifico se o retorno é um array de objetos
        if (Array.isArray(e)){
            
            //Em cada objeto faço o parse do array encontrado e faço a marcação das checkbox na tela
            Array.from(e).forEach(e => { 

                let typeCheck = elemArray.filter(elemArr => elemArr.collectionName == e.collectionName)[0]

                Array.from(JSON.parse(e.ids) ?? []).forEach((elem) => {
                    
                    $(
                        `${staticRegion}${typeCheck?.checkColumn.queryCheck}[${typeCheck?.checkColumn.attrValue}="${elem}"]`    
                    ).prop('checked', true)                        
                })

                //Desmarco todas as checkbox caso não tenha nenhuma na collection
                if (Array.from(JSON.parse(e.ids) ?? []).length == 0){
                    $(
                        `${staticRegion}${typeCheck?.checkColumn.queryCheck}`
                    ).prop('checked', false)
                }
            })
        }

    }).fail((e) => {
        console.warn(e)
    }).always((e) => {
        verifyStateCheckAll(elemCheckArr)
    })
}


/**
 * @param {Object} obj - Recebe um obj de elementos no formato - {collectionName: "checkbox"}
 */
function deleteCollection(obj){
    apex.server.process(
        'CHANGE_COLLECTION',
        {
            x01: 'DELETE',
            f01: JSON.stringify(obj)
        }
    ).done((e) => {
        listCollection(elemCheckArr)
        console.log(e)
    }).fail((e) => {
        listCollection(elemCheckArr)
        console.warn(e)
    })
}



/**
 * 
 * @param {Object} obj - Recebe o objeto modelo {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    } - é usado para identificar qual a checkbox que está sendo modificada e atribuir o valor correto para o checkAll
 */
function stateCheckAll(obj){
    let checkLine = $(staticRegion + obj.checkColumn.queryCheck)
    let checkLineChecked = $(staticRegion + obj.checkColumn.queryCheck + ':checked')

    checkLine.length == checkLineChecked.length
        ? $(staticRegion + obj.queryCheckAll).prop('checked', true)
        : $(staticRegion + obj.queryCheckAll).prop('checked', false)  
}

/**
 * 
 * @param {Array} elemCheckArr - Recebe o Objeto modelo [
    {
        "queryCheckAll": ".selectAllA",
        "collectionName": "checkbox",
        "buttonClear": "#button",
        "clearCollectionOnPageLoad": false,
        "checkColumn": {
            "queryCheck": ".selectChild",
            "attrValue": "data-id"
        }
    },
    {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    }
] - Para que acione a função do checkAll e deixe o status dele de acordo com o disponivel em tela
 */
function verifyStateCheckAll(elemCheckArr) {
    elemCheckArr.forEach((e) => {
        stateCheckAll(e)
    })
}

/**
 * @param {Object} obj - Recebe o Objeto Modelo {staticRegion: "regiao", queryCheckAll: ".selectAll", queryCheck: "check", disable: true or false}
 */
function eventCheckBox(obj){
    $(`${obj.staticRegion}${obj.queryCheckAll}`).attr('disabled', obj.disable ?? false)
    $(`${obj.staticRegion}${obj.queryCheck}`).attr('disabled', obj.disable ?? false)
}

/**
 * 
 * @param {Array} elemCheckArr - Recebe o Objeto modelo [
    {
        "queryCheckAll": ".selectAllA",
        "collectionName": "checkbox",
        "buttonClear": "#button",
        "clearCollectionOnPageLoad": false,
        "checkColumn": {
            "queryCheck": ".selectChild",
            "attrValue": "data-id"
        }
    },
    {
        "queryCheckAll": ".selectAllB",
        "collectionName": "checkboxB",
        "buttonClear": "#button2",
        "clearCollectionOnPageLoad": true,
        "checkColumn": {
            "queryCheck": ".selectChildb",
            "attrValue": "data-id"
        }
    }
] - Para que faça as buscas e atribua o evento correto a cada checkbox
 */
function setEventElements(elemCheckArr) {
    let elemArrayState = []

    elemCheckArr.forEach((e) => { 
        //Add Event in CheckAll
        if (e.queryCheckAll?.length > 0) {
            $(staticRegion + e.queryCheckAll).on('click', (elem) => {
                elem.stopPropagation()
                $(staticRegion + e.checkColumn.queryCheck).prop('checked', $(elem.target).is(':checked'))  
                
                $.map(
                    $(staticRegion + e.checkColumn.queryCheck),
                    function(elem){
                        elemObj.id = $(elem).attr(e.checkColumn.attrValue)
                        elemObj.checked = $(elem).is(':checked')
                        elemObj.collectionName = e.collectionName
                        
                        elemArrayState.push(
                            elemObj
                        )

                        elemObj = {
                            id: null,
                            checked: false,
                            collectionName: null
                        }
                    }
                )

                changeCollection(elemArrayState, callback)
                elemArrayState = []

            }) 
        }
        //Add Event in CheckLine
        if (e.checkColumn?.queryCheck.length > 0) {
            $(staticRegion + e.checkColumn.queryCheck).on('click', (elem) => {
                elem.stopPropagation()
                stateCheckAll(e)
                
                elemObj = {
                    id: null,
                    checked: false,
                    collectionName: null
                }

                elemObj.id = $(elem.target).attr(e.checkColumn.attrValue)
                elemObj.checked = $(elem.target).is(':checked')
                elemObj.collectionName = e.collectionName

                changeCollection([elemObj])
            }) 
        }
        // Add Event in Button Check
        if (e.buttonClear?.length > 0){
            $(e.buttonClear).on('click', (elem) => {
                elem.stopImmediatePropagation()
                deleteCollection({collectionName: e.collectionName})
            })     
        }           
    })
}


function init() {
    //Faço a criação das collections
    createCollection(elemCheckArr)
    //Aciono a atribuição de eventos para os elementos da página
    setEventElements(elemCheckArr)
    //Adiciono Eventos na Região estatica
    $(staticRegion).on('apexafterrefresh', () => {
        listCollection(elemCheckArr); 
        setEventElements(elemCheckArr);
        // setTimeout(() => {verifyStateCheckAll(elemCheckArr)}, 500);
    });

}

