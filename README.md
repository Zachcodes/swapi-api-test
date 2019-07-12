# People

The endpoint will allow you to pass a sortBy query param that will sort by name, height or mass. If by height or mass, unknown values will be sorted to the bottom.

# Planets

Planets is optimized, although not quite as far as it could be. If optimization was of the essence, I'd alter the function to be making calls for residents in between axios calls to concat planet values. It is optimized though in the sense that the calls to get residents is added to a promise array and handled by Promise.all saving time.

# Notes 

The calls to get both planets and people are done with recursion as this allows for use of 1 function and saves space.

Since the repo specifically stated to build for the task at hand at keep it simple, no error handling was added although in all real production apps I build that into the code. 