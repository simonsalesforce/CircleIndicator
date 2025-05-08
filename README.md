# CircleIndicator
A Generic LWC which creates circle indicators with count variables and labels. Selected circle can be used for component visibility


Notes:

The number of circles is decided by the number of individual values in the CircleCounts variable

CircleCounts variable should be filled with a Formula Text variable with the following format:
TEXT({!Count_variable1}) & "," & TEXT({!countvariable2}) & "," & TEXT({!countvariable3})

