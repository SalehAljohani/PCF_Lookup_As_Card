# PCF - Lookup As Card  
A PCF control that transforms a lookup field into a card view, while retaining the lookup field functionality elsewhere on the form.

## Overview  
This PCF control is a fork of the [PCF_GridCard](https://github.com/jasonaalmeida/PCF_GridCard) by jasonaalmeida. It has been heavily modified to render a lookup field as a card, allowing enhanced display and usability while keeping the original lookup available for search functionality.

From the user's perspective, this provides a visually rich and informative way to view lookup-related data directly on the form without relying on traditional grid displays.

---

### Key Features  
- **Card View for Lookup Field**: Transforms a lookup field into a card display while maintaining a duplicate lookup for standard search functionality.  
- **System View Integration**: Allows specifying a system view to customize the data displayed in the card.  
- **Customizable Display**: Modify the system view to change the appearance and content of the card.  
- **Dynamic and Flexible**: Suitable for forms where lookup data needs to be highlighted in an enhanced, visually appealing format.

---

### Configuration  

1. **Duplicate the Lookup Field**: Add the same lookup field twice to your form.  
2. **Assign the Control**: Use the standard lookup for search and attach the `Lookup As Card` PCF to the duplicate field.  
3. **Customize the System View**:  
   - Define the logical name of the system view to use for retrieving and displaying data.  
   - Modify the system view to adjust the card's content.  
4. **Set Parameters**: Configure required parameters, such as the system view name and logical field names, in the control settings.  

---

### Current Status (Version 1.17)  
The `Lookup As Card` PCF is in a stable state and ready for use but requires further refinement to reach its final version. Contributions and feedback are welcome.  

---
