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
--   Date and Time:   17:14 Segunda-Feira Janeiro 30, 2023
--   Exported By:     BEEASY.GABRIEL
--   Flashback:       0
--   Export Type:     Component Export
--   Manifest
--     PLUGIN: 130629223507043682
--   Manifest End
--   Version:         21.1.3
--   Instance ID:     649842172119056
--

begin
  -- replace components
  wwv_flow_api.g_mode := 'REPLACE';
end;
/
prompt --application/shared_components/plugins/dynamic_action/zmb_dynref
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(130629223507043682)
,p_plugin_type=>'DYNAMIC ACTION'
,p_name=>'ZMB.DYNREF'
,p_display_name=>'Dynamic Refresh - With JS CallBack'
,p_category=>'INIT'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_javascript_file_urls=>'#PLUGIN_FILES#JS/dynamicRefresh.js'
,p_plsql_code=>wwv_flow_string.join(wwv_flow_t_varchar2(
'FUNCTION DYNAMIC_REFRESH (',
'    P_DYNAMIC_ACTION    IN APEX_PLUGIN.T_DYNAMIC_ACTION,',
'    P_PLUGIN            IN APEX_PLUGIN.T_PLUGIN',
'',
')',
'RETURN APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT',
'IS',
'    L_RESULT                APEX_PLUGIN.T_DYNAMIC_ACTION_RENDER_RESULT; ',
'BEGIN',
'    ',
'    L_RESULT.JAVASCRIPT_FUNCTION := ''() => {',
'        let arrayParam = '' || P_DYNAMIC_ACTION.ATTRIBUTE_02 || ''',
'        ',
'        try {',
'            regionVisibility( ',
'                Array.from(arrayParam), '' || P_DYNAMIC_ACTION.ATTRIBUTE_01 || ',
'            '') ',
'        } catch (e) {',
'            throw ''''Parameter "Array Elements" is not a Array, verify your code''''',
'        }',
'    }'';',
'',
'    RETURN L_RESULT;',
'END;'))
,p_api_version=>2
,p_render_function=>'DYNAMIC_REFRESH'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_version_identifier=>'1.0'
,p_about_url=>'https://github.com/GabrielZambonidaSilva/pluginsOracleApex/tree/main/dynamicRefresh-withJSCallback'
,p_files_version=>3
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(130632711255103633)
,p_plugin_id=>wwv_flow_api.id(130629223507043682)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'CallBack Javascript Code'
,p_attribute_type=>'JAVASCRIPT'
,p_is_required=>true
,p_default_value=>wwv_flow_string.join(wwv_flow_t_varchar2(
'/*',
'    parameter e is a object:',
'    [',
'        {',
'            "region": "IRR1",',
'            "visible": true',
'        },',
'        {',
'            "region": "IRR2",',
'            "visible": false',
'        }',
'    ]',
'',
'*/',
'(e) => {',
'    // Iterable in "e" Array Object',
'    e.forEach((e) => {',
'        let elem = document.getElementById(e.region)',
'        ',
'        if (e.visible && !elem.hasAttribute(''refreshprop'')){',
'            apex.region(elem.id).refresh()',
'            elem.setAttribute(''refreshprop'', true)',
'        }                     ',
'    })',
'}',
''))
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_is_translatable=>false
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(130649740593382182)
,p_plugin_id=>wwv_flow_api.id(130629223507043682)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>5
,p_prompt=>'Selector Elements - Array Type'
,p_attribute_type=>'TEXT'
,p_is_required=>true
,p_default_value=>'document.querySelectorAll(''[data-lazy]'')'
,p_supported_ui_types=>'DESKTOP:JQM_SMARTPHONE'
,p_is_translatable=>false
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '66756E6374696F6E20726567696F6E5669736962696C69747928617272456C656D2C2063616C6C4261636B46756E6329207B0D0A202020200D0A20202020636F6E737420697356697369626C65203D20286964456C656D29203D3E207B0D0A2020202020';
wwv_flow_api.g_varchar2_table(2) := '2020206C657420656C656D203D20646F63756D656E742E676574456C656D656E7442794964286964456C656D290D0A202020202020202072657475726E20656C656D2E676574426F756E64696E67436C69656E745265637428292E746F70203C2077696E';
wwv_flow_api.g_varchar2_table(3) := '646F772E696E6E657248656967687420262620656C656D2E676574426F756E64696E67436C69656E745265637428292E626F74746F6D203E2030200D0A202020207D0D0A202020200D0A2020202077696E646F772E6164644576656E744C697374656E65';
wwv_flow_api.g_varchar2_table(4) := '7228277363726F6C6C272C202829203D3E207B0D0A20202020202020206C657420617272456C656D50726F70203D205B5D0D0A0D0A2020202020202020617272456C656D2E666F72456163682865203D3E200D0A20202020202020202020202061727245';
wwv_flow_api.g_varchar2_table(5) := '6C656D50726F702E70757368280D0A202020202020202020202020202020207B0D0A202020202020202020202020202020202020202022726567696F6E223A20652E69642C0D0A20202020202020202020202020202020202020202276697369626C6522';
wwv_flow_api.g_varchar2_table(6) := '3A20697356697369626C6528652E6964290D0A202020202020202020202020202020207D0D0A202020202020202020202020290D0A2020202020202020290D0A0D0A202020202020202063616C6C4261636B46756E6328617272456C656D50726F70290D';
wwv_flow_api.g_varchar2_table(7) := '0A202020207D293B0D0A0D0A202020200D0A7D0D0A0D0A0D0A';
null;
end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(130634815961144156)
,p_plugin_id=>wwv_flow_api.id(130629223507043682)
,p_file_name=>'JS/dynamicRefresh.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
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
