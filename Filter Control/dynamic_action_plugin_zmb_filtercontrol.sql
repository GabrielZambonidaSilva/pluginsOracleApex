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
--   Date and Time:   14:58 Terça-Feira Maio 9, 2023
--   Exported By:     BEEASY.GABRIEL
--   Flashback:       0
--   Export Type:     Component Export
--   Manifest
--     PLUGIN: 172591801581389481
--   Manifest End
--   Version:         21.1.3
--   Instance ID:     649842172119056
--

begin
  -- replace components
  wwv_flow_api.g_mode := 'REPLACE';
end;
/
prompt --application/shared_components/plugins/dynamic_action/zmb_filtercontrol
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(172591801581389481)
,p_plugin_type=>'DYNAMIC ACTION'
,p_name=>'ZMB.FILTERCONTROL'
,p_display_name=>'Filter Control'
,p_category=>'COMPONENT'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_plsql_code=>wwv_flow_string.join(wwv_flow_t_varchar2(
'FUNCTION FILTER_CONTROL (',
'    P_DYNAMIC_ACTION    IN APEX_PLUGIN.T_DYNAMIC_ACTION,',
'    P_PLUGIN            IN APEX_PLUGIN.T_PLUGIN',
'',
')',
'RETURN APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT',
'IS',
'    L_RESULT                APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT; ',
'BEGIN',
'    ',
'    L_RESULT.JAVASCRIPT_FUNCTION := q''~ () => {',
'',
'        //Seleciono os elementos envolvidos',
'        let buttonClearFilter = document.createElement(''button'')',
'        let spanButtonClearFilter = document.createElement(''span'')',
'',
'        let buttonFilter = $(''~'' || P_DYNAMIC_ACTION.ATTRIBUTE_01 || q''~'')',
'        let buttonContainer = $(buttonFilter).parent()',
'',
'        let params = ~'' || P_DYNAMIC_ACTION.ATTRIBUTE_02  || q''~',
'',
unistr('        //Fun\00E7\00E3o que vai executar o que o usu\00E1rio passar'),
'        const funcaoLimpaFiltro = (params) => {',
'            console.log(params)',
'            try {',
'                typeof(params?.funcaoLimpaFiltro) == ''function'' ? params.funcaoLimpaFiltro() : null',
'            } catch (error) {',
unistr('                console.warn(''Erro ao executar fun\00E7\00E3o limpa Filtros'')'),
'                console.warn(error)',
'            }',
'        }',
'',
'',
'',
'        //Setar atributos para o elemento',
'',
'        const setAttributesNode = (elem, attrs) => {',
'            for(var key in attrs) {',
'                elem.setAttribute(key, attrs[key]);',
'            }',
'',
'            return elem',
'        }',
'        ',
unistr('        //Atribuo o layout para o bot\00E3o de apagar'),
'        setAttributesNode(',
'            buttonClearFilter, ',
'            {',
'                "title": "Limpar Filtros",',
'                "type": "button",',
'                "class": Array.from($(buttonFilter)[0].classList).map((e) => {return e.toUpperCase().indexOf(''BUTTON'') > -1 ? e : null}).toString().toString().replaceAll('','','' ''),',
'                "style": "width: 12%; border-top-left-radius: 0px !important; border-bottom-left-radius: 0px !important; border-left: 5px solid rgba(255, 255, 255, 0) !important; height: min-content; "',
'            }',
'        )',
'',
'        //Atribuo o layout para o span do icone',
'        setAttributesNode(',
'            spanButtonClearFilter,',
'            {',
'                "class": "fa fa-eraser"',
'            }',
'        )',
'',
'        // Atribuo o evento',
'        buttonClearFilter.addEventListener(''click'', (event) => {funcaoLimpaFiltro(params)})',
'',
'        buttonClearFilter.appendChild(spanButtonClearFilter)',
'',
'        //Organizo o container para conseguir alinhar os elementos',
'        $(buttonContainer).css({''display'':''flex'', "width":"100%"})',
'',
unistr('        //Estilizo o bot\00E3o de filtros'),
'        $(buttonFilter).css({"border-top-right-radius": "0px", "border-bottom-right-radius": "0px"})',
'',
unistr('        //Adiciono o bot\00E3o de limpar filtros na tela'),
'        $(buttonContainer).append(buttonClearFilter)',
'        ',
'    }~'';',
'',
'    RETURN L_RESULT;',
'END;'))
,p_api_version=>2
,p_render_function=>'FILTER_CONTROL'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_version_identifier=>'1.0'
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(172592091584403648)
,p_plugin_id=>wwv_flow_api.id(172591801581389481)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'Selector JS - Button Filter'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'#buttonFilter'
,p_is_translatable=>false
,p_help_text=>unistr('Defina o seletor para o bot\00E3o aplicar filtros')
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(172592356305414307)
,p_plugin_id=>wwv_flow_api.id(172591801581389481)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>20
,p_prompt=>'Parameters Button Clear'
,p_attribute_type=>'JAVASCRIPT'
,p_is_required=>true
,p_default_value=>wwv_flow_string.join(wwv_flow_t_varchar2(
'{',
'    "funcaoLimpaFiltro": () => {',
'        //Array do itens para voltar os valores default',
'        const arrItem = [',
'            ''P246_EMPRESA'', ',
'            ''P246_TIPO_PERIODO'', ',
'            ''P246_DATA_INICIO'', ',
'            ''P246_DATA_FIM'', ',
'            ''P246_CONTAS_PAGAR'', ',
'            ''P246_TITULO'', ',
'            ''P246_DOCUMENTO'', ',
'            ''P246_PEDIDO_COMPRA'', ',
'            ''P246_CONTA'', ',
'            ''P246_CENTRO_CUSTO'', ',
'            ''P246_CATEGORIA'', ',
'            ''P246_FORNECEDOR'', ',
'            ''P246_ORIGEM'', ',
'            ''P246_CONFERIDO'', ',
'            ''P246_DE'', ',
'            ''P246_ATE'', ',
'            ''P246_EFETUADO_EM''',
'        ] ',
'        ',
'        arrItem.forEach((e) => {',
'',
'            switch (apex.item(e).item_type) {                ',
'                //Valor Default Data Item',
'                case "OJ-INPUT-DATE": {',
'                    apex.item(e).reinit(apex.item(e)._initialValue)',
'                    break',
'                }',
'                case "SELECT": {',
'                    apex.item(e).setValue(apex.item(e).nullValue)',
'                    break',
'                }',
'                case "POPUP_KEY_LOV": {',
'                    apex.item(e).refresh()',
'                    break',
'                }',
'                case "NUMBER": {',
'                    apex.item(e).setValue(apex.item(e)._min)',
'                    break',
'                }',
'',
'            }',
'        ',
'        })',
'    }',
'}'))
,p_is_translatable=>false
,p_help_text=>unistr('Defina a fun\00E7\00E3o que ser\00E1 executada quando clicar no bot\00E3o de limpar filtros criado pelo plugin')
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
