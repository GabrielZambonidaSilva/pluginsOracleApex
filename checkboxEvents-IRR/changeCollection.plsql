DECLARE
    V_TYPE              APEX_APPLICATION.G_X01%TYPE := APEX_APPLICATION.G_X01;
    V_SEQ_ID            INTEGER;
    V_COLLECTION_NAME   VARCHAR2(250);
    V_IDS               CLOB;
    V_IDS_LIST          CLOB;
    V_C001              VARCHAR2(1000);
    V_ARR               APEX_APPLICATION.G_F01%TYPE := APEX_APPLICATION.G_F01;
    V_ARR_CLOB          CLOB;


    V_JSON_ARR          JSON_ARRAY_T;
    V_JSON_ARR_IDS      JSON_ARRAY_T;
    V_JSON_OBJ          JSON_OBJECT_T;

    V_JSON_RESPONSE     JSON_OBJECT_T := NEW JSON_OBJECT_T;
    V_JSON_ARR_RESPONSE JSON_ARRAY_T := NEW JSON_ARRAY_T;


BEGIN
    /* ZMB
        13/09/2023 11:39
        ADICIONADO A CONCATENAÇÃO DOS VALORES, POIS QUANDO ESTOURA LIMITE ELE MANDA EM OUTRO INDICE DO ARRAY
    ZMB */

    FOR I IN 1..V_ARR.COUNT LOOP
        V_ARR_CLOB := V_ARR_CLOB || V_ARR(I);
    END LOOP;

    -->> VERIFICO O TIPO DE SOLICITAÇÃO
    IF UPPER(V_TYPE) = 'CREATE' THEN
        V_JSON_ARR := JSON_ARRAY_T(
            -- V_ARR(1)
            V_ARR_CLOB
        );
        
        FOR I IN 0..V_JSON_ARR.GET_SIZE - 1 LOOP
            V_JSON_OBJ := JSON_OBJECT_T(V_JSON_ARR.GET(I));
            -->> VALIDO SE A COLLECTION EXISTE
            IF NOT APEX_COLLECTION.COLLECTION_EXISTS(
                P_COLLECTION_NAME => V_JSON_OBJ.GET_STRING('collectionName')
            ) THEN
                APEX_COLLECTION.CREATE_COLLECTION(
                    P_COLLECTION_NAME => V_JSON_OBJ.GET_STRING('collectionName')
                );

            ELSIF UPPER(V_JSON_OBJ.GET_STRING('clearCollectionOnPageLoad')) = 'TRUE' THEN
                APEX_COLLECTION.CREATE_OR_TRUNCATE_COLLECTION(
                    P_COLLECTION_NAME => V_JSON_OBJ.GET_STRING('collectionName')
                );
            END IF;
        END LOOP;

        HTP.P(
            JSON_OBJECT(
                'sucesso'       VALUE 'Collection Inicializada com Sucesso'
            )
        );


    ELSIF UPPER(V_TYPE) = 'CHANGE' THEN
        V_JSON_ARR := JSON_ARRAY_T(
            -- V_ARR(1)
            V_ARR_CLOB
        );
        
        FOR I IN 0..V_JSON_ARR.GET_SIZE - 1 LOOP
            V_JSON_OBJ := JSON_OBJECT_T(V_JSON_ARR.GET(I));

            V_COLLECTION_NAME := UPPER(V_JSON_OBJ.GET_STRING('collectionName'));
            V_C001 := V_JSON_OBJ.GET_STRING('id');

            BEGIN
                SELECT 
                    SEQ_ID
                INTO V_SEQ_ID
                FROM APEX_COLLECTIONS
                    WHERE UPPER(COLLECTION_NAME) = V_COLLECTION_NAME
                        AND C001 = V_C001;

                APEX_COLLECTION.DELETE_MEMBER(
                    P_COLLECTION_NAME => V_COLLECTION_NAME,
                    P_SEQ => V_SEQ_ID
                );
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    NULL;
                WHEN OTHERS THEN
                     NULL;
            END;

            
            
            IF UPPER(V_JSON_OBJ.GET_STRING('checked')) = 'TRUE' THEN
                BEGIN
                    APEX_COLLECTION.ADD_MEMBER(
                        P_COLLECTION_NAME => V_COLLECTION_NAME,
                        P_C001 => V_C001
                    );
                EXCEPTION
                    WHEN OTHERS THEN
                        NULL;
                END;
            END IF;
        END LOOP;

        HTP.P(
            JSON_OBJECT(
                'sucesso'    VALUE 'Collection Atualizada - ' || V_JSON_ARR.GET_SIZE || ' Itens'
            )
        );

    -->> Devolvo um array com todos os que estão na página e contém na collection
    ELSIF UPPER(V_TYPE) = 'LIST' THEN
        V_JSON_ARR := JSON_ARRAY_T(
            -- V_ARR(1)
            V_ARR_CLOB
        );

        FOR I IN 0..V_JSON_ARR.GET_SIZE - 1 LOOP
            V_JSON_OBJ := JSON_OBJECT_T(V_JSON_ARR.GET(I));

            V_COLLECTION_NAME := UPPER(V_JSON_OBJ.GET_STRING('collectionName'));
            V_IDS := V_JSON_OBJ.GET_ARRAY('ids').TO_CLOB;
            
            BEGIN
                SELECT
                    JSON_ARRAYAGG(
                        C001
                    )
                INTO V_IDS_LIST
                FROM APEX_COLLECTIONS
                    WHERE UPPER(COLLECTION_NAME) = V_COLLECTION_NAME
                     AND C001 IN (
                         SELECT COLUMN_VALUE FROM APEX_STRING.SPLIT(REPLACE(REPLACE(REPLACE(V_IDS,'[',''),']',''),'"',''), ',')
                     );
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    NULL;
            END;

        
            V_JSON_ARR_RESPONSE.APPEND(
                JSON_OBJECT_T(
                    JSON_OBJECT(
                        'collectionName'        VALUE V_JSON_OBJ.GET_STRING('collectionName'),
                        'ids'                   VALUE  V_IDS_LIST
                    )
                )
            );

        END LOOP;

        htp.p(
            V_JSON_ARR_RESPONSE.TO_CLOB
        );
    
    -->> DELETE MEMBERS COLLECTION
    ELSIF UPPER(V_TYPE) = 'DELETE' THEN
        V_JSON_OBJ := JSON_OBJECT_T.PARSE(
            -- V_ARR(1)
            V_ARR_CLOB
        );

        V_COLLECTION_NAME := V_JSON_OBJ.GET_STRING('collectionName');

        FOR I IN (
            SELECT SEQ_ID FROM APEX_COLLECTIONS 
                WHERE UPPER(COLLECTION_NAME) = UPPER(V_COLLECTION_NAME)
        ) LOOP
            APEX_COLLECTION.DELETE_MEMBER(
                P_COLLECTION_NAME => V_COLLECTION_NAME,
                P_SEQ => I.SEQ_ID
            );
        END LOOP;

        HTP.P(
            JSON_OBJECT(
                'collectionName'        VALUE V_COLLECTION_NAME,
                'sucesso'               VALUE 'Deletado todos os membros'
            )
        );
    END IF;


EXCEPTION 
    WHEN OTHERS THEN
        ROLLBACK;
        HTP.P(
            JSON_OBJECT(
                'erro'      VALUE 'Erro ao realizar operação',
                'trace'     VALUE DBMS_UTILITY.FORMAT_ERROR_BACKTRACE,
                'back'      VALUE SQLERRM
            )
        );
END;