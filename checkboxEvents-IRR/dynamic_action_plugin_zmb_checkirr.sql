prompt --application/set_environment
set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- You should run the script connected to SQL*Plus as the Oracle user
-- APEX_210100 or as the owner (parsing schema) of the application.
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_begin (
 p_version_yyyy_mm_dd=>'2021.04.15'
,p_release=>'21.1.3'
,p_default_workspace_id=>2878693287648244
,p_default_application_id=>120
,p_default_id_offset=>0
,p_default_owner=>'ERP'
);
end;
/
 
prompt APPLICATION 120 - ERP
--
-- Application Export:
--   Application:     120
--   Name:            ERP
--   Date and Time:   23:10 Quarta-Feira Março 15, 2023
--   Exported By:     BEEASY.GABRIEL
--   Flashback:       0
--   Export Type:     Component Export
--   Manifest
--     PLUGIN: 144291862029481446
--   Manifest End
--   Version:         21.1.3
--   Instance ID:     649842172119056
--

begin
  -- replace components
  wwv_flow_api.g_mode := 'REPLACE';
end;
/
prompt --application/shared_components/plugins/dynamic_action/zmb_checkirr
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(144291862029481446)
,p_plugin_type=>'DYNAMIC ACTION'
,p_name=>'ZMB.CHECKIRR'
,p_display_name=>'CheckBox - IRR Region'
,p_category=>'COMPONENT'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_plsql_code=>wwv_flow_string.join(wwv_flow_t_varchar2(
'FUNCTION CHECK_IRR_RENDER (',
'    P_DYNAMIC_ACTION    IN APEX_PLUGIN.T_DYNAMIC_ACTION,',
'    P_PLUGIN            IN APEX_PLUGIN.T_PLUGIN',
'',
')',
'RETURN APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT',
'IS',
'    L_RESULT                APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT; ',
'    V_V                     VARCHAR2(4000) := P_DYNAMIC_ACTION.ATTRIBUTE_01;',
'BEGIN',
'    ',
'    L_RESULT.JAVASCRIPT_FUNCTION := ''() => {',
'        let elemCheckArr = '' || P_DYNAMIC_ACTION.ATTRIBUTE_01 || ''',
'',
'        let staticRegion = '''''' || P_DYNAMIC_ACTION.ATTRIBUTE_02 || '''''''' || q''^ + '' ''',
'',
'        /*',
unistr('            Fun\00E7\00F5es que acionam o AJAX callback'),
'        */',
'        let elemObj = {',
'            id: null,',
'            checked: false,',
'            collectionName: null',
'        }',
'',
'        /**',
'        * ',
'        * @param {Array} elemCheckArr - Recebe o Objeto modelo [',
'            {',
'                "queryCheckAll": ".selectAllA",',
'                "collectionName": "checkbox",',
'                "buttonClear": "#button",',
'                "clearCollectionOnPageLoad": false,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChild",',
'                    "attrValue": "data-id"',
'                }',
'            },',
'            {',
'                "queryCheckAll": ".selectAllB",',
'                "collectionName": "checkboxB",',
'                "buttonClear": "#button2",',
'                "clearCollectionOnPageLoad": true,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChildb",',
'                    "attrValue": "data-id"',
'                }',
'            }',
unistr('        ] - Para que acione o callback de gerenciamento das collections (Cria\00E7\00E3o / Delete\00E7\00E3o)'),
'        */',
'',
'        function createCollection(elemCheckArr){',
'            let arrayCollection = []',
'',
'            elemCheckArr.forEach((e) => {   ',
'                arrayCollection.push({collectionName: e.collectionName, clearCollectionOnPageLoad: e.clearCollectionOnPageLoad})',
'            })',
'',
'            apex.server.process(',
'                ''CHANGE_COLLECTION'',',
'                {',
'                    x01: ''CREATE'',',
'                    f01: JSON.stringify(arrayCollection)',
'                }',
'            ).done((e) => {',
'                console.log(e)',
'            }).fail((e) => {',
'                console.warn(e)',
'            })',
'        }',
'',
'',
'',
'        /**',
'        * ',
'        * @param {Array} elemCheck -  Array com o(s) Elementos para ser Alterados - Neste Array deve conter o modelo elemObj',
'        */',
'        function changeCollection(elemCheck){',
'            let elemArray = Array.from(elemCheck)',
'            //Desabilito para evitar os cliques',
'            elemArray.forEach((e) => {',
'                eventCheckBox(',
'                    {',
'                        staticRegion: staticRegion, ',
'                        queryCheckAll: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].queryCheckAll, ',
'                        queryCheck: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].checkColumn.queryCheck, ',
'                        disable: true',
'                    }',
'                )',
'            })',
'            ',
'',
'            apex.server.process(',
'                ''CHANGE_COLLECTION'',',
'                {',
'                    x01: ''CHANGE'',',
'                    f01: JSON.stringify(elemArray)',
'                }',
'            ).done((e) => {',
'                console.log(e)',
'            }).fail((e) => {',
'                console.warn(e)',
'            }).always((e) => {',
'                //Habilito para evitar os cliques',
'                elemArray.forEach((e) => {',
'                    eventCheckBox(',
'                        {',
'                            staticRegion: staticRegion, ',
'                            queryCheckAll: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].queryCheckAll, ',
'                            queryCheck: elemCheckArr.filter(elem => elem.collectionName == e.collectionName)[0].checkColumn.queryCheck, ',
'                            disable: false',
'                        }',
'                    )',
'                })',
'            })',
'        }',
'',
'',
'        /**',
'        * @param {Array[]} elemCheckArr - Recebe um array de elementos no formato - ',
'        [',
'            {',
'                "queryCheckAll": ".selectAllA",',
'                "collectionName": "checkbox",',
'                "buttonClear": "#button",',
'                "clearCollectionOnPageLoad": false,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChild",',
'                    "attrValue": "data-id"',
'                }',
'            },',
'            {',
'                "queryCheckAll": ".selectAllB",',
'                "collectionName": "checkboxB",',
'                "buttonClear": "#button2",',
'                "clearCollectionOnPageLoad": true,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChildb",',
'                    "attrValue": "data-id"',
'                }',
'            }',
'        ]',
'        */',
'        function listCollection(elemCheckArr){',
'',
'            let elemArray = Array.from(elemCheckArr)',
'            let listArray = []',
'',
'            elemArray.forEach((e) => {',
'                console.log(e)',
'                listArray.push(',
'                    {',
'                        collectionName: e.collectionName, ',
'                        ids: Array.from($(staticRegion + e.checkColumn.queryCheck)).map(',
'                            (elem) => {',
'                                return $(elem).attr(e.checkColumn.attrValue)',
'                            } ',
'                        )',
'                    }',
'                )',
'            })',
'            ',
'            apex.server.process(',
'                ''CHANGE_COLLECTION'',',
'                {',
'                    x01: ''LIST'',',
'                    f01: JSON.stringify(listArray)',
'                }',
'            ).done((e) => {',
unistr('                //verifico se o retorno \00E9 um array de objetos'),
'                if (Array.isArray(e)){',
'                    ',
unistr('                    //Em cada objeto fa\00E7o o parse do array encontrado e fa\00E7o a marca\00E7\00E3o das checkbox na tela'),
'                    Array.from(e).forEach(e => { ',
'',
'                        let typeCheck = elemArray.filter(elemArr => elemArr.collectionName == e.collectionName)[0]',
'',
'                        Array.from(JSON.parse(e.ids) ?? []).forEach((elem) => {',
'                            ',
'                            $(',
'                                `${staticRegion}${typeCheck?.checkColumn.queryCheck}[${typeCheck?.checkColumn.attrValue}="${elem}"]`    ',
'                            ).prop(''checked'', true)                        ',
'                        })',
'',
unistr('                        //Desmarco todas as checkbox caso n\00E3o tenha nenhuma na collection'),
'                        if (Array.from(JSON.parse(e.ids) ?? []).length == 0){',
'                            $(',
'                                `${staticRegion}${typeCheck?.checkColumn.queryCheck}`',
'                            ).prop(''checked'', false)',
'                        }',
'                    })',
'                }',
'',
'            }).fail((e) => {',
'                console.warn(e)',
'            }).always((e) => {',
'                verifyStateCheckAll(elemCheckArr)',
'            })',
'        }',
'',
'',
'        /**',
'        * @param {Object} obj - Recebe um obj de elementos no formato - {collectionName: "checkbox"}',
'        */',
'        function deleteCollection(obj){',
'            apex.server.process(',
'                ''CHANGE_COLLECTION'',',
'                {',
'                    x01: ''DELETE'',',
'                    f01: JSON.stringify(obj)',
'                }',
'            ).done((e) => {',
'                listCollection(elemCheckArr)',
'                console.log(e)',
'            }).fail((e) => {',
'                listCollection(elemCheckArr)',
'                console.warn(e)',
'            })',
'        }',
'',
'',
'',
'        /**',
'        * ',
'        * @param {Object} obj - Recebe o objeto modelo {',
'                "queryCheckAll": ".selectAllB",',
'                "collectionName": "checkboxB",',
'                "buttonClear": "#button2",',
'                "clearCollectionOnPageLoad": true,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChildb",',
'                    "attrValue": "data-id"',
'                }',
unistr('            } - \00E9 usado para identificar qual a checkbox que est\00E1 sendo modificada e atribuir o valor correto para o checkAll'),
'        */',
'        function stateCheckAll(obj){',
'            let checkLine = $(staticRegion + obj.checkColumn.queryCheck)',
'            let checkLineChecked = $(staticRegion + obj.checkColumn.queryCheck + '':checked'')',
'',
'            checkLine.length == checkLineChecked.length',
'                ? $(staticRegion + obj.queryCheckAll).prop(''checked'', true)',
'                : $(staticRegion + obj.queryCheckAll).prop(''checked'', false)  ',
'        }',
'',
'        /**',
'        * ',
'        * @param {Array} elemCheckArr - Recebe o Objeto modelo [',
'            {',
'                "queryCheckAll": ".selectAllA",',
'                "collectionName": "checkbox",',
'                "buttonClear": "#button",',
'                "clearCollectionOnPageLoad": false,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChild",',
'                    "attrValue": "data-id"',
'                }',
'            },',
'            {',
'                "queryCheckAll": ".selectAllB",',
'                "collectionName": "checkboxB",',
'                "buttonClear": "#button2",',
'                "clearCollectionOnPageLoad": true,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChildb",',
'                    "attrValue": "data-id"',
'                }',
'            }',
unistr('        ] - Para que acione a fun\00E7\00E3o do checkAll e deixe o status dele de acordo com o disponivel em tela'),
'        */',
'        function verifyStateCheckAll(elemCheckArr) {',
'            elemCheckArr.forEach((e) => {',
'                stateCheckAll(e)',
'            })',
'        }',
'',
'        /**',
'        * @param {Object} obj - Recebe o Objeto Modelo {staticRegion: "regiao", queryCheckAll: ".selectAll", queryCheck: "check", disable: true or false}',
'        */',
'        function eventCheckBox(obj){',
'            $(`${obj.staticRegion}${obj.queryCheckAll}`).attr(''disabled'', obj.disable ?? false)',
'            $(`${obj.staticRegion}${obj.queryCheck}`).attr(''disabled'', obj.disable ?? false)',
'        }',
'',
'        /**',
'        * ',
'        * @param {Array} elemCheckArr - Recebe o Objeto modelo [',
'            {',
'                "queryCheckAll": ".selectAllA",',
'                "collectionName": "checkbox",',
'                "buttonClear": "#button",',
'                "clearCollectionOnPageLoad": false,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChild",',
'                    "attrValue": "data-id"',
'                }',
'            },',
'            {',
'                "queryCheckAll": ".selectAllB",',
'                "collectionName": "checkboxB",',
'                "buttonClear": "#button2",',
'                "clearCollectionOnPageLoad": true,',
'                "checkColumn": {',
'                    "queryCheck": ".selectChildb",',
'                    "attrValue": "data-id"',
'                }',
'            }',
unistr('        ] - Para que fa\00E7a as buscas e atribua o evento correto a cada checkbox'),
'        */',
'        function setEventElements(elemCheckArr) {',
'            let elemArrayState = []',
'',
'            elemCheckArr.forEach((e) => { ',
'                //Add Event in CheckAll',
'                if (e.queryCheckAll?.length > 0) {',
'                    $(staticRegion + e.queryCheckAll).on(''click'', (elem) => {',
'                        elem.stopPropagation()',
'                        $(staticRegion + e.checkColumn.queryCheck).prop(''checked'', $(elem.target).is('':checked''))  ',
'                        ',
'                        $.map(',
'                            $(staticRegion + e.checkColumn.queryCheck),',
'                            function(elem){',
'                                elemObj.id = $(elem).attr(e.checkColumn.attrValue)',
'                                elemObj.checked = $(elem).is('':checked'')',
'                                elemObj.collectionName = e.collectionName',
'                                ',
'                                elemArrayState.push(',
'                                    elemObj',
'                                )',
'',
'                                elemObj = {',
'                                    id: null,',
'                                    checked: false,',
'                                    collectionName: null',
'                                }',
'                            }',
'                        )',
'',
'                        changeCollection(elemArrayState)',
'                        elemArrayState = []',
'',
'                    }) ',
'                }',
'                //Add Event in CheckLine',
'                if (e.checkColumn?.queryCheck.length > 0) {',
'                    $(staticRegion + e.checkColumn.queryCheck).on(''click'', (elem) => {',
'                        elem.stopPropagation()',
'                        stateCheckAll(e)',
'                        ',
'                        elemObj = {',
'                            id: null,',
'                            checked: false,',
'                            collectionName: null',
'                        }',
'',
'                        elemObj.id = $(elem.target).attr(e.checkColumn.attrValue)',
'                        elemObj.checked = $(elem.target).is('':checked'')',
'                        elemObj.collectionName = e.collectionName',
'',
'                        changeCollection([elemObj])',
'                    }) ',
'                }',
'                // Add Event in Button Check',
'                if (e.buttonClear?.length > 0){',
'                    $(staticRegion + e.buttonClear).on(''click'', (elem) => {',
'                        elem.stopImmediatePropagation()',
'                        deleteCollection({collectionName: e.collectionName})',
'                    })     ',
'                }           ',
'            })',
'        }',
'',
'',
'        function init() {',
unistr('            //Fa\00E7o a cria\00E7\00E3o das collections'),
'            createCollection(elemCheckArr)',
unistr('            //Aciono a atribui\00E7\00E3o de eventos para os elementos da p\00E1gina'),
'            setEventElements(elemCheckArr)',
'',
'            listCollection(elemCheckArr); ',
unistr('            //Adiciono Eventos na Regi\00E3o estatica'),
'            $(staticRegion).on(''apexafterrefresh'', () => {',
'                listCollection(elemCheckArr); ',
'                setEventElements(elemCheckArr);',
'                // setTimeout(() => {verifyStateCheckAll(elemCheckArr)}, 500);',
'            });',
'',
'            console.log(''Inicializado CheckIRR Plugin'')',
'        }',
'',
'        init()',
'        console.log('':V_V'')',
'    }^'';',
'',
'    RETURN L_RESULT;',
'END CHECK_IRR_RENDER;',
'',
'-->> CALLBACK',
''))
,p_api_version=>2
,p_render_function=>'CHECK_IRR_RENDER'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_version_identifier=>'1.0'
,p_about_url=>'https://github.com/GabrielZambonidaSilva/pluginsOracleApex/tree/main/checkboxEvents-IRR'
,p_files_version=>4
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(147923294525875430)
,p_plugin_id=>wwv_flow_api.id(144291862029481446)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'Array Selector'
,p_attribute_type=>'JAVASCRIPT'
,p_is_required=>true
,p_default_value=>wwv_flow_string.join(wwv_flow_t_varchar2(
'[',
'    {',
'        "queryCheckAll": ".selectAllA",',
'        "collectionName": "checkbox",',
'        "buttonClear": "#button",',
'        "clearCollectionOnPageLoad": false,',
'        "checkColumn": {',
'            "queryCheck": ".selectChild",',
'            "attrValue": "data-id"',
'        }',
'    },',
'    {',
'        "queryCheckAll": ".selectAllB",',
'        "collectionName": "checkboxB",',
'        "buttonClear": "#button2",',
'        "clearCollectionOnPageLoad": true,',
'        "checkColumn": {',
'            "queryCheck": ".selectChildb",',
'            "attrValue": "data-id"',
'        }',
'    }',
']'))
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_is_translatable=>false
,p_help_text=>wwv_flow_string.join(wwv_flow_t_varchar2(
'[',
'    {',
'        "queryCheckAll": ".selectAllA",',
'        "collectionName": "checkbox",',
'        "buttonClear": "#button",',
'        "clearCollectionOnPageLoad": false,',
'        "checkColumn": {',
'            "queryCheck": ".selectChild",',
'            "attrValue": "data-id"',
'        }',
'    },',
'    {',
'        "queryCheckAll": ".selectAllB",',
'        "collectionName": "checkboxB",',
'        "buttonClear": "#button2",',
'        "clearCollectionOnPageLoad": true,',
'        "checkColumn": {',
'            "queryCheck": ".selectChildb",',
'            "attrValue": "data-id"',
'        }',
'    }',
']'))
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(147923710627880750)
,p_plugin_id=>wwv_flow_api.id(144291862029481446)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>20
,p_prompt=>'Static Region Selector'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'#regionStatic'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_is_translatable=>false
,p_help_text=>'#regionStatic'
);
end;
/
prompt --application/end_environment
begin
wwv_flow_api.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false));
commit;
end;
/
set verify on feedback on define on
prompt  ...done