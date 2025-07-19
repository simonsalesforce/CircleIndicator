# CircleIndicator
A Generic LWC which creates circle indicators with count variables and labels. Selected circle can be used for component visibility


Notes:

The number of circles is decided by the number of individual values in the CircleCounts variable

CircleCounts is A comma-separated string of count values to show inside each circle. Use a Text Template (Plain Text), and enter something like: {!Count1},{!ContactCount},{!OtherCount}


Variables:

Circle Labels: Comma Seperated list of labels which appear in the circles from left to right
Circle Counts: Comma Seperated list of numbers (counts) which appear in the circles from left to right
Visibility Keys: Comma Seperated list of words which can be used for component visibility for each circle from left to right
DefaultKeyPriorityList: Comma Seperated list of the visibility Keys. Choose the order of the default selection. IF that circle has a value of 0 it moves to the next in the list
enablePulse: Boolean - Enables a pulse animation on circles
actionNeededKeys:  Comma-separated list of visibility keys that should display 'Action needed' under the circle if the count is greater than 0"