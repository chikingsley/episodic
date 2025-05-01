// Remove Duplicate Keys by Paul Tuerslay http://aenhancers.com/viewtopic.php?f=11&t=2166

var activeItem = app.project.activeItem;

if (activeItem != null && activeItem instanceof CompItem) {
   var selectedProps = activeItem.selectedProperties;
   var y;
   
   app.beginUndoGroup("Remove Duplicate Keys");
   for (var x = 0; x < selectedProps.length; x++) {

      if (selectedProps[x].numKeys > 1) {      
         y = 1;
         while (y < selectedProps[x].numKeys) {
            if (selectedProps[x].keyValue(y).toString() == selectedProps[x].keyValue(y+1).toString()) {
               selectedProps[x].removeKey(y+1);
            } else {      
               y ++;
            }
         }
      }
   }
   app.endUndoGroup();
}