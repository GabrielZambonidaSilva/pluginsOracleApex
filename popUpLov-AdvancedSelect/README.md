##POPUp Lov - AdvancedSelection
---
Dependencies:
   - formatLov.css
   - jquery.mask.js
   - formatLov.js

How to use:
   - Dynamic Action:
        Access the global page and create a dynamic action with the following parameters:
        - Event: Page Load
        - True: Action > Execute > LOV - AdvancedSelection
        - Fire on Initialization: true

   - Creating LovPopUp:
        - The Item must be MultiValues ​​for the checkBox and Group functions to be added
        - Advanced -> Classes (Add):
            - organizeMenuLov:
            This Class organizes the children within the menus
            - menuSelectChild:
            This Class enables the click on the menu so that the children are selected simultaneously

        - List of Values ​​(Query Example):

   ```sql
            select 
                '<groupRow> group ' ||
                    case when rownum <= 5 then 1 else 2 end ||
                '</groupRow> line ' || ROWNUM D,
                ROWNUM R
            from dual 
                connect by rownum <= 10
   ```
        
   
   